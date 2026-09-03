# آن لائن کلاتھ سٹور — پراجیکٹ پلان
### (Rules | Guidelines | Roadmap | Architecture)

**ٹیک اسٹیک:** Backend: Express.js | Frontend: React.js | Database: MongoDB

---

## 1. پراجیکٹ کا مختصر تعارف

یہ ایک **آن لائن کلاتھ سٹور** ہے جہاں:
- **Admin** پروڈکٹس (ڈریسز، لیڈیز ویئر، کڈز ویئر وغیرہ) اپلوڈ کرے گا، ان کی امیجز، سائز، کلرز، پرائس اور ڈیلیوری چارجز سیٹ کرے گا۔
- **Customer** ویب سائٹ وزٹ کرے گا، پروڈکٹس دیکھے گا (360° / multi-angle images کے ساتھ)، سائز اور کلر منتخب کرے گا، اور **Cash on Delivery (COD)** پر آرڈر بک کرے گا۔
- ویب سائٹ کا تھیم **Light Theme** ہوگا، ماڈرن، اینیمیٹڈ اور HCI/Usability اصولوں پر مبنی۔

---

## 2. پراجیکٹ رولز اینڈ گائیڈ لائنز (Development Rules)

### 2.1 جنرل کوڈنگ رولز
1. **MVC Pattern** فالو کریں (Models, Controllers, Routes الگ الگ فولڈرز میں)۔
2. Backend اور Frontend کو **مکمل الگ ریپوز/فولڈرز** میں رکھیں (Monorepo چاہیں تو `client` اور `server` فولڈر بنائیں)۔
3. ہر API endpoint کے لیے **Controller function الگ** ہو، Route فائل صرف routing کرے، logic controller میں ہو۔
4. Environment variables (.env) میں رکھیں: `MONGO_URI`, `JWT_SECRET`, `PORT`, `CLOUDINARY_KEYS` وغیرہ — کبھی hardcode نہ کریں۔
5. **Error Handling Middleware** پورے backend میں ایک ہی جگہ سے ہینڈل ہو (centralized error handler)۔
6. **Validation** ہر input پر ہو (Joi یا express-validator استعمال کریں)۔
7. Frontend میں **Component-based structure** رکھیں — ہر چیز reusable component ہو (Button, Card, Modal وغیرہ)۔
8. **Naming Convention:** camelCase (variables/functions), PascalCase (React components), kebab-case (files/folders)۔
9. Git استعمال کریں، مناسب commit messages کے ساتھ۔
10. Sensitive data (passwords) ہمیشہ **bcrypt** سے hash ہوں۔
11. Authentication کے لیے **JWT (JSON Web Token)** استعمال کریں۔
12. Images کو مقامی سرور پر اسٹور نہ کریں — **Cloudinary / Firebase Storage / AWS S3** استعمال کریں۔

### 2.2 سیکیورٹی رولز
- Admin routes کو **role-based middleware** سے protect کریں (صرف admin ہی پروڈکٹ add/edit/delete کر سکے)۔
- CORS صرف مطلوبہ domain کے لیے enable کریں۔
- Rate limiting لگائیں (express-rate-limit) تاکہ برے requests سے بچا جا سکے۔
- Helmet.js استعمال کریں HTTP headers secure کرنے کے لیے۔

### 2.3 UI/UX گائیڈ لائنز (چونکہ آپ نے HCI کا ذکر کیا)
- **Consistency:** تمام buttons، cards، fonts، colors ایک جیسے pattern میں ہوں۔
- **Feedback:** ہر action (Add to Cart, Order Placed) پر user کو فوری visual feedback (toast/animation) ملے۔
- **Visibility of System Status:** Loading states، skeleton loaders استعمال کریں۔
- **Error Prevention:** فارمز میں inline validation ہو، غلط input پہلے ہی روکا جائے۔
- **Accessibility:** Proper alt tags, keyboard navigation, contrast ratio (light theme میں بھی readable ہو)۔
- **Minimal Cognitive Load:** ایک وقت میں ضرورت سے زیادہ information نہ دکھائیں۔
- **Animations:** Framer Motion استعمال کریں — subtle، smooth، ہر جگہ overdo نہ کریں (page transitions, card hover, image zoom, button micro-interactions)۔

---

## 3. سسٹم آرکیٹیکچر (System Architecture)

```
                    ┌─────────────────────┐
                    │   React.js (Client)  │
                    │  - Customer Panel     │
                    │  - Admin Panel        │
                    └──────────┬───────────┘
                               │ REST API (Axios)
                    ┌──────────▼───────────┐
                    │   Express.js (Server) │
                    │  - Routes             │
                    │  - Controllers        │
                    │  - Middleware (Auth)  │
                    └──────────┬───────────┘
                               │ Mongoose ODM
                    ┌──────────▼───────────┐
                    │      MongoDB           │
                    │  Users | Products |    │
                    │  Orders | Settings     │
                    └───────────────────────┘
                               │
                    ┌──────────▼───────────┐
                    │  Cloudinary/S3         │
                    │  (Image Storage)       │
                    └───────────────────────┘
```

### 3.1 Backend فولڈر اسٹرکچر (Express.js)

```
server/
├── config/
│   ├── db.js                 # MongoDB connection
│   └── cloudinary.js
├── models/
│   ├── User.js
│   ├── Product.js
│   ├── Order.js
│   └── DeliverySettings.js
├── controllers/
│   ├── authController.js
│   ├── productController.js
│   ├── orderController.js
│   └── adminController.js
├── routes/
│   ├── authRoutes.js
│   ├── productRoutes.js
│   ├── orderRoutes.js
│   └── adminRoutes.js
├── middleware/
│   ├── authMiddleware.js      # verifyToken
│   ├── adminMiddleware.js     # isAdmin
│   └── errorMiddleware.js
├── utils/
│   ├── deliveryCalculator.js  # distance-based charge calculation
│   └── generateToken.js
├── .env
├── server.js
└── package.json
```

### 3.2 Frontend فولڈر اسٹرکچر (React.js)

```
client/
├── src/
│   ├── components/
│   │   ├── common/            # Navbar, Footer, Button, Loader
│   │   ├── product/           # ProductCard, ImageGallery, ColorSwitcher, SizeSelector
│   │   └── admin/              # ProductForm, OrdersTable, DeliverySettingsForm
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── ProductDetails.jsx
│   │   ├── Cart.jsx
│   │   ├── Checkout.jsx
│   │   ├── OrderSuccess.jsx
│   │   └── admin/
│   │       ├── Dashboard.jsx
│   │       ├── AddProduct.jsx
│   │       ├── ManageOrders.jsx
│   │       └── DeliverySettings.jsx
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   └── CartContext.jsx
│   ├── services/
│   │   └── api.js              # Axios instance
│   ├── hooks/
│   ├── styles/
│   └── App.jsx
```

---

## 4. ڈیٹا بیس ماڈلز (MongoDB Schemas)

### 4.1 Product Model
```js
{
  name: String,
  description: String,
  category: String,          // "Ladies", "Kids", "Men" etc.
  basePrice: Number,
  sizes: [String],           // ["S","M","L","XL"]
  colors: [
    {
      colorName: String,
      colorCode: String,     // hex code e.g. "#FF0000"
      images: [String],      // color-specific image URLs (jab color select ho to yehi images show hon)
      stock: Number
    }
  ],
  images360: [String],       // multi-angle / 360-view images array
  createdBy: ObjectId (Admin),
  isActive: Boolean,
  createdAt: Date
}
```
> **نوٹ (کلر تبدیلی والا فیچر):** ہر رنگ کے ساتھ اپنی الگ images array attach ہوگی۔ Frontend پر جب customer نیچے سے کلر سویچ کرے گا، تو Product image gallery اسی وقت اس کلر کی images پر switch ہو جائے گی (ری ایکٹ اسٹیٹ سے controlled)۔

### 4.2 Order Model
```js
{
  customer: {
    name: String,
    phone: String,
    address: String,
    city: String,
    latitude: Number,        // delivery distance calculation کے لیے
    longitude: Number
  },
  items: [
    {
      product: ObjectId,
      selectedColor: String,
      selectedSize: String,
      quantity: Number,
      price: Number
    }
  ],
  deliveryCharges: Number,   // auto-calculated
  totalAmount: Number,
  paymentMethod: { type: String, default: "COD" },
  orderStatus: String,       // Pending, Confirmed, Shipped, Delivered, Cancelled
  createdAt: Date
}
```

### 4.3 DeliverySettings Model (Admin کنٹرول)
```js
{
  ratePerKm: Number,         // مثلاً 5 روپے فی کلومیٹر
  baseCharge: Number,        // fixed minimum charge
  storeLocation: { lat: Number, lng: Number }
}
```
> ڈلیوری چارجز کا فارمولا: `totalCharge = baseCharge + (distanceInKm × ratePerKm)` — یہ calculation `deliveryCalculator.js` utility میں ہوگی اور Google Maps Distance Matrix API یا Haversine formula استعمال ہو سکتا ہے۔

### 4.4 User Model
```js
{
  name: String,
  email: String,
  password: String (hashed),
  role: { type: String, enum: ["customer","admin"], default: "customer" },
  phone: String
}
```

---

## 5. اہم API Endpoints

| Method | Route | تفصیل |
|---|---|---|
| POST | `/api/auth/register` | Customer/Admin سائن اپ |
| POST | `/api/auth/login` | لاگ ان |
| GET | `/api/products` | تمام پروڈکٹس (filters: category, size, color) |
| GET | `/api/products/:id` | سنگل پروڈکٹ ڈیٹیل |
| POST | `/api/products` | (Admin only) نیا پروڈکٹ ایڈ کریں |
| PUT | `/api/products/:id` | (Admin only) پروڈکٹ ایڈٹ |
| DELETE | `/api/products/:id` | (Admin only) پروڈکٹ ڈیلیٹ |
| POST | `/api/orders` | نیا آرڈر بک کریں (COD) |
| GET | `/api/orders` | (Admin) تمام آرڈرز |
| PUT | `/api/orders/:id/status` | (Admin) آرڈر اسٹیٹس اپڈیٹ |
| POST | `/api/delivery/calculate` | ڈسٹنس کے حساب سے چارجز calculate کریں |
| PUT | `/api/admin/delivery-settings` | (Admin) ریٹ فی کلومیٹر سیٹ کریں |

---

## 6. اہم فیچرز کی تفصیل

### 6.1 Product Images (Multi-angle / 360° View)
- ہر پروڈکٹ کی **کئی images** ہوں گی (front, back, side, zoom)۔ 
- React میں ایک **Image Gallery component** بنے گا جو swipe/drag یا thumbnail click سے angles کے درمیان switch کرے (react-360-view یا manual carousel سے بھی ممکن ہے)۔

### 6.2 Dynamic Color Switch
- جیسے ہی customer کسی رنگ پر کلک کرے، Product کی images اُس رنگ کی images سے replace ہو جائیں گی (state-driven, بغیر page reload)۔

### 6.3 Size اور اویلیبل کلرز
- ہر پروڈکٹ کے sizes اور colors dropdown/swatches کی صورت میں دکھیں گے، صرف وہی options دکھیں گے جو stock میں موجود ہیں۔

### 6.4 Cash on Delivery + Distance-Based Delivery Charges
- Checkout پر customer اپنا address (یا location pin) دے گا۔
- سسٹم store location اور customer location کے درمیان distance نکالے گا (Haversine formula یا Google Maps API)۔
- Admin کے مقرر کردہ rate per km کے حساب سے final delivery charge calculate ہو کر total میں شامل ہوگا۔

### 6.5 Admin Panel
- Product Add/Edit/Delete (images, sizes, colors, price)
- Orders Management (status update: Pending → Confirmed → Shipped → Delivered)
- Delivery Settings (rate per km, base charge)
- Dashboard (Total Orders, Revenue, Best-selling Products)

---

## 7. روڈ میپ (Development Roadmap)

### **Phase 1 — Planning & Setup (ہفتہ 1)**
- Requirements finalize, Wireframes/Figma design
- Repo setup (client + server), MongoDB Atlas setup
- Folder structure اور packages install

### **Phase 2 — Backend Development (ہفتہ 2–3)**
- User Authentication (JWT + bcrypt)
- Product CRUD APIs
- Order APIs
- Delivery Charge Calculation Logic
- Admin Middleware & Role-based Access

### **Phase 3 — Frontend Development (ہفتہ 4–6)**
- Home Page, Product Listing, Product Details (gallery + color/size selector)
- Cart & Checkout Flow
- Order Confirmation Page
- Admin Panel (Product Form, Orders Table, Delivery Settings)
- Light theme design system + Framer Motion animations

### **Phase 4 — Integration & Testing (ہفتہ 7)**
- Frontend-Backend Integration (Axios)
- Image Upload (Cloudinary) integration
- End-to-end testing (order placing، admin controls)
- Bug fixing

### **Phase 5 — Deployment (ہفتہ 8)**
- Backend Deploy: Render / Railway / VPS
- Frontend Deploy: Vercel / Netlify
- Database: MongoDB Atlas (production cluster)
- Domain + SSL setup
- Final QA

### **Phase 6 — Post-Launch (Optional Enhancements)**
- SMS/WhatsApp order notifications
- Customer reviews & ratings
- Wishlist feature
- Discount coupons
- Order tracking map

---

## 8. تجویز کردہ اضافی پیکجز

**Backend:** `express`, `mongoose`, `jsonwebtoken`, `bcryptjs`, `multer`, `cloudinary`, `cors`, `dotenv`, `express-validator`, `helmet`, `express-rate-limit`

**Frontend:** `axios`, `react-router-dom`, `framer-motion`, `react-icons`, `react-hot-toast` (feedback notifications), `tailwindcss` (fast, modern light-theme styling)

---

اگر آپ چاہیں تو میں اگلے مرحلے میں:
1. اس کا **Wireframe/UI mockup** بنا کر دکھا سکتا ہوں، یا
2. اصل **کوڈ (starter boilerplate)** بنا کر دے سکتا ہوں (Express + React + MongoDB سیٹ اپ کے ساتھ)۔

بتائیں کہ آپ کہاں سے شروع کرنا چاہیں گے۔