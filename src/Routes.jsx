import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import OnboardingChecklist from './pages/onboarding-checklist';
import Login from './pages/login';
import EmployeeDashboard from './pages/employee-dashboard';
import MeetingScheduler from './pages/meeting-scheduler';
import FeedbackCollection from './pages/feedback-collection';
import HRAdminDashboard from './pages/hr-admin-dashboard';
import TrainingModule from './pages/training-module';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<EmployeeDashboard />} />
        <Route path="/onboarding-checklist" element={<OnboardingChecklist />} />
        <Route path="/login" element={<Login />} />
        <Route path="/employee-dashboard" element={<EmployeeDashboard />} />
        <Route path="/training/:id" element={<TrainingModule />} />
        <Route path="/meeting-scheduler" element={<MeetingScheduler />} />
        <Route path="/feedback-collection" element={<FeedbackCollection />} />
        <Route path="/hr-admin-dashboard" element={<HRAdminDashboard />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
