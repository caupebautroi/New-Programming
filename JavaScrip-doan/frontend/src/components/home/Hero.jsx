import "./Hero.css"

const Hero = () => {

  return (

    <div className="hero container mt-4">

      <div className="hero-left">

        <p className="hero-small">
          Order Restaurant food, takeaway and groceries.
        </p>

        <h1>
          Feast Your Senses, <br />
          <span>Fast and Fresh</span>
        </h1>

        <div className="hero-search">

          <input
            type="text"
            placeholder="e.g EC4R 3TE"
          />

          <button>
            Search
          </button>

        </div>

      </div>

      <div className="hero-right">

        <img
          src="https://images.unsplash.com/photo-1504674900247-0877df9cc836"
          alt=""
        />

      </div>

    </div>

  )
}

export default Hero