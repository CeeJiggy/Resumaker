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

const Projects = ({ projects, onUpdate, user, presets = [], resumeData }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPreset, setSelectedPreset] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    // Initialize selectedPreset from resumeData when presets are loaded
    useEffect(() => {
        if (presets.length > 0) {
            const currentPreset = resumeData.config.selectedPresets?.projects || presets[0].name;
            setSelectedPreset(currentPreset);
            setIsLoading(false);
        }
    }, [presets, resumeData.config.selectedPresets]);

    const handleSavePreset = async (presetName) => {
        const preset = {
            name: presetName,
            value: projects
        };
        try {
            await savePreset(user.uid, 'projects', preset);
            if (onUpdate) {
                onUpdate({ type: 'REFRESH_PRESETS', section: 'projects' });
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
            onUpdate({ type: 'UPDATE_PROJECTS', value: selectedPreset.value });
        }
    };

    const handleDeletePreset = async () => {
        if (!selectedPreset || presets.length <= 1) return;

        try {
            await deletePreset(user.uid, 'projects', selectedPreset);

            // Select the first available preset after deletion
            const remainingPresets = presets.filter(p => p.name !== selectedPreset);
            if (remainingPresets.length > 0) {
                setSelectedPreset(remainingPresets[0].name);
                onUpdate({ type: 'UPDATE_PROJECTS', value: remainingPresets[0].value });
            }

            onUpdate({ type: 'REFRESH_PRESETS', section: 'projects' });
        } catch (error) {
            console.error('Error deleting preset:', error);
        }
    };

    const handleAddProject = () => {
        const newProjects = [
            ...projects,
            {
                name: '',
                role: '',
                description: ''
            }
        ];
        onUpdate({ type: 'UPDATE_PROJECTS', value: newProjects });
    };

    const handleDeleteProject = (index) => {
        const newProjects = projects.filter((_, i) => i !== index);
        onUpdate({ type: 'UPDATE_PROJECTS', value: newProjects });
    };

    const handleProjectChange = (index, field, value) => {
        const newProjects = [...projects];
        newProjects[index][field] = value;
        onUpdate({ type: 'UPDATE_PROJECTS', value: newProjects });
    };

    return (
        <Box>
            <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                <Typography variant="h6">Projects</Typography>
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

            {projects.map((project, index) => (
                <Box key={index} sx={{ mb: 4, position: 'relative' }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Project Name"
                                value={project.name}
                                onChange={(e) => handleProjectChange(index, 'name', e.target.value)}
                                disabled={isLoading}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Role"
                                value={project.role}
                                onChange={(e) => handleProjectChange(index, 'role', e.target.value)}
                                disabled={isLoading}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                multiline
                                rows={4}
                                label="Description"
                                value={project.description}
                                onChange={(e) => handleProjectChange(index, 'description', e.target.value)}
                                disabled={isLoading}
                            />
                        </Grid>
                    </Grid>
                    <IconButton
                        onClick={() => handleDeleteProject(index)}
                        sx={{ position: 'absolute', top: -20, right: -20 }}
                        disabled={isLoading}
                    >
                        <DeleteIcon />
                    </IconButton>
                </Box>
            ))}

            <Button
                startIcon={<AddIcon />}
                onClick={handleAddProject}
                variant="outlined"
                fullWidth
                sx={{ mt: 2 }}
                disabled={isLoading}
            >
                Add Project
            </Button>

            <SavePresetModal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSavePreset}
                existingPresets={presets}
                title="Save Project Preset"
            />
        </Box>
    );
};

export default Projects; 