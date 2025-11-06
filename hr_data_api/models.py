# --- hr_data_api/models.py ---
from app import db # Import the database object created in app.py
from marshmallow import Schema, fields

# 1. Database Model (The table structure for Employee Onboarding)
class Employee(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    start_date = db.Column(db.String(20))
    department = db.Column(db.String(50))
    progress = db.Column(db.Integer, default=0) 
    status = db.Column(db.String(50), default='In Progress')
    mentor = db.Column(db.String(100))
    last_activity = db.Column(db.String(50), default='Just now')

# 2. Schema for JSON Conversion (Needed to send Python data to JavaScript)
class EmployeeSchema(Schema):
    id = fields.Int(dump_only=True)
    name = fields.Str()
    email = fields.Str()
    start_date = fields.Str()
    department = fields.Str()
    progress = fields.Int()
    status = fields.Str()
    mentor = fields.Str()
    last_activity = fields.Str()

employee_schema = EmployeeSchema()
employees_schema = EmployeeSchema(many=True)