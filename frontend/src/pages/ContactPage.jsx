import React, { useState } from 'react';
import './ContactPage.css';

const ContactPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Here you would typically send the form data to your backend
        console.log('Contact form submitted:', formData);
        setSubmitted(true);
        setTimeout(() => {
            setSubmitted(false);
            setFormData({ name: '', email: '', subject: '', message: '' });
        }, 3000);
    };

    return (
        <div className="contact-page">
            <div className="contact-hero">
                <h1>Get In Touch</h1>
                <p>We'd love to hear from you</p>
            </div>

            <div className="contact-container container">
                <div className="contact-info">
                    <div className="info-card">
                        <div className="info-icon">📍</div>
                        <h3>Visit Us</h3>
                        <p>123 Fashion Avenue<br />New York, NY 10001</p>
                    </div>

                    <div className="info-card">
                        <div className="info-icon">📧</div>
                        <h3>Email Us</h3>
                        <p>info@bkshop.com<br />support@bkshop.com</p>
                    </div>

                    <div className="info-card">
                        <div className="info-icon">📞</div>
                        <h3>Call Us</h3>
                        <p>+1 (555) 123-4567<br />Mon-Fri 9AM-6PM EST</p>
                    </div>

                    <div className="info-card">
                        <div className="info-icon">🕐</div>
                        <h3>Business Hours</h3>
                        <p>Monday - Friday: 9AM - 6PM<br />Saturday: 10AM - 4PM</p>
                    </div>
                </div>

                <div className="contact-form-container">
                    <h2>Send Us a Message</h2>
                    {submitted && (
                        <div className="success-message">
                            Thank you! We'll get back to you soon.
                        </div>
                    )}
                    <form onSubmit={handleSubmit} className="contact-form">
                        <div className="form-row">
                            <div className="form-group">
                                <label>Your Name *</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    placeholder="John Doe"
                                />
                            </div>
                            <div className="form-group">
                                <label>Your Email *</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    placeholder="john@example.com"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Subject *</label>
                            <input
                                type="text"
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                required
                                placeholder="How can we help?"
                            />
                        </div>

                        <div className="form-group">
                            <label>Message *</label>
                            <textarea
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                required
                                rows="5"
                                placeholder="Tell us more about your inquiry..."
                            ></textarea>
                        </div>

                        <button type="submit" className="btn-primary">
                            Send Message
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;
