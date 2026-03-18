import "./DiscountOffers.css";

// Nhận mảng offers từ file chính truyền vào
const DiscountOffers = ({ offers }) => {
  
  // Nếu nhà hàng nào không có offer thì ẩn khối này đi luôn cho gọn
  if (!offers || offers.length === 0) return null;

  return (
    <div className="container mt-5 mb-5">
      <div className="row">
        {offers.map((offer, index) => (
          <div className="col-md-4 mb-4" key={index}>
            
            <div className="offer-card" style={{ backgroundImage: `url(${offer.image})` }}>
              <div className="offer-overlay"></div>
              
              <div className="offer-discount">{offer.discount}</div>
              
              <div className="offer-content">
                <p className="offer-restaurant">{offer.restaurant}</p>
                <h4 className="offer-title">{offer.title}</h4>
              </div>
              
              <button className="offer-add-btn">
                <span className="fw-bold fs-4">+</span>
              </button>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default DiscountOffers;