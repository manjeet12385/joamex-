'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import '../admin.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
    Plus,
    Search,
    Edit3,
    Trash2,
    CheckCircle,
    XCircle,
    Tag,
    FolderPlus,
    Layers,
    Image as ImageIcon,
    RefreshCw,
    X,
    Folder,
    ListFilter
} from 'lucide-react';

export default function AdminCategoriesManagement() {
    const router = useRouter();

    // Data states
    const [categories, setCategories] = useState([]);
    const [stats, setStats] = useState({
        totalCategories: 0,
        activeCategories: 0,
        inactiveCategories: 0,
        totalSubcategories: 0
    });
    const [loading, setLoading] = useState(true);

    // Filters
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Modals
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState(null);

    // Form state
    const [formData, setFormData] = useState({
        id: '',
        name: '',
        slug: '',
        description: '',
        icon: '⚡',
        image: '',
        subcategories: [],
        status: 'Active',
        order: 0
    });

    const [subcatTagInput, setSubcatTagInput] = useState('');

    // Fetch Categories
    const fetchCategories = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (searchTerm) params.append('search', searchTerm);
            if (statusFilter !== 'All') params.append('status', statusFilter);
            params.append('mode', 'draft');

            const res = await fetch(`/api/admin/categories?${params.toString()}`);
            const data = await res.json();

            if (data.success) {
                setCategories(data.categories || []);
                if (data.stats) setStats(data.stats);
            } else {
                toast.error(data.message || 'Failed to fetch categories');
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
            toast.error('Network error loading categories');
        } finally {
            setLoading(false);
        }
    }, [searchTerm, statusFilter]);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchCategories();
        }, 300);
        return () => clearTimeout(timer);
    }, [fetchCategories]);

    // Open Add Modal
    const handleOpenAddModal = () => {
        setFormData({
            id: '',
            name: '',
            slug: '',
            description: '',
            icon: '📁',
            image: '',
            subcategories: [],
            status: 'Active',
            order: 0
        });
        setSubcatTagInput('');
        setIsAddModalOpen(true);
    };

    // Open Edit Modal
    const handleOpenEditModal = (cat) => {
        setFormData({
            id: cat._id,
            name: cat.name || '',
            slug: cat.slug || '',
            description: cat.description || '',
            icon: cat.icon || '📁',
            image: cat.image || '',
            subcategories: Array.isArray(cat.subcategories) ? [...cat.subcategories] : [],
            status: cat.status || 'Active',
            order: cat.order || 0
        });
        setSubcatTagInput('');
        setIsEditModalOpen(true);
    };

    const handleAddSubcatTag = () => {
        const trimmed = subcatTagInput.trim();
        if (!trimmed) return;
        
        // Prevent duplicate names
        if (formData.subcategories.some(tag => (typeof tag === 'string' ? tag : tag.name) === trimmed)) {
            toast.warning('Subcategory already added!');
            return;
        }

        const newTag = {
            id: `sub_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
            name: trimmed,
            slug: trimmed.toLowerCase().replace(/[^a-z0-9]+/g, '-')
        };

        setFormData(prev => ({
            ...prev,
            subcategories: [...prev.subcategories, newTag]
        }));
        setSubcatTagInput('');
    };

    // Edit subcategory tag
    const handleEditSubcatTag = (index) => {
        const currentTag = formData.subcategories[index];
        const currentName = typeof currentTag === 'string' ? currentTag : (currentTag.name || '');
        const newName = prompt('Edit subcategory name:', currentName);
        if (newName && newName.trim() !== '' && newName.trim() !== currentName) {
            const trimmed = newName.trim();
            
            // Prevent duplicate names
            if (formData.subcategories.some((tag, idx) => idx !== index && (typeof tag === 'string' ? tag : tag.name) === trimmed)) {
                toast.warning('Another subcategory with this name already exists!');
                return;
            }

            setFormData(prev => {
                const newSubs = [...prev.subcategories];
                const tagObj = typeof newSubs[index] === 'string' ? { name: newSubs[index] } : { ...newSubs[index] };
                
                // If it didn't have an ID (old legacy tag), generate one so it retains its identity going forward
                if (!tagObj.id) {
                    tagObj.id = `sub_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
                }
                
                tagObj.name = trimmed;
                tagObj.slug = trimmed.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                newSubs[index] = tagObj;
                return { ...prev, subcategories: newSubs };
            });
        }
    };

    // Remove subcategory tag
    const handleRemoveSubcatTag = (indexToRemove) => {
        setFormData(prev => ({
            ...prev,
            subcategories: prev.subcategories.filter((_, idx) => idx !== indexToRemove)
        }));
    };

    // Submit Create
    const handleCreateSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name.trim()) {
            toast.error('Category Name is required!');
            return;
        }

        try {
            const res = await fetch('/api/admin/categories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    slug: formData.slug,
                    description: formData.description,
                    icon: formData.icon,
                    image: formData.image,
                    subcategories: formData.subcategories,
                    status: formData.status,
                    order: formData.order
                })
            });

            const data = await res.json();

            if (data.success) {
                toast.success(data.message || 'Category created successfully!');
                setIsAddModalOpen(false);
                if (typeof window !== 'undefined') window.dispatchEvent(new Event('admin-categories-updated'));
                fetchCategories();
            } else {
                toast.error(data.message || 'Failed to create category');
            }
        } catch (error) {
            console.error('Error creating category:', error);
            toast.error('Error creating category');
        }
    };

    // Submit Update
    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name.trim()) {
            toast.error('Category Name is required!');
            return;
        }

        try {
            const res = await fetch(`/api/admin/categories/${formData.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    slug: formData.slug,
                    description: formData.description,
                    icon: formData.icon,
                    image: formData.image,
                    subcategories: formData.subcategories,
                    status: formData.status,
                    order: formData.order
                })
            });

            const data = await res.json();

            if (data.success) {
                toast.success('Category updated successfully!');
                setIsEditModalOpen(false);
                if (typeof window !== 'undefined') window.dispatchEvent(new Event('admin-categories-updated'));
                fetchCategories();
            } else {
                toast.error(data.message || 'Failed to update category');
            }
        } catch (error) {
            console.error('Error updating category:', error);
            toast.error('Error updating category');
        }
    };

    // Quick Toggle Status
    const handleToggleStatus = async (cat) => {
        const targetId = cat._id || cat.id || cat.slug;
        const newStatus = cat.status === 'Active' ? 'Inactive' : 'Active';
        try {
            const res = await fetch(`/api/admin/categories/${targetId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });

            const data = await res.json();
            if (data.success) {
                toast.success(`Category "${cat.name}" marked as ${newStatus}`);
                if (typeof window !== 'undefined') window.dispatchEvent(new Event('admin-categories-updated'));
                fetchCategories();
            } else {
                toast.error(data.message || 'Failed to update status');
            }
        } catch (error) {
            console.error('Toggle status error:', error);
            toast.error('Failed to update category status');
        }
    };

    // Confirm Delete Modal
    const handleOpenDeleteModal = (cat) => {
        setCategoryToDelete(cat);
        setIsDeleteModalOpen(true);
    };

    // Submit Delete
    const handleDeleteSubmit = async () => {
        if (!categoryToDelete) return;
        const targetId = categoryToDelete._id || categoryToDelete.id || categoryToDelete.slug;

        try {
            const res = await fetch(`/api/admin/categories/${targetId}`, {
                method: 'DELETE'
            });

            const data = await res.json();
            if (data.success) {
                toast.success(data.message || 'Category deleted successfully');
                toast.warning('Warning: Please also remove this category from any Banners or Most Booked sections to prevent broken links on the website.', { autoClose: 8000 });
                setIsDeleteModalOpen(false);
                setCategoryToDelete(null);
                if (typeof window !== 'undefined') window.dispatchEvent(new Event('admin-categories-updated'));
                fetchCategories();
            } else {
                toast.error(data.message || 'Failed to delete category');
            }
        } catch (error) {
            console.error('Delete error:', error);
            toast.error('Error deleting category');
        }
    };

    return (
        <div className="dashboard-container">
            <ToastContainer position="top-right" theme="dark" autoClose={3000} />

            <AdminSidebar />

            <main className="main-content" style={{ marginLeft: '260px', padding: '2rem', flex: 1, backgroundColor: 'var(--bg-dark)' }}>
                <AdminHeader
                    title="Category Management"
                    subtitle="Add, edit, update, delete and organize service categories across the application."
                    toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                />

                {/* HOMEPAGE GRID QUICK LINK BANNER */}
                <div style={{
                    background: 'linear-gradient(90deg, rgba(16, 185, 129, 0.15), rgba(37, 99, 235, 0.15))',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    borderRadius: '12px',
                    padding: '1rem 1.25rem',
                    marginBottom: '1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '1rem'
                }}>
                    <div>
                        <strong style={{ color: '#34d399', fontSize: '1rem', display: 'block', marginBottom: '2px' }}>
                            💡 Homepage "What are you looking for?" Grid Manager
                        </strong>
                        <span style={{ color: '#cbd5e1', fontSize: '0.85rem' }}>
                            Want to add, edit icons, or delete category boxes from the Homepage 9-icon grid?
                        </span>
                    </div>
                    <button
                        onClick={() => router.push('/admin/services?tab=catgrid')}
                        style={{
                            background: '#10b981',
                            color: '#ffffff',
                            border: 'none',
                            padding: '8px 16px',
                            borderRadius: '8px',
                            fontWeight: '800',
                            fontSize: '0.85rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                        }}
                    >
                        Go to Homepage Grid Manager →
                    </button>
                </div>

                {/* --- STATS OVERVIEW --- */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                    gap: '1.25rem',
                    marginBottom: '2rem'
                }}>
                    <div style={statCardStyle}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={statTitleStyle}>Total Categories</span>
                            <div style={{ ...iconBadgeStyle, background: 'rgba(37, 99, 235, 0.15)', color: '#3b82f6' }}>
                                <Folder size={20} />
                            </div>
                        </div>
                        <div style={statValueStyle}>{stats.totalCategories}</div>
                        <span style={statSubStyle}>All registered service domains</span>
                    </div>

                    <div style={statCardStyle}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={statTitleStyle}>Active Categories</span>
                            <div style={{ ...iconBadgeStyle, background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
                                <CheckCircle size={20} />
                            </div>
                        </div>
                        <div style={statValueStyle}>{stats.activeCategories}</div>
                        <span style={statSubStyle}>Visible on homepage & customer app</span>
                    </div>

                    <div style={statCardStyle}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={statTitleStyle}>Total Subcategories</span>
                            <div style={{ ...iconBadgeStyle, background: 'rgba(168, 85, 247, 0.15)', color: '#a855f7' }}>
                                <Layers size={20} />
                            </div>
                        </div>
                        <div style={statValueStyle}>{stats.totalSubcategories}</div>
                        <span style={statSubStyle}>Specific services & micro-offerings</span>
                    </div>

                    <div style={statCardStyle}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={statTitleStyle}>Inactive Categories</span>
                            <div style={{ ...iconBadgeStyle, background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444' }}>
                                <XCircle size={20} />
                            </div>
                        </div>
                        <div style={statValueStyle}>{stats.inactiveCategories}</div>
                        <span style={statSubStyle}>Hidden from customer app</span>
                    </div>
                </div>

                {/* --- CONTROLS BAR: SEARCH, FILTERS & ADD BUTTON --- */}
                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '1rem',
                    marginBottom: '1.5rem',
                    background: 'var(--bg-card)',
                    padding: '1rem 1.25rem',
                    borderRadius: '12px',
                    border: '1px solid var(--border-color)'
                }}>
                    {/* Left: Search input */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: '280px' }}>
                        <div style={{ position: 'relative', width: '100%' }}>
                            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                            <input
                                type="text"
                                placeholder="Search category name, description, or subcategory..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={inputStyle}
                            />
                        </div>
                    </div>

                    {/* Right: Filter & Add button */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <ListFilter size={16} style={{ color: '#94a3b8' }} />
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                style={selectStyle}
                            >
                                <option value="All">All Status</option>
                                <option value="Active">Active Only</option>
                                <option value="Inactive">Inactive Only</option>
                            </select>
                        </div>

                        <button
                            onClick={fetchCategories}
                            style={{ ...buttonOutlineStyle, padding: '0.6rem 0.8rem' }}
                            title="Refresh List"
                        >
                            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                        </button>

                        <button
                            onClick={handleOpenAddModal}
                            style={buttonPrimaryStyle}
                        >
                            <Plus size={18} />
                            Add New Category
                        </button>
                    </div>
                </div>

                {/* --- CATEGORIES GRID / CARDS --- */}
                {loading ? (
                    <div style={{ textAlignment: 'center', padding: '4rem 0', textAlign: 'center', color: '#94a3b8' }}>
                        <RefreshCw size={32} style={{ animation: 'spin 1s linear infinite', marginBottom: '1rem' }} />
                        <p>Loading categories from database...</p>
                    </div>
                ) : categories.length === 0 ? (
                    <div style={{
                        background: 'var(--bg-card)',
                        borderRadius: '12px',
                        border: '1px solid var(--border-color)',
                        padding: '4rem 2rem',
                        textAlign: 'center'
                    }}>
                        <FolderPlus size={48} style={{ color: '#64748b', marginBottom: '1rem' }} />
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>No Categories Found</h3>
                        <p style={{ color: '#94a3b8', marginBottom: '1.5rem' }}>
                            {searchTerm || statusFilter !== 'All'
                                ? 'No categories matched your search criteria.'
                                : 'Get started by creating your first service category.'}
                        </p>
                        <button onClick={handleOpenAddModal} style={buttonPrimaryStyle}>
                            <Plus size={18} />
                            Create Category Now
                        </button>
                    </div>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
                        gap: '1.25rem'
                    }}>
                        {categories.map((cat) => (
                            <div key={cat._id} style={{
                                background: 'var(--bg-card)',
                                borderRadius: '12px',
                                border: '1px solid var(--border-color)',
                                padding: '1.25rem',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                transition: 'all 0.2s ease',
                                position: 'relative'
                            }}>
                                <div>
                                    {/* Top row: Icon/Image + Name + Status */}
                                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            {cat.image ? (
                                                <img
                                                    src={cat.image}
                                                    alt={cat.name}
                                                    style={{ width: '48px', height: '48px', borderRadius: '10px', objectFit: 'cover' }}
                                                />
                                            ) : (
                                                <div style={{
                                                    width: '48px',
                                                    height: '48px',
                                                    borderRadius: '10px',
                                                    background: 'rgba(37, 99, 235, 0.15)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontSize: '1.5rem'
                                                }}>
                                                    {cat.icon || '📁'}
                                                </div>
                                            )}
                                            <div>
                                                <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#fff', margin: 0 }}>
                                                    {cat.name}
                                                </h3>
                                                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                                                    slug: /{cat.slug || cat.name.toLowerCase().replace(/\s+/g, '-')}
                                                </span>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => handleToggleStatus(cat)}
                                            style={{
                                                background: cat.status === 'Active' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                                                color: cat.status === 'Active' ? '#10b981' : '#ef4444',
                                                border: 'none',
                                                padding: '4px 10px',
                                                borderRadius: '20px',
                                                fontSize: '0.75rem',
                                                fontWeight: '600',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '4px'
                                            }}
                                            title="Click to toggle status"
                                        >
                                            {cat.status === 'Active' ? <CheckCircle size={12} /> : <XCircle size={12} />}
                                            {cat.status}
                                        </button>
                                    </div>

                                    {/* Description */}
                                    {cat.description && (
                                        <p style={{
                                            fontSize: '0.85rem',
                                            color: '#94a3b8',
                                            lineHeight: '1.4',
                                            marginBottom: '1rem',
                                            display: '-webkit-box',
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden'
                                        }}>
                                            {cat.description}
                                        </p>
                                    )}

                                    {/* Subcategories tags */}
                                    <div style={{ marginBottom: '1.25rem' }}>
                                        <div style={{ fontSize: '0.75rem', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <Tag size={12} />
                                            Subcategories ({cat.subcategories?.length || 0})
                                        </div>

                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                                            {cat.subcategories && cat.subcategories.length > 0 ? (
                                                cat.subcategories.slice(0, 4).map((sub, idx) => (
                                                    <span key={idx} style={tagStyle}>
                                                        {typeof sub === 'string' ? sub : (sub.name || 'Unknown')}
                                                    </span>
                                                ))
                                            ) : (
                                                <span style={{ fontSize: '0.8rem', color: '#475569', italic: true }}>No subcategories added</span>
                                            )}

                                            {cat.subcategories && cat.subcategories.length > 4 && (
                                                <span style={{ ...tagStyle, background: 'rgba(255, 255, 255, 0.05)', color: '#94a3b8' }}>
                                                    +{cat.subcategories.length - 4} more
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Bottom Action Buttons */}
                                <div style={{
                                    display: 'flex',
                                    gap: '0.5rem',
                                    borderTop: '1px solid var(--border-color)',
                                    paddingTop: '0.85rem'
                                }}>
                                    <button
                                        onClick={() => handleOpenEditModal(cat)}
                                        style={{
                                            flex: 1,
                                            background: 'rgba(37, 99, 235, 0.1)',
                                            color: '#60a5fa',
                                            border: '1px solid rgba(37, 99, 235, 0.3)',
                                            padding: '0.5rem',
                                            borderRadius: '8px',
                                            fontSize: '0.85rem',
                                            fontWeight: '600',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '6px'
                                        }}
                                    >
                                        <Edit3 size={15} /> Edit / Update
                                    </button>

                                    <button
                                        onClick={() => handleOpenDeleteModal(cat)}
                                        style={{
                                            background: 'rgba(239, 68, 68, 0.1)',
                                            color: '#f87171',
                                            border: '1px solid rgba(239, 68, 68, 0.3)',
                                            padding: '0.5rem 0.75rem',
                                            borderRadius: '8px',
                                            fontSize: '0.85rem',
                                            fontWeight: '600',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '4px'
                                        }}
                                        title="Delete Category"
                                    >
                                        <Trash2 size={15} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* --- ADD / EDIT MODAL --- */}
                {(isAddModalOpen || isEditModalOpen) && (
                    <div style={modalOverlayStyle}>
                        <div style={modalContentStyle}>
                            {/* Modal Header */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    {isAddModalOpen ? <FolderPlus size={22} style={{ color: '#3b82f6' }} /> : <Edit3 size={22} style={{ color: '#3b82f6' }} />}
                                    {isAddModalOpen ? 'Add New Category' : 'Edit Category'}
                                </h3>
                                <button
                                    onClick={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); }}
                                    style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Modal Form */}
                            <form onSubmit={isAddModalOpen ? handleCreateSubmit : handleUpdateSubmit}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                                    {/* Name */}
                                    <div style={{ gridColumn: 'span 2' }}>
                                        <label style={labelStyle}>Category Name *</label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="e.g. AC & Appliance Repair"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            style={formInputStyle}
                                        />
                                    </div>

                                    {/* Slug */}
                                    <div>
                                        <label style={labelStyle}>Slug (URL Key)</label>
                                        <input
                                            type="text"
                                            placeholder="ac-appliance-repair"
                                            value={formData.slug}
                                            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                            style={formInputStyle}
                                        />
                                    </div>

                                    {/* Icon Emoji */}
                                    <div>
                                        <label style={labelStyle}>Icon Emoji or Symbol</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. ❄️ or ⚡"
                                            value={formData.icon}
                                            onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                                            style={formInputStyle}
                                        />
                                    </div>

                                    {/* Image URL */}
                                    <div style={{ gridColumn: 'span 2' }}>
                                        <label style={labelStyle}>Category Cover Image URL</label>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <input
                                                type="url"
                                                placeholder="https://images.unsplash.com/photo-..."
                                                value={formData.image}
                                                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                                style={{ ...formInputStyle, flex: 1 }}
                                            />
                                            {formData.image && (
                                                <img
                                                    src={formData.image}
                                                    alt="Preview"
                                                    style={{ width: '42px', height: '42px', borderRadius: '8px', objectFit: 'cover' }}
                                                />
                                            )}
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <div style={{ gridColumn: 'span 2' }}>
                                        <label style={labelStyle}>Short Description</label>
                                        <textarea
                                            rows={3}
                                            placeholder="Describe what services are included in this category..."
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            style={{ ...formInputStyle, resize: 'vertical' }}
                                        />
                                    </div>

                                    {/* Subcategories tag adder */}
                                    <div style={{ gridColumn: 'span 2' }}>
                                        <label style={labelStyle}>Subcategories (Add Sub-services)</label>
                                        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                            <input
                                                type="text"
                                                placeholder="Type subcategory name (e.g. AC Installation) & press Add"
                                                value={subcatTagInput}
                                                onChange={(e) => setSubcatTagInput(e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        e.preventDefault();
                                                        handleAddSubcatTag();
                                                    }
                                                }}
                                                style={{ ...formInputStyle, flex: 1 }}
                                            />
                                            <button
                                                type="button"
                                                onClick={handleAddSubcatTag}
                                                style={buttonPrimaryStyle}
                                            >
                                                <Plus size={16} /> Add
                                            </button>
                                        </div>

                                        {/* Tag preview */}
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.5rem' }}>
                                            {formData.subcategories.map((tag, idx) => (
                                                <span key={idx} style={{
                                                    background: 'rgba(37, 99, 235, 0.2)',
                                                    color: '#93c5fd',
                                                    border: '1px solid rgba(37, 99, 235, 0.4)',
                                                    borderRadius: '16px',
                                                    padding: '4px 10px',
                                                    fontSize: '0.8rem',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '8px'
                                                }}>
                                                    {typeof tag === 'string' ? tag : (tag.name || 'Unknown')}
                                                    <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                                                        <Edit3
                                                            size={13}
                                                            style={{ cursor: 'pointer', color: '#60a5fa' }}
                                                            onClick={() => handleEditSubcatTag(idx)}
                                                            title="Edit Name"
                                                        />
                                                        <X
                                                            size={14}
                                                            style={{ cursor: 'pointer', color: '#f87171' }}
                                                            onClick={() => handleRemoveSubcatTag(idx)}
                                                            title="Remove"
                                                        />
                                                    </div>
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Status & Display Order */}
                                    <div>
                                        <label style={labelStyle}>Status</label>
                                        <select
                                            value={formData.status}
                                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                            style={formInputStyle}
                                        >
                                            <option value="Active">Active</option>
                                            <option value="Inactive">Inactive</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label style={labelStyle}>Display Order / Position</label>
                                        <input
                                            type="number"
                                            value={formData.order}
                                            onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                                            style={formInputStyle}
                                        />
                                    </div>
                                </div>

                                {/* Modal Actions */}
                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
                                    <button
                                        type="button"
                                        onClick={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); }}
                                        style={buttonOutlineStyle}
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="submit"
                                        style={buttonPrimaryStyle}
                                    >
                                        {isAddModalOpen ? 'Save & Create Category' : 'Update Category'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* --- DELETE CONFIRMATION MODAL --- */}
                {isDeleteModalOpen && categoryToDelete && (
                    <div style={modalOverlayStyle}>
                        <div style={{ ...modalContentStyle, maxWidth: '420px', textAlign: 'center' }}>
                            <div style={{
                                width: '56px',
                                height: '56px',
                                borderRadius: '50%',
                                background: 'rgba(239, 68, 68, 0.15)',
                                color: '#ef4444',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 1rem auto'
                            }}>
                                <Trash2 size={28} />
                            </div>

                            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#fff', marginBottom: '0.5rem' }}>
                                Delete "{categoryToDelete.name}"?
                            </h3>

                            <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                                Are you sure you want to delete this category? This action will permanently remove it from the database.
                            </p>

                            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem' }}>
                                <button
                                    onClick={() => { setIsDeleteModalOpen(false); setCategoryToDelete(null); }}
                                    style={buttonOutlineStyle}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDeleteSubmit}
                                    style={{
                                        ...buttonPrimaryStyle,
                                        background: '#ef4444',
                                        boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)'
                                    }}
                                >
                                    Yes, Delete Category
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

// Inline Helper Styles
const statCardStyle = {
    background: 'var(--bg-card)',
    borderRadius: '12px',
    border: '1px solid var(--border-color)',
    padding: '1.25rem'
};

const statTitleStyle = {
    fontSize: '0.85rem',
    color: '#94a3b8',
    fontWeight: '500'
};

const statValueStyle = {
    fontSize: '1.8rem',
    fontWeight: '700',
    color: '#ffffff',
    margin: '0.5rem 0 0.25rem 0'
};

const statSubStyle = {
    fontSize: '0.75rem',
    color: '#64748b'
};

const iconBadgeStyle = {
    width: '36px',
    height: '36px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
};

const inputStyle = {
    width: '100%',
    padding: '0.65rem 0.85rem 0.65rem 2.4rem',
    backgroundColor: '#0b0e14',
    border: '1px solid var(--border-color)',
    borderRadius: '8px',
    color: '#fff',
    fontSize: '0.9rem',
    outline: 'none'
};

const selectStyle = {
    padding: '0.65rem 0.85rem',
    backgroundColor: '#0b0e14',
    border: '1px solid var(--border-color)',
    borderRadius: '8px',
    color: '#fff',
    fontSize: '0.85rem',
    outline: 'none',
    cursor: 'pointer'
};

const buttonPrimaryStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '0.65rem 1.1rem',
    backgroundColor: 'var(--primary)',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '0.85rem',
    fontWeight: '600',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
    transition: 'all 0.2s ease'
};

const buttonOutlineStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '0.65rem 1rem',
    backgroundColor: 'transparent',
    color: '#94a3b8',
    border: '1px solid var(--border-color)',
    borderRadius: '8px',
    fontSize: '0.85rem',
    fontWeight: '500',
    cursor: 'pointer'
};

const tagStyle = {
    background: 'rgba(255, 255, 255, 0.06)',
    color: '#cbd5e1',
    borderRadius: '12px',
    padding: '3px 8px',
    fontSize: '0.75rem'
};

const modalOverlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '1rem'
};

const modalContentStyle = {
    background: '#ffffff',
    color: '#0f172a',
    border: '1px solid #e2e8f0',
    borderRadius: '16px',
    padding: '1.75rem',
    width: '100%',
    maxWidth: '560px',
    maxHeight: '90vh',
    overflowY: 'auto',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.12)'
};

const labelStyle = {
    display: 'block',
    fontSize: '0.8rem',
    fontWeight: '600',
    color: '#94a3b8',
    marginBottom: '6px'
};

const formInputStyle = {
    width: '100%',
    padding: '0.65rem 0.85rem',
    backgroundColor: '#0b0e14',
    border: '1px solid var(--border-color)',
    borderRadius: '8px',
    color: '#fff',
    fontSize: '0.9rem',
    outline: 'none',
    boxSizing: 'border-box'
};
