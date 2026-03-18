import "./CustomerReviews.css";

// Nhận 2 cục dữ liệu: reviews (danh sách đánh giá) và rating (điểm số tổng)
const CustomerReviews = ({ reviews, rating }) => {
  
  // Kiểm tra an toàn: Nếu không có dữ liệu thì không render gì cả
  if (!reviews || !rating) return null;

  return (
    <div className="reviews-wrapper mt-5 pt-5 pb-5">
      <div className="container">
        
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold mb-0">Customer Reviews</h2>
          <div className="d-flex gap-2">
            <button className="nav-btn">{"<"}</button>
            <button className="nav-btn">{">"}</button>
          </div>
        </div>

        <div className="row mb-5">
          {reviews.map((review, index) => (
            <div className="col-md-4 mb-3" key={index}>
              <div className="review-card">
                
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div className="d-flex align-items-center gap-3">
                    <img src={review.avatar} alt={review.name} className="reviewer-avatar" />
                    <div>
                      <h6 className="mb-0 fw-bold">{review.name}</h6>
                      <small className="reviewer-location">{review.location}</small>
                    </div>
                  </div>
                  
                  <div className="text-end">
                    <div className="text-warning mb-1">{"⭐".repeat(review.rating)}</div>
                    <small className="text-muted d-flex align-items-center gap-1">
                      <span>🕒</span> {review.date}
                    </small>
                  </div>
                </div>

                <p className="review-text">{review.text}</p>
                
              </div>
            </div>
          ))}
        </div>

        {/* Khối Tổng điểm linh động */}
        <div className="overall-rating-box mx-auto text-center">
          <h1 className="rating-number">{rating.score}</h1>
          <div className="text-warning fs-5">⭐⭐⭐⭐<span className="text-muted">⭐</span></div>
          <p className="text-muted mt-2">{rating.count} reviews</p>
        </div>

      </div>
    </div>
  );
};

export default CustomerReviews;