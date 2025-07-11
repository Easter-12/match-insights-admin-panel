// src/components/MatchList.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient.js';

export default function MatchList() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [results, setResults] = useState({});
  const [statuses, setStatuses] = useState({});

  async function fetchMatches() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('matches')
        .select('*')
        .order('kickoff_time', { ascending: false });

      if (error) throw error;
      setMatches(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchMatches();
  }, []);

  const handleResultChange = (matchId, value) => {
    setResults(prev => ({ ...prev, [matchId]: value }));
  };

  const handleStatusChange = (matchId, value) => {
    setStatuses(prev => ({ ...prev, [matchId]: value }));
  };

  const handleUpdateResult = async (matchId) => {
    const result = results[matchId];
    const status = statuses[matchId];

    if (!result || result.trim() === '') {
      alert('Please enter a result.');
      return;
    }
    if (!status) {
      alert('Please select a status (Won or Lost).');
      return;
    }

    const { error } = await supabase
      .from('matches')
      .update({ result: result, status: status, is_completed: true })
      .eq('id', matchId);

    if (error) {
      alert('Error updating result: ' + error.message);
    } else {
      alert('Match result updated successfully!');
      fetchMatches();
    }
  };

  const handleDeleteMatch = async (matchId) => {
    if (window.confirm('Are you sure you want to permanently delete this match from history?')) {
        const { error } = await supabase
            .from('matches')
            .delete()
            .eq('id', matchId);

        if (error) {
            alert('Error deleting match: ' + error.message);
        } else {
            alert('Match deleted successfully.');
            fetchMatches();
        }
    }
  };

  if (loading) return <p>Loading matches...</p>;
  if (error) return <p>Error loading matches: {error}</p>;

  const activeMatches = matches.filter(m => !m.is_completed);
  const matchHistory = matches.filter(m => m.is_completed);

  return (
    <div className="match-list">
      <h3>Active Matches</h3>
      {activeMatches.length === 0 ? (
        <p>No active matches.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Match</th>
              <th>Prediction</th>
              <th>Odds</th>
              <th>Result Input</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {activeMatches.map(match => (
              <tr key={match.id}>
                <td>{match.home_team} vs {match.away_team}</td>
                <td>{match.prediction_text}</td>
                <td>{match.odds}</td>
                <td>
                  <input
                    type="text"
                    placeholder="e.g., 2-1"
                    onChange={(e) => handleResultChange(match.id, e.target.value)}
                  />
                </td>
                <td>
                  <select onChange={(e) => handleStatusChange(match.id, e.target.value)} defaultValue="">
                    <option value="" disabled>Select...</option>
                    <option value="Won">Won</option>
                    <option value="Lost">Lost</option>
                  </select>
                </td>
                <td>
                  <button onClick={() => handleUpdateResult(match.id)} className="button-primary">Update</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h3 style={{ marginTop: '40px' }}>Match History</h3>
      {matchHistory.length === 0 ? (
        <p>No completed matches yet.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Match</th>
              <th>Prediction</th>
              <th>Odds</th> {/* <<< THIS COLUMN IS NEW */}
              <th>Final Result</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {matchHistory.map(match => (
              <tr key={match.id}>
                <td>{new Date(match.kickoff_time).toLocaleDateString()}</td>
                <td>{match.home_team} vs {match.away_team}</td>
                <td>{match.prediction_text}</td>
                <td>{match.odds}</td> {/* <<< THIS DATA IS NEW */}
                <td><strong>{match.result}</strong></td>
                <td>
                  <span style={{color: match.status === 'Won' ? '#48bb78' : '#e53e3e', fontWeight: 'bold'}}>
                    {match.status}
                  </span>
                </td>
                <td>
                  <button onClick={() => handleDeleteMatch(match.id)} className="button-danger">
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