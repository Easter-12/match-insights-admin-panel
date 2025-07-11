// src/components/VipMatchList.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient.js';

export default function VipMatchList() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState({});
  const [statuses, setStatuses] = useState({});

  async function fetchMatches() {
    setLoading(true);
    const { data, error } = await supabase.from('vip_matches').select('*').order('kickoff_time', { ascending: false });
    if (error) console.error(error);
    else setMatches(data);
    setLoading(false);
  }

  useEffect(() => { fetchMatches(); }, []);

  const handleUpdateResult = async (matchId) => {
    const result = results[matchId];
    const status = statuses[matchId];
    if (!result || !status) return alert('Please enter a result and select a status.');
    await supabase.from('vip_matches').update({ result, status, is_completed: true }).eq('id', matchId);
    fetchMatches();
  };

  const handleDeleteMatch = async (matchId) => {
    if (window.confirm('Are you sure?')) {
      await supabase.from('vip_matches').delete().eq('id', matchId);
      fetchMatches();
    }
  };

  const activeMatches = matches.filter(m => !m.is_completed);
  const matchHistory = matches.filter(m => m.is_completed);

  if (loading) return <p>Loading VIP matches...</p>;

  return (
    <div>
      <h3>Active VIP Matches</h3>
      <table>
        <thead><tr><th>Match</th><th>Prediction</th><th>Odds</th><th>Result</th><th>Status</th><th>Action</th></tr></thead>
        <tbody>
          {activeMatches.map(match => (
            <tr key={match.id}>
              <td>{match.home_team} vs {match.away_team}</td>
              <td>{match.prediction_text}</td>
              <td>{match.odds}</td>
              <td><input type="text" onChange={(e) => setResults({...results, [match.id]: e.target.value})} /></td>
              <td>
                <select onChange={(e) => setStatuses({...statuses, [match.id]: e.target.value})} defaultValue="">
                  <option value="" disabled>Select...</option><option value="Won">Won</option><option value="Lost">Lost</option>
                </select>
              </td>
              <td><button onClick={() => handleUpdateResult(match.id)} className="button-primary">Update</button></td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 style={{ marginTop: '40px' }}>VIP Match History</h3>
      <table>
        <thead><tr><th>Date</th><th>Match</th><th>Prediction</th><th>Odds</th><th>Result</th><th>Status</th><th>Action</th></tr></thead>
        <tbody>
          {matchHistory.map(match => (
            <tr key={match.id}>
              <td>{new Date(match.kickoff_time).toLocaleDateString()}</td>
              <td>{match.home_team} vs {match.away_team}</td>
              <td>{match.prediction_text}</td>
              <td>{match.odds}</td>
              <td><strong>{match.result}</strong></td>
              <td><span style={{color: match.status === 'Won' ? '#48bb78' : '#e53e3e', fontWeight: 'bold'}}>{match.status}</span></td>
              <td><button onClick={() => handleDeleteMatch(match.id)} className="button-danger">Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}