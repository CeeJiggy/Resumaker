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
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import { savePreset, deletePreset } from '../services/firestore';
import SavePresetModal from './SavePresetModal';

const Experience = ({ experience, onUpdate, user, presets = [], resumeData }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPreset, setSelectedPreset] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    // Initialize selectedPreset from resumeData when presets are loaded
    useEffect(() => {
        if (presets.length > 0) {
            const currentPreset = resumeData.config.selectedPresets?.experience || presets[0].name;
            setSelectedPreset(currentPreset);
            setIsLoading(false);
        }
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

    const handleAddExperience = () => {
        const newExperience = [
            ...experience,
            {
                company: '',
                position: '',
                startDate: { month: '', year: '' },
                endDate: { month: '', year: '' },
                isCurrentJob: false,
                description: ''
            }
        ];
        onUpdate({ type: 'UPDATE_EXPERIENCE', value: newExperience });
    };

    const handleDeleteExperience = (index) => {
        const newExperience = experience.filter((_, i) => i !== index);
        onUpdate({ type: 'UPDATE_EXPERIENCE', value: newExperience });
    };

    const handleExperienceChange = (index, field, value) => {
        const newExperience = [...experience];
        if (field.includes('.')) {
            const [parent, child] = field.split('.');
            newExperience[index][parent] = {
                ...newExperience[index][parent],
                [child]: value
            };
        } else {
            newExperience[index][field] = value;
        }
        onUpdate({ type: 'UPDATE_EXPERIENCE', value: newExperience });
    };

    return (
        <Box>
            <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                <Typography variant="h6">Experience</Typography>
                <FormControl sx={{ minWidth: 200 }}>
                    <InputLabel>Select Preset</InputLabel>
                    <Select
                        value={selectedPreset}
                        onChange={handlePresetSelect}
                        label="Select Preset"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <MenuItem value="">
                                <CircularProgress size={20} />
                            </MenuItem>
                        ) : (
                            presets.map((preset) => (
                                <MenuItem key={preset.name} value={preset.name}>
                                    {preset.name}
                                </MenuItem>
                            ))
                        )}
                    </Select>
                </FormControl>
                {selectedPreset && (
                    <IconButton
                        onClick={handleDeletePreset}
                        disabled={!user || presets.length <= 1 || isLoading}
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
                    disabled={!user || isLoading}
                >
                    Save as Preset
                </Button>
            </Stack>

            {experience.map((job, index) => (
                <Box key={index} sx={{ mb: 4, position: 'relative' }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Company"
                                value={job.company}
                                onChange={(e) => handleExperienceChange(index, 'company', e.target.value)}
                                disabled={isLoading}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Position"
                                value={job.position}
                                onChange={(e) => handleExperienceChange(index, 'position', e.target.value)}
                                disabled={isLoading}
                            />
                        </Grid>
                        <Grid item xs={6} sm={3}>
                            <TextField
                                fullWidth
                                label="Start Month"
                                value={job.startDate.month}
                                onChange={(e) => handleExperienceChange(index, 'startDate.month', e.target.value)}
                                disabled={isLoading}
                            />
                        </Grid>
                        <Grid item xs={6} sm={3}>
                            <TextField
                                fullWidth
                                label="Start Year"
                                value={job.startDate.year}
                                onChange={(e) => handleExperienceChange(index, 'startDate.year', e.target.value)}
                                disabled={isLoading}
                            />
                        </Grid>
                        <Grid item xs={6} sm={3}>
                            <TextField
                                fullWidth
                                label="End Month"
                                value={job.endDate.month}
                                onChange={(e) => handleExperienceChange(index, 'endDate.month', e.target.value)}
                                disabled={job.isCurrentJob || isLoading}
                            />
                        </Grid>
                        <Grid item xs={6} sm={3}>
                            <TextField
                                fullWidth
                                label="End Year"
                                value={job.endDate.year}
                                onChange={(e) => handleExperienceChange(index, 'endDate.year', e.target.value)}
                                disabled={job.isCurrentJob || isLoading}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={job.isCurrentJob}
                                        onChange={(e) => handleExperienceChange(index, 'isCurrentJob', e.target.checked)}
                                        disabled={isLoading}
                                    />
                                }
                                label="Current Job"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                multiline
                                rows={4}
                                label="Description"
                                value={job.description}
                                onChange={(e) => handleExperienceChange(index, 'description', e.target.value)}
                                disabled={isLoading}
                            />
                        </Grid>
                    </Grid>
                    <IconButton
                        onClick={() => handleDeleteExperience(index)}
                        sx={{ position: 'absolute', top: -20, right: -20 }}
                        disabled={isLoading}
                    >
                        <DeleteIcon />
                    </IconButton>
                </Box>
            ))}

            <Button
                startIcon={<AddIcon />}
                onClick={handleAddExperience}
                variant="outlined"
                fullWidth
                sx={{ mt: 2 }}
                disabled={isLoading}
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