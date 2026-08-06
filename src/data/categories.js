export const categories = {
    ac: {
        name: "AC & Appliance Repair",
        sections: [
            {
                title: "Large appliances",
                items: [
                    { name: "AC", badge: "48 mins", icon: "/ac-repair.png", route: "/ac-repair" },
                    { name: "Washing Machine", badge: "44 mins", icon: "/washing-machine-repair.png", route: "/washing-machine" },
                    { name: "Refrigerator", badge: "44 mins", icon: "/refrigerator-repair.png", route: "/refrigerator" },
                    { name: "Television", badge: "55 mins", icon: "/tv-repair.png", route: "/television" }
                ]
            },
            {
                title: "Other appliances",
                items: [
                    { name: "Chimney", icon: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=200&h=200&fit=crop&q=80", route: "/chimney" },
                    { name: "Microwave", icon: "/microwave-repair.png", route: "/microwave" },
                    { name: "Stove", icon: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=200&h=200&fit=crop&q=80", route: "/stove" },
                    { name: "Laptop", icon: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=200&h=200&fit=crop&q=80", route: "/laptop" },
                    { name: "RO/Water Purifier", icon: "https://images.unsplash.com/photo-1548839140-29a749e1cf4e?w=200&h=200&fit=crop&q=80", route: "/water-purifier" },
                    { name: "Geyser", icon: "https://images.unsplash.com/photo-1585074245728-eee2d5040d7c?w=200&h=200&fit=crop&q=80", route: "/geyser" },
                    { name: "Air Cooler", icon: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=200&h=200&fit=crop&q=80", route: "/air-cooler" }
                ]
            }
        ],
        subcategories: [
            { name: "AC Service & Repair", icon: "/ac-repair.png", route: "/ac-repair" },
            { name: "Refrigerator Repair", icon: "/refrigerator-repair.png", route: "/refrigerator" },
            { name: "Washing Machine Repair", icon: "/washing-machine-repair.png", route: "/washing-machine" },
            { name: "Microwave Repair", icon: "/microwave-repair.png", route: "/microwave" },
            { name: "TV Repair", icon: "/tv-repair.png", route: "/television" }
        ]
    },
    electrician: {
        name: "Electrician, Plumber & Carpenter",
        sections: [
            {
                title: "Repairs",
                items: [
                    { name: "Electrician", icon: "/electrician.png", route: "/electrician" },
                    { name: "Plumber", icon: "/plumber.png", route: "/plumber" },
                    { name: "Carpenter", icon: "/carpenter.png", route: "/carpenter" },
                    { name: "Festival Lights Installation", icon: "https://images.unsplash.com/photo-1510074377623-8cf13fb86c08?w=300&h=300&fit=crop&q=80", route: "/festival-lights" }
                ]
            },
            {
                title: "Installations & other services",
                items: [
                    { name: "Fan Installation", icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Ventilatore_a_soffitto_%283%29.png/330px-Ventilatore_a_soffitto_%283%29.png", route: "/services/fan-installation" },
                    { name: "Furniture Assembly", icon: "https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=300&h=300&fit=crop&q=80", route: "/services/furniture-assembly" },
                    { name: "Geyser Service & Repair", icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Active_Indirect_Water_Heater_Diagram.svg/330px-Active_Indirect_Water_Heater_Diagram.svg.png", route: "/services/geyser-repair" },
                    { name: "IKEA Furniture", icon: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300&h=300&fit=crop&q=80", route: "/services/ikea-furniture" }
                ]
            }
        ],
        subcategories: [
            { name: "Electrician", icon: "/electrician.png", route: "/electrician" },
            { name: "Plumber", icon: "/plumber.png", route: "/plumber" },
            { name: "Carpenter", icon: "/carpenter.png", route: "/carpenter" },
            { name: "Festival Lights Installation", icon: "https://images.unsplash.com/photo-1510074377623-8cf13fb86c08?w=300&h=300&fit=crop&q=80", route: "/festival-lights" },
            { name: "Painter", icon: "/painter.png", route: "/services/painter" },
            { name: "Mason", icon: "/painter.png", route: "/services/mason" }
        ]
    },
    cleaning: {
        name: "Cleaning & Pest Control",
        sections: [
            {
                title: "Cleaning",
                items: [
                    { name: "Bathroom Cleaning", icon: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=300&h=300&fit=crop&q=80", route: "/services/bathroom-cleaning" },
                    { name: "Kitchen Cleaning", icon: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=300&h=300&fit=crop&q=80", route: "/services/kitchen-cleaning" },
                    { name: "Living & Bedroom Cleaning", icon: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=300&h=300&fit=crop&q=80", route: "/services/living-cleaning" },
                    { name: "Full Home/ By Room Cleaning", icon: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=300&h=300&fit=crop&q=80", route: "/services/full-home-cleaning" }
                ]
            },
            {
                title: "Pest Control",
                items: [
                    { name: "Cockroach Control", icon: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=300&h=300&fit=crop&q=80", route: "/services/cockroach-control" },
                    { name: "Termite Control", icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Coptotermes_formosanus_shiraki_USGov_k8204-7.jpg/330px-Coptotermes_formosanus_shiraki_USGov_k8204-7.jpg", route: "/services/termite-control" },
                    { name: "Ants & Bed Bugs", icon: "https://images.unsplash.com/photo-1471879832106-c7ab9e0cee23?w=300&h=300&fit=crop&q=80", route: "/services/bed-bugs" }
                ]
            }
        ],
        subcategories: [
             { name: "Bathroom Cleaning", icon: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=300&h=300&fit=crop&q=80", route: "/services/bathroom-cleaning" },
             { name: "Kitchen Cleaning", icon: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=300&h=300&fit=crop&q=80", route: "/services/kitchen-cleaning" },
             { name: "Living & Bedroom Cleaning", icon: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=300&h=300&fit=crop&q=80", route: "/services/living-cleaning" },
             { name: "Full Home/ By Room Cleaning", icon: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=300&h=300&fit=crop&q=80", route: "/services/full-home-cleaning" },
             { name: "Cockroach Control", icon: "https://images.unsplash.com/photo-1620216503932-52077e3c15d5?w=300&h=300&fit=crop&q=80", route: "/services/cockroach-control" },
             { name: "Termite Control", icon: "https://images.unsplash.com/photo-1585074245728-eee2d5040d7c?w=300&h=300&fit=crop&q=80", route: "/services/termite-control" },
             { name: "Ants & Bed Bugs", icon: "https://images.unsplash.com/photo-1585074245728-eee2d5040d7c?w=300&h=300&fit=crop&q=80", route: "/services/bed-bugs" }
        ]
    },
    renovation: {
        name: "Home Renovation & Interior",
        subcategories: [
            { name: "Interior Design", icon: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=500&auto=format&fit=crop&q=80", route: "/services/interior-design" },
            { name: "Home Renovation", icon: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=500&auto=format&fit=crop&q=80", route: "/services/home-renovation" },
            { name: "Modular Kitchen", icon: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500&auto=format&fit=crop&q=80", route: "/services/modular-kitchen" },
            { name: "Wallpaper", icon: "https://images.unsplash.com/photo-1585128792020-803d29415281?w=500&auto=format&fit=crop&q=80", route: "/services/wallpaper" },
            { name: "Flooring", icon: "/flooring.png", route: "/services/flooring" }
        ]
    },
    fabrication: {
        name: "Fabrication, Grills & Roofing",
        subcategories: [
            { name: "Metal Fabrication", icon: "/metal-fabrication.png", route: "/services/metal-fabrication" },
            { name: "Window Grills", icon: "/window-grills.png", route: "/services/window-grills" },
            { name: "Roofing", icon: "/roofing-work.png", route: "/services/roofing" },
            { name: "Gate Installation", icon: "/gate-installation.png", route: "/services/gate-installation" },
            { name: "Railing Work", icon: "/railing-work.png", route: "/services/railing" }
        ]
    },
    beauty: {
        name: "Women's Salon & Spa",
        subcategories: [
            { name: "Salon for Women", icon: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=300&h=300&fit=crop&q=80", route: "/services/salon-at-home" },
            { name: "Spa for Women", icon: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=300&h=300&fit=crop&q=80", route: "/services/spa-services" },
            { name: "Hair Studio for Women", icon: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=300&h=300&fit=crop&q=80", route: "/services/hair-styling" },
            { name: "Makeup, Saree & Styling", icon: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300&h=300&fit=crop&q=80", route: "/services/bridal-makeup" }
        ]
    },
    grooming: {
        name: "Men's Salon & Massage",
        subcategories: [
            { 
                name: "Salon for Men", 
                icon: "/categories/grooming.png", 
                route: "/services/salon-for-men",
                preferences: [
                    {
                        name: "Luxe",
                        image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=300&h=300&fit=crop&q=80",
                        tags: ["INOA", "REPÊCHAGE", "O3+"],
                        route: "/services/salon-royale"
                    },
                    {
                        name: "Prime",
                        image: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=300&h=300&fit=crop&q=80",
                        subtitle: "Arriving in 47 mins",
                        tags: ["L'ORÉAL", "BOMBAY SHAVING COMPANY"],
                        route: "/services/salon-prime"
                    }
                ]
            },
            { 
                name: "Massage for Men", 
                icon: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=300&h=300&fit=crop&q=80", 
                route: "/services/men-massage", 
                badge: "44 mins",
                bannerImage: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&auto=format&fit=crop&q=80",
                preferences: [
                    {
                        name: "Prime",
                        image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=300&h=300&fit=crop&q=80",
                        subtitle: "Arriving in 44 mins",
                        tags: ["Certified therapists & essential oils"],
                        route: "/services/men-massage"
                    }
                ]
            }
        ]
    },
    homecare: {
        name: "Home Care, Support & Logistics",
        subcategories: [
            { name: "Packers & Movers", icon: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500&auto=format&fit=crop&q=80", route: "/services/packers-movers" },
            { name: "Home Nursing", icon: "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=500&auto=format&fit=crop&q=80", route: "/services/home-nursing" },
            { name: "Elderly Care", icon: "https://images.unsplash.com/photo-1521790797524-b2497295b8a0?w=500&auto=format&fit=crop&q=80", route: "/services/elderly-care" },
            { name: "Baby Care", icon: "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=500&auto=format&fit=crop&q=80", route: "/services/baby-care" },
            { name: "Laundry Services", icon: "https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=500&auto=format&fit=crop&q=80", route: "/services/laundry" }
        ]
    },
    security: {
        name: "Home Security, Solar & Water",
        subcategories: [
            { name: "Solar Panel", icon: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=500&auto=format&fit=crop&q=80", route: "/services/solar-panel" },
            { name: "Water Purifier", icon: "/water-purifier.jpg", route: "/services/water-purifier" },
            { name: "CCTV", icon: "/cctv-installation.png", route: "/services/cctv-security" },
            { name: "Smart Locks", icon: "https://images.unsplash.com/photo-1558002038-1055907df827?w=500&auto=format&fit=crop&q=80", route: "/services/smart-locks" },
            { name: "Home Automation", icon: "/home-automation.jpg", route: "/services/home-automation" }
        ]
    },
    bathroom_renovation: {
        name: "Bathroom Renovation",
        subcategories: [
            { name: "Complete Bathroom Renovation", icon: "/bathroom-renovation.jpg", route: "/services/bathroom-renovation" },
            { name: "Bathroom Tiling", icon: "/bathroom-tiling.jpg", route: "/services/bathroom-tiling" },
            { name: "Bathroom Plumbing", icon: "/plumber.png", route: "/plumber" },
            { name: "Bathroom Fixtures", icon: "/bathroom-fixtures.jpg", route: "/services/bathroom-fixtures" },
            { name: "Shower Installation", icon: "/shower-installation.jpg", route: "/services/shower-installation" }
        ]
    },
    painter: {
        name: "Painting Services",
        subcategories: [
            { name: "Interior Painting", icon: "/painter.png", route: "/services/interior-painting" },
            { name: "Exterior Painting", icon: "https://images.unsplash.com/photo-1599619351208-3e6c839d6828?w=500&auto=format&fit=crop&q=80", route: "/services/exterior-painting" },
            { name: "Wall Texture", icon: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=500&auto=format&fit=crop&q=80", route: "/services/wall-texture" },
            { name: "Wallpaper Installation", icon: "https://images.unsplash.com/photo-1585128792020-803d29415281?w=500&auto=format&fit=crop&q=80", route: "/services/wallpaper" },
            { name: "Wood Polishing", icon: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=500&auto=format&fit=crop&q=80", route: "/services/wood-polishing" }
        ]
    },
    waterproofing: {
        name: "Waterproofing Services",
        subcategories: [
            { name: "Roof Waterproofing", icon: "/roofing-work.png", route: "/services/roof-waterproofing" },
            { name: "Bathroom Waterproofing", icon: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=500&auto=format&fit=crop&q=80", route: "/services/bathroom-waterproofing" },
            { name: "Terrace Waterproofing", icon: "https://images.unsplash.com/photo-1590725140246-20acddc1ec6d?w=500&auto=format&fit=crop&q=80", route: "/services/terrace-waterproofing" },
            { name: "Wall Waterproofing", icon: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=500&auto=format&fit=crop&q=80", route: "/services/wall-waterproofing" },
            { name: "Basement Waterproofing", icon: "https://images.unsplash.com/photo-1604014237800-1c9102c219da?w=500&auto=format&fit=crop&q=80", route: "/services/basement-waterproofing" }
        ]
    },
    civil_works: {
        name: "Civil Works",
        subcategories: [
            { name: "Masonry Work", icon: "/painter.png", route: "/services/masonry" },
            { name: "Plastering", icon: "https://images.unsplash.com/photo-1609220136736-443140cffec6?w=500&auto=format&fit=crop&q=80", route: "/services/plastering" },
            { name: "Concrete Work", icon: "https://images.unsplash.com/photo-1590725140246-20acddc1ec6d?w=500&auto=format&fit=crop&q=80", route: "/services/concrete-work" },
            { name: "Demolition", icon: "https://images.unsplash.com/photo-1567789884554-0b844b597180?w=500&auto=format&fit=crop&q=80", route: "/services/demolition" },
            { name: "Foundation Work", icon: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=500&auto=format&fit=crop&q=80", route: "/services/foundation" }
        ]
    },
    flooring_tiling: {
        name: "Flooring & Tiling Services",
        subcategories: [
            { name: "Marble Flooring", icon: "/flooring.png", route: "/services/marble-flooring" },
            { name: "Tile Installation", icon: "https://images.unsplash.com/photo-1600121848594-d8644e57abab?w=500&auto=format&fit=crop&q=80", route: "/services/tile-installation" },
            { name: "Wooden Flooring", icon: "/flooring.png", route: "/services/wooden-flooring" },
            { name: "Vinyl Flooring", icon: "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=500&auto=format&fit=crop&q=80", route: "/services/vinyl-flooring" },
            { name: "Granite Flooring", icon: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=500&auto=format&fit=crop&q=80", route: "/services/granite-flooring" }
        ]
    }
};
