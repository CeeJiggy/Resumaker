import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Typography,
    TextField,
    IconButton,
    Grid,
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

const Education = ({ education, onUpdate, user, presets = [], resumeData }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPreset, setSelectedPreset] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    // Initialize selectedPreset from resumeData when presets are loaded
    useEffect(() => {
        if (presets.length > 0) {
            const currentPreset = resumeData.config.selectedPresets?.education || presets[0].name;
            setSelectedPreset(currentPreset);
            setIsLoading(false);
        }
    }, [presets, resumeData.config.selectedPresets]);

    const handleSavePreset = async (presetName) => {
        const preset = {
            name: presetName,
            value: education
        };
        try {
            await savePreset(user.uid, 'education', preset);
            if (onUpdate) {
                onUpdate({ type: 'REFRESH_PRESETS', section: 'education' });
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
            onUpdate({ type: 'UPDATE_EDUCATION', value: selectedPreset.value });
        }
    };

    const handleDeletePreset = async () => {
        if (!selectedPreset || presets.length <= 1) return;

        try {
            await deletePreset(user.uid, 'education', selectedPreset);

            // Select the first available preset after deletion
            const remainingPresets = presets.filter(p => p.name !== selectedPreset);
            if (remainingPresets.length > 0) {
                setSelectedPreset(remainingPresets[0].name);
                onUpdate({ type: 'UPDATE_EDUCATION', value: remainingPresets[0].value });
            }

            onUpdate({ type: 'REFRESH_PRESETS', section: 'education' });
        } catch (error) {
            console.error('Error deleting preset:', error);
        }
    };

    const handleAddEducation = () => {
        const newEducation = [
            ...education,
            {
                institution: '',
                degree: '',
                year: ''
            }
        ];
        onUpdate({ type: 'UPDATE_EDUCATION', value: newEducation });
    };

    const handleDeleteEducation = (index) => {
        const newEducation = education.filter((_, i) => i !== index);
        onUpdate({ type: 'UPDATE_EDUCATION', value: newEducation });
    };

    const handleEducationChange = (index, field, value) => {
        const newEducation = [...education];
        newEducation[index][field] = value;
        onUpdate({ type: 'UPDATE_EDUCATION', value: newEducation });
    };

    return (
        <Box>
            <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                <Typography variant="h6">Education</Typography>
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

            {education.map((edu, index) => (
                <Box key={index} sx={{ mb: 4, position: 'relative' }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Institution"
                                value={edu.institution}
                                onChange={(e) => handleEducationChange(index, 'institution', e.target.value)}
                                disabled={isLoading}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Degree"
                                value={edu.degree}
                                onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                                disabled={isLoading}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Year"
                                value={edu.year}
                                onChange={(e) => handleEducationChange(index, 'year', e.target.value)}
                                disabled={isLoading}
                            />
                        </Grid>
                    </Grid>
                    <IconButton
                        onClick={() => handleDeleteEducation(index)}
                        sx={{ position: 'absolute', top: -20, right: -20 }}
                        disabled={isLoading}
                    >
                        <DeleteIcon />
                    </IconButton>
                </Box>
            ))}

            <Button
                startIcon={<AddIcon />}
                onClick={handleAddEducation}
                variant="outlined"
                fullWidth
                sx={{ mt: 2 }}
                disabled={isLoading}
            >
                Add Education
            </Button>

            <SavePresetModal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSavePreset}
                existingPresets={presets}
                title="Save Education Preset"
            />
        </Box>
    );
};

export default Education; 