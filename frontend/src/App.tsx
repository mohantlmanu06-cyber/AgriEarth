import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { FarmProvider } from './context/FarmContext';

// Components
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Sidebar } from './components/Sidebar';
import { AppHeader } from './components/AppHeader';

// Public Pages
import { LandingPage } from './pages/public/LandingPage';
import { AboutPage } from './pages/public/AboutPage';
import { HowItWorksPage } from './pages/public/HowItWorksPage';
import { NasaDataPublicPage } from './pages/public/NasaDataPublicPage';
import { FeaturesPage } from './pages/public/FeaturesPage';
import { ContactPage } from './pages/public/ContactPage';
import { LoginPage } from './pages/public/LoginPage';
import { RegisterPage } from './pages/public/RegisterPage';

// Farmer App Pages
import { DashboardPage } from './pages/app/DashboardPage';
import { FieldManagementPage } from './pages/app/FieldManagementPage';
import { AddFieldPage } from './pages/app/AddFieldPage';
import { FieldAnalysisPage } from './pages/app/FieldAnalysisPage';
import { RotationPlannerPage } from './pages/app/RotationPlannerPage';
import { RecommendationsPage } from './pages/app/RecommendationsPage';
import { NasaExplorerPage } from './pages/app/NasaExplorerPage';
import { WeatherClimatePage } from './pages/app/WeatherClimatePage';
import { SoilHealthPage } from './pages/app/SoilHealthPage';
import { CropDatabasePage } from './pages/app/CropDatabasePage';
import { RotationComparisonPage } from './pages/app/RotationComparisonPage';
import { SustainabilityReportPage } from './pages/app/SustainabilityReportPage';
import { ProfileSettingsPage } from './pages/app/ProfileSettingsPage';
import { WhatIfPage } from './pages/app/WhatIfPage';
import { RiskUncertaintyPage } from './pages/app/RiskUncertaintyPage';
import { DataSourcesPage } from './pages/app/DataSourcesPage';
import { CropHistoryPage } from './pages/app/CropHistoryPage';

// Layout Wrappers
const PublicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-800">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0 lg:pl-68">
        <AppHeader onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 pb-12">{children}</main>
      </div>
    </div>
  );
};

// Protected route wrapper that requires active authentication
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-semibold text-slate-600">Verifying security session...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <AppLayout>{children}</AppLayout>;
};

export function App() {
  return (
    <AuthProvider>
      <FarmProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<PublicLayout><LandingPage /></PublicLayout>} />
            <Route path="/about" element={<PublicLayout><AboutPage /></PublicLayout>} />
            <Route path="/how-it-works" element={<PublicLayout><HowItWorksPage /></PublicLayout>} />
            <Route path="/nasa-data" element={<PublicLayout><NasaDataPublicPage /></PublicLayout>} />
            <Route path="/features" element={<PublicLayout><FeaturesPage /></PublicLayout>} />
            <Route path="/contact" element={<PublicLayout><ContactPage /></PublicLayout>} />
            <Route path="/login" element={<PublicLayout><LoginPage /></PublicLayout>} />
            <Route path="/register" element={<PublicLayout><RegisterPage /></PublicLayout>} />

            {/* Farmer Application Routes */}
            <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="/fields" element={<ProtectedRoute><FieldManagementPage /></ProtectedRoute>} />
            <Route path="/add-field" element={<ProtectedRoute><AddFieldPage /></ProtectedRoute>} />
            <Route path="/field-analysis" element={<ProtectedRoute><FieldAnalysisPage /></ProtectedRoute>} />
            <Route path="/planner" element={<ProtectedRoute><RotationPlannerPage /></ProtectedRoute>} />
            <Route path="/recommendations" element={<ProtectedRoute><RecommendationsPage /></ProtectedRoute>} />
            <Route path="/nasa-explorer" element={<ProtectedRoute><NasaExplorerPage /></ProtectedRoute>} />
            <Route path="/weather-climate" element={<ProtectedRoute><WeatherClimatePage /></ProtectedRoute>} />
            <Route path="/soil-health" element={<ProtectedRoute><SoilHealthPage /></ProtectedRoute>} />
            <Route path="/crops" element={<ProtectedRoute><CropDatabasePage /></ProtectedRoute>} />
            <Route path="/compare-rotations" element={<ProtectedRoute><RotationComparisonPage /></ProtectedRoute>} />
            <Route path="/what-if" element={<ProtectedRoute><WhatIfPage /></ProtectedRoute>} />
            <Route path="/risk-uncertainty" element={<ProtectedRoute><RiskUncertaintyPage /></ProtectedRoute>} />
            <Route path="/crop-history" element={<ProtectedRoute><CropHistoryPage /></ProtectedRoute>} />
            <Route path="/data-sources" element={<ProtectedRoute><DataSourcesPage /></ProtectedRoute>} />
            <Route path="/app/data-sources" element={<Navigate to="/data-sources" replace />} />
            <Route path="/reports" element={<ProtectedRoute><SustainabilityReportPage /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><ProfileSettingsPage /></ProtectedRoute>} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </FarmProvider>
    </AuthProvider>
  );
}

export default App;
