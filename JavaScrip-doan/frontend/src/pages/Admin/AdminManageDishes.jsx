import { useEffect, useState } from "react";
import { getAllRestaurants } from "../../services/restaurantService";
import {
  getDishesByRestaurant,
  addDish,
  updateDish,
  deleteDish,
} from "../../services/dishService";

const emptyForm = {
  name: "",
  price: "",
  image: "",
  description: "",
  category: "",
};

const AdminManageDishes = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState("");
  const [dishes, setDishes] = useState([]);
  const [loadingRestaurants, setLoadingRestaurants] = useState(true);
  const [loadingDishes, setLoadingDishes] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState(emptyForm);
  const [editingDishId, setEditingDishId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchRestaurants = async () => {
    try {
      setLoadingRestaurants(true);
      const data = await getAllRestaurants();
      const restaurantList = Array.isArray(data) ? data : [];
      setRestaurants(restaurantList);

      if (restaurantList.length > 0) {
        setSelectedRestaurantId(String(restaurantList[0].id));
      }
    } catch (err) {
      console.error("Lỗi lấy nhà hàng:", err);
      setError("Không thể tải danh sách nhà hàng.");
    } finally {
      setLoadingRestaurants(false);
    }
  };

  const fetchDishes = async (restaurantId) => {
    if (!restaurantId) return;

    try {
      setLoadingDishes(true);
      const data = await getDishesByRestaurant(restaurantId);
      setDishes(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Lỗi lấy món ăn:", err);
      setError("Không thể tải danh sách món ăn.");
    } finally {
      setLoadingDishes(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  useEffect(() => {
    if (selectedRestaurantId) {
      fetchDishes(selectedRestaurantId);
    }
  }, [selectedRestaurantId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingDishId(null);
  };

  const handleEdit = (dish) => {
    setEditingDishId(dish.id);
    setForm({
      name: dish.name || "",
      price: dish.price || "",
      image: dish.image || "",
      description: dish.description || "",
      category: dish.category || "",
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (dishId) => {
    const confirmed = window.confirm("Bạn có chắc muốn xóa món này không?");
    if (!confirmed) return;

    try {
      await deleteDish(dishId);
      setDishes((prev) => prev.filter((dish) => dish.id !== dishId));
    } catch (err) {
      console.error("Lỗi xóa món:", err);
      alert("Xóa món thất bại.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedRestaurantId) {
      alert("Vui lòng chọn nhà hàng.");
      return;
    }

    if (!form.name.trim() || !form.price.trim()) {
      alert("Vui lòng nhập tên món và giá.");
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        restaurant_id: Number(selectedRestaurantId),
        name: form.name,
        price: form.price,
        image: form.image,
        description: form.description,
        category: form.category,
      };

      if (editingDishId) {
        const updated = await updateDish(editingDishId, payload);

        setDishes((prev) =>
          prev.map((dish) =>
            dish.id === editingDishId
              ? { ...dish, ...(updated || payload), id: editingDishId }
              : dish
          )
        );
      } else {
        const created = await addDish(payload);

        const newDish = {
          id: created?.id || Date.now(),
          ...payload,
        };

        setDishes((prev) => [...prev, newDish]);
      }

      resetForm();
    } catch (err) {
      console.error("Lỗi lưu món:", err);
      alert("Lưu món thất bại.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingRestaurants) {
    return (
      <div className="container mt-4">
        <h2>Admin - Manage Dishes</h2>
        <p>Loading restaurants...</p>
      </div>
    );
  }

  return (
    <div className="container mt-4 mb-5">
      <h2 className="mb-4">Admin - Manage Dishes</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <div className="card p-4 mb-4 shadow-sm">
        <h4 className="mb-3">
          {editingDishId ? "Edit Dish" : "Add New Dish"}
        </h4>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Restaurant</label>
            <select
              className="form-select"
              value={selectedRestaurantId}
              onChange={(e) => setSelectedRestaurantId(e.target.value)}
            >
              {restaurants.map((restaurant) => (
                <option key={restaurant.id} value={restaurant.id}>
                  {restaurant.name}
                </option>
              ))}
            </select>
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Dish Name</label>
              <input
                type="text"
                className="form-control"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter dish name"
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Price</label>
              <input
                type="text"
                className="form-control"
                name="price"
                value={form.price}
                onChange={handleChange}
                placeholder="Example: 89.000đ"
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Image URL</label>
            <input
              type="text"
              className="form-control"
              name="image"
              value={form.image}
              onChange={handleChange}
              placeholder="Enter image URL"
            />
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Category</label>
              <input
                type="text"
                className="form-control"
                name="category"
                value={form.category}
                onChange={handleChange}
                placeholder="Example: Gà rán"
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Description</label>
              <input
                type="text"
                className="form-control"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Short description"
              />
            </div>
          </div>

          <div className="d-flex gap-2">
            <button className="btn btn-success" type="submit" disabled={submitting}>
              {submitting
                ? "Saving..."
                : editingDishId
                ? "Update Dish"
                : "Add Dish"}
            </button>

            {editingDishId && (
              <button
                className="btn btn-secondary"
                type="button"
                onClick={resetForm}
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="card p-4 shadow-sm">
        <h4 className="mb-3">Dish List</h4>

        {loadingDishes ? (
          <p>Loading dishes...</p>
        ) : dishes.length === 0 ? (
          <p>Nhà hàng này chưa có món ăn nào.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-bordered align-middle">
              <thead className="table-dark">
                <tr>
                  <th>ID</th>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Description</th>
                  <th width="160">Actions</th>
                </tr>
              </thead>

              <tbody>
                {dishes.map((dish) => (
                  <tr key={dish.id}>
                    <td>{dish.id}</td>
                    <td>
                      <img
                        src={
                          dish.image ||
                          "https://via.placeholder.com/80?text=Dish"
                        }
                        alt={dish.name}
                        width="70"
                        height="70"
                        style={{ objectFit: "cover", borderRadius: "8px" }}
                        onError={(e) => {
                          e.target.src =
                            "https://via.placeholder.com/80?text=Dish";
                        }}
                      />
                    </td>
                    <td>{dish.name}</td>
                    <td>{dish.category || "N/A"}</td>
                    <td>{dish.price}</td>
                    <td>{dish.description || "N/A"}</td>
                    <td>
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-warning btn-sm"
                          onClick={() => handleEdit(dish)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(dish.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminManageDishes;