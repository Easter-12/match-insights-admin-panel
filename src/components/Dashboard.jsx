// src/components/Dashboard.jsx
import React from 'react';
import UserManagement from './UserManagement';
import MatchUpload from './MatchUpload';
import MatchList from './MatchList';
import VipPlaceholder from './VipPlaceholder';
import AdMobManager from './AdMobManager';
import PredictionReview from './PredictionReview';
// We are skipping these two as requested
// import ReportMonitoring from './ReportMonitoring';
// import ChatMonitoring from './ChatMonitoring';

export default function Dashboard() {
  return (
    <div>
      <h1>Match Insights - Admin Dashboard</h1>

      <div className="widget">
        <VipPlaceholder />
      </div>

      <div className="widget">
        <AdMobManager />
      </div>

      <div className="widget">
        <PredictionReview />
      </div>

      <div className="widget">
        <UserManagement />
      </div>

      <div className="widget">
        <MatchUpload />
      </div>

      <div className="widget">
        <MatchList />
      </div>
    </div>
  );
}