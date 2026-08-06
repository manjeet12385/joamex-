"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import AdminHeader from "../../../components/admin/AdminHeader";
import "../admin.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Plus, Edit2, Trash2, Image as ImageIcon, Tag, Percent, Check, RefreshCw, FolderPlus, Zap } from "lucide-react";

export default function AdminServicesManagement() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("services"); // "services" | "offers"
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Initial mock services list for management
  const [servicesList, setServicesList] = useState([
    {
      id: "srv-1",
      category: "Furniture Assembly",
      subcategory: "Wardrobes",
      name: "Sliding door wardrobe with drawers",
      price: 799,
      duration: "2 hrs",
      rating: "4.72",
      reviews: "441 reviews",
      badge: "POPULAR",
      image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=400&h=300&fit=crop&q=80",
      status: "Active"
    },
    {
      id: "srv-2",
      category: "Furniture Assembly",
      subcategory: "Wardrobes",
      name: "Single hinge door (per frame)",
      price: 849,
      duration: "60 mins",
      rating: "4.78",
      reviews: "216 reviews",
      badge: "HOT DEAL",
      image: "https://images.unsplash.com/photo-1558882224-dda166733046?w=400&h=300&fit=crop&q=80",
      status: "Active"
    },
    {
      id: "srv-3",
      category: "Furniture Assembly",
      subcategory: "Tables & drawers",
      name: "5 drawer chest",
      price: 499,
      duration: "1 hr 10 mins",
      rating: "4.85",
      reviews: "2K",
      badge: "BESTSELLER",
      image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=400&h=300&fit=crop&q=80",
      status: "Active"
    },
    {
      id: "srv-4",
      category: "Electrician",
      subcategory: "Switch & Socket",
      name: "Switch/socket repair & replacement",
      price: 69,
      duration: "20 mins",
      rating: "4.83",
      reviews: "182K",
      badge: "STARTER",
      image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=300&fit=crop&q=80",
      status: "Active"
    },
    {
      id: "srv-5",
      category: "AC & Appliance Repair",
      subcategory: "AC Repair",
      name: "AC Foam Jet Service",
      price: 599,
      duration: "45 mins",
      rating: "4.86",
      reviews: "95K",
      badge: "PROMO",
      image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=300&fit=crop&q=80",
      status: "Active"
    }
  ]);

  // Offers list
  const [offersList, setOffersList] = useState([
    {
      id: "offer-1",
      title: "Up to 30% OFF",
      subtitle: "AC Service & Repair",
      badge: "HOT DEAL",
      bgColor: "#E8F5E9",
      textColor: "#388E3C",
      image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=300&fit=crop",
      route: "/ac-repair"
    },
    {
      id: "offer-2",
      title: "Electrician Services",
      subtitle: "Top Electrical Experts",
      badge: "BEST VALUE",
      bgColor: "#FFF3E0",
      textColor: "#F57C00",
      image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=300&fit=crop",
      route: "/electrician"
    },
    {
      id: "offer-3",
      title: "Salon for Women",
      subtitle: "Save up to 40% OFF",
      badge: "TRENDING",
      bgColor: "#FCE4EC",
      textColor: "#C2185B",
      image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop",
      route: "/services/salon-at-home"
    }
  ]);

  // Form State for Service Add/Edit
  const [editingServiceId, setEditingServiceId] = useState(null);
  const [serviceForm, setServiceForm] = useState({
    name: "",
    category: "Furniture Assembly",
    subcategory: "Wardrobes",
    price: "",
    duration: "45 mins",
    badge: "NEW",
    image: "",
    rating: "4.85",
    reviews: "100 reviews"
  });

  // Form State for Offer Add/Edit
  const [editingOfferId, setEditingOfferId] = useState(null);
  const [offerForm, setOfferForm] = useState({
    title: "",
    subtitle: "",
    badge: "SPECIAL",
    bgColor: "#E3F2FD",
    textColor: "#1976D2",
    image: "",
    route: "/services"
  });

  // Hero Banners State
  const [heroBanners, setHeroBanners] = useState({
    mainBanner: {
      image: '/slider1.jpg',
      badge: 'Flash Sale',
      title: 'HOME CLEANING',
      subtitle: 'Natural',
      offer: 'Up to 40% OFF on Deep Cleaning'
    },
    grid1: {
      image: '/grid1-plumber.jpg',
      alt: 'Service Expert'
    },
    grid2: {
      image: '/grid2-electrician.jpg',
      alt: 'Plumbing Services'
    }
  });

  // Custom Category Items State (items inside category popup modals)
  const [customCatItems, setCustomCatItems] = useState({});
  const [catItemForm, setCatItemForm] = useState({
    categoryKey: "ac",
    name: "",
    price: "",
    badge: "45 mins",
    icon: "",
    route: "/services"
  });

  // Custom Category Boxes List State (9 Hero Grid boxes)
  const [heroCategoriesList, setHeroCategoriesList] = useState([
    { key: 'ac', image: '/categories/ac-repair.png', label: 'AC & Appliance Repair' },
    { key: 'electrician', image: '/categories/electrician.png', label: 'Electrician & Plumber' },
    { key: 'cleaning', image: '/categories/cleaning.png', label: 'Cleaning & Pest Control' },
    { key: 'renovation', image: '/categories/renovation.png', label: 'Renovation & Interior' },
    { key: 'fabrication', image: '/categories/fabrication.png', label: 'Fabrication & Roofing' },
    { key: 'beauty', image: '/categories/beauty.png', label: 'Women\'s Beauty & Spa' },
    { key: 'grooming', image: '/categories/grooming.png', label: 'Men\'s Grooming' },
    { key: 'homecare', image: '/categories/homecare.png', label: 'Home Care & Support' },
    { key: 'security', image: '/categories/security.png', label: 'Home Security & Solar' },
  ]);

  const [newCatBoxForm, setNewCatBoxForm] = useState({
    label: "",
    key: "",
    image: ""
  });

  // Most Booked Services State
  const [mostBookedList, setMostBookedList] = useState([
    {
      id: 'booked-1',
      image: '/service-ac.png',
      title: 'AC Gas Refilling',
      priceRange: 'Starts at ₹1,299',
      price: 1299,
      route: '/ac-repair'
    },
    {
      id: 'booked-2',
      image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&h=300&fit=crop',
      title: 'Bathroom Deep Cleaning',
      priceRange: 'Starts at ₹499',
      price: 499,
      route: '/services/bathroom-cleaning'
    },
    {
      id: 'booked-3',
      image: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=400&h=300&fit=crop',
      title: 'Switch Repair',
      priceRange: 'Starts at ₹99',
      price: 99,
      route: '/electrician'
    },
    {
      id: 'booked-4',
      image: 'https://images.unsplash.com/photo-1607400201515-c2c41c07d307?w=400&h=300&fit=crop',
      title: 'Flush Repair',
      priceRange: 'Starts at ₹149',
      price: 149,
      route: '/plumber'
    },
    {
      id: 'booked-5',
      image: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=400&h=300&fit=crop',
      title: 'Spin Issue Fix',
      priceRange: 'Starts at ₹599',
      price: 599,
      route: '/washing-machine'
    }
  ]);

  const [editingMostBookedId, setEditingMostBookedId] = useState(null);
  const [mostBookedForm, setMostBookedForm] = useState({
    title: "",
    price: "",
    priceRange: "",
    image: "",
    route: "/services"
  });

  // Essential Services State
  const [essentialList, setEssentialList] = useState([
    {
      id: 'essential-1',
      title: 'Refrigerator',
      subtitle: 'Repair & Gas refill',
      image: 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=400&h=300&fit=crop',
      route: '/refrigerator'
    },
    {
      id: 'essential-2',
      title: 'Geyser',
      subtitle: 'Service & Installation',
      image: 'https://images.unsplash.com/photo-1607400201515-c2c41c07d307?w=400&h=300&fit=crop',
      route: '/geyser'
    },
    {
      id: 'essential-3',
      title: 'RO Water Purifier',
      subtitle: 'Repair & Service',
      image: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=400&h=300&fit=crop',
      route: '/water-purifier'
    },
    {
      id: 'essential-4',
      title: 'Gas Stove',
      subtitle: 'Sales & Servicing',
      image: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=400&h=300&fit=crop',
      route: '/stove'
    }
  ]);

  const [editingEssentialId, setEditingEssentialId] = useState(null);
  const [essentialForm, setEssentialForm] = useState({
    title: "",
    subtitle: "",
    image: "",
    route: "/services"
  });

  // Home Renovation State
  const [renovationList, setRenovationList] = useState([
    {
      id: 'renovation-1',
      title: 'Bathroom Renovation',
      image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=400&h=300&fit=crop',
      route: '/services/bathroom-renovation'
    },
    {
      id: 'renovation-2',
      title: 'Painter',
      image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400&h=300&fit=crop',
      route: '/services/painter'
    },
    {
      id: 'renovation-3',
      title: 'Waterproofing',
      image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=300&fit=crop',
      route: '/services/waterproofing'
    },
    {
      id: 'renovation-4',
      title: 'Civil Works',
      image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=300&fit=crop',
      route: '/services/civil_works'
    },
    {
      id: 'renovation-5',
      title: 'Flooring / Tiling',
      image: 'https://images.unsplash.com/photo-1615971677499-5467cbab01c0?w=400&h=300&fit=crop',
      route: '/services/flooring_tiling'
    }
  ]);

  const [editingRenovationId, setEditingRenovationId] = useState(null);
  const [renovationForm, setRenovationForm] = useState({
    title: "",
    image: "",
    route: "/services"
  });

  // Solar & Water Solutions State
  const [solarList, setSolarList] = useState([
    {
      id: 'solar-1',
      title: 'Solar Panels',
      subtitle: 'Installation & Maintenance',
      price: '',
      image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&h=300&fit=crop',
      route: '/services/solar-panel'
    },
    {
      id: 'solar-2',
      title: 'Solar Water Heaters',
      subtitle: 'Eco-friendly heating systems',
      price: '',
      image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=400&h=300&fit=crop',
      route: '/services/solar-water-heater'
    },
    {
      id: 'solar-3',
      title: 'Borewell & Water Pumps',
      subtitle: 'Pumping & drilling services',
      price: '',
      image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=300&fit=crop',
      route: '/services/water-purifier'
    }
  ]);

  const [editingSolarId, setEditingSolarId] = useState(null);
  const [solarForm, setSolarForm] = useState({
    title: "",
    subtitle: "",
    price: "",
    image: "",
    route: "/services"
  });

  useEffect(() => {
    const adminUser = localStorage.getItem("adminUser");
    if (!adminUser) {
      router.push("/admin/login");
      return;
    }

    // Load saved services, offers, hero banners, custom categories, most booked, essential, renovation, solar from localStorage
    try {
      const savedServices = localStorage.getItem("admin_custom_services");
      if (savedServices) {
        setServicesList(JSON.parse(savedServices));
      }
      const savedOffers = localStorage.getItem("partner_offers");
      if (savedOffers) {
        setOffersList(JSON.parse(savedOffers));
      }
      const savedHeroBanners = localStorage.getItem("admin_hero_banners");
      if (savedHeroBanners) {
        setHeroBanners(JSON.parse(savedHeroBanners));
      }
      const savedCatBoxes = localStorage.getItem("admin_custom_categories");
      if (savedCatBoxes) {
        try {
          const parsed = JSON.parse(savedCatBoxes);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const seenLabels = new Set();
            const cleanList = [];
            for (const item of parsed) {
              const normLabel = (item.label || item.name || '').trim().toLowerCase();
              if (normLabel && !seenLabels.has(normLabel)) {
                seenLabels.add(normLabel);
                cleanList.push(item);
              }
            }
            if (cleanList.length > 0) {
              setHeroCategoriesList(cleanList);
              localStorage.setItem('admin_custom_categories', JSON.stringify(cleanList));
            } else {
              localStorage.removeItem('admin_custom_categories');
            }
          }
        } catch (e) {
          console.error(e);
        }
      }
      const savedCatItems = localStorage.getItem("admin_custom_category_items");
      if (savedCatItems) {
        setCustomCatItems(JSON.parse(savedCatItems));
      }
      const savedMostBooked = localStorage.getItem("admin_most_booked_services");
      if (savedMostBooked) {
        setMostBookedList(JSON.parse(savedMostBooked));
      }
      const savedEssential = localStorage.getItem("admin_essential_services");
      if (savedEssential) {
        setEssentialList(JSON.parse(savedEssential));
      }
      const savedRenovation = localStorage.getItem("admin_renovation_services");
      if (savedRenovation) {
        setRenovationList(JSON.parse(savedRenovation));
      }
      const savedSolar = localStorage.getItem("admin_solarwater_services");
      if (savedSolar) {
        setSolarList(JSON.parse(savedSolar));
      }
    } catch (err) {
      console.error("Failed loading stored data:", err);
    }
  }, [router]);

  // Submit Solar & Water Card
  const handleSolarSubmit = (e) => {
    e.preventDefault();
    if (!solarForm.title || !solarForm.subtitle) {
      toast.error("Please enter Title and Subtitle!");
      return;
    }
    const defaultImage = solarForm.image || "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&h=300&fit=crop";

    if (editingSolarId) {
      const updated = solarList.map((item) =>
        item.id === editingSolarId ? { ...item, ...solarForm, image: defaultImage } : item
      );
      setSolarList(updated);
      localStorage.setItem("admin_solarwater_services", JSON.stringify(updated));
      toast.success("Solar & Water card updated!");
    } else {
      const newItem = {
        id: "solar-" + Date.now(),
        ...solarForm,
        image: defaultImage
      };
      const updated = [...solarList, newItem];
      setSolarList(updated);
      localStorage.setItem("admin_solarwater_services", JSON.stringify(updated));
      toast.success("New Solar & Water card added!");
    }

    setEditingSolarId(null);
    setSolarForm({
      title: "",
      subtitle: "",
      price: "",
      image: "",
      route: "/services"
    });
  };

  const handleDeleteSolar = (id) => {
    if (confirm("Remove from Solar & Water Solutions?")) {
      const updated = solarList.filter((item) => item.id !== id);
      setSolarList(updated);
      localStorage.setItem("admin_solarwater_services", JSON.stringify(updated));
      toast.success("Service card removed!");
    }
  };

  // Submit Home Renovation Card
  const handleRenovationSubmit = (e) => {
    e.preventDefault();
    if (!renovationForm.title) {
      toast.error("Please enter Service Title!");
      return;
    }
    const defaultImage = renovationForm.image || "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=300&fit=crop";

    if (editingRenovationId) {
      const updated = renovationList.map((item) =>
        item.id === editingRenovationId ? { ...item, ...renovationForm, image: defaultImage } : item
      );
      setRenovationList(updated);
      localStorage.setItem("admin_renovation_services", JSON.stringify(updated));
      toast.success("Home Renovation card updated!");
    } else {
      const newItem = {
        id: "renovation-" + Date.now(),
        ...renovationForm,
        image: defaultImage
      };
      const updated = [...renovationList, newItem];
      setRenovationList(updated);
      localStorage.setItem("admin_renovation_services", JSON.stringify(updated));
      toast.success("New Home Renovation card added!");
    }

    setEditingRenovationId(null);
    setRenovationForm({
      title: "",
      image: "",
      route: "/services"
    });
  };

  const handleDeleteRenovation = (id) => {
    if (confirm("Remove from Home Renovation?")) {
      const updated = renovationList.filter((item) => item.id !== id);
      setRenovationList(updated);
      localStorage.setItem("admin_renovation_services", JSON.stringify(updated));
      toast.success("Home Renovation service removed!");
    }
  };

  // Submit Essential Service Card
  const handleEssentialSubmit = (e) => {
    e.preventDefault();
    if (!essentialForm.title || !essentialForm.subtitle) {
      toast.error("Please enter Title and Subtitle!");
      return;
    }
    const defaultImage = essentialForm.image || "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=300&fit=crop";

    if (editingEssentialId) {
      const updated = essentialList.map((item) =>
        item.id === editingEssentialId ? { ...item, ...essentialForm, image: defaultImage } : item
      );
      setEssentialList(updated);
      localStorage.setItem("admin_essential_services", JSON.stringify(updated));
      toast.success("Essential Service card updated!");
    } else {
      const newItem = {
        id: "essential-" + Date.now(),
        ...essentialForm,
        image: defaultImage
      };
      const updated = [...essentialList, newItem];
      setEssentialList(updated);
      localStorage.setItem("admin_essential_services", JSON.stringify(updated));
      toast.success("New Essential Service card added!");
    }

    setEditingEssentialId(null);
    setEssentialForm({
      title: "",
      subtitle: "",
      image: "",
      route: "/services"
    });
  };

  const handleDeleteEssential = (id) => {
    if (confirm("Remove from Essential Services?")) {
      const updated = essentialList.filter((item) => item.id !== id);
      setEssentialList(updated);
      localStorage.setItem("admin_essential_services", JSON.stringify(updated));
      toast.success("Essential service removed!");
    }
  };

  // Submit Most Booked Service
  const handleMostBookedSubmit = (e) => {
    e.preventDefault();
    if (!mostBookedForm.title) {
      toast.error("Please enter Service Title!");
      return;
    }
    const defaultImage = mostBookedForm.image || "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=300&fit=crop";
    const computedPriceRange = mostBookedForm.priceRange || (mostBookedForm.price ? `Starts at ₹${mostBookedForm.price}` : "");

    if (editingMostBookedId) {
      const updated = mostBookedList.map((item) =>
        item.id === editingMostBookedId ? { ...item, ...mostBookedForm, priceRange: computedPriceRange, image: defaultImage } : item
      );
      setMostBookedList(updated);
      localStorage.setItem("admin_most_booked_services", JSON.stringify(updated));
      toast.success("Most Booked Service updated!");
    } else {
      const newItem = {
        id: "booked-" + Date.now(),
        ...mostBookedForm,
        priceRange: computedPriceRange,
        image: defaultImage
      };
      const updated = [...mostBookedList, newItem];
      setMostBookedList(updated);
      localStorage.setItem("admin_most_booked_services", JSON.stringify(updated));
      toast.success("New Most Booked Service added!");
    }

    setEditingMostBookedId(null);
    setMostBookedForm({
      title: "",
      price: "",
      priceRange: "",
      image: "",
      route: "/services"
    });
  };

  const handleDeleteMostBooked = (id) => {
    if (confirm("Remove from Most Booked Services?")) {
      const updated = mostBookedList.filter((item) => item.id !== id);
      setMostBookedList(updated);
      localStorage.setItem("admin_most_booked_services", JSON.stringify(updated));
      toast.success("Item removed!");
    }
  };

  // Editing Category Box State
  const [editingCatBoxKey, setEditingCatBoxKey] = useState(null);
  const [catBoxEditForm, setCatBoxEditForm] = useState({
    label: "",
    key: "",
    image: ""
  });

  // Add Category Box to Homepage Grid
  const handleAddCategoryBox = (e) => {
    e.preventDefault();
    if (!newCatBoxForm.label) {
      toast.error("Please enter Category Title/Label!");
      return;
    }
    const catKey = newCatBoxForm.key || newCatBoxForm.label.toLowerCase().replace(/[^a-z0-9]/g, "-");
    const defaultImage = newCatBoxForm.image || "/categories/cleaning.png";
    const newBox = {
      key: catKey,
      label: newCatBoxForm.label,
      image: defaultImage
    };
    const updated = [...heroCategoriesList, newBox];
    setHeroCategoriesList(updated);
    localStorage.setItem("admin_custom_categories", JSON.stringify(updated));
    if (typeof window !== 'undefined') window.dispatchEvent(new Event("admin-categories-updated"));
    toast.success(`Category "${newCatBoxForm.label}" added to Homepage Grid!`);
    setNewCatBoxForm({ label: "", key: "", image: "" });
  };

  // Delete Category Box from Homepage Grid
  const handleDeleteCategoryBox = (keyToDelete) => {
    if (confirm("Are you sure you want to delete this category box from the homepage grid?")) {
      const updated = heroCategoriesList.filter((c) => c.key !== keyToDelete);
      setHeroCategoriesList(updated);
      localStorage.setItem("admin_custom_categories", JSON.stringify(updated));
      if (typeof window !== 'undefined') window.dispatchEvent(new Event("admin-categories-updated"));
      toast.success("Category box deleted from Homepage Grid!");
      if (editingCatBoxKey === keyToDelete) {
        setEditingCatBoxKey(null);
      }
    }
  };

  // Start Editing Category Box
  const handleStartEditCatBox = (cat) => {
    setEditingCatBoxKey(cat.key);
    setCatBoxEditForm({
      label: cat.label || "",
      key: cat.key || "",
      image: cat.image || ""
    });
  };

  // Update Category Box
  const handleUpdateCategoryBox = (e) => {
    e.preventDefault();
    if (!catBoxEditForm.label) {
      toast.error("Please enter Category Title!");
      return;
    }
    const updated = heroCategoriesList.map((c) => {
      if (c.key === editingCatBoxKey) {
        return {
          ...c,
          label: catBoxEditForm.label,
          image: catBoxEditForm.image || c.image,
          key: catBoxEditForm.key || c.key
        };
      }
      return c;
    });
    setHeroCategoriesList(updated);
    localStorage.setItem("admin_custom_categories", JSON.stringify(updated));
    if (typeof window !== 'undefined') window.dispatchEvent(new Event("admin-categories-updated"));
    toast.success("Category box updated successfully!");
    setEditingCatBoxKey(null);
  };

  // Add Product / Service inside Category Modal
  const handleAddCategoryItem = (e) => {
    e.preventDefault();
    if (!catItemForm.name || !catItemForm.categoryKey) {
      toast.error("Please enter Product Name and select Category!");
      return;
    }
    const targetKey = catItemForm.categoryKey;
    const existing = customCatItems[targetKey] || [];
    const newItem = {
      name: catItemForm.name,
      badge: catItemForm.badge || "45 mins",
      icon: catItemForm.icon || "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=200&h=200&fit=crop",
      route: catItemForm.route || "/services",
      price: catItemForm.price ? Number(catItemForm.price) : undefined
    };
    const updatedMap = {
      ...customCatItems,
      [targetKey]: [newItem, ...existing]
    };
    setCustomCatItems(updatedMap);
    localStorage.setItem("admin_custom_category_items", JSON.stringify(updatedMap));
    if (typeof window !== 'undefined') window.dispatchEvent(new Event("admin-categories-updated"));
    toast.success(`Product "${catItemForm.name}" added inside category popup!`);
    setCatItemForm({
      categoryKey: targetKey,
      name: "",
      price: "",
      badge: "45 mins",
      icon: "",
      route: "/services"
    });
  };

  // Delete Sub-item inside Category Modal
  const handleDeleteCatItem = (catKey, itemIndex) => {
    const existing = customCatItems[catKey] || [];
    const updatedItems = existing.filter((_, idx) => idx !== itemIndex);
    const updatedMap = {
      ...customCatItems,
      [catKey]: updatedItems
    };
    setCustomCatItems(updatedMap);
    localStorage.setItem("admin_custom_category_items", JSON.stringify(updatedMap));
    if (typeof window !== 'undefined') window.dispatchEvent(new Event("admin-categories-updated"));
    toast.success("Item deleted from category popup!");
  };

  // Save Services helper
  const saveServicesToStorage = (list) => {
    setServicesList(list);
    localStorage.setItem("admin_custom_services", JSON.stringify(list));
  };

  // Save Offers helper
  const saveOffersToStorage = (list) => {
    setOffersList(list);
    localStorage.setItem("partner_offers", JSON.stringify(list));
  };

  // Image Upload handler (converts file to base64 URL)
  const handleImageUpload = (e, formSetter) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      formSetter((prev) => ({ ...prev, image: reader.result }));
      toast.info("Image uploaded successfully!");
    };
    reader.readAsDataURL(file);
  };

  // Submit Service Add/Edit
  const handleServiceSubmit = (e) => {
    e.preventDefault();
    if (!serviceForm.name || !serviceForm.price) {
      toast.error("Please provide Service Name and Price!");
      return;
    }

    const defaultImage = serviceForm.image || "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=300&fit=crop&q=80";

    if (editingServiceId) {
      const updated = servicesList.map((s) =>
        s.id === editingServiceId ? { ...s, ...serviceForm, image: defaultImage, price: Number(serviceForm.price) } : s
      );
      saveServicesToStorage(updated);
      toast.success("Service updated successfully!");
    } else {
      const newService = {
        id: "srv-" + Date.now(),
        ...serviceForm,
        price: Number(serviceForm.price),
        image: defaultImage,
        status: "Active"
      };
      const updated = [newService, ...servicesList];
      saveServicesToStorage(updated);
      toast.success("New service added successfully!");
    }

    setEditingServiceId(null);
    setServiceForm({
      name: "",
      category: "Furniture Assembly",
      subcategory: "Wardrobes",
      price: "",
      duration: "45 mins",
      badge: "NEW",
      image: "",
      rating: "4.85",
      reviews: "100 reviews"
    });
  };

  // Delete Service
  const handleDeleteService = (id) => {
    if (confirm("Are you sure you want to delete this service?")) {
      const updated = servicesList.filter((s) => s.id !== id);
      saveServicesToStorage(updated);
      toast.success("Service deleted.");
    }
  };

  // Edit Service setup
  const handleEditService = (service) => {
    setEditingServiceId(service.id);
    setServiceForm({
      name: service.name,
      category: service.category,
      subcategory: service.subcategory || "General",
      price: service.price,
      duration: service.duration || "30 mins",
      badge: service.badge || "FEATURED",
      image: service.image || "",
      rating: service.rating || "4.8",
      reviews: service.reviews || "50 reviews"
    });
    window.scrollTo({ top: 300, behavior: "smooth" });
  };

  // Submit Offer Add/Edit
  const handleOfferSubmit = (e) => {
    e.preventDefault();
    if (!offerForm.title || !offerForm.subtitle) {
      toast.error("Please enter Offer Title and Subtitle!");
      return;
    }

    const defaultImage = offerForm.image || "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop";

    if (editingOfferId) {
      const updated = offersList.map((o) =>
        o.id === editingOfferId ? { ...o, ...offerForm, image: defaultImage } : o
      );
      saveOffersToStorage(updated);
      toast.success("Exclusive offer updated!");
    } else {
      const newOffer = {
        id: "offer-" + Date.now(),
        ...offerForm,
        image: defaultImage,
        status: "Live"
      };
      const updated = [newOffer, ...offersList];
      saveOffersToStorage(updated);
      toast.success("New offer added successfully!");
    }

    setEditingOfferId(null);
    setOfferForm({
      title: "",
      subtitle: "",
      badge: "SPECIAL",
      bgColor: "#E3F2FD",
      textColor: "#1976D2",
      image: "",
      route: "/services"
    });
  };

  // Delete Offer
  const handleDeleteOffer = (id) => {
    if (confirm("Remove this offer banner?")) {
      const updated = offersList.filter((o) => o.id !== id);
      saveOffersToStorage(updated);
      toast.success("Offer banner deleted.");
    }
  };

  // Filtered Services
  const filteredServices = servicesList.filter((s) => {
    const matchesCategory = selectedCategory === "all" || s.category === selectedCategory;
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (s.subcategory && s.subcategory.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className={`dashboard-container ${isSidebarOpen ? "sidebar-open" : ""}`}>
      <ToastContainer position="top-right" theme="dark" />

      <div
        className={`sidebar-overlay ${isSidebarOpen ? "active" : ""}`}
        onClick={() => setIsSidebarOpen(false)}
      ></div>
      <AdminSidebar isOpen={isSidebarOpen} />

      <main className="main-content">
        <AdminHeader />

        <div className="admin-content" style={{ color: "#f8fafc", padding: "10px 0 40px 0" }}>
          
          {/* PAGE HEADER */}
          <div style={{ marginBottom: "20px" }}>
            <h1 style={{ fontSize: "28px", fontWeight: "900", color: "#ffffff", margin: "0 0 6px 0", letterSpacing: "-0.5px" }}>
              Services, Rates & Offer Management
            </h1>
            <p style={{ color: "#94a3b8", fontSize: "14px", margin: 0 }}>
              Control all service prices, photos, category names, discount badges, and exclusive offers live.
            </p>
          </div>

          {/* RESPONSIVE TAB SELECTOR */}
          <div style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "8px",
            background: "#151B28",
            padding: "8px",
            borderRadius: "14px",
            border: "1px solid #1e293b",
            marginBottom: "24px"
          }}>
            <button
              onClick={() => setActiveTab("services")}
              style={{
                padding: "10px 18px",
                background: activeTab === "services" ? "#2563eb" : "#0f172a",
                color: "#ffffff",
                border: activeTab === "services" ? "1px solid #3b82f6" : "1px solid #334155",
                borderRadius: "8px",
                fontWeight: "700",
                fontSize: "13px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}
            >
              <Tag size={16} /> Services & Pricing
            </button>

            <button
              onClick={() => setActiveTab("catgrid")}
              style={{
                padding: "10px 18px",
                background: activeTab === "catgrid" ? "#10b981" : "rgba(16, 185, 129, 0.15)",
                color: activeTab === "catgrid" ? "#ffffff" : "#34d399",
                border: "1px solid #10b981",
                borderRadius: "8px",
                fontWeight: "800",
                fontSize: "13px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                boxShadow: activeTab === "catgrid" ? "0 0 12px rgba(16, 185, 129, 0.4)" : "none"
              }}
            >
              <Plus size={16} /> 🔥 What are you looking for? (Grid & Icons)
            </button>

            <button
              onClick={() => setActiveTab("offers")}
              style={{
                padding: "10px 18px",
                background: activeTab === "offers" ? "#2563eb" : "#0f172a",
                color: "#ffffff",
                border: activeTab === "offers" ? "1px solid #3b82f6" : "1px solid #334155",
                borderRadius: "8px",
                fontWeight: "700",
                fontSize: "13px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}
            >
              <Percent size={16} /> Exclusive Offers
            </button>

            <button
              onClick={() => setActiveTab("hero")}
              style={{
                padding: "10px 18px",
                background: activeTab === "hero" ? "#2563eb" : "#0f172a",
                color: "#ffffff",
                border: activeTab === "hero" ? "1px solid #3b82f6" : "1px solid #334155",
                borderRadius: "8px",
                fontWeight: "700",
                fontSize: "13px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}
            >
              <ImageIcon size={16} /> Homepage Banners
            </button>

            <button
              onClick={() => setActiveTab("mostbooked")}
              style={{
                padding: "10px 18px",
                background: activeTab === "mostbooked" ? "#2563eb" : "#0f172a",
                color: "#ffffff",
                border: activeTab === "mostbooked" ? "1px solid #3b82f6" : "1px solid #334155",
                borderRadius: "8px",
                fontWeight: "700",
                fontSize: "13px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}
            >
              <Check size={16} /> Most Booked Services
            </button>

            <button
              onClick={() => setActiveTab("essential")}
              style={{
                padding: "10px 18px",
                background: activeTab === "essential" ? "#2563eb" : "#0f172a",
                color: "#ffffff",
                border: activeTab === "essential" ? "1px solid #3b82f6" : "1px solid #334155",
                borderRadius: "8px",
                fontWeight: "700",
                fontSize: "13px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}
            >
              <RefreshCw size={16} /> Essential Services
            </button>

            <button
              onClick={() => setActiveTab("renovation")}
              style={{
                padding: "10px 18px",
                background: activeTab === "renovation" ? "#2563eb" : "#0f172a",
                color: "#ffffff",
                border: activeTab === "renovation" ? "1px solid #3b82f6" : "1px solid #334155",
                borderRadius: "8px",
                fontWeight: "700",
                fontSize: "13px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}
            >
              <FolderPlus size={16} /> Home Renovation
            </button>

            <button
              onClick={() => setActiveTab("solar")}
              style={{
                padding: "10px 18px",
                background: activeTab === "solar" ? "#2563eb" : "#0f172a",
                color: "#ffffff",
                border: activeTab === "solar" ? "1px solid #3b82f6" : "1px solid #334155",
                borderRadius: "8px",
                fontWeight: "700",
                fontSize: "13px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}
            >
              <Zap size={16} /> Solar & Water Solutions
            </button>
          </div>

          {/* ==================== TAB 1: SERVICES & PRICING ==================== */}
          {activeTab === "services" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>

              {/* SERVICE FORM (ADD / EDIT) */}
              <div style={{ background: "#151B28", border: "1px solid #1e293b", borderRadius: "18px", padding: "24px", boxShadow: "0 4px 20px rgba(0,0,0,0.3)" }}>
                <h3 style={{ fontSize: "18px", fontWeight: "800", color: "#ffffff", margin: "0 0 20px 0", display: "flex", alignItems: "center", gap: "10px" }}>
                  {editingServiceId ? <Edit2 size={20} color="#3b82f6" /> : <Plus size={20} color="#10b981" />}
                  {editingServiceId ? "Edit Service & Rates" : "Add New Service Item"}
                </h3>

                <form onSubmit={handleServiceSubmit} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "20px" }}>
                  
                  {/* Category */}
                  <div>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#94a3b8", marginBottom: "6px" }}>Category</label>
                    <select
                      value={serviceForm.category}
                      onChange={(e) => setServiceForm({ ...serviceForm, category: e.target.value })}
                      style={{ width: "100%", padding: "12px", background: "#0f172a", border: "1px solid #334155", borderRadius: "10px", color: "#fff", fontSize: "14px" }}
                    >
                      <option value="Furniture Assembly">Furniture Assembly (IKEA)</option>
                      <option value="Electrician">Electrician & Plumber</option>
                      <option value="Carpenter">Carpenter</option>
                      <option value="AC & Appliance Repair">AC & Appliance Repair</option>
                      <option value="Cleaning">Cleaning & Pest Control</option>
                      <option value="Women's Beauty">Women's Salon & Spa</option>
                      <option value="Men's Grooming">Men's Grooming</option>
                    </select>
                  </div>

                  {/* Subcategory */}
                  <div>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#94a3b8", marginBottom: "6px" }}>Subcategory / Section</label>
                    <input
                      type="text"
                      placeholder="e.g. Wardrobes, Tables & drawers, Switch & socket"
                      value={serviceForm.subcategory}
                      onChange={(e) => setServiceForm({ ...serviceForm, subcategory: e.target.value })}
                      style={{ width: "100%", padding: "12px", background: "#0f172a", border: "1px solid #334155", borderRadius: "10px", color: "#fff", fontSize: "14px" }}
                    />
                  </div>

                  {/* Service Name */}
                  <div style={{ gridColumn: "span 2" }}>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#94a3b8", marginBottom: "6px" }}>Service Title / Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. 5 drawer chest assembly, AC Foam Jet Service"
                      value={serviceForm.name}
                      onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })}
                      style={{ width: "100%", padding: "12px", background: "#0f172a", border: "1px solid #334155", borderRadius: "10px", color: "#fff", fontSize: "14px" }}
                      required
                    />
                  </div>

                  {/* Price */}
                  <div>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#94a3b8", marginBottom: "6px" }}>Price (₹) *</label>
                    <input
                      type="number"
                      placeholder="e.g. 799"
                      value={serviceForm.price}
                      onChange={(e) => setServiceForm({ ...serviceForm, price: e.target.value })}
                      style={{ width: "100%", padding: "12px", background: "#0f172a", border: "1px solid #334155", borderRadius: "10px", color: "#fff", fontSize: "14px" }}
                      required
                    />
                  </div>

                  {/* Duration */}
                  <div>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#94a3b8", marginBottom: "6px" }}>Duration</label>
                    <input
                      type="text"
                      placeholder="e.g. 1 hr 30 mins, 45 mins"
                      value={serviceForm.duration}
                      onChange={(e) => setServiceForm({ ...serviceForm, duration: e.target.value })}
                      style={{ width: "100%", padding: "12px", background: "#0f172a", border: "1px solid #334155", borderRadius: "10px", color: "#fff", fontSize: "14px" }}
                    />
                  </div>

                  {/* Badge */}
                  <div>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#94a3b8", marginBottom: "6px" }}>Badge / Offer Tag</label>
                    <input
                      type="text"
                      placeholder="e.g. POPULAR, 10% OFF, HOT DEAL"
                      value={serviceForm.badge}
                      onChange={(e) => setServiceForm({ ...serviceForm, badge: e.target.value })}
                      style={{ width: "100%", padding: "12px", background: "#0f172a", border: "1px solid #334155", borderRadius: "10px", color: "#fff", fontSize: "14px" }}
                    />
                  </div>

                  {/* Photo URL & File Upload */}
                  <div style={{ gridColumn: "span 2" }}>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#94a3b8", marginBottom: "6px" }}>Photo (Image URL or Upload)</label>
                    <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                      <input
                        type="text"
                        placeholder="Paste Image URL or choose file →"
                        value={serviceForm.image}
                        onChange={(e) => setServiceForm({ ...serviceForm, image: e.target.value })}
                        style={{ flex: 1, padding: "12px", background: "#0f172a", border: "1px solid #334155", borderRadius: "10px", color: "#fff", fontSize: "14px" }}
                      />
                      <label style={{ padding: "12px 18px", background: "#334155", color: "#fff", borderRadius: "10px", cursor: "pointer", fontWeight: "700", fontSize: "13px", display: "flex", alignItems: "center", gap: "6px" }}>
                        <ImageIcon size={16} /> Choose Photo
                        <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, setServiceForm)} style={{ display: "none" }} />
                      </label>
                    </div>
                  </div>

                  {/* Form Action Buttons */}
                  <div style={{ gridColumn: "span 2", display: "flex", gap: "12px", marginTop: "8px" }}>
                    <button
                      type="submit"
                      style={{
                        padding: "12px 28px",
                        background: "#2563eb",
                        color: "#ffffff",
                        border: "none",
                        borderRadius: "10px",
                        fontWeight: "800",
                        fontSize: "15px",
                        cursor: "pointer",
                        boxShadow: "0 4px 14px rgba(37,99,235,0.4)"
                      }}
                    >
                      {editingServiceId ? "Save Changes" : "Publish Service"}
                    </button>
                    {editingServiceId && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingServiceId(null);
                          setServiceForm({ name: "", category: "Furniture Assembly", subcategory: "Wardrobes", price: "", duration: "45 mins", badge: "NEW", image: "", rating: "4.85", reviews: "100 reviews" });
                        }}
                        style={{ padding: "12px 24px", background: "#334155", color: "#ffffff", border: "none", borderRadius: "10px", fontWeight: "700", cursor: "pointer" }}
                      >
                        Cancel
                      </button>
                    )}
                  </div>

                </form>
              </div>

              {/* SERVICES LIST & FILTER HEADER */}
              <div style={{ background: "#151B28", border: "1px solid #1e293b", borderRadius: "18px", padding: "24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "16px" }}>
                  <h3 style={{ fontSize: "18px", fontWeight: "800", color: "#ffffff", margin: 0 }}>
                    Active Services List ({filteredServices.length})
                  </h3>

                  <div style={{ display: "flex", gap: "12px" }}>
                    {/* Category Filter */}
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      style={{ padding: "10px 14px", background: "#0f172a", border: "1px solid #334155", borderRadius: "10px", color: "#fff", fontSize: "13px" }}
                    >
                      <option value="all">All Categories</option>
                      <option value="Furniture Assembly">Furniture Assembly</option>
                      <option value="Electrician">Electrician</option>
                      <option value="Carpenter">Carpenter</option>
                      <option value="AC & Appliance Repair">AC & Appliance Repair</option>
                      <option value="Cleaning">Cleaning</option>
                    </select>

                    {/* Search Input */}
                    <input
                      type="text"
                      placeholder="Search service name..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      style={{ padding: "10px 14px", background: "#0f172a", border: "1px solid #334155", borderRadius: "10px", color: "#fff", fontSize: "13px", width: "200px" }}
                    />
                  </div>
                </div>

                {/* TABLE OF SERVICES */}
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "14px" }}>
                    <thead>
                      <tr style={{ borderBottom: "1px solid #334155", color: "#94a3b8", fontSize: "12px", textTransform: "uppercase" }}>
                        <th style={{ padding: "12px" }}>Service</th>
                        <th style={{ padding: "12px" }}>Category / Subcategory</th>
                        <th style={{ padding: "12px" }}>Price</th>
                        <th style={{ padding: "12px" }}>Duration</th>
                        <th style={{ padding: "12px" }}>Badge</th>
                        <th style={{ padding: "12px", textAlign: "right" }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredServices.map((service) => (
                        <tr key={service.id} style={{ borderBottom: "1px solid #1e293b", transition: "background 0.2s ease" }}>
                          <td style={{ padding: "12px", display: "flex", alignItems: "center", gap: "12px" }}>
                            <div style={{ width: "48px", height: "48px", borderRadius: "8px", overflow: "hidden", background: "#0f172a", flexShrink: 0 }}>
                              <img src={service.image} alt={service.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            </div>
                            <div>
                              <strong style={{ color: "#ffffff", fontSize: "14px", display: "block" }}>{service.name}</strong>
                              <span style={{ fontSize: "12px", color: "#94a3b8" }}>★ {service.rating} ({service.reviews})</span>
                            </div>
                          </td>

                          <td style={{ padding: "12px" }}>
                            <span style={{ color: "#e2e8f0", fontWeight: "600" }}>{service.category}</span>
                            {service.subcategory && (
                              <span style={{ display: "block", fontSize: "12px", color: "#64748b" }}>{service.subcategory}</span>
                            )}
                          </td>

                          <td style={{ padding: "12px", fontWeight: "800", color: "#10b981", fontSize: "15px" }}>
                            ₹{service.price}
                          </td>

                          <td style={{ padding: "12px", color: "#cbd5e1" }}>
                            {service.duration}
                          </td>

                          <td style={{ padding: "12px" }}>
                            {service.badge ? (
                              <span style={{ fontSize: "11px", fontWeight: "800", color: "#3b82f6", background: "rgba(59,130,246,0.15)", padding: "4px 8px", borderRadius: "6px" }}>
                                {service.badge}
                              </span>
                            ) : (
                              <span style={{ color: "#64748b", fontSize: "12px" }}>—</span>
                            )}
                          </td>

                          <td style={{ padding: "12px", textAlign: "right" }}>
                            <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
                              <button
                                onClick={() => handleEditService(service)}
                                style={{ padding: "6px 12px", background: "#1e293b", border: "1px solid #334155", borderRadius: "6px", color: "#3b82f6", cursor: "pointer", fontWeight: "700", fontSize: "12px" }}
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteService(service.id)}
                                style={{ padding: "6px 12px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "6px", color: "#ef4444", cursor: "pointer", fontWeight: "700", fontSize: "12px" }}
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* ==================== TAB 2: EXCLUSIVE OFFERS & BANNERS ==================== */}
          {activeTab === "offers" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>

              {/* OFFER FORM */}
              <div style={{ background: "#151B28", border: "1px solid #1e293b", borderRadius: "18px", padding: "24px" }}>
                <h3 style={{ fontSize: "18px", fontWeight: "800", color: "#ffffff", margin: "0 0 20px 0", display: "flex", alignItems: "center", gap: "10px" }}>
                  <Percent size={20} color="#f59e0b" />
                  {editingOfferId ? "Edit Exclusive Offer Banner" : "Add New Exclusive Offer Banner"}
                </h3>

                <form onSubmit={handleOfferSubmit} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "20px" }}>
                  
                  {/* Title */}
                  <div>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#94a3b8", marginBottom: "6px" }}>Offer Title *</label>
                    <input
                      type="text"
                      placeholder="e.g. Up to 30% OFF, Special Discount"
                      value={offerForm.title}
                      onChange={(e) => setOfferForm({ ...offerForm, title: e.target.value })}
                      style={{ width: "100%", padding: "12px", background: "#0f172a", border: "1px solid #334155", borderRadius: "10px", color: "#fff", fontSize: "14px" }}
                      required
                    />
                  </div>

                  {/* Subtitle */}
                  <div>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#94a3b8", marginBottom: "6px" }}>Subtitle *</label>
                    <input
                      type="text"
                      placeholder="e.g. AC Service & Repair, Top Electrical Experts"
                      value={offerForm.subtitle}
                      onChange={(e) => setOfferForm({ ...offerForm, subtitle: e.target.value })}
                      style={{ width: "100%", padding: "12px", background: "#0f172a", border: "1px solid #334155", borderRadius: "10px", color: "#fff", fontSize: "14px" }}
                      required
                    />
                  </div>

                  {/* Badge */}
                  <div>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#94a3b8", marginBottom: "6px" }}>Badge Tag</label>
                    <input
                      type="text"
                      placeholder="e.g. HOT DEAL, FLASH SALE, TRENDING"
                      value={offerForm.badge}
                      onChange={(e) => setOfferForm({ ...offerForm, badge: e.target.value })}
                      style={{ width: "100%", padding: "12px", background: "#0f172a", border: "1px solid #334155", borderRadius: "10px", color: "#fff", fontSize: "14px" }}
                    />
                  </div>

                  {/* Banner Photo Upload */}
                  <div style={{ gridColumn: "span 2" }}>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#94a3b8", marginBottom: "6px" }}>Banner Photo</label>
                    <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                      <input
                        type="text"
                        placeholder="Paste Image URL or upload →"
                        value={offerForm.image}
                        onChange={(e) => setOfferForm({ ...offerForm, image: e.target.value })}
                        style={{ flex: 1, padding: "12px", background: "#0f172a", border: "1px solid #334155", borderRadius: "10px", color: "#fff", fontSize: "14px" }}
                      />
                      <label style={{ padding: "12px 18px", background: "#334155", color: "#fff", borderRadius: "10px", cursor: "pointer", fontWeight: "700", fontSize: "13px" }}>
                        Upload Photo
                        <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, setOfferForm)} style={{ display: "none" }} />
                      </label>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div style={{ gridColumn: "span 2", display: "flex", gap: "12px", marginTop: "8px" }}>
                    <button
                      type="submit"
                      style={{ padding: "12px 28px", background: "#f59e0b", color: "#000000", border: "none", borderRadius: "10px", fontWeight: "900", fontSize: "15px", cursor: "pointer" }}
                    >
                      {editingOfferId ? "Update Offer Banner" : "Publish Offer Banner"}
                    </button>
                    {editingOfferId && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingOfferId(null);
                          setOfferForm({ title: "", subtitle: "", badge: "SPECIAL", bgColor: "#E3F2FD", textColor: "#1976D2", image: "", route: "/services" });
                        }}
                        style={{ padding: "12px 24px", background: "#334155", color: "#ffffff", border: "none", borderRadius: "10px", fontWeight: "700", cursor: "pointer" }}
                      >
                        Cancel
                      </button>
                    )}
                  </div>

                </form>
              </div>

              {/* OFFERS GRID */}
              <div style={{ background: "#151B28", border: "1px solid #1e293b", borderRadius: "18px", padding: "24px" }}>
                <h3 style={{ fontSize: "18px", fontWeight: "800", color: "#ffffff", margin: "0 0 20px 0" }}>
                  Active Offer Banners ({offersList.length})
                </h3>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
                  {offersList.map((offer) => (
                    <div key={offer.id} style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: "14px", overflow: "hidden", display: "flex", flexDirection: "column" }}>
                      <div style={{ position: "relative", height: "130px" }}>
                        <img src={offer.image} alt={offer.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        <span style={{ position: "absolute", top: "10px", left: "10px", background: "#ef4444", color: "#fff", fontSize: "10px", fontWeight: "800", padding: "4px 8px", borderRadius: "12px" }}>
                          {offer.badge}
                        </span>
                      </div>
                      <div style={{ padding: "16px", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                        <div>
                          <h4 style={{ margin: "0 0 4px 0", color: "#fff", fontSize: "16px", fontWeight: "800" }}>{offer.title}</h4>
                          <p style={{ margin: "0 0 12px 0", color: "#94a3b8", fontSize: "13px" }}>{offer.subtitle}</p>
                        </div>
                        <div style={{ display: "flex", gap: "8px" }}>
                          <button
                            onClick={() => {
                              setEditingOfferId(offer.id);
                              setOfferForm({ title: offer.title, subtitle: offer.subtitle, badge: offer.badge || "HOT DEAL", bgColor: offer.bgColor || "#E8F5E9", textColor: offer.textColor || "#388E3C", image: offer.image || "", route: offer.route || "/services" });
                            }}
                            style={{ flex: 1, padding: "8px", background: "#1e293b", border: "1px solid #334155", color: "#3b82f6", borderRadius: "8px", fontWeight: "700", cursor: "pointer", fontSize: "13px" }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteOffer(offer.id)}
                            style={{ padding: "8px 14px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#ef4444", borderRadius: "8px", fontWeight: "700", cursor: "pointer", fontSize: "13px" }}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* ==================== TAB 3: HOMEPAGE HERO BANNERS & IMAGES ==================== */}
          {activeTab === "hero" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
              <div style={{ background: "#151B28", border: "1px solid #1e293b", borderRadius: "18px", padding: "24px" }}>
                <h3 style={{ fontSize: "18px", fontWeight: "800", color: "#ffffff", margin: "0 0 8px 0", display: "flex", alignItems: "center", gap: "10px" }}>
                  <ImageIcon size={20} color="#3b82f6" />
                  Homepage Hero Banners & Slider Manager
                </h3>
                <p style={{ color: "#94a3b8", fontSize: "14px", margin: "0 0 24px 0" }}>
                  Change the main promotional banner photo, title, badge, and the two bottom worker/service images on the homepage hero section.
                </p>

                <form onSubmit={(e) => {
                  e.preventDefault();
                  localStorage.setItem("admin_hero_banners", JSON.stringify(heroBanners));
                  toast.success("Homepage Hero Banners updated & published live!");
                }} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

                  {/* 1. TOP MAIN PROMO BANNER */}
                  <div style={{ background: "#0f172a", padding: "20px", borderRadius: "14px", border: "1px solid #1e293b" }}>
                    <h4 style={{ color: "#3b82f6", fontSize: "16px", fontWeight: "800", margin: "0 0 16px 0" }}>
                      1. Top Main Promotional Banner
                    </h4>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px" }}>
                      <div>
                        <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#94a3b8", marginBottom: "6px" }}>Main Title Text</label>
                        <input
                          type="text"
                          value={heroBanners.mainBanner.title}
                          onChange={(e) => setHeroBanners({
                            ...heroBanners,
                            mainBanner: { ...heroBanners.mainBanner, title: e.target.value }
                          })}
                          style={{ width: "100%", padding: "10px", background: "#151B28", border: "1px solid #334155", borderRadius: "8px", color: "#fff", fontSize: "14px" }}
                          placeholder="e.g. HOME CLEANING"
                        />
                      </div>

                      <div>
                        <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#94a3b8", marginBottom: "6px" }}>Badge Tag (Top Left)</label>
                        <input
                          type="text"
                          value={heroBanners.mainBanner.badge}
                          onChange={(e) => setHeroBanners({
                            ...heroBanners,
                            mainBanner: { ...heroBanners.mainBanner, badge: e.target.value }
                          })}
                          style={{ width: "100%", padding: "15px", background: "#151B28", border: "1px solid #334155", borderRadius: "8px", color: "#fff", fontSize: "14px" }}
                          placeholder="e.g. Flash Sale, 40% OFF"
                        />
                      </div>

                      <div>
                        <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#94a3b8", marginBottom: "6px" }}>Subtitle</label>
                        <input
                          type="text"
                          value={heroBanners.mainBanner.subtitle}
                          onChange={(e) => setHeroBanners({
                            ...heroBanners,
                            mainBanner: { ...heroBanners.mainBanner, subtitle: e.target.value }
                          })}
                          style={{ width: "100%", padding: "10px", background: "#151B28", border: "1px solid #334155", borderRadius: "8px", color: "#fff", fontSize: "14px" }}
                          placeholder="e.g. Natural, Premium"
                        />
                      </div>

                      <div>
                        <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#94a3b8", marginBottom: "6px" }}>Offer Description</label>
                        <input
                          type="text"
                          value={heroBanners.mainBanner.offer}
                          onChange={(e) => setHeroBanners({
                            ...heroBanners,
                            mainBanner: { ...heroBanners.mainBanner, offer: e.target.value }
                          })}
                          style={{ width: "100%", padding: "10px", background: "#151B28", border: "1px solid #334155", borderRadius: "8px", color: "#fff", fontSize: "14px" }}
                          placeholder="e.g. Up to 40% OFF on Deep Cleaning"
                        />
                      </div>

                      <div style={{ gridColumn: "span 2" }}>
                        <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#94a3b8", marginBottom: "6px" }}>Banner Photo (Image URL or Upload)</label>
                        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                          <input
                            type="text"
                            value={heroBanners.mainBanner.image}
                            onChange={(e) => setHeroBanners({
                              ...heroBanners,
                              mainBanner: { ...heroBanners.mainBanner, image: e.target.value }
                            })}
                            style={{ flex: 1, padding: "10px", background: "#151B28", border: "1px solid #334155", borderRadius: "8px", color: "#fff", fontSize: "14px" }}
                            placeholder="Paste Image URL or choose file →"
                          />
                          <label style={{ padding: "10px 16px", background: "#334155", color: "#fff", borderRadius: "8px", cursor: "pointer", fontWeight: "700", fontSize: "13px" }}>
                            Upload Photo
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  setHeroBanners(prev => ({
                                    ...prev,
                                    mainBanner: { ...prev.mainBanner, image: reader.result }
                                  }));
                                  toast.info("Top banner photo loaded!");
                                };
                                reader.readAsDataURL(file);
                              }}
                              style={{ display: "none" }}
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 2. BOTTOM LEFT GRID IMAGE */}
                  <div style={{ background: "#0f172a", padding: "20px", borderRadius: "14px", border: "1px solid #1e293b" }}>
                    <h4 style={{ color: "#10b981", fontSize: "16px", fontWeight: "800", margin: "0 0 16px 0" }}>
                      2. Bottom Left Grid Image (Plumber / Service Expert)
                    </h4>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px" }}>
                      <div style={{ gridColumn: "span 2" }}>
                        <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#94a3b8", marginBottom: "6px" }}>Image URL or Upload</label>
                        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                          <input
                            type="text"
                            value={heroBanners.grid1.image}
                            onChange={(e) => setHeroBanners({
                              ...heroBanners,
                              grid1: { ...heroBanners.grid1, image: e.target.value }
                            })}
                            style={{ flex: 1, padding: "10px", background: "#151B28", border: "1px solid #334155", borderRadius: "8px", color: "#fff", fontSize: "14px" }}
                            placeholder="Paste Image URL or choose file →"
                          />
                          <label style={{ padding: "10px 16px", background: "#334155", color: "#fff", borderRadius: "8px", cursor: "pointer", fontWeight: "700", fontSize: "13px" }}>
                            Upload Photo
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  setHeroBanners(prev => ({
                                    ...prev,
                                    grid1: { ...prev.grid1, image: reader.result }
                                  }));
                                  toast.info("Bottom left photo loaded!");
                                };
                                reader.readAsDataURL(file);
                              }}
                              style={{ display: "none" }}
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 3. BOTTOM RIGHT GRID IMAGE */}
                  <div style={{ background: "#0f172a", padding: "20px", borderRadius: "14px", border: "1px solid #1e293b" }}>
                    <h4 style={{ color: "#f59e0b", fontSize: "16px", fontWeight: "800", margin: "0 0 16px 0" }}>
                      3. Bottom Right Grid Image (Electrician / Specialist)
                    </h4>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px" }}>
                      <div style={{ gridColumn: "span 2" }}>
                        <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#94a3b8", marginBottom: "6px" }}>Image URL or Upload</label>
                        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                          <input
                            type="text"
                            value={heroBanners.grid2.image}
                            onChange={(e) => setHeroBanners({
                              ...heroBanners,
                              grid2: { ...heroBanners.grid2, image: e.target.value }
                            })}
                            style={{ flex: 1, padding: "10px", background: "#151B28", border: "1px solid #334155", borderRadius: "8px", color: "#fff", fontSize: "14px" }}
                            placeholder="Paste Image URL or choose file →"
                          />
                          <label style={{ padding: "10px 16px", background: "#334155", color: "#fff", borderRadius: "8px", cursor: "pointer", fontWeight: "700", fontSize: "13px" }}>
                            Upload Photo
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  setHeroBanners(prev => ({
                                    ...prev,
                                    grid2: { ...prev.grid2, image: reader.result }
                                  }));
                                  toast.info("Bottom right photo loaded!");
                                };
                                reader.readAsDataURL(file);
                              }}
                              style={{ display: "none" }}
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* SAVE ALL BANNERS BUTTON */}
                  <div>
                    <button
                      type="submit"
                      style={{
                        padding: "14px 32px",
                        background: "#2563eb",
                        color: "#ffffff",
                        border: "none",
                        borderRadius: "10px",
                        fontWeight: "900",
                        fontSize: "16px",
                        cursor: "pointer",
                        boxShadow: "0 4px 16px rgba(37,99,235,0.4)"
                      }}
                    >
                      Save & Publish Homepage Banners
                    </button>
                  </div>

                </form>
              </div>
            </div>
          )}

          {/* ==================== TAB 4: CATEGORY GRID & PRODUCTS MANAGER ==================== */}
          {activeTab === "catgrid" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
              
              {/* SECTION A: ADD NEW CATEGORY BOX TO HOMEPAGE GRID */}
              <div style={{ background: "#151B28", border: "1px solid #1e293b", borderRadius: "18px", padding: "24px" }}>
                <h3 style={{ fontSize: "18px", fontWeight: "800", color: "#ffffff", margin: "0 0 8px 0", display: "flex", alignItems: "center", gap: "10px" }}>
                  <Plus size={20} color="#10b981" />
                  Add New Category Box to Homepage Grid
                </h3>
                <p style={{ color: "#94a3b8", fontSize: "14px", margin: "0 0 20px 0" }}>
                  Add a new service category box (e.g. Painting, Pest Control, Appliance Service) to the homepage hero grid.
                </p>

                <form onSubmit={handleAddCategoryBox} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "20px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#94a3b8", marginBottom: "6px" }}>Category Title / Label *</label>
                    <input
                      type="text"
                      placeholder="e.g. Painting & Waterproofing"
                      value={newCatBoxForm.label}
                      onChange={(e) => setNewCatBoxForm({ ...newCatBoxForm, label: e.target.value })}
                      style={{ width: "100%", padding: "12px", background: "#0f172a", border: "1px solid #334155", borderRadius: "10px", color: "#fff", fontSize: "14px" }}
                      required
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#94a3b8", marginBottom: "6px" }}>Category Key (Unique ID)</label>
                    <input
                      type="text"
                      placeholder="e.g. painting (optional)"
                      value={newCatBoxForm.key}
                      onChange={(e) => setNewCatBoxForm({ ...newCatBoxForm, key: e.target.value })}
                      style={{ width: "100%", padding: "12px", background: "#0f172a", border: "1px solid #334155", borderRadius: "10px", color: "#fff", fontSize: "14px" }}
                    />
                  </div>

                  <div style={{ gridColumn: "span 2" }}>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#94a3b8", marginBottom: "6px" }}>Category Icon / Photo</label>
                    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                      <input
                        type="text"
                        placeholder="Paste Image URL or choose photo →"
                        value={newCatBoxForm.image}
                        onChange={(e) => setNewCatBoxForm({ ...newCatBoxForm, image: e.target.value })}
                        style={{ flex: 1, padding: "12px", background: "#0f172a", border: "1px solid #334155", borderRadius: "10px", color: "#fff", fontSize: "14px" }}
                      />
                      <label style={{ padding: "12px 18px", background: "#334155", color: "#fff", borderRadius: "10px", cursor: "pointer", fontWeight: "700", fontSize: "13px" }}>
                        Upload Photo
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, setNewCatBoxForm)}
                          style={{ display: "none" }}
                        />
                      </label>
                    </div>
                  </div>

                  <div style={{ gridColumn: "span 2" }}>
                    <button
                      type="submit"
                      style={{ padding: "12px 28px", background: "#10b981", color: "#ffffff", border: "none", borderRadius: "10px", fontWeight: "800", fontSize: "15px", cursor: "pointer" }}
                    >
                      Add Category to Homepage
                    </button>
                  </div>
                </form>
              </div>

              {/* SECTION B: ADD PRODUCTS & PRICES INSIDE ANY CATEGORY POPUP MODAL */}
              <div style={{ background: "#151B28", border: "1px solid #1e293b", borderRadius: "18px", padding: "24px" }}>
                <h3 style={{ fontSize: "18px", fontWeight: "800", color: "#ffffff", margin: "0 0 8px 0", display: "flex", alignItems: "center", gap: "10px" }}>
                  <Tag size={20} color="#3b82f6" />
                  Add Products, Services & Prices inside Category Popups
                </h3>
                <p style={{ color: "#94a3b8", fontSize: "14px", margin: "0 0 20px 0" }}>
                  Select a category box and add sub-products/services, prices (₹), badges, photos, and links inside its popup window.
                </p>

                <form onSubmit={handleAddCategoryItem} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "20px" }}>
                  
                  {/* Category Target */}
                  <div>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#94a3b8", marginBottom: "6px" }}>Select Target Category *</label>
                    <select
                      value={catItemForm.categoryKey}
                      onChange={(e) => setCatItemForm({ ...catItemForm, categoryKey: e.target.value })}
                      style={{ width: "100%", padding: "12px", background: "#0f172a", border: "1px solid #334155", borderRadius: "10px", color: "#fff", fontSize: "14px" }}
                    >
                      {heroCategoriesList.map((c) => (
                        <option key={c.key} value={c.key}>{c.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Product Name */}
                  <div>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#94a3b8", marginBottom: "6px" }}>Product / Service Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. Split AC Installation, Full Wall Paint"
                      value={catItemForm.name}
                      onChange={(e) => setCatItemForm({ ...catItemForm, name: e.target.value })}
                      style={{ width: "100%", padding: "12px", background: "#0f172a", border: "1px solid #334155", borderRadius: "10px", color: "#fff", fontSize: "14px" }}
                      required
                    />
                  </div>

                  {/* Price */}
                  <div>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#94a3b8", marginBottom: "6px" }}>Price (₹)</label>
                    <input
                      type="number"
                      placeholder="e.g. 599 (optional)"
                      value={catItemForm.price}
                      onChange={(e) => setCatItemForm({ ...catItemForm, price: e.target.value })}
                      style={{ width: "100%", padding: "12px", background: "#0f172a", border: "1px solid #334155", borderRadius: "10px", color: "#fff", fontSize: "14px" }}
                    />
                  </div>

                  {/* Badge */}
                  <div>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#94a3b8", marginBottom: "6px" }}>Badge Tag / Duration</label>
                    <input
                      type="text"
                      placeholder="e.g. 45 mins, POPULAR, HOT"
                      value={catItemForm.badge}
                      onChange={(e) => setCatItemForm({ ...catItemForm, badge: e.target.value })}
                      style={{ width: "100%", padding: "12px", background: "#0f172a", border: "1px solid #334155", borderRadius: "10px", color: "#fff", fontSize: "14px" }}
                    />
                  </div>

                  {/* Icon / Photo */}
                  <div style={{ gridColumn: "span 2" }}>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#94a3b8", marginBottom: "6px" }}>Product Icon / Photo</label>
                    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                      <input
                        type="text"
                        placeholder="Paste Image URL or choose photo →"
                        value={catItemForm.icon}
                        onChange={(e) => setCatItemForm({ ...catItemForm, icon: e.target.value })}
                        style={{ flex: 1, padding: "12px", background: "#0f172a", border: "1px solid #334155", borderRadius: "10px", color: "#fff", fontSize: "14px" }}
                      />
                      <label style={{ padding: "12px 18px", background: "#334155", color: "#fff", borderRadius: "10px", cursor: "pointer", fontWeight: "700", fontSize: "13px" }}>
                        Upload Photo
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, setCatItemForm)}
                          style={{ display: "none" }}
                        />
                      </label>
                    </div>
                  </div>

                  {/* Target Route */}
                  <div style={{ gridColumn: "span 2" }}>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#94a3b8", marginBottom: "6px" }}>Destination Route / Link</label>
                    <input
                      type="text"
                      placeholder="e.g. /ac-repair or /services/full-home-cleaning"
                      value={catItemForm.route}
                      onChange={(e) => setCatItemForm({ ...catItemForm, route: e.target.value })}
                      style={{ width: "100%", padding: "12px", background: "#0f172a", border: "1px solid #334155", borderRadius: "10px", color: "#fff", fontSize: "14px" }}
                    />
                  </div>

                  <div style={{ gridColumn: "span 2" }}>
                    <button
                      type="submit"
                      style={{ padding: "12px 28px", background: "#2563eb", color: "#ffffff", border: "none", borderRadius: "10px", fontWeight: "800", fontSize: "15px", cursor: "pointer" }}
                    >
                      Add Product to Selected Category
                    </button>
                  </div>

                </form>
              </div>

              {/* CURRENT HOMEPAGE CATEGORY GRID PREVIEW & MANAGEMENT */}
              <div style={{ background: "#151B28", border: "1px solid #1e293b", borderRadius: "18px", padding: "24px" }}>
                <h3 style={{ fontSize: "18px", fontWeight: "800", color: "#ffffff", margin: "0 0 8px 0" }}>
                  Current Homepage Category Boxes ({heroCategoriesList.length})
                </h3>
                <p style={{ color: "#94a3b8", fontSize: "14px", margin: "0 0 20px 0" }}>
                  Manage, edit, or delete any category box shown under "What are you looking for?" on the homepage.
                </p>

                {/* EDIT CATEGORY BOX INLINE FORM */}
                {editingCatBoxKey && (
                  <div style={{ background: "#0f172a", border: "1px solid #2563eb", borderRadius: "14px", padding: "20px", marginBottom: "20px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                      <h4 style={{ color: "#3b82f6", fontSize: "16px", fontWeight: "800", margin: 0 }}>
                        Edit Category Box: {catBoxEditForm.label}
                      </h4>
                      <button onClick={() => setEditingCatBoxKey(null)} style={{ background: "transparent", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: "18px" }}>×</button>
                    </div>
                    <form onSubmit={handleUpdateCategoryBox} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "14px" }}>
                      <div>
                        <label style={{ display: "block", fontSize: "12px", color: "#94a3b8", marginBottom: "4px" }}>Title / Label</label>
                        <input
                          type="text"
                          value={catBoxEditForm.label}
                          onChange={(e) => setCatBoxEditForm({ ...catBoxEditForm, label: e.target.value })}
                          style={{ width: "100%", padding: "10px", background: "#151B28", border: "1px solid #334155", borderRadius: "8px", color: "#fff", fontSize: "13px" }}
                          required
                        />
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: "12px", color: "#94a3b8", marginBottom: "4px" }}>Category Key (Unique ID)</label>
                        <input
                          type="text"
                          value={catBoxEditForm.key}
                          onChange={(e) => setCatBoxEditForm({ ...catBoxEditForm, key: e.target.value })}
                          style={{ width: "100%", padding: "10px", background: "#151B28", border: "1px solid #334155", borderRadius: "8px", color: "#fff", fontSize: "13px" }}
                        />
                      </div>
                      <div style={{ gridColumn: "span 2" }}>
                        <label style={{ display: "block", fontSize: "12px", color: "#94a3b8", marginBottom: "4px" }}>Icon / Photo URL or Upload</label>
                        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                          <input
                            type="text"
                            value={catBoxEditForm.image}
                            onChange={(e) => setCatBoxEditForm({ ...catBoxEditForm, image: e.target.value })}
                            style={{ flex: 1, padding: "10px", background: "#151B28", border: "1px solid #334155", borderRadius: "8px", color: "#fff", fontSize: "13px" }}
                          />
                          <label style={{ padding: "10px 14px", background: "#334155", color: "#fff", borderRadius: "8px", cursor: "pointer", fontWeight: "700", fontSize: "12px" }}>
                            Upload
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleImageUpload(e, setCatBoxEditForm)}
                              style={{ display: "none" }}
                            />
                          </label>
                        </div>
                      </div>
                      <div style={{ gridColumn: "span 2", display: "flex", gap: "10px" }}>
                        <button type="submit" style={{ padding: "10px 20px", background: "#2563eb", color: "#fff", border: "none", borderRadius: "8px", fontWeight: "800", cursor: "pointer" }}>
                          Save Box Changes
                        </button>
                        <button type="button" onClick={() => setEditingCatBoxKey(null)} style={{ padding: "10px 16px", background: "#334155", color: "#fff", border: "none", borderRadius: "8px", fontWeight: "700", cursor: "pointer" }}>
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
                  {heroCategoriesList.map((cat, idx) => {
                    const items = customCatItems[cat.key] || [];
                    const isImg = cat.image && (cat.image.startsWith('/') || cat.image.startsWith('http') || cat.image.startsWith('data:'));
                    return (
                      <div key={cat.key || idx} style={{ background: "#0f172a", border: "1px solid #334155", borderRadius: "12px", padding: "16px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                            <div style={{ width: "48px", height: "48px", flexShrink: 0, borderRadius: "10px", overflow: "hidden", background: "#151B28", display: "flex", alignItems: "center", justifyContent: "center" }}>
                              {isImg ? (
                                <img src={cat.image} alt={cat.label} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                              ) : (
                                <span style={{ fontSize: "1.5rem" }}>{cat.image || '⚡'}</span>
                              )}
                            </div>
                            <div>
                              <strong style={{ color: "#fff", fontSize: "14px", display: "block" }}>{cat.label}</strong>
                              <span style={{ fontSize: "11px", color: "#64748b" }}>Key: {cat.key}</span>
                            </div>
                          </div>

                          {/* Sub-items count & list */}
                          <div style={{ marginBottom: "12px", background: "#151B28", padding: "8px 10px", borderRadius: "8px" }}>
                            <span style={{ fontSize: "11px", fontWeight: "700", color: "#94a3b8", display: "block", marginBottom: "4px" }}>
                              Sub-items ({items.length})
                            </span>
                            {items.length === 0 ? (
                              <span style={{ fontSize: "11px", color: "#475569", fontStyle: "italic" }}>No sub-items added yet</span>
                            ) : (
                              <div style={{ display: "flex", flexDirection: "column", gap: "4px", maxHeight: "100px", overflowY: "auto" }}>
                                {items.map((it, iIdx) => (
                                  <div key={iIdx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "11px", color: "#cbd5e1" }}>
                                    <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "130px" }}>• {it.name}</span>
                                    <button
                                      onClick={() => handleDeleteCatItem(cat.key, iIdx)}
                                      style={{ background: "transparent", border: "none", color: "#ef4444", cursor: "pointer", fontSize: "12px", fontWeight: "700" }}
                                      title="Remove item"
                                    >
                                      ×
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Action buttons for Category Box */}
                        <div style={{ display: "flex", gap: "8px", borderTop: "1px solid #1e293b", paddingTop: "10px" }}>
                          <button
                            onClick={() => handleStartEditCatBox(cat)}
                            style={{ flex: 1, padding: "6px 10px", background: "#1e293b", border: "1px solid #334155", color: "#3b82f6", borderRadius: "6px", cursor: "pointer", fontWeight: "700", fontSize: "12px" }}
                          >
                            Edit Box
                          </button>
                          <button
                            onClick={() => handleDeleteCategoryBox(cat.key)}
                            style={{ padding: "6px 10px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#ef4444", borderRadius: "6px", cursor: "pointer", fontWeight: "700", fontSize: "12px" }}
                            title="Delete category box"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

          {/* ==================== TAB 5: MOST BOOKED SERVICES MANAGER ==================== */}
          {activeTab === "mostbooked" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
              
              {/* FORM */}
              <div style={{ background: "#151B28", border: "1px solid #1e293b", borderRadius: "18px", padding: "24px" }}>
                <h3 style={{ fontSize: "18px", fontWeight: "800", color: "#ffffff", margin: "0 0 8px 0", display: "flex", alignItems: "center", gap: "10px" }}>
                  {editingMostBookedId ? <Edit2 size={20} color="#3b82f6" /> : <Plus size={20} color="#10b981" />}
                  {editingMostBookedId ? "Edit Most Booked Service Card" : "Add New Most Booked Service Card"}
                </h3>
                <p style={{ color: "#94a3b8", fontSize: "14px", margin: "0 0 20px 0" }}>
                  Add or edit items shown under "Most Booked Services" on the homepage with custom photos, titles, starting prices, and links.
                </p>

                <form onSubmit={handleMostBookedSubmit} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "20px" }}>
                  
                  {/* Service Title */}
                  <div>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#94a3b8", marginBottom: "6px" }}>Service Title *</label>
                    <input
                      type="text"
                      placeholder="e.g. AC Gas Refilling, Bathroom Deep Cleaning"
                      value={mostBookedForm.title}
                      onChange={(e) => setMostBookedForm({ ...mostBookedForm, title: e.target.value })}
                      style={{ width: "100%", padding: "12px", background: "#0f172a", border: "1px solid #334155", borderRadius: "10px", color: "#fff", fontSize: "14px" }}
                      required
                    />
                  </div>

                  {/* Starting Price */}
                  <div>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#94a3b8", marginBottom: "6px" }}>Price (₹)</label>
                    <input
                      type="number"
                      placeholder="e.g. 1299"
                      value={mostBookedForm.price}
                      onChange={(e) => setMostBookedForm({ ...mostBookedForm, price: e.target.value })}
                      style={{ width: "100%", padding: "12px", background: "#0f172a", border: "1px solid #334155", borderRadius: "10px", color: "#fff", fontSize: "14px" }}
                    />
                  </div>

                  {/* Custom Price Text */}
                  <div>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#94a3b8", marginBottom: "6px" }}>Custom Price Text (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. Starts at ₹1,299"
                      value={mostBookedForm.priceRange}
                      onChange={(e) => setMostBookedForm({ ...mostBookedForm, priceRange: e.target.value })}
                      style={{ width: "100%", padding: "12px", background: "#0f172a", border: "1px solid #334155", borderRadius: "10px", color: "#fff", fontSize: "14px" }}
                    />
                  </div>

                  {/* Destination Route */}
                  <div>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#94a3b8", marginBottom: "6px" }}>Destination Route / Link</label>
                    <input
                      type="text"
                      placeholder="e.g. /ac-repair or /electrician"
                      value={mostBookedForm.route}
                      onChange={(e) => setMostBookedForm({ ...mostBookedForm, route: e.target.value })}
                      style={{ width: "100%", padding: "12px", background: "#0f172a", border: "1px solid #334155", borderRadius: "10px", color: "#fff", fontSize: "14px" }}
                    />
                  </div>

                  {/* Photo / Image */}
                  <div style={{ gridColumn: "span 2" }}>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#94a3b8", marginBottom: "6px" }}>Photo (Image URL or Upload)</label>
                    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                      <input
                        type="text"
                        placeholder="Paste Image URL or choose photo →"
                        value={mostBookedForm.image}
                        onChange={(e) => setMostBookedForm({ ...mostBookedForm, image: e.target.value })}
                        style={{ flex: 1, padding: "12px", background: "#0f172a", border: "1px solid #334155", borderRadius: "10px", color: "#fff", fontSize: "14px" }}
                      />
                      <label style={{ padding: "12px 18px", background: "#334155", color: "#fff", borderRadius: "10px", cursor: "pointer", fontWeight: "700", fontSize: "13px" }}>
                        Upload Photo
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, setMostBookedForm)}
                          style={{ display: "none" }}
                        />
                      </label>
                    </div>
                  </div>

                  {/* Form Action Buttons */}
                  <div style={{ gridColumn: "span 2", display: "flex", gap: "12px", marginTop: "8px" }}>
                    <button
                      type="submit"
                      style={{ padding: "12px 28px", background: "#2563eb", color: "#ffffff", border: "none", borderRadius: "10px", fontWeight: "800", fontSize: "15px", cursor: "pointer" }}
                    >
                      {editingMostBookedId ? "Save Changes" : "Publish Most Booked Card"}
                    </button>
                    {editingMostBookedId && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingMostBookedId(null);
                          setMostBookedForm({ title: "", price: "", priceRange: "", image: "", route: "/services" });
                        }}
                        style={{ padding: "12px 24px", background: "#334155", color: "#ffffff", border: "none", borderRadius: "10px", fontWeight: "700", cursor: "pointer" }}
                      >
                        Cancel
                      </button>
                    )}
                  </div>

                </form>
              </div>

              {/* CARDS LIST */}
              <div style={{ background: "#151B28", border: "1px solid #1e293b", borderRadius: "18px", padding: "24px" }}>
                <h3 style={{ fontSize: "18px", fontWeight: "800", color: "#ffffff", margin: "0 0 20px 0" }}>
                  Active Most Booked Cards ({mostBookedList.length})
                </h3>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px" }}>
                  {mostBookedList.map((item) => (
                    <div key={item.id} style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: "14px", overflow: "hidden", display: "flex", flexDirection: "column" }}>
                      <div style={{ position: "relative", height: "140px" }}>
                        <img src={item.image} alt={item.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      </div>
                      <div style={{ padding: "16px", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                        <div>
                          <h4 style={{ margin: "0 0 4px 0", color: "#fff", fontSize: "15px", fontWeight: "800" }}>{item.title}</h4>
                          <p style={{ margin: "0 0 12px 0", color: "#10b981", fontSize: "13px", fontWeight: "700" }}>
                            {item.priceRange || (item.price ? `Starts at ₹${item.price}` : "")}
                          </p>
                        </div>
                        <div style={{ display: "flex", gap: "8px" }}>
                          <button
                            onClick={() => {
                              setEditingMostBookedId(item.id);
                              setMostBookedForm({ title: item.title, price: item.price || "", priceRange: item.priceRange || "", image: item.image || "", route: item.route || "/services" });
                            }}
                            style={{ flex: 1, padding: "8px", background: "#1e293b", border: "1px solid #334155", color: "#3b82f6", borderRadius: "8px", fontWeight: "700", cursor: "pointer", fontSize: "13px" }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteMostBooked(item.id)}
                            style={{ padding: "8px 14px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#ef4444", borderRadius: "8px", fontWeight: "700", cursor: "pointer", fontSize: "13px" }}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* ==================== TAB 6: ESSENTIAL SERVICES MANAGER ==================== */}
          {activeTab === "essential" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
              
              {/* FORM */}
              <div style={{ background: "#151B28", border: "1px solid #1e293b", borderRadius: "18px", padding: "24px" }}>
                <h3 style={{ fontSize: "18px", fontWeight: "800", color: "#ffffff", margin: "0 0 8px 0", display: "flex", alignItems: "center", gap: "10px" }}>
                  {editingEssentialId ? <Edit2 size={20} color="#3b82f6" /> : <Plus size={20} color="#10b981" />}
                  {editingEssentialId ? "Edit Essential Service Card" : "Add New Essential Service Card"}
                </h3>
                <p style={{ color: "#94a3b8", fontSize: "14px", margin: "0 0 20px 0" }}>
                  Add or edit items shown under "Essential Services" (Refrigerator, Geyser, RO Purifier, Gas Stove) on the homepage.
                </p>

                <form onSubmit={handleEssentialSubmit} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "20px" }}>
                  
                  {/* Service Title */}
                  <div>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#94a3b8", marginBottom: "6px" }}>Service Title *</label>
                    <input
                      type="text"
                      placeholder="e.g. Refrigerator, Geyser, RO Water Purifier"
                      value={essentialForm.title}
                      onChange={(e) => setEssentialForm({ ...essentialForm, title: e.target.value })}
                      style={{ width: "100%", padding: "12px", background: "#0f172a", border: "1px solid #334155", borderRadius: "10px", color: "#fff", fontSize: "14px" }}
                      required
                    />
                  </div>

                  {/* Subtitle */}
                  <div>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#94a3b8", marginBottom: "6px" }}>Subtitle *</label>
                    <input
                      type="text"
                      placeholder="e.g. Repair & Gas refill, Service & Installation"
                      value={essentialForm.subtitle}
                      onChange={(e) => setEssentialForm({ ...essentialForm, subtitle: e.target.value })}
                      style={{ width: "100%", padding: "12px", background: "#0f172a", border: "1px solid #334155", borderRadius: "10px", color: "#fff", fontSize: "14px" }}
                      required
                    />
                  </div>

                  {/* Destination Route */}
                  <div style={{ gridColumn: "span 2" }}>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#94a3b8", marginBottom: "6px" }}>Destination Route / Link</label>
                    <input
                      type="text"
                      placeholder="e.g. /refrigerator or /geyser or /water-purifier"
                      value={essentialForm.route}
                      onChange={(e) => setEssentialForm({ ...essentialForm, route: e.target.value })}
                      style={{ width: "100%", padding: "12px", background: "#0f172a", border: "1px solid #334155", borderRadius: "10px", color: "#fff", fontSize: "14px" }}
                    />
                  </div>

                  {/* Photo / Image */}
                  <div style={{ gridColumn: "span 2" }}>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#94a3b8", marginBottom: "6px" }}>Photo (Image URL or Upload)</label>
                    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                      <input
                        type="text"
                        placeholder="Paste Image URL or choose photo →"
                        value={essentialForm.image}
                        onChange={(e) => setEssentialForm({ ...essentialForm, image: e.target.value })}
                        style={{ flex: 1, padding: "12px", background: "#0f172a", border: "1px solid #334155", borderRadius: "10px", color: "#fff", fontSize: "14px" }}
                      />
                      <label style={{ padding: "12px 18px", background: "#334155", color: "#fff", borderRadius: "10px", cursor: "pointer", fontWeight: "700", fontSize: "13px" }}>
                        Upload Photo
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, setEssentialForm)}
                          style={{ display: "none" }}
                        />
                      </label>
                    </div>
                  </div>

                  {/* Form Action Buttons */}
                  <div style={{ gridColumn: "span 2", display: "flex", gap: "12px", marginTop: "8px" }}>
                    <button
                      type="submit"
                      style={{ padding: "12px 28px", background: "#2563eb", color: "#ffffff", border: "none", borderRadius: "10px", fontWeight: "800", fontSize: "15px", cursor: "pointer" }}
                    >
                      {editingEssentialId ? "Save Changes" : "Publish Essential Card"}
                    </button>
                    {editingEssentialId && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingEssentialId(null);
                          setEssentialForm({ title: "", subtitle: "", image: "", route: "/services" });
                        }}
                        style={{ padding: "12px 24px", background: "#334155", color: "#ffffff", border: "none", borderRadius: "10px", fontWeight: "700", cursor: "pointer" }}
                      >
                        Cancel
                      </button>
                    )}
                  </div>

                </form>
              </div>

              {/* CARDS LIST */}
              <div style={{ background: "#151B28", border: "1px solid #1e293b", borderRadius: "18px", padding: "24px" }}>
                <h3 style={{ fontSize: "18px", fontWeight: "800", color: "#ffffff", margin: "0 0 20px 0" }}>
                  Active Essential Services Cards ({essentialList.length})
                </h3>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px" }}>
                  {essentialList.map((item) => (
                    <div key={item.id} style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: "14px", overflow: "hidden", display: "flex", flexDirection: "column" }}>
                      <div style={{ position: "relative", height: "140px" }}>
                        <img src={item.image} alt={item.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      </div>
                      <div style={{ padding: "16px", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                        <div>
                          <h4 style={{ margin: "0 0 4px 0", color: "#fff", fontSize: "15px", fontWeight: "800" }}>{item.title}</h4>
                          <p style={{ margin: "0 0 12px 0", color: "#94a3b8", fontSize: "13px" }}>
                            {item.subtitle}
                          </p>
                        </div>
                        <div style={{ display: "flex", gap: "8px" }}>
                          <button
                            onClick={() => {
                              setEditingEssentialId(item.id);
                              setEssentialForm({ title: item.title, subtitle: item.subtitle || "", image: item.image || "", route: item.route || "/services" });
                            }}
                            style={{ flex: 1, padding: "8px", background: "#1e293b", border: "1px solid #334155", color: "#3b82f6", borderRadius: "8px", fontWeight: "700", cursor: "pointer", fontSize: "13px" }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteEssential(item.id)}
                            style={{ padding: "8px 14px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#ef4444", borderRadius: "8px", fontWeight: "700", cursor: "pointer", fontSize: "13px" }}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* ==================== TAB 7: HOME RENOVATION MANAGER ==================== */}
          {activeTab === "renovation" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
              
              {/* FORM */}
              <div style={{ background: "#151B28", border: "1px solid #1e293b", borderRadius: "18px", padding: "24px" }}>
                <h3 style={{ fontSize: "18px", fontWeight: "800", color: "#ffffff", margin: "0 0 8px 0", display: "flex", alignItems: "center", gap: "10px" }}>
                  {editingRenovationId ? <Edit2 size={20} color="#3b82f6" /> : <Plus size={20} color="#10b981" />}
                  {editingRenovationId ? "Edit Home Renovation Card" : "Add New Home Renovation Card"}
                </h3>
                <p style={{ color: "#94a3b8", fontSize: "14px", margin: "0 0 20px 0" }}>
                  Add or edit items shown under "Home Renovation" (Bathroom Renovation, Painter, Waterproofing, Civil Works, Flooring) on the homepage.
                </p>

                <form onSubmit={handleRenovationSubmit} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "20px" }}>
                  
                  {/* Service Title */}
                  <div>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#94a3b8", marginBottom: "6px" }}>Service Title *</label>
                    <input
                      type="text"
                      placeholder="e.g. Bathroom Renovation, Painter, Waterproofing"
                      value={renovationForm.title}
                      onChange={(e) => setRenovationForm({ ...renovationForm, title: e.target.value })}
                      style={{ width: "100%", padding: "12px", background: "#0f172a", border: "1px solid #334155", borderRadius: "10px", color: "#fff", fontSize: "14px" }}
                      required
                    />
                  </div>

                  {/* Destination Route */}
                  <div>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#94a3b8", marginBottom: "6px" }}>Destination Route / Link</label>
                    <input
                      type="text"
                      placeholder="e.g. /services/painter or /services/bathroom-renovation"
                      value={renovationForm.route}
                      onChange={(e) => setRenovationForm({ ...renovationForm, route: e.target.value })}
                      style={{ width: "100%", padding: "12px", background: "#0f172a", border: "1px solid #334155", borderRadius: "10px", color: "#fff", fontSize: "14px" }}
                    />
                  </div>

                  {/* Photo / Image */}
                  <div style={{ gridColumn: "span 2" }}>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#94a3b8", marginBottom: "6px" }}>Photo (Image URL or Upload)</label>
                    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                      <input
                        type="text"
                        placeholder="Paste Image URL or choose photo →"
                        value={renovationForm.image}
                        onChange={(e) => setRenovationForm({ ...renovationForm, image: e.target.value })}
                        style={{ flex: 1, padding: "12px", background: "#0f172a", border: "1px solid #334155", borderRadius: "10px", color: "#fff", fontSize: "14px" }}
                      />
                      <label style={{ padding: "12px 18px", background: "#334155", color: "#fff", borderRadius: "10px", cursor: "pointer", fontWeight: "700", fontSize: "13px" }}>
                        Upload Photo
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, setRenovationForm)}
                          style={{ display: "none" }}
                        />
                      </label>
                    </div>
                  </div>

                  {/* Form Action Buttons */}
                  <div style={{ gridColumn: "span 2", display: "flex", gap: "12px", marginTop: "8px" }}>
                    <button
                      type="submit"
                      style={{ padding: "12px 28px", background: "#2563eb", color: "#ffffff", border: "none", borderRadius: "10px", fontWeight: "800", fontSize: "15px", cursor: "pointer" }}
                    >
                      {editingRenovationId ? "Save Changes" : "Publish Renovation Card"}
                    </button>
                    {editingRenovationId && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingRenovationId(null);
                          setRenovationForm({ title: "", image: "", route: "/services" });
                        }}
                        style={{ padding: "12px 24px", background: "#334155", color: "#ffffff", border: "none", borderRadius: "10px", fontWeight: "700", cursor: "pointer" }}
                      >
                        Cancel
                      </button>
                    )}
                  </div>

                </form>
              </div>

              {/* CARDS LIST */}
              <div style={{ background: "#151B28", border: "1px solid #1e293b", borderRadius: "18px", padding: "24px" }}>
                <h3 style={{ fontSize: "18px", fontWeight: "800", color: "#ffffff", margin: "0 0 20px 0" }}>
                  Active Home Renovation Cards ({renovationList.length})
                </h3>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px" }}>
                  {renovationList.map((item) => (
                    <div key={item.id} style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: "14px", overflow: "hidden", display: "flex", flexDirection: "column" }}>
                      <div style={{ position: "relative", height: "140px" }}>
                        <img src={item.image} alt={item.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      </div>
                      <div style={{ padding: "16px", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                        <div>
                          <h4 style={{ margin: "0 0 12px 0", color: "#fff", fontSize: "15px", fontWeight: "800" }}>{item.title}</h4>
                        </div>
                        <div style={{ display: "flex", gap: "8px" }}>
                          <button
                            onClick={() => {
                              setEditingRenovationId(item.id);
                              setRenovationForm({ title: item.title, image: item.image || "", route: item.route || "/services" });
                            }}
                            style={{ flex: 1, padding: "8px", background: "#1e293b", border: "1px solid #334155", color: "#3b82f6", borderRadius: "8px", fontWeight: "700", cursor: "pointer", fontSize: "13px" }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteRenovation(item.id)}
                            style={{ padding: "8px 14px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#ef4444", borderRadius: "8px", fontWeight: "700", cursor: "pointer", fontSize: "13px" }}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* ==================== TAB 8: SOLAR & WATER SOLUTIONS MANAGER ==================== */}
          {activeTab === "solar" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
              
              {/* FORM */}
              <div style={{ background: "#151B28", border: "1px solid #1e293b", borderRadius: "18px", padding: "24px" }}>
                <h3 style={{ fontSize: "18px", fontWeight: "800", color: "#ffffff", margin: "0 0 8px 0", display: "flex", alignItems: "center", gap: "10px" }}>
                  {editingSolarId ? <Edit2 size={20} color="#3b82f6" /> : <Plus size={20} color="#10b981" />}
                  {editingSolarId ? "Edit Solar & Water Card" : "Add New Solar & Water Card"}
                </h3>
                <p style={{ color: "#94a3b8", fontSize: "14px", margin: "0 0 20px 0" }}>
                  Add or edit items shown under "Solar & Water Solutions" (Solar Panels, Solar Water Heaters, Borewell & Water Pumps) on the homepage.
                </p>

                <form onSubmit={handleSolarSubmit} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "20px" }}>
                  
                  {/* Service Title */}
                  <div>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#94a3b8", marginBottom: "6px" }}>Service Title *</label>
                    <input
                      type="text"
                      placeholder="e.g. Solar Panels, Solar Water Heaters, Borewell Pumps"
                      value={solarForm.title}
                      onChange={(e) => setSolarForm({ ...solarForm, title: e.target.value })}
                      style={{ width: "100%", padding: "12px", background: "#0f172a", border: "1px solid #334155", borderRadius: "10px", color: "#fff", fontSize: "14px" }}
                      required
                    />
                  </div>

                  {/* Subtitle */}
                  <div>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#94a3b8", marginBottom: "6px" }}>Subtitle *</label>
                    <input
                      type="text"
                      placeholder="e.g. Installation & Maintenance, Pumping & drilling"
                      value={solarForm.subtitle}
                      onChange={(e) => setSolarForm({ ...solarForm, subtitle: e.target.value })}
                      style={{ width: "100%", padding: "12px", background: "#0f172a", border: "1px solid #334155", borderRadius: "10px", color: "#fff", fontSize: "14px" }}
                      required
                    />
                  </div>

                  {/* Starting Price (Optional) */}
                  <div>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#94a3b8", marginBottom: "6px" }}>Starting Price (₹, Optional)</label>
                    <input
                      type="number"
                      placeholder="e.g. 4999"
                      value={solarForm.price}
                      onChange={(e) => setSolarForm({ ...solarForm, price: e.target.value })}
                      style={{ width: "100%", padding: "12px", background: "#0f172a", border: "1px solid #334155", borderRadius: "10px", color: "#fff", fontSize: "14px" }}
                    />
                  </div>

                  {/* Destination Route */}
                  <div>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#94a3b8", marginBottom: "6px" }}>Destination Route / Link</label>
                    <input
                      type="text"
                      placeholder="e.g. /services/solar-panel or /services/water-purifier"
                      value={solarForm.route}
                      onChange={(e) => setSolarForm({ ...solarForm, route: e.target.value })}
                      style={{ width: "100%", padding: "12px", background: "#0f172a", border: "1px solid #334155", borderRadius: "10px", color: "#fff", fontSize: "14px" }}
                    />
                  </div>

                  {/* Photo / Image */}
                  <div style={{ gridColumn: "span 2" }}>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#94a3b8", marginBottom: "6px" }}>Photo (Image URL or Upload)</label>
                    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                      <input
                        type="text"
                        placeholder="Paste Image URL or choose photo →"
                        value={solarForm.image}
                        onChange={(e) => setSolarForm({ ...solarForm, image: e.target.value })}
                        style={{ flex: 1, padding: "12px", background: "#0f172a", border: "1px solid #334155", borderRadius: "10px", color: "#fff", fontSize: "14px" }}
                      />
                      <label style={{ padding: "12px 18px", background: "#334155", color: "#fff", borderRadius: "10px", cursor: "pointer", fontWeight: "700", fontSize: "13px" }}>
                        Upload Photo
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, setSolarForm)}
                          style={{ display: "none" }}
                        />
                      </label>
                    </div>
                  </div>

                  {/* Form Action Buttons */}
                  <div style={{ gridColumn: "span 2", display: "flex", gap: "12px", marginTop: "8px" }}>
                    <button
                      type="submit"
                      style={{ padding: "12px 28px", background: "#2563eb", color: "#ffffff", border: "none", borderRadius: "10px", fontWeight: "800", fontSize: "15px", cursor: "pointer" }}
                    >
                      {editingSolarId ? "Save Changes" : "Publish Solar & Water Card"}
                    </button>
                    {editingSolarId && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingSolarId(null);
                          setSolarForm({ title: "", subtitle: "", price: "", image: "", route: "/services" });
                        }}
                        style={{ padding: "12px 24px", background: "#334155", color: "#ffffff", border: "none", borderRadius: "10px", fontWeight: "700", cursor: "pointer" }}
                      >
                        Cancel
                      </button>
                    )}
                  </div>

                </form>
              </div>

              {/* CARDS LIST */}
              <div style={{ background: "#151B28", border: "1px solid #1e293b", borderRadius: "18px", padding: "24px" }}>
                <h3 style={{ fontSize: "18px", fontWeight: "800", color: "#ffffff", margin: "0 0 20px 0" }}>
                  Active Solar & Water Cards ({solarList.length})
                </h3>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px" }}>
                  {solarList.map((item) => (
                    <div key={item.id} style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: "14px", overflow: "hidden", display: "flex", flexDirection: "column" }}>
                      <div style={{ position: "relative", height: "140px" }}>
                        <img src={item.image} alt={item.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      </div>
                      <div style={{ padding: "16px", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                        <div>
                          <h4 style={{ margin: "0 0 4px 0", color: "#fff", fontSize: "15px", fontWeight: "800" }}>{item.title}</h4>
                          <p style={{ margin: "0 0 12px 0", color: "#94a3b8", fontSize: "13px" }}>
                            {item.subtitle}
                          </p>
                          {item.price && (
                            <p style={{ margin: "0 0 12px 0", color: "#10b981", fontSize: "13px", fontWeight: "700" }}>
                              Starts at ₹{item.price}
                            </p>
                          )}
                        </div>
                        <div style={{ display: "flex", gap: "8px" }}>
                          <button
                            onClick={() => {
                              setEditingSolarId(item.id);
                              setSolarForm({ title: item.title, subtitle: item.subtitle || "", price: item.price || "", image: item.image || "", route: item.route || "/services" });
                            }}
                            style={{ flex: 1, padding: "8px", background: "#1e293b", border: "1px solid #334155", color: "#3b82f6", borderRadius: "8px", fontWeight: "700", cursor: "pointer", fontSize: "13px" }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteSolar(item.id)}
                            style={{ padding: "8px 14px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#ef4444", borderRadius: "8px", fontWeight: "700", cursor: "pointer", fontSize: "13px" }}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

        </div>
      </main>
    </div>
  );
}
