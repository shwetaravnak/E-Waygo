# EWaygo ♻️ | Centralized E-waste Facility Locator & Recycling Platform

## 📝 Project Overview

EWaygo is a centralized web-based e-waste facility locator and recycling management system designed to streamline and regulate electronic waste disposal through a single integrated platform. The system connects users, recycling centers, and administrators within one unified infrastructure, ensuring consistent data management, transparency, and operational control.

## ✨ Key Features

- **Advanced Facility Locator**: Instantly locate the nearest certified e-waste collection centers using our integrated mapping system.
- **Dedicated Recycling Workflows**: Specialized recycling forms for Smartphones, Laptops, Televisions, Refrigerators, Accessories, and Other Electronics.
- **My Bookings & Request Tracking**: Users can easily submit e-waste requests, track their ongoing request status, and manage all their past activity in a dedicated "My Bookings" interface.
- **Modern Premium UI**: A beautiful, fully responsive interface featuring dark mode support, dynamic gradients, and smooth Framer Motion animations.
- **Interactive Dashboards**: Authorized users have access to tailored dashboards to manage operations efficiently.
- **Admin Management Portal**: Comprehensive tools for administrators to manage/add e-waste centers, oversee user roles, and monitor site-wide operations.

## 🛠️ Technology Stack

- **Frontend**: Next.js (App Router), React 18, TailwindCSS, Framer Motion
- **Backend & APIs**: Node.js, Next.js Serverless API Routes
- **Database**: MongoDB (Mongoose)
- **Mapping & Routing**: Mapbox GL JS, Mapbox Geocoder & Directions API
- **Utilities**: EmailJS & Nodemailer for user notifications, Axios for data fetching
- **Deployment**: Vercel or Netlify ready

### Prerequisites

- Node.js (v18.17.0 or higher recommended)
- npm or yarn
- MongoDB connection string
- Mapbox API Key

### Installation

```bash
# Navigate to project directory
cd EWaygo

# Install dependencies
npm install

# Set up environment variables (You can reference .env.example)
cp .env.example .env.local

# Configure your .env.local file with required credentials:
# (e.g., MongoDB URI, Mapbox Access Token, Email configurations)

# Start development server
npm run dev
```

## 📊 Innovation & Learning

Through the development of EWaygo, key achievements include:

- Sophisticated geolocation and routing API implementation.
- Advanced full-stack application architecture using Next.js.
- Secure user authentication and robust role-based routing.
- State-of-the-art UI/UX patterns with a strong focus on dark mode aesthetics and premium gradients.
- Cross-platform responsive development strategies.

## 🔮 Future Expansion Roadmap

- **Innovative Reward System**: Users will be rewarded with points for recycling e-waste, which can be redeemed for discounts on future purchases.
- **Native Mobile Applications**: Dedicated Android and iOS apps for enhanced accessibility.
- **Enterprise Integration**: Tailored solutions for corporate entities and large organizations.
- **IoT Ecosystem**: Smart collection bins with real-time tracking and analytics.
- **Community Platform**: Collaborative network for environmentally conscious individuals.
