import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaClock, FaMapMarkerAlt, FaPhone, FaStar } from 'react-icons/fa';
import { pizzas } from '../data/pizzas';
import './Home.css';

const Home = () => {
  const popularPizzas = pizzas.filter(pizza => pizza.popular);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
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
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <motion.h1
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="hero-title"
          >
            Welcome to Anshu Pizza Corner
          </motion.h1>
          <motion.p
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hero-subtitle"
          >
            Delicious pizzas made with fresh ingredients and delivered to your doorstep
          </motion.p>
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="hero-buttons"
          >
            <Link to="/menu" className="btn btn-hover">
              Order Now
            </Link>
            <Link to="/menu" className="btn btn-secondary btn-hover">
              View Menu
            </Link>
          </motion.div>
        </div>
        <motion.div
          className="hero-image"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
        >
          🍕
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="features section">
        <div className="container">
          <motion.h2
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="section-title"
          >
            Why Choose Us?
          </motion.h2>
          <motion.div
            className="features-grid"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div className="feature-card" variants={itemVariants}>
              <div className="feature-icon">
                <FaClock />
              </div>
              <h3>Fast Delivery</h3>
              <p>Get your pizza delivered within 30 minutes or it's free!</p>
            </motion.div>
            
            <motion.div className="feature-card" variants={itemVariants}>
              <div className="feature-icon">
                <FaStar />
              </div>
              <h3>Fresh Ingredients</h3>
              <p>We use only the freshest and highest quality ingredients</p>
            </motion.div>
            
            <motion.div className="feature-card" variants={itemVariants}>
              <div className="feature-icon">
                <FaMapMarkerAlt />
              </div>
              <h3>Wide Coverage</h3>
              <p>We deliver to all major areas in the city</p>
            </motion.div>
            
            <motion.div className="feature-card" variants={itemVariants}>
              <div className="feature-icon">
                <FaPhone />
              </div>
              <h3>24/7 Support</h3>
              <p>Our customer support team is always ready to help</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Popular Pizzas Section */}
      <section className="popular-pizzas section">
        <div className="container">
          <motion.h2
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="section-title"
          >
            Our Popular Pizzas
          </motion.h2>
          <motion.div
            className="pizzas-grid"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {popularPizzas.map((pizza, index) => (
              <motion.div
                key={pizza.id}
                className="pizza-card card-hover"
                variants={itemVariants}
                whileHover={{ y: -10 }}
              >
                <div className="pizza-image">{pizza.image}</div>
                <div className="pizza-info">
                  <h3>{pizza.name}</h3>
                  <p>{pizza.description}</p>
                  <div className="pizza-meta">
                    <span className="price">₹{pizza.price}</span>
                    <div className="rating">
                      <FaStar />
                      <span>{pizza.rating}</span>
                    </div>
                  </div>
                  <Link to="/menu" className="btn btn-hover">
                    Order Now
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section section">
        <div className="container">
          <motion.div
            className="cta-content"
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <h2>Ready to Order?</h2>
            <p>Join thousands of satisfied customers who love our pizzas!</p>
            <div className="cta-buttons">
              <Link to="/menu" className="btn btn-hover">
                Start Ordering
              </Link>
              <Link to="/register" className="btn btn-secondary btn-hover">
                Create Account
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
