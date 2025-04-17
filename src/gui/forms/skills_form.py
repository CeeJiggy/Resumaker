import tkinter as tk
from tkinter import ttk, messagebox
import json
import os
import sys

class SkillsForm(ttk.Frame):
    def __init__(self, parent):
        super().__init__(parent)
        # Get the base directory for data storage
        if getattr(sys, 'frozen', False):
            # If running as executable
            self.base_dir = os.path.dirname(sys.executable)
        else:
            # If running as script
            self.base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))
            
        self.data_file = os.path.join(self.base_dir, "data", "skills.json")
        self.skills_data = {}  # Dictionary to store skills and subskills
        self.init_ui()
        self.load_data()
        
    def init_ui(self):
        # Create main container with scrollbar
        container = ttk.Frame(self)
        container.pack(fill='both', expand=True, padx=10, pady=10)
        
        # Left panel for skills list
        left_panel = ttk.Frame(container)
        left_panel.pack(side='left', fill='both', expand=True, padx=(0, 5))
        
        # Skills list header with add button
        skills_header = ttk.Frame(left_panel)
        skills_header.pack(fill='x', pady=(0, 5))
        
        ttk.Label(skills_header, text="Main Skills", font=('Arial', 10, 'bold')).pack(side='left')
        ttk.Button(skills_header, text="Add Skill", command=self.add_main_skill).pack(side='right')
        
        # Skills listbox with scrollbar
        self.skills_listbox = tk.Listbox(left_panel, selectmode=tk.SINGLE)
        skills_scrollbar = ttk.Scrollbar(left_panel, orient="vertical", command=self.skills_listbox.yview)
        self.skills_listbox.configure(yscrollcommand=skills_scrollbar.set)
        
        self.skills_listbox.pack(side='left', fill='both', expand=True)
        skills_scrollbar.pack(side='right', fill='y')
        
        # Bind selection event
        self.skills_listbox.bind('<<ListboxSelect>>', self.on_skill_select)
        
        # Right panel for subskills
        right_panel = ttk.Frame(container)
        right_panel.pack(side='right', fill='both', expand=True, padx=(5, 0))
        
        # Subskills header with add button
        subskills_header = ttk.Frame(right_panel)
        subskills_header.pack(fill='x', pady=(0, 5))
        
        ttk.Label(subskills_header, text="Subskills", font=('Arial', 10, 'bold')).pack(side='left')
        self.add_subskill_btn = ttk.Button(subskills_header, text="Add Subskill", 
                                         command=self.add_subskill, state='disabled')
        self.add_subskill_btn.pack(side='right')
        
        # Subskills listbox with scrollbar
        self.subskills_listbox = tk.Listbox(right_panel, selectmode=tk.SINGLE)
        subskills_scrollbar = ttk.Scrollbar(right_panel, orient="vertical", command=self.subskills_listbox.yview)
        self.subskills_listbox.configure(yscrollcommand=subskills_scrollbar.set)
        
        self.subskills_listbox.pack(side='left', fill='both', expand=True)
        subskills_scrollbar.pack(side='right', fill='y')
        
        # Button frame
        button_frame = ttk.Frame(container)
        button_frame.pack(side='bottom', fill='x', pady=(10, 0))
        
        ttk.Button(button_frame, text="Delete Selected", command=self.delete_selected).pack(side='left', padx=5)
        ttk.Button(button_frame, text="Save", command=self.save_data).pack(side='right', padx=5)
        
    def add_main_skill(self):
        dialog = SkillInputDialog(self, "Add Main Skill", "Enter main skill:")
        if dialog.result:
            skill = dialog.result.strip()
            if skill and skill not in self.skills_data:
                self.skills_data[skill] = []
                self.skills_listbox.insert(tk.END, skill)
                self.save_data()
                
    def add_subskill(self):
        selected_skill = self.get_selected_main_skill()
        if selected_skill:
            dialog = SkillInputDialog(self, "Add Subskill", f"Enter subskill for {selected_skill}:")
            if dialog.result:
                subskill = dialog.result.strip()
                if subskill and subskill not in self.skills_data[selected_skill]:
                    self.skills_data[selected_skill].append(subskill)
                    self.subskills_listbox.insert(tk.END, subskill)
                    self.save_data()
                    
    def on_skill_select(self, event):
        self.subskills_listbox.delete(0, tk.END)
        selected_skill = self.get_selected_main_skill()
        if selected_skill:
            self.add_subskill_btn.config(state='normal')
            for subskill in self.skills_data[selected_skill]:
                self.subskills_listbox.insert(tk.END, subskill)
        else:
            self.add_subskill_btn.config(state='disabled')
            
    def get_selected_main_skill(self):
        selection = self.skills_listbox.curselection()
        if selection:
            return self.skills_listbox.get(selection[0])
        return None
        
    def delete_selected(self):
        # Delete selected subskill
        subskill_selection = self.subskills_listbox.curselection()
        if subskill_selection:
            selected_skill = self.get_selected_main_skill()
            subskill = self.subskills_listbox.get(subskill_selection[0])
            self.skills_data[selected_skill].remove(subskill)
            self.subskills_listbox.delete(subskill_selection[0])
            self.save_data()
            return
            
        # Delete selected main skill
        skill_selection = self.skills_listbox.curselection()
        if skill_selection:
            skill = self.skills_listbox.get(skill_selection[0])
            del self.skills_data[skill]
            self.skills_listbox.delete(skill_selection[0])
            self.subskills_listbox.delete(0, tk.END)
            self.save_data()
            
    def save_data(self):
        os.makedirs(os.path.dirname(self.data_file), exist_ok=True)
        try:
            with open(self.data_file, 'w') as f:
                json.dump(self.skills_data, f, indent=4)
            messagebox.showinfo("Success", "Skills saved successfully!")
        except Exception as e:
            messagebox.showerror("Error", f"Failed to save skills: {str(e)}")
            
    def load_data(self):
        if not os.path.exists(self.data_file):
            return
            
        try:
            with open(self.data_file, 'r') as f:
                self.skills_data = json.load(f)
                
            # Populate skills listbox
            for skill in self.skills_data.keys():
                self.skills_listbox.insert(tk.END, skill)
        except Exception as e:
            messagebox.showerror("Error", f"Failed to load skills: {str(e)}")
            
class SkillInputDialog:
    def __init__(self, parent, title, prompt):
        self.result = None
        
        # Create the dialog window
        dialog = tk.Toplevel(parent)
        dialog.title(title)
        dialog.transient(parent)
        dialog.grab_set()
        
        # Add prompt label
        ttk.Label(dialog, text=prompt).pack(padx=5, pady=5)
        
        # Add entry field
        entry = ttk.Entry(dialog, width=40)
        entry.pack(padx=5, pady=5)
        
        # Add buttons
        button_frame = ttk.Frame(dialog)
        button_frame.pack(fill='x', padx=5, pady=5)
        
        def ok():
            self.result = entry.get()
            dialog.destroy()
            
        def cancel():
            dialog.destroy()
            
        ttk.Button(button_frame, text="OK", command=ok).pack(side='right', padx=5)
        ttk.Button(button_frame, text="Cancel", command=cancel).pack(side='right')
        
        # Center the dialog
        dialog.geometry("+%d+%d" % (parent.winfo_rootx() + 50,
                                  parent.winfo_rooty() + 50))
        
        # Set focus on entry
        entry.focus_set()
        
        # Make dialog modal
        dialog.wait_window() 