import React from 'react';
import { Link } from 'react-router-dom';
import './style.css';

const Footer = props => (
  <div className="app-footer-container">
    <div className="__footer-wrapper">
      <div className="__footer-about-section">
        <Link style={{textDecoration:"none",color:"#6f6f6f"}}to="/about" href="/about">
            About
        </Link>
      </div>
      <div className="__footer-helpful-links">
        <a
          rel="noopener noreferrer"
          target="_blank"
          href="https://www.thelifeyoucansave.org/learn-more/why-donate"
        >
            Why Donate?
        </a>
      </div>
    </div>
  </div>
);

export default Footer;
