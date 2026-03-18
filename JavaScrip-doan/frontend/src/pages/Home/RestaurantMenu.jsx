import { useParams } from "react-router-dom";
import { useContext } from "react";
import { CartContext } from "../../context/CartContext";

import RestaurantHero from "../../components/restaurants/RestaurantHero";
import MenuNav from "../../components/restaurants/MenuNav";
import DiscountOffers from "../../components/restaurants/DiscountOffers";
import MenuCategory from "../../components/restaurants/MenuCategory";
import CustomerReviews from "../../components/restaurants/CustomerReviews";
import SimilarRestaurants from "../../components/restaurants/SimilarRestaurants";
import AppBanner from "../../components/home/AppBanner";

// ✅ FULL DATA 6 RESTAURANTS (ĐÃ FIX image)
const restaurantDatabase = {
  "1": { 
    name: "McDonald's Điện Biên Phủ",
    slogan: "I'm lovin' it!",
    bannerImg: "https://images.unsplash.com/photo-1550547660-d9450f859349",
    minOrder: "150K VND",
    deliveryTime: "20-25 Minutes",
    openTime: "Open until 3:00 AM",
    rating: { score: 4.5, count: "1,360" },
    reviews: [
      { name: "John Doe", location: "Quận 1", date: "15/03/2026", rating: 5, avatar: "https://i.pravatar.cc/100?img=11", text: "Giao hàng cực nhanh, burger còn nóng hổi." },
      { name: "Anna Smith", location: "Bình Thạnh", date: "10/03/2026", rating: 4, avatar: "https://i.pravatar.cc/100?img=5", text: "Khoai tây chiên giòn." }
    ],
    offers: [
      { discount: "-20%", title: "First Order Discount", image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f" },
      { discount: "-15%", title: "Vegan Discount", image: "https://images.unsplash.com/photo-1498837167922-ddd27525d352" },
      { discount: "FREE", title: "Free Ice Cream Offer", image: "https://images.unsplash.com/photo-1559703248-dcaaec9fab78" }
    ],
    categories: [
      {
        title: "Burgers",
        items: [
          { name: "Big Mac", desc: "100% bò nguyên chất Úc", price: "80,000 VND", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd" },
          { name: "Double Cheeseburger", desc: "Gấp đôi phô mai béo ngậy", price: "65,000 VND", image: "https://images.unsplash.com/photo-1553979459-d2229ba7433b" },
          { name: "Chicken Burger", desc: "Gà giòn rụm", price: "70,000 VND", image: "https://images.unsplash.com/photo-1606755962773-d324e0a13086" }
        ]
      },
      {
        title: "Fries",
        items: [
          { name: "Khoai tây chiên (L)", desc: "Giòn rụm, vàng ươm", price: "40,000 VND", image: "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5" }
        ]
      }
    ]
  },

  "2": { 
    name: "Pizza Hut Trần Hưng Đạo",
    slogan: "Make It Great",
    bannerImg: "https://images.unsplash.com/photo-1513104890138-7c749659a591",
    minOrder: "200K VND",
    deliveryTime: "30-40 Minutes",
    openTime: "Open until 10:00 PM",
    rating: { score: 4.2, count: "840" },
    reviews: [
      { name: "Minh Tuấn", location: "Gò Vấp", date: "14/03/2026", rating: 4, avatar: "https://i.pravatar.cc/100?img=12", text: "Pizza ngon." },
      { name: "Hải Yến", location: "Quận 3", date: "12/03/2026", rating: 5, avatar: "https://i.pravatar.cc/100?img=9", text: "Bánh còn nóng." }
    ],
    offers: [
      { discount: "-50%", title: "2nd Pizza Half Price", image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38" },
      { discount: "FREE", title: "Free Coke 1.5L", image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97" },
      { discount: "-10%", title: "Weekend Treat", image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002" }
    ],
    categories: [
      {
        title: "Pizzas",
        items: [
          { name: "Hải Sản Nhiệt Đới", desc: "Tôm, mực, dứa", price: "189,000 VND", image: "https://images.unsplash.com/photo-1513104890138-7c749659a591" },
          { name: "Cơn Lốc Phô Mai", desc: "4 loại phô mai", price: "159,000 VND", image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002" }
        ]
      },
      {
        title: "Món phụ",
        items: [
          { name: "Bánh mì bơ tỏi", desc: "Giòn thơm", price: "45,000 VND", image: "https://tse1.mm.bing.net/th/id/OIP.yq4mdchnaBN-19_yamGP1wHaEw?rs=1&pid=ImgDetMain&o=7&rm=3" }
        ]
      }
    ]
  },

  "3": { 
    name: "KFC Cộng Hòa",
    slogan: "It's Finger Lickin' Good",
    bannerImg: "https://images.unsplash.com/photo-1516685018646-54919852fdc3", 
    minOrder: "100K VND",
    deliveryTime: "15-20 Minutes",
    openTime: "Open until 11:00 PM",
    rating: { score: 4.3, count: "2,150" },
    reviews: [
      { name: "Quốc Khánh", location: "Tân Bình", date: "16/03/2026", rating: 5, avatar: "https://i.pravatar.cc/100?img=15", text: "Gà rán giòn rụm đúng chuẩn KFC, nước ngọt lạnh buốt." },
      { name: "Bảo Ngọc", location: "Quận 7", date: "09/03/2026", rating: 4, avatar: "https://i.pravatar.cc/100?img=20", text: "Mọi thứ đều ổn, chỉ là không có tương cà đi kèm." }
    ],
    offers: [
      { discount: "FREE", restaurant: "KFC", title: "Free Pepsi for Combos", image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97" },
      { discount: "-20%", restaurant: "KFC", title: "Family Bucket Sale", image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec" },
      { discount: "-15%", restaurant: "KFC", title: "Zinger Burger Deal", image: "https://png.pngtree.com/png-clipart/20241011/original/pngtree-zinger-burger-mania-a-guide-to-making-the-perfect-spicy-chicken-png-image_16266377.png" }
    ],
    categories: [
      { title: "Gà rán", items: [
          { name: "Combo 2 Miếng Gà", desc: "Gà giòn cay hoặc không cay", price: "85,000 VND", img: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec" },
          { name: "Gà quay tiêu", desc: "Gà quay giấy bạc sốt tiêu đen", price: "90,000 VND", img: "https://images.unsplash.com/photo-1606368884638-71e84a275f1d" }
      ]},
      { title: "Burger", items: [
          { name: "Burger Zinger", desc: "Phi-lê gà cay kẹp bánh mì", price: "60,000 VND", img: "https://images.unsplash.com/photo-1615486171448-4fc1eb25dc22" }
      ]}
    ]
  },

  "4": { 
    name: "Texas Chicken Nguyễn Thái Học",
    slogan: "100% Gà Tươi",
    bannerImg: "https://images.unsplash.com/photo-1589301760014-d929f39ce9b1",
    minOrder: "120K VND",
    deliveryTime: "25-30 Minutes",
    openTime: "Open until 10:30 PM",
    rating: { score: 4.6, count: "920" },
    reviews: [
      { name: "Thanh Bình", location: "Quận 10", date: "11/03/2026", rating: 5, avatar: "https://i.pravatar.cc/100?img=33", text: "Bánh quy bơ mật ong là chân ái! Gà miếng to, thịt mềm." }
    ],
    offers: [
      { discount: "FREE", restaurant: "Texas", title: "Free Honey Biscuit", image: "https://tse3.mm.bing.net/th/id/OIP._wfy3oqLxI3ppuT9nfCCCQHaHa?rs=1&pid=ImgDetMain&o=7&rm=3" },
      { discount: "-25%", restaurant: "Texas", title: "Mega Combo Sale", image: "https://static.hotdeal.vn/images/1132/1131535/500x500/301774-toan-he-thong-ga-tuoi-texas-chicken-combo-3-mon-an-tha-ga.jpg" },
      { discount: "-10%", restaurant: "Texas", title: "Student Discount", image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f" }
    ],
    categories: [
      { title: "Combo Gà", items: [
          { name: "Combo 3 Miếng Gà", desc: "Gà tươi 100%, 1 nước, 1 khoai", price: "115,000 VND", img: "https://static.hotdeal.vn/images/1132/1131535/500x500/301774-toan-he-thong-ga-tuoi-texas-chicken-combo-3-mon-an-tha-ga.jpg" }
      ]},
      { title: "Bánh ngọt", items: [
          { name: "Bánh quy bơ mật ong", desc: "Đặc sản Texas Chicken", price: "25,000 VND", img: "https://tse1.explicit.bing.net/th/id/OIP.2QkTs9bxrK2_9wh-mKoX3wHaFj?rs=1&pid=ImgDetMain&o=7&rm=3" }
      ]}
    ]
  },

  "5": { 
    name: "Burger King Phạm Ngũ Lão",
    slogan: "Have It Your Way",
    bannerImg: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90",
    minOrder: "150K VND",
    deliveryTime: "20-30 Minutes",
    openTime: "Open until 2:00 AM",
    rating: { score: 4.1, count: "530" },
    reviews: [
      { name: "David Trần", location: "Phú Nhuận", date: "08/03/2026", rating: 4, avatar: "https://i.pravatar.cc/100?img=51", text: "Whopper bò nướng lửa hồng hương vị rất đặc trưng." },
      { name: "Mai Thy", location: "Quận 5", date: "05/03/2026", rating: 5, avatar: "https://i.pravatar.cc/100?img=42", text: "Ngon, rẻ, giao hàng siêu nhanh." }
    ],
    offers: [
      { discount: "-20%", restaurant: "Burger King", title: "Whopper Meal Deal", image: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90" },
      { discount: "FREE", restaurant: "Burger King", title: "Free French Fries", image: "https://static.fanpage.it/wp-content/uploads/sites/22/2020/09/iStock-618214356.jpg" },
      { discount: "-15%", restaurant: "Burger King", title: "King Saver Combo", image: "https://images.unsplash.com/photo-1550547660-d9450f859349" }
    ],
    categories: [
      { title: "Whopper", items: [
          { name: "Whopper Bò Nướng", desc: "Bò nướng lửa hồng đặc trưng", price: "95,000 VND", img: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90" },
          { name: "Whopper Gà", desc: "Gà chiên xù giòn tan", price: "85,000 VND", img: "https://tse4.mm.bing.net/th/id/OIP.jhm5WqRTXnqC-bTYuYr51wHaE8?rs=1&pid=ImgDetMain&o=7&rm=3" }
      ]}
    ]
  },

  "6": { 
    name: "Cơm Tấm Sà Bì Chưởng",
    slogan: "Ngon từ thịt, ngọt từ xương",
    bannerImg: "https://images.unsplash.com/photo-1615361200141-f45040f367be", 
    minOrder: "50K VND",
    deliveryTime: "10-15 Minutes",
    openTime: "Open until 11:30 PM",
    rating: { score: 4.8, count: "9,999" },
    reviews: [
      { name: "Mixi Fan", location: "Tân Phú", date: "16/03/2026", rating: 5, avatar: "https://i.pravatar.cc/100?img=60", text: "Sườn to bằng cái mặt, cắn ngập răng anh em ạ. 10 điểm không có nhưng!" },
      { name: "PewPew View", location: "Quận 4", date: "14/03/2026", rating: 5, avatar: "https://i.pravatar.cc/100?img=65", text: "Chả chưng hột vịt muối đỉnh của chóp." }
    ],
    offers: [
      { discount: "FREE", restaurant: "Sà Bì Chưởng", title: "Tặng 1 Trà Đá", image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc" },
      { discount: "-10%", restaurant: "Sà Bì Chưởng", title: "Combo 2 Người", image: "https://tse1.mm.bing.net/th/id/OIP.XMIt-50WJ0d7lV0nkS3G-QHaHa?w=800&h=800&rs=1&pid=ImgDetMain&o=7&rm=3" },
      { discount: "-20%", restaurant: "Sà Bì Chưởng", title: "Sườn Cây Giảm Giá", image: "https://tse1.explicit.bing.net/th/id/OIP.YMdiMsN4-49_trB6UrjWdgHaHa?w=1500&h=1500&rs=1&pid=ImgDetMain&o=7&rm=3" }
    ],
    categories: [
      { title: "Cơm Tấm", items: [
          { name: "Cơm Tấm Sườn Bì Chả", desc: "Sườn nướng than hoa mềm ngọt", price: "75,000 VND", img: "https://www.shutterstock.com/image-photo/vietnamese-combination-broken-rice-600nw-2323020645.jpg" },
          { name: "Cơm Tấm Sườn Cây", desc: "Sườn non nguyên cây mọng nước", price: "95,000 VND", img: "https://tse4.mm.bing.net/th/id/OIP.yLDdvZNyI_a876RPw5VX6QHaEL?rs=1&pid=ImgDetMain&o=7&rm=3" }
      ]},
      { title: "Thức uống", items: [
          { name: "Trà đá", desc: "Mát lạnh giải nhiệt", price: "5,000 VND", img: "https://images.unsplash.com/photo-1556679343-c7306c1976bc" }
      ]}
    ]
  }
};

const RestaurantMenu = () => {
  const { id } = useParams();
  const { addToCart } = useContext(CartContext);

  const currentRestaurant = restaurantDatabase[id];

  if (!currentRestaurant) {
    return <h2>Restaurant not found</h2>;
  }

  return (
    <>
      <RestaurantHero restaurant={currentRestaurant} />

      <MenuNav />

      <DiscountOffers offers={currentRestaurant.offers} />

      {currentRestaurant.categories.map((category, index) => (
        <MenuCategory
          key={index}
          title={category.title}
          items={category.items}
          addToCart={addToCart}
        />
      ))}

      <CustomerReviews
        reviews={currentRestaurant.reviews}
        rating={currentRestaurant.rating}
      />

      <SimilarRestaurants />

      <AppBanner />
    </>
  );
};

export default RestaurantMenu;