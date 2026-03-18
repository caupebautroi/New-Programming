import "./AppBanner.css";

const AppBanner = () => {
  return (
    <div className="app-banner container mt-5 mb-5">

      <div className="app-banner-card">

        {/* TEXT */}
        <div className="app-banner-info">
          <h2 className="fw-bold">Get the Order.vn App</h2>

          <p>
            Order food faster and track your delivery easily.
          </p>

          <div className="d-flex gap-3">

            <button className="btn-app app-store-btn">
              App Store
            </button>

            <button className="btn-app google-play-btn">
              Google Play
            </button>

          </div>
        </div>

        {/* IMAGE */}
        <div className="app-banner-img-box">
          <img
            src="https://images.unsplash.com/photo-1600891964599-f61ba0e24092"
            alt="Food banner"
          />
        </div>

      </div>

    </div>
  );
};

export default AppBanner;