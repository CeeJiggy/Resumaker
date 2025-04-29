import { useState } from 'react';
import { useTheme, useMediaQuery } from '@mui/material';
import {
    Box,
    TextField,
    Button,
    Typography,
    Paper,
    IconButton,
    Tabs,
    Tab,
    Stack,
    Grid,
    FormControlLabel,
    Switch,
    Divider,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import ResumeConfig from './ResumeConfig';
import PresetManager from './PresetManager';
import SettingsIcon from '@mui/icons-material/Settings';
import PersonIcon from '@mui/icons-material/Person';
import DescriptionIcon from '@mui/icons-material/Description';
import WorkIcon from '@mui/icons-material/Work';
import BuildIcon from '@mui/icons-material/Build';
import SchoolIcon from '@mui/icons-material/School';
import StarIcon from '@mui/icons-material/Star';

const MONTHS = [
    { value: '', label: 'No Month' },
    { value: 'January', label: 'January' },
    { value: 'February', label: 'February' },
    { value: 'March', label: 'March' },
    { value: 'April', label: 'April' },
    { value: 'May', label: 'May' },
    { value: 'June', label: 'June' },
    { value: 'July', label: 'July' },
    { value: 'August', label: 'August' },
    { value: 'September', label: 'September' },
    { value: 'October', label: 'October' },
    { value: 'November', label: 'November' },
    { value: 'December', label: 'December' }
];

function TabPanel({ children, value, index, ...other }) {
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`resume-tabpanel-${index}`}
            aria-labelledby={`resume-tab-${index}`}
            {...other}
            style={{
                maxHeight: '75vh',
                overflowY: 'auto',
            }}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

function ResumeForm({ resumeData, onUpdateResume }) {
    const [currentTab, setCurrentTab] = useState(0);
    const theme = useTheme();
    const isSmall = useMediaQuery(theme.breakpoints.down('sm'));

    const handleTabChange = (event, newValue) => {
        setCurrentTab(newValue);
    };

    const handlePersonalInfoChange = (field, value) => {
        onUpdateResume({
            ...resumeData,
            personalInfo: {
                ...resumeData.personalInfo,
                [field]: value,
            },
        });
    };

    const handleExperienceChange = (index, field, value) => {
        const newExperience = [...resumeData.experience];

        if (field === 'startDate' || field === 'endDate') {
            // For year inputs, only allow numbers and limit to 4 digits
            if ('year' in value) {
                const yearValue = value.year.replace(/\D/g, '').slice(0, 4);
                value = { ...value, year: yearValue };
            }

            newExperience[index] = {
                ...newExperience[index],
                [field]: {
                    ...newExperience[index][field],
                    ...value
                }
            };
        } else {
            newExperience[index] = {
                ...newExperience[index],
                [field]: value,
                ...(field === 'isCurrentJob' && value && {
                    endDate: { month: '', year: '' }
                })
            };
        }

        onUpdateResume({
            ...resumeData,
            experience: newExperience,
        });
    };

    const handleEducationChange = (index, field, value) => {
        const newEducation = [...resumeData.education];
        newEducation[index] = {
            ...newEducation[index],
            [field]: value,
        };
        onUpdateResume({
            ...resumeData,
            education: newEducation,
        });
    };

    const handleProjectChange = (index, field, value) => {
        const newProjects = [...resumeData.projects];
        newProjects[index] = {
            ...newProjects[index],
            [field]: value,
        };
        onUpdateResume({
            ...resumeData,
            projects: newProjects,
        });
    };

    const handleSkillChange = (index, value) => {
        const newSkills = [...resumeData.skills];
        newSkills[index] = value;
        onUpdateResume({
            ...resumeData,
            skills: newSkills,
        });
    };

    const addExperience = () => {
        onUpdateResume({
            ...resumeData,
            experience: [
                ...resumeData.experience,
                {
                    company: '',
                    position: '',
                    startDate: { month: '', year: '' },
                    endDate: { month: '', year: '' },
                    isCurrentJob: false,
                    description: ''
                },
            ],
        });
    };

    const addEducation = () => {
        onUpdateResume({
            ...resumeData,
            education: [
                ...resumeData.education,
                { institution: '', degree: '', year: '' },
            ],
        });
    };

    const addProject = () => {
        onUpdateResume({
            ...resumeData,
            projects: [
                ...resumeData.projects,
                { name: '', role: '', description: '' },
            ],
        });
    };

    const addSkill = () => {
        onUpdateResume({
            ...resumeData,
            skills: [...resumeData.skills, ''],
        });
    };

    const removeExperience = (index) => {
        const newExperience = resumeData.experience.filter((_, i) => i !== index);
        onUpdateResume({
            ...resumeData,
            experience: newExperience,
        });
    };

    const removeEducation = (index) => {
        const newEducation = resumeData.education.filter((_, i) => i !== index);
        onUpdateResume({
            ...resumeData,
            education: newEducation,
        });
    };

    const removeProject = (index) => {
        const newProjects = resumeData.projects.filter((_, i) => i !== index);
        onUpdateResume({
            ...resumeData,
            projects: newProjects,
        });
    };

    const removeSkill = (index) => {
        const newSkills = resumeData.skills.filter((_, i) => i !== index);
        onUpdateResume({
            ...resumeData,
            skills: newSkills,
        });
    };

    return (
        <Paper sx={{
            position: 'relative',
            p: { xs: 1, sm: 2, md: 3 },
            width: '100%',
            maxWidth: { xs: '100%', sm: '600px', md: '800px' },
            mx: 'auto',
            boxSizing: 'border-box',
            fontFamily: 'League Spartan',
            '& .MuiTypography-root': {
                fontFamily: 'League Spartan'
            },
            '& .MuiInputBase-root': {
                fontFamily: 'League Spartan'
            },
            '& .MuiInputLabel-root': {
                fontFamily: 'League Spartan'
            },
            '& .MuiButton-root': {
                fontFamily: 'League Spartan'
            },
            '& .MuiTab-root': {
                fontFamily: 'League Spartan'
            },
            '& .MuiMenuItem-root': {
                fontFamily: 'League Spartan'
            },
            '& .MuiFormControlLabel-label': {
                fontFamily: 'League Spartan'
            }
        }}>
            <Box sx={{
                borderBottom: 1,
                borderColor: 'divider',
                position: 'sticky',
                minWidth: '288px',
                top: 0,
                backgroundColor: 'background.paper',
                zIndex: 1,
                mx: { xs: -1, sm: -2, md: -3 },
                px: { xs: 1, sm: 2, md: 3 }
            }}>
                <Tabs
                    value={currentTab}
                    onChange={handleTabChange}
                    variant="scrollable"
                    scrollButtons="auto"
                    aria-label="resume sections"
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        '& .MuiTab-root': {
                            minWidth: { xs: '40px', sm: '50px' },
                            minHeight: { xs: '48px', sm: '48px' },
                            padding: { xs: '6px', sm: '12px 16px' },
                            '&:focus': {
                                outline: 'none'
                            },
                            '&.Mui-focusVisible': {
                                outline: 'none'
                            }
                        },
                        '& .MuiTabs-flexContainer': {
                            justifyContent: 'space-around',
                        },
                        '& .MuiTabs-indicator': {
                            height: 3
                        }
                    }}
                >
                    <Tab icon={<SettingsIcon />} label={isSmall ? '' : 'Resume'} />
                    <Tab icon={<PersonIcon />} label={isSmall ? '' : 'Info'} />
                    <Tab icon={<DescriptionIcon />} label={isSmall ? '' : 'Summary'} />
                    <Tab icon={<WorkIcon />} label={isSmall ? '' : 'Jobs'} />
                    <Tab icon={<BuildIcon />} label={isSmall ? '' : 'Projects'} />
                    <Tab icon={<SchoolIcon />} label={isSmall ? '' : 'Education'} />
                    <Tab icon={<StarIcon />} label={isSmall ? '' : 'Skills'} />
                </Tabs>
            </Box>

            {/* Resume Config Tab */}
            <TabPanel value={currentTab} index={0}>
                <ResumeConfig
                    resumeData={resumeData}
                    onUpdateResume={onUpdateResume}
                />
            </TabPanel>

            {/* Personal Information Tab */}
            <TabPanel value={currentTab} index={1}>
                <Stack spacing={2}>
                    <TextField
                        fullWidth
                        label="Full Name"
                        value={resumeData.personalInfo.name}
                        onChange={(e) => handlePersonalInfoChange('name', e.target.value)}
                    />
                    <TextField
                        fullWidth
                        label="Email"
                        value={resumeData.personalInfo.email}
                        onChange={(e) => handlePersonalInfoChange('email', e.target.value)}
                    />
                    <TextField
                        fullWidth
                        label="Phone"
                        value={resumeData.personalInfo.phone}
                        onChange={(e) => handlePersonalInfoChange('phone', e.target.value)}
                    />
                    <TextField
                        fullWidth
                        label="Website"
                        value={resumeData.personalInfo.website}
                        onChange={(e) => handlePersonalInfoChange('website', e.target.value)}
                        placeholder="https://your-website.com"
                    />
                    <Typography variant="subtitle1" gutterBottom>
                        Address
                    </Typography>
                    <TextField
                        fullWidth
                        label="Street Address"
                        value={resumeData.personalInfo.location.street}
                        onChange={(e) => handlePersonalInfoChange('location', { ...resumeData.personalInfo.location, street: e.target.value })}
                    />
                    <TextField
                        fullWidth
                        label="Apartment/Suite"
                        value={resumeData.personalInfo.location.apt}
                        onChange={(e) => handlePersonalInfoChange('location', { ...resumeData.personalInfo.location, apt: e.target.value })}
                    />
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label="City"
                                value={resumeData.personalInfo.location.city}
                                onChange={(e) => handlePersonalInfoChange('location', { ...resumeData.personalInfo.location, city: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label="State/Province"
                                value={resumeData.personalInfo.location.state}
                                onChange={(e) => handlePersonalInfoChange('location', { ...resumeData.personalInfo.location, state: e.target.value })}
                            />
                        </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label="ZIP/Postal Code"
                                value={resumeData.personalInfo.location.zip}
                                onChange={(e) => handlePersonalInfoChange('location', { ...resumeData.personalInfo.location, zip: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label="Country"
                                value={resumeData.personalInfo.location.country}
                                onChange={(e) => handlePersonalInfoChange('location', { ...resumeData.personalInfo.location, country: e.target.value })}
                            />
                        </Grid>
                    </Grid>
                </Stack>
            </TabPanel>

            {/* Professional Summary Tab */}
            <TabPanel value={currentTab} index={2}>
                <PresetManager
                    fieldId="summary"
                    value={resumeData.summary}
                    onValueChange={(value) => onUpdateResume({ ...resumeData, summary: value })}
                    label="Summary Presets"
                    placeholder="Enter a name for this summary preset"
                />
                <TextField
                    label="Professional Summary"
                    value={resumeData.summary}
                    onChange={(e) => onUpdateResume({ ...resumeData, summary: e.target.value })}
                    fullWidth
                    multiline
                    rows={4}
                    placeholder="Brief overview of your professional background and goals"
                />
            </TabPanel>

            {/* Experience Tab */}
            <TabPanel value={currentTab} index={3}>
                <PresetManager
                    fieldId="experience"
                    value={resumeData.experience}
                    onValueChange={(value) => onUpdateResume({ ...resumeData, experience: value })}
                    label="Experience Presets"
                    placeholder="Enter a name for this experience preset"
                />
                {resumeData.experience.map((exp, index) => (
                    <Box key={index} sx={{ mb: 3, position: 'relative' }}>
                        <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, position: 'relative' }}>
                            <TextField
                                label="Company"
                                value={exp.company}
                                onChange={(e) => handleExperienceChange(index, 'company', e.target.value)}
                                fullWidth
                            />
                            <Box sx={{ display: 'flex', alignItems: 'start', gap: 1 }}>
                                <TextField
                                    label="Position"
                                    value={exp.position}
                                    onChange={(e) => handleExperienceChange(index, 'position', e.target.value)}
                                    fullWidth
                                />
                                <IconButton
                                    onClick={() => removeExperience(index)}
                                    sx={{ mt: 1 }}
                                    size="small"
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </Box>
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <FormControl fullWidth>
                                    <InputLabel>Start Month</InputLabel>
                                    <Select
                                        label="Start Month"
                                        value={exp.startDate?.month || ''}
                                        onChange={(e) => handleExperienceChange(index, 'startDate', { month: e.target.value })}
                                    >
                                        {MONTHS.map((month) => (
                                            <MenuItem key={month.value} value={month.value}>
                                                {month.label}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <TextField
                                    label="Start Year"
                                    value={exp.startDate?.year || ''}
                                    onChange={(e) => handleExperienceChange(index, 'startDate', { year: e.target.value })}
                                    placeholder="YYYY"
                                    fullWidth
                                    type="text"
                                    inputProps={{
                                        maxLength: 4,
                                    }}
                                />
                            </Box>
                            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={exp.isCurrentJob || false}
                                            onChange={(e) => handleExperienceChange(index, 'isCurrentJob', e.target.checked)}
                                        />
                                    }
                                    label="Current Job"
                                    sx={{ minWidth: '140px' }}
                                />
                                {!exp.isCurrentJob && (
                                    <>
                                        <FormControl fullWidth>
                                            <InputLabel>End Month</InputLabel>
                                            <Select
                                                label="End Month"
                                                value={exp.endDate?.month || ''}
                                                onChange={(e) => handleExperienceChange(index, 'endDate', { month: e.target.value })}
                                            >
                                                {MONTHS.map((month) => (
                                                    <MenuItem key={month.value} value={month.value}>
                                                        {month.label}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                        <TextField
                                            label="End Year"
                                            value={exp.endDate?.year || ''}
                                            onChange={(e) => handleExperienceChange(index, 'endDate', { year: e.target.value })}
                                            placeholder="YYYY"
                                            fullWidth
                                            type="text"
                                            inputProps={{
                                                maxLength: 4,
                                            }}
                                        />
                                    </>
                                )}
                            </Box>
                            <TextField
                                label="Description"
                                value={exp.description}
                                onChange={(e) => handleExperienceChange(index, 'description', e.target.value)}
                                fullWidth
                                multiline
                                rows={3}
                                sx={{ gridColumn: '1 / -1' }}
                            />
                        </Box>
                    </Box>
                ))}
                <Button startIcon={<AddIcon />} onClick={addExperience}>
                    Add Experience
                </Button>
            </TabPanel>

            {/* Projects Tab */}
            <TabPanel value={currentTab} index={4}>
                {resumeData.projects.map((project, index) => (
                    <Box key={index} sx={{ mb: 3, position: 'relative' }}>
                        <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, position: 'relative' }}>
                            <TextField
                                label="Project Name"
                                value={project.name}
                                onChange={(e) => handleProjectChange(index, 'name', e.target.value)}
                                fullWidth
                            />
                            <Box sx={{ display: 'flex', alignItems: 'start', gap: 1 }}>
                                <TextField
                                    label="Role"
                                    value={project.role}
                                    onChange={(e) => handleProjectChange(index, 'role', e.target.value)}
                                    fullWidth
                                />
                                <IconButton
                                    onClick={() => removeProject(index)}
                                    sx={{ mt: 1 }}
                                    size="small"
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </Box>
                            <TextField
                                label="Description"
                                value={project.description}
                                onChange={(e) => handleProjectChange(index, 'description', e.target.value)}
                                fullWidth
                                multiline
                                rows={3}
                                sx={{ gridColumn: '1 / -1' }}
                            />
                        </Box>
                    </Box>
                ))}
                <Button startIcon={<AddIcon />} onClick={addProject}>
                    Add Project
                </Button>
            </TabPanel>

            {/* Education Tab */}
            <TabPanel value={currentTab} index={5}>
                {resumeData.education.map((edu, index) => (
                    <Box key={index} sx={{ mb: 3, position: 'relative' }}>
                        <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, position: 'relative' }}>
                            <TextField
                                label="Institution"
                                value={edu.institution}
                                onChange={(e) => handleEducationChange(index, 'institution', e.target.value)}
                                fullWidth
                            />
                            <Box sx={{ display: 'flex', alignItems: 'start', gap: 1 }}>
                                <TextField
                                    label="Degree"
                                    value={edu.degree}
                                    onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                                    fullWidth
                                />
                                <IconButton
                                    onClick={() => removeEducation(index)}
                                    sx={{ mt: 1 }}
                                    size="small"
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </Box>
                            <TextField
                                label="Year"
                                value={edu.year}
                                onChange={(e) => handleEducationChange(index, 'year', e.target.value)}
                                fullWidth
                                placeholder="MONTH YYYY - MONTH YYYY"
                            />
                        </Box>
                    </Box>
                ))}
                <Button startIcon={<AddIcon />} onClick={addEducation}>
                    Add Education
                </Button>
            </TabPanel>

            {/* Skills Tab */}
            <TabPanel value={currentTab} index={6}>
                <PresetManager
                    fieldId="skills"
                    value={resumeData.skills.join(', ')}
                    onValueChange={(value) => {
                        const skillsArray = value.split(',').map(skill => skill.trim()).filter(skill => skill !== '');
                        onUpdateResume({
                            ...resumeData,
                            skills: skillsArray.length > 0 ? skillsArray : ['']
                        });
                    }}
                    label="Skills Presets"
                    placeholder="Enter a name for this skills preset"
                />
                {resumeData.skills.map((skill, index) => (
                    <Box key={index} sx={{ mb: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
                        <TextField
                            label={`Skill ${index + 1}`}
                            value={skill}
                            onChange={(e) => handleSkillChange(index, e.target.value)}
                            fullWidth
                            placeholder="e.g., JavaScript, Python, Project Management"
                        />
                        <IconButton
                            onClick={() => removeSkill(index)}
                            size="small"
                        >
                            <DeleteIcon />
                        </IconButton>
                    </Box>
                ))}
                <Button startIcon={<AddIcon />} onClick={addSkill}>
                    Add Skill
                </Button>
            </TabPanel>
        </Paper>
    );
}

export default ResumeForm;