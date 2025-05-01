import React, { useState, useEffect } from 'react';
import {
    Box,
    FormControl,
    FormControlLabel,
    FormGroup,
    FormLabel,
    Switch,
    Divider,
    Typography,
    Slider,
    RadioGroup,
    Radio,
    Paper,
    Select,
    MenuItem,
    InputLabel,
    CircularProgress,
    Button,
    Snackbar,
    Alert,
    IconButton,
} from '@mui/material';
import { MuiColorInput } from 'mui-color-input';
import { styled } from '@mui/material/styles';
import { getAllPresets, savePreset, deletePreset } from '../services/firestore';
import SaveAllPresetsModal from './SaveAllPresetsModal';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';

const ConfigSection = styled(Box)(({ theme }) => ({
    marginBottom: theme.spacing(4),
}));

const sectionKeys = [
    { key: 'summary', label: 'Professional Summary' },
    { key: 'experience', label: 'Experience' },
    { key: 'projects', label: 'Projects' },
    { key: 'education', label: 'Education' },
    { key: 'skills', label: 'Skills' }
];

const ResumeConfig = ({ resumeData, onUpdateResume, user }) => {
    const [sectionPresets, setSectionPresets] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [saveAllModalOpen, setSaveAllModalOpen] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [hoveredPreset, setHoveredPreset] = useState(null);

    // Load presets only when user changes or on mount
    useEffect(() => {
        const loadPresets = async () => {
            if (!user) {
                setIsLoading(false);
                return;
            }

            try {
                setIsLoading(true);
                const allPresets = await getAllPresets(user.uid);
                setSectionPresets(allPresets || {});
            } catch (error) {
                console.error('Error loading presets:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadPresets();
    }, [user?.uid]);

    // Handle preset selection
    const handlePresetSelect = (sectionKey, presetName) => {
        onUpdateResume({
            ...resumeData,
            config: {
                ...resumeData.config,
                selectedPresets: {
                    ...(resumeData.config.selectedPresets || {}),
                    [sectionKey]: presetName,
                }
            }
        });
    };

    const handleConfigChange = (section, field, value) => {
        const newConfig = {
            ...resumeData.config,
            [section]: {
                ...resumeData.config[section],
                [field]: value,
            },
        };
        onUpdateResume({
            ...resumeData,
            config: newConfig,
        });
    };

    const handleColorChange = (newColor) => {
        handleConfigChange('style', 'primaryColor', newColor);
    };

    const handleSaveAllPresets = async (presetName) => {
        try {
            // First, save presets for sections using Current Values AND are visible
            const newSelectedPresets = { ...resumeData.config.selectedPresets };

            for (const { key } of sectionKeys) {
                const currentSelection = resumeData.config.selectedPresets?.[key];
                const isSectionVisible = resumeData.config.sections[key];

                // Only save preset if section is visible and using current values
                if (isSectionVisible && (!currentSelection || currentSelection === 'current')) {
                    // Get the current value for this section
                    const valueToSave = key === 'summary' ? resumeData.summary :
                        key === 'experience' ? resumeData.experience :
                            key === 'education' ? resumeData.education :
                                key === 'projects' ? resumeData.projects :
                                    key === 'skills' ? resumeData.skills : '';

                    // Save a new preset for this section
                    const sectionPreset = {
                        name: presetName,
                        value: valueToSave
                    };
                    await savePreset(user.uid, key, sectionPreset);

                    // Update the selected preset for this section
                    newSelectedPresets[key] = presetName;

                    // Update local state immediately
                    setSectionPresets(prev => ({
                        ...prev,
                        [key]: [...(prev[key] || []), sectionPreset]
                    }));
                }
            }

            // Then save the config preset with the updated selected presets
            const configPreset = {
                name: presetName,
                value: {
                    selectedPresets: newSelectedPresets,
                    sections: resumeData.config.sections,
                    contact: resumeData.config.contact,
                    style: resumeData.config.style
                }
            };
            await savePreset(user.uid, 'config', configPreset);

            // Update local state for config presets
            setSectionPresets(prev => ({
                ...prev,
                config: [...(prev.config || []), configPreset]
            }));

            // Set this as the selected config preset
            onUpdateResume({
                ...resumeData,
                config: {
                    ...resumeData.config,
                    selectedConfigPreset: presetName,
                    selectedPresets: newSelectedPresets
                }
            });

            setSnackbar({
                open: true,
                message: 'Config preset saved successfully',
                severity: 'success'
            });
        } catch (error) {
            console.error('Error saving config preset:', error);
            setSnackbar({
                open: true,
                message: 'Error saving config preset',
                severity: 'error'
            });
        }
    };

    const handleConfigPresetSelect = async (event) => {
        const presetName = event.target.value;
        if (!presetName) return;

        const configPreset = sectionPresets.config?.find(p => p.name === presetName);
        if (configPreset) {
            // Update the resume config with the selected preset's values
            onUpdateResume({
                ...resumeData,
                config: configPreset.value
            });
        }
    };

    const handleDeleteConfigPreset = async (presetName) => {
        try {
            await deletePreset(user.uid, 'config', presetName);

            // Update local state
            setSectionPresets(prev => ({
                ...prev,
                config: prev.config?.filter(p => p.name !== presetName) || []
            }));

            setSnackbar({
                open: true,
                message: 'Config preset deleted successfully',
                severity: 'success'
            });
        } catch (error) {
            console.error('Error deleting config preset:', error);
            setSnackbar({
                open: true,
                message: 'Error deleting config preset',
                severity: 'error'
            });
        }
    };

    const handleOverwriteConfigPreset = async (presetName) => {
        try {
            // Save the current config as a new preset with the same name
            const configPreset = {
                name: presetName,
                value: {
                    selectedPresets: resumeData.config.selectedPresets,
                    sections: resumeData.config.sections,
                    contact: resumeData.config.contact,
                    style: resumeData.config.style
                }
            };
            await savePreset(user.uid, 'config', configPreset);

            // Update local state
            setSectionPresets(prev => ({
                ...prev,
                config: prev.config?.map(p => p.name === presetName ? configPreset : p) || [configPreset]
            }));

            setSnackbar({
                open: true,
                message: 'Config preset overwritten successfully',
                severity: 'success'
            });
        } catch (error) {
            console.error('Error overwriting config preset:', error);
            setSnackbar({
                open: true,
                message: 'Error overwriting config preset',
                severity: 'error'
            });
        }
    };

    // Render loading state
    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box>
            <ConfigSection>
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2
                }}>
                    <FormLabel component="legend">Config Presets</FormLabel>
                    <Button
                        variant="outlined"
                        size="small"
                        onClick={() => setSaveAllModalOpen(true)}
                    >
                        Save New Config Preset
                    </Button>
                </Box>
                <FormControl fullWidth size="small" sx={{ mb: 3 }}>
                    <InputLabel>Select Config Preset</InputLabel>
                    <Select
                        value={resumeData.config.selectedConfigPreset || ''}
                        onChange={handleConfigPresetSelect}
                        label="Select Config Preset"
                    >
                        <MenuItem value="">
                            <em>None</em>
                        </MenuItem>
                        {(sectionPresets.config || []).map((preset) => (
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
                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                        <IconButton
                                            size="small"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleOverwriteConfigPreset(preset.name);
                                            }}
                                            sx={{ color: 'primary.main' }}
                                        >
                                            <SaveIcon fontSize="small" />
                                        </IconButton>
                                        <IconButton
                                            size="small"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteConfigPreset(preset.name);
                                            }}
                                            sx={{ color: 'error.main' }}
                                        >
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </Box>
                                )}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </ConfigSection>

            <Divider sx={{ my: 3 }} />

            <ConfigSection>
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2
                }}>
                    <FormLabel component="legend">Visible Sections</FormLabel>
                </Box>
                <FormGroup>
                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: { xs: '1fr', sm: '260px 1fr' },
                            gap: 2,
                        }}
                    >
                        {sectionKeys.map(({ key, label }) => (
                            <React.Fragment key={key}>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={resumeData.config.sections[key]}
                                            onChange={(e) => handleConfigChange('sections', key, e.target.checked)}
                                        />
                                    }
                                    label={label}
                                    sx={{ minWidth: { xs: 0, sm: 200 }, m: 0, width: { xs: '100%', sm: 'auto' } }}
                                />
                                {resumeData.config.sections[key] && (
                                    <FormControl size="small" sx={{ minWidth: { xs: 0, sm: 220 }, maxWidth: { xs: '100%', sm: 240 }, width: '100%' }}>
                                        <InputLabel>{label} Preset</InputLabel>
                                        <Select
                                            value={(resumeData.config.selectedPresets?.[key]) || 'Default'}
                                            label={`${label} Preset`}
                                            onChange={(e) => handlePresetSelect(key, e.target.value)}
                                        >
                                            <MenuItem value="current">Current Values</MenuItem>
                                            {(sectionPresets[key] || []).map((preset) => (
                                                <MenuItem key={preset.name} value={preset.name}>
                                                    {preset.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                )}
                            </React.Fragment>
                        ))}
                    </Box>
                </FormGroup>
            </ConfigSection>

            <Divider sx={{ my: 3 }} />

            <ConfigSection>
                <FormLabel component="legend">Contact Information</FormLabel>
                <FormGroup>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={resumeData.config.contact.showLocation}
                                onChange={(e) => handleConfigChange('contact', 'showLocation', e.target.checked)}
                            />
                        }
                        label="Show Location"
                    />
                    {resumeData.config.contact.showLocation && (
                        <Paper sx={{ pl: 2, backgroundColor: '#e0e0e0', borderRadius: '1rem', p: '1rem', ml: '1rem', my: '0.5rem' }}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={resumeData.config.contact.showStreet}
                                        onChange={(e) => handleConfigChange('contact', 'showStreet', e.target.checked)}
                                    />
                                }
                                label="Show Street Address"
                            />
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={resumeData.config.contact.showApt}
                                        onChange={(e) => handleConfigChange('contact', 'showApt', e.target.checked)}
                                    />
                                }
                                label="Show Apartment/Suite"
                            />
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={resumeData.config.contact.showZip}
                                        onChange={(e) => handleConfigChange('contact', 'showZip', e.target.checked)}
                                    />
                                }
                                label="Show ZIP/Postal Code"
                            />
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={resumeData.config.contact.showCity}
                                        onChange={(e) => handleConfigChange('contact', 'showCity', e.target.checked)}
                                    />
                                }
                                label="Show City"
                            />
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={resumeData.config.contact.showState}
                                        onChange={(e) => handleConfigChange('contact', 'showState', e.target.checked)}
                                    />
                                }
                                label="Show State"
                            />
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={resumeData.config.contact.showCountry}
                                        onChange={(e) => handleConfigChange('contact', 'showCountry', e.target.checked)}
                                    />
                                }
                                label="Show Country"
                            />
                        </Paper>
                    )}
                    <FormControlLabel
                        control={
                            <Switch
                                checked={resumeData.config.contact.showPhone}
                                onChange={(e) => handleConfigChange('contact', 'showPhone', e.target.checked)}
                            />
                        }
                        label="Show Phone Number"
                    />
                    <FormControlLabel
                        control={
                            <Switch
                                checked={resumeData.config.contact.showEmail}
                                onChange={(e) => handleConfigChange('contact', 'showEmail', e.target.checked)}
                            />
                        }
                        label="Show Email"
                    />

                    <FormControlLabel
                        control={
                            <Switch
                                checked={resumeData.config.contact.showWebsite}
                                onChange={(e) => handleConfigChange('contact', 'showWebsite', e.target.checked)}
                            />
                        }
                        label="Show Website"
                    />

                </FormGroup>
            </ConfigSection>

            <Divider sx={{ my: 3 }} />

            <ConfigSection>
                <FormLabel component="legend">Style Options</FormLabel>
                <Box sx={{ mt: 2, mb: 3 }}>
                    <Typography gutterBottom>Accent Color</Typography>
                    <MuiColorInput
                        value={resumeData.config.style.primaryColor}
                        onChange={handleColorChange}
                        format="hex"
                    />
                </Box>

                <Box sx={{ mt: 3 }}>
                    <Typography gutterBottom>Font Size</Typography>
                    <RadioGroup
                        row
                        value={resumeData.config.style.fontSize}
                        onChange={(e) => handleConfigChange('style', 'fontSize', e.target.value)}
                    >
                        <FormControlLabel value="small" control={<Radio />} label="Small" />
                        <FormControlLabel value="normal" control={<Radio />} label="Normal" />
                        <FormControlLabel value="large" control={<Radio />} label="Large" />
                    </RadioGroup>
                </Box>

                <Box sx={{ mt: 3 }}>
                    <Typography gutterBottom>Font Weight</Typography>
                    <RadioGroup
                        row
                        value={resumeData.config.style.fontWeight}
                        onChange={(e) => handleConfigChange('style', 'fontWeight', e.target.value)}
                    >
                        <FormControlLabel value="light" control={<Radio />} label="Light" />
                        <FormControlLabel value="normal" control={<Radio />} label="Normal" />
                        <FormControlLabel value="bold" control={<Radio />} label="Bold" />
                    </RadioGroup>
                </Box>
            </ConfigSection>

            <SaveAllPresetsModal
                open={saveAllModalOpen}
                onClose={() => setSaveAllModalOpen(false)}
                onSave={handleSaveAllPresets}
                currentSelections={resumeData.config.selectedPresets || {}}
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

export default ResumeConfig; 