# --- hr_data_api/init_db.py ---

import sys
# Add the current directory to the path to ensure app and models are found
sys.path.append('.') 

from app import app, db
from models import Employee
import os

print("--- Starting HR Database Initialization ---")

# Check if the database file already exists
db_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'hr_data.db')
if os.path.exists(db_path):
    print(f"⚠️ Database file '{db_path}' already exists. Data will be appended/updated.")

with app.app_context():
    # 1. CREATE TABLES: This creates or updates the hr_data.db file.
    db.create_all() 
    print("✅ Tables created/verified.")

    # 2. ADD SAMPLE DATA: Check if the table is empty before adding data
    if Employee.query.count() == 0:
        print("Adding sample data...")
        
        emp1 = Employee(name='David Kim', email='david.kim@company.com', start_date='12/10/2024', department='Finance', progress=20, status='Overdue', mentor='Maria Garcia', last_activity='3 days ago')
        emp2 = Employee(name='Emily Davis', email='emily.davis@company.com', start_date='12/08/2024', department='Sales', progress=45, status='In Progress', mentor='John Smith', last_activity='30 minutes ago')
        emp3 = Employee(name='Jessica Brown', email='jessica.brown@company.com', start_date='12/12/2024', department='HR', progress=10, status='Not Started', mentor='Robert Taylor', last_activity='Never')
        emp4 = Employee(name='Michael Rodriquez', email='michael.rodriguez@company.com', start_date='12/05/2024', department='Marketing', progress=100, status='Completed', mentor='Lisa Wang', last_activity='1 day ago')
        emp5 = Employee(name='Sarah Johnson', email='sarah.johnson@company.com', start_date='12/01/2024', department='Engineering', progress=85, status='In Progress', mentor='Alex Chen', last_activity='2 hours ago')

        db.session.add_all([emp1, emp2, emp3, emp4, emp5])
        db.session.commit()
        print("✅ Sample data successfully added.")
    else:
        print("Data already exists in the Employee table. Skipping sample data insertion.")


print("--- HR Database Initialization COMPLETE ---")