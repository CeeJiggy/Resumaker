import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Typography,
    TextField,
    IconButton,
    Grid,
    FormControlLabel,
    Checkbox,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Stack,
    CircularProgress,
    Switch,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import { savePreset, deletePreset } from '../services/firestore';
import SavePresetModal from './SavePresetModal';

const Experience = ({
    experience,
    onUpdate,
    onExperienceChange,
    onExperienceBlur,
    onAddExperience,
    user,
    presets = [],
    resumeData
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPreset, setSelectedPreset] = useState('current');
    const [isLoading, setIsLoading] = useState(false);

    // Initialize selectedPreset from resumeData when presets are loaded
    useEffect(() => {
        if (presets.length > 0) {
            const currentPreset = resumeData.config.selectedPresets?.experience || presets[0].name;
            setSelectedPreset(currentPreset);
        } else {
            setSelectedPreset('current');
        }
        setIsLoading(false);
    }, [presets, resumeData.config.selectedPresets]);

    const handleSavePreset = async (presetName) => {
        const preset = {
            name: presetName,
            value: experience
        };
        try {
            await savePreset(user.uid, 'experience', preset);
            if (onUpdate) {
                onUpdate({ type: 'REFRESH_PRESETS', section: 'experience' });
            }
        } catch (error) {
            console.error('Error saving preset:', error);
        }
    };

    const handlePresetSelect = (event) => {
        const presetName = event.target.value;
        setSelectedPreset(presetName);

        const selectedPreset = presets.find(p => p.name === presetName);
        if (selectedPreset) {
            onUpdate({ type: 'UPDATE_EXPERIENCE', value: selectedPreset.value });
        }
    };

    const handleDeletePreset = async () => {
        if (!selectedPreset || presets.length <= 1) return;

        try {
            await deletePreset(user.uid, 'experience', selectedPreset);

            // Select the first available preset after deletion
            const remainingPresets = presets.filter(p => p.name !== selectedPreset);
            if (remainingPresets.length > 0) {
                setSelectedPreset(remainingPresets[0].name);
                onUpdate({ type: 'UPDATE_EXPERIENCE', value: remainingPresets[0].value });
            }

            onUpdate({ type: 'REFRESH_PRESETS', section: 'experience' });
        } catch (error) {
            console.error('Error deleting preset:', error);
        }
    };

    const handleExperienceChange = (index, field, value) => {
        if (onExperienceChange) {
            onExperienceChange(index, field, value);
        }
    };

    const handleAddExperience = () => {
        if (onAddExperience) {
            onAddExperience();
        }
    };

    const handleDeleteExperience = (index) => {
        const newExperience = experience.filter((_, i) => i !== index);
        onUpdate({ type: 'UPDATE_EXPERIENCE', value: newExperience });
    };

    return (
        <Box>
            <Stack direction="row" spacing={2} alignItems="center" mb={2}
                sx={{
                    flexWrap: 'wrap',
                    gap: 1,
                    '& > *': {
                        mb: { xs: 1, sm: 0 }
                    }
                }}>
                <Typography variant="h6">Experience</Typography>
                <FormControl sx={{
                    minWidth: { xs: '100%', sm: 200 },
                    flex: { xs: '1 1 100%', sm: '0 1 auto' }
                }}>
                    <InputLabel>Select Preset</InputLabel>
                    <Select
                        value={selectedPreset}
                        onChange={handlePresetSelect}
                        label="Select Preset"
                    >
                        <MenuItem value="current">Current Values</MenuItem>
                        {presets.map((preset) => (
                            <MenuItem key={preset.name} value={preset.name}>
                                {preset.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Box sx={{
                    display: 'flex',
                    gap: 1,
                    flex: { xs: '1 1 100%', sm: '0 1 auto' },
                    justifyContent: { xs: 'flex-start', sm: 'center' }
                }}>
                    {selectedPreset && selectedPreset !== 'current' && (
                        <IconButton
                            onClick={handleDeletePreset}
                            disabled={!user || presets.length <= 1}
                            color="error"
                            size="small"
                        >
                            <DeleteIcon />
                        </IconButton>
                    )}
                    <Button
                        variant="outlined"
                        startIcon={<SaveIcon />}
                        onClick={() => setIsModalOpen(true)}
                        disabled={!user}
                    >
                        Save as Preset
                    </Button>
                </Box>
            </Stack>

            {experience.map((job, index) => (
                <Box key={index}>
                    <Box sx={{
                        position: 'relative',
                        p: 3,
                        mb: 2,
                        backgroundColor: 'background.paper',
                        borderRadius: 1,
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                        border: '1px solid',
                        borderColor: 'divider'
                    }}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} container spacing={2}>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Company"
                                        value={job.company}
                                        onChange={(e) => handleExperienceChange(index, 'company', e.target.value)}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Position"
                                        value={job.position}
                                        onChange={(e) => handleExperienceChange(index, 'position', e.target.value)}
                                    />
                                </Grid>
                            </Grid>

                            <Grid item xs={12}>
                                <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                                    Duration
                                </Typography>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={6} container spacing={2}>
                                        <Grid item xs={6}>
                                            <TextField
                                                fullWidth
                                                label="Start Month"
                                                value={job.startDate.month}
                                                onChange={(e) => handleExperienceChange(index, 'startDate.month', e.target.value)}
                                            />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <TextField
                                                fullWidth
                                                label="Start Year"
                                                value={job.startDate.year}
                                                onChange={(e) => handleExperienceChange(index, 'startDate.year', e.target.value)}
                                            />
                                        </Grid>
                                    </Grid>
                                    <Grid item xs={12} md={6} container spacing={2} alignItems="center">
                                        <Grid item xs={5}>
                                            <TextField
                                                fullWidth
                                                label="End Month"
                                                value={job.endDate.month}
                                                onChange={(e) => handleExperienceChange(index, 'endDate.month', e.target.value)}
                                                disabled={job.isCurrentJob}
                                            />
                                        </Grid>
                                        <Grid item xs={5}>
                                            <TextField
                                                fullWidth
                                                label="End Year"
                                                value={job.endDate.year}
                                                onChange={(e) => handleExperienceChange(index, 'endDate.year', e.target.value)}
                                                disabled={job.isCurrentJob}
                                            />
                                        </Grid>
                                        <Grid item xs={2}>
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        checked={job.isCurrentJob}
                                                        onChange={(e) => handleExperienceChange(index, 'isCurrentJob', e.target.checked)}
                                                    />
                                                }
                                                label="Current"
                                                sx={{
                                                    mt: { xs: 1, sm: 0 },
                                                    ml: { xs: -1, sm: -2 }
                                                }}
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>

                            <Grid item xs={12} sx={{ width: '100%' }}>
                                <Box sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    mb: 1
                                }}>
                                    <Typography variant="subtitle2" color="textSecondary">
                                        Job Description
                                    </Typography>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={job.descriptionFormat === 'bullets'}
                                                onChange={(e) => handleExperienceChange(index, 'descriptionFormat', e.target.checked ? 'bullets' : 'paragraph')}
                                            />
                                        }
                                        label="Bullet Points"
                                    />
                                </Box>
                                {job.descriptionFormat === 'bullets' ? (
                                    <TextField
                                        fullWidth
                                        multiline
                                        rows={8}
                                        placeholder="• Use bullet points to highlight key responsibilities and achievements...
• Start each point with a strong action verb...
• Quantify achievements where possible..."
                                        value={job.description}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            // Ensure each line starts with a bullet point
                                            const formattedValue = value.split('\n')
                                                .map(line => line.trim())
                                                .map(line => line.startsWith('•') ? line : `• ${line}`)
                                                .join('\n');
                                            handleExperienceChange(index, 'description', formattedValue);
                                        }}
                                        sx={{
                                            '& .MuiInputBase-root': {
                                                backgroundColor: 'background.default'
                                            }
                                        }}
                                    />
                                ) : (
                                    <TextField
                                        fullWidth
                                        multiline
                                        rows={8}
                                        placeholder="Describe your responsibilities and achievements..."
                                        value={job.description}
                                        onChange={(e) => handleExperienceChange(index, 'description', e.target.value)}
                                        sx={{
                                            '& .MuiInputBase-root': {
                                                backgroundColor: 'background.default'
                                            }
                                        }}
                                    />
                                )}
                            </Grid>
                        </Grid>
                        <IconButton
                            onClick={() => handleDeleteExperience(index)}
                            sx={{
                                position: 'absolute',
                                top: 8,
                                right: 8,
                                bgcolor: 'background.paper',
                                '&:hover': {
                                    bgcolor: 'error.light',
                                    color: 'error.contrastText'
                                }
                            }}
                        >
                            <DeleteIcon />
                        </IconButton>
                    </Box>
                    {index < experience.length - 1 && (
                        <Box sx={{ my: 3, borderBottom: '2px solid', borderColor: 'divider' }} />
                    )}
                </Box>
            ))}

            <Button
                startIcon={<AddIcon />}
                onClick={handleAddExperience}
                variant="outlined"
                fullWidth
                sx={{
                    mt: 4,
                    mb: 2,
                    py: 1.5,
                    backgroundColor: 'background.paper'
                }}
            >
                Add Experience
            </Button>

            <SavePresetModal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSavePreset}
                existingPresets={presets}
                title="Save Experience Preset"
            />
        </Box>
    );
};

export default Experience; 