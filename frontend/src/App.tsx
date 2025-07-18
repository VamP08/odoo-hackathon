import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Header } from './components/Layout/Header';
import { Footer } from './components/Layout/Footer';
import { HomePage } from './pages/HomePage';
import { BrowsePage } from './pages/BrowsePage';
import { ItemDetailPage } from './pages/ItemDetailPage';
import { LoginForm } from './components/Auth/LoginForm';
import { SignupForm } from './components/Auth/SignupForm';
import { DashboardPage } from './pages/DashboardPage';
import { AddItemPage } from './pages/AddItemPage';
import { AdminPage } from './pages/AdminPage';
import { SwapRequestsPage } from './pages/SwapRequestsPage';
import { MessagesPage } from './pages/MessagesPage';
import { UserProfilePage } from './pages/UserProfilePage';
import { HistoryPage } from './pages/HistoryPage';
import { SafetyGuidelines } from './pages/SafetyGuidelines';
import { HowitWorks } from './pages/HowitWorks';
import { PointSystem } from './pages/PointSystem';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/browse" element={<BrowsePage />} />
              <Route path="/item/:id" element={<ItemDetailPage />} />
              <Route path="/login" element={<LoginForm />} />
              <Route path="/signup" element={<SignupForm />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/add-item" element={<AddItemPage />} />
              <Route path="/swap-requests" element={<SwapRequestsPage />} />
              <Route path="/messages" element={<MessagesPage />} />
              <Route path="/profile/:userId" element={<UserProfilePage />} />
              <Route path="/history" element={<HistoryPage />} />
              <Route path="/admin" element={<AdminPage />} />                <Route path="/safety-guidelines" element={<SafetyGuidelines />} />
              <Route path="/how-it-works" element={<HowitWorks />} />
              <Route path="/point-system" element={<PointSystem />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
    </AuthProvider>
  );
}

export default App;