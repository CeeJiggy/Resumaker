# ResuMaker

A desktop application for generating customized resumes and cover letters from templates.

## Features

- Pre-made templates for resumes and cover letters
- Customizable content chunks
- Job-specific customization
- Export to editable PDFs
- Local storage of templates and content

## Setup

1. Create a virtual environment:
```bash
python -m venv venv
```

2. Activate the virtual environment:
- Windows:
```bash
.\venv\Scripts\activate
```
- Unix/MacOS:
```bash
source venv/bin/activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Run the application:
```bash
python src/main.py
```

## Project Structure

```
resumaker/
├── src/
│   ├── main.py                 # Application entry point
│   ├── gui/                    # GUI components
│   ├── templates/              # Document templates
│   ├── content/               # Content chunks
│   ├── pdf/                   # PDF generation
│   └── database/              # Database management
├── requirements.txt           # Project dependencies
└── README.md                 # This file
``` 