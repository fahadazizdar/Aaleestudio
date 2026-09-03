# Aaleestudio — Premium E-Commerce Apparel Platform

A full-stack e-commerce apparel web application built with Express, MongoDB Atlas, React 18, Tailwind CSS, Framer Motion, and Lucide React.

## 🌟 Key Features

- **Protected Checkout & Customer Authentication**: Customers can browse products freely but must register and log in to book Cash on Delivery (COD) orders.
- **Dynamic Distance Delivery Calculation**: Delivery fees automatically calculate based on customer distance from store location using the Haversine formula.
- **Admin Control Portal**:
  - **Product Catalog Management**: Add/edit clothing with text-only color choices, multiple size options, and direct local system image uploads.
  - **Order Pipeline Control**: View all COD orders, update status (Pending, Confirmed, Shipped, Delivered, Cancelled).
  - **Customer Account Control**: Activate or deactivate customer accounts.
  - **Customer Inquiries Desk**: View and manage messages sent by users from the Contact Us page.
  - **Rules & Store Settings**: Dynamically update delivery charges, store address, contact helpline, and store policies.
  - **Mobile Hamburger Sidebar**: Smooth slide-over navigation drawer for mobile admin management.
- **Floating WhatsApp Customer Support**: Sticky WhatsApp widget for direct chat assistance with pre-filled message prompts.
- **Track Orders Link**: Instant order tracking accessible directly from top navigation bar.

## 🚀 Getting Started

### 1. Server Setup
```bash
cd server
npm install
# Create a .env file using .env.example template
npm start
```

### 2. Client Setup
```bash
cd client
npm install
npm run dev
```

## 🔒 Environment & Security
- `.env` files containing sensitive database connection strings are excluded via `.gitignore`.
- Reference `server/.env.example` to configure local database environment variables.
