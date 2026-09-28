import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { AllTools } from './pages/AllTools';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { TermsConditions } from './pages/TermsConditions';
import { ToolPage } from './pages/ToolPage';
import { ResumeBuilder } from './pages/ResumeBuilder';
import { IdCardCropTool } from './pages/IdCardCropTool';
import { AdminLogin } from './pages/AdminLogin';
import { AdminDashboard } from './pages/AdminDashboard';

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>(window.location.pathname || '/');
  const [selectedToolId, setSelectedToolId] = useState<string>('compress-jpg');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(
    localStorage.getItem('all_tool_admin_logged') === 'true'
  );

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleNavigate = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    if (path.startsWith('/tools/')) {
      const toolId = path.replace('/tools/', '');
      setSelectedToolId(toolId);
    }
  };

  const handleSelectTool = (toolId: string) => {
    setSelectedToolId(toolId);
  };

  // Determine which page to render
  let content = <Home onNavigate={handleNavigate} onSelectTool={handleSelectTool} />;

  if (currentPath === '/tools') {
    content = <AllTools onNavigate={handleNavigate} onSelectTool={handleSelectTool} />;
  } else if (currentPath === '/about') {
    content = <About />;
  } else if (currentPath === '/contact') {
    content = <Contact />;
  } else if (currentPath === '/privacy') {
    content = <PrivacyPolicy />;
  } else if (currentPath === '/terms') {
    content = <TermsConditions />;
  } else if (currentPath === '/admin/login') {
    if (isAdminLoggedIn) {
      handleNavigate('/admin/dashboard');
      content = <AdminDashboard onLogout={() => {
        localStorage.removeItem('all_tool_admin_logged');
        setIsAdminLoggedIn(false);
        handleNavigate('/admin/login');
      }} onNavigate={handleNavigate} />;
    } else {
      content = (
        <AdminLogin
          onLoginSuccess={() => {
            setIsAdminLoggedIn(true);
            handleNavigate('/admin/dashboard');
          }}
          onNavigate={handleNavigate}
        />
      );
    }
  } else if (currentPath === '/admin/dashboard') {
    if (!isAdminLoggedIn) {
      handleNavigate('/admin/login');
      content = (
        <AdminLogin
          onLoginSuccess={() => {
            setIsAdminLoggedIn(true);
            handleNavigate('/admin/dashboard');
          }}
          onNavigate={handleNavigate}
        />
      );
    } else {
      content = (
        <AdminDashboard
          onLogout={() => {
            localStorage.removeItem('all_tool_admin_logged');
            setIsAdminLoggedIn(false);
            handleNavigate('/admin/login');
          }}
          onNavigate={handleNavigate}
        />
      );
    }
  } else if (currentPath === '/tools/resume-builder') {
    content = <ResumeBuilder onNavigate={handleNavigate} />;
  } else if (currentPath === '/tools/id-card-crop-pdf') {
    content = <IdCardCropTool />;
  } else if (currentPath.startsWith('/tools/')) {
    const toolId = currentPath.replace('/tools/', '');
    content = <ToolPage toolId={toolId} onNavigate={handleNavigate} />;
  }

  const isAdminRoute = currentPath.startsWith('/admin');

  if (isAdminRoute) {
    return <div className="min-h-screen bg-slate-900 text-slate-100">{content}</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans antialiased selection:bg-blue-600 selection:text-white">
      <Header currentPath={currentPath} onNavigate={handleNavigate} onSelectTool={handleSelectTool} />
      <main className="flex-grow">{content}</main>
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}
