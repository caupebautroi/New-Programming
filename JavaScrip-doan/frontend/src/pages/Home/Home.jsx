import Hero from "../../components/home/Hero"
import Deals from "../../components/home/Deals"
import Categories from "../../components/home/Categories"
import Restaurants from "../../components/home/Restaurants"
import AppBanner from "../../components/home/AppBanner"

const Home = () => {
  return (
    <div>

      <Hero />

      <Categories />

      <Deals />

      <Restaurants />

      <AppBanner />

    </div>
  )
}

export default Home