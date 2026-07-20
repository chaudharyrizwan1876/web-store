// backend/src/scripts/seedProducts.js
// Chalane ka tarika: node src/scripts/seedProducts.js
import dotenv from "dotenv";
import mongoose from "mongoose";
import Product from "../models/Product.js";

dotenv.config();

// ✅ Uniform square crop, high quality, consistent size across the whole store
const IMG = (id) => `https://images.unsplash.com/${id}?w=900&h=900&fit=crop&q=85&auto=format`;

// ✅ Curated real Unsplash photo IDs per category (verified, high quality, consistent style)
const PHOTOS = {
  electronics: [
    "photo-1505740420928-5e560c06d30e", // headphones
    "photo-1546868871-7041f2a55e12",    // smartwatch
    "photo-1526170375885-4d8ecf77b99f", // camera
    "photo-1608043152269-423dbba4e7e1", // speaker
    "photo-1527814050087-3793815479db", // gaming mouse
    "photo-1590658268037-6bf12165a8df", // earbuds
    "photo-1484704849700-f032a568e944", // headphones alt angle
    "photo-1608156639585-b3a032ef9689", // smartwatch alt
  ],
  computer: [
    "photo-1587829741301-dc798b83add3", // keyboard
    "photo-1527443060795-0402e54fbafd", // monitor
    "photo-1597872200969-2b65d56bd16b", // SSD
    "photo-1611078489935-0cb964de46d6", // laptop stand
    "photo-1587826080692-f439cd0b70da", // webcam
    "photo-1595225476474-89594267a4d3", // keyboard alt
    "photo-1547082299-de196ea013d6",    // monitor alt
  ],
  home: [
    "photo-1507473885765-e6ed057f782c", // lamp
    "photo-1584100936595-c0654b55a2e2", // pillows
    "photo-1513519245088-0e12902e35ca", // wall art
    "photo-1578500494198-246f612d3b3d", // vases
    "photo-1586023492125-27b2c045efd7", // rug
    "photo-1524758631624-e2822e304c36", // lamp alt
    "photo-1567016432779-094069958ea5", // decor alt
  ],
  auto: [
    "photo-1565811233927-c2f78a1c1b2c", // phone mount
    "photo-1605559424843-9e4c228bf1c2", // vacuum
    "photo-1492144534655-ae79c964c9d7", // headlight
    "photo-1542362567-b07e54358753",    // seat organizer
    "photo-1599256872237-5f612e7e6ca5", // tire gauge
    "photo-1503376780353-7e6692767b70", // car interior alt
    "photo-1449965408869-eaa3f722e40d", // car dashboard alt
  ],
  clothes: [
    "photo-1543087903-1ac2ec7aa8c5",    // denim jacket
    "photo-1496747611176-843222e1e57c", // floral dress
    "photo-1556821840-3a63f95609a7",    // hoodie
    "photo-1605812860427-4024433a70fd", // ankle boots
    "photo-1473966968600-fa801b869a1a", // chinos
    "photo-1552374196-c4e7ffc6e126",    // clothing rack alt
    "photo-1445205170230-053b83016050", // fashion alt
  ],
  tools: [
    "photo-1572981779307-38b8cabb2407", // drill
    "photo-1530124566582-a618bc2615dc", // wrench set
    "photo-1581092580497-e0d23cbdf1dc", // laser measure
    "photo-1581244277943-fe4a9c777189", // tool box
    "photo-1620912189868-1f9a8f50d4b4", // glue gun
    "photo-1416879595882-3373a0480b5b", // tools flatlay alt
    "photo-1504148455328-c376907d081c", // workshop alt
  ],
  sports: [
    "photo-1601925260368-ae2f83cf8b7f", // yoga mat
    "photo-1638536532686-d610adfc8e5c", // dumbbells
    "photo-1504280390367-361c6d9f38f4", // tent
    "photo-1602143407151-7111542de6e8", // water bottle
    "photo-1518611012118-696072aa579a", // resistance bands
    "photo-1571019613454-1cb2f99b2d8b", // fitness alt
    "photo-1517836357463-d25dfeac3438", // gym alt
  ],
  pets: [
    "photo-1601758125946-6ac1f4baf67e", // dog bed
    "photo-1592194996308-7b43878e84a6", // cat feeder
    "photo-1573865526739-10659fec78a5", // cat toy
    "photo-1576201836106-db1758fd1c97", // dog harness
    "photo-1520301255226-bf5f144451c1", // aquarium light
    "photo-1583511655857-d19b40a7a54e", // pet accessories alt
    "photo-1550697851-920b181d8ca2",    // dog alt
  ],
  machinery: [
    "photo-1581092335878-08a4ed5ea9b0", // bench grinder
    "photo-1581244277943-fe4a9c777189", // air compressor
    "photo-1572981779307-38b8cabb2407", // circular saw
    "photo-1530124566582-a618bc2615dc", // bench vise
    "photo-1620912189868-1f9a8f50d4b4", // angle grinder
    "photo-1519389950473-47ba0277781c", // machinery alt
    "photo-1504148455328-c376907d081c", // workshop alt 2
  ],
};

const imgs = (arr, ...idx) => idx.map((i) => IMG(arr[i]));

const PRODUCTS = [
  // ───────────── ELECTRONICS ─────────────
  {
    name: "Wireless Bluetooth Headphones",
    price: 49.99, oldPrice: 69.99,
    description: "Premium over-ear wireless headphones with active noise cancellation, 30-hour battery life, and crystal-clear sound quality. Perfect for music, calls, and travel.",
    category: "Electronics", brand: "Sony",
    images: imgs(PHOTOS.electronics, 0, 6, 5),
    stock: 45, rating: 4.5, numReviews: 128,
  },
  {
    name: "Smart Watch Series 7",
    price: 199.99, oldPrice: 249.99,
    description: "Track your fitness, heart rate, and sleep with this sleek smartwatch. Water-resistant design with a vibrant AMOLED display and 7-day battery life.",
    category: "Electronics", brand: "Samsung",
    images: imgs(PHOTOS.electronics, 1, 7, 0),
    stock: 30, rating: 4.7, numReviews: 95,
  },
  {
    name: "4K Action Camera",
    price: 129.99, oldPrice: 159.99,
    description: "Capture stunning 4K footage with this rugged, waterproof action camera. Includes mounting kit, perfect for adventure and sports enthusiasts.",
    category: "Electronics", brand: "Cannon",
    images: imgs(PHOTOS.electronics, 2, 3, 4),
    stock: 22, rating: 4.3, numReviews: 64,
  },
  {
    name: "Portable Bluetooth Speaker",
    price: 39.99, oldPrice: 54.99,
    description: "Compact, powerful speaker with deep bass and 12-hour playtime. Splash-proof design makes it ideal for outdoor parties and travel.",
    category: "Electronics", brand: "Oppo",
    images: imgs(PHOTOS.electronics, 3, 2, 5),
    stock: 60, rating: 4.4, numReviews: 210,
  },
  {
    name: "Wireless Gaming Mouse",
    price: 34.99, oldPrice: 44.99,
    description: "Ergonomic wireless gaming mouse with adjustable DPI, RGB lighting, and ultra-low latency for competitive gaming performance.",
    category: "Electronics", brand: "Lenovo",
    images: imgs(PHOTOS.electronics, 4, 1, 6),
    stock: 50, rating: 4.2, numReviews: 87,
  },
  {
    name: "Noise Cancelling Earbuds",
    price: 59.99, oldPrice: 79.99,
    description: "True wireless earbuds with active noise cancellation, touch controls, and a compact charging case offering up to 24 hours of total playback.",
    category: "Electronics", brand: "Apple",
    images: imgs(PHOTOS.electronics, 5, 0, 7),
    stock: 38, rating: 4.6, numReviews: 156,
  },

  // ───────────── COMPUTER AND TECH ─────────────
  {
    name: "Mechanical Gaming Keyboard",
    price: 79.99, oldPrice: 99.99,
    description: "RGB backlit mechanical keyboard with tactile switches, anti-ghosting technology, and durable aluminum frame built for gamers and typists alike.",
    category: "Computer and tech", brand: "Dell",
    images: imgs(PHOTOS.computer, 0, 5, 1),
    stock: 40, rating: 4.5, numReviews: 142,
  },
  {
    name: "27-inch 4K Monitor",
    price: 349.99, oldPrice: 419.99,
    description: "Ultra-sharp 4K UHD monitor with HDR support, 99% sRGB color accuracy, and slim bezel design — perfect for creative work and gaming.",
    category: "Computer and tech", brand: "Samsung",
    images: imgs(PHOTOS.computer, 1, 6, 0),
    stock: 18, rating: 4.7, numReviews: 73,
  },
  {
    name: "External SSD 1TB",
    price: 89.99, oldPrice: 119.99,
    description: "Ultra-fast portable SSD with read speeds up to 1050MB/s. Compact, shock-resistant design for reliable on-the-go storage.",
    category: "Computer and tech", brand: "Lenovo",
    images: imgs(PHOTOS.computer, 2, 3, 4),
    stock: 55, rating: 4.6, numReviews: 98,
  },
  {
    name: "Laptop Stand Adjustable",
    price: 29.99, oldPrice: 39.99,
    description: "Ergonomic aluminum laptop stand with adjustable height and angle, improving posture and airflow for any laptop up to 17 inches.",
    category: "Computer and tech", brand: "Dell",
    images: imgs(PHOTOS.computer, 3, 4, 2),
    stock: 70, rating: 4.3, numReviews: 61,
  },
  {
    name: "Webcam Full HD 1080p",
    price: 44.99, oldPrice: 59.99,
    description: "Crystal-clear 1080p webcam with built-in noise-reducing microphone, auto light correction, and wide-angle lens for video calls and streaming.",
    category: "Computer and tech", brand: "Apple",
    images: imgs(PHOTOS.computer, 4, 0, 6),
    stock: 48, rating: 4.4, numReviews: 110,
  },

  // ───────────── HOME INTERIORS ─────────────
  {
    name: "Modern Table Lamp",
    price: 34.99, oldPrice: 44.99,
    description: "Minimalist designer table lamp with warm ambient lighting, touch dimmer control, and a sturdy metal base — perfect for living rooms and bedrooms.",
    category: "Home interiors", brand: "Samsung",
    images: imgs(PHOTOS.home, 0, 5, 1),
    stock: 35, rating: 4.5, numReviews: 88,
  },
  {
    name: "Velvet Throw Pillow Set",
    price: 24.99, oldPrice: 32.99,
    description: "Set of 2 luxurious velvet throw pillows that add comfort and elegance to any sofa or bed. Available in rich, versatile tones.",
    category: "Home interiors", brand: "Oppo",
    images: imgs(PHOTOS.home, 1, 6, 2),
    stock: 60, rating: 4.3, numReviews: 54,
  },
  {
    name: "Wall Art Canvas Print",
    price: 39.99, oldPrice: 54.99,
    description: "High-quality framed canvas wall art featuring abstract modern design — instantly elevates the aesthetic of any room.",
    category: "Home interiors", brand: "Cannon",
    images: imgs(PHOTOS.home, 2, 3, 6),
    stock: 25, rating: 4.6, numReviews: 41,
  },
  {
    name: "Ceramic Vase Set",
    price: 29.99, oldPrice: 39.99,
    description: "Elegant set of 3 ceramic vases in varying sizes, perfect for fresh or dried flower arrangements and modern home decor.",
    category: "Home interiors", brand: "Lenovo",
    images: imgs(PHOTOS.home, 3, 4, 0),
    stock: 42, rating: 4.4, numReviews: 37,
  },
  {
    name: "Cozy Knit Area Rug",
    price: 69.99, oldPrice: 89.99,
    description: "Soft, plush area rug woven from durable fibers, adding warmth and texture to living rooms, bedrooms, or nurseries.",
    category: "Home interiors", brand: "Dell",
    images: imgs(PHOTOS.home, 4, 0, 5),
    stock: 20, rating: 4.5, numReviews: 29,
  },

  // ───────────── AUTOMOBILES ─────────────
  {
    name: "Car Phone Mount Holder",
    price: 14.99, oldPrice: 19.99,
    description: "Universal dashboard and windshield car phone mount with 360° rotation and strong suction grip, compatible with all smartphone sizes.",
    category: "Automobiles", brand: "Samsung",
    images: imgs(PHOTOS.auto, 0, 5, 6),
    stock: 90, rating: 4.4, numReviews: 167,
  },
  {
    name: "Car Vacuum Cleaner",
    price: 32.99, oldPrice: 44.99,
    description: "Compact, high-power handheld vacuum designed for car interiors. Cordless and rechargeable with multiple attachments for deep cleaning.",
    category: "Automobiles", brand: "Dell",
    images: imgs(PHOTOS.auto, 1, 6, 0),
    stock: 33, rating: 4.3, numReviews: 76,
  },
  {
    name: "LED Headlight Bulbs Set",
    price: 49.99, oldPrice: 64.99,
    description: "Ultra-bright LED headlight conversion kit offering improved visibility, longer lifespan, and easy plug-and-play installation.",
    category: "Automobiles", brand: "Lenovo",
    images: imgs(PHOTOS.auto, 2, 3, 4),
    stock: 28, rating: 4.5, numReviews: 52,
  },
  {
    name: "Car Seat Organizer",
    price: 19.99, oldPrice: 27.99,
    description: "Multi-pocket back seat organizer that keeps your car tidy — holds tablets, bottles, snacks, and accessories for road trips.",
    category: "Automobiles", brand: "Oppo",
    images: imgs(PHOTOS.auto, 3, 4, 2),
    stock: 65, rating: 4.2, numReviews: 94,
  },
  {
    name: "Tire Pressure Gauge Digital",
    price: 17.99, oldPrice: 22.99,
    description: "Accurate digital tire pressure gauge with backlit display, easy one-touch operation, and compact design for glovebox storage.",
    category: "Automobiles", brand: "Cannon",
    images: imgs(PHOTOS.auto, 4, 0, 5),
    stock: 50, rating: 4.4, numReviews: 38,
  },

  // ───────────── CLOTHES AND WEAR ─────────────
  {
    name: "Men's Classic Denim Jacket",
    price: 54.99, oldPrice: 74.99,
    description: "Timeless denim jacket crafted from durable cotton with a comfortable fit — a versatile staple for any wardrobe.",
    category: "Clothes and wear", brand: "Apple",
    images: imgs(PHOTOS.clothes, 0, 5, 6),
    stock: 40, rating: 4.5, numReviews: 112,
  },
  {
    name: "Women's Summer Floral Dress",
    price: 39.99, oldPrice: 54.99,
    description: "Light and breezy floral dress made from breathable fabric, perfect for warm-weather outings and casual everyday wear.",
    category: "Clothes and wear", brand: "Samsung",
    images: imgs(PHOTOS.clothes, 1, 6, 0),
    stock: 55, rating: 4.6, numReviews: 145,
  },
  {
    name: "Unisex Cotton Hoodie",
    price: 34.99, oldPrice: 44.99,
    description: "Soft, fleece-lined cotton hoodie offering all-day comfort and warmth. A relaxed fit that pairs well with any casual outfit.",
    category: "Clothes and wear", brand: "Oppo",
    images: imgs(PHOTOS.clothes, 2, 3, 4),
    stock: 70, rating: 4.4, numReviews: 198,
  },
  {
    name: "Leather Ankle Boots",
    price: 64.99, oldPrice: 89.99,
    description: "Premium genuine leather ankle boots with a durable rubber sole, designed for comfort and style across all seasons.",
    category: "Clothes and wear", brand: "Cannon",
    images: imgs(PHOTOS.clothes, 3, 4, 2),
    stock: 25, rating: 4.7, numReviews: 67,
  },
  {
    name: "Slim Fit Chino Pants",
    price: 29.99, oldPrice: 39.99,
    description: "Stylish slim-fit chinos made from stretch cotton fabric, offering comfort and a sharp look for work or casual settings.",
    category: "Clothes and wear", brand: "Lenovo",
    images: imgs(PHOTOS.clothes, 4, 0, 5),
    stock: 48, rating: 4.3, numReviews: 83,
  },

  // ───────────── TOOLS, EQUIPMENTS ─────────────
  {
    name: "Cordless Drill Driver Kit",
    price: 79.99, oldPrice: 109.99,
    description: "Powerful 20V cordless drill kit with two batteries, fast charger, and a complete bit set — ideal for home and professional projects.",
    category: "Tools, equipments", brand: "Dell",
    images: imgs(PHOTOS.tools, 0, 5, 6),
    stock: 30, rating: 4.6, numReviews: 121,
  },
  {
    name: "Adjustable Wrench Set",
    price: 24.99, oldPrice: 34.99,
    description: "Durable chrome-vanadium steel wrench set in multiple sizes, designed for precision and long-lasting performance.",
    category: "Tools, equipments", brand: "Lenovo",
    images: imgs(PHOTOS.tools, 1, 6, 0),
    stock: 45, rating: 4.4, numReviews: 58,
  },
  {
    name: "Digital Laser Measure",
    price: 39.99, oldPrice: 54.99,
    description: "Precision laser distance measurer with backlit display and ±2mm accuracy — perfect for construction and DIY measuring tasks.",
    category: "Tools, equipments", brand: "Apple",
    images: imgs(PHOTOS.tools, 2, 3, 4),
    stock: 22, rating: 4.5, numReviews: 44,
  },
  {
    name: "Heavy Duty Tool Box",
    price: 44.99, oldPrice: 59.99,
    description: "Rugged, weather-resistant tool box with multiple compartments and secure latches, organizing your tools for any job site.",
    category: "Tools, equipments", brand: "Samsung",
    images: imgs(PHOTOS.tools, 3, 4, 2),
    stock: 35, rating: 4.3, numReviews: 72,
  },
  {
    name: "Electric Hot Glue Gun",
    price: 16.99, oldPrice: 22.99,
    description: "Fast-heating glue gun with anti-drip nozzle, ideal for crafts, repairs, and small DIY projects around the house.",
    category: "Tools, equipments", brand: "Oppo",
    images: imgs(PHOTOS.tools, 4, 0, 5),
    stock: 60, rating: 4.2, numReviews: 39,
  },

  // ───────────── SPORTS AND OUTDOOR ─────────────
  {
    name: "Yoga Mat Premium",
    price: 22.99, oldPrice: 29.99,
    description: "Extra-thick, non-slip yoga mat made from eco-friendly material, providing superior cushioning for yoga, pilates, and home workouts.",
    category: "Sports and outdoor", brand: "Cannon",
    images: imgs(PHOTOS.sports, 0, 5, 6),
    stock: 80, rating: 4.6, numReviews: 203,
  },
  {
    name: "Adjustable Dumbbell Set",
    price: 89.99, oldPrice: 119.99,
    description: "Space-saving adjustable dumbbell set ranging from 5-25 lbs per hand, perfect for strength training at home.",
    category: "Sports and outdoor", brand: "Dell",
    images: imgs(PHOTOS.sports, 1, 6, 0),
    stock: 25, rating: 4.7, numReviews: 91,
  },
  {
    name: "Camping Tent 4-Person",
    price: 99.99, oldPrice: 134.99,
    description: "Waterproof, easy-setup camping tent that comfortably fits 4 people — ideal for weekend getaways and family camping trips.",
    category: "Sports and outdoor", brand: "Lenovo",
    images: imgs(PHOTOS.sports, 2, 3, 4),
    stock: 18, rating: 4.5, numReviews: 47,
  },
  {
    name: "Insulated Water Bottle",
    price: 19.99, oldPrice: 26.99,
    description: "Double-wall insulated stainless steel bottle that keeps drinks cold for 24 hours or hot for 12 — perfect for sports and travel.",
    category: "Sports and outdoor", brand: "Samsung",
    images: imgs(PHOTOS.sports, 3, 4, 2),
    stock: 75, rating: 4.4, numReviews: 156,
  },
  {
    name: "Resistance Bands Set",
    price: 14.99, oldPrice: 19.99,
    description: "Set of 5 latex resistance bands with varying tension levels, ideal for strength training, stretching, and physical therapy.",
    category: "Sports and outdoor", brand: "Apple",
    images: imgs(PHOTOS.sports, 4, 0, 5),
    stock: 95, rating: 4.3, numReviews: 178,
  },

  // ───────────── ANIMAL AND PETS ─────────────
  {
    name: "Orthopedic Dog Bed",
    price: 49.99, oldPrice: 64.99,
    description: "Memory foam orthopedic dog bed that relieves joint pain and provides superior comfort for dogs of all sizes and ages.",
    category: "Animal and pets", brand: "Oppo",
    images: imgs(PHOTOS.pets, 0, 5, 6),
    stock: 30, rating: 4.7, numReviews: 102,
  },
  {
    name: "Automatic Cat Feeder",
    price: 59.99, oldPrice: 79.99,
    description: "Programmable automatic pet feeder with portion control and voice recording — keeps your pet fed on schedule even when you're away.",
    category: "Animal and pets", brand: "Cannon",
    images: imgs(PHOTOS.pets, 1, 6, 0),
    stock: 22, rating: 4.5, numReviews: 68,
  },
  {
    name: "Interactive Cat Toy Wand",
    price: 12.99, oldPrice: 17.99,
    description: "Engaging feather wand toy that stimulates your cat's hunting instincts, promoting healthy exercise and play.",
    category: "Animal and pets", brand: "Dell",
    images: imgs(PHOTOS.pets, 2, 3, 4),
    stock: 100, rating: 4.4, numReviews: 134,
  },
  {
    name: "Adjustable Dog Harness",
    price: 24.99, oldPrice: 32.99,
    description: "No-pull, breathable mesh dog harness with adjustable straps for a secure, comfortable fit during walks and outdoor activities.",
    category: "Animal and pets", brand: "Lenovo",
    images: imgs(PHOTOS.pets, 3, 4, 2),
    stock: 55, rating: 4.6, numReviews: 89,
  },
  {
    name: "Aquarium LED Light Kit",
    price: 34.99, oldPrice: 44.99,
    description: "Full-spectrum LED aquarium light that enhances fish and plant colors, with adjustable brightness and timer settings.",
    category: "Animal and pets", brand: "Samsung",
    images: imgs(PHOTOS.pets, 4, 0, 5),
    stock: 40, rating: 4.3, numReviews: 51,
  },

  // ───────────── MACHINERY TOOLS ─────────────
  {
    name: "Bench Grinder 6-inch",
    price: 89.99, oldPrice: 119.99,
    description: "Heavy-duty 6-inch bench grinder with dual grinding wheels, powerful motor, and stable base — built for workshop sharpening and shaping tasks.",
    category: "Machinery tools", brand: "Dell",
    images: imgs(PHOTOS.machinery, 0, 5, 6),
    stock: 15, rating: 4.5, numReviews: 33,
  },
  {
    name: "Industrial Air Compressor",
    price: 199.99, oldPrice: 259.99,
    description: "High-capacity air compressor with oil-free pump, ideal for powering pneumatic tools in workshops and garages.",
    category: "Machinery tools", brand: "Samsung",
    images: imgs(PHOTOS.machinery, 1, 6, 0),
    stock: 12, rating: 4.6, numReviews: 27,
  },
  {
    name: "Circular Saw Heavy Duty",
    price: 74.99, oldPrice: 99.99,
    description: "High-performance circular saw with laser guide and adjustable depth control, designed for precise cuts on wood and composite materials.",
    category: "Machinery tools", brand: "Lenovo",
    images: imgs(PHOTOS.machinery, 2, 3, 4),
    stock: 20, rating: 4.4, numReviews: 45,
  },
  {
    name: "Bench Vise 5-inch",
    price: 39.99, oldPrice: 54.99,
    description: "Sturdy cast iron bench vise with swivel base and wide jaw opening, perfect for metalworking and woodworking projects.",
    category: "Machinery tools", brand: "Cannon",
    images: imgs(PHOTOS.machinery, 3, 4, 2),
    stock: 18, rating: 4.3, numReviews: 22,
  },
  {
    name: "Angle Grinder Variable Speed",
    price: 54.99, oldPrice: 74.99,
    description: "Powerful variable-speed angle grinder with safety guard and anti-vibration handle — versatile for cutting, grinding, and polishing.",
    category: "Machinery tools", brand: "Oppo",
    images: imgs(PHOTOS.machinery, 4, 0, 5),
    stock: 25, rating: 4.5, numReviews: 38,
  },
];

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ DB connected");

    // Clear existing products before seeding fresh, high-quality set
    const deleteResult = await Product.deleteMany({});
    console.log(`🗑️  Removed ${deleteResult.deletedCount} old products`);

    const created = await Product.insertMany(
      PRODUCTS.map((p) => ({ ...p, isActive: true }))
    );

    console.log(`✅ ${created.length} products created successfully (high-quality uniform images)!`);

    const summary = {};
    created.forEach((p) => {
      summary[p.category] = (summary[p.category] || 0) + 1;
    });
    console.log("\n📊 Products per category:");
    Object.entries(summary).forEach(([cat, count]) => {
      console.log(`   ${cat}: ${count}`);
    });

    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding failed:", err.message);
    process.exit(1);
  }
};

seedProducts();
