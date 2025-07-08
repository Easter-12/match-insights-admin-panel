// src/components/ReportMonitoring.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function ReportMonitoring() {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchReports() {
            try {
                setLoading(true);
                // This is a more complex query to get emails for both users
                const { data, error } = await supabase
                    .from('reports')
                    .select(`
                        id,
                        created_at,
                        reason,
                        status,
                        reporting_user:profiles!reports_reporting_user_id_fkey ( email ),
                        reported_user:profiles!reports_reported_user_id_fkey ( email )
                    `)
                    .order('created_at', { ascending: false });

                if (error) throw error;
                setReports(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        }
        fetchReports();
    }, []);

    if (loading) return <p>Loading reports...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="report-monitoring">
            <h2>User Report Logs</h2>
            {reports.length === 0 ? (
                <p>No reports have been submitted.</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Reported By</th>
                            <th>User Reported</th>
                            <th>Reason</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reports.map(report => (
                            <tr key={report.id}>
                                <td>{new Date(report.created_at).toLocaleString()}</td>
                                <td>{report.reporting_user.email}</td>
                                <td>{report.reported_user.email}</td>
                                <td>{report.reason}</td>
                                <td>{report.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}