// src/components/PredictionReview.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function PredictionReview() {
    const [predictions, setPredictions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchPredictions() {
            try {
                setLoading(true);
                // We use a join to get the user's email from the profiles table
                const { data, error } = await supabase
                    .from('user_predictions')
                    .select(`
                        *,
                        profiles ( email )
                    `)
                    .order('created_at', { ascending: false });

                if (error) throw error;
                setPredictions(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        }
        fetchPredictions();
    }, []);

    const getSuggestedOutcome = (prediction) => {
        const suggestions = [];
        const totalGoals = parseFloat(prediction.avg_goals_scored) + parseFloat(prediction.avg_goals_conceded);

        if (totalGoals > 2.5) {
            suggestions.push('Over 2.5');
        }
        if (totalGoals < 2.5) {
            suggestions.push('Under 2.5');
        }
        if (prediction.avg_goals_scored >= 1.0 && prediction.avg_goals_conceded >= 1.0) {
            suggestions.push('GG');
        }
        return suggestions.length > 0 ? suggestions.join(', ') : 'N/A';
    };

    if (loading) return <p>Loading user predictions...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="prediction-review">
            <h2>Prediction Review (User Uploads)</h2>
            {predictions.length === 0 ? (
                <p>No users have submitted predictions yet.</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Avg. Goals Scored</th>
                            <th>Avg. Goals Conceded</th>
                            <th>Last 5 Form</th>
                            <th>Last 5 Goal Totals</th>
                            <th>Suggested Outcome</th>
                        </tr>
                    </thead>
                    <tbody>
                        {predictions.map(p => (
                            <tr key={p.id}>
                                <td>{p.profiles.email}</td>
                                <td>{p.avg_goals_scored}</td>
                                <td>{p.avg_goals_conceded}</td>
                                <td>{p.last_5_form}</td>
                                <td>{p.last_5_goal_totals}</td>
                                <td>{getSuggestedOutcome(p)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}