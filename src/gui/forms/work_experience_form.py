import tkinter as tk
from tkinter import ttk, messagebox
import json
import os
import sys
from datetime import datetime

class WorkExperienceForm(ttk.Frame):
    def __init__(self, parent):
        super().__init__(parent)
        # Get the base directory for data storage
        if getattr(sys, 'frozen', False):
            # If running as executable
            self.base_dir = os.path.dirname(sys.executable)
        else:
            # If running as script
            self.base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))
            
        self.data_file = os.path.join(self.base_dir, "data", "work_experience.json")
        self.experiences = []
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
        
        ttk.Label(header_frame, text="Work Experience", font=("Arial", 12, "bold")).pack(side='left')
        ttk.Button(header_frame, text="Add Experience", command=self.add_experience).pack(side='right')
        
        # Container for experience entries
        self.experiences_frame = ttk.Frame(self.scrollable_frame)
        self.experiences_frame.pack(fill='both', expand=True)
        
        # Pack the canvas and scrollbar
        canvas.pack(side="left", fill="both", expand=True)
        scrollbar.pack(side="right", fill="y")
        
    def add_experience(self, experience_data=None):
        # Create a frame for this experience
        exp_frame = ttk.LabelFrame(self.experiences_frame, text=f"Experience {len(self.experiences) + 1}")
        exp_frame.pack(fill='x', pady=5, padx=5)
        
        # Company and Job Title
        company_frame = ttk.Frame(exp_frame)
        company_frame.pack(fill='x', padx=5, pady=5)
        
        ttk.Label(company_frame, text="Company:").pack(side='left', padx=5)
        company_entry = ttk.Entry(company_frame, width=30)
        company_entry.pack(side='left', padx=5)
        
        ttk.Label(company_frame, text="Job Title:").pack(side='left', padx=5)
        job_title_entry = ttk.Entry(company_frame, width=30)
        job_title_entry.pack(side='left', padx=5)
        
        # Duration
        duration_frame = ttk.Frame(exp_frame)
        duration_frame.pack(fill='x', padx=5, pady=5)
        
        ttk.Label(duration_frame, text="Start Date:").pack(side='left', padx=5)
        start_date_entry = ttk.Entry(duration_frame, width=15)
        start_date_entry.pack(side='left', padx=5)
        
        ttk.Label(duration_frame, text="End Date:").pack(side='left', padx=5)
        end_date_entry = ttk.Entry(duration_frame, width=15)
        end_date_entry.pack(side='left', padx=5)
        
        # Current Position checkbox
        current_position_var = tk.BooleanVar(value=False)
        current_position_cb = ttk.Checkbutton(duration_frame, text="Current Position", 
                                             variable=current_position_var,
                                             command=lambda: self.toggle_end_date(end_date_entry, current_position_var))
        current_position_cb.pack(side='left', padx=5)
        
        # Responsibilities
        resp_frame = ttk.Frame(exp_frame)
        resp_frame.pack(fill='x', padx=5, pady=5)
        
        ttk.Label(resp_frame, text="Responsibilities:").pack(anchor='w', padx=5)
        
        # Create a text widget for responsibilities
        resp_text = tk.Text(resp_frame, height=5, width=50)
        resp_text.pack(fill='x', padx=5, pady=5)
        
        # Buttons
        button_frame = ttk.Frame(exp_frame)
        button_frame.pack(fill='x', padx=5, pady=5)
        
        ttk.Button(button_frame, text="Save", 
                  command=lambda: self.save_experience(exp_frame)).pack(side='left', padx=5)
        ttk.Button(button_frame, text="Delete", 
                  command=lambda: self.delete_experience(exp_frame)).pack(side='left', padx=5)
        
        # Store the experience data
        experience = {
            'frame': exp_frame,
            'company': company_entry,
            'job_title': job_title_entry,
            'start_date': start_date_entry,
            'end_date': end_date_entry,
            'current_position': current_position_var,
            'responsibilities': resp_text
        }
        
        self.experiences.append(experience)
        
        # If we have data to load, populate the fields
        if experience_data:
            self.populate_experience(experience, experience_data)
            
    def toggle_end_date(self, end_date_entry, current_position_var):
        if current_position_var.get():
            end_date_entry.delete(0, tk.END)
            end_date_entry.insert(0, "Present")
            end_date_entry.configure(state='disabled')
        else:
            end_date_entry.configure(state='normal')
            
    def populate_experience(self, experience, data):
        experience['company'].insert(0, data.get('company', ''))
        experience['job_title'].insert(0, data.get('job_title', ''))
        experience['start_date'].insert(0, data.get('start_date', ''))
        
        # Handle current position
        is_current = data.get('is_current', False)
        experience['current_position'].set(is_current)
        
        if is_current:
            experience['end_date'].insert(0, "Present")
            experience['end_date'].configure(state='disabled')
        else:
            experience['end_date'].insert(0, data.get('end_date', ''))
            
        experience['responsibilities'].insert('1.0', data.get('responsibilities', ''))
        
    def save_experience(self, exp_frame):
        # Find the experience data
        experience = next((exp for exp in self.experiences if exp['frame'] == exp_frame), None)
        if not experience:
            return
            
        # Validate required fields
        if not experience['company'].get() or not experience['job_title'].get() or not experience['start_date'].get():
            messagebox.showwarning("Missing Information", "Please fill in all required fields (Company, Job Title, Start Date)")
            return
            
        # Get the data
        data = {
            'company': experience['company'].get(),
            'job_title': experience['job_title'].get(),
            'start_date': experience['start_date'].get(),
            'is_current': experience['current_position'].get(),
            'end_date': experience['end_date'].get() if not experience['current_position'].get() else "Present",
            'responsibilities': experience['responsibilities'].get('1.0', 'end-1c')
        }
        
        # Save to file
        self.save_data()
        messagebox.showinfo("Success", "Experience saved successfully!")
        
    def delete_experience(self, exp_frame):
        if messagebox.askyesno("Confirm Delete", "Are you sure you want to delete this experience?"):
            exp_frame.destroy()
            self.experiences = [exp for exp in self.experiences if exp['frame'] != exp_frame]
            self.save_data()
            
    def get_all_experiences(self):
        return [{
            'company': exp['company'].get(),
            'job_title': exp['job_title'].get(),
            'start_date': exp['start_date'].get(),
            'is_current': exp['current_position'].get(),
            'end_date': exp['end_date'].get() if not exp['current_position'].get() else "Present",
            'responsibilities': exp['responsibilities'].get('1.0', 'end-1c')
        } for exp in self.experiences]
        
    def save_data(self):
        # Create data directory if it doesn't exist
        os.makedirs(os.path.dirname(self.data_file), exist_ok=True)
        
        # Get all experience data
        data = self.get_all_experiences()
        
        # Save to file
        try:
            with open(self.data_file, 'w') as f:
                json.dump(data, f, indent=4)
        except Exception as e:
            messagebox.showerror("Error", f"Failed to save work experience: {str(e)}")
            
    def load_data(self):
        # Check if file exists
        if not os.path.exists(self.data_file):
            return
            
        # Load from file
        try:
            with open(self.data_file, 'r') as f:
                data = json.load(f)
                
            # Clear existing experiences
            for exp in self.experiences:
                exp['frame'].destroy()
            self.experiences.clear()
            
            # Add each experience
            for exp_data in data:
                self.add_experience(exp_data)
                
        except Exception as e:
            messagebox.showerror("Error", f"Failed to load work experience: {str(e)}") 