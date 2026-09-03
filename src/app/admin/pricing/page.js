'use client';
import { useState, useEffect } from 'react';
import '@/app/admin/admin.css';

export default function DynamicPricing() {
    const [config, setConfig] = useState({
        surgePricingActive: false,
        surgeMultiplier: 1.2,
        baseRateAdjustment: 0,
        nightSurgeActive: true,
        highDemandThreshold: 10
    });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        // Fetch pricing config
        const fetchConfig = async () => {
            try {
                const res = await fetch('/api/admin/pricing');
                const data = await res.json();
                if (data.success && data.config) {
                    setConfig({
                        surgePricingActive: data.config.surgePricingActive || false,
                        surgeMultiplier: data.config.surgeMultiplier || 1.2,
                        baseRateAdjustment: 0,
                        nightSurgeActive: data.config.nightSurgeMultiplier > 1,
                        highDemandThreshold: 10
                    });
                }
            } catch (err) {
                console.error("Failed to load config", err);
            }
        };
        fetchConfig();
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch('/api/admin/pricing', { 
                method: 'PUT', 
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    surgePricingActive: config.surgePricingActive,
                    surgeMultiplier: config.surgeMultiplier,
                    nightSurgeMultiplier: config.nightSurgeActive ? 1.5 : 1.0
                }) 
            });
            const data = await res.json();
            
            if (data.success) {
                alert('Pricing configurations saved to database successfully!');
            } else {
                alert('Failed to save config: ' + data.message);
            }
        } catch (err) {
            alert('Error saving config: ' + err.message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="admin-page">
            <div className="admin-header">
                <h1>Dynamic Pricing Engine</h1>
                <p>Control base rates, fixed package costs, and surge pricing during high-demand hours.</p>
            </div>

            <div className="dashboard-grid">
                <div className="dashboard-card" style={{gridColumn: '1 / -1'}}>
                    <h3>Surge Pricing Controls</h3>
                    <div style={{display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1rem', maxWidth: '600px'}}>
                        
                        <div className="form-group">
                            <label style={{display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer'}}>
                                <input 
                                    type="checkbox" 
                                    checked={config.surgePricingActive}
                                    onChange={(e) => setConfig({...config, surgePricingActive: e.target.checked})}
                                    style={{width: '20px', height: '20px'}}
                                />
                                <span style={{fontWeight: '600', fontSize: '1.1rem'}}>Enable Global Surge Pricing</span>
                            </label>
                            <p style={{fontSize: '0.9rem', color: '#64748b', marginTop: '0.25rem', marginLeft: '1.75rem'}}>
                                If activated, all base prices will be multiplied by the surge multiplier below.
                            </p>
                        </div>

                        {config.surgePricingActive && (
                            <div className="form-group" style={{marginLeft: '1.75rem', padding: '1rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0'}}>
                                <label>Surge Multiplier (e.g., 1.2 = 20% increase)</label>
                                <input 
                                    type="number" 
                                    step="0.1" 
                                    min="1.0" 
                                    max="3.0"
                                    value={config.surgeMultiplier}
                                    onChange={(e) => setConfig({...config, surgeMultiplier: parseFloat(e.target.value)})}
                                    className="form-input"
                                    style={{width: '100px'}}
                                />
                                <div style={{marginTop: '0.5rem', fontSize: '0.85rem', color: '#3b82f6'}}>
                                    Preview: A ₹500 service will cost ₹{500 * config.surgeMultiplier}
                                </div>
                            </div>
                        )}

                        <div className="form-group" style={{borderTop: '1px solid #e2e8f0', paddingTop: '1.5rem'}}>
                            <label style={{display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer'}}>
                                <input 
                                    type="checkbox" 
                                    checked={config.nightSurgeActive}
                                    onChange={(e) => setConfig({...config, nightSurgeActive: e.target.checked})}
                                    style={{width: '20px', height: '20px'}}
                                />
                                <span style={{fontWeight: '600'}}>Enable Night-Time Surge (8 PM - 6 AM)</span>
                            </label>
                            <p style={{fontSize: '0.9rem', color: '#64748b', marginTop: '0.25rem', marginLeft: '1.75rem'}}>
                                Automatically applies a 1.5x surge for late-night emergency services.
                            </p>
                        </div>
                        
                        <button 
                            className="btn btn-primary" 
                            onClick={handleSave} 
                            disabled={saving}
                            style={{alignSelf: 'flex-start', padding: '0.75rem 2rem'}}
                        >
                            {saving ? 'Saving...' : 'Save Configuration'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
