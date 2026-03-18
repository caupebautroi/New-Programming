import "./Restaurants.css";
import { Link } from "react-router-dom";

const restaurants = [
  {
    id: 1,
    name: "McDonald",
    logo: "https://1000logos.net/wp-content/uploads/2017/03/McDonalds-logo.png",
    bg: "#E2231A"
  },
  {
    id: 2,
    name: "Pizza Hut",
    logo: "https://logos-world.net/wp-content/uploads/2021/10/Pizza-Hut-Logo-2014-2019.png",
    bg: "#FF8A00"
  },
  {
    id: 3,
    name: "KFC",
    logo: "https://1000logos.net/wp-content/uploads/2017/03/KFC-Logo.png",
    bg: "#F44336"
  },
  {
    id: 4,
    name: "Texas Chicken",
    logo: "https://logotypes101.com/logos/810/4328DA140DC27BC25A6B181996854DAF/texas_chicken_logo.png",
    bg: "#ffffff"
  },
  {
    id: 5,
    name: "Burger King",
    logo: "https://tse3.mm.bing.net/th/id/OIP.OWg3VucIsdJbARKDcDvINAHaEK?rs=1&pid=ImgDetMain&o=7&rm=3",
    bg: "#F5A623"
  },
  {
    id: 6,
    name: "Sà Bì Chưởng",
    logo: "https://nhaphonet.vn/wp-content/uploads/2023/04/sa-bi-chuong-ha-noi-do-mixi-pewpew-xemesis-1.jpg",
    bg: "#F2994A"
  }
];

const Restaurants = () => {
  return (
    <div className="container mt-5">
      <h4 className="restaurant-title">
        Popular Restaurants
      </h4>

      <div className="restaurant-grid">
        {restaurants.map((res, index) => (
          
          
          <Link 
            to={`/restaurant/menu/${res.id}`} 
            key={index}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <div className="restaurant-card">
              <div
                className="restaurant-logo"
                style={{ background: res.bg }}
              >
                <img src={res.logo} alt={res.name}/>
              </div>

              <div className="restaurant-name">
                {res.name}
              </div>
            </div>
          </Link>

        ))}
      </div>
    </div>
  )
}

export default Restaurants;