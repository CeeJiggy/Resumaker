import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Typography,
    TextField,
    Stack,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    IconButton,
    CircularProgress,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import { savePreset, deletePreset } from '../services/firestore';
import SavePresetModal from './SavePresetModal';

const Summary = ({ summary, onUpdate, user, presets = [], resumeData }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPreset, setSelectedPreset] = useState('current');
    const [isLoading, setIsLoading] = useState(false);

    // Initialize selectedPreset from resumeData when presets are loaded
    useEffect(() => {
        if (presets.length > 0) {
            const currentPreset = resumeData.config.selectedPresets?.summary || presets[0].name;
            setSelectedPreset(currentPreset);
        } else {
            setSelectedPreset('current');
        }
        setIsLoading(false);
    }, [presets, resumeData.config.selectedPresets]);

    const handleSavePreset = async (presetName) => {
        const preset = {
            name: presetName,
            value: summary
        };
        try {
            await savePreset(user.uid, 'summary', preset);
            if (onUpdate) {
                onUpdate({ type: 'REFRESH_PRESETS', section: 'summary' });
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
            onUpdate({ type: 'UPDATE_SUMMARY', value: selectedPreset.value });
        }
    };

    const handleDeletePreset = async () => {
        if (!selectedPreset || presets.length <= 1) return;

        try {
            await deletePreset(user.uid, 'summary', selectedPreset);

            // Select the first available preset after deletion
            const remainingPresets = presets.filter(p => p.name !== selectedPreset);
            if (remainingPresets.length > 0) {
                setSelectedPreset(remainingPresets[0].name);
                onUpdate({ type: 'UPDATE_SUMMARY', value: remainingPresets[0].value });
            }

            onUpdate({ type: 'REFRESH_PRESETS', section: 'summary' });
        } catch (error) {
            console.error('Error deleting preset:', error);
        }
    };

    return (
        <Box>
            <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                <Typography variant="h6">Professional Summary</Typography>
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
            </Stack>

            <TextField
                label="Professional Summary"
                value={summary}
                onChange={(e) => onUpdate({ type: 'UPDATE_SUMMARY', value: e.target.value })}
                fullWidth
                multiline
                rows={4}
                placeholder="Brief overview of your professional background and goals"
                disabled={isLoading}
            />

            <SavePresetModal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSavePreset}
                existingPresets={presets}
                title="Save Summary Preset"
            />
        </Box>
    );
};

export default Summary;
