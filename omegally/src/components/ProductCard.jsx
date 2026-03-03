import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Button from './Button';
import Modal from './Modal';
import InstallmentCalculator from './InstallmentCalculator';
import styles from './ProductCard.module.css';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product);
    // Optional: add a small toast notification here
  };

  const handleQuickView = (e) => {
    e.preventDefault();
    setIsModalOpen(true);
  };

  return (
    <>
      <div className={styles.card}>
        <Link to={`/product/${product.id}`} className={styles.imageLink}>
          <img src={product.image} alt={product.name} className={styles.image} />
        </Link>
        <div className={styles.content}>
          <Link to={`/product/${product.id}`} className={styles.nameLink}>
            <h3 className={styles.name}>{product.name}</h3>
          </Link>
          <p className={styles.category}>{product.category}</p>
          <div className={styles.footer}>
            <span className={styles.price}>${product.price.toFixed(2)}</span>
            <div className={styles.actions}>
              <button
                className={styles.iconButton}
                onClick={handleQuickView}
                aria-label="Quick view"
                title="Quick view"
              >
                👁️
              </button>
              <button
                className={styles.iconButton}
                onClick={handleAddToCart}
                aria-label="Add to cart"
                title="Add to cart"
              >
                🛒
              </button>
            </div>
          </div>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={product.name}>
        <div className={styles.modalContent}>
          <img src={product.image} alt={product.name} className={styles.modalImage} />
          <p className={styles.modalDescription}>{product.description}</p>
          <p className={styles.modalPrice}>Price: ${product.price.toFixed(2)}</p>
          <InstallmentCalculator price={product.price} />
          <div className={styles.modalActions}>
            <Button variant="primary" onClick={() => { addToCart(product); setIsModalOpen(false); }}>
              Add to Cart
            </Button>
            <Link to={`/product/${product.id}`} onClick={() => setIsModalOpen(false)}>
              <Button variant="outline">View Full Details</Button>
            </Link>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ProductCard;