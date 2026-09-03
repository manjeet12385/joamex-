'use client';
import { useState, useEffect } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../admin.css';
import '../locations/locations.css';

export default function WebsiteContentEditor() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isSubmitLoading, setIsSubmitLoading] = useState(false);

    // Page content state
    const [seoTitle, setSeoTitle] = useState('Joamex Home Services | Professional Home Cleaning & Pest Control');
    const [seoDescription, setSeoDescription] = useState('Get professional cleaning, electrical, plumbing, and pest control services at your doorstep with verified service partners.');
    const [heroHeading, setHeroHeading] = useState('Professional home services on demand.');
    
    // FAQ list state
    const [faqs, setFaqs] = useState([
        { q: 'How do I book a service?', a: 'You can book by selecting a category, picking a service, and choosing a time slot.' },
        { q: 'Are your service professionals verified?', a: 'Yes, all Joamex partners undergo complete KYC checks and licensing verifications.' }
    ]);
    
    // Form fields for adding new FAQ
    const [newQuestion, setNewQuestion] = useState('');
    const [newAnswer, setNewAnswer] = useState('');

    const fetchContent = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/site-content');
            const data = await res.json();
            if (data.data) {
                const d = data.data;
                if (d.seoTitle) setSeoTitle(d.seoTitle);
                if (d.seoDescription) setSeoDescription(d.seoDescription);
                if (d.heroHeading) setHeroHeading(d.heroHeading);
                if (d.faqs) setFaqs(d.faqs);
            }
        } catch (error) {
            console.error('Failed to fetch site content', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContent();
    }, []);

    const handleSave = async (e) => {
        e.preventDefault();
        setIsSubmitLoading(true);
        try {
            const res = await fetch('/api/site-content', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    data: {
                        seoTitle,
                        seoDescription,
                        heroHeading,
                        faqs
                    }
                })
            });
            const data = await res.json();
            if (res.ok) {
                toast.success('Site content saved successfully');
            } else {
                toast.error(data.error || 'Failed to save content');
            }
        } catch (error) {
            toast.error('Network error saving website content');
        } finally {
            setIsSubmitLoading(false);
        }
    };

    const handleAddFaq = (e) => {
        e.preventDefault();
        if (!newQuestion.trim() || !newAnswer.trim()) return;
        setFaqs([...faqs, { q: newQuestion.trim(), a: newAnswer.trim() }]);
        setNewQuestion('');
        setNewAnswer('');
        toast.info('FAQ added to draft. Remember to save changes.');
    };

    const handleRemoveFaq = (index) => {
        const updated = faqs.filter((_, i) => i !== index);
        setFaqs(updated);
        toast.info('FAQ removed from draft. Remember to save changes.');
    };

    return (
        <div className={`dashboard-container ${isSidebarOpen ? 'sidebar-open' : ''}`}>
            <ToastContainer position="bottom-right" theme="dark" />
            <AdminSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
            
            <main className="main-content">
                <AdminHeader />
                
                <div className="page-header">
                    <h1 className="page-title">Website Content & SEO Editor</h1>
                    <p className="page-subtitle">Configure homepage banners, FAQ lists, SEO titles, and descriptions dynamically.</p>
                </div>

                <div className="location-grid" style={{ marginTop: '1.5rem' }}>
                    {/* Left: General Settings & SEO */}
                    <div className="section-card" style={{ height: 'fit-content' }}>
                        <h3 className="section-title">Static Elements & Metadata</h3>
                        <form onSubmit={handleSave} className="premium-form">
                            <div className="form-group">
                                <label>SEO Title Tag</label>
                                <input type="text" value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} required className="form-input" />
                            </div>

                            <div className="form-group">
                                <label>SEO Meta Description</label>
                                <textarea 
                                    value={seoDescription} 
                                    onChange={(e) => setSeoDescription(e.target.value)} 
                                    required 
                                    className="form-input" 
                                    style={{ height: '100px', resize: 'vertical', fontFamily: 'inherit' }}
                                />
                            </div>

                            <div className="form-group">
                                <label>Home Hero Main Heading</label>
                                <input type="text" value={heroHeading} onChange={(e) => setHeroHeading(e.target.value)} required className="form-input" />
                            </div>

                            <button type="submit" disabled={isSubmitLoading} className="premium-btn">
                                {isSubmitLoading ? 'Saving changes...' : 'Save Site Settings'}
                            </button>
                        </form>
                    </div>

                    {/* Right: FAQ manager */}
                    <div className="section-card">
                        <h3 className="section-title">Manage Help Center FAQs</h3>
                        
                        {/* Add FAQ form */}
                        <form onSubmit={handleAddFaq} style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap', alignItems: 'flex-end', borderBottom: '1px solid #e2e8f0', paddingBottom: '1.5rem' }}>
                            <div className="form-group" style={{ flex: '1 1 200px' }}>
                                <label>Question</label>
                                <input type="text" placeholder="e.g. Can I cancel my booking?" value={newQuestion} onChange={(e) => setNewQuestion(e.target.value)} className="form-input" />
                            </div>
                            <div className="form-group" style={{ flex: '1 1 300px' }}>
                                <label>Answer</label>
                                <input type="text" placeholder="Answer explanation text..." value={newAnswer} onChange={(e) => setNewAnswer(e.target.value)} className="form-input" />
                            </div>
                            <button type="submit" style={{ padding: '0.75rem 1.5rem', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
                                Add FAQ
                            </button>
                        </form>

                        {/* List of current FAQs */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {faqs.map((faq, index) => (
                                <div key={index} style={{ padding: '1rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                                    <div style={{ flex: 1 }}>
                                        <h4 style={{ margin: '0 0 0.5rem 0', color: '#0f172a', fontSize: '0.95rem' }}>Q: {faq.q}</h4>
                                        <p style={{ margin: 0, color: '#475569', fontSize: '0.9rem' }}>A: {faq.a}</p>
                                    </div>
                                    <button onClick={() => handleRemoveFaq(index)} className="btn-sm btn-delete">Remove</button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
