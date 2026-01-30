import React from 'react';
import { Router, Route } from 'wouter';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Home from './pages/Home';
import { SignIn, SignUp } from './pages/AuthPages';
import RequestsList from './pages/RequestsList';
import NewRequest from './pages/NewRequest';
import { ThemeProvider } from 'next-themes';
import './App.css';

const AppContent: React.FC = () => {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="text-white text-xl">جاري التحميل...</div>
      </div>
    );
  }

  return (
    <Router>
      <Route path="/" component={Home} />
      <Route path="/signin" component={SignIn} />
      <Route path="/signup" component={SignUp} />
      <Route path="/requests" component={RequestsList} />
      <Route path="/new-request" component={NewRequest} />
      <Route path="*" component={() => <div className="p-8">لم يتم العثور على الصفحة</div>} />
    </Router>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
