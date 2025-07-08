// src/components/AdMobManager.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const AD_KEYS = [
    { key: 'admob_android_app_id', label: 'Android App ID' },
    { key: 'admob_android_banner_id', label: 'Android Banner Ad Unit ID' },
    { key: 'admob_android_interstitial_id', label: 'Android Interstitial Ad Unit ID' },
    { key: 'admob_ios_app_id', label: 'iOS App ID' },
    { key: 'admob_ios_banner_id', label: 'iOS Banner Ad Unit ID' },
    { key: 'admob_ios_interstitial_id', label: 'iOS Interstitial Ad Unit ID' },
];

export default function AdMobManager() {
    const [config, setConfig] = useState({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        async function fetchConfig() {
            const { data, error } = await supabase.from('config').select('key, value');
            if (!error) {
                const newConfig = data.reduce((acc, item) => {
                    acc[item.key] = item.value;
                    return acc;
                }, {});
                setConfig(newConfig);
            }
            setLoading(false);
        }
        fetchConfig();
    }, []);

    const handleInputChange = (key, value) => {
        setConfig(prev => ({ ...prev, [key]: value }));
    };

    const handleSave = async () => {
        setSaving(true);
        setMessage('');

        const dataToUpsert = AD_KEYS.map(item => ({
            key: item.key,
            value: config[item.key] || '',
        }));

        const { error } = await supabase.from('config').upsert(dataToUpsert);

        if (error) {
            setMessage('Error saving keys: ' + error.message);
        } else {
            setMessage('AdMob keys saved successfully!');
        }
        setSaving(false);
    };

    if (loading) return <p>Loading AdMob settings...</p>;

    return (
        <div className="admob-manager">
            <h2>AdMob Key Management</h2>
            <p>Enter the AdMob keys below. These will be synced with the mobile app.</p>
            {AD_KEYS.map(item => (
                <div className="form-group" key={item.key}>
                    <label htmlFor={item.key}>{item.label}</label>
                    <input
                        type="text"
                        id={item.key}
                        value={config[item.key] || ''}
                        onChange={(e) => handleInputChange(item.key, e.target.value)}
                    />
                </div>
            ))}
            <button onClick={handleSave} disabled={saving} className="button-primary">
                {saving ? 'Saving...' : 'Save AdMob Keys'}
            </button>
            {message && <p style={{ marginTop: '15px' }}>{message}</p>}
        </div>
    );
}