import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    FormControl,
    FormLabel,
    RadioGroup,
    FormControlLabel,
    Radio,
    Box,
    Alert,
    Select,
    MenuItem,
    InputLabel
} from '@mui/material';

const SavePresetModal = ({ open, onClose, onSave, existingPresets = [], title = "Save Preset" }) => {
    const [mode, setMode] = useState('new');
    const [presetName, setPresetName] = useState('');
    const [selectedPreset, setSelectedPreset] = useState('');
    const [showOverwriteWarning, setShowOverwriteWarning] = useState(false);
    const [error, setError] = useState('');

    const handleSave = () => {
        if (mode === 'new') {
            const name = presetName.trim();
            if (!name) {
                setError('Please enter a preset name');
                return;
            }

            // Check if preset name already exists
            const exists = existingPresets.some(preset => preset.name.toLowerCase() === name.toLowerCase());
            if (exists) {
                setShowOverwriteWarning(true);
                return;
            }

            onSave(name);
            handleClose();
        } else {
            if (!selectedPreset) {
                setError('Please select a preset to overwrite');
                return;
            }
            onSave(selectedPreset);
            handleClose();
        }
    };

    const handleConfirmOverwrite = () => {
        onSave(presetName);
        setShowOverwriteWarning(false);
        handleClose();
    };

    const handleClose = () => {
        setMode('new');
        setPresetName('');
        setSelectedPreset('');
        setError('');
        setShowOverwriteWarning(false);
        onClose();
    };

    if (showOverwriteWarning) {
        return (
            <Dialog open={open} onClose={() => setShowOverwriteWarning(false)}>
                <DialogTitle>Confirm Overwrite</DialogTitle>
                <DialogContent>
                    A preset with the name "{presetName}" already exists. Do you want to overwrite it?
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowOverwriteWarning(false)}>Cancel</Button>
                    <Button onClick={handleConfirmOverwrite} color="error">Overwrite</Button>
                </DialogActions>
            </Dialog>
        );
    }

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <Box sx={{ mt: 2 }}>
                    <FormControl component="fieldset">
                        <FormLabel component="legend">Save as</FormLabel>
                        <RadioGroup
                            value={mode}
                            onChange={(e) => {
                                setMode(e.target.value);
                                setError('');
                            }}
                        >
                            <FormControlLabel
                                value="new"
                                control={<Radio />}
                                label="New preset"
                            />
                            {mode === 'new' && (
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    label="Preset name"
                                    fullWidth
                                    value={presetName}
                                    onChange={(e) => {
                                        setPresetName(e.target.value);
                                        setError('');
                                    }}
                                    sx={{ ml: 3, width: 'calc(100% - 24px)' }}
                                />
                            )}
                            <FormControlLabel
                                value="overwrite"
                                control={<Radio />}
                                label="Overwrite existing preset"
                            />
                            {mode === 'overwrite' && existingPresets.length > 0 && (
                                <FormControl sx={{ ml: 3, width: 'calc(100% - 24px)' }}>
                                    <InputLabel>Select preset</InputLabel>
                                    <Select
                                        value={selectedPreset}
                                        onChange={(e) => {
                                            setSelectedPreset(e.target.value);
                                            setError('');
                                        }}
                                        label="Select preset"
                                    >
                                        {existingPresets.map((preset) => (
                                            <MenuItem
                                                key={preset.name}
                                                value={preset.name}
                                            >
                                                {preset.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            )}
                        </RadioGroup>
                    </FormControl>
                    {error && (
                        <Alert severity="error" sx={{ mt: 2 }}>
                            {error}
                        </Alert>
                    )}
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleSave} variant="contained">Save</Button>
            </DialogActions>
        </Dialog>
    );
};

export default SavePresetModal; 