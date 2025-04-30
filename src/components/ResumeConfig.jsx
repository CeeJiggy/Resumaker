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
} from '@mui/material';
import { MuiColorInput } from 'mui-color-input';
import { styled } from '@mui/material/styles';
import { getAllPresets, savePreset } from '../services/firestore';

const ConfigSection = styled(Box)(({ theme }) => ({
    marginBottom: theme.spacing(4),
}));

const sectionKeys = [
    { key: 'summary', label: 'Professional Summary' },
    { key: 'experience', label: 'Jobs' },
    { key: 'projects', label: 'Projects' },
    { key: 'education', label: 'Education' },
    { key: 'skills', label: 'Skills' }
];

const getDefaultPresetForSection = (key) => {
    switch (key) {
        case 'skills':
            return [''];
        case 'experience':
            return [{
                company: '',
                position: '',
                startDate: { month: '', year: '' },
                endDate: { month: '', year: '' },
                isCurrentJob: false,
                description: ''
            }];
        case 'education':
            return [{
                institution: '',
                degree: '',
                year: ''
            }];
        case 'projects':
            return [{
                name: '',
                role: '',
                description: ''
            }];
        default:
            return '';
    }
};

const ResumeConfig = ({ resumeData, onUpdateResume, user }) => {
    const [sectionPresets, setSectionPresets] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    // Load presets from Firestore for each section
    useEffect(() => {
        if (!user) {
            setIsLoading(false);
            return;
        }

        const initializePresets = async () => {
            try {
                setIsLoading(true);
                let allPresets = await getAllPresets(user.uid);

                // If no presets exist, create default presets
                if (!allPresets || Object.keys(allPresets).length === 0) {
                    allPresets = {};
                    // Create default presets for each section
                    for (const { key } of sectionKeys) {
                        const defaultPreset = {
                            name: 'Default',
                            value: getDefaultPresetForSection(key)
                        };
                        await savePreset(user.uid, key, defaultPreset);
                        allPresets[key] = [defaultPreset];
                    }
                }

                setSectionPresets(allPresets);

                // Ensure default selections are set
                const currentSelectedPresets = resumeData.config.selectedPresets || {};
                const newSelectedPresets = { ...currentSelectedPresets };
                let hasChanges = false;

                sectionKeys.forEach(({ key }) => {
                    if (!currentSelectedPresets[key]) {
                        newSelectedPresets[key] = 'Default';
                        hasChanges = true;
                    }
                });

                if (hasChanges) {
                    onUpdateResume({
                        ...resumeData,
                        config: {
                            ...resumeData.config,
                            selectedPresets: newSelectedPresets
                        }
                    });
                }
            } catch (error) {
                console.error('Error initializing presets:', error);
            } finally {
                setIsLoading(false);
            }
        };

        initializePresets();
    }, [user?.uid]);

    // Handle preset selection
    const handlePresetSelect = (sectionKey, presetName) => {
        const newSelectedPresets = {
            ...(resumeData.config.selectedPresets || {}),
            [sectionKey]: presetName,
        };
        const newConfig = {
            ...resumeData.config,
            selectedPresets: newSelectedPresets,
        };
        onUpdateResume({
            ...resumeData,
            config: newConfig,
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
            <Typography variant="h6" gutterBottom>
                Resume Configuration
            </Typography>

            <ConfigSection>
                <FormLabel component="legend">Visible Sections</FormLabel>
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
                                checked={resumeData.config.contact.showEmail}
                                onChange={(e) => handleConfigChange('contact', 'showEmail', e.target.checked)}
                            />
                        }
                        label="Show Email"
                    />
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
                                checked={resumeData.config.contact.showLocation}
                                onChange={(e) => handleConfigChange('contact', 'showLocation', e.target.checked)}
                            />
                        }
                        label="Show Location"
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
        </Box>
    );
};

export default ResumeConfig; 