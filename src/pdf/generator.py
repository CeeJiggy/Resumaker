from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.units import inch

class PDFGenerator:
    def __init__(self):
        self.styles = getSampleStyleSheet()
        self._setup_custom_styles()
        
    def _setup_custom_styles(self):
        # Add custom styles with unique names
        self.styles.add(ParagraphStyle(
            name='ResumeTitle',
            parent=self.styles['Heading1'],
            fontSize=24,
            spaceAfter=30
        ))
        
        self.styles.add(ParagraphStyle(
            name='ResumeSectionHeader',
            parent=self.styles['Heading2'],
            fontSize=16,
            spaceAfter=12
        ))
        
        self.styles.add(ParagraphStyle(
            name='ResumeBodyText',
            parent=self.styles['Normal'],
            fontSize=11,
            spaceAfter=6
        ))
    
    def generate_resume(self, data, output_path):
        doc = SimpleDocTemplate(
            output_path,
            pagesize=letter,
            rightMargin=72,
            leftMargin=72,
            topMargin=72,
            bottomMargin=72
        )
        
        # Create the story (content) for the PDF
        story = []
        
        # Add name
        story.append(Paragraph(data['name'], self.styles['ResumeTitle']))
        
        # Add contact information
        contact_info = f"{data['email']} | {data['phone']} | {data['location']}"
        story.append(Paragraph(contact_info, self.styles['ResumeBodyText']))
        story.append(Spacer(1, 12))
        
        # Add professional summary
        story.append(Paragraph("Professional Summary", self.styles['ResumeSectionHeader']))
        story.append(Paragraph(data['summary'], self.styles['ResumeBodyText']))
        story.append(Spacer(1, 12))
        
        # Add work experience
        story.append(Paragraph("Work Experience", self.styles['ResumeSectionHeader']))
        experience = f"<b>{data['position']}</b> at {data['company']} ({data['duration']})"
        story.append(Paragraph(experience, self.styles['ResumeBodyText']))
        story.append(Paragraph(data['responsibilities'], self.styles['ResumeBodyText']))
        story.append(Spacer(1, 12))
        
        # Add education
        story.append(Paragraph("Education", self.styles['ResumeSectionHeader']))
        education = f"<b>{data['degree']}</b> - {data['school']} ({data['graduation_year']})"
        story.append(Paragraph(education, self.styles['ResumeBodyText']))
        story.append(Spacer(1, 12))
        
        # Add skills
        story.append(Paragraph("Skills", self.styles['ResumeSectionHeader']))
        skills_text = "<br/>".join([f"• {skill}" for skill in data['skills'] if skill.strip()])
        story.append(Paragraph(skills_text, self.styles['ResumeBodyText']))
        
        # Build the PDF
        doc.build(story) 