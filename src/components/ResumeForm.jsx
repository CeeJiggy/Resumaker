import { useState, useEffect } from 'react';
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
import SettingsIcon from '@mui/icons-material/Settings';
import PersonIcon from '@mui/icons-material/Person';
import DescriptionIcon from '@mui/icons-material/Description';
import WorkIcon from '@mui/icons-material/Work';
import BuildIcon from '@mui/icons-material/Build';
import SchoolIcon from '@mui/icons-material/School';
import StarIcon from '@mui/icons-material/Star';
import Experience from './Experience';
import Education from './Education';
import Projects from './Projects';
import Skills from './Skills';
import Summary from './Summary';
import { getAllPresets } from '../services/firestore';

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
                maxHeight: '70vh',
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

const ResumeForm = ({ resumeData, onUpdateResume, onSaveToFirestore, user }) => {
    const [currentTab, setCurrentTab] = useState(0);
    const [sectionPresets, setSectionPresets] = useState({});
    const theme = useTheme();
    const isSmall = useMediaQuery(theme.breakpoints.down('sm'));

    useEffect(() => {
        const loadPresets = async () => {
            if (user) {
                try {
                    const allPresets = await getAllPresets(user.uid);
                    setSectionPresets(allPresets || {});
                } catch (error) {
                    console.error('Error loading presets:', error);
                }
            }
        };
        loadPresets();
    }, [user]);

    const handleTabChange = (event, newValue) => {
        setCurrentTab(newValue);
    };

    const handlePersonalInfoChange = (field, value) => {
        onUpdateResume({
            ...resumeData,
            personalInfo: {
                ...resumeData.personalInfo,
                [field]: value
            }
        });
    };

    const handlePersonalInfoBlur = () => {
        onSaveToFirestore(resumeData);
    };

    const handleExperienceChange = (index, field, value) => {
        const newExperience = [...resumeData.experience];

        if (field === 'startDate' || field === 'endDate') {
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
            experience: newExperience
        });
    };

    const handleExperienceBlur = () => {
        onSaveToFirestore(resumeData);
    };

    const handleEducationChange = (index, field, value) => {
        const newEducation = [...resumeData.education];
        newEducation[index] = {
            ...newEducation[index],
            [field]: value
        };
        onUpdateResume({
            ...resumeData,
            education: newEducation
        });
    };

    const handleEducationBlur = () => {
        onSaveToFirestore(resumeData);
    };

    const handleProjectChange = (index, field, value) => {
        const newProjects = [...resumeData.projects];
        newProjects[index] = {
            ...newProjects[index],
            [field]: value
        };
        onUpdateResume({
            ...resumeData,
            projects: newProjects
        });
    };

    const handleProjectBlur = () => {
        onSaveToFirestore(resumeData);
    };

    const handleSkillsChange = (index, value) => {
        const newSkills = [...resumeData.skills];
        newSkills[index] = value;
        onUpdateResume({
            ...resumeData,
            skills: newSkills
        });
    };

    const removeSkill = (index) => {
        const newSkills = [...resumeData.skills];
        newSkills.splice(index, 1);
        if (newSkills.length === 0) {
            newSkills.push('');
        }
        // Create new resume data with updated skills
        const updatedResumeData = {
            ...resumeData,
            skills: newSkills
        };
        // Update state and then save to Firestore
        onUpdateResume(updatedResumeData);
        // Use the updated data directly when saving to Firestore
        onSaveToFirestore(updatedResumeData);
    };

    const addSkill = () => {
        onUpdateResume({
            ...resumeData,
            skills: [...resumeData.skills, '']
        });
    };

    const handleSkillBlur = () => {
        onSaveToFirestore(resumeData);
    };

    const addExperience = () => {
        onUpdateResume({
            ...resumeData,
            experience: [...resumeData.experience, {
                company: '',
                position: '',
                startDate: { month: '', year: '' },
                endDate: { month: '', year: '' },
                isCurrentJob: false,
                description: ''
            }]
        });
    };

    const addEducation = () => {
        onUpdateResume({
            ...resumeData,
            education: [...resumeData.education, {
                institution: '',
                degree: '',
                year: ''
            }]
        });
    };

    const addProject = () => {
        onUpdateResume({
            ...resumeData,
            projects: [...resumeData.projects, {
                name: '',
                role: '',
                description: ''
            }]
        });
    };

    const handleUpdate = (action) => {
        let newResumeData = { ...resumeData };

        switch (action.type) {
            case 'UPDATE_EXPERIENCE':
                newResumeData.experience = action.value;
                break;
            case 'UPDATE_EDUCATION':
                newResumeData.education = action.value;
                break;
            case 'UPDATE_PROJECTS':
                newResumeData.projects = action.value;
                break;
            case 'UPDATE_SKILLS':
                newResumeData.skills = action.value;
                break;
            case 'UPDATE_SUMMARY':
                newResumeData.summary = action.value;
                break;
            case 'REFRESH_PRESETS':
                // Reload presets when a new preset is saved
                loadPresets();
                return;
            default:
                console.warn('Unknown action type:', action.type);
                return;
        }

        onUpdateResume(newResumeData);
        onSaveToFirestore(newResumeData);
    };

    const loadPresets = async () => {
        if (user) {
            try {
                const allPresets = await getAllPresets(user.uid);
                setSectionPresets(allPresets || {});
            } catch (error) {
                console.error('Error loading presets:', error);
            }
        }
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
                    user={user}
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
                        onBlur={handlePersonalInfoBlur}
                    />
                    <TextField
                        fullWidth
                        label="Email"
                        value={resumeData.personalInfo.email}
                        onChange={(e) => handlePersonalInfoChange('email', e.target.value)}
                        onBlur={handlePersonalInfoBlur}
                    />
                    <TextField
                        fullWidth
                        label="Phone"
                        value={resumeData.personalInfo.phone}
                        onChange={(e) => handlePersonalInfoChange('phone', e.target.value)}
                        onBlur={handlePersonalInfoBlur}
                    />
                    <TextField
                        fullWidth
                        label="Website"
                        value={resumeData.personalInfo.website}
                        onChange={(e) => handlePersonalInfoChange('website', e.target.value)}
                        onBlur={handlePersonalInfoBlur}
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
                        onBlur={handlePersonalInfoBlur}
                    />
                    <TextField
                        fullWidth
                        label="Apartment/Suite"
                        value={resumeData.personalInfo.location.apt}
                        onChange={(e) => handlePersonalInfoChange('location', { ...resumeData.personalInfo.location, apt: e.target.value })}
                        onBlur={handlePersonalInfoBlur}
                    />
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label="City"
                                value={resumeData.personalInfo.location.city}
                                onChange={(e) => handlePersonalInfoChange('location', { ...resumeData.personalInfo.location, city: e.target.value })}
                                onBlur={handlePersonalInfoBlur}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label="State/Province"
                                value={resumeData.personalInfo.location.state}
                                onChange={(e) => handlePersonalInfoChange('location', { ...resumeData.personalInfo.location, state: e.target.value })}
                                onBlur={handlePersonalInfoBlur}
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
                                onBlur={handlePersonalInfoBlur}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label="Country"
                                value={resumeData.personalInfo.location.country}
                                onChange={(e) => handlePersonalInfoChange('location', { ...resumeData.personalInfo.location, country: e.target.value })}
                                onBlur={handlePersonalInfoBlur}
                            />
                        </Grid>
                    </Grid>
                </Stack>
            </TabPanel>

            {/* Professional Summary Tab */}
            <TabPanel value={currentTab} index={2}>
                <Summary
                    summary={resumeData.summary}
                    onUpdate={handleUpdate}
                    user={user}
                    presets={sectionPresets.summary || []}
                    resumeData={resumeData}
                />
            </TabPanel>

            {/* Experience Tab */}
            <TabPanel value={currentTab} index={3}>
                <Experience
                    experience={resumeData.experience}
                    onUpdate={handleUpdate}
                    user={user}
                    presets={sectionPresets.experience || []}
                    resumeData={resumeData}
                />
            </TabPanel>

            {/* Projects Tab */}
            <TabPanel value={currentTab} index={4}>
                <Projects
                    projects={resumeData.projects}
                    onUpdate={handleUpdate}
                    user={user}
                    presets={sectionPresets.projects || []}
                    resumeData={resumeData}
                />
            </TabPanel>

            {/* Education Tab */}
            <TabPanel value={currentTab} index={5}>
                <Education
                    education={resumeData.education}
                    onUpdate={handleUpdate}
                    user={user}
                    presets={sectionPresets.education || []}
                    resumeData={resumeData}
                />
            </TabPanel>

            {/* Skills Tab */}
            <TabPanel value={currentTab} index={6}>
                <Skills
                    skills={resumeData.skills}
                    onUpdate={handleUpdate}
                    user={user}
                    presets={sectionPresets.skills || []}
                    resumeData={resumeData}
                />
            </TabPanel>
        </Paper>
    );
}

export default ResumeForm;