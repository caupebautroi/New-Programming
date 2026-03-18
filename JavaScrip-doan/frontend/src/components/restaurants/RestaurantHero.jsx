import "./RestaurantHero.css";

const RestaurantHero = ({ restaurant }) => {
  if (!restaurant) return null;

  return (
    <div className="container mt-4 mb-5">
      
      {/* Banner */}
      <div 
        className="hero-banner-card"
        style={{ 
          backgroundImage: `linear-gradient(rgba(11, 26, 48, 0.7), rgba(11, 26, 48, 0.9)), url(${restaurant.bannerImg})`
        }}
      >
        
        {/* LEFT CONTENT */}
        <div className="hero-content">

          {/* slogan (có fallback) */}
          <p className="hero-slogan">
            {restaurant.slogan || "Delicious food, delivered fast"}
          </p>

          {/* name */}
          <h1 className="hero-title">
            {restaurant.name || "Restaurant Name"}
          </h1>
          
          {/* badges */}
          <div className="hero-badges">

            <div className="hero-badge-outline">
              <span className="me-2">📄</span> 
              Minimum Order: {restaurant.minOrder || "50,000 VND"}
            </div>

            <div className="hero-badge-outline">
              <span className="me-2">🛵</span> 
              Delivery in {restaurant.deliveryTime || "30 mins"}
            </div>

          </div>
        </div>

        {/* OPEN TIME */}
        <div className="hero-open-time">
          🕒 {restaurant.openTime || "08:00 - 22:00"}
        </div>

        {/* RATING */}
        <div className="hero-rating-card">
          <h2 className="rating-score">
            {restaurant.rating?.score || "4.5"}
          </h2>

          <div className="rating-stars">⭐⭐⭐⭐⭐</div>

          <p className="rating-count">
            {restaurant.rating?.count || "0"} reviews
          </p>
        </div>

      </div>

      {/* BOTTOM BAR */}
      <div className="d-flex justify-content-between align-items-center hero-bottom-bar">

        <h3 className="fw-bold m-0">
          All Offers from {restaurant.name || "this restaurant"}
        </h3>

        <div className="search-input-box">
          <span className="text-muted">🔍</span>
          <input type="text" placeholder="Search from menu..." />
        </div>

      </div>
    </div>
  );
};

export default RestaurantHero;