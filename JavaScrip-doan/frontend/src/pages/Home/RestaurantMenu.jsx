import React, { useState, useEffect, useContext, useMemo } from "react";
import { useParams } from "react-router-dom";
import { CartContext } from "../../context/CartContext";
import { toast } from "react-toastify";

import { getRestaurantById, getDishesByRestaurantId } from "../../services/restaurantService";

// === IMPORT CÁC COMPONENT GIAO DIỆN ===
import RestaurantHero from "../../components/restaurants/RestaurantHero";
import MenuNav from "../../components/restaurants/MenuNav";
import DiscountOffers from "../../components/restaurants/DiscountOffers";
import MenuCategory from "../../components/restaurants/MenuCategory";
import CustomerReviews from "../../components/restaurants/CustomerReviews";
import SimilarRestaurants from "../../components/restaurants/SimilarRestaurants";
import AppBanner from "../../components/home/AppBanner";

// === IMPORT 3 BƯỚC POPUP ===
import ItemPopup from "../../components/restaurants/ItemPopup";
import CustomizationPopup from "../../components/restaurants/CustomizationPopup";
import InstructionPopup from "../../components/restaurants/InstructionPopup";

const RestaurantMenu = () => {
  const { id } = useParams();
  const { addToCart } = useContext(CartContext);

  const [restaurant, setRestaurant] = useState(null);
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedItem, setSelectedItem] = useState(null);
  const [popupStep, setPopupStep] = useState(1);

  useEffect(() => {
    const fetchRestaurantData = async () => {
      try {
        setLoading(true);
        setError("");

        const [restaurantData, dishesData] = await Promise.all([
          getRestaurantById(id),
          getDishesByRestaurantId(id),
        ]);

        setRestaurant(restaurantData);
        setDishes(Array.isArray(dishesData) ? dishesData : []);

        setRestaurant(restaurantData);
        setDishes(dishesData);
      } catch (err) {
        console.error("Lỗi tải dữ liệu nhà hàng:", err);
        setError("Không thể tải thông tin nhà hàng hoặc menu.");
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurantData();
  }, [id]);

  const groupedCategories = useMemo(() => {
    const groups = {};

    dishes.forEach((dish) => {
      const categoryName = dish.category || "Món khác";

      if (!groups[categoryName]) {
        groups[categoryName] = [];
      }

      groups[categoryName].push({
        id: dish.id,
        restaurantId: dish.restaurant_id || Number(id),
        name: dish.name,
        desc: dish.description || "Chưa có mô tả",
        price: dish.price,
        image: dish.image || "https://via.placeholder.com/300x200?text=Dish",
        categoryTitle: categoryName,
        extras: dish.extras || [],
      });
    });

    return Object.keys(groups).map((categoryTitle) => ({
      title: categoryTitle,
      items: groups[categoryTitle],
    }));
  }, [dishes, id]);

  const mappedRestaurant = useMemo(() => {
    if (!restaurant) return null;

    return {
      id: restaurant.id,
      name: restaurant.name,
      slogan: restaurant.category || "Delicious food delivered fast",
      bannerImg:
        restaurant.image ||
        "https://via.placeholder.com/1200x400?text=Restaurant+Banner",
      minOrder: "50K VND",
      deliveryTime: restaurant.time_delivery || "20-30 Minutes",
      openTime: "Open until 10:00 PM",
      rating: {
        score: Number(restaurant.rating || 0),
        count: "100+",
      },
      offers: [
        {
          discount: "-10%",
          title: "Ưu đãi hôm nay",
          image:
            restaurant.image ||
            "https://via.placeholder.com/300x200?text=Offer",
        },
        {
          discount: "FREE",
          title: "Miễn phí giao hàng",
          image:
            restaurant.image ||
            "https://via.placeholder.com/300x200?text=Offer",
        },
      ],
      reviews: [
        {
          name: "Khách hàng",
          location: "TP.HCM",
          date: "24/03/2026",
          rating: Number(restaurant.rating || 5),
          avatar: "https://i.pravatar.cc/100?img=12",
          text: "Món ăn ngon, giao hàng nhanh.",
        },
      ],
      categories: groupedCategories,
    };
  }, [restaurant, groupedCategories]);

  const handleOpenPopup = (item) => {
    setSelectedItem({
      ...item,
      quantity: 1,
    });
    setPopupStep(1);
  };

  const handleClosePopup = () => {
    setSelectedItem(null);
  };

  const handleGoToStep2 = (itemWithQuantityAndPrice) => {
    setSelectedItem(itemWithQuantityAndPrice);
    setPopupStep(2);
  };

  const handleGoToStep3 = (selectedOptions) => {
    setSelectedItem((prev) => ({
      ...prev,
      options: selectedOptions,
    }));
    setPopupStep(3);
  };

  const handleConfirmAddToCart = (instructionsText) => {
    const finalProduct = {
      ...selectedItem,
      instructions: instructionsText,
      restaurantId: mappedRestaurant?.id,
      restaurantName: mappedRestaurant?.name,
      restaurantImage: mappedRestaurant?.bannerImg,
    };

    addToCart(finalProduct);
    toast.success(`Đã thêm ${selectedItem.quantity} x ${selectedItem.name} vào giỏ!`);
    handleClosePopup();
  };

  if (loading) {
    return (
      <div className="container mt-4">
        <h3>Loading restaurant menu...</h3>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4">
        <h3 style={{ color: "red" }}>{error}</h3>
      </div>
    );
  }

  if (!mappedRestaurant) {
    return (
      <div className="container mt-4">
        <h3>Restaurant not found</h3>
      </div>
    );
  }

  return (
    <>
      <RestaurantHero restaurant={mappedRestaurant} />

      <MenuNav categories={mappedRestaurant.categories.map((cat) => cat.title)} />

      <DiscountOffers offers={mappedRestaurant.offers} />

      <div style={{ maxWidth: "1310px", margin: "0 auto" }}>
        {mappedRestaurant.categories.length > 0 ? (
          mappedRestaurant.categories.map((category, index) => (
            <MenuCategory
              key={index}
              title={category.title}
              items={category.items}
              onOpenPopup={handleOpenPopup}
            />
          ))
        ) : (
          <div className="container mt-4">
            <p>Nhà hàng này hiện chưa có món ăn.</p>
          </div>
        )}
      </div>

      <CustomerReviews
        reviews={mappedRestaurant.reviews}
        rating={mappedRestaurant.rating}
      />

      <SimilarRestaurants />

      <AppBanner />

      {selectedItem && popupStep === 1 && (
        <ItemPopup
          item={selectedItem}
          onClose={handleClosePopup}
          onNext={handleGoToStep2}
        />
      )}

      {selectedItem && popupStep === 2 && (
        <CustomizationPopup
          item={selectedItem}
          categoryTitle={selectedItem.categoryTitle}
          onClose={handleClosePopup}
          onBack={() => setPopupStep(1)}
          onNext={handleGoToStep3}
        />
      )}

      {selectedItem && popupStep === 3 && (
        <InstructionPopup
          item={selectedItem}
          categoryTitle={selectedItem.categoryTitle}
          onClose={handleClosePopup}
          onBack={() => setPopupStep(2)}
          onConfirm={handleConfirmAddToCart}
        />
      )}
    </>
  );
};

export default RestaurantMenu;