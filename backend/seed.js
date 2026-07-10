require('dotenv').config()
const connectDB = require('./db')
const Package = require('./models/Package')
const Team = require('./models/Team')
const Testimonial = require('./models/Testimonial')

const packages = [
  { img: 'package-1.jpg', dest: 'Thailand',    nights: '3 Nights', persons: '2 Person',                   price: '39,999.00', desc: "Explore Thailand's golden temples, bustling markets, and idyllic islands." },
  { img: 'package-2.jpg', dest: 'Indonesia',   nights: '3 Nights', persons: '2 Person',                   price: '49,999.00', desc: "Explore Indonesia's breathtaking islands, vibrant traditions, and natural wonders." },
  { img: 'package-3.jpg', dest: 'Malaysia',    nights: '3 Nights', persons: '2 Person',                   price: '34,999.00', desc: "Discover Malaysia's perfect blend of modernity and tradition." },
  { img: 'Turkey.jpg',    dest: 'Turkey',      nights: '4 Nights', persons: '1 Person On Double Sharing', price: '59,999.00', desc: "Experience Turkey's unique blend of ancient tradition and cutting-edge modernity." },
  { img: 'Himachal.jpg',  dest: 'Himachal',    nights: '3 Nights', persons: '2 Person',                   price: '29,999.00', desc: "Immerse yourself in Himachal's rich history, art, and cuisine." },
  { img: 'Uttrakhand.jpg',dest: 'Uttarakhand', nights: '3 Nights', persons: '2 Person',                   price: '27,999.00', desc: "Discover Uttarakhand's vibrant Mountains and breathtaking landscapes." },
  { img: 'Kashmir.jpeg',  dest: 'Kashmir',     nights: '5 Nights', persons: '1 Person On Double Sharing', price: '24,990.00', desc: 'Kashmir, often referred to as "Paradise on Earth," offers breathtaking natural beauty.' },
  { img: 'Uttarakhand.jpeg', dest: 'Uttarakhand', nights: '7 days', persons: '2 Person',                  price: '41,999.00', desc: "Discover Uttarakhand's vibrant Mountains, breathtaking landscapes, and unique wildlife." },
  { img: 'Ladakh.jpeg',   dest: 'Ladakh',      nights: '5 Nights', persons: '2 Person',                   price: '44,999.00', desc: 'Known as the "Land of High Passes," famous for rugged landscapes and serene monasteries.' },
]

const team = [
  { img: 'mama.jpeg',    name: 'Pramod Srivastava', role: 'Founder & CEO' },
  { img: 'Srikant.jpg',  name: 'Srikant',           role: 'Reservation Head' },
  { img: 'Manish2.jpeg', name: 'Manish',            role: 'Travel Guide' },
  { img: 'Another.jpg',  name: 'Subham Srivastava', role: 'Accounts & Admin' },
]

const testimonials = [
  { name: 'Rajnish Srivastava', loc: 'Lucknow, India', text: 'Amazing experience with Akash Holidays! They planned our family trip to Himachal Pradesh perfectly. Everything was well-organized and within our budget. Highly recommended!' },
  { name: 'Abhijeet',           loc: 'Lucknow, India', text: 'Booked our package to Kashmir through Akash Holidays and it was absolutely magical! The team took care of every detail. Will definitely use their services again!' },
  { name: 'Sanjay Srivastava',  loc: 'Lucknow, India', text: 'Excellent service for our corporate tour to Uttarakhand! Akash Holidays handled everything professionally. Great value for money!' },
  { name: 'Archit Tiwari',      loc: 'Lucknow, India', text: 'Hired them for a corporate tour to Singapore and they made it so easy. I recommend this Agent for international tours.' },
]

const seed = async () => {
  await connectDB()
  await Package.deleteMany()
  await Team.deleteMany()
  await Testimonial.deleteMany()
  await Package.insertMany(packages)
  await Team.insertMany(team)
  await Testimonial.insertMany(testimonials)
  console.log('Database seeded successfully!')
  process.exit()
}

seed()
