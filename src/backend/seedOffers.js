import mongoose from 'mongoose';
import connectDB from './config/db.js';
import Offer from './models/Offer.js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const initialOffers = [
  {
    name: 'Salon for Women',
    title: 'Salon for Women',
    subtitle: 'Save up to 40% OFF',
    buttonText: 'Explore →',
    bgColor: '#FCE4EC',
    textColor: '#C2185B',
    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop',
    price: 599,
    badge: 'TRENDING',
    route: '/services/bridal-makeup'
  },
  {
    name: 'Home Cleaning',
    title: 'Home Cleaning',
    subtitle: 'Up to 40% OFF on Deep Cleaning',
    buttonText: 'Explore →',
    bgColor: '#F3E5F5',
    textColor: '#7B1FA2',
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=300&fit=crop',
    price: 799,
    badge: 'POPULAR',
    route: '/services/full-home-cleaning'
  },
  {
    name: 'Plumbing Service',
    title: 'Plumbing',
    subtitle: 'Expert Plumbing Services',
    buttonText: 'Explore →',
    bgColor: '#E0F2F1',
    textColor: '#00796B',
    image: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=400&h=300&fit=crop',
    price: 149,
    badge: 'NEW',
    route: '/plumber'
  },
  {
    name: 'AC Service & Repair',
    title: 'Up to 30% OFF',
    subtitle: 'AC Service & Repair',
    buttonText: 'Explore →',
    bgColor: '#E8F5E9',
    textColor: '#388E3C',
    image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=300&fit=crop',
    price: 499,
    badge: 'HOT DEAL',
    route: '/ac-repair'
  },
  {
    name: 'Electrician Service',
    title: 'Electrician',
    subtitle: 'Top Electrical Experts',
    buttonText: 'Explore →',
    bgColor: '#FFF3E0',
    textColor: '#F57C00',
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=300&fit=crop',
    price: 99,
    badge: 'BEST VALUE',
    route: '/electrician'
  }
];

const seedOffers = async () => {
  try {
    await connectDB();
    for (const offer of initialOffers) {
      const exists = await Offer.findOne({ title: offer.title });
      if (!exists) {
        await Offer.create(offer);
        console.log(`Added offer: ${offer.title}`);
      }
    }
    console.log('Done seeding offers');
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedOffers();
