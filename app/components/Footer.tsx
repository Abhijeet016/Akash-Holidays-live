import Image from 'next/image'

export default function Footer() {
  return (
    <div className="container-fluid bg-dark text-light footer pt-5 mt-5 wow fadeIn" data-wow-delay="0.1s">
      <div className="container py-5">
        <div className="row g-5">
          <div className="col-lg-3 col-md-6">
            <h4 className="text-white mb-3">Company</h4>
            <a className="btn btn-link" href="#about">About Us</a>
            <a className="btn btn-link" href="#contact">Contact Us</a>
          </div>
          <div className="col-lg-3 col-md-6">
            <h4 className="text-white mb-3">Contact</h4>
            <p className="mb-2"><i className="fa fa-map-marker-alt me-3"></i>Plot No 62, Shukla Vihar Para, Lucknow</p>
            <p className="mb-2"><i className="fa fa-phone-alt me-3"></i>+91 9839685724</p>
            <p className="mb-2">
              <i className="fa fa-envelope me-3"></i>
              <a href="mailto:pramod.srivastava1975@gmail.com" className="text-white text-decoration-none">pramod.srivastava1975@gmail.com</a>
            </p>
            <div className="d-flex pt-2">
              {['twitter','facebook-f','youtube','linkedin-in'].map(icon => (
                <a key={icon} className="btn btn-outline-light btn-social" href="#"><i className={`fab fa-${icon}`}></i></a>
              ))}
            </div>
          </div>
          <div className="col-lg-3 col-md-6">
            <h4 className="text-white mb-3">Gallery</h4>
            <div className="row g-2 pt-2">
              {['package-1.jpg','package-2.jpg','package-3.jpg','package-2.jpg','package-3.jpg','package-1.jpg'].map((img, i) => (
                <div key={i} className="col-4">
                  <Image className="img-fluid bg-light p-1" src={`/img/${img}`} alt="" width={80} height={60} style={{ objectFit: 'cover', width: '100%' }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="copyright">
          <div className="row">
            <div className="col-md-6 text-center text-md-start mb-3 mb-md-0">
              &copy; <a className="border-bottom" href="#">Akash Holidays</a>, All Right Reserved. Designed By <a className="border-bottom" href="#">Abhijeet</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
