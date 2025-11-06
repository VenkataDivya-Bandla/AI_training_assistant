from flask import Blueprint, jsonify, request
# This import is now safe due to the structure in app.py
from app import db 
from models import Employee, employees_schema, employee_schema 

# Define the blueprint, registered in app.py
hr_bp = Blueprint('hr_bp', __name__)

# GET: Fetch all employee data (API: /api/hr/employees)
@hr_bp.route('/employees', methods=['GET'])
def get_employees():
    """Fetches all employee records from the database."""
    # Using modern SQLAlchemy select for robust querying
    all_employees = db.session.execute(db.select(Employee)).scalars().all()
    result = employees_schema.dump(all_employees)
    return jsonify(result)

# POST: Add a new employee (API: /api/hr/employee/add)
@hr_bp.route('/employee/add', methods=['POST'])
def add_employee():
    """Adds a new employee record based on JSON data."""
    data = request.get_json()
    
    new_employee = Employee(
        name=data.get('name'),
        email=data.get('email'),
        start_date=data.get('start_date'),
        department=data.get('department'),
        mentor=data.get('mentor'),
        # Provide defaults for non-required fields
        progress=data.get('progress', 0),
        status=data.get('status', 'Not Started'),
        last_activity=data.get('last_activity', 'Never')
    )
    
    db.session.add(new_employee)
    db.session.commit()
    # Return the newly created object
    return employee_schema.jsonify(new_employee), 201

# GET: Fetch Key Metrics (API: /api/hr/metrics)
@hr_bp.route('/metrics', methods=['GET'])
def get_metrics():
    """Calculates and returns key HR onboarding metrics."""
    # Calculate counts using db.select
    total_employees = db.session.execute(db.select(Employee)).scalars().count()
    completed_training = db.session.execute(db.select(Employee).filter(Employee.progress >= 100)).scalars().count()
    active_onboardees = db.session.execute(db.select(Employee).filter(Employee.status != 'Completed')).scalars().count()
    
    # Calculate completion rate safely
    completion_rate = round((completed_training / total_employees * 100)) if total_employees else 0
    
    return jsonify({
        "active_onboardees": active_onboardees,
        "completion_rate": completion_rate, 
        # Using a placeholder for satisfaction score as it's not calculated here
        "satisfaction_score": 4.6 
    })
