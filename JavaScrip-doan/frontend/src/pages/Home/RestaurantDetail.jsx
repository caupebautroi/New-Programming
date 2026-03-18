import { useParams } from "react-router-dom"

const RestaurantDetail = () => {

  const { id } = useParams()

  return (
    <div className="container mt-4">

      <h2>Restaurant Detail</h2>

      <p>Restaurant ID: {id}</p>

      <img
        src="https://images.unsplash.com/photo-1550547660-d9450f859349"
        style={{width:"100%", borderRadius:"10px"}}
      />

      <div className="mt-3">

        <h4>Chef Burgers London</h4>

        <p>
          ⭐ 4.5 • 25-30 min • Burger • Fast food
        </p>

      </div>

    </div>
  )
}

export default RestaurantDetail