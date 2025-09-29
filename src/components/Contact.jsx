// src/components/Contact.jsx
import React, { useState } from "react";
import { db } from "../firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useAuth } from "../context/AuthContext"; // ✅ if you have auth context

function Contact() {
  const { currentUser } = useAuth(); // user info from Firebase Auth
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState("");

  // handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Sending...");

    try {
      await addDoc(collection(db, "contacts"), {
        ...formData,
        userId: currentUser ? currentUser.uid : null,
        createdAt: serverTimestamp(),
      });

      setStatus("✅ Message sent successfully!");
      setFormData({ name: "", email: "", message: "" }); // reset
    } catch (error) {
      console.error("Error sending message:", error);
      setStatus("❌ Failed to send. Try again.");
    }
  };

  return (
    <div className="content-card" id="contact">
      <h2>Contact Us</h2>
      <p>Have questions? Please fill out the form below.</p>

      <form onSubmit={handleSubmit}>
        <p>
          <input
            className="form-input"
            type="text"
            name="name"
            placeholder="Your Name"
            required
            value={formData.name}
            onChange={handleChange}
          />
        </p>
        <p>
          <input
            className="form-input"
            type="email"
            name="email"
            placeholder="Your Email"
            required
            value={formData.email}
            onChange={handleChange}
          />
        </p>
        <p>
          <textarea
            className="form-input"
            name="message"
            placeholder="Your Message"
            required
            value={formData.message}
            onChange={handleChange}
          ></textarea>
        </p>

        <p>
          <button className="btn btn-primary" type="submit">
            Send Message
          </button>
        </p>
      </form>

      {status && <p className="mt-2">{status}</p>}
    </div>
  );
}

export default Contact;