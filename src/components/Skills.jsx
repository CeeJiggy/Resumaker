import React, { useState } from 'react';
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
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import { savePreset } from '../services/firestore';
import SavePresetModal from './SavePresetModal';

const Skills = ({ skills, onUpdate, user, presets = [] }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPreset, setSelectedPreset] = useState('');

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

    const handleAddSkill = () => {
        onUpdate({ type: 'UPDATE_SKILLS', value: [...skills, ''] });
    };

    const handleDeleteSkill = (index) => {
        const newSkills = skills.filter((_, i) => i !== index);
        if (newSkills.length === 0) {
            newSkills.push('');
        }
        onUpdate({ type: 'UPDATE_SKILLS', value: newSkills });
    };

    const handleSkillChange = (index, value) => {
        const newSkills = [...skills];
        newSkills[index] = value;
        onUpdate({ type: 'UPDATE_SKILLS', value: newSkills });
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
                        {presets.map((preset) => (
                            <MenuItem key={preset.name} value={preset.name}>
                                {preset.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
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
        </Box>
    );
};

export default Skills; 