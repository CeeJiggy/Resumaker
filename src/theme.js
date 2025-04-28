import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#0095D8',
        },
        text: {
            primary: '#333333',
            secondary: '#666666',
        },
    },
    typography: {
        fontFamily: [
            'League Spartan',
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Oxygen',
            'Ubuntu',
            'Cantarell',
            '"Fira Sans"',
            '"Droid Sans"',
            '"Helvetica Neue"',
            'sans-serif',
        ].join(','),
        h3: {
            fontFamily: 'League Spartan',
            fontWeight: 700,
        },
        h4: {
            fontFamily: 'League Spartan',
            fontWeight: 600,
            color: '#0095D8',
            textTransform: 'uppercase',
            marginBottom: '1rem',
        },
        h5: {
            fontFamily: 'League Spartan',
            fontWeight: 500,
            marginBottom: '0.5rem',
        },
        body1: {
            fontFamily: 'League Spartan',
            fontSize: '1rem',
            lineHeight: 1.6,
        },
        body2: {
            fontFamily: 'League Spartan',
            fontSize: '0.875rem',
            color: '#666666',
        },
    },
    components: {
        MuiPaper: {
            styleOverrides: {
                root: {
                    padding: '2rem',
                    backgroundColor: '#ffffff',
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    fontWeight: 500,
                    fontFamily: 'League Spartan',
                },
            },
        },
    },
});

export default theme; 