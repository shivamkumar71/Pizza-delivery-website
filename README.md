# 🍕 Anshu Pizza Corner - Pizza Delivery App

A modern, responsive pizza delivery application built with React, featuring beautiful animations, a user-friendly interface, and comprehensive order management functionality.

## ✨ Features

### 🏠 **Home Page**
- Hero section with animated pizza graphics
- Feature highlights (Fast Delivery, Fresh Ingredients, Wide Coverage, 24/7 Support)
- Popular pizzas showcase
- Call-to-action sections

### 🍕 **Menu Page**
- 5 delicious pizza types with detailed information
- Advanced filtering and search functionality
- Category-based organization
- Size selection (Small, Medium, Large)
- Add to cart functionality

### 🛒 **Shopping Cart**
- Real-time cart management
- Quantity controls
- Size and price calculations
- Order summary with delivery fees
- Checkout process simulation

### 📋 **Order Management**
- Order history and tracking
- Real-time order status updates
- Delivery information and tracking
- Order details and item breakdown

### 👤 **User Profile**
- User account management
- Profile editing capabilities
- Address and contact information
- Account settings and preferences

### 🔐 **Authentication**
- User registration and login
- Secure authentication system
- Profile management
- Session persistence

## 🚀 **Pizza Types Available**

1. **Margherita Classic** - Traditional Italian pizza with fresh mozzarella, tomato sauce, and basil
2. **Pepperoni Supreme** - Spicy pepperoni slices with melted cheese and tangy tomato sauce
3. **Veggie Delight** - Fresh vegetables including bell peppers, mushrooms, onions, and olives
4. **Chicken Tikka** - Indian-inspired pizza with tender chicken tikka, onions, and coriander
5. **BBQ Chicken** - Smoky BBQ sauce with grilled chicken, red onions, and cilantro

## 🛠️ **Technology Stack**

- **Frontend**: React 18, React Router DOM
- **Styling**: CSS3, Styled Components
- **Animations**: Framer Motion
- **Icons**: React Icons
- **State Management**: React Context API
- **Notifications**: React Hot Toast
- **Data Fetching**: React Query
- **Build Tool**: Create React App

## 📱 **Responsive Design**

- Mobile-first approach
- Tablet and desktop optimized
- Touch-friendly interface
- Adaptive layouts for all screen sizes

## 🎨 **Design Features**

- Modern gradient backgrounds
- Smooth animations and transitions
- Interactive hover effects
- Beautiful card-based layouts
- Consistent color scheme
- Professional typography

## 🚀 **Getting Started**

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd anshu-pizza-corner
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Build for Production

```bash
npm run build
```

## 📁 **Project Structure**

```
src/
├── components/          # Reusable UI components
│   ├── Navbar.js       # Navigation component
│   └── Navbar.css      # Navigation styles
├── context/            # React Context providers
│   ├── AuthContext.js  # Authentication state
│   └── CartContext.js  # Shopping cart state
├── data/               # Static data and mock data
│   └── pizzas.js       # Pizza menu data
├── pages/              # Page components
│   ├── Home.js         # Home page
│   ├── Menu.js         # Menu page
│   ├── Cart.js         # Shopping cart
│   ├── Orders.js       # Order management
│   ├── Profile.js      # User profile
│   ├── Login.js        # Login page
│   ├── Register.js     # Registration page
│   └── *.css           # Page-specific styles
├── App.js              # Main application component
├── App.css             # Global application styles
├── index.js            # Application entry point
└── index.css           # Global styles
```

## 🔧 **Configuration**

### Environment Variables
Create a `.env` file in the root directory:

```env
REACT_APP_API_URL=your_api_endpoint
REACT_APP_STRIPE_PUBLIC_KEY=your_stripe_key
```

### Customization
- **Colors**: Modify CSS variables in `src/index.css`
- **Pizza Data**: Update `src/data/pizzas.js`
- **Styling**: Customize component-specific CSS files

## 📱 **Mobile Features**

- Touch-optimized interface
- Swipe gestures support
- Mobile-first responsive design
- Optimized for mobile performance

## 🎯 **Future Enhancements**

- **Payment Integration**: Stripe/PayPal integration
- **Real-time Tracking**: Live order tracking with maps
- **Push Notifications**: Order status updates
- **Loyalty Program**: Rewards and points system
- **Multi-language Support**: Internationalization
- **Dark Mode**: Theme switching capability
- **Offline Support**: PWA features

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 **Developer**

**Anshu Pizza Corner** - A complete pizza delivery solution for modern businesses.

## 🆘 **Support**

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🎉 **Demo Credentials**

**Login Demo:**
- Email: `demo@example.com`
- Password: `password123`

**Or register a new account** to explore all features!

---

**Enjoy your delicious pizza experience with Anshu Pizza Corner! 🍕✨**
