import React from 'react';
import {
    Paper,
    Typography,
    Button,
    Box,
    Link,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import PrintIcon from '@mui/icons-material/Print';

const StyledPaper = styled(Paper)(() => ({
    width: '8.5in',
    minHeight: '11in',
    margin: '0 auto',
    padding: '3rem 1in 3rem 1in',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#fff',
    '@media screen and (max-width: 8.5in)': {
        width: '100%',
        margin: '0 1rem',
        padding: '2rem 0.5in',
        transform: 'scale(1)',
        transformOrigin: 'top center',
        minHeight: 'auto'
    },
    '@media print': {
        margin: 0,
        padding: '0.75in 0.75in',
        boxShadow: 'none',
        transform: 'none',
        '@page': {
            size: 'letter',
            margin: 0
        },
    }
}));

const Section = styled(Box)(() => ({
    marginBottom: '1.5rem',
}));

const SectionTitle = styled(Typography)(() => ({
    fontFamily: 'League Spartan',
    color: '#0095D8',
    fontSize: '1.2rem',
    fontWeight: 600,
    marginBottom: '1rem',
    textTransform: 'uppercase',
}));

const DateRange = styled(Typography)(() => ({
    fontFamily: 'League Spartan',
    color: '#666',
    fontSize: '0.9rem',
    fontWeight: 500,
    textTransform: 'uppercase',
}));

const CompanyName = styled(Typography)(() => ({
    fontFamily: 'League Spartan',
    fontSize: '1rem',
    fontWeight: 600,
}));

const JobTitle = styled(Typography)(() => ({
    fontFamily: 'League Spartan',
    fontSize: '1rem',
    fontWeight: 500,
    fontStyle: 'italic',
}));

const ResumePreview = ({ resumeData }) => {
    const handlePrint = () => {
        window.print();
    };

    const formatPhoneNumber = (phoneNumber) => {
        // Remove all non-numeric characters
        const cleaned = phoneNumber.replace(/\D/g, '');

        // Check if the input is of correct length
        const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);

        if (match) {
            return `(${match[1]})-${match[2]}-${match[3]}`;
        }

        // If the number doesn't match the expected format, return the original
        return phoneNumber;
    };

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
        const { address } = resumeData.config.contact;
        const addressParts = [];

        if (address.showStreet && location.street) {
            addressParts.push(location.street);
        }
        if (address.showApt && location.apt) {
            addressParts.push(location.apt);
        }
        if (address.showCity && location.city) {
            addressParts.push(location.city);
        }
        if (address.showState && location.state) {
            addressParts.push(location.state);
        }
        if (address.showZip && location.zip) {
            addressParts.push(location.zip);
        }
        if (address.showCountry && location.country) {
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

    // Helper to get the value for a section, using preset if selected
    const getSectionValue = (sectionKey, defaultValue) => {
        const selected = resumeData.config.selectedPresets?.[sectionKey];
        if (selected && selected !== 'current') {
            const stored = localStorage.getItem(`presets-${sectionKey}`);
            if (stored) {
                const preset = JSON.parse(stored).find(p => p.name === selected);
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
            }
        }
        return defaultValue;
    };

    return (
        <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column',
            width: '100%',
            '@media screen': {
                mx: 'auto',
                px: { xs: 1, sm: 2 },
                maxWidth: '8.5in'
            },
            '@media print': {
                '& > *:not(#resume-preview)': {
                    display: 'none !important'
                },
                backgroundColor: '#fff',
                margin: 0,
                padding: 0,
                maxWidth: 'none',
                overflow: 'visible'
            }
        }}>
            <Button
                variant="contained"
                color="primary"
                onClick={handlePrint}
                startIcon={<PrintIcon />}
                className="print-button"
                sx={{
                    mb: 2,
                    '@media print': {
                        display: 'none !important'
                    }
                }}
            >
                Print Resume
            </Button>

            <StyledPaper id="resume-preview">
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
                        width: '110%',
                        justifySelf: 'center',
                        height: '3px',
                        background: `linear-gradient(90deg, transparent 0%, ${resumeData.config.style.primaryColor} 20%, ${resumeData.config.style.primaryColor} 80%, transparent 100%)`,
                        marginBottom: '0.5rem'
                    }} />
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
                                        {formatPhoneNumber(resumeData.personalInfo.phone)}
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
                                    <Typography color="textSecondary">|</Typography>
                                </>
                            )}
                            {resumeData.config.contact.showEmail && resumeData.personalInfo.email && (
                                <Typography
                                    variant="subtitle1"
                                    sx={{ color: resumeData.config.style.primaryColor }}
                                >
                                    {resumeData.personalInfo.email}
                                </Typography>
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
                                    pl: 2,
                                    position: 'relative',
                                    '&::before': {
                                        content: '"•"',
                                        position: 'absolute',
                                        left: 0,
                                    }
                                }}>
                                    {exp.description}
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
    );
};

export default ResumePreview; 