import "./Hero.css";

const Hero = () => {
  return (
    <div className="hero container mt-4">
      <div className="hero-left">
        <p className="hero-small">
          Order food from your favorite restaurants near you.
        </p>

        <h1>
          Fast Delivery, <br />
          <span>Fresh and Delicious</span>
        </h1>

        <div className="hero-search">
          <input type="text" placeholder="Enter your delivery address" />
          <button>Search</button>
        </div>
      </div>

      <div className="hero-right">
        <img
          src="https://images.unsplash.com/photo-1504674900247-0877df9cc836"
          alt="Food delivery"
        />
      </div>
    </div>
  );
};

export default Hero;