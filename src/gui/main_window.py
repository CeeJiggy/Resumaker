import tkinter as tk
from tkinter import ttk
from src.gui.forms.resume_form import ResumeForm
from src.gui.forms.personal_info_form import PersonalInfoForm
from src.gui.forms.work_experience_form import WorkExperienceForm
from src.gui.forms.skills_form import SkillsForm

class MainWindow:
    def __init__(self, root):
        self.root = root
        self.root.title("ResuMaker")
        self.root.geometry("800x600")
        
        # Create notebook for tabs
        self.notebook = ttk.Notebook(root)
        self.notebook.pack(expand=True, fill='both', padx=10, pady=10)
        
        # Create Resume tab (now a selection interface)
        self.resume_frame = ttk.Frame(self.notebook)
        self.resume_form = ResumeForm(self.resume_frame)
        self.resume_form.pack(expand=True, fill='both', padx=10, pady=10)
        self.notebook.add(self.resume_frame, text='Resume')
        
        # Create Cover Letter tab (placeholder for now)
        self.cover_letter_frame = ttk.Frame(self.notebook)
        ttk.Label(self.cover_letter_frame, text="Cover Letter functionality coming soon!").pack(expand=True)
        self.notebook.add(self.cover_letter_frame, text='Cover Letter')

        # Create Personal Information tab
        self.personal_info_frame = ttk.Frame(self.notebook)
        self.personal_info_form = PersonalInfoForm(self.personal_info_frame)
        self.personal_info_form.pack(expand=True, fill='both', padx=10, pady=10)
        self.notebook.add(self.personal_info_frame, text='Personal Information')
        
        # Create Work Experience tab
        self.work_experience_frame = ttk.Frame(self.notebook)
        self.work_experience_form = WorkExperienceForm(self.work_experience_frame)
        self.work_experience_form.pack(expand=True, fill='both', padx=10, pady=10)
        self.notebook.add(self.work_experience_frame, text='Work Experience')
        
        # Create Skills tab
        self.skills_frame = ttk.Frame(self.notebook)
        self.skills_form = SkillsForm(self.skills_frame)
        self.skills_form.pack(expand=True, fill='both', padx=10, pady=10)
        self.notebook.add(self.skills_frame, text='Skills')
        
        # Add Templates tab
        self.templates_tab = ttk.Frame(self.notebook)
        ttk.Label(self.templates_tab, text="Manage Templates").pack(pady=20)
        self.notebook.add(self.templates_tab, text="Templates")
        
        # Add Content tab
        self.content_tab = ttk.Frame(self.notebook)
        ttk.Label(self.content_tab, text="Manage Content").pack(pady=20)
        self.notebook.add(self.content_tab, text="Content")