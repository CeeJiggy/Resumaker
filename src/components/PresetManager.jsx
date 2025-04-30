import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    IconButton,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Typography,
    Tooltip,
    Stack,
    Snackbar,
    Alert,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import { savePreset, getPresets, deletePreset } from '../services/firestore';

/**
 * PresetManager Component
 * 
 * A reusable component that allows users to save and recall presets for various fields.
 * 
 * @param {Object} props
 * @param {string} props.fieldId - Unique identifier for the field (e.g., 'summary', 'experience-0-description')
 * @param {string} props.value - Current value of the field
 * @param {Function} props.onValueChange - Function to call when a preset is selected
 * @param {string} props.label - Label for the field (optional)
 * @param {string} props.placeholder - Placeholder for the save dialog (optional)
 * @param {Object} props.user - Current user object
 * @param {Function} props.onSaveToFirestore - Function to call when a preset is selected and needs to be saved to Firestore
 * @param {Object} props.resumeData - Current resume data object
 * @param {Function} props.onUpdateResume - Function to call when the resume data needs to be updated
 */
const PresetManager = ({ fieldId, value, onValueChange, label, placeholder, user, onSaveToFirestore, resumeData, onUpdateResume }) => {
    const [presets, setPresets] = useState([]);
    const [hoveredPreset, setHoveredPreset] = useState(null);
    const [newPresetName, setNewPresetName] = useState('');
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    useEffect(() => {
        loadPresets();
    }, [user]);

    const loadPresets = async () => {
        if (user) {
            try {
                const allPresets = await getPresets(user.uid, fieldId);
                setPresets(allPresets || []);

                // If presets exist but none is selected, select the first one
                if (allPresets?.length > 0 && !resumeData.config.selectedPresets?.[fieldId]) {
                    const newSelectedPresets = {
                        ...(resumeData.config.selectedPresets || {}),
                        [fieldId]: allPresets[0].name
                    };
                    const newConfig = {
                        ...resumeData.config,
                        selectedPresets: newSelectedPresets
                    };
                    onUpdateResume({
                        ...resumeData,
                        config: newConfig
                    });
                }
            } catch (error) {
                console.error('Error loading presets:', error);
                setSnackbar({
                    open: true,
                    message: 'Error loading presets',
                    severity: 'error'
                });
            }
        }
    };

    const handleSavePreset = async () => {
        if (!user) {
            setSnackbar({
                open: true,
                message: 'Please sign in to save presets',
                severity: 'error'
            });
            return;
        }

        if (!newPresetName || newPresetName.trim() === '') {
            setSnackbar({
                open: true,
                message: 'Please enter a preset name',
                severity: 'error'
            });
            return;
        }

        try {
            const newPreset = {
                name: newPresetName.trim(),
                value: value
            };

            await savePreset(user.uid, fieldId, newPreset);

            setPresets(prevPresets => {
                const newPresets = [...prevPresets];
                const existingIndex = newPresets.findIndex(p => p.name === newPresetName.trim());
                if (existingIndex >= 0) {
                    newPresets[existingIndex] = newPreset;
                } else {
                    newPresets.push(newPreset);
                }
                return newPresets;
            });

            setNewPresetName('');
            setSnackbar({
                open: true,
                message: 'Preset saved successfully',
                severity: 'success'
            });
        } catch (error) {
            console.error('Error saving preset:', error);
            setSnackbar({
                open: true,
                message: 'Error saving preset. Please try again.',
                severity: 'error'
            });
        }
    };

    const handleDeletePreset = async (presetName) => {
        if (!user) {
            setSnackbar({
                open: true,
                message: 'Please sign in to delete presets',
                severity: 'error'
            });
            return;
        }

        // Don't allow deleting the last preset
        if (presets.length <= 1) {
            setSnackbar({
                open: true,
                message: 'Cannot delete the last preset',
                severity: 'error'
            });
            return;
        }

        try {
            await deletePreset(user.uid, fieldId, presetName);
            setSnackbar({
                open: true,
                message: 'Preset deleted successfully',
                severity: 'success'
            });

            // If the deleted preset was selected, select the first available preset
            if (resumeData.config.selectedPresets?.[fieldId] === presetName) {
                const newSelectedPresets = {
                    ...resumeData.config.selectedPresets,
                    [fieldId]: presets[0].name // Select the first preset
                };
                const newConfig = {
                    ...resumeData.config,
                    selectedPresets: newSelectedPresets
                };
                onUpdateResume({
                    ...resumeData,
                    config: newConfig
                });
            }
            await loadPresets();
        } catch (error) {
            console.error('Error deleting preset:', error);
            setSnackbar({
                open: true,
                message: 'Error deleting preset',
                severity: 'error'
            });
        }
    };

    const handlePresetSelect = (event) => {
        const selected = event.target.value;

        // Update the selected preset in resumeData config
        const newSelectedPresets = {
            ...resumeData.config.selectedPresets,
            [fieldId]: selected
        };
        const newConfig = {
            ...resumeData.config,
            selectedPresets: newSelectedPresets
        };
        onUpdateResume({
            ...resumeData,
            config: newConfig
        });

        const preset = presets.find(p => p.name === selected);
        if (preset) {
            onValueChange(preset.value);
            // Save the new value to Firestore
            if (onSaveToFirestore) {
                onSaveToFirestore();
            }
        }
    };

    return (
        <Box sx={{ mb: 2 }}>
            <Stack direction="row" spacing={2} sx={{ mb: 1 }}>
                <FormControl fullWidth>
                    <InputLabel>{label || 'Presets'}</InputLabel>
                    <Select
                        value={resumeData.config.selectedPresets?.[fieldId] || presets[0]?.name}
                        onChange={handlePresetSelect}
                        label={label || 'Presets'}
                    >
                        {presets.map((preset) => (
                            <MenuItem
                                key={preset.name}
                                value={preset.name}
                                onMouseEnter={() => setHoveredPreset(preset.name)}
                                onMouseLeave={() => setHoveredPreset(null)}
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}
                            >
                                <span>{preset.name}</span>
                                {hoveredPreset === preset.name && (
                                    <IconButton
                                        size="small"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeletePreset(preset.name);
                                        }}
                                        sx={{
                                            color: 'error.main',
                                            ml: 1
                                        }}
                                    >
                                        <DeleteIcon fontSize="small" />
                                    </IconButton>
                                )}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <TextField
                    label="New Preset Name"
                    value={newPresetName}
                    onChange={(e) => setNewPresetName(e.target.value)}
                    placeholder={placeholder}
                />
                <Button
                    variant="contained"
                    onClick={handleSavePreset}
                    disabled={!newPresetName.trim()}
                >
                    Save Preset
                </Button>
            </Stack>
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

export default PresetManager; 