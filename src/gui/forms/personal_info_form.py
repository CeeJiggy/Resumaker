import tkinter as tk
from tkinter import ttk, messagebox
import json
import os
import sys

class PersonalInfoForm(ttk.Frame):
    def __init__(self, parent):
        super().__init__(parent)
        # Get the base directory for data storage
        if getattr(sys, 'frozen', False):
            # If running as executable
            self.base_dir = os.path.dirname(sys.executable)
        else:
            # If running as script
            self.base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))
            
        self.data_file = os.path.join(self.base_dir, "data", "personal_info.json")
        self.init_ui()
        self.load_data()
        
    def init_ui(self):
        # Create a canvas with scrollbar
        canvas = tk.Canvas(self)
        scrollbar = ttk.Scrollbar(self, orient="vertical", command=canvas.yview)
        scrollable_frame = ttk.Frame(canvas)
        
        scrollable_frame.bind(
            "<Configure>",
            lambda e: canvas.configure(scrollregion=canvas.bbox("all"))
        )
        
        canvas.create_window((0, 0), window=scrollable_frame, anchor="nw")
        canvas.configure(yscrollcommand=scrollbar.set)
        
        # Personal Information
        ttk.Label(scrollable_frame, text="Personal Information", font=("Arial", 12, "bold")).grid(row=0, column=0, columnspan=2, pady=10, sticky="w")
        
        # Basic Information
        ttk.Label(scrollable_frame, text="Basic Information", font=("Arial", 10, "bold")).grid(row=1, column=0, columnspan=2, pady=5, sticky="w")
        
        ttk.Label(scrollable_frame, text="Full Name:").grid(row=2, column=0, sticky="w", padx=5, pady=2)
        self.name = ttk.Entry(scrollable_frame, width=40)
        self.name.grid(row=2, column=1, sticky="w", padx=5, pady=2)
        
        # Contact Information
        ttk.Label(scrollable_frame, text="Contact Information", font=("Arial", 10, "bold")).grid(row=3, column=0, columnspan=2, pady=5, sticky="w")
        
        ttk.Label(scrollable_frame, text="Email:").grid(row=4, column=0, sticky="w", padx=5, pady=2)
        self.email = ttk.Entry(scrollable_frame, width=40)
        self.email.grid(row=4, column=1, sticky="w", padx=5, pady=2)
        
        ttk.Label(scrollable_frame, text="Phone:").grid(row=5, column=0, sticky="w", padx=5, pady=2)
        self.phone = ttk.Entry(scrollable_frame, width=40)
        self.phone.grid(row=5, column=1, sticky="w", padx=5, pady=2)
        
        ttk.Label(scrollable_frame, text="Website:").grid(row=6, column=0, sticky="w", padx=5, pady=2)
        self.website = ttk.Entry(scrollable_frame, width=40)
        self.website.grid(row=6, column=1, sticky="w", padx=5, pady=2)
        
        # Address Information
        ttk.Label(scrollable_frame, text="Address Information", font=("Arial", 10, "bold")).grid(row=7, column=0, columnspan=2, pady=5, sticky="w")
        
        ttk.Label(scrollable_frame, text="Street Address:").grid(row=8, column=0, sticky="w", padx=5, pady=2)
        self.street = ttk.Entry(scrollable_frame, width=40)
        self.street.grid(row=8, column=1, sticky="w", padx=5, pady=2)
        
        ttk.Label(scrollable_frame, text="City:").grid(row=9, column=0, sticky="w", padx=5, pady=2)
        self.city = ttk.Entry(scrollable_frame, width=40)
        self.city.grid(row=9, column=1, sticky="w", padx=5, pady=2)
        
        ttk.Label(scrollable_frame, text="State/Province:").grid(row=10, column=0, sticky="w", padx=5, pady=2)
        self.state = ttk.Entry(scrollable_frame, width=40)
        self.state.grid(row=10, column=1, sticky="w", padx=5, pady=2)
        
        ttk.Label(scrollable_frame, text="ZIP/Postal Code:").grid(row=11, column=0, sticky="w", padx=5, pady=2)
        self.zip_code = ttk.Entry(scrollable_frame, width=40)
        self.zip_code.grid(row=11, column=1, sticky="w", padx=5, pady=2)
        
        ttk.Label(scrollable_frame, text="Country:").grid(row=12, column=0, sticky="w", padx=5, pady=2)
        self.country = ttk.Entry(scrollable_frame, width=40)
        self.country.grid(row=12, column=1, sticky="w", padx=5, pady=2)
        
        # Social Media
        ttk.Label(scrollable_frame, text="Social Media", font=("Arial", 10, "bold")).grid(row=13, column=0, columnspan=2, pady=5, sticky="w")
        
        ttk.Label(scrollable_frame, text="LinkedIn:").grid(row=14, column=0, sticky="w", padx=5, pady=2)
        self.linkedin = ttk.Entry(scrollable_frame, width=40)
        self.linkedin.grid(row=14, column=1, sticky="w", padx=5, pady=2)
        
        ttk.Label(scrollable_frame, text="GitHub:").grid(row=15, column=0, sticky="w", padx=5, pady=2)
        self.github = ttk.Entry(scrollable_frame, width=40)
        self.github.grid(row=15, column=1, sticky="w", padx=5, pady=2)
        
        ttk.Label(scrollable_frame, text="Twitter:").grid(row=16, column=0, sticky="w", padx=5, pady=2)
        self.twitter = ttk.Entry(scrollable_frame, width=40)
        self.twitter.grid(row=16, column=1, sticky="w", padx=5, pady=2)
        
        # Buttons
        button_frame = ttk.Frame(scrollable_frame)
        button_frame.grid(row=17, column=0, columnspan=2, pady=20)
        
        self.save_btn = ttk.Button(button_frame, text="Save Information", command=self.save_data)
        self.save_btn.pack(side=tk.LEFT, padx=5)
        
        self.clear_btn = ttk.Button(button_frame, text="Clear Form", command=self.clear_form)
        self.clear_btn.pack(side=tk.LEFT, padx=5)
        
        # Pack the canvas and scrollbar
        canvas.pack(side="left", fill="both", expand=True)
        scrollbar.pack(side="right", fill="y")
        
    def get_form_data(self):
        return {
            "name": self.name.get(),
            "email": self.email.get(),
            "phone": self.phone.get(),
            "website": self.website.get(),
            "street": self.street.get(),
            "city": self.city.get(),
            "state": self.state.get(),
            "zip_code": self.zip_code.get(),
            "country": self.country.get(),
            "linkedin": self.linkedin.get(),
            "github": self.github.get(),
            "twitter": self.twitter.get()
        }
        
    def set_form_data(self, data):
        self.name.delete(0, tk.END)
        self.name.insert(0, data.get("name", ""))
        
        self.email.delete(0, tk.END)
        self.email.insert(0, data.get("email", ""))
        
        self.phone.delete(0, tk.END)
        self.phone.insert(0, data.get("phone", ""))
        
        self.website.delete(0, tk.END)
        self.website.insert(0, data.get("website", ""))
        
        self.street.delete(0, tk.END)
        self.street.insert(0, data.get("street", ""))
        
        self.city.delete(0, tk.END)
        self.city.insert(0, data.get("city", ""))
        
        self.state.delete(0, tk.END)
        self.state.insert(0, data.get("state", ""))
        
        self.zip_code.delete(0, tk.END)
        self.zip_code.insert(0, data.get("zip_code", ""))
        
        self.country.delete(0, tk.END)
        self.country.insert(0, data.get("country", ""))
        
        self.linkedin.delete(0, tk.END)
        self.linkedin.insert(0, data.get("linkedin", ""))
        
        self.github.delete(0, tk.END)
        self.github.insert(0, data.get("github", ""))
        
        self.twitter.delete(0, tk.END)
        self.twitter.insert(0, data.get("twitter", ""))
        
    def save_data(self):
        # Create data directory if it doesn't exist
        os.makedirs(os.path.dirname(self.data_file), exist_ok=True)
        
        # Get form data
        data = self.get_form_data()
        
        # Save to file
        try:
            with open(self.data_file, 'w') as f:
                json.dump(data, f, indent=4)
            messagebox.showinfo("Success", "Personal information saved successfully!")
        except Exception as e:
            messagebox.showerror("Error", f"Failed to save personal information: {str(e)}")
            
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
            messagebox.showerror("Error", f"Failed to load personal information: {str(e)}")
            
    def clear_form(self):
        # Clear all fields
        self.set_form_data({}) 