import tkinter as tk
from tkinter import ttk, messagebox, filedialog, simpledialog
import json
import os
import sys
from src.pdf.generator import PDFGenerator

class ResumeForm(ttk.Frame):
    def __init__(self, parent):
        super().__init__(parent)
        # Get the base directory for data storage
        if getattr(sys, 'frozen', False):
            # If running as executable
            self.base_dir = os.path.dirname(sys.executable)
        else:
            # If running as script
            self.base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))
            
        self.data_file = os.path.join(self.base_dir, "data", "resume_settings.json")
        self.work_exp_file = os.path.join(self.base_dir, "data", "work_experience.json")
        self.pdf_generator = PDFGenerator()
        self.experience_vars = {}  # Dictionary to store checkbox variables
        self.summaries_file = os.path.join(self.base_dir, "data", "saved_summaries.json")
        self.saved_summaries = self.load_saved_summaries()
        self.init_ui()
        self.populate_experience_list()
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
        
        # Work Experience Section
        experience_frame = ttk.LabelFrame(sections_frame, text="Work Experience")
        experience_frame.pack(fill='x', padx=5, pady=5)
        
        ttk.Label(experience_frame, text="Select experiences to include:").pack(anchor='w', padx=5, pady=(5, 0))
        
        # Experience Selection Frame with its own scrollbar
        exp_select_container = ttk.Frame(experience_frame)
        exp_select_container.pack(fill='both', expand=True, padx=5)
        
        exp_canvas = tk.Canvas(exp_select_container, height=150)
        exp_scrollbar = ttk.Scrollbar(exp_select_container, orient="vertical", command=exp_canvas.yview)
        self.experience_select_frame = ttk.Frame(exp_canvas)
        
        self.experience_select_frame.bind(
            "<Configure>",
            lambda e: exp_canvas.configure(scrollregion=exp_canvas.bbox("all"))
        )
        
        exp_canvas.create_window((0, 0), window=self.experience_select_frame, anchor="nw")
        exp_canvas.configure(yscrollcommand=exp_scrollbar.set)
        
        exp_canvas.pack(side="left", fill="both", expand=True)
        exp_scrollbar.pack(side="right", fill="y")
        
        # Professional Summary Section
        summary_frame = ttk.LabelFrame(self.scrollable_frame, text="Professional Summary", padding=10)
        summary_frame.pack(fill='x', pady=(0, 10))
        
        # Text area for editing summary
        self.summary_text = tk.Text(summary_frame, height=4, wrap=tk.WORD)
        self.summary_text.pack(fill='x', pady=(5, 5))
        
        # Dropdown for saved summaries
        saved_summaries_frame = ttk.Frame(summary_frame)
        saved_summaries_frame.pack(fill='x', pady=(0, 5))
        
        ttk.Label(saved_summaries_frame, text="Saved Summaries:").pack(side='left')
        self.summary_var = tk.StringVar()
        self.summary_dropdown = ttk.Combobox(saved_summaries_frame, textvariable=self.summary_var, state="readonly")
        self.summary_dropdown.pack(side='left', padx=(5, 5), fill='x', expand=True)
        
        # Bind the dropdown selection to update the text area
        self.summary_dropdown.bind('<<ComboboxSelected>>', self.on_summary_selected)
        
        # Update the dropdown after creating all widgets
        self.update_summary_dropdown()
        
        # Buttons for managing summaries
        button_frame = ttk.Frame(summary_frame)
        button_frame.pack(fill='x')
        
        ttk.Button(button_frame, text="Save As New", command=self.save_new_summary).pack(side='left', padx=(0, 5))
        ttk.Button(button_frame, text="Update Selected", command=self.update_selected_summary).pack(side='left', padx=(0, 5))
        ttk.Button(button_frame, text="Delete Selected", command=self.delete_selected_summary).pack(side='left')
        
        # Style Settings
        style_frame = ttk.LabelFrame(self.scrollable_frame, text="Style Settings")
        style_frame.pack(fill='x', pady=5, padx=5)
        
        # Font Size
        font_frame = ttk.Frame(style_frame)
        font_frame.pack(fill='x', padx=5, pady=5)
        
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
        
    def populate_experience_list(self):
        """Populate the experience selection frame with checkboxes"""
        # Clear existing checkboxes
        for widget in self.experience_select_frame.winfo_children():
            widget.destroy()
        self.experience_vars.clear()
        
        # Load work experiences
        if os.path.exists(self.work_exp_file):
            try:
                with open(self.work_exp_file, 'r') as f:
                    experiences = json.load(f)
                    for exp in experiences:
                        item = f"{exp['company']} - {exp['job_title']}"
                        var = tk.BooleanVar(value=False)
                        self.experience_vars[item] = var
                        ttk.Checkbutton(self.experience_select_frame, text=item, 
                                      variable=var).pack(anchor='w', padx=5, pady=2)
            except Exception as e:
                messagebox.showerror("Error", f"Failed to load work experiences: {str(e)}")
                
    def get_form_data(self):
        selected_experiences = [exp for exp, var in self.experience_vars.items() if var.get()]
        
        return {
            'selected_experiences': selected_experiences,
            'font_size': self.font_size_var.get(),
            'page_size': self.page_size_var.get(),
            'margins': self.margin_var.get(),
            'summary': self.summary_text.get('1.0', tk.END.strip())
        }
        
    def set_form_data(self, data):
        # Clear and repopulate experience checkboxes
        self.populate_experience_list()
        
        # Set checkbox states based on saved selections
        saved_experiences = data.get('selected_experiences', [])
        for exp, var in self.experience_vars.items():
            var.set(exp in saved_experiences)
            
        self.font_size_var.set(data.get('font_size', '11'))
        self.page_size_var.set(data.get('page_size', 'Letter'))
        self.margin_var.set(data.get('margins', '1'))
        self.summary_text.delete('1.0', tk.END)
        self.summary_text.insert('1.0', data.get('summary', ''))
        
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
        # Get save location from user
        file_path = filedialog.asksaveasfilename(
            defaultextension=".pdf",
            filetypes=[("PDF Files", "*.pdf")],
            initialfile="resume.pdf"
        )
        
        if file_path:
            try:
                # Get current settings
                settings = self.get_form_data()
                
                # Debug print
                print("Resume Settings:", settings)
                print("Selected Experiences:", settings.get('selected_experiences', []))
                
                # Validate settings
                if not settings['selected_experiences']:
                    messagebox.showwarning("Warning", "Please select at least one work experience to include in the resume.")
                    return
                
                # Generate the resume
                self.pdf_generator.generate_resume(settings, file_path)
                
                messagebox.showinfo("Success", "Resume generated successfully!")
            except Exception as e:
                messagebox.showerror("Error", f"Failed to generate resume: {str(e)}")
                # Print detailed error for debugging
                import traceback
                print("Error details:", traceback.format_exc())
                
    def update_summary_dropdown(self):
        """Update the dropdown with saved summaries"""
        summaries = list(self.saved_summaries.keys())
        self.summary_dropdown['values'] = summaries
        if summaries:
            self.summary_dropdown.set(summaries[0])
            self.summary_text.delete('1.0', tk.END)
            self.summary_text.insert('1.0', self.saved_summaries[summaries[0]])
            
    def on_summary_selected(self, event):
        """Handle selection of a saved summary"""
        selected = self.summary_var.get()
        if selected in self.saved_summaries:
            self.summary_text.delete('1.0', tk.END)
            self.summary_text.insert('1.0', self.saved_summaries[selected])
            
    def save_new_summary(self):
        """Save the current summary text as a new entry"""
        summary_text = self.summary_text.get('1.0', tk.END.strip())
        if not summary_text.strip():
            messagebox.showerror("Error", "Please enter a summary before saving.")
            return
            
        # Ask for a name for the new summary
        name = simpledialog.askstring("Save Summary", "Enter a name for this summary:")
        if name:
            if name in self.saved_summaries:
                if not messagebox.askyesno("Confirm Overwrite", 
                    f"A summary named '{name}' already exists. Do you want to overwrite it?"):
                    return
            
            self.saved_summaries[name] = summary_text
            self.save_summaries_to_file()
            self.update_summary_dropdown()
            self.summary_dropdown.set(name)
            
    def update_selected_summary(self):
        """Update the currently selected summary"""
        selected = self.summary_var.get()
        if not selected:
            messagebox.showerror("Error", "Please select a summary to update.")
            return
            
        summary_text = self.summary_text.get('1.0', tk.END.strip())
        if not summary_text.strip():
            messagebox.showerror("Error", "Please enter a summary before updating.")
            return
            
        self.saved_summaries[selected] = summary_text
        self.save_summaries_to_file()
        messagebox.showinfo("Success", "Summary updated successfully!")
        
    def delete_selected_summary(self):
        """Delete the currently selected summary"""
        selected = self.summary_var.get()
        if not selected:
            messagebox.showerror("Error", "Please select a summary to delete.")
            return
            
        if messagebox.askyesno("Confirm Delete", 
            f"Are you sure you want to delete the summary '{selected}'?"):
            del self.saved_summaries[selected]
            self.save_summaries_to_file()
            self.update_summary_dropdown()
            
    def load_saved_summaries(self):
        """Load saved summaries from file"""
        if not os.path.exists(self.summaries_file):
            return {}
            
        try:
            with open(self.summaries_file, 'r') as f:
                return json.load(f)
        except Exception as e:
            print(f"Error loading summaries: {str(e)}")
            return {}
            
    def save_summaries_to_file(self):
        """Save summaries to file"""
        os.makedirs(os.path.dirname(self.summaries_file), exist_ok=True)
        try:
            with open(self.summaries_file, 'w') as f:
                json.dump(self.saved_summaries, f, indent=2)
        except Exception as e:
            print(f"Error saving summaries: {str(e)}")
            messagebox.showerror("Error", "Failed to save summaries to file.") 