import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import "./SimilarRestaurants.css";

// IMPORT HÀM GỌI API: Nhớ sửa lại đường dẫn cho đúng với cấu trúc thư mục của bạn
import { getAllRestaurants } from "../../services/restaurantService"; 

const SimilarRestaurants = () => {
  const { id } = useParams(); // Lấy ID của nhà hàng đang xem
  const [similarList, setSimilarList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSimilar = async () => {
      try {
        setLoading(true);
        // Gọi API lấy toàn bộ danh sách nhà hàng từ Database
        const data = await getAllRestaurants();
        
        // LỌC: Loại bỏ nhà hàng đang xem hiện tại và chỉ lấy tối đa 6 quán
        const filtered = data
          .filter((res) => res.id.toString() !== id)
          .slice(0, 6); 

        setSimilarList(filtered);
      } catch (error) {
        console.error("Lỗi lấy danh sách nhà hàng tương tự:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSimilar();
  }, [id]); // Chạy lại hàm này nếu ID trên URL thay đổi (khách click sang quán khác)

  // Nếu đang tải hoặc không có quán nào thì tạm ẩn đi
  if (loading || similarList.length === 0) return null;

  return (
    <div className="similar-wrapper mt-5 mb-5 pt-4">
      <div className="container">
        <h2 className="fw-bold mb-4">Similar Restaurants</h2>

        <div className="row">
          {similarList.map((restaurant) => (
            <div className="col-md-4 col-6 mb-4" key={restaurant.id}>
              <Link
                to={`/restaurant/menu/${restaurant.id}`}
                style={{ textDecoration: "none" }}
              >
                <div className="similar-card">
                  <div className="similar-logo-box">
                    <img
                      src={
                        restaurant.image ||
                        "https://via.placeholder.com/300x200?text=No+Image"
                      }
                      alt={restaurant.name}
                      onError={(e) => {
                        // Nếu link ảnh trong DB bị lỗi/chết, tự động thay bằng ảnh dự phòng
                        e.target.src = "https://via.placeholder.com/300x200?text=Food";
                      }}
                    />
                  </div>

                  <div className="similar-name-bar">
                    <div className="similar-title">{restaurant.name || "Chưa có tên"}</div>
                    <div className="similar-category">{restaurant.category || "Đang cập nhật"}</div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SimilarRestaurants;