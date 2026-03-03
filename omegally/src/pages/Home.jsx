import React from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import Button from '../components/Button';
import products from '../data/products.json';
import styles from './Home.module.css';

const Home = () => {
  // Get all products for featured and category sections
  const featured = products.slice(0, 6); // Show first 6 as featured

  // Group products by category
  const categories = ['audio', 'wearables', 'accessories', 'cameras'];
  const productsByCategory = categories.reduce((acc, category) => {
    acc[category] = products.filter(p => p.category === category).slice(0, 4); // max 4 per category
    return acc;
  }, {});

  return (
    <div>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className="container">
          <h1 className={styles.heroTitle}>Shop Now, Pay Later</h1>
          <p className={styles.heroSubtitle}>
            Get the latest tech without breaking the bank. Choose flexible installment plans at checkout.
          </p>
          <Link to="/products">
            <Button variant="secondary" className={styles.heroButton}>Shop Collection</Button>
          </Link>
        </div>
      </section>

      {/* Featured Products */}
      <section className={styles.featured}>
        <div className="container">
          <h2 className={styles.sectionTitle}>Featured Products</h2>
          <div className={styles.productGrid}>
            {featured.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Banner 1 */}
      <section className={styles.banner}>
        <div className="container">
          <div className={styles.bannerContent} style={{ background: 'linear-gradient(135deg, #8b5cf6, #ec4899)' }}>
            <h3 className={styles.bannerTitle}>Summer Sale</h3>
            <p className={styles.bannerText}>Up to 30% off on select audio gear</p>
            <Link to="/products?category=audio">
              <Button variant="secondary" className={styles.bannerButton}>Shop Audio</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Category Sections */}
      {categories.map(category => {
        const catProducts = productsByCategory[category];
        if (!catProducts || catProducts.length === 0) return null;

        return (
          <section key={category} className={styles.categorySection}>
            <div className="container">
              <div className={styles.categoryHeader}>
                <h2 className={styles.sectionTitle}>{category.charAt(0).toUpperCase() + category.slice(1)}</h2>
                <Link to={`/products?category=${category}`} className={styles.seeMore}>
                  See More →
                </Link>
              </div>
              <div className={styles.productGrid}>
                {catProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </section>
        );
      })}

      {/* Banner 2 */}
      <section className={styles.banner}>
        <div className="container">
          <div className={styles.bannerContent} style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}>
            <h3 className={styles.bannerTitle}>New Arrivals</h3>
            <p className={styles.bannerText}>Check out the latest smartwatches and wearables</p>
            <Link to="/products?category=wearables">
              <Button variant="secondary" className={styles.bannerButton}>Shop Wearables</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
<section className={styles.benefits}>
  <div className="container">
    <h2 className={styles.sectionTitle}>Why Omegally?</h2>
    <div className={styles.benefitsGrid}>
      <div className={styles.benefitCard}>
        <div className={styles.benefitIconWrapper}>
          <span className={styles.benefitIcon}>📱</span>
        </div>
        <h3 className={styles.benefitTitle}>Instant Approval</h3>
        <p className={styles.benefitDesc}>No hidden fees, soft credit check only.</p>
      </div>
      <div className={styles.benefitCard}>
        <div className={styles.benefitIconWrapper}>
          <span className={styles.benefitIcon}>⏱️</span>
        </div>
        <h3 className={styles.benefitTitle}>Flexible Terms</h3>
        <p className={styles.benefitDesc}>Choose 3, 6, or 12 months.</p>
      </div>
      <div className={styles.benefitCard}>
        <div className={styles.benefitIconWrapper}>
          <span className={styles.benefitIcon}>🔒</span>
        </div>
        <h3 className={styles.benefitTitle}>Secure Payments</h3>
        <p className={styles.benefitDesc}>Your data is always protected.</p>
      </div>
    </div>
  </div>
</section>

      {/* Final CTA */}
      <section className={styles.cta}>
        <div className="container text-center">
          <h2 className={styles.ctaTitle}>Ready to upgrade?</h2>
          <p className={styles.ctaSubtitle}>Browse our latest arrivals and spread the cost.</p>
          <Link to="/products">
            <Button variant="primary" className={styles.ctaButton}>Start Shopping</Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;