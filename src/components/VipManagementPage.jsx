// src/components/VipManagementPage.jsx
import React from 'react';
import VipMatchUpload from './VipMatchUpload.jsx';
import VipMatchList from './VipMatchList.jsx';

export default function VipManagementPage() {
  return (
    <div>
      <h2>VIP Match Management</h2>
      <div className="widget">
        <VipMatchUpload />
      </div>
      <div className="widget">
        <VipMatchList />
      </div>
    </div>
  );
}