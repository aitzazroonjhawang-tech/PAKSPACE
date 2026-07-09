/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AppProvider, useApp } from './context/AppContext';
import LandingPage from './components/LandingPage';
import AuthPage from './components/AuthPage';
import OnboardingPage from './components/OnboardingPage';
import MainApp from './components/MainApp';

function AppContent() {
  const { currentView } = useApp();

  switch (currentView) {
    case 'landing':
      return <LandingPage />;
    case 'auth':
      return <AuthPage />;
    case 'onboarding':
      return <OnboardingPage />;
    case 'app':
      return <MainApp />;
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

