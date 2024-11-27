import React, { useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Dashboard from './components/Dashboard'
import FormView from './components/FormView'
import FormBuilder from './components/FormBuilder'
import SignupPage from './components/SignupPage'
import LoginPage from './components/LoginPage'
import LandingPage from './components/LandingPage'
import CustomErrorBoundary from './components/CustomErrorBoundary'
import PricingPage from './components/PricingPage'
import ResponsesPage from './components/ResponsesPage'
import IntegrationsPage from './components/IntegrationsPage'
import { Form } from './types'
import { useState } from 'react'
import { supabase } from './lib/supabase'

// Auth callback handler component
const AuthCallback = () => {
  const location = useLocation();
  
  useEffect(() => {
    // Handle the OAuth callback
    const handleAuthCallback = async () => {
      try {
        // Get hash parameters from URL
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        
        if (accessToken) {
          // Set the session in Supabase
          const { data: { session }, error } = await supabase.auth.getSession();
          
          if (error) throw error;
          
          // Redirect to dashboard on successful auth
          window.location.href = '/dashboard';
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        window.location.href = '/login';
      }
    };

    handleAuthCallback();
  }, [location]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
    </div>
  );
};

const App: React.FC = () => {
  const [forms, setForms] = useState<Form[]>([])

  const handleCreateForm = () => {
    const newForm: Form = {
      id: Date.now().toString(),
      title: 'Untitled Form',
      description: '',
      questions: [],
      responseCount: 0
    }
    return newForm
  }

  const handleUpdateForm = (updatedForm: Form) => {
    setForms(prevForms => 
      prevForms.map(form => 
        form.id === updatedForm.id ? updatedForm : form
      )
    )
  }

  const handleDeleteForm = (formId: string) => {
    setForms(prevForms => prevForms.filter(form => form.id !== formId))
  }

  const updateResponseCount = (formId: string) => {
    setForms(prevForms => 
      prevForms.map(form => 
        form.id === formId 
          ? { ...form, responseCount: (form.responseCount || 0) + 1 }
          : form
      )
    )
  }

  return (
    <CustomErrorBoundary>
      <AuthProvider>
        <Router>
          <AppRoutes 
            forms={forms}
            onCreateForm={handleCreateForm}
            onUpdateForm={handleUpdateForm}
            onDeleteForm={handleDeleteForm}
            updateResponseCount={updateResponseCount}
          />
        </Router>
      </AuthProvider>
    </CustomErrorBoundary>
  )
}

interface AppRoutesProps {
  forms: Form[]
  onCreateForm: () => Form
  onUpdateForm: (form: Form) => void
  onDeleteForm: (formId: string) => void
  updateResponseCount: (formId: string) => void
}

const AppRoutes: React.FC<AppRoutesProps> = ({
  forms,
  onCreateForm,
  onUpdateForm,
  onDeleteForm,
  updateResponseCount
}) => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard 
                forms={forms} 
                onCreateForm={onCreateForm}
                onDeleteForm={onDeleteForm}
                updateResponseCount={updateResponseCount}
              />
            </PrivateRoute>
          }
        />
        <Route path="/form/:formId" element={<FormView />} />
        <Route
          path="/builder/:formId"
          element={
            <PrivateRoute>
              <FormBuilder 
                forms={forms}
                onUpdateForm={onUpdateForm}
                onCreateForm={onCreateForm}
                user={{ isPro: true }}
              />
            </PrivateRoute>
          }
        />
        <Route
          path="/responses/:formId"
          element={
            <PrivateRoute>
              <ResponsesPage user={{ isPro: true }} />
            </PrivateRoute>
          }
        />
        <Route
          path="/integrations/:formId"
          element={
            <PrivateRoute>
              <IntegrationsPage />
            </PrivateRoute>
          }
        />
      </Routes>
    </div>
  )
}

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}

export default App