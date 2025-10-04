import React from 'react';
import styled from 'styled-components';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { SocketProvider } from './components/SocketProvider';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import TopNotificationBell from './components/TopNotificationBell';
import Home from './pages/Home';
import Login from './pages/Login';
import PoliceLogin from './pages/PoliceLogin';
import CourtLogin from './pages/CourtLogin';
import CitizenLogin from './pages/CitizenLogin';
import FileComplaint from './pages/FileComplaint';
import CrimeIdentifiers from './pages/CrimeIdentifiers';
import UploadEvidence from './pages/UploadEvidence';
import TrackCase from './pages/TrackCase';
import CaseStatus from './pages/CaseStatus';
import Dashboard from './pages/Dashboard';
import ManageFIRs from './pages/ManageFIRs';
import EvidenceLocker from './pages/EvidenceLocker';
import AISummarizer from './pages/AISummarizer';
import NLPTranslation from './pages/NLPTranslation';
import DelayPredictor from './pages/DelayPredictor';
import CourtPortal from './pages/CourtPortal';
import './App.css';

const MainContainer = styled.main`
  padding-top: 80px; /* Account for fixed navbar */
  min-height: 100vh;
`;

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <Router>
          <Navbar />
          <TopNotificationBell />
          <MainContainer>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/police-login" element={<PoliceLogin />} />
            <Route path="/court-login" element={<CourtLogin />} />
            <Route path="/citizen-login" element={<CitizenLogin />} />
            
            {/* Public Routes - Must come before protected routes */}
            <Route path="/crime-identifiers" element={<CrimeIdentifiers />} />
            <Route path="/case-status" element={<CaseStatus />} />
            <Route path="/ai-summarizer" element={<AISummarizer />} />
            <Route path="/nlp-translation" element={<NLPTranslation />} />
            <Route path="/delay-predictor" element={<DelayPredictor />} />
            <Route path="/upload-evidence" element={<UploadEvidence />} />
            
            {/* Citizen Routes */}
            <Route path="/citizen/file-complaint" element={
              <ProtectedRoute requiredRole="citizen">
                <FileComplaint />
              </ProtectedRoute>
            } />
            <Route path="/citizen/upload-evidence" element={
              <ProtectedRoute requiredRole="citizen">
                <UploadEvidence />
              </ProtectedRoute>
            } />
            <Route path="/citizen/track-case" element={
              <ProtectedRoute requiredRole="citizen">
                <TrackCase />
              </ProtectedRoute>
            } />
            <Route path="/citizen/ai-summarizer" element={
              <ProtectedRoute requiredRole="citizen">
                <AISummarizer />
              </ProtectedRoute>
            } />
            <Route path="/citizen/nlp-translation" element={
              <ProtectedRoute requiredRole="citizen">
                <NLPTranslation />
              </ProtectedRoute>
            } />
            <Route path="/citizen/delay-predictor" element={
              <ProtectedRoute requiredRole="citizen">
                <DelayPredictor />
              </ProtectedRoute>
            } />
            
            {/* Police Routes */}
            <Route path="/police/dashboard" element={
              <ProtectedRoute requiredRole="police">
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/police/manage-firs" element={
              <ProtectedRoute requiredRole="police">
                <ManageFIRs />
              </ProtectedRoute>
            } />
            <Route path="/police/evidence-locker" element={
              <ProtectedRoute requiredRole="police">
                <EvidenceLocker />
              </ProtectedRoute>
            } />
            <Route path="/police/upload-evidence" element={
              <ProtectedRoute requiredRole="police">
                <UploadEvidence />
              </ProtectedRoute>
            } />
            <Route path="/police/ai-summarizer" element={
              <ProtectedRoute requiredRole="police">
                <AISummarizer />
              </ProtectedRoute>
            } />
            <Route path="/police/nlp-translation" element={
              <ProtectedRoute requiredRole="police">
                <NLPTranslation />
              </ProtectedRoute>
            } />
            <Route path="/police/delay-predictor" element={
              <ProtectedRoute requiredRole="police">
                <DelayPredictor />
              </ProtectedRoute>
            } />
            
            {/* Court Routes */}
            <Route path="/court/portal" element={
              <ProtectedRoute requiredRole="court">
                <CourtPortal />
              </ProtectedRoute>
            } />
            <Route path="/court/upload-evidence" element={
              <ProtectedRoute requiredRole="court">
                <UploadEvidence />
              </ProtectedRoute>
            } />
            <Route path="/court/ai-summarizer" element={
              <ProtectedRoute requiredRole="court">
                <AISummarizer />
              </ProtectedRoute>
            } />
            <Route path="/court/nlp-translation" element={
              <ProtectedRoute requiredRole="court">
                <NLPTranslation />
              </ProtectedRoute>
            } />
            <Route path="/court/delay-predictor" element={
              <ProtectedRoute requiredRole="court">
                <DelayPredictor />
              </ProtectedRoute>
            } />
          </Routes>
        </MainContainer>
        </Router>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;
