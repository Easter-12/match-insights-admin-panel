// src/components/MatchesPage.jsx
import React from 'react';
import MatchUpload from './MatchUpload.jsx';
import MatchList from './MatchList.jsx';

export default function MatchesPage() {
  return (
    <div>
      <div className="widget">
        <MatchUpload />
      </div>
      <div className="widget">
        <MatchList />
      </div>
    </div>
  );
}