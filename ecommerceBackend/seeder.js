import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import connectDB from "./config/db.js";

// Models
import User from "./models/UserModel.js";
import Product from "./models/ProductModel.js";
import Category from "./models/CategoryModel.js";
import Review from "./models/ReviewModel.js";

dotenv.config();
connectDB();

const seedData = async () => {
  try {
    // 1. Clear existing database
    await User.deleteMany();
    await Product.deleteMany();
    await Category.deleteMany();
    await Review.deleteMany();

    console.log("Database cleared! 🗑️");

    // 2. Create Users
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("password123", salt);

    const adminUser = await User.create({
      name: "Merchant Admin",
      email: "admin@merchantgrid.com",
      password: hashedPassword,
      role: "admin",
      avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150",
      phone: "+91 9876543210"
    });

    const regularUser = await User.create({
      name: "John Doe",
      email: "user@merchantgrid.com",
      password: hashedPassword,
      role: "user",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
      phone: "+91 8765432109"
    });

    console.log("Users seeded! 👥");

    // 3. Create Categories
    const categoriesData = [
      { name: "Electronics", description: "Phones, Laptops, Gadgets and Accessories" },
      { name: "Fashion", description: "Premium clothing, footwear and accessories" },
      { name: "Home & Garden", description: "Furniture, decor and gardening equipment" },
      { name: "Sports", description: "Fitness, adventure and athletic equipment" },
      { name: "Books", description: "Educational, fiction, and multi-genre novels" }
    ];

    const categories = await Category.insertMany(categoriesData);
    console.log("Categories seeded! 🏷️");

    const findCategory = (name) => categories.find(c => c.name === name)._id;

    // 4. Create Products (10 per category, total 50 products)
    const productsData = [
      // ==========================================
      // ELECTRONICS (10 Products)
      // ==========================================
      {
        title: "iPhone 15 Pro",
        description: "The ultimate iPhone with aerospace-grade titanium design, the powerhouse A17 Pro chip, a customizable Action button, and the most powerful iPhone camera system ever.",
        price: 134900,
        image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500&q=80",
        images: [
          "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500&q=80",
          "https://images.unsplash.com/photo-1695048065007-113b9f812290?w=500&q=80"
        ],
        brand: "Apple",
        category: findCategory("Electronics"),
        stock: 12,
        rating: 4.8,
        numReviews: 2,
        createdBy: adminUser._id
      },
      {
        title: "Sony WH-1000XM5 Wireless Headphones",
        description: "Industry-leading noise canceling wireless over-ear headphones with integrated Alexa, microphone for hands-free phone calls, and 30-hour battery life.",
        price: 29990,
        image: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=500&q=80",
        brand: "Sony",
        category: findCategory("Electronics"),
        stock: 25,
        rating: 4.6,
        numReviews: 1,
        createdBy: adminUser._id
      },
      {
        title: "Logitech MX Master 3S",
        description: "Wireless performance mouse with ultra-fast MagSpeed scrolling, ergo-design, 8K DPI tracking, and quiet clicks. Perfect for developers and designers.",
        price: 9495,
        image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500&q=80",
        brand: "Logitech",
        category: findCategory("Electronics"),
        stock: 5,
        rating: 4.9,
        numReviews: 0,
        createdBy: adminUser._id
      },
      {
        title: "Apple MacBook Pro 14 M3",
        description: "The premium powerhouse laptop loaded with the breakthrough M3 chip. Offers up to 22 hours of standard battery life and a stunning Liquid Retina XDR screen.",
        price: 169900,
        image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80",
        brand: "Apple",
        category: findCategory("Electronics"),
        stock: 8,
        rating: 4.9,
        numReviews: 0,
        createdBy: adminUser._id
      },
      {
        title: "Dell UltraSharp 27 4K Monitor",
        description: "Stunning 27-inch 4K USB-C hub monitor featuring brilliant color coverage including 100% sRGB, IPS Black technology, and comfort view features.",
        price: 38500,
        image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&q=80",
        brand: "Dell",
        category: findCategory("Electronics"),
        stock: 14,
        rating: 4.5,
        numReviews: 0,
        createdBy: adminUser._id
      },
      {
        title: "Keychron K2 Mechanical Keyboard",
        description: "Compact 84-key wireless mechanical keyboard with tactile brown switches, white LED backlight, and Mac/Windows cross-compatibility layout.",
        price: 7999,
        image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&q=80",
        brand: "Keychron",
        category: findCategory("Electronics"),
        stock: 30,
        rating: 4.7,
        numReviews: 0,
        createdBy: adminUser._id
      },
      {
        title: "Anker 737 Power Bank 24K",
        description: "Ultra-high capacity portable power bank equipped with Power Delivery 3.1 and 140W bi-directional charging. Features a smart digital display dashboard.",
        price: 12999,
        image: "https://images.unsplash.com/photo-1609592424109-dd7736340277?w=500&q=80",
        brand: "Anker",
        category: findCategory("Electronics"),
        stock: 45,
        rating: 4.6,
        numReviews: 0,
        createdBy: adminUser._id
      },
      {
        title: "Kindle Paperwhite 16GB",
        description: "Purpose-built for reading with a 6.8-inch display, thinner borders, adjustable warm light, up to 10 weeks of battery life, and waterproof casing.",
        price: 14999,
        image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&q=80",
        brand: "Amazon",
        category: findCategory("Electronics"),
        stock: 40,
        rating: 4.8,
        numReviews: 0,
        createdBy: adminUser._id
      },
      {
        title: "Sony Alpha 7 IV Mirrorless Camera",
        description: "A premium mirrorless camera setting standard benchmarks for high-resolution photography and 4K video capture, featuring a 33MP Exmor R CMOS sensor.",
        price: 218990,
        image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&q=80",
        brand: "Sony",
        category: findCategory("Electronics"),
        stock: 3,
        rating: 4.9,
        numReviews: 0,
        createdBy: adminUser._id
      },
      {
        title: "Bose SoundLink Flex Speaker",
        description: "Waterproof, dustproof outdoor portable Bluetooth speaker with custom acoustic technology and crisp clear sound. Perfect for travel and adventures.",
        price: 15900,
        image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&q=80",
        brand: "Bose",
        category: findCategory("Electronics"),
        stock: 18,
        rating: 4.7,
        numReviews: 0,
        createdBy: adminUser._id
      },

      // ==========================================
      // FASHION (10 Products)
      // ==========================================
      {
        title: "Classic Leather Jacket",
        description: "Made from 100% genuine lambskin leather, this classic jacket offers timeless style with asymmetrical zip closure, multiple pockets, and comfortable inner lining.",
        price: 5999,
        image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&q=80",
        brand: "UrbanWear",
        category: findCategory("Fashion"),
        stock: 18,
        rating: 4.2,
        numReviews: 0,
        createdBy: adminUser._id
      },
      {
        title: "Premium Cotton Slim-Fit Chinos",
        description: "Finely woven stretch cotton chinos offering maximum mobility and a sleek, modern, smart-casual aesthetic. Perfect for work and casual outings.",
        price: 2499,
        image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=500&q=80",
        brand: "NordicFit",
        category: findCategory("Fashion"),
        stock: 35,
        rating: 4.4,
        numReviews: 0,
        createdBy: adminUser._id
      },
      {
        title: "Minimalist Quartz Wristwatch",
        description: "Elegant quartz watch featuring a scratch-resistant sapphire glass face, a comfortable black genuine leather strap, and a premium stainless steel dial case.",
        price: 8999,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80",
        brand: "Nordlite",
        category: findCategory("Fashion"),
        stock: 10,
        rating: 4.6,
        numReviews: 0,
        createdBy: adminUser._id
      },
      {
        title: "Heritage Canvas Backpack",
        description: "Heavy-duty waxed cotton canvas backpack featuring reinforced genuine leather straps, padded laptop compartment, and large spacious storage compartments.",
        price: 3299,
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80",
        brand: "Rustica",
        category: findCategory("Fashion"),
        stock: 22,
        rating: 4.5,
        numReviews: 0,
        createdBy: adminUser._id
      },
      {
        title: "Polarized Retro Sunglasses",
        description: "Classic retro styled sunglasses with robust TR90 composite frames and high-quality polarized UV400 protective lenses to eliminate high-intensity glare.",
        price: 1899,
        image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&q=80",
        brand: "Solari",
        category: findCategory("Fashion"),
        stock: 50,
        rating: 4.3,
        numReviews: 0,
        createdBy: adminUser._id
      },
      {
        title: "Handcrafted Chelsea Boots",
        description: "Finely handcrafted premium suede leather Chelsea boots featuring elasticated side panels and robust, comfortable Goodyear welted rubber soles.",
        price: 7499,
        image: "https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=500&q=80",
        brand: "Cobbler & Co",
        category: findCategory("Fashion"),
        stock: 8,
        rating: 4.7,
        numReviews: 0,
        createdBy: adminUser._id
      },
      {
        title: "Merino Wool Knit Sweater",
        description: "Woven from 100% fine Merino wool, this knit crewneck sweater provides unparalleled warmth, moisture management, and a premium soft skin feel.",
        price: 4590,
        image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=500&q=80",
        brand: "WinterGold",
        category: findCategory("Fashion"),
        stock: 15,
        rating: 4.5,
        numReviews: 0,
        createdBy: adminUser._id
      },
      {
        title: "Tailored Linen Casual Shirt",
        description: "Breathable and ultra-light premium tailored linen long-sleeve casual button-down shirt. Perfect for keeping comfortable and cool in warm climates.",
        price: 1999,
        image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500&q=80",
        brand: "Breeze",
        category: findCategory("Fashion"),
        stock: 28,
        rating: 4.4,
        numReviews: 0,
        createdBy: adminUser._id
      },
      {
        title: "Waterproof Active Jacket",
        description: "Windproof and highly waterproof active running shell jacket featuring taped seams, adjustable hood, and breathable underarm air vents.",
        price: 3499,
        image: "https://images.unsplash.com/photo-1548883354-7622d03aca27?w=500&q=80",
        brand: "PeakRun",
        category: findCategory("Fashion"),
        stock: 19,
        rating: 4.6,
        numReviews: 0,
        createdBy: adminUser._id
      },
      {
        title: "Comfort Cotton Socks 5-Pack",
        description: "Pack of 5 pairs of combed-cotton socks with ribbed support and cushioned soles to guarantee everyday maximum foot comfort.",
        price: 899,
        image: "https://images.unsplash.com/photo-1582966772680-860e372bb558?w=500&q=80",
        brand: "CozyFeet",
        category: findCategory("Fashion"),
        stock: 100,
        rating: 4.8,
        numReviews: 0,
        createdBy: adminUser._id
      },

      // ==========================================
      // HOME & GARDEN (10 Products)
      // ==========================================
      {
        title: "Minimalist Wooden Desk",
        description: "Spacious solid wood writing desk perfect for a clean, modern home office. Solid metal frame structure provides robust sturdiness.",
        price: 12499,
        image: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=500&q=80",
        brand: "DecoHome",
        category: findCategory("Home & Garden"),
        stock: 3,
        rating: 4.5,
        numReviews: 0,
        createdBy: adminUser._id
      },
      {
        title: "Ergonomic Lumbar Support Chair",
        description: "Fully adjustable ergonomic desk chair featuring a breathable mesh back, structured lumbar support pad, and multi-directional armrests.",
        price: 14999,
        image: "https://images.unsplash.com/photo-1505797149-43b0069ec26b?w=500&q=80",
        brand: "Siesta",
        category: findCategory("Home & Garden"),
        stock: 8,
        rating: 4.6,
        numReviews: 0,
        createdBy: adminUser._id
      },
      {
        title: "Smart Dimmable Floor Lamp",
        description: "Elegant modern black metal floor lamp equipped with smart dimmable LED lights compatible with phone app control.",
        price: 4899,
        image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500&q=80",
        brand: "Lumina",
        category: findCategory("Home & Garden"),
        stock: 15,
        rating: 4.4,
        numReviews: 0,
        createdBy: adminUser._id
      },
      {
        title: "Ceramic Planters 3-Set",
        description: "Set of three minimal white geometric ceramic succulent flower planters featuring solid bamboo trays for clean table presentation.",
        price: 1299,
        image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=500&q=80",
        brand: "FloraGlass",
        category: findCategory("Home & Garden"),
        stock: 25,
        rating: 4.7,
        numReviews: 0,
        createdBy: adminUser._id
      },
      {
        title: "Scented Soy Wax Candles 4-Pack",
        description: "Hand-poured 100% organic soy wax scented candles (Lavender, Vanilla, Rose, Citrus) housed in beautiful frosted glass jars.",
        price: 1599,
        image: "https://images.unsplash.com/photo-1603006905003-be475563bc59?w=500&q=80",
        brand: "AromaZen",
        category: findCategory("Home & Garden"),
        stock: 30,
        rating: 4.5,
        numReviews: 0,
        createdBy: adminUser._id
      },
      {
        title: "Turkish Cotton Towels 2-Pack",
        description: "Oversized, ultra-absorbent Turkish cotton bath towels. Offers high durability and incredibly luxurious fluffy softness.",
        price: 2299,
        image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=500&q=80",
        brand: "LinenSoft",
        category: findCategory("Home & Garden"),
        stock: 20,
        rating: 4.8,
        numReviews: 0,
        createdBy: adminUser._id
      },
      {
        title: "Granite Cookware Set 8-Piece",
        description: "Eco-friendly non-stick granite stone kitchen cookware set containing frying pans, saucepans, and tempered glass lids.",
        price: 6899,
        image: "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=500&q=80",
        brand: "ChefStar",
        category: findCategory("Home & Garden"),
        stock: 12,
        rating: 4.6,
        numReviews: 0,
        createdBy: adminUser._id
      },
      {
        title: "Modern Abstract Area Rug 5x7",
        description: "Soft low-pile area rug featuring a chic contemporary abstract design and sturdy non-slip bottom coating.",
        price: 5499,
        image: "https://images.unsplash.com/photo-1576016770956-debb63d90029?w=500&q=80",
        brand: "PatternArt",
        category: findCategory("Home & Garden"),
        stock: 10,
        rating: 4.3,
        numReviews: 0,
        createdBy: adminUser._id
      },
      {
        title: "Ultrasonic Essential Oil Diffuser",
        description: "Whisper-quiet ultrasonic aromatherapy humidifier featuring a wood grain outer finish and 7 color options of soothing ambient LED rings.",
        price: 1999,
        image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=500&q=80",
        brand: "SereneAir",
        category: findCategory("Home & Garden"),
        stock: 40,
        rating: 4.7,
        numReviews: 0,
        createdBy: adminUser._id
      },
      {
        title: "Floating Wall Shelves 3-Set",
        description: "Set of three solid Paulownia wood floating display shelves featuring modern matte black iron brackets.",
        price: 1799,
        image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=500&q=80",
        brand: "TimberLine",
        category: findCategory("Home & Garden"),
        stock: 35,
        rating: 4.4,
        numReviews: 0,
        createdBy: adminUser._id
      },

      // ==========================================
      // SPORTS (10 Products)
      // ==========================================
      {
        title: "Premium Yoga Mat",
        description: "Eco-friendly, non-slip 6mm thick yoga mat with carry strap. Extra cushioning provides joint comfort during intensive fitness workouts.",
        price: 1899,
        image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500&q=80",
        brand: "FitLife",
        category: findCategory("Sports"),
        stock: 50,
        rating: 4.7,
        numReviews: 0,
        createdBy: adminUser._id
      },
      {
        title: "High-Density Foam Roller",
        description: "Robust high-density EVA foam roller perfect for deep muscle tissue therapy, myofascial release, and quick post-workout recovery.",
        price: 1199,
        image: "https://images.unsplash.com/photo-1600881333168-2ef49b341f30?w=500&q=80",
        brand: "MuscleCore",
        category: findCategory("Sports"),
        stock: 30,
        rating: 4.6,
        numReviews: 0,
        createdBy: adminUser._id
      },
      {
        title: "Smart Fitness Tracker Band",
        description: "Waterproof fitness band with integrated heart rate monitor, multi-sport activity tracking, and dynamic sleep insights.",
        price: 3499,
        image: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=500&q=80",
        brand: "ActiveTrac",
        category: findCategory("Sports"),
        stock: 25,
        rating: 4.5,
        numReviews: 0,
        createdBy: adminUser._id
      },
      {
        title: "Adjustable Dumbbell Set 20kg",
        description: "Space-saving adjustable iron weight dumbbell set with anti-slip textured grip bars and secure screw collar fasteners.",
        price: 5899,
        image: "https://images.unsplash.com/photo-1638536532686-d610adfc8e5c?w=500&q=80",
        brand: "IronFlex",
        category: findCategory("Sports"),
        stock: 15,
        rating: 4.8,
        numReviews: 0,
        createdBy: adminUser._id
      },
      {
        title: "Insulated Water Bottle 1L",
        description: "Double-walled vacuum insulated stainless steel flask. Keeps drinks ice cold for up to 24 hours or steaming hot for 12 hours.",
        price: 1499,
        image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&q=80",
        brand: "HydroFlow",
        category: findCategory("Sports"),
        stock: 60,
        rating: 4.7,
        numReviews: 0,
        createdBy: adminUser._id
      },
      {
        title: "Table Tennis Rackets Set",
        description: "Includes four high-quality custom engineered rackets and 8 regulation balls. Features dynamic rubber grip surfaces.",
        price: 2199,
        image: "https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=500&q=80",
        brand: "SpinMaster",
        category: findCategory("Sports"),
        stock: 18,
        rating: 4.4,
        numReviews: 0,
        createdBy: adminUser._id
      },
      {
        title: "Running Waist Belt Pack",
        description: "Ultra-slim and expandable elastic running fanny pack featuring a waterproof zipper and built-in headphone wire outlet.",
        price: 799,
        image: "https://images.unsplash.com/photo-1530143311094-34d807799e8f?w=500&q=80",
        brand: "SpeedLite",
        category: findCategory("Sports"),
        stock: 40,
        rating: 4.3,
        numReviews: 0,
        createdBy: adminUser._id
      },
      {
        title: "Professional Speed Jump Rope",
        description: "Tangle-free steel cable speed jump rope featuring custom ball-bearing high velocity handles. Perfect for HIIT and boxing workouts.",
        price: 699,
        image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=500&q=80",
        brand: "SkipPro",
        category: findCategory("Sports"),
        stock: 50,
        rating: 4.6,
        numReviews: 0,
        createdBy: adminUser._id
      },
      {
        title: "Resistance Loop Bands 5-Pack",
        description: "Premium heavy-duty latex workout loop bands ranging from Light to XX-Heavy. Complete with a mesh carry bag.",
        price: 499,
        image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=500&q=80",
        brand: "StretchFit",
        category: findCategory("Sports"),
        stock: 80,
        rating: 4.7,
        numReviews: 0,
        createdBy: adminUser._id
      },
      {
        title: "Ultralight Camping Backpack 50L",
        description: "Ergonomic wilderness hiking and camping rucksack featuring high density ripstop nylon fabric and an integrated rain cover.",
        price: 4299,
        image: "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=500&q=80",
        brand: "WildRoute",
        category: findCategory("Sports"),
        stock: 10,
        rating: 4.8,
        numReviews: 0,
        createdBy: adminUser._id
      },

      // ==========================================
      // BOOKS (10 Products)
      // ==========================================
      {
        title: "Atomic Habits",
        description: "An easy & proven way to build good habits & break bad ones. The legendary self-improvement bestseller by James Clear.",
        price: 499,
        image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&q=80",
        brand: "Penguin Random House",
        category: findCategory("Books"),
        stock: 100,
        rating: 4.9,
        numReviews: 0,
        createdBy: adminUser._id
      },
      {
        title: "Thinking, Fast and Slow",
        description: "Daniel Kahneman’s epic intellectual journey explaining the twin cognitive systems that drive human judgements and choices.",
        price: 599,
        image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&q=80",
        brand: "Farrar, Straus and Giroux",
        category: findCategory("Books"),
        stock: 45,
        rating: 4.7,
        numReviews: 0,
        createdBy: adminUser._id
      },
      {
        title: "Educated: A Memoir",
        description: "Tara Westover's phenomenal autobiography tracking her journey from surviving in an isolated mountain family to claiming a PhD at Cambridge.",
        price: 450,
        image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500&q=80",
        brand: "Random House",
        category: findCategory("Books"),
        stock: 35,
        rating: 4.8,
        numReviews: 0,
        createdBy: adminUser._id
      },
      {
        title: "Sapiens: A Brief History of Humankind",
        description: "Yuval Noah Harari's ground-breaking exploration tracking how cognitive, agricultural, and scientific developments crafted our modern societies.",
        price: 699,
        image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=500&q=80",
        brand: "Harper",
        category: findCategory("Books"),
        stock: 60,
        rating: 4.8,
        numReviews: 0,
        createdBy: adminUser._id
      },
      {
        title: "The Silent Patient",
        description: "Alex Michaelides' bestselling psychological thriller mapping an artist's unexplained silence after murdering her husband.",
        price: 399,
        image: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=500&q=80",
        brand: "Celadon Books",
        category: findCategory("Books"),
        stock: 80,
        rating: 4.6,
        numReviews: 0,
        createdBy: adminUser._id
      },
      {
        title: "Deep Work",
        description: "Cal Newport's highly critical guide teaching rules for focused success in a highly distracted modern knowledge-based economy.",
        price: 499,
        image: "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=500&q=80",
        brand: "Grand Central Publishing",
        category: findCategory("Books"),
        stock: 55,
        rating: 4.7,
        numReviews: 0,
        createdBy: adminUser._id
      },
      {
        title: "Psychology of Money",
        description: "Morgan Housel's timeless financial collection containing 19 short stories that unravel the behavioral dynamics of personal wealth.",
        price: 350,
        image: "https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?w=500&q=80",
        brand: "Harriman House",
        category: findCategory("Books"),
        stock: 120,
        rating: 4.9,
        numReviews: 0,
        createdBy: adminUser._id
      },
      {
        title: "Zero to One",
        description: "Peter Thiel's highly acclaimed guide detailing notes on startups and how to build a unique path toward monopolizing future success.",
        price: 499,
        image: "https://images.unsplash.com/photo-1495640388908-05fa85288e61?w=500&q=80",
        brand: "Crown Business",
        category: findCategory("Books"),
        stock: 40,
        rating: 4.6,
        numReviews: 0,
        createdBy: adminUser._id
      },
      {
        title: "Ikigai: The Japanese Secret",
        description: "A beautiful exploration into finding your life's true intersection of passion, mission, vocation, and profession for healthy longevity.",
        price: 399,
        image: "https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d?w=500&q=80",
        brand: "Penguin Books",
        category: findCategory("Books"),
        stock: 90,
        rating: 4.8,
        numReviews: 0,
        createdBy: adminUser._id
      },
      {
        title: "The Alchemist",
        description: "Paulo Coelho's masterpiece novel tracing Santiago's travel quest across the Egyptian deserts to realize his personal legend.",
        price: 299,
        image: "https://images.unsplash.com/photo-1474932430478-367dbb6832c1?w=500&q=80",
        brand: "HarperOne",
        category: findCategory("Books"),
        stock: 150,
        rating: 4.9,
        numReviews: 0,
        createdBy: adminUser._id
      }
    ];

    const products = await Product.insertMany(productsData);
    console.log("Products seeded! 📦");

    // 5. Create Reviews
    const reviewsData = [
      {
        user: regularUser._id,
        product: products[0]._id, // iPhone
        rating: 5,
        comment: "Absolutely gorgeous titanium frame! The camera zoom is phenomenal."
      },
      {
        user: adminUser._id,
        product: products[0]._id, // iPhone
        rating: 4,
        comment: "Incredibly powerful chip, but the battery life is almost identical to previous generation."
      },
      {
        user: regularUser._id,
        product: products[1]._id, // Sony
        rating: 5,
        comment: "Best noise canceling headphones ever. Worth every rupee."
      }
    ];

    const reviews = await Review.insertMany(reviewsData);
    
    // Update product reviews arrays
    products[0].reviews = [reviews[0]._id, reviews[1]._id];
    await products[0].save();
    
    products[1].reviews = [reviews[2]._id];
    await products[1].save();
    
    console.log("Reviews linked and seeded! ⭐");
    console.log("Data Seeding Completed Successfully! 🎉");
    process.exit(0);
  } catch (error) {
    console.error(`Error during seeding: ${error.message} ❌`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await User.deleteMany();
    await Product.deleteMany();
    await Category.deleteMany();
    await Review.deleteMany();

    console.log("All data cleared successfully! 🗑️");
    process.exit(0);
  } catch (error) {
    console.error(`Error clearing data: ${error.message} ❌`);
    process.exit(1);
  }
};

if (process.argv[2] === "-d") {
  destroyData();
} else {
  seedData();
}
