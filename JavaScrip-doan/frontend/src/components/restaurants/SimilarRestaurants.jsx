import { Link } from "react-router-dom";
import "./SimilarRestaurants.css";

const SimilarRestaurants = () => {
  const similarList = [
    {
      id: 1,
      name: "McDonald's London",
      logo: "https://1000logos.net/wp-content/uploads/2017/03/McDonalds-logo.png",
      bg: "#E2231A", // Đỏ
      barColor: "#cc1c14"
    },
    {
      id: 2,
      name: "Pizza Hut",
      logo: "https://logos-world.net/wp-content/uploads/2021/10/Pizza-Hut-Logo-2014-2019.png",
      bg: "#FF8A00", // Cam
      barColor: "#e67c00"
    },
    {
      id: 3,
      name: "KFC West London",
      logo: "https://1000logos.net/wp-content/uploads/2017/03/KFC-Logo.png",
      bg: "#F44336", // Đỏ nhạt
      barColor: "#dc3c31"
    },
    {
      id: 4,
      name: "Texas Chicken",
      logo: "https://logotypes101.com/logos/810/4328DA140DC27BC25A6B181996854DAF/texas_chicken_logo.png",
      bg: "#ffffff", // Trắng
      barColor: "#f2994a" // Dải màu cam
    },
    {
      id: 5,
      name: "Burger King",
      logo: "https://tse3.mm.bing.net/th/id/OIP.OWg3VucIsdJbARKDcDvINAHaEK?rs=1&pid=ImgDetMain&o=7&rm=3",
      bg: "#F5A623", // Vàng cam
      barColor: "#e0961f"
    },
    {
      id: 6,
      name: "Sà Bì Chưởng",
      logo: "https://nhaphonet.vn/wp-content/uploads/2023/04/sa-bi-chuong-ha-noi-do-mixi-pewpew-xemesis-1.jpg",
      bg: "#F2994A", // Cam nhạt
      barColor: "#d98942"
    }
  ];

  return (
    <div className="similar-wrapper mt-5 mb-5 pt-4">
      <div className="container">
        <h2 className="fw-bold mb-4">Similar Restaurants</h2>
        
        <div className="row">
          {similarList.map((restaurant, index) => (
            <div className="col-md-2 col-6 mb-4" key={index}>
              
              {/* Vẫn dùng thẻ Link để bấm vào là chuyển trang được */}
              <Link 
                to={`/restaurant/menu/${restaurant.id}`} 
                style={{ textDecoration: 'none' }}
              >
                <div 
                  className="similar-card" 
                  style={{ backgroundColor: restaurant.bg }}
                >
                  {/* Phần chứa Logo căn giữa */}
                  <div className="similar-logo-box">
                    <img src={restaurant.logo} alt={restaurant.name} />
                  </div>
                  
                  {/* Dải màu chứa tên nhà hàng ở đáy */}
                  <div 
                    className="similar-name-bar"
                    style={{ backgroundColor: restaurant.barColor }}
                  >
                    {restaurant.name}
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