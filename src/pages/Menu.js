import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaStar, FaFilter, FaTimes, FaShoppingCart } from 'react-icons/fa';
import { pizzas, categories, sizes } from '../data/pizzas';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import './Menu.css';

const Menu = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('name');
  const [selectedSizes, setSelectedSizes] = useState({});
  const [sizeError, setSizeError] = useState({});
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const filteredPizzas = pizzas
    .filter(pizza => 
      selectedCategory === 'All' || pizza.category === selectedCategory
    )
    .filter(pizza =>
      pizza.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pizza.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return a.price - b.price;
        case 'rating':
          return b.rating - a.rating;
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

  const handleAddToCart = (pizza, size, quantity) => {
    if (!user) {
      toast.error('Please login to add items to cart');
      navigate('/login');
      return;
    }
    
    addToCart(pizza, size, quantity);
    toast.success(`${pizza.name} added to cart!`);
  };

    const handleSelectSize = (pizzaId, sizeName) => {
      setSelectedSizes(prev => ({ ...prev, [pizzaId]: sizeName }));
      setSizeError(prev => ({ ...prev, [pizzaId]: false }));
    };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="menu-page">
      <div className="menu-header">
        <div className="container">
          <motion.h1
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="page-title"
          >
            Our Pizza Menu
          </motion.h1>
          <motion.p
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="page-subtitle"
          >
            Choose from our delicious selection of 5 signature pizzas
          </motion.p>
        </div>
      </div>

      <div className="container">
        {/* Search and Filters */}
        <motion.div
          className="menu-controls"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search pizzas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filter-controls">
            <button
              className="filter-toggle"
              onClick={() => setShowFilters(!showFilters)}
            >
              <FaFilter />
              Filters
            </button>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="name">Sort by Name</option>
              <option value="price">Sort by Price</option>
              <option value="rating">Sort by Rating</option>
            </select>
          </div>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          className="category-filter"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          {categories.map((category) => (
            <button
              key={category}
              className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </motion.div>

        {/* Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              className="filters-panel"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="filters-content">
                <h3>Additional Filters</h3>
                <div className="filter-options">
                  <label>
                    <input type="checkbox" /> Vegetarian Only
                  </label>
                  <label>
                    <input type="checkbox" /> Spicy Pizzas
                  </label>
                  <label>
                    <input type="checkbox" /> Popular Items
                  </label>
                </div>
                <button
                  className="close-filters"
                  onClick={() => setShowFilters(false)}
                >
                  <FaTimes />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pizza Grid */}
        <motion.div
          className="pizza-grid"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {filteredPizzas.map((pizza) => (
            <motion.div
              key={pizza.id}
              className="pizza-item card-hover"
              variants={itemVariants}
              whileHover={{ y: -5 }}
            >
              <div className="pizza-image">
                {pizza.image}
                {pizza.popular && (
                  <span className="popular-badge">Popular</span>
                )}
                {pizza.spicy && (
                  <span className="spicy-badge">🌶️ Spicy</span>
                )}
                {pizza.vegetarian && (
                  <span className="veg-badge">🥬 Veg</span>
                )}
              </div>

              <div className="pizza-details">
                  <h3>{pizza.name}</h3>
                  <p className="pizza-description">{pizza.description}</p>
                  <div className="pizza-meta">
                    <div className="rating">
                      <FaStar />
                      <span>{pizza.rating}</span>
                      <small>({pizza.reviews} reviews)</small>
                    </div>
                    <div className="price">
                      ₹{
                        (() => {
                          const selectedSize = selectedSizes[pizza.id];
                          const sizeObj = sizes.find(s => s.name === selectedSize);
                          if (sizeObj) {
                            return Math.round(pizza.price * sizeObj.multiplier);
                          }
                          return pizza.price;
                        })()
                      }
                    </div>
                  </div>

                <div className="pizza-ingredients">
                  <strong>Ingredients:</strong>
                  <div className="ingredients-list">
                    {pizza.ingredients.map((ingredient, index) => (
                      <span key={index} className="ingredient-tag">
                        {ingredient}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pizza-actions">
                    <div className="size-selector">
                      {sizes.map((size) => (
                        <button
                          key={size.name}
                          className={`size-btn${selectedSizes[pizza.id] === size.name ? ' selected' : ''}`}
                          onClick={() => handleSelectSize(pizza.id, size.name)}
                        >
                          {size.label}
                          <small>₹{Math.round(pizza.price * size.multiplier)}</small>
                        </button>
                      ))}
                    </div>
                    <button
                        className="add-to-cart-btn"
                        onClick={() => {
                          const size = selectedSizes[pizza.id];
                          if (!size) {
                            setSizeError(prev => ({ ...prev, [pizza.id]: true }));
                            toast.error('Please select size');
                            return;
                          }
                          handleAddToCart(pizza, size, 1);
                        }}
                    >
                      <FaShoppingCart />
                      Add to Cart
                    </button>
                      {sizeError[pizza.id] && (
                        <div className="size-error" style={{ color: 'red', marginTop: '8px' }}>
                          Please select size
                        </div>
                      )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {filteredPizzas.length === 0 && (
          <motion.div
            className="no-results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h3>No pizzas found</h3>
            <p>Try adjusting your search or filters</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Menu;
