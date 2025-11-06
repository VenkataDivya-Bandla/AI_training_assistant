from flask import Flask, current_app
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS 

# 1. Application and Middleware Initialization
app = Flask(__name__)
# Enable CORS for frontend communication
CORS(app) 

# 2. Database Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///hr_data.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app) 


# 3. Root Test Route
@app.route('/')
def index():
    """Simple check to ensure the server is responding."""
    return "HR Data API (Flask) is running successfully!"


def setup_routes(application):
    """
    Imports and registers blueprints inside a function.
    This pattern ensures the import only happens when needed, 
    breaking the circular dependency chain.
    """
    # This import is now safe because it's only called after 'db' is defined above.
    from hr_routes import hr_bp
    application.register_blueprint(hr_bp, url_prefix='/api/hr')


# 4. Run the Server
if __name__ == '__main__':
    # Setup routes only when running the file directly
    setup_routes(app)
    # Running on port 5000 
    app.run(port=5000, debug=True) 
