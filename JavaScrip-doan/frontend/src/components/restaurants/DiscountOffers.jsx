import "./DiscountOffers.css";

const DiscountOffers = ({ offers }) => {
  if (!offers || offers.length === 0) return null;

  return (
    <div className="container mt-5 mb-5">
      <div className="row">
        {offers.map((offer, index) => (
          <div className="col-md-4 mb-4" key={index}>
            <div
              className="offer-card"
              style={{
                backgroundImage: `url(${offer.image || "https://via.placeholder.com/300x200?text=Offer"})`,
              }}
            >
              <div className="offer-overlay"></div>

              <div className="offer-discount">{offer.discount || "Hot"}</div>

              <div className="offer-content">
                <p className="offer-restaurant">
                  {offer.restaurant || "Order.vn Offer"}
                </p>
                <h4 className="offer-title">{offer.title || "Special Offer"}</h4>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DiscountOffers;