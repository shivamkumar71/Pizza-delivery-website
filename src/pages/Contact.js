import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { contactAPI } from '../utils/api';
import toast from 'react-hot-toast';
import './Contact.css';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await contactAPI.submit(form);
      toast.success('Message sent successfully! We\'ll get back to you soon.');
      setForm({ name: '', email: '', phone: '', message: '' });
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      className="contact-page"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
    >
      <div className="contact-header">
        <motion.h1
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.7 }}
          className="contact-title"
        >
          Get in Touch with <span className="brand-gradient">Anshu Pizza Corner</span>
        </motion.h1>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="contact-subtitle"
        >
          We love to hear from our pizza lovers! Fill out the form below or reach us at our head office.
        </motion.p>
      </div>
      <div className="contact-content container">
        <motion.form
          className="contact-form"
          initial={{ x: -40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={form.name}
            onChange={handleChange}
            required
            className="contact-input"
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={form.email}
            onChange={handleChange}
            required
            className="contact-input"
          />
          <input
            type="tel"
            name="phone"
            placeholder="Your Phone (Optional)"
            value={form.phone}
            onChange={handleChange}
            className="contact-input"
          />
          <textarea
            name="message"
            placeholder="Your Message"
            value={form.message}
            onChange={handleChange}
            required
            className="contact-textarea"
          />
          <motion.button
            type="submit"
            className="contact-btn"
            disabled={isLoading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isLoading ? (
              <>
                <div className="spinner"></div>
                Sending...
              </>
            ) : (
              'Send Message'
            )}
          </motion.button>
        </motion.form>
        <motion.div
          className="contact-info"
          initial={{ x: 40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          <h2 className="brand-gradient">Anshu Pizza Corner</h2>
          <p className="contact-address">
            <strong>Head Office:</strong><br />
            Vill &amp; Post Pipli Nayak,<br />
            Distt Rampur, UP 244925,<br />
            India
          </p>
          <p className="contact-email">Email: <a href="mailto:info@anshupizzacorner.com">deepkumar14379@gmail.com</a></p>
          <p className="contact-phone">Phone: <a href="tel:+919876543210">+917302165503</a></p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Contact;
