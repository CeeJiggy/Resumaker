import { useState, useEffect } from 'react';
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
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import BookmarkIcon from '@mui/icons-material/Bookmark';

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
 */
function PresetManager({ fieldId, value, onValueChange, label, placeholder }) {
    const [open, setOpen] = useState(false);
    const [presetName, setPresetName] = useState('');
    const [presets, setPresets] = useState([]);
    const [selectedPreset, setSelectedPreset] = useState('');
    const [hoveredPreset, setHoveredPreset] = useState(null);
    const [hasLoaded, setHasLoaded] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [pendingPreset, setPendingPreset] = useState(null);

    // Load presets from localStorage on component mount
    useEffect(() => {
        const storedPresets = localStorage.getItem(`presets-${fieldId}`);
        console.log('[PresetManager] Loading for', fieldId, ':', storedPresets);
        if (storedPresets) {
            setPresets(JSON.parse(storedPresets));
        }
        setHasLoaded(true);
    }, [fieldId]);

    // Save presets to localStorage only after initial load and state update
    useEffect(() => {
        if (hasLoaded) {
            const current = localStorage.getItem(`presets-${fieldId}`);
            const currentParsed = current ? JSON.parse(current) : [];
            if (JSON.stringify(currentParsed) !== JSON.stringify(presets)) {
                console.log('[PresetManager] Saving for', fieldId, ':', presets);
                localStorage.setItem(`presets-${fieldId}`, JSON.stringify(presets));
            }
        }
    }, [presets, fieldId, hasLoaded]);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setPresetName('');
        setShowConfirm(false);
        setPendingPreset(null);
    };

    const handlePresetNameChange = (e) => {
        const name = e.target.value;
        setPresetName(name);
    };

    const handleSavePreset = () => {
        if (presetName.trim() === '') return;
        if (presets.some(p => p.name === presetName)) {
            // Ask for confirmation to overwrite
            setShowConfirm(true);
            setPendingPreset({ name: presetName, value });
        } else {
            setPresets([...presets, { name: presetName, value }]);
            handleClose();
        }
    };

    const handleConfirmOverwrite = () => {
        // Overwrite the existing preset
        const updatedPresets = presets.map(p =>
            p.name === pendingPreset.name ? { name: pendingPreset.name, value: pendingPreset.value } : p
        );
        setPresets(updatedPresets);
        setShowConfirm(false);
        setPendingPreset(null);
        handleClose();
    };

    const handleCancelOverwrite = () => {
        setShowConfirm(false);
        setPendingPreset(null);
    };

    const handleDeletePreset = (name) => {
        setPresets(presets.filter(p => p.name !== name));
        if (selectedPreset === name) {
            setSelectedPreset('');
        }
    };

    const handleSelectPreset = (event) => {
        const name = event.target.value;
        setSelectedPreset(name);

        if (name) {
            const preset = presets.find(p => p.name === name);
            if (preset) {
                onValueChange(preset.value);
            }
        }
    };

    return (
        <Stack direction={{ xs: 'column', sm: 'row' }} alignItems="center" spacing={1} sx={{ mb: 1, flexWrap: 'wrap' }}>
            {label && (
                <Typography variant="body2" sx={{ minWidth: '110px', fontWeight: 500 }}>
                    {label}
                </Typography>
            )}
            <FormControl size="small" sx={{ minWidth: 170, maxWidth: 220 }}>
                {/* <InputLabel>Presets</InputLabel> */}
                <Select
                    value={selectedPreset}
                    onChange={handleSelectPreset}
                    // label="Presets"
                    displayEmpty
                    size="small"
                >
                    <MenuItem value="">
                        <em>Select a preset</em>
                    </MenuItem>
                    {presets.map((preset) => (
                        <MenuItem
                            key={preset.name}
                            value={preset.name}
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                pr: 0
                            }}
                            onMouseEnter={() => setHoveredPreset(preset.name)}
                            onMouseLeave={() => setHoveredPreset(null)}
                        >
                            <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{preset.name}</span>
                            {hoveredPreset === preset.name && (
                                <IconButton
                                    size="small"
                                    onClick={e => {
                                        e.stopPropagation();
                                        handleDeletePreset(preset.name);
                                    }}
                                    sx={{ ml: 1 }}
                                >
                                    <DeleteIcon fontSize="small" />
                                </IconButton>
                            )}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <Tooltip title="Save as preset">
                <IconButton onClick={handleOpen} color="primary" size="small" sx={{ ml: 0.5 }}>
                    <SaveIcon fontSize="small" />
                </IconButton>
            </Tooltip>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Save as Preset</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Preset Name"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={presetName}
                        onChange={handlePresetNameChange}
                        placeholder={placeholder || 'Enter a name for this preset'}
                        size="small"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} size="small">Cancel</Button>
                    <Button onClick={handleSavePreset} variant="contained" size="small" disabled={presetName.trim() === ''}>Save</Button>
                </DialogActions>
            </Dialog>
            {/* Overwrite confirmation dialog */}
            <Dialog open={showConfirm} onClose={handleCancelOverwrite}>
                <DialogTitle>Overwrite Preset?</DialogTitle>
                <DialogContent>
                    <Typography>
                        A preset with the name "{pendingPreset?.name}" already exists. Do you want to overwrite it?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancelOverwrite} size="small">Cancel</Button>
                    <Button onClick={handleConfirmOverwrite} variant="contained" size="small">Overwrite</Button>
                </DialogActions>
            </Dialog>
        </Stack>
    );
}

export default PresetManager; 