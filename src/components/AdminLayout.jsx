// src/components/AdminLayout.jsx
import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

export default function AdminLayout() {
  return (
    <div className="admin-layout">
      <nav className="sidebar">
        <h1 className="sidebar-header">Match Insights</h1>
        <NavLink to="/" className="nav-link">Dashboard</NavLink>
        <NavLink to="/users" className="nav-link">User Management</NavLink>
        <NavLink to="/matches" className="nav-link">Match Management</NavLink>
        <NavLink to="/user-predictions" className="nav-link">Prediction Review</NavLink>
        <NavLink to="/settings" className="nav-link">Settings</NavLink>
      </nav>
      <main className="main-content">
        <Outlet /> {/* This is where the page content will be rendered */}
      </main>
    </div>
  );
}