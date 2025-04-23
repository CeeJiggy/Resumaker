import { useState, useEffect } from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import ResumeForm from './components/ResumeForm'
import ResumePreview from './components/ResumePreview'
import { Button } from '@mui/material'

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
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
    },
    h2: {
      fontSize: '1.75rem',
      fontWeight: 600,
      color: '#0095D8',
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
  const [resumeData, setResumeData] = useState(() => {
    const savedData = localStorage.getItem('resumeData')
    if (savedData) {
      const parsedData = JSON.parse(savedData)

      // Convert old experience format to new format if necessary
      const migratedExperience = parsedData.experience?.map(exp => {
        if (exp.duration && !exp.startDate) {
          // If we have old format with just duration, create empty date structure
          return {
            ...exp,
            startDate: { month: '', year: '' },
            endDate: { month: '', year: '' },
            isCurrentJob: exp.duration?.toLowerCase().includes('present'),
            duration: undefined // Remove old duration field
          }
        }
        return {
          ...exp,
          startDate: exp.startDate || { month: '', year: '' },
          endDate: exp.endDate || { month: '', year: '' },
          isCurrentJob: exp.isCurrentJob || false
        }
      }) || []

      // Ensure all config properties exist by merging with initial config
      return {
        ...initialResumeData,
        ...parsedData,
        experience: migratedExperience,
        config: {
          ...initialResumeData.config,
          ...parsedData.config,
          sections: {
            ...initialResumeData.config.sections,
            ...(parsedData.config?.sections || {})
          },
          style: {
            ...initialResumeData.config.style,
            ...(parsedData.config?.style || {})
          },
          contact: {
            ...initialResumeData.config.contact,
            ...(parsedData.config?.contact || {})
          }
        }
      }
    }
    return initialResumeData
  })

  const [isPreview, setIsPreview] = useState(false)

  useEffect(() => {
    localStorage.setItem('resumeData', JSON.stringify(resumeData))
  }, [resumeData])

  const handleUpdateResume = (newData) => {
    setResumeData(newData)
  }

  const togglePreview = () => {
    setIsPreview(!isPreview)
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ py: 2 }}>
        <Box>
          <Button
            variant="contained"
            onClick={togglePreview}
            sx={{ mb: 2 }}
          >
            {isPreview ? 'Back to Edit' : 'Preview Resume'}
          </Button>

          {isPreview ? (
            <ResumePreview resumeData={resumeData} />
          ) : (
            <ResumeForm
              resumeData={resumeData}
              onUpdateResume={handleUpdateResume}
            />
          )}
        </Box>
      </Container>
    </ThemeProvider>
  )
}

export default App
