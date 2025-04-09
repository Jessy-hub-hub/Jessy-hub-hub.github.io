import React, { useRef, useEffect } from "react";
import { useCart } from "../context/CartContext";

const MiniCart = () => {
  const { isCartOverlayOpen, closeCartOverlay } = useCart();
  const cartRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cartRef.current && !cartRef.current.contains(event.target)) {
        closeCartOverlay();
      }
    };

    if (isCartOverlayOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    // Cleanup on unmount.
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isCartOverlayOpen, closeCartOverlay]);

  if (!isCartOverlayOpen) return null;

  return (
    <div ref={cartRef} className="minicart-overlay">
      {/* Render cart items here */}
      <p>Your Cart</p>
    </div>
  );
};

export default MiniCart;
