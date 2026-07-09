import { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import LandingPage from './components/LandingPage';
import AuthPage from './components/AuthPage';
import OnboardingPage from './components/OnboardingPage';
import MainApp from './components/MainApp';

function AppContent() {
  const { currentView, currentUser, setView } = useApp();

  useEffect(() => {
    if (!currentUser) {
      if (currentView === 'app' || currentView === 'onboarding') {
        setView('landing');
      }
    } else {
      if (currentView === 'landing' || currentView === 'auth') {
        if (!currentUser.universityStatus) {
          setView('onboarding');
        } else {
          setView('app');
        }
      }
    }
  }, [currentUser, currentView, setView]);

  switch (currentView) {
    case 'landing':
      return <LandingPage />;
    case 'auth':
      return <AuthPage />;
    case 'onboarding':
      return currentUser ? <OnboardingPage /> : <LandingPage />;
    case 'app':
      return currentUser ? <MainApp /> : <LandingPage />;
    default:
      return <LandingPage />;
  }
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

