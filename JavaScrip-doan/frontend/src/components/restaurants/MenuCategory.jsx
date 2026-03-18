import { useContext } from "react";
import { CartContext } from "../../context/CartContext";
import "./MenuCategory.css";

const MenuCategory = ({ title, items }) => {
  const { addToCart } = useContext(CartContext);

  return (
    <div className="container mt-5">
      
      <h2 className="category-title mb-4">{title}</h2>
      
      <div className="row">
        {items.map((item, index) => (
          <div className="col-md-6 mb-4" key={index}>
            
            <div className="food-card d-flex justify-content-between align-items-center">
              
              {/* LEFT */}
              <div className="food-info">
                <h5 className="food-name">{item.name}</h5>
                <p className="food-desc">{item.desc}</p>
                <p className="food-price">{item.price}</p>
              </div>

              {/* RIGHT */}
              <div className="food-image-box position-relative">
                <img 
                  src={item.image || item.img || "https://via.placeholder.com/80"} 
                  alt={item.name} 
                  className="food-img" 
                />

                <button 
                  className="add-btn"
                  onClick={() => addToCart({ ...item, quantity: 1 })}
                >
                  +
                </button>
              </div>

            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default MenuCategory;