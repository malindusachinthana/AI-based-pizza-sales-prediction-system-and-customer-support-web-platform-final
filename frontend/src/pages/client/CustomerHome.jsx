import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../../style/CustomerHome.css';

// OvenZa logos
import logo           from '../../assets/OvenZlogo.png';
import logoCrust      from '../../assets/OvenzaCrust logo.png';

// Hero section - Main Background
import heroBg         from '../../assets/MainBackgound.png';

// About section
import aboutPizza     from '../../assets/mainimg.png';

// Gallery Strip
import galleryImg1    from '../../assets/home01.jpg';
import galleryImg2    from '../../assets/home02.jpg';
import galleryImg3    from '../../assets/home03.jpg';
import galleryImg4    from '../../assets/home04.jpg';

// Menu - Icons
import pizzaIcon      from '../../assets/pizzaIcon.png';
import chickenIcon    from '../../assets/chickenIcon.png';
import seafoodIcon    from '../../assets/seafoodIcon.png';
import cheeseIcon     from '../../assets/cheeseIcon.png';
import vegIcon        from '../../assets/vegIcon.png';

// Menu - Category Cards
import veggiePizza    from '../../assets/vegimg.jpg';
import chickenPizza   from '../../assets/theChickenAlfimg.jpg';
import classicPizza   from '../../assets/theClassicimg.jpg';
import supremePizza   from '../../assets/supremeimg.jpg';

// Menu - Size Cards
import largePizza     from '../../assets/theBigmeetimg.jpg';
import mediumPizza    from '../../assets/mainGalleryimg.png';
import smallPizza     from '../../assets/pepo2img.jpg';

// Special Offer pic
import offerPizza     from '../../assets/4cheeseimg.jpg';

// Gallery - OvenZa Foods
import foodImg1       from '../../assets/home05.jpg';
import foodImg2       from '../../assets/rest01.jpg';
import foodImg3       from '../../assets/thepepoimg.jpg';

// Gallery - OvenZa Lobby
import lobbyImg1      from '../../assets/home02.jpg';
import lobbyImg2      from '../../assets/home03.jpg';
import lobbyImg3      from '../../assets/home04.jpg';

// Scroll Reveal Hook

function useReveal() {
  useEffect(() => {
    const targets = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const delay = entry.target.dataset.delay || 0;
            setTimeout(() => {
              entry.target.classList.add('visible');
            }, Number(delay));
          }
        });
      },
      { threshold: 0.13 }
    );
    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

// Logout Animation Overlay

function LogoutOverlay({ show }) {
  if (!show) return null;
  return (
    <div className="logout-overlay">
      <div className="logout-box">
        <div className="logout-pizza">🍕</div>
        <h2 className="logout-title">See You Soon!</h2>
        <p className="logout-sub">You have been logged out.</p>
        <div className="logout-bar-wrap">
          <div className="logout-bar" />
        </div>
      </div>
    </div>
  );
}

// Navbar
function Navbar() {
  const navRef   = useRef(null);
  const navigate = useNavigate();
  const [showLogout, setShowLogout] = useState(false); // ✅ Add this

  const token    = localStorage.getItem('token');
  const username = localStorage.getItem('username');
  const role     = localStorage.getItem('userRole');

  // logout with animation
  const handleLogout = () => {
    setShowLogout(true); // Animation
    setTimeout(() => {
      localStorage.removeItem('token');
      localStorage.removeItem('userRole');
      localStorage.removeItem('username');
      navigate('/');
      setShowLogout(false);
    }, 2500); // Wait 2.5s then redirect
  };

  const handleLoginRedirect  = () => navigate('/login');
  const handleAdminRedirect  = () => navigate('/admin-dashboard');
  const handleProfileRedirect = () => { if (token) navigate('/customer-profile'); };

  useEffect(() => {
    const onScroll = () => {
      if (navRef.current) {
        navRef.current.style.background =
          window.scrollY > 60
            ? 'rgba(20, 26, 16, 0.98)'
            : 'rgba(20, 26, 16, 0.75)';
      }
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      {/* Logout Overlay */}
      <LogoutOverlay show={showLogout} />

      <nav className="navbar" ref={navRef}>
        {/* Left Links */}
        <ul className="navbar-links-left">
          <li><Link to="/" className="active">Home</Link></li>
          <li><Link to="/gallery">Gallery</Link></li>
        </ul>

        {/* Center Logo */}
        <Link to="/" className="navbar-logo">
          <img src={logo} alt="OvenZa Logo" />
        </Link>

        {/* Right Links */}
        <ul className="navbar-links-right">
          <li><Link to="/menu">Menu</Link></li>
          <li><Link to="/special-offers">Special Offers</Link></li>
          <li><Link to="/about">About Us</Link></li>
        </ul>

        {/* User Section */}
        <div className="navbar-user-wrap">
          {token && (
            <span className="navbar-greeting">👋 Hi, {username}</span>
          )}
          <button className="user-icon-btn" onClick={handleProfileRedirect}>
            👤
          </button>
          <div className="user-dropdown">
            {!token ? (
              <button className="dropdown-btn" onClick={handleLoginRedirect}>
                🔑 Login
              </button>
            ) : (
              <>
                {role === 'admin' && (
                  <button className="dropdown-btn" onClick={handleAdminRedirect}>
                    ▦ Admin Panel
                  </button>
                )}
                <button className="dropdown-btn" onClick={() => navigate('/customer-profile')}>
                  👤 My Profile
                </button>
                <button className="dropdown-btn logout" onClick={handleLogout}>
                  ⟵ Logout
                </button>
              </>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}

// Hero Section

function HeroSection() {
  return (
    <section className="hero" id="home">
      <div className="hero-bg" style={{ backgroundImage: `url(${heroBg})` }} />
      <div className="hero-overlay" />
      <div className="hero-content">
        <span className="hero-script">
          𝔐𝔢𝔱𝔬𝔡𝔬 𝔗𝔯𝔞𝔡𝔦𝔷𝔦𝔬𝔫𝔞𝔩𝔢, 𝔊𝔲𝔰𝔱𝔬 𝔄𝔲𝔱𝔢𝔫𝔱𝔦𝔠𝔬
        </span>
        <h1 className="hero-title">
          Traditional Method,<br />Authentic Taste
        </h1>
        <p className="hero-tagline">
          Old-world Italian craft &nbsp;·&nbsp; New-world Sri Lankan spice &nbsp;·&nbsp; Pure pizza magic
        </p>
        <div className="hero-cta-group">
          <Link to="/menu"    className="btn-primary">Order Now</Link>
          <Link to="/gallery" className="btn-outline">View Gallery</Link>
        </div>
      </div>
    </section>
  );
}

// Category Icon Row

function CategoryIconRow() {
  const icons = [
    { src: chickenIcon, label: 'Chicken' },
    { src: cheeseIcon,  label: 'Cheese'  },
    { src: vegIcon,     label: 'Veg'     },
    { src: seafoodIcon, label: 'Seafood' },
    { src: pizzaIcon,   label: 'Pizzas'  },
  ];
  return (
    <div className="icon-row reveal" data-delay="200">
      {icons.map(({ src, label }) => (
        <div className="icon-item" key={label}>
          <img src={src} alt={label} />
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
}

// About Section

function AboutSection() {
  return (
    <section className="section" id="about">
      <div className="container">
        <div className="about-grid">
          <div className="about-image-wrap reveal-left">
            <img src={aboutPizza} alt="Wood-fired pizza" />
            <div className="about-badge">
              <span>🔥</span>
              <span>Wood<br />Fired</span>
            </div>
          </div>
          <div className="reveal-right">
            <span className="section-label">Wood-Fired Authenticity</span>
            <p className="about-tagline-main">Smoky, Savory, and<br />Served with Soul.</p>
            <p className="about-tagline-sub">Chicken · Cheese · Veg · Seafood Pizzas</p>
            <div className="gold-divider" />
            <p className="section-desc">
              Indulge in our masterfully crafted thin-crust pizzas — fresh from the heat of our
              traditional wood-fired ovens and layered with premium, hand-picked toppings.
            </p>
            <p className="section-desc" style={{ marginTop: '14px' }}>
              Whether you are taking a break from the bustling energy of Maharagama or gathering
              for a relaxed evening out, every meal here is plated with warm, neighborhood hospitality.
            </p>
            <CategoryIconRow />
            <div className="about-btns">
              <Link to="/menu"    className="btn-primary">Order Now</Link>
              <Link to="/gallery" className="btn-outline">Gallery</Link>
            </div>
          </div>
        </div>
        <div className="gallery-strip reveal" data-delay="100">
          {[galleryImg1, galleryImg2, galleryImg3, galleryImg4].map((src, i) => (
            <div className="gallery-strip-item" key={i}>
              <img src={src} alt={`Gallery ${i + 1}`} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Menu Section

const categories = [
  { label: 'Veggie',  img: veggiePizza  },
  { label: 'Chicken', img: chickenPizza },
  { label: 'Classic', img: classicPizza },
  { label: 'Supreme', img: supremePizza },
];

const sizes = [
  { label: 'Large',  img: largePizza  },
  { label: 'Medium', img: mediumPizza },
  { label: 'Small',  img: smallPizza  },
];

function MenuSection() {
  return (
    <section className="section section-alt menu-section" id="menu">
      <div className="container">
        <div className="menu-header reveal">
          <span className="menu-letter">M E N U</span>
          <p className="menu-subtitle">
            Explore a world of tastier possibilities with our wide range of sizes and
            authentic flavors inspired by cuisines from around the globe...!
          </p>
        </div>
        <div className="category-grid">
          {categories.map(({ label, img }, i) => (
            <div className="category-card reveal" key={label} data-delay={i * 90}>
              <img src={img} alt={label} />
              <div className="category-card-overlay" />
              <span className="category-card-label">{label}</span>
            </div>
          ))}
        </div>
        <p className="size-section-title reveal"  data-delay="60">Sized to Your Craving</p>
        <p className="size-section-subtitle reveal" data-delay="120">Your Pizza, Your Portion</p>
        <div className="size-grid">
          {sizes.map(({ label, img }, i) => (
            <div className="size-card reveal" key={label} data-delay={i * 90}>
              <img src={img} alt={`${label} pizza`} />
              <span className="size-card-label">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Special Offers Section

function OffersSection() {
  return (
    <section className="offers-section" id="special-offers">
      <div className="container">
        <div className="offers-header reveal">
          <h2 className="offers-title">Special Offers</h2>
        </div>
        <div className="offer-card reveal" data-delay="150">
          <div className="offer-badge-wrap">
            <span className="offer-badge-main">BUY 1<br />GET 1</span>
            <span className="offer-badge-sub">FREE<br />OFFER..!</span>
          </div>
          <div className="offer-center">
            <img className="offer-image" src={offerPizza} alt="Five Cheese Pizza offer" />
            <h3 className="offer-pizza-name">The Five Cheese Pizza</h3>
            <p className="offer-desc">
              Purchase Any Variety of Pizza &amp; Get Same Variety of Pizza FREE...!
            </p>
          </div>
          <div className="offer-family">Enjoy<br />With<br />Your<br />Whole<br />Family.</div>
        </div>
      </div>
    </section>
  );
}

// Gallery Section

function GallerySection() {
  return (
    <section className="gallery-section" id="gallery">
      <div className="container">
        <div className="gallery-title-block reveal">
          <h2 className="gallery-main-title">O V E N Z A &nbsp; G A L L E R Y</h2>
        </div>
        <div className="gallery-subtitle-row">
          <div className="gallery-col reveal-left">
            <span className="gallery-col-title">OvenZa Foods</span>
            <div className="gallery-col-grid">
              <img src={foodImg1} alt="OvenZa food 1" />
              <img src={foodImg2} alt="OvenZa food 2" />
              <img src={foodImg3} alt="OvenZa food 3" />
            </div>
          </div>
          <div className="gallery-divider" />
          <div className="gallery-col reveal-right">
            <span className="gallery-col-title">OvenZa Lobby</span>
            <div className="gallery-col-grid">
              <img src={lobbyImg1} alt="OvenZa lobby 1" />
              <img src={lobbyImg2} alt="OvenZa lobby 2" />
              <img src={lobbyImg3} alt="OvenZa lobby 3" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Footer

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-logo">
        <img src={logoCrust} alt="OvenZa Crust" />
        <span>OvenZa</span>
      </div>
      <ul className="footer-links">
        <li><Link to="/customer-home">Home</Link></li>
        <li><Link to="/gallery">Gallery</Link></li>
        <li><Link to="/menu">Menu</Link></li>
        <li><Link to="/special-offers">Special Offers</Link></li>
        <li><Link to="/about">About Us</Link></li>
      </ul>
      <p className="footer-copy">
        © 2026 OvenZa. All Rights Reserved<br />
        <span style={{ fontSize: '0.7rem', opacity: 0.6 }}>By, Malindu Sachinthana</span>
      </p>
    </footer>
  );
}

// Main Page Export

export default function CustomerHome() {
  useReveal();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role  = localStorage.getItem('userRole');
    if (!token || role !== 'customer') {
      navigate('/');
    }
  }, [navigate]);

  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <AboutSection />
        <MenuSection />
        <OffersSection />
        <GallerySection />
      </main>
      <Footer />
    </>
  );
}