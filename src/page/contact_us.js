import React, { useState } from 'react';
import '../style/contact_us.css';
// import contactImage from './path/to/your/image.png'; 
import useDocumentTitle from '../utils/useDocumentTitles';
const ContactUs = () => {
    useDocumentTitle('Contact Us - RGreement');
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        course: '',
        receiveCalls: false,
        receiveUpdates: false
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
        // Add form submission logic here
    };

    return (
        <div className="contact-container">
            <div className="contact-header">
                <h3>Contact us</h3>
                <p>Fill out the form and our Support Manager will reach you within 24 hours.</p>
                {/* <p>You have an issue. We have a solution.</p> */}
            </div>
            <div className="contact-content">
                {/* <img src={contactImage} alt="Contact Us" className="contact-image" /> */}
                <img src="https://t3.ftcdn.net/jpg/06/17/17/46/360_F_617174640_zrZZdvZlgLzxaZn4VhA8bxRJLmDaukQE.jpg" alt="Contact Us" className="contact-image" />
                <form className="contact-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <input
                            type="text"
                            name="firstName"
                            placeholder="First Name"
                            value={formData.firstName}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="text"
                            name="lastName"
                            placeholder="Last Name"
                            value={formData.lastName}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="tel"
                            name="phone"
                            placeholder="Phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <select
                            name="course"
                            value={formData.course}
                            onChange={handleChange}
                            required
                        >
                            <option value="" disabled>Contact Reason</option>
                            <option value="course1">Need Friend to Chat</option>
                            <option value="course2">House Inquiry</option>
                            <option value="course3">Issue Resolution</option>
                        </select>
                    </div>
                    <div className="form-group checkbox-group">
                        <label>
                            <input
                                type="checkbox"
                                name="receiveCalls"
                                checked={formData.receiveCalls}
                                onChange={handleChange}
                            />
                            Yes, I agree to receive phone calls and emails from RGreement.
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                name="receiveUpdates"
                                checked={formData.receiveUpdates}
                                onChange={handleChange}
                            />
                            Yes, I would like to receive updates and news from Rgreement via Email.
                        </label>
                    </div>
                    <button type="submit" className="submit-btn">Submit Application</button>
                </form>
            </div>
        </div>
    );
};

export default ContactUs;
