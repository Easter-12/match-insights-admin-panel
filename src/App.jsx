// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminLayout from './components/AdminLayout.jsx';
import DashboardPage from './components/DashboardPage.jsx';
import UserManagement from './components/UserManagement.jsx';
import MatchesPage from './components/MatchesPage.jsx';
import VipManagementPage from './components/VipManagementPage.jsx';
import PredictionReview from './components/PredictionReview.jsx';
import AdMobManager from './components/AdMobManager.jsx';
import './App.css';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AdminLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/users" element={<UserManagement />} />
          <Route path="/matches" element={<MatchesPage />} />
          <Route path="/vip-matches" element={<VipManagementPage />} />
          <Route path="/user-predictions" element={<PredictionReview />} />
          <Route path="/settings" element={<AdMobManager />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}