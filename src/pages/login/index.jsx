import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import WelcomeHeader from './components/WelcomeHeader';
import LoginForm from './components/LoginForm';
import SecurityBadges from './components/SecurityBadges';
import CredentialsHelper from './components/CredentialsHelper';

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        // Redirect based on user role
        if (user?.role === 'hr_admin') {
          navigate('/hr-admin-dashboard');
        } else {
          navigate('/employee-dashboard');
        }
      } catch (error) {
        // Clear invalid user data
        localStorage.removeItem('user');
      }
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />
      {/* Main Login Container */}
      <div className="w-full max-w-md relative z-10">
        {/* Login Card */}
        <div className="bg-card border border-border rounded-2xl shadow-elevated p-8">
          <WelcomeHeader />
          <LoginForm />
          <CredentialsHelper />
          <SecurityBadges />
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-muted-foreground">
            © {new Date()?.getFullYear()} AI Training Assistant. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Powered by enterprise-grade AI technology
          </p>
        </div>
      </div>
      {/* Additional Background Elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-primary/10 rounded-full blur-xl" />
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-accent/10 rounded-full blur-xl" />
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-secondary/10 rounded-full blur-xl" />
    </div>
  );
};

export default Login;