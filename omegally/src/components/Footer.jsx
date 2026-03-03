import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.footerContent}`}>
        {/* Brand & Newsletter */}
        <div className={styles.brandSection}>
          <Link to="/" className={styles.logo}>
            Omegally
          </Link>
          <p className={styles.tagline}>
            Shop now, pay later. Fresh tech for the youth.
          </p>
          <form onSubmit={handleSubscribe} className={styles.newsletter}>
            <h4 className={styles.newsletterTitle}>Stay in the loop</h4>
            <div className={styles.newsletterBox}>
              <input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={styles.newsletterInput}
              />
              <button type="submit" className={styles.newsletterButton}>
                Subscribe
              </button>
            </div>
            {subscribed && (
              <p className={styles.successMessage}>Thanks for subscribing!</p>
            )}
          </form>
        </div>

        {/* Links Columns */}
        <div className={styles.linksGrid}>
          <div className={styles.linksColumn}>
            <h4 className={styles.columnTitle}>Categories</h4>
            <ul className={styles.linkList}>
              <li><Link to="/products?category=audio" className={styles.link}>Audio</Link></li>
              <li><Link to="/products?category=wearables" className={styles.link}>Wearables</Link></li>
              <li><Link to="/products?category=accessories" className={styles.link}>Accessories</Link></li>
              <li><Link to="/products?category=cameras" className={styles.link}>Cameras</Link></li>
            </ul>
          </div>
          <div className={styles.linksColumn}>
            <h4 className={styles.columnTitle}>Support</h4>
            <ul className={styles.linkList}>
              <li><Link to="/help" className={styles.link}>Help Center</Link></li>
              <li><Link to="/returns" className={styles.link}>Returns</Link></li>
              <li><Link to="/shipping" className={styles.link}>Shipping</Link></li>
              <li><Link to="/contact" className={styles.link}>Contact Us</Link></li>
            </ul>
          </div>
          <div className={styles.linksColumn}>
            <h4 className={styles.columnTitle}>Company</h4>
            <ul className={styles.linkList}>
              <li><Link to="/about" className={styles.link}>About Us</Link></li>
              <li><Link to="/careers" className={styles.link}>Careers</Link></li>
              <li><Link to="/press" className={styles.link}>Press</Link></li>
              <li><Link to="/blog" className={styles.link}>Blog</Link></li>
            </ul>
          </div>
        </div>

        {/* Social & Payment Icons */}
        <div className={styles.socialSection}>
          <h4 className={styles.socialTitle}>Follow Us</h4>
          <div className={styles.socialIcons}>
            <a href="#" className={styles.socialIcon} aria-label="Instagram">
              <svg viewBox="0 0 24 24" width="24" height="24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.336 3.608 1.311.975.975 1.249 2.242 1.311 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.336 2.633-1.311 3.608-.975.975-2.242 1.249-3.608 1.311-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.336-3.608-1.311-.975-.975-1.249-2.242-1.311-3.608-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.062-1.366.336-2.633 1.311-3.608.975-.975 2.242-1.249 3.608-1.311 1.266-.058 1.646-.07 4.85-.07zm0-2.163c-3.259 0-3.667.014-4.947.072-1.281.058-2.448.348-3.449 1.35-1.002 1.001-1.292 2.168-1.35 3.449C2.014 8.333 2 8.741 2 12s.014 3.667.072 4.947c.058 1.281.348 2.448 1.35 3.449 1.001 1.002 2.168 1.292 3.449 1.35 1.28.058 1.688.072 4.947.072s3.667-.014 4.947-.072c1.281-.058 2.448-.348 3.449-1.35 1.002-1.001 1.292-2.168 1.35-3.449.058-1.28.072-1.688.072-4.947s-.014-3.667-.072-4.947c-.058-1.281-.348-2.448-1.35-3.449-1.001-1.002-2.168-1.292-3.449-1.35C15.667 2.014 15.259 2 12 2z" fill="currentColor"/>
                <circle cx="18.406" cy="5.594" r="1.44" fill="currentColor"/>
              </svg>
            </a>
            <a href="#" className={styles.socialIcon} aria-label="Twitter">
              <svg viewBox="0 0 24 24" width="24" height="24">
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-2.719 0-4.924 2.205-4.924 4.924 0 .386.044.762.127 1.122-4.09-.205-7.719-2.166-10.148-5.144-.423.725-.666 1.561-.666 2.457 0 1.697.863 3.194 2.176 4.072-.803-.026-1.558-.246-2.219-.614v.062c0 2.371 1.686 4.348 3.926 4.797-.411.112-.844.171-1.291.171-.316 0-.623-.031-.923-.089.624 1.948 2.434 3.366 4.579 3.406-1.678 1.315-3.792 2.099-6.092 2.099-.396 0-.788-.023-1.173-.068 2.179 1.397 4.768 2.212 7.548 2.212 9.057 0 14.009-7.504 14.009-14.009 0-.213-.005-.425-.014-.636.961-.694 1.796-1.562 2.457-2.549z" fill="currentColor"/>
              </svg>
            </a>
            <a href="#" className={styles.socialIcon} aria-label="TikTok">
              <svg viewBox="0 0 24 24" width="24" height="24">
                <path d="M19.59 6.69c-.14-.78-.42-1.49-.81-2.13-.42-.69-.98-1.27-1.65-1.74-.67-.47-1.43-.82-2.26-1.03-.86-.22-1.75-.34-2.68-.34-1.93 0-3.68.64-5.08 1.78-.81.66-1.48 1.47-1.99 2.39-.46.84-.77 1.76-.9 2.73-.08.56-.11 1.13-.11 1.71v1.42c0 .56.03 1.13.1 1.69.12.97.43 1.89.89 2.73.51.92 1.18 1.73 1.99 2.39 1.4 1.14 3.15 1.78 5.08 1.78 1.93 0 3.68-.64 5.08-1.78.81-.66 1.48-1.47 1.99-2.39.46-.84.77-1.76.9-2.73.08-.56.11-1.13.11-1.71v-1.42c0-.56-.03-1.13-.1-1.69-.12-.97-.43-1.89-.89-2.73-.51-.92-1.18-1.73-1.99-2.39-1.4-1.14-3.15-1.78-5.08-1.78v2.83c.99 0 1.95.27 2.78.79.82.51 1.48 1.22 1.95 2.06.3.54.5 1.13.6 1.75.07.41.1.83.1 1.25v1.42c0 .42-.03.84-.1 1.25-.1.62-.3 1.21-.6 1.75-.47.84-1.13 1.55-1.95 2.06-.83.52-1.79.79-2.78.79s-1.95-.27-2.78-.79c-.82-.51-1.48-1.22-1.95-2.06-.3-.54-.5-1.13-.6-1.75-.07-.41-.1-.83-.1-1.25v-1.42c0-.42.03-.84.1-1.25.1-.62.3-1.21.6-1.75.47-.84 1.13-1.55 1.95-2.06.83-.52 1.79-.79 2.78-.79V5.08c-1.99 0-3.85.7-5.3 1.87-.72.58-1.32 1.28-1.8 2.07-.43.72-.73 1.5-.88 2.33-.08.5-.12 1.01-.12 1.52v1.42c0 .51.04 1.02.12 1.52.15.83.45 1.61.88 2.33.48.79 1.08 1.49 1.8 2.07 1.45 1.17 3.31 1.87 5.3 1.87s3.85-.7 5.3-1.87c.72-.58 1.32-1.28 1.8-2.07.43-.72.73-1.5.88-2.33.08-.5.12-1.01.12-1.52v-1.42c0-.51-.04-1.02-.12-1.52-.15-.83-.45-1.61-.88-2.33-.48-.79-1.08-1.49-1.8-2.07-1.45-1.17-3.31-1.87-5.3-1.87z" fill="currentColor"/>
              </svg>
            </a>
          </div>
          <div className={styles.paymentIcons}>
            <span className={styles.paymentIcon}>💳</span>
            <span className={styles.paymentIcon}>💵</span>
            <span className={styles.paymentIcon}>🔒</span>
          </div>
        </div>
      </div>

      <div className={styles.copyright}>
        <p>© 2025 Omegally. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;