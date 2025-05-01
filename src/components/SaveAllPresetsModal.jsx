import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Typography,
    Box
} from '@mui/material';

const SaveAllPresetsModal = ({ open, onClose, onSave, currentSelections }) => {
    const [presetName, setPresetName] = useState('');
    const [error, setError] = useState('');

    const handleSave = () => {
        if (!presetName.trim()) {
            setError('Please enter a name for the preset');
            return;
        }
        onSave(presetName.trim());
        setPresetName('');
        setError('');
        onClose();
    };

    const handleClose = () => {
        setPresetName('');
        setError('');
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>Save New Preset for All Sections</DialogTitle>
            <DialogContent>
                <Box sx={{ mb: 3, mt: 1 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                        This will create a new preset with the name you specify using the currently selected data for each section:
                    </Typography>
                    <Box sx={{ mt: 2, pl: 2 }}>
                        {Object.entries(currentSelections).map(([section, selection]) => (
                            <Typography key={section} variant="body2" color="text.secondary">
                                • {section}: {selection === 'current' ? 'Current Values' : `"${selection}" preset`}
                            </Typography>
                        ))}
                    </Box>
                </Box>
                <TextField
                    autoFocus
                    fullWidth
                    label="Preset Name"
                    value={presetName}
                    onChange={(e) => {
                        setPresetName(e.target.value);
                        setError('');
                    }}
                    error={!!error}
                    helperText={error}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleSave} variant="contained" color="primary">
                    Save All
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default SaveAllPresetsModal; 