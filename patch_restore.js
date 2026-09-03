const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/joamex').then(async () => {
  const db = mongoose.connection.db;
  
  const categoryKey = 'painters-on-low-price';
  const formattedTitle = 'Painters On Low Price';
  
  const restoredData = [
      {
        id: 'packages',
        title: 'Packages & Services',
        icon: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=100&h=100&fit=crop&q=80',
        items: [
          {
            id: `${categoryKey}-basic-package`,
            name: `Basic ${formattedTitle} Package`,
            rating: '4.8',
            reviews: '12K',
            price: 499,
            originalPrice: 699,
            duration: '45 mins',
            bullets: ['Professional service technician', 'Includes standard inspection & service'],
            image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=300&h=300&fit=crop&q=80',
            bestSeller: true,
            details: '<p>good servie we provide plz conenct with painters on very good price we provide painters  and plz get This soon as soon as you book you would get good price </p>'
          },
          {
            id: `${categoryKey}-premium-package`,
            name: `Premium ${formattedTitle} Package`,
            rating: '4.9',
            reviews: '8K',
            price: 899,
            originalPrice: 1199,
            badge: 'Upto 25% OFF',
            duration: '90 mins',
            bullets: ['Comprehensive deep service & cleaning', '30 days service warranty included'],
            image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=300&h=300&fit=crop&q=80',
            bestSeller: false,
            details: '<p>lets get good price </p>'
          }
        ]
      }
  ];

  const result = await db.collection('02_what_are_you_looking_for').updateOne(
    { 'subcategories.slug': 'painters-on-low-price' },
    { $set: { 'subcategories.$.servicesList': restoredData } }
  );
  
  console.log('Modified Count:', result.modifiedCount);
  process.exit(0);
}).catch(err => { console.error(err); process.exit(1); });
