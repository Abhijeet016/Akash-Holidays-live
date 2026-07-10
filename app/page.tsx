import Navbar from './components/Navbar'
import Footer from './components/Footer'
import BookingForm from './components/BookingForm'
import PackagesSection from './components/PackagesSection'
import Hero from './components/Hero'

const API = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000'

type Package = { _id: string; img: string; dest: string; nights: string; persons: string; price: string; desc: string }
type TeamMember = { _id: string; img: string; name: string; role: string }
type Testimonial = { _id: string; name: string; loc: string; text: string }

async function getPackages() {
  try {
    const res = await fetch(`${API}/api/packages`, { cache: 'no-store' })
    if (!res.ok) return []
    return res.json()
  } catch { return [] }
}

async function getTeam() {
  try {
    const res = await fetch(`${API}/api/team`, { cache: 'no-store' })
    if (!res.ok) return []
    return res.json()
  } catch { return [] }
}

async function getTestimonials() {
  try {
    const res = await fetch(`${API}/api/testimonials`, { cache: 'no-store' })
    if (!res.ok) return []
    return res.json()
  } catch { return [] }
}

export default async function Home() {
  const [packages, team, testimonials]: [Package[], TeamMember[], Testimonial[]] = await Promise.all([getPackages(), getTeam(), getTestimonials()])
  return (
    <>
      <Navbar />
      <Hero packages={packages} />

      {/* About */}
      <div className="container-xxl py-5" id="about">
        <div className="container">
          <div className="row g-5">
            <div className="col-lg-6 wow fadeInUp" data-wow-delay="0.1s" style={{ minHeight: 400 }}>
              <div className="position-relative h-100 about-video-wrapper">
                <img className="about-poster-img" src="/img/NewImage.jpg" alt="about" style={{ width:'100%',height:'100%',objectFit:'cover',borderRadius:12,position:'absolute',top:0,left:0,zIndex:1 }} />
                <video className="about-bg-video" autoPlay loop muted playsInline poster="/img/NewImage.jpg" style={{ width:'100%',height:'100%',objectFit:'cover',borderRadius:12,position:'relative',zIndex:2 }}>
                  <source src="/img/Cruise3.mp4" type="video/mp4" />
                </video>
              </div>
            </div>
            <div className="col-lg-6 wow fadeInUp" data-wow-delay="0.3s">
              <h6 className="section-title bg-white text-start text-primary pe-3">About Us</h6>
              <h1 className="mb-4">Welcome to <span style={{ background: 'linear-gradient(90deg, #a259c6 0%, #ff4d4d 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', fontWeight: 900 }}>Akash Holidays</span></h1>
              <p className="mb-4">At Akash Holidays, we believe that travel is not just about reaching a destination, but experiencing every moment along the journey. Situated in the heart of Lucknow, our travel agency is dedicated to making your travel dreams come true.</p>
              <p className="mb-4">Our mission is to provide travelers with a convenient, personalized, and reliable travel experience with the best travel deals and efficient booking processes.</p>
              <div className="row gy-2 gx-4 mb-4">
                {['Flight Bookings','Handpicked Hotels','Hotel Bookings','Latest Model Vehicles','Tours And Packages','Luxury Cruise Tour'].map(item => (
                  <div key={item} className="col-sm-6">
                    <p className="mb-0"><i className="fa fa-arrow-right text-primary me-2"></i>{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Services */}
      <div className="container-xxl py-5" id="services">
        <div className="container">
          <div className="text-center wow fadeInUp" data-wow-delay="0.1s">
            <h6 className="section-title bg-white text-center text-primary px-3">Services</h6>
            <h1 className="mb-5">Our Services</h1>
          </div>
          <div className="row g-4">
            {[
              { icon: 'globe',  title: 'WorldWide Tours',    desc: 'Embark on a journey and your Luxury across the globe with Akash Holidays.' },
              { icon: 'hotel',  title: 'Hotel Reservation',  desc: 'Finding the perfect place to stay has never been easier. We provide accommodations at cheap rates.' },
              { icon: 'user',   title: 'Travel Guides',      desc: 'Make your travel experience richer with our expert travel guides.' },
              { icon: 'cog',    title: 'Travel Plans',       desc: 'We specialize in creating unforgettable Travel Plans, whether it\'s a destination wedding or corporate retreat.' },
            ].map((s, i) => (
              <div key={s.title} className="col-lg-3 col-sm-6 wow fadeInUp" data-wow-delay={`${0.1 + i * 0.2}s`}>
                <div className="service-item rounded pt-3">
                  <div className="p-4">
                    <i className={`fa fa-3x fa-${s.icon} text-primary mb-4`}></i>
                    <h5>{s.title}</h5>
                    <p>{s.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Destination */}
      <div className="container-xxl py-5 destination" id="destination">
        <div className="container">
          <div className="text-center wow fadeInUp" data-wow-delay="0.1s">
            <h6 className="section-title bg-white text-center text-primary px-3">Destination</h6>
            <h1 className="mb-5">Popular Destination</h1>
          </div>
          <div className="row g-3">
            <div className="col-lg-7 col-md-6">
              <div className="row g-3">
                <div className="col-lg-12 col-md-12 wow zoomIn" data-wow-delay="0.1s">
                  <a className="position-relative d-block overflow-hidden" href="#">
                    <img className="img-fluid" src="/img/destination-1.jpg" alt="Thailand" />
                    <div className="bg-white text-danger fw-bold position-absolute top-0 start-0 m-3 py-1 px-2">30% OFF</div>
                    <div className="bg-white text-primary fw-bold position-absolute bottom-0 end-0 m-3 py-1 px-2">Thailand</div>
                  </a>
                </div>
                <div className="col-lg-6 col-md-12 wow zoomIn" data-wow-delay="0.3s">
                  <a className="position-relative d-block overflow-hidden" href="#">
                    <img className="img-fluid" src="/img/destination-2.jpg" alt="Malaysia" />
                    <div className="bg-white text-danger fw-bold position-absolute top-0 start-0 m-3 py-1 px-2">25% OFF</div>
                    <div className="bg-white text-primary fw-bold position-absolute bottom-0 end-0 m-3 py-1 px-2">Malaysia</div>
                  </a>
                </div>
                <div className="col-lg-6 col-md-12 wow zoomIn" data-wow-delay="0.5s">
                  <a className="position-relative d-block overflow-hidden" href="#">
                    <img className="img-fluid" src="/img/destination-3.jpg" alt="Australia" />
                    <div className="bg-white text-danger fw-bold position-absolute top-0 start-0 m-3 py-1 px-2">35% OFF</div>
                    <div className="bg-white text-primary fw-bold position-absolute bottom-0 end-0 m-3 py-1 px-2">Australia</div>
                  </a>
                </div>
              </div>
            </div>
            <div className="col-lg-5 col-md-6 wow zoomIn" data-wow-delay="0.7s" style={{ minHeight: 350 }}>
              <a className="position-relative d-block h-100 overflow-hidden" href="#">
                <img className="img-fluid position-absolute w-100 h-100" src="/img/destination-4.jpg" alt="Indonesia" style={{ objectFit: 'cover' }} />
                <div className="bg-white text-danger fw-bold position-absolute top-0 start-0 m-3 py-1 px-2">20% OFF</div>
                <div className="bg-white text-primary fw-bold position-absolute bottom-0 end-0 m-3 py-1 px-2">Indonesia</div>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Packages */}
      <PackagesSection initial={packages} />

      {/* Booking */}
      <div className="container-xxl py-5" id="booking">
        <div className="container">
          <div className="text-center mb-5">
            <h6 className="section-title bg-white text-center text-primary px-3">Booking</h6>
            <h1>Book Your Dream Trip</h1>
          </div>
          <div className="row g-0 rounded-4 overflow-hidden" style={{ boxShadow: '0 24px 80px rgba(0,0,0,0.15)' }}>

            {/* Left panel */}
            <div className="col-lg-5" style={{
              background: 'linear-gradient(160deg, #0a0f1e 0%, #1a2a0a 60%, #2d4a0e 100%)',
              padding: '52px 44px',
              position: 'relative',
              overflow: 'hidden',
            }}>
              {/* bg orb */}
              <div style={{ position:'absolute', width:350, height:350, borderRadius:'50%', background:'rgba(134,184,23,0.08)', top:-80, right:-80, filter:'blur(60px)' }} />
              <div style={{ position:'absolute', width:250, height:250, borderRadius:'50%', background:'rgba(134,184,23,0.06)', bottom:-60, left:-60, filter:'blur(50px)' }} />

              <div style={{ position:'relative', zIndex:1 }}>
                <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(134,184,23,0.15)', border:'1px solid rgba(134,184,23,0.3)', color:'#a8d832', fontSize:'0.72rem', fontWeight:700, letterSpacing:2, textTransform:'uppercase', padding:'6px 18px', borderRadius:50, marginBottom:28 }}>
                  <span style={{ width:6, height:6, background:'#86B817', borderRadius:'50%', display:'inline-block' }}></span>
                  Online Booking
                </div>
                <h2 style={{ color:'#fff', fontWeight:900, fontSize:'2rem', lineHeight:1.2, marginBottom:16 }}>Plan Your Perfect <span style={{ color:'#86B817' }}>Adventure</span></h2>
                <p style={{ color:'rgba(255,255,255,0.65)', fontSize:'0.95rem', lineHeight:1.8, marginBottom:36 }}>Fill in the form and our travel experts will craft a personalized itinerary just for you — within 24 hours.</p>

                {/* Features */}
                {[
                  { icon: 'headset',       title: '24/7 Expert Support',    desc: 'Our team is always available' },
                  { icon: 'tag',           title: 'Best Price Guarantee',   desc: 'No hidden charges ever' },
                  { icon: 'shield-alt',    title: 'Safe & Secure Booking',  desc: 'Your data is fully protected' },
                  { icon: 'undo-alt',      title: 'Free Cancellation',      desc: 'Flexible plans, no stress' },
                ].map(f => (
                  <div key={f.title} style={{ display:'flex', alignItems:'flex-start', gap:16, marginBottom:22 }}>
                    <div style={{ width:42, height:42, borderRadius:12, background:'rgba(134,184,23,0.15)', border:'1px solid rgba(134,184,23,0.25)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                      <i className={`fa fa-${f.icon}`} style={{ color:'#86B817', fontSize:'1rem' }}></i>
                    </div>
                    <div>
                      <div style={{ color:'#fff', fontWeight:700, fontSize:'0.9rem' }}>{f.title}</div>
                      <div style={{ color:'rgba(255,255,255,0.5)', fontSize:'0.8rem', marginTop:2 }}>{f.desc}</div>
                    </div>
                  </div>
                ))}

                {/* WhatsApp CTA */}
                <a href="https://wa.me/919839685724" target="_blank" rel="noreferrer" style={{ display:'inline-flex', alignItems:'center', gap:10, background:'#25D366', color:'#fff', fontWeight:700, fontSize:'0.9rem', padding:'12px 24px', borderRadius:50, textDecoration:'none', marginTop:8, boxShadow:'0 6px 20px rgba(37,211,102,0.4)' }}>
                  <i className="fab fa-whatsapp" style={{ fontSize:'1.1rem' }}></i> Chat on WhatsApp
                </a>
              </div>
            </div>

            {/* Right form */}
            <div className="col-lg-7" style={{ background:'#fff', padding:'52px 44px' }}>
              <h4 style={{ fontWeight:800, color:'#14141f', marginBottom:6 }}>Fill in Your Details</h4>
              <p style={{ color:'#888', fontSize:'0.9rem', marginBottom:28 }}>We'll get back to you with the best options within 24 hours.</p>
              <BookingForm />
            </div>

          </div>
        </div>
      </div>

      {/* Process */}
      <div className="container-xxl py-5">
        <div className="container">
          <div className="text-center pb-4 wow fadeInUp" data-wow-delay="0.1s">
            <h6 className="section-title bg-white text-center text-primary px-3">Process</h6>
            <h1 className="mb-5">3 Easy Steps</h1>
          </div>
          <div className="row gy-5 gx-4 justify-content-center">
            {[
              { icon: 'globe',       title: 'Choose A Destination', desc: 'Pick your dream destination from a wide range of breathtaking options. Akash Holidays offers personalized recommendations to make your choice easy and exciting.' },
              { icon: 'dollar-sign', title: 'Pay Online',           desc: 'Enjoy a secure and convenient payment experience with our online booking system. Pay seamlessly with just a few clicks and receive instant confirmation.' },
              { icon: 'plane',       title: 'Fly Today',            desc: 'Your journey starts now! With Akash Holidays, book your flights hassle-free and embark on your adventure today. Our Expert Team is always there to help you out.' },
            ].map((step, i) => (
              <div key={step.title} className="col-lg-4 col-sm-6 text-center pt-4 wow fadeInUp" data-wow-delay={`${0.1 + i * 0.2}s`}>
                <div className="position-relative border border-primary pt-5 pb-4 px-4">
                  <div className="d-inline-flex align-items-center justify-content-center bg-primary rounded-circle position-absolute top-0 start-50 translate-middle shadow" style={{ width: 100, height: 100 }}>
                    <i className={`fa fa-${step.icon} fa-3x text-white`}></i>
                  </div>
                  <h5 className="mt-4">{step.title}</h5>
                  <hr className="w-25 mx-auto bg-primary mb-1" />
                  <hr className="w-50 mx-auto bg-primary mt-0" />
                  <p className="mb-0">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team */}
      <div className="container-xxl py-5" id="team">
        <div className="container">
          <div className="text-center wow fadeInUp" data-wow-delay="0.1s">
            <h6 className="section-title bg-white text-center text-primary px-3">Travel Guide</h6>
            <h1 className="mb-5">Meet Our Guide</h1>
          </div>
          <div className="row g-4">
            {team.map((member, i) => (
              <div key={member.name} className="col-lg-3 col-md-6 wow fadeInUp" data-wow-delay={`${0.1 + i * 0.2}s`}>
                <div className="team-item">
                  <div className="overflow-hidden">
                    <img className="img-fluid" src={`/img/${member.img}`} alt={member.name} style={{ width: '100%', height: 250, objectFit: 'cover' }} />
                  </div>
                  <div className="position-relative d-flex justify-content-center" style={{ marginTop: -19 }}>
                    {['facebook-f','twitter','instagram'].map(icon => (
                      <a key={icon} className="btn btn-square mx-1" href="#"><i className={`fab fa-${icon}`}></i></a>
                    ))}
                  </div>
                  <div className="text-center p-4">
                    <h5 className="mb-0">{member.name}</h5>
                    <small>{member.role}</small>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonial */}
      <div className="container-xxl py-5 wow fadeInUp" data-wow-delay="0.1s" id="testimonial">
        <div className="container">
          <div className="text-center">
            <h6 className="section-title bg-white text-center text-primary px-3">Testimonial</h6>
            <h1 className="mb-5">Our Clients Say!!!</h1>
          </div>
          <div className="owl-carousel testimonial-carousel position-relative">
            {testimonials.map((t) => (
              <div key={t.name} className="testimonial-item bg-white text-center border p-4">
                <h5 className="mb-0">{t.name}</h5>
                <p>{t.loc}</p>
                <p className="mb-0">{t.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contact */}
      <div className="container-xxl py-5" id="contact">
        <div className="container">
          <div className="text-center wow fadeInUp" data-wow-delay="0.1s">
            <h6 className="section-title bg-white text-center text-primary px-3">Contact Us</h6>
            <h1 className="mb-5">Contact For Any Query</h1>
          </div>
          <div className="row g-4">
            <div className="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.1s">
              <h5>Get In Touch</h5>
              <p className="mb-4">Have Any Queries? We Are Here For You</p>
              {[
                { icon: 'map-marker-alt', label: 'Office',  content: <a href="https://maps.app.goo.gl/wAWjPw4BUNJDLQyo8" target="_blank" rel="noreferrer" style={{ color: 'inherit', textDecoration: 'underline' }}>Plot No 62, Shukla Vihar Para, Lucknow</a> },
                { icon: 'phone-alt',      label: 'Mobile',  content: '+91 9839685724' },
                { icon: 'envelope-open', label: 'Email',   content: <a href="mailto:pramod.srivastava1975@gmail.com" style={{ color: 'blue', textDecoration: 'underline' }}>pramod.srivastava1975@gmail.com</a> },
              ].map(item => (
                <div key={item.label} className="d-flex align-items-center mb-4">
                  <div className="d-flex align-items-center justify-content-center flex-shrink-0 bg-primary" style={{ width: 50, height: 50 }}>
                    <i className={`fa fa-${item.icon} text-white`}></i>
                  </div>
                  <div className="ms-3">
                    <h5 className="text-primary">{item.label}</h5>
                    <p className="mb-0">{item.content}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.3s">
              <iframe
                className="position-relative rounded w-100 h-100"
                src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d222.52624906747462!2d80.87212652449288!3d26.826591093301996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sin!4v1736923812904!5m2!1sen!2sin"
                style={{ minHeight: 300, border: 0 }}
                allowFullScreen
                loading="lazy"
              ></iframe>
            </div>
            <div className="col-lg-4 col-md-12 wow fadeInUp" data-wow-delay="0.5s">
              <h5>Reach Us on WhatsApp</h5>
              <p className="mb-2">Click below to connect with us on WhatsApp</p>
              <p className="mb-2">Our WhatsApp Business account is here to assist you with your queries regarding bookings, travel plans, pricing, and any other information you may need.</p>
              <a href="https://wa.me/919839685724" target="_blank" rel="noreferrer" className="d-block text-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" style={{ width: 100, height: 'auto' }} />
              </a>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      {/* Back to Top */}
      <a href="#" className="btn btn-lg btn-primary btn-lg-square back-to-top"><i className="bi bi-arrow-up"></i></a>

      {/* Floating WhatsApp */}
      <a href="https://wa.me/919839685724" target="_blank" rel="noreferrer" className="btn btn-success btn-lg-square whatsapp-float">
        <i className="fab fa-whatsapp fa-2x"></i>
      </a>
    </>
  )
}
