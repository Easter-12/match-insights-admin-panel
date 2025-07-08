// src/components/MatchUpload.jsx
import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

export default function MatchUpload() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [match, setMatch] = useState({
    home_team: '',
    away_team: '',
    country: '',
    league: '',
    kickoff_time: '',
    prediction_text: '',
    odds: '', // New field
    total_odds: '', // New field
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMatch(prevMatch => ({ ...prevMatch, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    // Make sure empty strings for odds are saved as null
    const matchData = {
        ...match,
        odds: match.odds === '' ? null : match.odds,
        total_odds: match.total_odds === '' ? null : match.total_odds
    };

    const { error } = await supabase.from('matches').insert([matchData]);

    if (error) {
      setMessage('Error uploading match: ' + error.message);
    } else {
      setMessage('Match uploaded successfully!');
      // Clear the form
      setMatch({
        home_team: '',
        away_team: '',
        country: '',
        league: '',
        kickoff_time: '',
        prediction_text: '',
        odds: '',
        total_odds: '',
      });
    }
    setLoading(false);
  };

  return (
    <div className="match-upload">
      <h2>Free Match Upload</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="home_team">Home Team</label>
          <input type="text" name="home_team" value={match.home_team} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="away_team">Away Team</label>
          <input type="text" name="away_team" value={match.away_team} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="country">Country</label>
          <input type="text" name="country" value={match.country} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="league">League</label>
          <input type="text" name="league" value={match.league} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="kickoff_time">Date & Time (Kickoff)</label>
          <input type="datetime-local" name="kickoff_time" value={match.kickoff_time} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="prediction_text">Prediction Text (e.g., "GG & Over 2.5")</label>
          <input type="text" name="prediction_text" value={match.prediction_text} onChange={handleChange} required />
        </div>
        {/* ----- NEW FIELDS ADDED HERE ----- */}
        <div className="form-group">
          <label htmlFor="odds">Odds</label>
          <input type="number" step="0.01" name="odds" placeholder="e.g. 1.85" value={match.odds} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="total_odds">Total Odds</label>
          <input type="number" step="0.01" name="total_odds" placeholder="e.g. 3.50" value={match.total_odds} onChange={handleChange} />
        </div>
        {/* ----------------------------------- */}
        <button type="submit" className="button-primary" disabled={loading}>
          {loading ? 'Uploading...' : 'Upload Match'}
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}