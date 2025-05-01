import React, { useState, useEffect } from 'react';
import {
    Paper,
    Typography,
    Button,
    Box,
    Link,
    Grid,
    Divider,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import PrintIcon from '@mui/icons-material/Print';
import { getAllPresets } from '../services/firestore';

const StyledPaper = styled(Paper)(() => ({
    width: '8.5in',
    minHeight: '11in',
    padding: '0.75in 0.75in',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#fff',
    transformOrigin: 'center',
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    fontFamily: 'League Spartan, sans-serif',
    '& .MuiTypography-root': {
        fontFamily: 'League Spartan, sans-serif'
    },
    '& .MuiButton-root': {
        fontFamily: 'League Spartan, sans-serif'
    },
    '@media screen and (max-width: 1000px)': {
        transform: 'translate(-50%, -50%) scale(0.8)',
    },
    '@media screen and (max-width: 800px)': {
        transform: 'translate(-50%, -50%) scale(0.65)',
    },
    '@media screen and (max-width: 600px)': {
        transform: 'translate(-50%, -50%) scale(0.45)',
    },
    '@media screen and (max-width: 400px)': {
        transform: 'translate(-50%, -50%) scale(0.35)',
    },
    '@media print': {
        margin: 0,
        padding: '0.75in 0.75in',
        boxShadow: 'none',
        position: 'static',
        transform: 'none',
        '@page': {
            size: 'letter',
            margin: 0
        },
    }
}));

const Section = styled(Box)(() => ({
    marginBottom: '1.5rem',
    fontFamily: 'League Spartan, sans-serif',
}));

const SectionTitle = styled(Typography)(() => ({
    fontFamily: 'League Spartan, sans-serif',
    color: '#0095D8',
    fontSize: '1.2rem',
    fontWeight: 600,
    marginBottom: '1rem',
    textTransform: 'uppercase',
}));

const DateRange = styled(Typography)(() => ({
    fontFamily: 'League Spartan, sans-serif',
    color: '#666',
    fontSize: '0.9rem',
    fontWeight: 500,
    textTransform: 'uppercase',
}));

const CompanyName = styled(Typography)(() => ({
    fontFamily: 'League Spartan, sans-serif',
    fontSize: '1rem',
    fontWeight: 600,
}));

const JobTitle = styled(Typography)(() => ({
    fontFamily: 'League Spartan, sans-serif',
    fontSize: '1rem',
    fontWeight: 500,
    fontStyle: 'italic',
}));

const ResumePreview = ({ resumeData, user }) => {
    const [sectionPresets, setSectionPresets] = useState({});

    useEffect(() => {
        const loadPresets = async () => {
            if (user) {
                try {
                    const allPresets = await getAllPresets(user.uid);
                    setSectionPresets(allPresets);
                } catch (error) {
                    console.error('Error loading presets:', error);
                }
            }
        };
        loadPresets();
    }, [user]);

    const getFontSize = (baseSize) => {
        const scale = resumeData.config.style.fontSize === 'small' ? 0.9 :
            resumeData.config.style.fontSize === 'large' ? 1.1 : 1;
        return `${baseSize * scale}rem`;
    };

    const getFontWeight = () => {
        return resumeData.config.style.fontWeight === 'light' ? 300 :
            resumeData.config.style.fontWeight === 'bold' ? 600 : 400;
    };

    const renderAddress = () => {
        const { location } = resumeData.personalInfo;
        const addressParts = [];

        if (resumeData.config.contact.showStreet && location.street) {
            addressParts.push(location.street);
        }
        if (resumeData.config.contact.showApt && location.apt) {
            addressParts.push(location.apt);
        }
        if (resumeData.config.contact.showCity && location.city) {
            addressParts.push(location.city);
        }
        if (resumeData.config.contact.showState && location.state) {
            addressParts.push(location.state);
        }
        if (resumeData.config.contact.showZip && location.zip) {
            addressParts.push(location.zip);
        }
        if (resumeData.config.contact.showCountry && location.country) {
            addressParts.push(location.country);
        }

        return addressParts.join(', ');
    };

    const formatExperienceDate = (experience) => {
        const formatDate = (date) => {
            if (!date?.month && !date?.year) return '';
            if (!date?.month) return date.year;
            if (!date?.year) return date.month;
            return `${date.month} ${date.year}`;
        };

        const startDate = formatDate(experience.startDate);
        if (experience.isCurrentJob) {
            return startDate ? `${startDate} - Present` : '';
        }
        const endDate = formatDate(experience.endDate);
        return startDate || endDate ? `${startDate} - ${endDate}` : '';
    };

    const getSectionValue = (sectionKey, defaultValue) => {
        const selected = resumeData.config.selectedPresets?.[sectionKey];

        // If "current" is selected or no preset is selected, return the current value
        if (!selected || selected === 'current') {
            return defaultValue;
        }

        // Otherwise, look for the preset value
        const preset = sectionPresets?.[sectionKey]?.find(p => p.name === selected);
        if (preset) {
            let value = preset.value;
            if (sectionKey === 'skills') {
                if (typeof value === 'string') {
                    value = value.split(',').map(s => s.trim()).filter(Boolean);
                }
                if (!Array.isArray(value)) {
                    value = [];
                }
            }
            return value;
        }
        return defaultValue;
    };

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            position: 'relative',
            overflow: 'hidden',
            height: 'calc(11in + 5rem)',
            // paddingTop: '3.5rem',
            '@media screen': {
                mx: 'auto',
                px: { xs: 0, sm: 0 },
            },
            '@media screen and (max-width: 1000px)': {
                height: 'calc(11in * 0.8 + 5rem)',
            },
            '@media screen and (max-width: 800px)': {
                height: 'calc(11in * 0.65 + 5rem)',
            },
            '@media screen and (max-width: 600px)': {
                height: 'calc(11in * 0.45 + 5rem)',
            },
            '@media screen and (max-width: 400px)': {
                height: 'calc(11in * 0.35 + 5rem)',
            },
            '@media print': {
                height: 'auto',
                padding: 0,
                margin: 0,
                overflow: 'visible'
            }
        }}>
            <Box sx={{
                position: 'relative',
                height: '100%',
                width: '100%',
                pt: '0.5rem',
                '@media print': {
                    height: 'auto',
                    padding: 0,
                    position: 'static'
                }
            }}>
                <StyledPaper id="resume-preview" sx={{
                    '@media print': {
                        position: 'static',
                        transform: 'none',
                        margin: 0,
                        padding: '0.75in',
                        boxShadow: 'none',
                        width: '100%',
                        height: 'auto',
                        minHeight: 0
                    }
                }}>
                    {/* Header Section */}
                    <Section>
                        <Typography variant="h3" sx={{
                            fontFamily: 'League Spartan',
                            fontSize: getFontSize(2.5),
                            fontWeight: 700,
                            textAlign: 'center',
                            color: '#333',
                            mb: 0.5
                        }}>
                            {resumeData.personalInfo.name}
                        </Typography>

                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'flex-start',
                            gap: 2
                        }}>
                            <Box sx={{
                                textAlign: 'center',
                                fontSize: getFontSize(0.875),
                                fontFamily: 'League Spartan',
                                display: 'flex',
                                flexDirection: 'row',
                                gap: 1,
                                alignItems: 'center',
                                flexWrap: 'nowrap',
                                marginTop: '0px',
                                justifyContent: 'center',
                                width: '100%',
                                overflow: 'visible',
                                whiteSpace: 'nowrap'
                            }}>
                                {resumeData.config.contact.showLocation && renderAddress() && (
                                    <>
                                        <Typography variant="subtitle1" color="textSecondary">
                                            {renderAddress()}
                                        </Typography>
                                        <Typography color="textSecondary">|</Typography>
                                    </>
                                )}
                                {resumeData.config.contact.showPhone && resumeData.personalInfo.phone && (
                                    <>
                                        <Typography variant="subtitle1" color="textSecondary">
                                            {resumeData.personalInfo.phone}
                                        </Typography>
                                        <Typography color="textSecondary">|</Typography>
                                    </>
                                )}
                                {resumeData.config.contact.showEmail && resumeData.personalInfo.email && (
                                    <>
                                        <Typography
                                            variant="subtitle1"
                                            sx={{ color: resumeData.config.style.primaryColor }}
                                        >
                                            {resumeData.personalInfo.email}
                                        </Typography>
                                        <Typography color="textSecondary">|</Typography>

                                    </>
                                )}
                                {resumeData.config.contact.showWebsite && resumeData.personalInfo.website && (
                                    <>
                                        <Typography variant="subtitle1" color="textSecondary">
                                            <Link
                                                href={`https://${resumeData.personalInfo.website.replace(/^https?:\/\//, '')}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                sx={{
                                                    color: resumeData.config.style.primaryColor,
                                                    textDecoration: 'none'
                                                }}
                                            >
                                                {resumeData.personalInfo.website}
                                            </Link>
                                        </Typography>
                                    </>
                                )}

                            </Box>
                        </Box>

                        {resumeData.config.sections.summary && (
                            <Typography variant="body1" sx={{
                                textAlign: 'center',
                                color: '#333',
                                fontFamily: 'League Spartan',
                                fontSize: getFontSize(1),
                                fontWeight: getFontWeight(),
                                mt: 2,
                                maxWidth: '80%',
                                mx: 'auto'
                            }}>
                                {getSectionValue('summary', resumeData.summary)}
                            </Typography>
                        )}
                    </Section>

                    {/* Experience Section */}
                    {resumeData.config.sections.experience && (
                        <Section>
                            <SectionTitle sx={{ color: resumeData.config.style.primaryColor }}>
                                Experience
                            </SectionTitle>
                            {getSectionValue('experience', resumeData.experience).map((exp, index) => (
                                <Box key={index} sx={{ mb: 2 }}>
                                    <Box sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'baseline',
                                        mb: 0.5
                                    }}>
                                        <Box>
                                            <CompanyName component="span" sx={{ fontWeight: getFontWeight() }}>
                                                {exp.company}
                                            </CompanyName>
                                            {exp.position && (
                                                <>
                                                    <Typography component="span" sx={{ mx: 0.5 }}>|</Typography>
                                                    <JobTitle component="span" sx={{ fontWeight: getFontWeight() }}>
                                                        {exp.position}
                                                    </JobTitle>
                                                </>
                                            )}
                                        </Box>
                                        <DateRange sx={{ fontSize: getFontSize(0.9) }}>
                                            {formatExperienceDate(exp)}
                                        </DateRange>
                                    </Box>
                                    <Typography variant="body2" sx={{
                                        color: '#333',
                                        fontSize: getFontSize(0.875),
                                        fontWeight: getFontWeight(),
                                        pl: exp.descriptionFormat === 'bullets' ? 0 : 0,
                                        position: 'relative',
                                    }}>
                                        {exp.descriptionFormat === 'bullets' ? (
                                            <Box component="div" sx={{ pl: 2 }}>
                                                {exp.description.split('\n').map((bullet, i) => (
                                                    bullet.trim() && (
                                                        <Typography
                                                            key={i}
                                                            component="div"
                                                            sx={{
                                                                color: '#333',
                                                                fontSize: getFontSize(0.875),
                                                                fontWeight: getFontWeight(),
                                                                mb: 0.5,
                                                                position: 'relative',
                                                                pl: 2,
                                                                '&::before': {
                                                                    content: '"•"',
                                                                    position: 'absolute',
                                                                    left: 0,
                                                                }
                                                            }}
                                                        >
                                                            {bullet.replace(/^[•]\s*/, '')}
                                                        </Typography>
                                                    )
                                                ))}
                                            </Box>
                                        ) : (
                                            <Box sx={{ whiteSpace: 'pre-wrap' }}>
                                                {exp.description}
                                            </Box>
                                        )}
                                    </Typography>
                                </Box>
                            ))}
                        </Section>
                    )}

                    {/* Projects Section */}
                    {resumeData.config.sections.projects && getSectionValue('projects', resumeData.projects).length > 0 && (
                        <Section>
                            <SectionTitle sx={{ color: resumeData.config.style.primaryColor }}>
                                Projects
                            </SectionTitle>
                            {getSectionValue('projects', resumeData.projects).map((project, index) => (
                                <Box key={index} sx={{ mb: 2 }}>
                                    <Box sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'baseline',
                                        mb: 0.5
                                    }}>
                                        <Box>
                                            <CompanyName component="span" sx={{ fontWeight: getFontWeight() }}>
                                                {project.name}
                                            </CompanyName>
                                            {project.role && (
                                                <>
                                                    <Typography component="span" sx={{ mx: 0.5 }}>|</Typography>
                                                    <JobTitle component="span" sx={{ fontWeight: getFontWeight() }}>
                                                        {project.role}
                                                    </JobTitle>
                                                </>
                                            )}
                                        </Box>
                                    </Box>
                                    <Typography variant="body2" sx={{
                                        color: '#333',
                                        fontSize: getFontSize(0.875),
                                        fontWeight: getFontWeight(),
                                        pl: 2,
                                        position: 'relative',
                                        '&::before': {
                                            content: '"•"',
                                            position: 'absolute',
                                            left: 0,
                                        }
                                    }}>
                                        {project.description}
                                    </Typography>
                                </Box>
                            ))}
                        </Section>
                    )}

                    {/* Education Section */}
                    {resumeData.config.sections.education && (
                        <Section>
                            <SectionTitle sx={{ color: resumeData.config.style.primaryColor }}>
                                Education
                            </SectionTitle>
                            {getSectionValue('education', resumeData.education).map((edu, index) => (
                                <Box key={index} sx={{ mb: 1 }}>
                                    <Box sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'baseline'
                                    }}>
                                        <Box>
                                            <CompanyName component="span" sx={{ fontWeight: getFontWeight() }}>
                                                {edu.institution}
                                            </CompanyName>
                                            {edu.degree && (
                                                <>
                                                    <Typography component="span" sx={{ mx: 0.5 }}>|</Typography>
                                                    <JobTitle component="span" sx={{ fontWeight: getFontWeight() }}>
                                                        {edu.degree}
                                                    </JobTitle>
                                                </>
                                            )}
                                        </Box>
                                        <DateRange sx={{ fontSize: getFontSize(0.9) }}>
                                            {edu.year}
                                        </DateRange>
                                    </Box>
                                </Box>
                            ))}
                        </Section>
                    )}

                    {/* Skills Section */}
                    {resumeData.config.sections.skills && (
                        <Section>
                            <SectionTitle sx={{ color: resumeData.config.style.primaryColor }}>
                                Skills
                            </SectionTitle>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                {getSectionValue('skills', resumeData.skills).map((skill, idx) => (
                                    <Typography key={idx} variant="body2" sx={{
                                        background: resumeData.config.style.primaryColor,
                                        color: '#fff',
                                        px: 2,
                                        py: 0.5,
                                        borderRadius: 2,
                                        fontWeight: 500
                                    }}>
                                        {skill}
                                    </Typography>
                                ))}
                            </Box>
                        </Section>
                    )}
                </StyledPaper>
            </Box>
        </Box>
    );
};

export default ResumePreview; 