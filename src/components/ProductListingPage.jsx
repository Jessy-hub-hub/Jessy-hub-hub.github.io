import React from "react";
import { gql, useQuery } from "@apollo/client";
import { useLocation, useNavigate } from "react-router-dom";
import { slugify } from "../utils/slugify.js";
import { useCart } from "../context/CartContext";
import cartImg from "../assets/shopping-cart.png"; // PNG import
import { toast, ToastContainer } from 'react-toastify';
import "./ProductListingPage.css";

const GET_CATEGORIES_AND_PRODUCTS = gql`
  query GetCategoriesAndProducts {
    products {
      id
      name
      inStock
      gallery
      prices {
        amount
        currency {
          symbol
        }
      }
      category
      attributes {
        id
        name
        type
        items {
          id
          displayValue
          value
        }
      }
    }
  }
`;

const getSlug = (product) => slugify(product.name);

const ProductListingPage = () => {
  const { loading, error, data } = useQuery(GET_CATEGORIES_AND_PRODUCTS);
  const { addToCart, openCartOverlay } = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const selectedCategory = location.pathname.split("/").filter(Boolean)[0] || "all";

  const filteredProducts =
    selectedCategory === "all"
      ? data.products
      : data.products.filter((p) => p.category === selectedCategory);

  const handleProductClick = (product) => {
    navigate(`/product/${getSlug(product)}`);
  };

  const handleQuickShop = (e, product) => {
    e.stopPropagation();
  
    if (!product.inStock) return;
  
    const defaultOptions =
      product.attributes?.reduce((acc, attribute) => {
        if (attribute.items?.length) {
          acc[attribute.id] = {
            value: attribute.items[0].value,
            displayValue: attribute.items[0].displayValue,
            type: attribute.type,
          };
        }
        return acc;
      }, {}) || {};
  
    const price = product.prices[0];
    const productWithPrice = {
      ...product,
      price,
      selectedAttributes: defaultOptions,
    };
  
    addToCart(productWithPrice, defaultOptions);
    openCartOverlay();
  
    const attrString = Object.entries(defaultOptions)
      .map(([key, val]) => `${key}: ${val.displayValue}`)
      .join(", ");
  
    toast.success(
      `Quick Shop: Added ${product.name} (${attrString}, Price: ${price.currency.symbol}${price.amount.toFixed(2)}) to cart.`,
      {
        autoClose: false, // No auto close
        position: toast.POSITION.TOP_RIGHT, // Position on the screen
        closeOnClick: true, // Allow closing the toast on click
        pauseOnHover: true, // Pause when hover over toast
      }
    ); // Added missing semicolon here
  };
  

  return (
    <div className="product-listing-page">
      <ToastContainer />
      <h1 className="category-title">
        {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}
      </h1>
      <div className="product-grid">
        {filteredProducts.map((product) => {
          const slug = getSlug(product);
          return (
            <div
              key={product.id}
              className={`product-card ${product.inStock ? "" : "out-of-stock"}`}
              data-testid={`product-${slug}`}
              onClick={() => handleProductClick(product)}
            >
              <div className="image-container">
                <img src={product.gallery[0]} alt={product.name} />
                {!product.inStock && (
                  <div className="out-of-stock-overlay" style={{ pointerEvents: "none" }}>
                    Out of Stock
                  </div>
                )}
              </div>
              <div className="product-details">
                <p className="product-name">{product.name}</p>
                <p className="product-price">
                  {product.prices[0]?.currency.symbol}
                  {product.prices[0]?.amount.toFixed(2)}
                </p>
              </div>
              {product.inStock && (
                <button
                  className="quick-shop"
                  onClick={(e) => handleQuickShop(e, product)}
                >
                  <img src={cartImg} alt="Quick Shop" className="cart-icon" />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductListingPage;
