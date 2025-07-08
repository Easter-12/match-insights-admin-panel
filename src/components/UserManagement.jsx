// src/components/UserManagement.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function fetchUsers() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, created_at, is_blocked')
        .order('created_at', { ascending: false }); // Show newest users first

      if (error) {
        throw error;
      }
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

    if (error) {
      alert('Error updating user status: ' + error.message);
    } else {
      // Refresh the list to show the change immediately
      fetchUsers();
    }
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This action is irreversible.')) {
        // IMPORTANT: For security, a client-side app cannot delete a user from the
        // main auth.users table. This must be done in the Supabase dashboard.
        alert('Action required: For security, please delete this user from the Supabase Dashboard under "Authentication".');
    }
  };

  if (loading) return <p>Loading users...</p>;
  if (error) return <p>Error loading users: {error}</p>;

  return (
    <div className="user-management">
      <h2>User Management</h2>
      {users.length === 0 ? (
        <p>No users have registered yet.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Email</th>
              <th>Joined On</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.email}</td>
                <td>{new Date(user.created_at).toLocaleDateString()}</td>
                <td>
                    <span style={{ color: user.is_blocked ? 'red' : 'green' }}>
                        {user.is_blocked ? 'Blocked' : 'Active'}
                    </span>
                </td>
                <td>
                  <button
                    onClick={() => handleToggleBlock(user.id, user.is_blocked)}
                    className={user.is_blocked ? 'button-success' : 'button-warning'}
                  >
                    {user.is_blocked ? 'Unblock' : 'Block'}
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="button-danger"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}