# 🛒 Local Mart - Hyper-Local C2C E-Commerce Application

Local Mart is a mobile-first, hyper-local consumer-to-consumer (C2C) marketplace designed to buy and sell pre-owned items within neighborhoods with verified local doorstep delivery. Built for zero-friction mobile web and ready to be packaged into an Android APK via Capacitor.

---

## 🚀 Key Features

- **Flipkart-Standard Mobile UI**: Signature blue sticky app header, real-time live search, category horizontal slider, and location selector.
- **Hyper-Local Radius & GPS**: Detects local neighborhood location (e.g. HSR Layout, Koramangala) within a 5 km safe trade radius.
- **Doorstep Verification & Delivery**: Eliminates direct seller-buyer awkward meetups or phone number leaks. Delivery partners pick up and drop items directly.
- **Full-Stack Reactive Engine (`app.js`)**:
  - Live product search & filtering
  - Local database store (`LocalStorageDB`) with seed listings
  - "Post an Item" seller workflow with instant listing reflection
  - Product details view with item inspection and distance badges
  - 3-step checkout with GPS location detect and payment options (UPI, Cards, COD)
  - Live Order confirmation & step-by-step rider tracking
  - Delivery Partner Portal with task accept/complete triggers and earnings calculator
  - Admin Panel with real-time KPI metrics and order management
- **Floating Native Bottom Navigation**: Prominent elevated circular `Sell (+)` action button and quick tabs.
- **Dark & Light Mode Support**: Built-in system preference listener and settings toggle.
- **Capacitor & Android APK Ready**: Sized to native 414px / 480px mobile viewports with simulated phone shells for desktop preview.

---

## 📂 Project Architecture

```
local-mart/
├── index.html                 # Root Full-Stack Application Portal
├── README.md                  # Project documentation & setup instructions
├── .gitignore                 # Version control exclusions
├── public/
│   ├── css/
│   │   └── style.css          # Master Mobile-First CSS (Enterprise Native UI)
│   ├── js/
│   │   └── app.js            # Full-Stack Client Engine & Reactive State Store
│   └── assets/
│       ├── images/            # Graphic assets & logos
│       └── icons/             # Custom iconography
└── src/
    ├── pages/
    │   ├── home.html          # Main Marketplace Feed & Search
    │   ├── login.html         # Google Auth Login Screen
    │   ├── categories.html    # 2-Column Category Browser
    │   ├── sell.html          # Sell / Post Item Form
    │   ├── product-detail.html# Item Details & Doorstep Buy
    │   ├── checkout.html      # 3-Section Billing & Payment Gateway
    │   ├── order-success.html # Live Order Tracking & Status
    │   ├── profile.html       # User Profile & Active Listings
    │   ├── settings.html      # App Preferences & Dark Mode Toggle
    │   ├── delivery-dashboard.html # Delivery Partner Task Portal
    │   └── admin-dashboard.html    # Admin Analytics & Order Monitor
    ├── components/            # Reusable UI modules
    └── firebase/
        └── firebase-config.js # Modular Firebase & Auth configuration
```

---

## 🛠️ Quick Start & Running Locally

1. Open the project folder in VS Code or any editor.
2. Launch `index.html` or `src/pages/home.html` using **Live Server** or open directly in any modern web browser.
3. Everything runs out of the box with built-in reactive storage!

---

## 📱 Building the Android APK (Capacitor)

```bash
# 1. Install Capacitor CLI
npm init -y
npm i --save @capacitor/core @capacitor/cli @capacitor/android

# 2. Initialize Capacitor
npx cap init "Local Mart" "com.localmart.app" --web-dir "."

# 3. Add Android platform
npx cap add android

# 4. Sync web assets
npx cap sync android

# 5. Open in Android Studio & Build APK
npx cap open android
```

---

## 📄 License
MIT License. Built with passion for local communities.
