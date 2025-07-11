// src/components/VipMatchUpload.jsx
import React, { useState } from 'react';
import { supabase } from '../supabaseClient.js';

export default function VipMatchUpload() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [match, setMatch] = useState({
    home_team: '', away_team: '', country: '', league: '',
    kickoff_time: '', prediction_text: '', odds: '', total_odds: ''
  });

  const handleChange = (e) => {
    setMatch({ ...match, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    const { error } = await supabase.from('vip_matches').insert([match]);

    if (error) {
      setMessage('Error uploading VIP match: ' + error.message);
    } else {
      setMessage('VIP Match uploaded successfully!');
      setMatch({ home_team: '', away_team: '', country: '', league: '', kickoff_time: '', prediction_text: '', odds: '', total_odds: '' });
    }
    setLoading(false);
  };

  return (
    <div className="match-upload">
      <h3>Upload New VIP Match</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group"><label>Home Team</label><input type="text" name="home_team" value={match.home_team} onChange={handleChange} required /></div>
        <div className="form-group"><label>Away Team</label><input type="text" name="away_team" value={match.away_team} onChange={handleChange} required /></div>
        <div className="form-group"><label>Country</label><input type="text" name="country" value={match.country} onChange={handleChange} /></div>
        <div className="form-group"><label>League</label><input type="text" name="league" value={match.league} onChange={handleChange} /></div>
        <div className="form-group"><label>Date & Time (Kickoff)</label><input type="datetime-local" name="kickoff_time" value={match.kickoff_time} onChange={handleChange} required /></div>
        <div className="form-group"><label>Prediction Text</label><input type="text" name="prediction_text" value={match.prediction_text} onChange={handleChange} required /></div>
        <div className="form-group"><label>Odds</label><input type="number" step="0.01" name="odds" value={match.odds} onChange={handleChange} /></div>
        <div className="form-group"><label>Total Odds</label><input type="number" step="0.01" name="total_odds" value={match.total_odds} onChange={handleChange} /></div>
        <button type="submit" className="button-primary" disabled={loading}>
          {loading ? 'Uploading...' : 'Upload VIP Match'}
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}