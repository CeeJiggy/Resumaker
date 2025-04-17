import os
import sys
import json
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter, A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.units import inch
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase.pdfmetrics import registerFontFamily

class PDFGenerator:
    def __init__(self):
        self.styles = getSampleStyleSheet()
        self.settings = {'font': 'League Spartan'}  # Default settings
        self._register_fonts()
        self._setup_custom_styles()
        
        # Get the base directory for data storage
        if getattr(sys, 'frozen', False):
            # If running as executable
            self.base_dir = os.path.dirname(sys.executable)
        else:
            # If running as script
            self.base_dir = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
        
    def _register_fonts(self):
        """Register custom fonts for use in the PDF"""
        # Create fonts directory if it doesn't exist
        fonts_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "fonts")
        os.makedirs(fonts_dir, exist_ok=True)
        
        # Define font paths
        self.font_paths = {
            'LeagueSpartan-Regular': os.path.join(fonts_dir, 'LeagueSpartan-Regular.ttf'),
            'LeagueSpartan-Bold': os.path.join(fonts_dir, 'LeagueSpartan-Bold.ttf'),
            'LeagueSpartan-ExtraBold': os.path.join(fonts_dir, 'LeagueSpartan-ExtraBold.ttf'),
            'LeagueSpartan-ExtraLight': os.path.join(fonts_dir, 'LeagueSpartan-ExtraLight.ttf'),
            'LeagueSpartan-Medium': os.path.join(fonts_dir, 'LeagueSpartan-Medium.ttf'),
            'LeagueSpartan-SemiBold': os.path.join(fonts_dir, 'LeagueSpartan-SemiBold.ttf'),
            'LeagueSpartan-Thin': os.path.join(fonts_dir, 'LeagueSpartan-Thin.ttf'),
            'LeagueSpartan-Light': os.path.join(fonts_dir, 'LeagueSpartan-Light.ttf'),
            'LeagueSpartan-Black': os.path.join(fonts_dir, 'LeagueSpartan-Black.ttf')
        }
        
        # Register fonts with ReportLab
        try:
            for font_name, font_path in self.font_paths.items():
                if not os.path.exists(font_path):
                    print(f"Warning: Font file {font_path} not found. Using default font.")
                    continue
                pdfmetrics.registerFont(TTFont(font_name, font_path))
            
            # Register font family for League Spartan
            if all(os.path.exists(self.font_paths[f]) for f in ['LeagueSpartan-Regular', 'LeagueSpartan-Bold']):
                registerFontFamily('LeagueSpartan',
                    normal='LeagueSpartan-Regular',
                    bold='LeagueSpartan-Bold'
                )
                # Register additional weights individually since they can't be part of the family
                for font_name in self.font_paths.keys():
                    if os.path.exists(self.font_paths[font_name]):
                        pdfmetrics.registerFont(TTFont(font_name, self.font_paths[font_name]))
        except Exception as e:
            print(f"Warning: Could not register League Spartan font family: {str(e)}")
        
    def _setup_custom_styles(self):
        # Set up League Spartan fonts with fallback to Helvetica
        base_font = 'LeagueSpartan-Regular' if os.path.exists(self.font_paths['LeagueSpartan-Regular']) else 'Helvetica'
        bold_font = 'LeagueSpartan-Bold' if os.path.exists(self.font_paths['LeagueSpartan-Bold']) else 'Helvetica-Bold'
        medium_font = 'LeagueSpartan-Medium' if os.path.exists(self.font_paths['LeagueSpartan-Medium']) else base_font
        semibold_font = 'LeagueSpartan-SemiBold' if os.path.exists(self.font_paths['LeagueSpartan-SemiBold']) else bold_font
        
        # Name style at the top
        self.styles.add(ParagraphStyle(
            name='ResumeNameStyle',
            parent=self.styles['Normal'],
            fontName=bold_font,
            fontSize=36,
            leading=44,  # Increased leading for better spacing
            textColor=colors.Color(0.2, 0.2, 0.2),  # Dark gray
            spaceAfter=6,  # Reduced space after name
            spaceBefore=0,
            alignment=0  # Left alignment
        ))
        
        # Professional Summary style
        self.styles.add(ParagraphStyle(
            name='ResumeSummaryStyle',
            parent=self.styles['Normal'],
            fontName=base_font,
            fontSize=11,
            leading=14,
            textColor=colors.Color(0.2, 0.2, 0.2),  # Dark gray
            spaceBefore=0,
            spaceAfter=20,
            alignment=0,  # Left alignment
            firstLineIndent=0,
            leftIndent=0
        ))
        
        # Contact info style (right-aligned)
        self.styles.add(ParagraphStyle(
            name='ResumeContactInfo',
            parent=self.styles['Normal'],
            fontName=base_font,
            fontSize=10,
            leading=14,
            alignment=0,  # Right aligned
            textColor=colors.Color(0.2, 0.2, 0.2),
            spaceBefore=0,
            spaceAfter=0
        ))
        
        # Section headers (like "EXPERIENCE", "SKILLS", etc.)
        self.styles.add(ParagraphStyle(
            name='ResumeSectionHeader',
            parent=self.styles['Normal'],
            fontName=bold_font,
            fontSize=12,
            leading=14,
            textColor=colors.Color(0, 0.584, 0.847),  # #0095d8
            spaceBefore=16,
            spaceAfter=8
        ))

        # Skills section header (left-aligned)
        self.styles.add(ParagraphStyle(
            name='ResumeSkillsHeader',
            parent=self.styles['ResumeSectionHeader'],
            alignment=0  # Left aligned
        ))
        
        # Company/Role headers
        self.styles.add(ParagraphStyle(
            name='ResumeJobHeader',
            parent=self.styles['Normal'],
            fontName=semibold_font,
            fontSize=11,
            leading=14,
            textColor=colors.Color(0.2, 0.2, 0.2),
            spaceBefore=12,
            spaceAfter=2
        ))

        # Skills text (left-aligned)
        self.styles.add(ParagraphStyle(
            name='ResumeSkillText',
            parent=self.styles['ResumeJobHeader'],
            alignment=0  # Left aligned
        ))
        
        # Dates and locations (gray text)
        self.styles.add(ParagraphStyle(
            name='ResumeDateLocation',
            parent=self.styles['Normal'],
            fontName=base_font,
            fontSize=10,
            leading=12,
            textColor=colors.Color(0.4, 0.4, 0.4),
            spaceAfter=6
        ))
        
        # Normal body text
        self.styles.add(ParagraphStyle(
            name='ResumeBodyText',
            parent=self.styles['Normal'],
            fontName=base_font,
            fontSize=10,
            leading=14,
            textColor=colors.Color(0.2, 0.2, 0.2),
            spaceAfter=6
        ))
        
    def generate_resume(self, settings, output_path):
        try:
            # Store settings for use in _setup_custom_styles
            self.settings = settings
            
            # Reset styles and set up with new settings
            self.styles = getSampleStyleSheet()
            self._setup_custom_styles()
            
            # Load data
            personal_info = self._load_personal_info()
            work_experiences = self._load_work_experiences()
            skills_data = self._load_skills()
            
            if not personal_info:
                raise ValueError("Personal information is required")
                
            # Create the document with proper margins
            margin_size = float(settings.get('margins', '1'))
            doc = SimpleDocTemplate(
                output_path,
                pagesize=letter if settings.get('page_size', 'Letter') == 'Letter' else A4,
                leftMargin=margin_size*inch,
                rightMargin=margin_size*inch,
                topMargin=margin_size*inch,
                bottomMargin=margin_size*inch
            )
            
            content = []
            
            # Calculate column widths
            available_width = doc.width
            left_col_width = available_width * 0.65  # 70% for left column
            right_col_width = available_width * 0.25  # 30% for right column
            
            # Create the name and summary content for the left column
            name_and_summary = [
                [Paragraph(personal_info.get('name', ''), self.styles['ResumeNameStyle'])],
                [Paragraph(settings.get('summary', ''), self.styles['ResumeSummaryStyle'])]
            ]
            
            # Create the contact info content
            contact_info = Paragraph(
                f"{personal_info.get('city', '')}, {personal_info.get('state', '')}<br/>"
                f"{personal_info.get('phone', '')}<br/>"
                f'<link href="{personal_info.get("email", "")}">{personal_info.get("email", "")}</link><br/>'
                f'<link href="{personal_info.get("website", "")}">{personal_info.get("website", "")}</link>',
                self.styles['ResumeContactInfo']
            )
            
            # Create a table for the header that spans the full width
            header_table = Table([
                [
                    # Left column with name and summary
                    Table(
                        name_and_summary,
                        colWidths=[left_col_width],
                        style=[
                            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
                            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
                            ('LEFTPADDING', (0, 0), (-1, -1), 0),
                            ('RIGHTPADDING', (0, 0), (-1, -1), 0),
                            ('TOPPADDING', (0, 0), (-1, -1), 0),
                            ('BOTTOMPADDING', (0, 0), (-1, -1), 0),
                        ]
                    ),
                    # Right column with contact info
                    Table(
                        [[contact_info]],
                        colWidths=[right_col_width],
                        style=[
                            ('ALIGN', (0, 0), (-1, -1), 'RIGHT'),
                            ('VALIGN', (0, 0), (-1, -1), 'BOTTOM'),  # Align to bottom
                            ('LEFTPADDING', (0, 0), (-1, -1), 0),
                            ('RIGHTPADDING', (0, 0), (-1, -1), 0),
                            ('TOPPADDING', (0, 0), (-1, -1), 0),
                            ('BOTTOMPADDING', (0, 0), (-1, -1), 0),
                        ]
                    )
                ]
            ], colWidths=[left_col_width, right_col_width])
            
            header_table.setStyle(TableStyle([
                ('VALIGN', (0, 0), (-1, -1), 'BOTTOM'),  # Align entire row to bottom
                ('ALIGN', (0, 0), (0, 0), 'LEFT'),
                ('ALIGN', (1, 0), (1, 0), 'RIGHT'),
                ('LEFTPADDING', (0, 0), (-1, -1), 0),
                ('RIGHTPADDING', (0, 0), (-1, -1), 0),
                ('TOPPADDING', (0, 0), (-1, -1), 0),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 0),
            ]))
            
            content.append(header_table)
            content.append(Spacer(1, 0.2*inch))

            # Create two-column layout
            # Left column: Experience
            left_column = []
            left_column.append(Paragraph("EXPERIENCE", self.styles['ResumeSectionHeader']))
            
            selected_experiences = settings.get('selected_experiences', [])
            filtered_experiences = [exp for exp in work_experiences 
                                if f"{exp['company']} - {exp['job_title']}" in selected_experiences]
            
            for exp in filtered_experiences:
                # Company and role
                left_column.append(Paragraph(
                    f"{exp['company']} | {exp.get('location', '')} — <i>{exp['job_title']}</i>",
                    self.styles['ResumeJobHeader']
                ))
                
                # Dates
                left_column.append(Paragraph(
                    f"{exp['start_date']} - {exp['end_date']}",
                    self.styles['ResumeDateLocation']
                ))
                
                # Responsibilities
                if exp.get('responsibilities'):
                    responsibilities = exp['responsibilities'].split('\n')
                    for resp in responsibilities:
                        if resp.strip():
                            left_column.append(Paragraph(
                                f"• {resp.strip()}",
                                self.styles['ResumeBodyText']
                            ))
                    
                left_column.append(Spacer(1, 0.1*inch))

            # Right column: Skills
            right_column = []
            if skills_data:
                right_column.append(Paragraph("SKILLS", self.styles['ResumeSkillsHeader']))
                for main_skill, subskills in skills_data.items():
                    # Add main skill
                    right_column.append(Paragraph(
                        main_skill,
                        self.styles['ResumeSkillText']
                    ))
                    # Add subskills if they exist
                    if subskills:
                        for subskill in subskills:
                            right_column.append(Paragraph(
                                f"- {subskill}",
                                self.styles['ResumeSkillText']
                            ))
                    right_column.append(Spacer(1, 0.1*inch))

            # Create the two-column layout table
            table_data = [[
                Table([[para] for para in left_column], colWidths=[left_col_width]),
                Table([[para] for para in right_column], colWidths=[right_col_width])
            ]]
            
            main_table = Table(table_data, colWidths=[left_col_width, right_col_width], spaceBefore=0)
            main_table.setStyle(TableStyle([
                ('VALIGN', (0, 0), (-1, -1), 'TOP'),
                ('ALIGN', (0, 0), (0, 0), 'LEFT'),
                ('ALIGN', (1, 0), (1, 0), 'RIGHT'),  # Right align skills column
                ('LEFTPADDING', (0, 0), (-1, -1), 0),
                ('RIGHTPADDING', (0, 0), (-1, -1), 0),
                ('TOPPADDING', (0, 0), (-1, -1), 0),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 0),
            ]))
            
            content.append(main_table)
            
            # Build the PDF
            doc.build(content)
            
        except Exception as e:
            print("Error in generate_resume:", str(e))
            import traceback
            print("Error details:", traceback.format_exc())
            raise
        
    def _load_personal_info(self):
        data_file = os.path.join(self.base_dir, "data", "personal_info.json")
        
        if not os.path.exists(data_file):
            return None
            
        try:
            with open(data_file, 'r') as f:
                return json.load(f)
        except Exception:
            return None
            
    def _load_work_experiences(self):
        data_file = os.path.join(self.base_dir, "data", "work_experience.json")
        
        if not os.path.exists(data_file):
            return []
            
        try:
            with open(data_file, 'r') as f:
                return json.load(f)
        except Exception:
            return []

    def _load_skills(self):
        """Load skills data from JSON file"""
        data_file = os.path.join(self.base_dir, "data", "skills.json")
        
        if not os.path.exists(data_file):
            return {}
            
        try:
            with open(data_file, 'r') as f:
                return json.load(f)
        except Exception:
            return {} 