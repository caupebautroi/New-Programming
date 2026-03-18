import "./Categories.css"

const categories = [
  {
    name: "Burgers & Fast food",
    restaurants: "21 Restaurants",
    img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500"
  },
  {
    name: "Salads",
    restaurants: "32 Restaurants",
    img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500"
  },
  {
    name: "Pasta & Casuals",
    restaurants: "4 Restaurants",
    img: "https://images.unsplash.com/photo-1525755662778-989d0524087e?w=500"
  },
  {
    name: "Pizza",
    restaurants: "32 Restaurants",
    img: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500"
  },
  {
    name: "Breakfast",
    restaurants: "4 Restaurants",
    img: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=500"
  },
  {
    name: "Soups",
    restaurants: "32 Restaurants",
    img: "https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?auto=format&w=500"
  }
]

const Categories = () => {
  return (
    <div className="container mt-5">

      <h4 className="category-title">
        Order.vn Popular Categories 🍔
      </h4>

      <div className="categories-grid">

        {categories.map((cat, index) => (

          <div className="category-card" key={index}>

            <div className="category-image">
              <img src={cat.img} alt={cat.name}/>
            </div>

            <div className="category-info">
              <h6>{cat.name}</h6>
              <p>{cat.restaurants}</p>
            </div>

          </div>

        ))}

      </div>

    </div>
  )
}

export default Categories