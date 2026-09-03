'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function LiveTracking() {
    const params = useParams();
    const router = useRouter();
    const [bookingDetails, setBookingDetails] = useState({
        partnerName: 'Ramesh Plumber',
        partnerPhone: '+91 9876543210',
        status: 'On the way',
        eta: '12 mins',
        vehicle: 'MH 02 AB 1234'
    });

    return (
        <div style={{minHeight: '100vh', background: '#f8fafc', display: 'flex', flexDirection: 'column'}}>
            {/* Header */}
            <div style={{background: 'white', padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', zIndex: 10}}>
                <button onClick={() => router.push('/profile')} style={{background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer'}}>←</button>
                <h2 style={{margin: 0, fontSize: '1.2rem'}}>Track Partner</h2>
            </div>

            {/* Map Mock Area */}
            <div style={{flex: 1, position: 'relative', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden'}}>
                {/* Mocking a map background */}
                <div style={{position: 'absolute', inset: 0, opacity: 0.5, backgroundImage: 'url("https://www.transparenttextures.com/patterns/cartographer.png")', backgroundSize: '200px'}}></div>
                
                {/* Simulated Route */}
                <svg style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%'}}>
                    <path d="M 100 100 Q 200 150 250 300 T 400 500" fill="none" stroke="#3b82f6" strokeWidth="4" strokeDasharray="8 8" />
                </svg>

                {/* Partner Marker */}
                <div style={{position: 'absolute', top: '300px', left: '250px', transform: 'translate(-50%, -50%)', zIndex: 5, animation: 'bounce 2s infinite'}}>
                    <div style={{background: '#10b981', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '4px', whiteSpace: 'nowrap'}}>
                        Partner Here
                    </div>
                    <div style={{width: '20px', height: '20px', background: '#10b981', border: '3px solid white', borderRadius: '50%', margin: '0 auto', boxShadow: '0 2px 5px rgba(0,0,0,0.3)'}}></div>
                </div>

                {/* Destination Marker */}
                <div style={{position: 'absolute', top: '500px', left: '400px', transform: 'translate(-50%, -50%)', zIndex: 5}}>
                    <div style={{background: '#ef4444', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '4px', whiteSpace: 'nowrap'}}>
                        Your Location
                    </div>
                    <div style={{width: '20px', height: '20px', background: '#ef4444', border: '3px solid white', borderRadius: '50%', margin: '0 auto', boxShadow: '0 2px 5px rgba(0,0,0,0.3)'}}></div>
                </div>
            </div>

            {/* Bottom Info Sheet */}
            <div style={{background: 'white', padding: '1.5rem', borderRadius: '20px 20px 0 0', boxShadow: '0 -4px 10px rgba(0,0,0,0.1)', zIndex: 10, marginTop: '-20px'}}>
                <div style={{width: '40px', height: '5px', background: '#e2e8f0', borderRadius: '5px', margin: '0 auto 1rem auto'}}></div>
                
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem'}}>
                    <div>
                        <h3 style={{margin: '0 0 0.25rem 0', color: '#1e293b'}}>{bookingDetails.status}</h3>
                        <p style={{margin: 0, color: '#10b981', fontWeight: 'bold', fontSize: '0.9rem'}}>Arriving in {bookingDetails.eta}</p>
                    </div>
                    <div style={{background: '#f1f5f9', padding: '8px 12px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 'bold'}}>
                        OTP: <span style={{color: '#2563eb', fontSize: '1.2rem', letterSpacing: '2px'}}>5924</span>
                    </div>
                </div>

                <div style={{display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: '#f8fafc', borderRadius: '12px'}}>
                    <div style={{width: '50px', height: '50px', borderRadius: '50%', background: '#3b82f6', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold'}}>
                        {bookingDetails.partnerName.charAt(0)}
                    </div>
                    <div style={{flex: 1}}>
                        <div style={{fontWeight: 'bold', color: '#1e293b'}}>{bookingDetails.partnerName}</div>
                        <div style={{fontSize: '0.85rem', color: '#64748b'}}>⭐ 4.9 (120+ jobs)</div>
                    </div>
                    <div style={{display: 'flex', gap: '10px'}}>
                        <a href={`tel:${bookingDetails.partnerPhone}`} style={{width: '40px', height: '40px', borderRadius: '50%', background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none'}}>
                            📞
                        </a>
                    </div>
                </div>
            </div>
            
            <style jsx>{`
                @keyframes bounce {
                    0%, 100% { transform: translate(-50%, -50%) translateY(0); }
                    50% { transform: translate(-50%, -50%) translateY(-10px); }
                }
            `}</style>
        </div>
    );
}
