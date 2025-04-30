import { useState, useEffect, useCallback } from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import ResumeForm from './components/ResumeForm'
import ResumePreview from './components/ResumePreview'
import { Button, Typography, Stack } from '@mui/material'
import { signInWithGoogle, logout, onAuthStateChange } from './services/auth'
import { getResume, saveResume, getPresets, savePreset } from './services/firestore'
import PrintIcon from '@mui/icons-material/Print'

const theme = createTheme({
  palette: {
    primary: {
      main: '#0095D8',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: 'League Spartan, sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
    },
    h2: {
      fontSize: '1.75rem',
      fontWeight: 600,
      color: '#0095D8',
    },
    button: {
      fontFamily: 'League Spartan, sans-serif',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          fontFamily: 'League Spartan, sans-serif',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiInputBase-root': {
            fontFamily: 'League Spartan, sans-serif',
          },
          '& .MuiInputLabel-root': {
            fontFamily: 'League Spartan, sans-serif',
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          fontFamily: 'League Spartan, sans-serif',
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontFamily: 'League Spartan, sans-serif',
        },
      },
    },
  },
})

const initialResumeData = {
  config: {
    sections: {
      summary: true,
      experience: true,
      education: true,
      skills: true,
      projects: true
    },
    style: {
      primaryColor: '#0095D8',
      fontSize: 'normal',
      fontWeight: 'normal'
    },
    contact: {
      showEmail: true,
      showPhone: true,
      showWebsite: true,
      address: {
        showStreet: false,
        showApt: false,
        showCity: true,
        showState: true,
        showZip: false,
        showCountry: false
      }
    },
    selectedPresets: {
      summary: 'Default',
      experience: 'Default',
      education: 'Default',
      skills: 'Default',
      projects: 'Default'
    }
  },
  personalInfo: {
    name: '',
    email: '',
    phone: '',
    website: '',
    location: {
      street: '',
      apt: '',
      city: '',
      state: '',
      zip: '',
      country: ''
    }
  },
  summary: '',
  experience: [
    {
      company: '',
      position: '',
      startDate: {
        month: '',
        year: ''
      },
      endDate: {
        month: '',
        year: ''
      },
      isCurrentJob: false,
      description: '',
    },
  ],
  education: [
    {
      institution: '',
      degree: '',
      year: '',
    },
  ],
  skills: [''],
  projects: [
    {
      name: '',
      role: '',
      description: '',
    },
  ],
}

function App() {
  const [user, setUser] = useState(null);
  const [resumeData, setResumeData] = useState(initialResumeData);
  const [isPreview, setIsPreview] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChange((user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      const loadResumeData = async () => {
        try {
          const savedData = await getResume(user.uid);
          if (savedData) {
            setResumeData(savedData);

            // Create default presets if they don't exist
            const sections = ['summary', 'experience', 'education', 'skills', 'projects'];
            for (const section of sections) {
              const presets = await getPresets(user.uid, section);
              if (!presets || presets.length === 0) {
                const defaultPreset = {
                  name: 'Default',
                  value: section === 'skills' ? [''] : section === 'experience' ? [{
                    company: '',
                    position: '',
                    startDate: { month: '', year: '' },
                    endDate: { month: '', year: '' },
                    isCurrentJob: false,
                    description: ''
                  }] : section === 'education' ? [{
                    institution: '',
                    degree: '',
                    year: ''
                  }] : section === 'projects' ? [{
                    name: '',
                    role: '',
                    description: ''
                  }] : ''
                };
                await savePreset(user.uid, section, defaultPreset);
              }
            }
          } else {
            // If no saved data exists, create default presets
            const sections = ['summary', 'experience', 'education', 'skills', 'projects'];
            for (const section of sections) {
              const defaultPreset = {
                name: 'Default',
                value: section === 'skills' ? [''] : section === 'experience' ? [{
                  company: '',
                  position: '',
                  startDate: { month: '', year: '' },
                  endDate: { month: '', year: '' },
                  isCurrentJob: false,
                  description: ''
                }] : section === 'education' ? [{
                  institution: '',
                  degree: '',
                  year: ''
                }] : section === 'projects' ? [{
                  name: '',
                  role: '',
                  description: ''
                }] : ''
              };
              await savePreset(user.uid, section, defaultPreset);
            }
            setResumeData(initialResumeData);
          }
        } catch (error) {
          console.error('Error loading resume data:', error);
        }
      };
      loadResumeData();
    }
  }, [user]);

  const handleUpdateResume = (newData) => {
    setResumeData(newData);
  };

  const handleSaveToFirestore = useCallback(async (dataToSave) => {
    if (user) {
      try {
        await saveResume(user.uid, dataToSave || resumeData);
      } catch (error) {
        console.error('Error saving resume data:', error);
      }
    }
  }, [user, resumeData]);

  const togglePreview = () => {
    setIsPreview(!isPreview);
  };

  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await logout();
      setResumeData(initialResumeData);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Container maxWidth="lg" sx={{ py: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <Typography>Loading...</Typography>
          </Box>
        </Container>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ py: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
          <Typography variant="h4" fontWeight="bold" component="h1" sx={{
            textAlign: 'center',
            mb: 0,
            '@media print': {
              display: 'none'
            }
          }}>
            RESUMAKER
          </Typography>
          <Stack
            direction="row"
            spacing={2}
            flexWrap="wrap"
            alignItems="center"
            justifyContent="center"
            sx={{
              width: '100%',
              minHeight: '48px',
              top: 0,
              mb: 2,
              '@media print': {
                display: 'none'
              }
            }}
            className="no-print"
          >
            {user ? (
              <Stack direction="row" flexWrap="wrap" sx={{ justifyContent: 'center' }} alignItems="center">
                <Button
                  variant="contained"
                  onClick={togglePreview}
                  color="primary"
                  sx={{
                    margin: '10px 10px',
                    width: '140px'
                  }}
                >
                  {isPreview ? 'Back to Edit' : 'Preview Resume'}
                </Button>
                {isPreview && (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => window.print()}
                    startIcon={<PrintIcon />}
                    sx={{
                      margin: '10px 10px',
                    }}
                  >
                    Print Resume
                  </Button>
                )}
                <Button
                  variant="outlined"
                  onClick={handleSignOut}
                  sx={{
                    margin: '10px 10px',
                  }}
                >
                  Sign Out
                </Button>
              </Stack>
            ) : (
              <Button
                variant="contained"
                onClick={handleSignIn}
              >
                Sign In with Google
              </Button>
            )}
          </Stack>

          {user ? (
            <Box sx={{ width: '100%' }}>
              {isPreview ? (
                <ResumePreview
                  resumeData={resumeData}
                  user={user}
                />
              ) : (
                <ResumeForm
                  resumeData={resumeData}
                  onUpdateResume={handleUpdateResume}
                  onSaveToFirestore={handleSaveToFirestore}
                  user={user}
                />
              )}
            </Box>
          ) : (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
              <Typography variant="h5" align="center">
                Please sign in to create and manage your resume.
              </Typography>
            </Box>
          )}
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;
