'use client';
import './Hero.css';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { categories } from '../data/categories';
import { SubcategoryIcons } from './SubcategoryIcons';
import { toast } from 'react-toastify';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

export default function Hero() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedPreferenceItem, setSelectedPreferenceItem] = useState(null);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminEditMode, setAdminEditMode] = useState(false);
  const [showAdminCatModal, setShowAdminCatModal] = useState(false);
  const [editingCatItem, setEditingCatItem] = useState(null);
  const [adminCatForm, setAdminCatForm] = useState({
    label: "",
    key: "",
    image: ""
  });

  const [showSubItemModal, setShowSubItemModal] = useState(false);
  const [editingSubIndex, setEditingSubIndex] = useState(null);
  const [subItemForm, setSubItemForm] = useState({
    name: "",
    icon: "",
    badge: "",
    time: "",
    route: "",
    details: ""
  });

  useEffect(() => {
    const checkLocalUser = () => {
      const stored = localStorage.getItem('user');
      if (stored) {
        try {
          setUser(JSON.parse(stored));
        } catch (e) {
          console.error(e);
        }
      } else {
        setUser(null);
      }

      const adminUser = localStorage.getItem('adminUser');
      const storedMode = localStorage.getItem('admin_edit_mode');
      const hasAdminLogin = !!adminUser;
      const isEditOn = storedMode === 'true';

      setIsAdmin(hasAdminLogin);
      setAdminEditMode(hasAdminLogin && isEditOn);

      if (!hasAdminLogin || !isEditOn) {
        try {
          sessionStorage.removeItem('linking_card_data');
          sessionStorage.removeItem('linking_offer_data');
        } catch (e) {}
      }
    };

    checkLocalUser();

    const handleOpenCatModalEvent = (e) => {
      if (e.detail && e.detail.categoryKey) {
        setSelectedCategory(e.detail.categoryKey);
        setSelectedPreferenceItem(null);
      }
    };

    window.addEventListener('user-login', checkLocalUser);
    window.addEventListener('user-updated', checkLocalUser);
    window.addEventListener('storage', checkLocalUser);
    window.addEventListener('focus', checkLocalUser);
    window.addEventListener('admin_edit_mode_changed', checkLocalUser);
    window.addEventListener('open-category-modal', handleOpenCatModalEvent);
    return () => {
      window.removeEventListener('user-login', checkLocalUser);
      window.removeEventListener('user-updated', checkLocalUser);
      window.removeEventListener('storage', checkLocalUser);
      window.removeEventListener('focus', checkLocalUser);
      window.removeEventListener('admin_edit_mode_changed', checkLocalUser);
      window.removeEventListener('open-category-modal', handleOpenCatModalEvent);
    };
  }, []);

  const handleCloseModal = () => {
    setSelectedCategory(null);
    setSelectedPreferenceItem(null);
  };

  const [currentSlide, setCurrentSlide] = useState(0);

  const [heroBanners, setHeroBanners] = useState({
    mainBanner: {
      image: '/home-cleaning-banner.png',
      badge: 'Flash Sale',
      title: 'HOME CLEANING',
      subtitle: 'Natural Deep Clean',
      offer: 'Up to 40% OFF on Deep Cleaning',
      route: '/services/full-home-cleaning'
    },
    grid1: {
      image: '/ac-repair.png',
      alt: 'AC Repair & Service'
    },
    grid2: {
      image: '/electrician.png',
      alt: 'Plumbing & Electrical'
    }
  });

  const [heroSectionTitle, setHeroSectionTitle] = useState('Home services expert at your doorstep');

  const bannerSlides = [
    {
      sectionTitle: heroBanners.slide0?.sectionTitle || heroBanners.mainBanner?.sectionTitle || heroSectionTitle,
      image: heroBanners.slide0?.image || heroBanners.mainBanner?.image || '/home-cleaning-banner.png',
      badge: heroBanners.slide0?.badge || heroBanners.mainBanner?.badge || 'FLASH SALE',
      title: heroBanners.slide0?.title || heroBanners.mainBanner?.title || 'HOME CLEANING',
      subtitle: heroBanners.slide0?.subtitle || heroBanners.mainBanner?.subtitle || 'Natural Deep Clean',
      offer: heroBanners.slide0?.offer || heroBanners.mainBanner?.offer || 'Up to 40% OFF on Deep Cleaning',
      route: heroBanners.slide0?.route || heroBanners.mainBanner?.route || '/services/full-home-cleaning',
      hideText: heroBanners.slide0?.hideText || heroBanners.mainBanner?.hideText || false
    },
    {
      sectionTitle: heroBanners.slide1?.sectionTitle || heroSectionTitle,
      image: heroBanners.slide1?.image || '/ac-repair.png',
      badge: heroBanners.slide1?.badge || 'SUMMER SPECIAL',
      title: heroBanners.slide1?.title || 'AC REPAIR & SERVICE',
      subtitle: heroBanners.slide1?.subtitle || 'Split & Window AC',
      offer: heroBanners.slide1?.offer || 'Gas Refill & Checkup from ₹399',
      route: heroBanners.slide1?.route || '/ac-repair',
      hideText: heroBanners.slide1?.hideText || false
    },
    {
      sectionTitle: heroBanners.slide2?.sectionTitle || heroSectionTitle,
      image: heroBanners.slide2?.image || heroBanners.grid1?.image || '/grid1-plumber.jpg',
      badge: heroBanners.slide2?.badge || '24x7 EMERGENCY',
      title: heroBanners.slide2?.title || 'PLUMBING & ELECTRICAL',
      subtitle: heroBanners.slide2?.subtitle || 'Certified Technicians',
      offer: heroBanners.slide2?.offer || 'Doorstep Repair within 30 Mins',
      route: heroBanners.slide2?.route || '/electrician',
      hideText: heroBanners.slide2?.hideText || false
    },
    {
      sectionTitle: heroBanners.slide3?.sectionTitle || heroSectionTitle,
      image: heroBanners.slide3?.image || '/carpenter.png',
      badge: heroBanners.slide3?.badge || 'TOP RATED',
      title: heroBanners.slide3?.title || 'CARPENTRY & FURNITURE',
      subtitle: heroBanners.slide3?.subtitle || 'Assembly & Repairs',
      offer: heroBanners.slide3?.offer || 'Expert Carpenters at Lowest Price',
      route: heroBanners.slide3?.route || '/carpenter',
      hideText: heroBanners.slide3?.hideText || false
    }
  ];

  const defaultJustdialSideCards = [
    {
      id: 'jd-card-1',
      title: 'AC & Appliance',
      subtitle: 'Service & Gas Refill',
      badge: 'COOLING',
      image: '/ac-repair.png',
      route: '/ac-repair',
      hideText: false
    },
    {
      id: 'jd-card-2',
      title: 'Plumbing & Electrical',
      subtitle: '24x7 Repair Experts',
      badge: 'FAST 30m',
      image: '/grid2-electrician.jpg',
      route: '/electrician',
      hideText: false
    },
    {
      id: 'jd-card-3',
      title: 'Carpentry & Repairs',
      subtitle: 'Assembly & Woodwork',
      badge: 'TOP RATED',
      image: '/carpenter.png',
      route: '/carpenter',
      hideText: false
    }
  ];

  const [justdialSideCards, setJustdialSideCards] = useState(defaultJustdialSideCards);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % bannerSlides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [bannerSlides.length]);

  const [showHeroBannersModal, setShowHeroBannersModal] = useState(false);
  const [heroBannersForm, setHeroBannersForm] = useState({
    sectionTitle: 'Home services expert at your doorstep',
    mainImage: '/home-cleaning-banner.png',
    mainBadge: 'Flash Sale',
    mainTitle: 'HOME CLEANING',
    mainSubtitle: 'Natural',
    mainOffer: 'Up to 40% OFF on Deep Cleaning',
    card1: defaultJustdialSideCards[0],
    card2: defaultJustdialSideCards[1]
  });

  useEffect(() => {
    const loadContent = () => {
      try {
        const savedTitle = localStorage.getItem('admin_hero_title');
        if (savedTitle) setHeroSectionTitle(savedTitle);

        const stored = localStorage.getItem('admin_hero_banners');
        if (stored) {
          setHeroBanners(JSON.parse(stored));
        }

        const storedCards = localStorage.getItem('admin_justdial_side_cards');
        if (storedCards) {
          const parsed = JSON.parse(storedCards);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setJustdialSideCards(parsed.slice(0, 3));
          }
        }
      } catch (e) {
        console.error('Failed loading hero banners:', e);
      }
    };
    loadContent();
    window.addEventListener('site_content_updated', loadContent);
    return () => window.removeEventListener('site_content_updated', loadContent);
  }, []);

  const [editingSlideIndex, setEditingSlideIndex] = useState(0);
  const [slidesFormData, setSlidesFormData] = useState([
    { sectionTitle: '', image: '', badge: '', title: '', subtitle: '', offer: '', route: '', hideText: false },
    { sectionTitle: '', image: '', badge: '', title: '', subtitle: '', offer: '', route: '', hideText: false },
    { sectionTitle: '', image: '', badge: '', title: '', subtitle: '', offer: '', route: '', hideText: false },
    { sectionTitle: '', image: '', badge: '', title: '', subtitle: '', offer: '', route: '', hideText: false }
  ]);

  const handleOpenHeroBannersModal = (targetSlideIdx = null) => {
    const idx = (typeof targetSlideIdx === 'number') ? targetSlideIdx : currentSlide;
    setEditingSlideIndex(idx);

    const initialSlidesData = bannerSlides.map(slide => ({
      sectionTitle: slide.sectionTitle || heroSectionTitle,
      image: slide.image || '',
      badge: slide.badge || '',
      title: slide.title || '',
      subtitle: slide.subtitle || '',
      offer: slide.offer || '',
      route: slide.route || '',
      hideText: !!slide.hideText
    }));

    setSlidesFormData(initialSlidesData);
    setShowHeroBannersModal(true);
  };

  const handleSwitchModalSlideTab = (idx) => {
    setEditingSlideIndex(idx);
  };

  const updateCurrentSlideForm = (field, value) => {
    setSlidesFormData(prev => {
      const copy = [...prev];
      copy[editingSlideIndex] = {
        ...copy[editingSlideIndex],
        [field]: value
      };
      return copy;
    });
  };

  const handleSaveHeroBanners = (e) => {
    e.preventDefault();

    const updatedBanners = {
      ...heroBanners,
      slide0: { ...slidesFormData[0] },
      slide1: { ...slidesFormData[1] },
      slide2: { ...slidesFormData[2] },
      slide3: { ...slidesFormData[3] },
      mainBanner: { ...slidesFormData[0] }
    };

    setHeroBanners(updatedBanners);
    localStorage.setItem('admin_hero_banners', JSON.stringify(updatedBanners));
    window.dispatchEvent(new Event('site_content_updated'));

    setShowHeroBannersModal(false);
    toast.success("All 4 Carousel Slides & Headings saved live!");
  };

  const [show4CardsModal, setShow4CardsModal] = useState(false);
  const [editingCardIndex, setEditingCardIndex] = useState(0);
  const [singleCardForm, setSingleCardForm] = useState({
    title: '',
    subtitle: '',
    badge: '',
    image: '',
    route: '/services',
    hideText: false
  });

  const handleOpenSingleCardModal = (index) => {
    setEditingCardIndex(index);
    const targetCard = justdialSideCards[index] || defaultJustdialSideCards[index] || {};
    setSingleCardForm({
      title: targetCard.title || '',
      subtitle: targetCard.subtitle || '',
      badge: targetCard.badge || '',
      image: targetCard.image || '',
      route: targetCard.route || '/services',
      hideText: !!targetCard.hideText
    });
    setShow4CardsModal(true);
  };

  const handleOpen4CardsModal = () => handleOpenSingleCardModal(0);

  const handleSaveSingleCardModal = (e) => {
    e.preventDefault();
    const updatedCards = [...justdialSideCards];
    updatedCards[editingCardIndex] = {
      ...updatedCards[editingCardIndex],
      ...singleCardForm
    };
    setJustdialSideCards(updatedCards);
    localStorage.setItem('admin_justdial_side_cards', JSON.stringify(updatedCards));
    window.dispatchEvent(new Event('site_content_updated'));
    setShow4CardsModal(false);
    toast.success(`"${singleCardForm.title}" Card updated live!`);
  };

  const handleStartLinkingToCategory = (sectionType, cardIndex = 0) => {
    const linkingPayload = {
      sectionType,
      cardIndex,
      title: sectionType === 'hero_main_banner' ? 'Main Showcase Banner' : `Side Card #${cardIndex + 1}`
    };
    sessionStorage.setItem('linking_card_data', JSON.stringify(linkingPayload));
    sessionStorage.setItem('linking_offer_data', JSON.stringify(linkingPayload));
    setLinkingOfferInfo(linkingPayload);
    
    setShowHeroBannersModal(false);
    setShow4CardsModal(false);

    toast.info("🎯 LINKING ACTIVE: Click (+) on any Category or Service box below to link it!");
    
    setTimeout(() => {
      document.getElementById('what-are-you-looking-for')?.scrollIntoView({ behavior: 'smooth' });
    }, 150);
  };

  const defaultCategoriesList = [
    { key: 'ac', image: '/categories/ac-repair.png', label: 'AC & Appliance Repair' },
    { key: 'electrician', image: '/categories/electrician.png', label: 'Electrician & Plumber' },
    { key: 'cleaning', image: '/categories/cleaning.png', label: 'Cleaning & Pest Control' },
    { key: 'renovation', image: '/categories/renovation.png', label: 'Renovation & Interior' },
    { key: 'fabrication', image: '/categories/fabrication.png', label: 'Fabrication & Roofing' },
    { key: 'beauty', image: '/categories/beauty.png', label: 'Women\'s Beauty & Spa' },
    { key: 'grooming', image: '/categories/grooming.png', label: 'Men\'s Grooming' },
    { key: 'homecare', image: '/categories/homecare.png', label: 'Home Care & Support' },
    { key: 'security', image: '/categories/security.png', label: 'Home Security & Solar' },
  ];

  const [serviceCategories, setServiceCategories] = useState(defaultCategoriesList);
  const [customCategoryData, setCustomCategoryData] = useState({});

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const storedHero = localStorage.getItem('admin_hero_banners');
        if (storedHero) {
          setHeroBanners(JSON.parse(storedHero));
        }

        let catList = defaultCategoriesList;
        try {
          const res = await fetch('/api/admin/categories');
          const data = await res.json();
          if (data.success && Array.isArray(data.categories) && data.categories.length > 0) {
            catList = data.categories.map(c => ({
              _id: c._id,
              key: c.slug || c._id,
              label: c.name,
              image: c.image || c.icon || '/categories/cleaning.png'
            }));
          } else {
            const storedCategories = localStorage.getItem('admin_custom_categories');
            if (storedCategories) {
              const parsed = JSON.parse(storedCategories);
              if (Array.isArray(parsed) && parsed.length > 0) catList = parsed;
            }
          }
        } catch (dbErr) {
          const storedCategories = localStorage.getItem('admin_custom_categories');
          if (storedCategories) {
            const parsed = JSON.parse(storedCategories);
            if (Array.isArray(parsed) && parsed.length > 0) catList = parsed;
          }
        }

        setServiceCategories(catList);

        const storedItems = localStorage.getItem('admin_custom_category_items');
        if (storedItems) {
          setCustomCategoryData(JSON.parse(storedItems));
        }
      } catch (e) {
        console.error('Failed loading custom categories:', e);
      }
    };

    loadCategories();
    window.addEventListener('admin-categories-updated', loadCategories);
    window.addEventListener('site_content_updated', loadCategories);
    window.addEventListener('storage', loadCategories);

    return () => {
      window.removeEventListener('admin-categories-updated', loadCategories);
      window.removeEventListener('site_content_updated', loadCategories);
      window.removeEventListener('storage', loadCategories);
    };
  }, []);

  const categoryRoutesMap = {
    ac: '/ac-repair',
    electrician: '/electrician',
    cleaning: '/services/full-home-cleaning',
    renovation: '/services/carpenter',
    fabrication: '/services/carpenter',
    beauty: '/services/bridal-makeup',
    grooming: '/services/men-massage',
    homecare: '/services/water-purifier',
    security: '/services/termite-control'
  };

  const [linkingOfferInfo, setLinkingOfferInfo] = useState(null);

  useEffect(() => {
    const checkLinking = () => {
      const storedOffer = sessionStorage.getItem('linking_offer_data');
      const storedCard = sessionStorage.getItem('linking_card_data');
      const dataStr = storedCard || storedOffer;
      if (dataStr) {
        try {
          setLinkingOfferInfo(JSON.parse(dataStr));
        } catch (e) {
          console.error(e);
        }
      } else {
        setLinkingOfferInfo(null);
      }
    };
    checkLinking();
    window.addEventListener('start-category-linking', checkLinking);
    window.addEventListener('storage', checkLinking);
    return () => {
      window.removeEventListener('start-category-linking', checkLinking);
      window.removeEventListener('storage', checkLinking);
    };
  }, []);

  const handleCategoryClick = (categoryKey) => {
    setSelectedCategory(categoryKey);
    setSelectedPreferenceItem(null);
  };

  const handleLinkSubItemToOffer = async (e, sub) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const storedOffer = sessionStorage.getItem('linking_offer_data');
    const storedCard = sessionStorage.getItem('linking_card_data');
    const linkingDataStr = storedCard || storedOffer;
    if (!linkingDataStr) return;

    try {
      const itemData = JSON.parse(linkingDataStr);
      let rawRoute = (sub.route && sub.route.trim() !== '' && sub.route !== '#')
        ? sub.route
        : `/services/${sub.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;

      if (rawRoute === '/ac' || rawRoute === 'ac' || rawRoute === '/services/ac' || sub.name?.toLowerCase() === 'ac') {
        rawRoute = '/ac-repair';
      }
      const subRoute = rawRoute;
      
      const subName = sub.name || 'Service';
      const sectionType = itemData.sectionType || 'offer';

      if (sectionType === 'hero_main_banner') {
        const updatedBanners = {
          ...heroBanners,
          mainBanner: {
            ...heroBanners.mainBanner,
            route: subRoute
          }
        };
        setHeroBanners(updatedBanners);
        localStorage.setItem('admin_hero_banners', JSON.stringify(updatedBanners));
        window.dispatchEvent(new Event('site_content_updated'));
        toast.success(`🎯 Main Showcase Banner linked to "${subName}" (${subRoute})!`);
      } else if (sectionType === 'side_card') {
        const cardIndex = itemData.cardIndex !== undefined ? itemData.cardIndex : 0;
        const updatedCards = [...justdialSideCards];
        if (updatedCards[cardIndex]) {
          updatedCards[cardIndex] = {
            ...updatedCards[cardIndex],
            route: subRoute
          };
          setJustdialSideCards(updatedCards);
          localStorage.setItem('admin_justdial_side_cards', JSON.stringify(updatedCards));
          window.dispatchEvent(new Event('site_content_updated'));
          toast.success(`🎯 Side Card #${cardIndex + 1} linked to "${subName}" (${subRoute})!`);
        }
      } else if (sectionType === 'solarwater') {
        const list = JSON.parse(localStorage.getItem('admin_solarwater_services') || '[]');
        let found = false;
        const updated = list.map(c => {
          if (c.id === itemData.id || c.title === itemData.title) {
            found = true;
            return { ...c, route: subRoute, title: c.title || subName };
          }
          return c;
        });
        if (!found) {
          updated.push({ ...itemData, route: subRoute, title: itemData.title || subName });
        }
        localStorage.setItem('admin_solarwater_services', JSON.stringify(updated));
        window.dispatchEvent(new Event('admin_solarwater_updated'));
        toast.success(`✓ Linked "${subName}" (${subRoute}) to Solar & Water Solutions!`);
      } else if (sectionType === 'renovation') {
        const list = JSON.parse(localStorage.getItem('admin_renovation_services') || '[]');
        let found = false;
        const updated = list.map(c => {
          if (c.id === itemData.id || c.title === itemData.title) {
            found = true;
            return { ...c, route: subRoute, title: c.title || subName };
          }
          return c;
        });
        if (!found) {
          updated.push({ ...itemData, route: subRoute, title: itemData.title || subName });
        }
        localStorage.setItem('admin_renovation_services', JSON.stringify(updated));
        window.dispatchEvent(new Event('admin_renovation_updated'));
        toast.success(`✓ Linked "${subName}" (${subRoute}) to Home Renovation!`);
      } else if (sectionType === 'essential') {
        const list = JSON.parse(localStorage.getItem('admin_essential_services') || '[]');
        let found = false;
        const updated = list.map(c => {
          if (c.id === itemData.id || c.title === itemData.title) {
            found = true;
            return { ...c, route: subRoute, title: c.title || subName };
          }
          return c;
        });
        if (!found) {
          updated.push({ ...itemData, route: subRoute, title: itemData.title || subName });
        }
        localStorage.setItem('admin_essential_services', JSON.stringify(updated));
        window.dispatchEvent(new Event('admin_essential_updated'));
        toast.success(`✓ Linked "${subName}" (${subRoute}) to Essential Services!`);
      } else if (sectionType === 'mostbooked') {
        const list = JSON.parse(localStorage.getItem('admin_most_booked_services') || '[]');
        let found = false;
        const updated = list.map(c => {
          if (c.id === itemData.id || c.title === itemData.title) {
            found = true;
            return { ...c, route: subRoute, title: c.title || subName };
          }
          return c;
        });
        if (!found) {
          updated.push({ ...itemData, route: subRoute, title: itemData.title || subName });
        }
        localStorage.setItem('admin_most_booked_services', JSON.stringify(updated));
        window.dispatchEvent(new Event('admin_most_booked_updated'));
        toast.success(`✓ Linked "${subName}" (${subRoute}) to Most Booked Services!`);
      } else if (sectionType === 'banner') {
        const list = JSON.parse(localStorage.getItem('admin_feature_banners') || '[]');
        let found = false;
        const updated = list.map(c => {
          if (c.id === itemData.cardId || c.id === itemData.id || c.title === itemData.title) {
            found = true;
            return { ...c, route: subRoute };
          }
          return c;
        });
        if (!found && list.length > 0) {
          updated[0] = { ...updated[0], route: subRoute };
        }
        localStorage.setItem('admin_feature_banners', JSON.stringify(updated));
        window.dispatchEvent(new Event('admin_feature_banners_updated'));
        toast.success(`✓ Linked "${subName}" (${subRoute}) to Feature Banner!`);
      } else {
        // Link to Exclusive Offer (MongoDB)
        try {
          const res = await fetch('/api/offers');
          if (res.ok) {
            const existingOffers = await res.json();
            let targetOffer = existingOffers.find(o => o.id === itemData.id || o._id === itemData._id || o._id === itemData.id);
            
            if (targetOffer) {
              const updatedOffer = { ...targetOffer, route: subRoute, title: targetOffer.title || itemData.title || subName };
              await fetch(`/api/offers/${targetOffer._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedOffer)
              });
              window.dispatchEvent(new Event('admin-offers-updated'));
              toast.success(`✓ Linked "${subName}" (${subRoute}) to Exclusive Offer live!`);
            } else {
              toast.error("Could not find the offer to link. Ensure it is saved first.");
            }
          }
        } catch (error) {
          console.error("Error linking offer:", error);
          toast.error("Network error while linking offer");
        }
      }

      sessionStorage.removeItem('linking_offer_data');
      sessionStorage.removeItem('linking_card_data');
      setLinkingOfferInfo(null);
      setSelectedCategory(null);
    } catch (err) {
      console.error('Failed linking sub-item to card:', err);
    }
  };

  // Dynamic Category Details helper
  const getCategoryData = (catKey) => {
    const customItems = customCategoryData[catKey] || [];
    if (categories[catKey]) {
      const base = categories[catKey];
      if (customItems.length > 0) {
        const baseSections = base.sections ? [...base.sections] : [];
        if (baseSections.length > 0) {
          const updated = [...baseSections];
          updated[0] = {
            ...updated[0],
            items: [...customItems, ...updated[0].items]
          };
          return { ...base, sections: updated };
        }
        return { ...base, sections: [{ title: "Featured Services", items: customItems }] };
      }
      return base;
    }
    
    // Custom category added by Admin
    const foundCat = serviceCategories.find(c => c.key === catKey);
    return {
      name: foundCat ? foundCat.label : "Services",
      sections: [
        { title: "Available Services & Pricing", items: customItems.length > 0 ? customItems : [] }
      ]
    };
  };

  const handleOpenAddCategoryModal = (e) => {
    e.stopPropagation();
    setEditingCatItem(null);
    setAdminCatForm({ label: "", key: "", image: "" });
    setShowAdminCatModal(true);
  };

  const handleOpenEditCategoryModal = (e, service) => {
    e.stopPropagation();
    setEditingCatItem(service);
    setAdminCatForm({
      label: service.label || service.name || "",
      key: service.key || "",
      image: service.image || service.icon || ""
    });
    setShowAdminCatModal(true);
  };

  const handleDeleteCategoryOnPage = async (e, catKeyOrService) => {
    e.stopPropagation();
    const catKey = typeof catKeyOrService === 'string' ? catKeyOrService : catKeyOrService?.key;
    const foundCat = serviceCategories.find(c => c.key === catKey || (catKeyOrService?._id && c._id === catKeyOrService._id));
    const catId = foundCat?._id || catKey;

    if (confirm("Delete this category box from Database & Homepage?")) {
      try {
        if (catId) {
          await fetch(`/api/admin/categories/${catId}`, { method: 'DELETE' });
        }
      } catch (err) {
        console.error('Failed deleting from DB API:', err);
      }
      const updated = serviceCategories.filter(c => c.key !== catKey && c._id !== catId);
      setServiceCategories(updated);
      localStorage.setItem('admin_custom_categories', JSON.stringify(updated));
      window.dispatchEvent(new Event('admin-categories-updated'));
      toast.success("Category deleted from Database!");
    }
  };

  const handleSaveAdminCategoryOnPage = async (e) => {
    e.preventDefault();
    if (!adminCatForm.label.trim()) return;

    const catName = adminCatForm.label.trim();
    const catImage = adminCatForm.image.trim() || '/categories/cleaning.png';
    const catSlug = adminCatForm.key.trim() || catName.toLowerCase().replace(/[^a-z0-9]/g, '-');

    let savedDbCat = null;
    try {
      if (editingCatItem && editingCatItem._id) {
        const res = await fetch(`/api/admin/categories/${editingCatItem._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: catName, slug: catSlug, image: catImage })
        });
        const data = await res.json();
        if (data.success) savedDbCat = data.category;
      } else {
        const res = await fetch('/api/admin/categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: catName, slug: catSlug, image: catImage, status: 'Active' })
        });
        const data = await res.json();
        if (data.success) savedDbCat = data.category;
      }
      toast.success(`Category "${catName}" saved to Database successfully!`);
    } catch (err) {
      console.error('Failed saving category to DB API:', err);
    }

    let updated = [];
    if (editingCatItem) {
      updated = serviceCategories.map(c => {
        if (c.key === editingCatItem.key || (editingCatItem._id && c._id === editingCatItem._id)) {
          return {
            ...c,
            _id: savedDbCat?._id || c._id,
            label: catName,
            key: catSlug || c.key,
            image: catImage
          };
        }
        return c;
      });
    } else {
      const uniqueKey = catSlug || `cat-${Date.now()}`;
      const newCat = {
        _id: savedDbCat?._id,
        key: uniqueKey,
        label: catName,
        image: catImage
      };
      updated = [...serviceCategories, newCat];
    }

    setServiceCategories(updated);
    localStorage.setItem('admin_custom_categories', JSON.stringify(updated));
    window.dispatchEvent(new Event('admin-categories-updated'));
    setShowAdminCatModal(false);
    setAdminCatForm({ label: "", key: "", image: "" });
    setEditingCatItem(null);
  };

  const handleOpenAddSubItem = (e) => {
    e?.stopPropagation();
    setEditingSubIndex(null);
    setSubItemForm({ name: "", icon: "", badge: "", time: "", route: "", details: "" });
    setShowSubItemModal(true);
  };

  const handleOpenEditSubItem = (e, subItem, index) => {
    e.stopPropagation();
    setEditingSubIndex(index);
    setSubItemForm({
      name: subItem.name || "",
      icon: subItem.icon || "",
      badge: subItem.badge || "",
      time: subItem.time || "",
      route: subItem.route || "",
      details: subItem.details || ""
    });
    setShowSubItemModal(true);
  };

  const handleDeleteSubItem = (e, index) => {
    e.stopPropagation();
    if (!selectedCategory) return;
    if (confirm("Delete this sub-service from popup?")) {
      const currentCat = getCategoryData(selectedCategory);
      const itemsList = customCategoryData[selectedCategory] || currentCat.subcategories || (currentCat.sections ? currentCat.sections[0].items : []);
      const updatedList = itemsList.filter((_, i) => i !== index);
      const updatedAll = { ...customCategoryData, [selectedCategory]: updatedList };
      setCustomCategoryData(updatedAll);
      localStorage.setItem('admin_custom_category_items', JSON.stringify(updatedAll));
      window.dispatchEvent(new Event('admin-categories-updated'));
    }
  };

  const handleSaveSubItem = (e) => {
    e.preventDefault();
    if (!selectedCategory || !subItemForm.name.trim()) return;

    const currentCat = getCategoryData(selectedCategory);
    const itemsList = customCategoryData[selectedCategory] || currentCat.subcategories || (currentCat.sections ? currentCat.sections[0].items : []);
    
    let updatedList = [];
    if (editingSubIndex !== null && editingSubIndex !== undefined) {
      updatedList = itemsList.map((item, i) => {
        if (i === editingSubIndex) {
          return {
            ...item,
            name: subItemForm.name.trim(),
            icon: subItemForm.icon.trim() || item.icon,
            badge: subItemForm.badge.trim(),
            time: subItemForm.time.trim(),
            route: subItemForm.route.trim() || item.route,
            details: subItemForm.details
          };
        }
        return item;
      });
    } else {
      const newItem = {
        name: subItemForm.name.trim(),
        icon: subItemForm.icon.trim() || '/categories/cleaning.png',
        badge: subItemForm.badge.trim(),
        time: subItemForm.time.trim(),
        route: subItemForm.route.trim(),
        details: subItemForm.details
      };
      updatedList = [...itemsList, newItem];
    }

    const updatedAll = { ...customCategoryData, [selectedCategory]: updatedList };
    setCustomCategoryData(updatedAll);
    localStorage.setItem('admin_custom_category_items', JSON.stringify(updatedAll));
    window.dispatchEvent(new Event('admin-categories-updated'));
    setShowSubItemModal(false);
    setSubItemForm({ name: "", icon: "", badge: "", time: "", route: "", details: "" });
    setEditingSubIndex(null);
  };

  const handleSubItemImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setSubItemForm(prev => ({ ...prev, icon: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleImageUploadOnPage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setAdminCatForm(prev => ({ ...prev, image: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleResetCategoriesGrid = () => {
    if (confirm("Reset category grid back to clean default categories?")) {
      localStorage.removeItem('admin_custom_categories');
      setServiceCategories(defaultCategoriesList);
      window.dispatchEvent(new Event('admin-categories-updated'));
    }
  };

  const activeLinkingData = (() => {
    if (!isAdmin || !adminEditMode) return null;
    if (typeof window === 'undefined') return null;
    try {
      const s1 = sessionStorage.getItem('linking_card_data');
      const s2 = sessionStorage.getItem('linking_offer_data');
      return s1 ? JSON.parse(s1) : (s2 ? JSON.parse(s2) : null);
    } catch (e) {
      return null;
    }
  })();

  return (
    <>
      <section className="hero">
        <div className="hero-container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
            <h1 className="hero-title" style={{ margin: 0 }}>
              {bannerSlides[currentSlide]?.sectionTitle || heroSectionTitle}
            </h1>
            {isAdmin && adminEditMode && (
              <button
                onClick={handleOpenHeroBannersModal}
                style={{
                  background: '#3b82f6',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '6px 14px',
                  fontSize: '12px',
                  fontWeight: '800',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(59, 130, 246, 0.4)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                ✏️ Edit Hero Banners & Title
              </button>
            )}
          </div>

          <div className="hero-wrapper justdial-hero-wrapper" style={{ marginBottom: '24px' }}>
            {/* LEFT SIDE - Auto Sliding Main Banner Carousel */}
            <div className="hero-left-slider-box" style={{ position: 'relative' }}>
              {isAdmin && adminEditMode && (
                <button
                  onClick={() => handleOpenHeroBannersModal(currentSlide)}
                  style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    zIndex: 30,
                    background: '#3b82f6',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '6px 14px',
                    fontSize: '11px',
                    fontWeight: '800',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  ✏️ Edit Active Slide #{currentSlide + 1} & Title
                </button>
              )}

              <div className="justdial-main-carousel">
                {bannerSlides.map((slide, idx) => {
                  const isOnlyPhoto = slide.hideText || (!slide.title && !slide.subtitle && !slide.badge && !slide.offer);
                  return (
                    <div
                      key={idx}
                      className={`justdial-slide ${idx === currentSlide ? 'active' : ''} ${isOnlyPhoto ? 'only-photo' : ''}`}
                      onClick={() => router.push(slide.route || '/services')}
                    >
                      <img src={slide.image} alt={slide.title} />
                      {!isOnlyPhoto && (
                        <div className="slide-gradient-overlay">
                          {slide.badge && <span className="slide-top-badge">{slide.badge}</span>}
                          <div className="slide-content-text">
                            {slide.title && <h2>{slide.title}</h2>}
                            {slide.subtitle && <p className="slide-subtext">{slide.subtitle}</p>}
                            {slide.offer && <div className="slide-offer-tag">⚡ {slide.offer}</div>}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Slider Nav Controls */}
                {currentSlide > 0 && (
                  <button
                    className="carousel-arrow prev"
                    onClick={(e) => { e.stopPropagation(); setCurrentSlide(prev => Math.max(0, prev - 1)); }}
                    title="Previous Slide"
                  >
                    ❮
                  </button>
                )}
                {currentSlide < bannerSlides.length - 1 && (
                  <button
                    className="carousel-arrow next"
                    onClick={(e) => { e.stopPropagation(); setCurrentSlide(prev => Math.min(bannerSlides.length - 1, prev + 1)); }}
                    title="Next Slide"
                  >
                    ❯
                  </button>
                )}
              </div>
            </div>

            {/* RIGHT SIDE - 3 Vertical Cards Arranged Side-by-Side */}
            <div style={{ flex: 1.4, minWidth: 0 }}>
              <div className="justdial-4cards-grid">
                {justdialSideCards.map((card, cardIndex) => {
                  const isOnlyPhoto = card.hideText || (!card.title && !card.subtitle && !card.badge);
                  return (
                    <div
                      key={card.id || cardIndex}
                      className={`justdial-vertical-card ${isOnlyPhoto ? 'only-photo' : ''}`}
                      style={{ position: 'relative' }}
                      onClick={() => router.push(card.route || '/services')}
                    >
                      {isAdmin && adminEditMode && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenSingleCardModal(cardIndex);
                          }}
                          style={{
                            position: 'absolute',
                            top: '6px',
                            right: '6px',
                            zIndex: 30,
                            background: '#ef4444',
                            color: '#ffffff',
                            border: '1.5px solid #ffffff',
                            borderRadius: '6px',
                            padding: '3px 8px',
                            fontSize: '10px',
                            fontWeight: '800',
                            cursor: 'pointer',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.3)'
                          }}
                          title={`Edit ${card.title}`}
                        >
                          ✏️ Edit
                        </button>
                      )}
                      <div className="jd-card-image-box">
                        <img src={card.image} alt={card.title} />
                        {!isOnlyPhoto && card.badge && <span className="jd-card-badge">{card.badge}</span>}
                      </div>
                      {!isOnlyPhoto && (
                        <div className="jd-card-details">
                          {card.title && <h4>{card.title}</h4>}
                          {card.subtitle && <p>{card.subtitle}</p>}
                          <div className="jd-book-btn">Book Now ❯</div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

            {/* RIGHT SIDE - Service Categories */}
            <div className="hero-right" id="what-are-you-looking-for">
              {activeLinkingData && (
                <div style={{ background: '#2563eb', color: '#ffffff', padding: '10px 14px', borderRadius: '10px', marginBottom: '12px', fontSize: '13px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 4px 12px rgba(37,99,235,0.3)', border: '2px solid #60a5fa' }}>
                  <span>🎯 LINKING ACTIVE: Click any category box below to open Page 2 services, then select your service!</span>
                  <button
                    type="button"
                    onClick={() => {
                      sessionStorage.removeItem('linking_offer_data');
                      sessionStorage.removeItem('linking_card_data');
                      setLinkingOfferInfo(null);
                      toast.info("Card linking cancelled");
                    }}
                    style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', border: 'none', borderRadius: '6px', padding: '4px 10px', fontSize: '11px', cursor: 'pointer', fontWeight: '800' }}
                  >
                    Cancel
                  </button>
                </div>
              )}
              <div className="search-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>What are you looking for?</span>
                {isAdmin && adminEditMode && (
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      onClick={handleResetCategoriesGrid}
                      style={{
                        background: '#64748b',
                        color: '#ffffff',
                        border: 'none',
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: '700',
                        cursor: 'pointer'
                      }}
                      title="Reset grid to default items"
                    >
                      ↺ Reset Grid
                    </button>
                    <button
                      onClick={handleOpenAddCategoryModal}
                      style={{
                        background: '#10b981',
                        color: '#ffffff',
                        border: 'none',
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '800',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        boxShadow: '0 2px 8px rgba(16, 185, 129, 0.4)'
                      }}
                    >
                      + Add Category
                    </button>
                  </div>
                )}
              </div>

              <div className="hero-service-grid">
                {serviceCategories.map((service, index) => {
                  const isImg = service.image && (service.image.startsWith('/') || service.image.startsWith('http') || service.image.startsWith('data:'));
                  return (
                    <div
                      key={service.key || index}
                      className="service-box"
                      onClick={() => handleCategoryClick(service.key)}
                      style={{ position: 'relative' }}
                    >
                      {isAdmin && adminEditMode && (
                        <div style={{ position: 'absolute', top: '4px', right: '4px', display: 'flex', gap: '4px', zIndex: 10 }}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const catRoute = `category:${service.key}`;
                              if (activeLinkingData) {
                                handleLinkSubItemToOffer(e, { name: service.label, route: catRoute });
                              } else {
                                handleCategoryClick(service.key);
                              }
                            }}
                            style={{
                              background: activeLinkingData ? '#10b981' : '#059669',
                              color: '#fff',
                              border: 'none',
                              borderRadius: '4px',
                              width: '22px',
                              height: '22px',
                              fontSize: '13px',
                              fontWeight: 'bold',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justify: 'center',
                              boxShadow: activeLinkingData ? '0 0 8px rgba(16,185,129,0.8)' : 'none'
                            }}
                            title={`Link Entire "${service.label}" Category`}
                          >
                            +
                          </button>
                          <button
                            onClick={(e) => handleOpenEditCategoryModal(e, service)}
                            style={{ background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '4px', width: '22px', height: '22px', fontSize: '11px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            title="Edit Category"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={(e) => handleDeleteCategoryOnPage(e, service.key)}
                            style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: '4px', width: '22px', height: '22px', fontSize: '11px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            title="Delete Category"
                          >
                            🗑️
                          </button>
                        </div>
                      )}
                      <div className="service-icon">
                        {isImg ? (
                          <img src={service.image} alt={service.label || service.name} className="service-category-img" />
                        ) : (
                          <span style={{ fontSize: '1.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                            {service.icon || service.image || '⚡'}
                          </span>
                        )}
                      </div>
                      <p>{service.label || service.name}</p>
                    </div>
                  );
                })}

                {isAdmin && adminEditMode && (
                  <div
                    className="service-box"
                    onClick={handleOpenAddCategoryModal}
                    style={{ border: '2px dashed #10b981', background: 'rgba(16, 185, 129, 0.05)', cursor: 'pointer' }}
                  >
                    <div className="service-icon" style={{ fontSize: '2rem', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                      +
                    </div>
                    <p style={{ color: '#10b981', fontWeight: '800' }}>Add Category</p>
                  </div>
                )}
              </div>

              {/* STATS */}
              <div className="stats">
                <div className="stat-box">
                  <h3>4.8★</h3>
                  <p className="stat-label">Service Rating</p>
                </div>
                <div className="stat-box">
                  <h3>100K+</h3>
                  <p className="stat-label">Happy Customers</p>
                </div>
                <div className="stat-box">
                  <h3>5K+</h3>
                  <p className="stat-label">Expert Partners</p>
                </div>
              </div>
            </div>
          </div>
        </section>

      {/* SUB-CATEGORIES MODAL - outside section for proper fixed overlay */}
      {selectedCategory && (
        <div className="hero-modal-overlay" onClick={handleCloseModal}>
          <div className="hero-modal-content" onClick={(e) => e.stopPropagation()}>
            {selectedPreferenceItem ? (
              <button className="hero-modal-back-btn" onClick={() => setSelectedPreferenceItem(null)}>
                ←
              </button>
            ) : (
              <button className="hero-modal-back" onClick={handleCloseModal}>
                ← Back
              </button>
            )}
            <button className="hero-modal-close" onClick={handleCloseModal}>
              ×
            </button>
            
            {(() => {
              const currentCat = getCategoryData(selectedCategory);
              return (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingRight: '60px', borderBottom: '1px solid #f0f0f0' }}>
                    <h3 className={selectedPreferenceItem ? 'has-back-btn' : ''} style={{ borderBottom: 'none' }}>
                      {selectedPreferenceItem ? "Select your preference" : currentCat.name}
                    </h3>
                    {isAdmin && adminEditMode && !selectedPreferenceItem && (
                      <button
                        onClick={handleOpenAddSubItem}
                        style={{
                          background: '#10b981',
                          color: '#ffffff',
                          border: 'none',
                          padding: '6px 12px',
                          borderRadius: '8px',
                          fontSize: '12px',
                          fontWeight: '800',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          boxShadow: '0 2px 8px rgba(16, 185, 129, 0.4)',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        + Add Sub-Service
                      </button>
                    )}
                  </div>

                  {activeLinkingData && (
                    <div style={{ background: '#ecfdf5', border: '1px solid #6ee7b7', color: '#047857', padding: '10px 14px', borderRadius: '10px', fontSize: '12px', fontWeight: '700', marginTop: '10px', marginBottom: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', flexWrap: 'wrap' }}>
                      <span>🎯 Click (+) on any service below, OR link the whole category:</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          const catRoute = `category:${selectedCategory}`;
                          handleLinkSubItemToOffer(e, { name: currentCat.name, route: catRoute });
                        }}
                        style={{
                          background: '#2563eb',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '6px 12px',
                          fontSize: '11px',
                          fontWeight: '800',
                          cursor: 'pointer',
                          boxShadow: '0 2px 6px rgba(37,99,235,0.3)',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        🔗 Link Entire Category ("{currentCat.name}")
                      </button>
                    </div>
                  )}

                  {selectedPreferenceItem ? (
                    <div className="hero-preferences-list">
                      {selectedPreferenceItem.bannerImage && (
                        <div className="hero-preference-banner">
                          <img src={selectedPreferenceItem.bannerImage} alt={selectedPreferenceItem.name} />
                        </div>
                      )}
                      {selectedPreferenceItem.preferences.map((pref, pIdx) => (
                        <div
                          key={pIdx}
                          className="hero-preference-card"
                          style={{ position: 'relative' }}
                          onClick={() => {
                            if (activeLinkingData) {
                              handleLinkSubItemToOffer(null, { name: pref.name, route: pref.route });
                              return;
                            }
                            handleCloseModal();
                            router.push(pref.route);
                          }}
                        >
                          {activeLinkingData && (
                            <button
                              type="button"
                              onClick={(e) => handleLinkSubItemToOffer(e, { name: pref.name, route: pref.route })}
                              style={{
                                position: 'absolute',
                                top: '4px',
                                left: '4px',
                                background: '#10b981',
                                color: '#ffffff',
                                border: '2px solid #ffffff',
                                borderRadius: '50%',
                                width: '24px',
                                height: '24px',
                                fontSize: '15px',
                                fontWeight: '900',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                zIndex: 40,
                                boxShadow: '0 2px 6px rgba(16, 185, 129, 0.5)'
                              }}
                              title={`Link ${pref.name}`}
                            >
                              +
                            </button>
                          )}
                          <div className="preference-img-wrapper">
                            <img src={pref.image} alt={pref.name} />
                          </div>
                          <div className="preference-details">
                            <h4>{pref.name}</h4>
                            {pref.subtitle && (
                              <div className="preference-subtitle">
                                ⚡ {pref.subtitle}
                              </div>
                            )}
                            <div className="preference-tags">
                              {pref.tags && pref.tags.map((tag, tIdx) => (
                                <span key={tIdx} className="preference-tag">{tag}</span>
                              ))}
                            </div>
                          </div>
                          <div className="preference-arrow">
                            ›
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : currentCat.sections ? (
                    <div className="hero-sections-container">
                      {currentCat.sections.map((section, sIndex) => (
                        <div key={sIndex} className="hero-section">
                          <h4 className="hero-section-title">{section.title}</h4>
                          <div className="hero-subcategory-grid">
                            {section.items.map((sub, index) => {
                              const routeSlug = (sub.route && sub.route.trim() !== '' && sub.route !== '#')
                                ? sub.route
                                : `/services/${sub.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
                              return (
                                <div
                                  key={index}
                                  className="hero-subcategory-card"
                                  style={{ position: 'relative' }}
                                  onClick={() => {
                                    if (activeLinkingData) {
                                      handleLinkSubItemToOffer(null, sub);
                                      return;
                                    }
                                    if (sub.preferences) {
                                      setSelectedPreferenceItem(sub);
                                    } else {
                                      handleCloseModal();
                                      router.push(routeSlug);
                                    }
                                  }}
                                >
                                  {activeLinkingData && (
                                    <button
                                      type="button"
                                      onClick={(e) => handleLinkSubItemToOffer(e, sub)}
                                      style={{
                                        position: 'absolute',
                                        top: '4px',
                                        left: '4px',
                                        background: '#10b981',
                                        color: '#ffffff',
                                        border: '2px solid #ffffff',
                                        borderRadius: '50%',
                                        width: '24px',
                                        height: '24px',
                                        fontSize: '15px',
                                        fontWeight: '900',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        zIndex: 40,
                                        boxShadow: '0 2px 6px rgba(16, 185, 129, 0.5)'
                                      }}
                                      title={`Link ${sub.name}`}
                                    >
                                      +
                                    </button>
                                  )}
                                  {isAdmin && adminEditMode && (
                                    <div style={{ position: 'absolute', top: '2px', right: '2px', display: 'flex', gap: '3px', zIndex: 30 }}>
                                      <button
                                        onClick={(e) => handleOpenEditSubItem(e, sub, index)}
                                        style={{ background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '4px', width: '20px', height: '20px', fontSize: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                        title="Edit Sub-Item"
                                      >
                                        ✏️
                                      </button>
                                      <button
                                        onClick={(e) => handleDeleteSubItem(e, index)}
                                        style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: '4px', width: '20px', height: '20px', fontSize: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                        title="Delete Sub-Item"
                                      >
                                        🗑️
                                      </button>
                                    </div>
                                  )}
                                  <div className="hero-subcategory-icon" style={{ position: 'relative' }}>
                                    {sub.icon && (sub.icon.startsWith('/') || sub.icon.startsWith('http') || sub.icon.startsWith('data:')) ? (
                                      <img src={sub.icon} alt={sub.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : sub.icon && sub.icon.startsWith('svg:') ? (
                                      (() => {
                                        const svgKey = sub.icon.split(':')[1];
                                        const SvgComponent = SubcategoryIcons[svgKey];
                                        return SvgComponent ? <SvgComponent /> : null;
                                      })()
                                    ) : (
                                      sub.icon || "🔧"
                                    )}
                                  </div>
                                  {(sub.time || sub.badge) && (
                                    <span style={{
                                      marginTop: '-12px',
                                      background: '#ffffff',
                                      color: '#15803d',
                                      border: '1px solid #bbf7d0',
                                      fontSize: '9px',
                                      fontWeight: '700',
                                      padding: '2px 6px',
                                      borderRadius: '6px',
                                      whiteSpace: 'nowrap',
                                      zIndex: 2,
                                      boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                                    }}>
                                      {sub.time || sub.badge}
                                    </span>
                                  )}
                                  {sub.time && sub.badge && (
                                    <span style={{
                                      position: 'absolute',
                                      top: '4px',
                                      left: '4px',
                                      background: '#ef4444',
                                      color: '#ffffff',
                                      fontSize: '8px',
                                      fontWeight: '800',
                                      padding: '2px 4px',
                                      borderRadius: '4px',
                                      zIndex: 10
                                    }}>
                                      {sub.badge}
                                    </span>
                                  )}
                                  <p>{sub.name}</p>
                                </div>
                              );
                            })}

                            {isAdmin && adminEditMode && (
                              <div
                                className="hero-subcategory-card"
                                onClick={handleOpenAddSubItem}
                                style={{ border: '2px dashed #10b981', background: 'rgba(16, 185, 129, 0.05)', cursor: 'pointer' }}
                              >
                                <div className="hero-subcategory-icon" style={{ fontSize: '1.6rem', color: '#10b981', background: 'transparent' }}>
                                  +
                                </div>
                                <p style={{ color: '#10b981', fontWeight: '800' }}>Add Item</p>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : currentCat.subcategories ? (
                    <div className="hero-subcategory-grid">
                      {currentCat.subcategories.map((sub, index) => {
                        const routeSlug = (sub.route && sub.route.trim() !== '' && sub.route !== '#')
                          ? sub.route
                          : `/services/${sub.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
                        return (
                          <div
                            key={index}
                            className="hero-subcategory-card"
                            style={{ position: 'relative' }}
                            onClick={() => {
                              if (activeLinkingData) {
                                handleLinkSubItemToOffer(null, sub);
                                return;
                              }
                              if (sub.preferences) {
                                setSelectedPreferenceItem(sub);
                              } else {
                                handleCloseModal();
                                router.push(routeSlug);
                              }
                            }}
                          >
                            {activeLinkingData && (
                              <button
                                type="button"
                                onClick={(e) => handleLinkSubItemToOffer(e, sub)}
                                style={{
                                  position: 'absolute',
                                  top: '4px',
                                  left: '4px',
                                  background: '#10b981',
                                  color: '#ffffff',
                                  border: '2px solid #ffffff',
                                  borderRadius: '50%',
                                  width: '24px',
                                  height: '24px',
                                  fontSize: '15px',
                                  fontWeight: '900',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  zIndex: 40,
                                  boxShadow: '0 2px 6px rgba(16, 185, 129, 0.5)'
                                }}
                                title={`Link ${sub.name}`}
                              >
                                +
                              </button>
                            )}
                            {isAdmin && adminEditMode && (
                              <div style={{ position: 'absolute', top: '2px', right: '2px', display: 'flex', gap: '3px', zIndex: 30 }}>
                                <button
                                  onClick={(e) => handleOpenEditSubItem(e, sub, index)}
                                  style={{ background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '4px', width: '20px', height: '20px', fontSize: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                  title="Edit Sub-Item"
                                >
                                  ✏️
                                </button>
                                <button
                                  onClick={(e) => handleDeleteSubItem(e, index)}
                                  style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: '4px', width: '20px', height: '20px', fontSize: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                  title="Delete Sub-Item"
                                >
                                  🗑️
                                </button>
                              </div>
                            )}
                            <div className="hero-subcategory-icon" style={{ position: 'relative' }}>
                              {sub.icon && (sub.icon.startsWith('/') || sub.icon.startsWith('http') || sub.icon.startsWith('data:')) ? (
                                <img src={sub.icon} alt={sub.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              ) : sub.icon && sub.icon.startsWith('svg:') ? (
                                (() => {
                                  const svgKey = sub.icon.split(':')[1];
                                  const SvgComponent = SubcategoryIcons[svgKey];
                                  return SvgComponent ? <SvgComponent /> : null;
                                })()
                              ) : (
                                sub.icon || "🔧"
                              )}
                            </div>
                            {(sub.time || sub.badge) && (
                              <span style={{
                                marginTop: '-12px',
                                background: '#ffffff',
                                color: '#047857',
                                border: '1px solid #a7f3d0',
                                fontSize: '9px',
                                fontWeight: '700',
                                padding: '2px 6px',
                                borderRadius: '6px',
                                whiteSpace: 'nowrap',
                                zIndex: 2,
                                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                              }}>
                                {sub.time || sub.badge}
                              </span>
                            )}
                            {sub.time && sub.badge && (
                              <span style={{
                                position: 'absolute',
                                top: '4px',
                                left: '4px',
                                background: '#ef4444',
                                color: '#ffffff',
                                fontSize: '8px',
                                fontWeight: '800',
                                padding: '2px 4px',
                                borderRadius: '4px',
                                zIndex: 10
                              }}>
                                {sub.badge}
                              </span>
                            )}
                            <p>{sub.name}</p>
                          </div>
                        );
                      })}

                      {isAdmin && adminEditMode && (
                        <div
                          className="hero-subcategory-card"
                          onClick={handleOpenAddSubItem}
                          style={{ border: '2px dashed #10b981', background: 'rgba(16, 185, 129, 0.05)', cursor: 'pointer' }}
                        >
                          <div className="hero-subcategory-icon" style={{ fontSize: '1.6rem', color: '#10b981', background: 'transparent' }}>
                            +
                          </div>
                          <p style={{ color: '#10b981', fontWeight: '800' }}>Add Item</p>
                        </div>
                      )}
                    </div>
                  ) : null}
                </>
              );
            })()}
          </div>
        </div>
      )}

      {/* DIRECT ON-PAGE ADMIN CATEGORY MODAL */}
      {showAdminCatModal && (
        <div className="hero-modal-overlay" onClick={() => setShowAdminCatModal(false)}>
          <div className="hero-modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '440px', padding: '24px' }}>
            <button className="hero-modal-close" onClick={() => setShowAdminCatModal(false)}>×</button>
            <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '16px', color: '#0f172a' }}>
              {editingCatItem ? "Edit Category Box" : "Add New Category Box"}
            </h3>
            <form onSubmit={handleSaveAdminCategoryOnPage}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>Category Name / Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Painting & Waterproofing"
                  value={adminCatForm.label}
                  onChange={(e) => setAdminCatForm({ ...adminCatForm, label: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', backgroundColor: '#ffffff', color: '#0f172a' }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>Category Icon / Photo</label>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input
                    type="text"
                    placeholder="Paste Photo URL or choose file →"
                    value={adminCatForm.image}
                    onChange={(e) => setAdminCatForm({ ...adminCatForm, image: e.target.value })}
                    style={{ flex: 1, padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', backgroundColor: '#ffffff', color: '#0f172a' }}
                  />
                  <label style={{ padding: '10px 14px', background: '#3b82f6', color: '#ffffff', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '12px', whiteSpace: 'nowrap' }}>
                    Upload Photo
                    <input type="file" accept="image/*" onChange={handleImageUploadOnPage} style={{ display: 'none' }} />
                  </label>
                </div>
              </div>

              <button
                type="submit"
                style={{ width: '100%', padding: '12px', background: '#10b981', color: '#ffffff', border: 'none', borderRadius: '10px', fontWeight: '800', fontSize: '15px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(16,185,129,0.3)' }}
              >
                {editingCatItem ? "Save Changes" : "Publish Category Live"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* DIRECT SUB-SERVICE EDIT MODAL */}
      {showSubItemModal && (
        <div className="hero-modal-overlay" style={{ zIndex: 10000 }} onClick={() => setShowSubItemModal(false)}>
          <div className="hero-modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '440px', padding: '24px' }}>
            <button className="hero-modal-close" onClick={() => setShowSubItemModal(false)}>×</button>
            <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '16px', color: '#0f172a' }}>
              {editingSubIndex !== null ? "Edit Sub-Service Item" : "Add New Sub-Service Item"}
            </h3>
            <form onSubmit={handleSaveSubItem}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>Service Name / Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Spa for Women, Foam Jet AC Wash"
                  value={subItemForm.name}
                  onChange={(e) => setSubItemForm({ ...subItemForm, name: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }}
                />
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>Service Photo / Icon</label>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input
                    type="text"
                    placeholder="Paste Image URL or choose file →"
                    value={subItemForm.icon}
                    onChange={(e) => setSubItemForm({ ...subItemForm, icon: e.target.value })}
                    style={{ flex: 1, padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }}
                  />
                  <label style={{ padding: '10px 14px', background: '#3b82f6', color: '#ffffff', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '12px', whiteSpace: 'nowrap' }}>
                    Upload
                    <input type="file" accept="image/*" onChange={handleSubItemImageUpload} style={{ display: 'none' }} />
                  </label>
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>Service Time (e.g. 45 mins) - Optional</label>
                <input
                  type="text"
                  placeholder="e.g. 45 mins, 1 hour"
                  value={subItemForm.time}
                  onChange={(e) => setSubItemForm({ ...subItemForm, time: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', marginBottom: '16px' }}
                />

                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>Discount Badge / Price Tag (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. ₹499, Up to 30% OFF, Popular"
                  value={subItemForm.badge}
                  onChange={(e) => setSubItemForm({ ...subItemForm, badge: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', marginBottom: '16px' }}
                />

                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>Service Details / Highlights</label>
                <div style={{ background: '#fff' }}>
                  <ReactQuill
                    theme="snow"
                    value={subItemForm.details}
                    onChange={(val) => setSubItemForm({ ...subItemForm, details: val })}
                    placeholder="Describe your product/service here... You can add images, bold text, lists, etc."
                    style={{ height: '150px', marginBottom: '40px' }}
                  />
                </div>
              </div>

              <button
                type="submit"
                style={{ width: '100%', padding: '12px', background: '#10b981', color: '#ffffff', border: 'none', borderRadius: '10px', fontWeight: '800', fontSize: '15px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(16,185,129,0.3)' }}
              >
                {editingSubIndex !== null ? "Save Changes" : "Publish Sub-Service Live"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* EDIT HERO BANNERS & HEADING MODAL */}
      {showHeroBannersModal && (
        <div className="hero-modal-overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000 }} onClick={() => setShowHeroBannersModal(false)}>
          <div className="hero-modal-content" onClick={(e) => e.stopPropagation()} style={{ background: '#ffffff', borderRadius: '16px', maxWidth: '540px', width: '90%', maxHeight: '85vh', overflowY: 'auto', padding: '24px', position: 'relative' }}>
            <button onClick={() => setShowHeroBannersModal(false)} style={{ position: 'absolute', top: '16px', right: '16px', border: 'none', background: '#f1f5f9', width: '32px', height: '32px', borderRadius: '50%', fontSize: '18px', cursor: 'pointer' }}>×</button>
            <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a', marginBottom: '20px' }}>
              Edit Homepage Hero Banners & Section Title
            </h3>

            <form onSubmit={handleSaveHeroBanners}>
              {/* SLIDE SELECTOR TABS */}
              <div style={{ marginBottom: '16px', padding: '12px', background: '#eff6ff', borderRadius: '12px', border: '1px solid #bfdbfe' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', color: '#1e40af', marginBottom: '8px' }}>
                  Select Carousel Slide Banner to Edit (Editing Slide #{editingSlideIndex + 1}):
                </label>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {bannerSlides.map((slide, sIdx) => (
                    <button
                      key={sIdx}
                      type="button"
                      onClick={() => handleSwitchModalSlideTab(sIdx)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '8px',
                        fontSize: '11px',
                        fontWeight: '800',
                        cursor: 'pointer',
                        border: editingSlideIndex === sIdx ? '2px solid #2563eb' : '1px solid #cbd5e1',
                        background: editingSlideIndex === sIdx ? '#2563eb' : '#ffffff',
                        color: editingSlideIndex === sIdx ? '#ffffff' : '#475569',
                        boxShadow: editingSlideIndex === sIdx ? '0 2px 6px rgba(37,99,235,0.4)' : 'none'
                      }}
                    >
                      Slide {sIdx + 1}: {slide.title ? (slide.title.length > 12 ? slide.title.substring(0, 12) + '...' : slide.title) : `Slide ${sIdx + 1}`}
                    </button>
                  ))}
                </div>
              </div>

              {/* ACTIVE SLIDE EDIT FORM */}
              <div style={{ marginBottom: '16px', padding: '14px', background: '#f0fdf4', borderRadius: '12px', border: '1px solid #bbf7d0' }}>
                <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', fontWeight: '800', color: '#166534' }}>
                  Editing Slide #{editingSlideIndex + 1} ({slidesFormData[editingSlideIndex]?.title || 'Banner'})
                </h4>

                <div style={{ marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px', background: '#ffffff', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                  <input
                    type="checkbox"
                    id={`hideTextCheck_${editingSlideIndex}`}
                    checked={!!slidesFormData[editingSlideIndex]?.hideText}
                    onChange={(e) => updateCurrentSlideForm('hideText', e.target.checked)}
                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                  <label htmlFor={`hideTextCheck_${editingSlideIndex}`} style={{ fontSize: '13px', fontWeight: '800', color: '#0f172a', cursor: 'pointer', margin: 0 }}>
                    📸 Only Photo Banner (Hide Title, Subtitle, Badges & Text Overlay)
                  </label>
                </div>

                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', color: '#1e293b', margin: '0 0 4px 0' }}>
                    Slide #{editingSlideIndex + 1} Main Heading (Top Title)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Home services expert at your doorstep"
                    value={slidesFormData[editingSlideIndex]?.sectionTitle || ''}
                    onChange={(e) => updateCurrentSlideForm('sectionTitle', e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', fontWeight: '700' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>Badge (Top-Left Tag)</label>
                    <input
                      type="text"
                      placeholder="e.g. Flash Sale"
                      value={slidesFormData[editingSlideIndex]?.badge || ''}
                      onChange={(e) => updateCurrentSlideForm('badge', e.target.value)}
                      style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>Title</label>
                    <input
                      type="text"
                      placeholder="e.g. HOME CLEANING"
                      value={slidesFormData[editingSlideIndex]?.title || ''}
                      onChange={(e) => updateCurrentSlideForm('title', e.target.value)}
                      style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>Subtitle</label>
                    <input
                      type="text"
                      placeholder="e.g. Natural"
                      value={slidesFormData[editingSlideIndex]?.subtitle || ''}
                      onChange={(e) => updateCurrentSlideForm('subtitle', e.target.value)}
                      style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>Offer Tag</label>
                    <input
                      type="text"
                      placeholder="e.g. Up to 40% OFF on Deep Cleaning"
                      value={slidesFormData[editingSlideIndex]?.offer || ''}
                      onChange={(e) => updateCurrentSlideForm('offer', e.target.value)}
                      style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>Background Image URL / Upload</label>
                  <div style={{ display: 'flex', gap: '6px', marginBottom: '12px' }}>
                    <input
                      type="text"
                      placeholder="Paste Image URL →"
                      value={slidesFormData[editingSlideIndex]?.image || ''}
                      onChange={(e) => updateCurrentSlideForm('image', e.target.value)}
                      style={{ flex: 1, padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px' }}
                    />
                    <label style={{ padding: '8px 12px', background: '#3b82f6', color: '#fff', borderRadius: '6px', cursor: 'pointer', fontWeight: '700', fontSize: '11px', whiteSpace: 'nowrap' }}>
                      Upload
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          const r = new FileReader();
                          r.onloadend = () => updateCurrentSlideForm('image', r.result);
                          r.readAsDataURL(file);
                        }}
                        style={{ display: 'none' }}
                      />
                    </label>
                  </div>
                </div>

                <div style={{ padding: '10px 12px', background: '#eff6ff', borderRadius: '10px', border: '1px solid #bfdbfe' }}>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: '800', color: '#1e40af', marginBottom: '6px' }}>
                    🔗 Click Link / Target Service Page:
                  </label>
                  <button
                    type="button"
                    onClick={() => handleStartLinkingToCategory('hero_main_banner')}
                    style={{
                      width: '100%',
                      background: '#2563eb',
                      color: '#ffffff',
                      border: 'none',
                      padding: '9px 14px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: '800',
                      cursor: 'pointer',
                      boxShadow: '0 2px 8px rgba(37,99,235,0.4)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px'
                    }}
                  >
                    🎯 Pick Target Service from "What are you looking for?" ↓
                  </button>
                </div>
              </div>

              <button
                type="submit"
                style={{ width: '100%', padding: '12px', background: '#10b981', color: '#ffffff', border: 'none', borderRadius: '10px', fontWeight: '800', fontSize: '15px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(16,185,129,0.3)' }}
              >
                💾 Save Main Banner & Heading Live
              </button>
            </form>
          </div>
        </div>
      )}

      {/* DEDICATED SINGLE SIDE CARD EDIT MODAL */}
      {show4CardsModal && (
        <div className="hero-modal-overlay" style={{ zIndex: 10000 }} onClick={() => setShow4CardsModal(false)}>
          <div className="hero-modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '460px', padding: '24px' }}>
            <button className="hero-modal-close" onClick={() => setShow4CardsModal(false)}>×</button>
            <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '16px', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
              ✏️ Edit Card #{editingCardIndex + 1}: {singleCardForm.title || 'Side Card'}
            </h3>
            <form onSubmit={handleSaveSingleCardModal}>
              <div style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px', background: '#ffffff', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                <input
                  type="checkbox"
                  id="hideTextCardCheck"
                  checked={!!singleCardForm.hideText}
                  onChange={(e) => setSingleCardForm({ ...singleCardForm, hideText: e.target.checked })}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <label htmlFor="hideTextCardCheck" style={{ fontSize: '13px', fontWeight: '800', color: '#0f172a', cursor: 'pointer', margin: 0 }}>
                  📸 Only Photo Card (Hide Title, Subtitle, Badges & "Book Now" Button)
                </label>
              </div>
              <div style={{ padding: '14px', background: '#f8fafc', borderRadius: '12px', border: '1.5px solid #cbd5e1', marginBottom: '20px' }}>
                <div style={{ marginBottom: '12px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>Card Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. AC & Appliance"
                    value={singleCardForm.title || ''}
                    onChange={(e) => setSingleCardForm({ ...singleCardForm, title: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }}
                  />
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>Subtitle / Description</label>
                  <input
                    type="text"
                    placeholder="e.g. Service & Gas Refill"
                    value={singleCardForm.subtitle || ''}
                    onChange={(e) => setSingleCardForm({ ...singleCardForm, subtitle: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }}
                  />
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>Badge Tag</label>
                  <input
                    type="text"
                    placeholder="e.g. COOLING, FAST 30m, POPULAR"
                    value={singleCardForm.badge || ''}
                    onChange={(e) => setSingleCardForm({ ...singleCardForm, badge: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }}
                  />
                </div>

                <div style={{ marginBottom: '12px', padding: '10px', background: '#eff6ff', borderRadius: '10px', border: '1px solid #bfdbfe' }}>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: '800', color: '#1e40af', marginBottom: '6px' }}>Click Link / Target Service Page:</label>
                  <button
                    type="button"
                    onClick={() => handleStartLinkingToCategory('side_card', editingCardIndex)}
                    style={{
                      width: '100%',
                      marginBottom: '8px',
                      background: '#2563eb',
                      color: '#ffffff',
                      border: 'none',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: '800',
                      cursor: 'pointer',
                      boxShadow: '0 2px 8px rgba(37,99,235,0.4)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px'
                    }}
                  >
                    🎯 Pick Target Service from "What are you looking for?" ↓
                  </button>
                  <select
                    value={singleCardForm.route || '/services'}
                    onChange={(e) => setSingleCardForm({ ...singleCardForm, route: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', background: '#ffffff' }}
                  >
                    <option value="/ac-repair">AC Repair (/ac-repair)</option>
                    <option value="/electrician">Electrician (/electrician)</option>
                    <option value="/plumber">Plumber (/plumber)</option>
                    <option value="/carpenter">Carpenter (/carpenter)</option>
                    <option value="/services/full-home-cleaning">Home Cleaning (/services/full-home-cleaning)</option>
                    <option value="/geyser">Geyser Repair (/geyser)</option>
                    <option value="/refrigerator">Refrigerator Repair (/refrigerator)</option>
                    <option value="/water-purifier">RO Purifier (/water-purifier)</option>
                    <option value="/stove">Stove Repair (/stove)</option>
                    <option value="/washing-machine">Washing Machine (/washing-machine)</option>
                    <option value="/services">All Services Page (/services)</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>Card Image / Upload</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="text"
                      placeholder="Paste Photo URL →"
                      value={singleCardForm.image || ''}
                      onChange={(e) => setSingleCardForm({ ...singleCardForm, image: e.target.value })}
                      style={{ flex: 1, padding: '8px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                    />
                    <label style={{ padding: '8px 14px', background: '#3b82f6', color: '#ffffff', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '12px', whiteSpace: 'nowrap' }}>
                      Upload
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          const r = new FileReader();
                          r.onloadend = () => setSingleCardForm(prev => ({ ...prev, image: r.result }));
                          r.readAsDataURL(file);
                        }}
                        style={{ display: 'none' }}
                      />
                    </label>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                style={{ width: '100%', padding: '12px', background: '#10b981', color: '#ffffff', border: 'none', borderRadius: '10px', fontWeight: '800', fontSize: '15px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(16,185,129,0.3)' }}
              >
                💾 Save Card Live
              </button>
            </form>
          </div>
        </div>
      )}

    </>
  );
}
