import React from 'react';
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
} from '@mui/material';
import { MuiColorInput } from 'mui-color-input';
import { styled } from '@mui/material/styles';

const ConfigSection = styled(Box)(({ theme }) => ({
    marginBottom: theme.spacing(4),
}));

const ResumeConfig = ({ resumeData, onUpdateResume }) => {
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

    return (
        <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
                Resume Configuration
            </Typography>

            <ConfigSection>
                <FormLabel component="legend">Visible Sections</FormLabel>
                <FormGroup>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={resumeData.config.sections.summary}
                                onChange={(e) => handleConfigChange('sections', 'summary', e.target.checked)}
                            />
                        }
                        label="Professional Summary"
                    />
                    <FormControlLabel
                        control={
                            <Switch
                                checked={resumeData.config.sections.experience}
                                onChange={(e) => handleConfigChange('sections', 'experience', e.target.checked)}
                            />
                        }
                        label="Experience"
                    />
                    <FormControlLabel
                        control={
                            <Switch
                                checked={resumeData.config.sections.education}
                                onChange={(e) => handleConfigChange('sections', 'education', e.target.checked)}
                            />
                        }
                        label="Education"
                    />
                    <FormControlLabel
                        control={
                            <Switch
                                checked={resumeData.config.sections.skills}
                                onChange={(e) => handleConfigChange('sections', 'skills', e.target.checked)}
                            />
                        }
                        label="Skills"
                    />
                    <FormControlLabel
                        control={
                            <Switch
                                checked={resumeData.config.sections.projects}
                                onChange={(e) => handleConfigChange('sections', 'projects', e.target.checked)}
                            />
                        }
                        label="Projects"
                    />
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
        </Paper>
    );
};

export default ResumeConfig; 