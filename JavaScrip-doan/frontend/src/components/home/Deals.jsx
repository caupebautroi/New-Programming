import "./Deals.css"

const deals = [
  {
    title: "Cơm Tấm Tài",
    discount: "-40%",
    img: "https://cdmedia.vn/image/catalog/Tintucquy12025/com-tam-sai-gon-bieu-tuong-am-thuc-hoi-tu-tinh-hoa-4-phuong-1.jpg"
  },
  {
    title: "Mì Quảng Anh Ba",
    discount: "-20%",
    img: "https://hivietnamtravel.com/wp-content/uploads/2020/03/maxresdefault-2.jpg"
  },
  {
    title: "Cháo Sườn Hàng Xanh",
    discount: "-17%",
    img: "https://cdn.tgdd.vn/Files/2021/09/03/1379923/cach-lam-chao-suon-ha-noi-thom-ngon-sanh-min-202109031346005366.jpg"
  }
]

const Deals = () => {
  return (
    <div className="container deals-section">

      <div className="deals-header">

        <h3>
          Up to -40% 🎉 Order.vn exclusive deals
        </h3>

        <div className="filters">
          <span>Vegan</span>
          <span>Sushi</span>
          <span className="active">Pizza & Fast food</span>
          <span>others</span>
        </div>

      </div>

      <div className="row">

        {deals.map((deal, index) => (
          <div className="col-md-4" key={index}>

            <div className="deal-card">

              <img src={deal.img} />

              <div className="discount">
                {deal.discount}
              </div>

              <div className="deal-info">

                <p className="restaurant">
                  Restaurant
                </p>

                <h5>
                  {deal.title}
                </h5>

              </div>

            </div>

          </div>
        ))}

      </div>

    </div>
  )
}

export default Deals