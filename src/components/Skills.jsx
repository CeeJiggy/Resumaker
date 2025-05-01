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
    Snackbar,
    Alert,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import { savePreset, deletePreset } from '../services/firestore';
import SavePresetModal from './SavePresetModal';

const Skills = ({
    skills,
    onUpdate,
    onSkillsChange,
    onSkillBlur,
    onAddSkill,
    user,
    presets = [],
    resumeData
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPreset, setSelectedPreset] = useState('current');
    const [isLoading, setIsLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    // Initialize selectedPreset from resumeData when presets are loaded
    useEffect(() => {
        if (presets.length > 0) {
            const currentPreset = resumeData.config.selectedPresets?.skills || presets[0].name;
            setSelectedPreset(currentPreset);
        } else {
            setSelectedPreset('current');
        }
        setIsLoading(false);
    }, [presets, resumeData.config.selectedPresets]);

    const handleSavePreset = async (presetName) => {
        const preset = {
            name: presetName,
            value: skills
        };
        try {
            await savePreset(user.uid, 'skills', preset);
            if (onUpdate) {
                onUpdate({ type: 'REFRESH_PRESETS', section: 'skills' });
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
            onUpdate({ type: 'UPDATE_SKILLS', value: selectedPreset.value });
        }
    };

    const handleSkillChange = (index, value) => {
        if (onSkillsChange) {
            onSkillsChange(index, value);
        }
    };

    const handleAddSkill = () => {
        if (onAddSkill) {
            onAddSkill();
        }
    };

    const handleDeleteSkill = (index) => {
        const newSkills = skills.filter((_, i) => i !== index);
        if (newSkills.length === 0) {
            newSkills.push('');
        }
        onUpdate({ type: 'UPDATE_SKILLS', value: newSkills });
    };

    const handleSkillBlur = () => {
        if (onSkillBlur) {
            onSkillBlur();
        }
    };

    const handleDeletePreset = async (presetName) => {
        try {
            await deletePreset(user.uid, 'skills', presetName);

            // If we're deleting the currently selected preset, switch to 'current'
            if (selectedPreset === presetName) {
                setSelectedPreset('current');
                // Update the resume config to reflect this change
                const newSelectedPresets = {
                    ...resumeData.config.selectedPresets,
                    skills: 'current'
                };
                onUpdate({
                    type: 'UPDATE_RESUME_CONFIG',
                    value: {
                        ...resumeData.config,
                        selectedPresets: newSelectedPresets
                    }
                });
            }

            // Refresh presets
            onUpdate({ type: 'REFRESH_PRESETS', section: 'skills' });

            setSnackbar({
                open: true,
                message: 'Preset deleted successfully',
                severity: 'success'
            });
        } catch (error) {
            console.error('Error deleting preset:', error);
            setSnackbar({
                open: true,
                message: 'Error deleting preset',
                severity: 'error'
            });
        }
    };

    return (
        <Box>
            <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                <Typography variant="h6">Skills</Typography>
                <FormControl sx={{ minWidth: 200 }}>
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
                {selectedPreset && selectedPreset !== 'current' && (
                    <IconButton
                        onClick={() => handleDeletePreset(selectedPreset)}
                        disabled={!user || presets.length <= 1}
                        sx={{ color: 'error.main' }}
                    >
                        <DeleteIcon />
                    </IconButton>
                )}
                <Button
                    variant="outlined"
                    onClick={() => setIsModalOpen(true)}
                    startIcon={<SaveIcon />}
                    disabled={!user}
                >
                    Save as Preset
                </Button>
            </Stack>

            {skills.map((skill, index) => (
                <Box key={index} sx={{ mb: 2, position: 'relative' }}>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs>
                            <TextField
                                fullWidth
                                label="Skill"
                                value={skill}
                                onChange={(e) => handleSkillChange(index, e.target.value)}
                                onBlur={handleSkillBlur}
                            />
                        </Grid>
                        <Grid item>
                            <IconButton
                                onClick={() => handleDeleteSkill(index)}
                                disabled={skills.length === 1}
                            >
                                <DeleteIcon />
                            </IconButton>
                        </Grid>
                    </Grid>
                </Box>
            ))}

            <Button
                startIcon={<AddIcon />}
                onClick={handleAddSkill}
                variant="outlined"
                fullWidth
                sx={{ mt: 2 }}
            >
                Add Skill
            </Button>

            <SavePresetModal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSavePreset}
                existingPresets={presets}
                title="Save Skills Preset"
            />

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default Skills; 