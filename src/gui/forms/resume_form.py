import tkinter as tk
from tkinter import ttk, messagebox
import json
import os

class ResumeForm(ttk.Frame):
    def __init__(self, parent):
        super().__init__(parent)
        self.data_file = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__)))), 
                                     "data", "resume_settings.json")
        self.init_ui()
        self.load_data()
        
    def init_ui(self):
        # Create main container with scrollbar
        container = ttk.Frame(self)
        container.pack(fill='both', expand=True, padx=10, pady=10)
        
        # Create canvas with scrollbar
        canvas = tk.Canvas(container)
        scrollbar = ttk.Scrollbar(container, orient="vertical", command=canvas.yview)
        self.scrollable_frame = ttk.Frame(canvas)
        
        self.scrollable_frame.bind(
            "<Configure>",
            lambda e: canvas.configure(scrollregion=canvas.bbox("all"))
        )
        
        canvas.create_window((0, 0), window=self.scrollable_frame, anchor="nw")
        canvas.configure(yscrollcommand=scrollbar.set)
        
        # Header
        header_frame = ttk.Frame(self.scrollable_frame)
        header_frame.pack(fill='x', pady=(0, 10))
        
        ttk.Label(header_frame, text="Resume Settings", font=("Arial", 12, "bold")).pack(side='left')
        ttk.Button(header_frame, text="Generate Resume", command=self.generate_resume).pack(side='right')
        
        # Content Sections
        sections_frame = ttk.LabelFrame(self.scrollable_frame, text="Content Sections")
        sections_frame.pack(fill='x', pady=5, padx=5)
        
        # Personal Information Section
        personal_frame = ttk.Frame(sections_frame)
        personal_frame.pack(fill='x', padx=5, pady=5)
        
        self.include_personal = tk.BooleanVar(value=True)
        ttk.Checkbutton(personal_frame, text="Include Personal Information", 
                       variable=self.include_personal).pack(side='left')
        
        # Work Experience Section
        experience_frame = ttk.Frame(sections_frame)
        experience_frame.pack(fill='x', padx=5, pady=5)
        
        self.include_experience = tk.BooleanVar(value=True)
        ttk.Checkbutton(experience_frame, text="Include Work Experience", 
                       variable=self.include_experience).pack(side='left')
        
        # Experience Selection
        self.experience_listbox = tk.Listbox(experience_frame, selectmode=tk.MULTIPLE, height=5)
        self.experience_listbox.pack(side='left', padx=5, pady=5, fill='x', expand=True)
        
        # Style Settings
        style_frame = ttk.LabelFrame(self.scrollable_frame, text="Style Settings")
        style_frame.pack(fill='x', pady=5, padx=5)
        
        # Font Selection
        font_frame = ttk.Frame(style_frame)
        font_frame.pack(fill='x', padx=5, pady=5)
        
        ttk.Label(font_frame, text="Font:").pack(side='left')
        self.font_var = tk.StringVar(value="Arial")
        font_combo = ttk.Combobox(font_frame, textvariable=self.font_var, 
                                values=["Arial", "Times New Roman", "Calibri"])
        font_combo.pack(side='left', padx=5)
        
        # Font Size
        ttk.Label(font_frame, text="Font Size:").pack(side='left', padx=5)
        self.font_size_var = tk.StringVar(value="11")
        font_size_combo = ttk.Combobox(font_frame, textvariable=self.font_size_var, 
                                     values=["10", "11", "12", "14"])
        font_size_combo.pack(side='left', padx=5)
        
        # Layout Settings
        layout_frame = ttk.LabelFrame(self.scrollable_frame, text="Layout Settings")
        layout_frame.pack(fill='x', pady=5, padx=5)
        
        # Page Size
        page_frame = ttk.Frame(layout_frame)
        page_frame.pack(fill='x', padx=5, pady=5)
        
        ttk.Label(page_frame, text="Page Size:").pack(side='left')
        self.page_size_var = tk.StringVar(value="Letter")
        page_size_combo = ttk.Combobox(page_frame, textvariable=self.page_size_var, 
                                     values=["Letter", "A4"])
        page_size_combo.pack(side='left', padx=5)
        
        # Margins
        margin_frame = ttk.Frame(layout_frame)
        margin_frame.pack(fill='x', padx=5, pady=5)
        
        ttk.Label(margin_frame, text="Margins (inches):").pack(side='left')
        self.margin_var = tk.StringVar(value="1")
        margin_combo = ttk.Combobox(margin_frame, textvariable=self.margin_var, 
                                  values=["0.5", "1", "1.5", "2"])
        margin_combo.pack(side='left', padx=5)
        
        # Buttons
        button_frame = ttk.Frame(self.scrollable_frame)
        button_frame.pack(fill='x', pady=20)
        
        ttk.Button(button_frame, text="Save Settings", 
                  command=self.save_data).pack(side='left', padx=5)
        ttk.Button(button_frame, text="Reset to Default", 
                  command=self.reset_settings).pack(side='left', padx=5)
        
        # Pack the canvas and scrollbar
        canvas.pack(side="left", fill="both", expand=True)
        scrollbar.pack(side="right", fill="y")
        
    def get_form_data(self):
        return {
            'include_personal': self.include_personal.get(),
            'include_experience': self.include_experience.get(),
            'selected_experiences': [self.experience_listbox.get(i) for i in self.experience_listbox.curselection()],
            'font': self.font_var.get(),
            'font_size': self.font_size_var.get(),
            'page_size': self.page_size_var.get(),
            'margins': self.margin_var.get()
        }
        
    def set_form_data(self, data):
        self.include_personal.set(data.get('include_personal', True))
        self.include_experience.set(data.get('include_experience', True))
        
        # Clear and repopulate experience listbox
        self.experience_listbox.delete(0, tk.END)
        for exp in data.get('selected_experiences', []):
            self.experience_listbox.insert(tk.END, exp)
            
        self.font_var.set(data.get('font', 'Arial'))
        self.font_size_var.set(data.get('font_size', '11'))
        self.page_size_var.set(data.get('page_size', 'Letter'))
        self.margin_var.set(data.get('margins', '1'))
        
    def save_data(self):
        # Create data directory if it doesn't exist
        os.makedirs(os.path.dirname(self.data_file), exist_ok=True)
        
        # Get form data
        data = self.get_form_data()
        
        # Save to file
        try:
            with open(self.data_file, 'w') as f:
                json.dump(data, f, indent=4)
            messagebox.showinfo("Success", "Resume settings saved successfully!")
        except Exception as e:
            messagebox.showerror("Error", f"Failed to save resume settings: {str(e)}")
            
    def load_data(self):
        # Check if file exists
        if not os.path.exists(self.data_file):
            return
            
        # Load from file
        try:
            with open(self.data_file, 'r') as f:
                data = json.load(f)
            self.set_form_data(data)
        except Exception as e:
            messagebox.showerror("Error", f"Failed to load resume settings: {str(e)}")
            
    def reset_settings(self):
        if messagebox.askyesno("Confirm Reset", "Are you sure you want to reset all settings to default?"):
            self.set_form_data({})
            self.save_data()
            
    def generate_resume(self):
        # TODO: Implement resume generation based on selected settings
        messagebox.showinfo("Coming Soon", "Resume generation functionality will be implemented soon!") 