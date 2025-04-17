import tkinter as tk
from tkinter import ttk
from src.gui.main_window import MainWindow

def main():
    root = tk.Tk()
    root.title("ResuMaker")
    root.geometry("800x600")
    
    app = MainWindow(root)
    
    root.mainloop()

if __name__ == "__main__":
    main() 