// src/components/UserManagement.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient.js';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function fetchUsers() {
    try {
      setLoading(true);
      // We now fetch the is_vip column as well
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, created_at, is_blocked, is_vip')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleBlock = async (userId, currentStatus) => {
    const { error } = await supabase
      .from('profiles')
      .update({ is_blocked: !currentStatus })
      .eq('id', userId);
    if (error) alert('Error: ' + error.message);
    else fetchUsers();
  };

  // --- NEW FUNCTION TO HANDLE VIP STATUS ---
  const handleToggleVip = async (userId, currentVipStatus) => {
    const newVipStatus = !currentVipStatus;
    const action = newVipStatus ? 'grant' : 'revoke';

    if (window.confirm(`Are you sure you want to ${action} VIP access for this user?`)) {
      const { error } = await supabase
        .from('profiles')
        .update({ is_vip: newVipStatus })
        .eq('id', userId);

      if (error) {
        alert('Error updating VIP status: ' + error.message);
      } else {
        fetchUsers(); // Refresh the list to show the change
      }
    }
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm('Are you sure? This action is irreversible.')) {
      alert('Action required: For security, please delete this user from the Supabase Dashboard under "Authentication".');
    }
  };

  if (loading) return <p>Loading users...</p>;
  if (error) return <p>Error loading users: {error}</p>;

  return (
    <div className="user-management">
      <h2>User Management</h2>
      <table>
        <thead>
          <tr>
            <th>Email</th>
            <th>VIP Status</th> {/* NEW COLUMN */}
            <th>Account Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.email}</td>
              <td>
                {/* NEW VIP STATUS DISPLAY */}
                <span style={{ color: user.is_vip ? '#48bb78' : '#a0aec0', fontWeight: 'bold' }}>
                  {user.is_vip ? 'VIP Member' : 'Standard'}
                </span>
              </td>
              <td>
                <span style={{ color: user.is_blocked ? '#e53e3e' : '#48bb78' }}>
                  {user.is_blocked ? 'Blocked' : 'Active'}
                </span>
              </td>
              <td>
                {/* NEW VIP ACTION BUTTON */}
                <button
                  onClick={() => handleToggleVip(user.id, user.is_vip)}
                  className={user.is_vip ? 'button-warning' : 'button-success'}
                >
                  {user.is_vip ? 'Revoke VIP' : 'Grant VIP'}
                </button>

                <button
                  onClick={() => handleToggleBlock(user.id, user.is_blocked)}
                  className={user.is_blocked ? 'button-success' : 'button-warning'}
                >
                  {user.is_blocked ? 'Unblock' : 'Block'}
                </button>

                <button onClick={() => handleDeleteUser(user.id)} className="button-danger">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}