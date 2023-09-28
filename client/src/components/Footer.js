import React from 'react';
import { Link } from 'react-router-dom';


const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="social-icon">
          <ul className="social-icon__item">
            <li>
              <Link to="#" className="social-icon__link">
              <i className="fa-brands fa-linkedin"></i>
              </Link>
            </li>
            <li>
              <Link to="#" className="social-icon__link">
              <i className="fa-brands fa-github"></i>
              </Link>
            </li>
            <li>
              <Link to="#" className="social-icon__link">
              <i className="fa-brands fa-instagram"></i>
              </Link>
            </li>
          </ul>
        </div>
        <div className="menu">
          <ul className="menu__item">
            <li>
              <Link to="#" className="menu__link">
                Home
              </Link>
            </li>
            <li>
              <Link to="#" className="menu__link">
                About Us
              </Link>
            </li>
            <li>
              <Link to="#" className="menu__link">
                Services
              </Link>
            </li>
            <li>
              <Link to="#" className="menu__link">
                Blog
              </Link>
            </li>
          </ul>
        </div>
        <p>© 2023 ContentCraft. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
