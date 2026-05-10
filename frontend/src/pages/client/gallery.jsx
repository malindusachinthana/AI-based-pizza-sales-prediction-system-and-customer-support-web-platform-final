import React, { useState, useEffect, useCallback } from 'react';
import Navbar from '../../components/navbar';
import Footer from '../../components/footer';
import Chatbot from '../../components/chatbot.jsx';
import '../../style/gallery.css';

// ── Image imports ─────────────────────────────────────────────
import img01 from '../../assets/airpizzaimg.jpeg';
import img02 from '../../assets/greenGarden pizzaimg.jpg';
import img20 from '../../assets/home01.jpg';
import img03 from '../../assets/home03.jpg';
import img04 from '../../assets/home05.jpg';
import img05 from '../../assets/home04.jpg';
import img06 from '../../assets/rest_1.jpg';
import img07 from '../../assets/rest_2.jpg';
import img08 from '../../assets/rest_3.jpg';
import img09 from '../../assets/rest_4.jpg';
import img10 from '../../assets/rest_5.jpg';
import img11 from '../../assets/rest_6.jpg';
import img12 from '../../assets/rest_7.jpg';
import img13 from '../../assets/rest01.jpg';
import img14 from '../../assets/theClassicimg.jpg';
import img15 from '../../assets/theChickenAlfimg.jpg';
import img16 from '../../assets/theGreekimg.jpg';
import img17 from '../../assets/woodfire_1.jpg';
import img18 from '../../assets/woodfire_2.jpg';
import img19 from '../../assets/woodfire_3.jpg';

// ── Gallery data ───────────────────────────────────────────────
const IMAGES = [
  { id: 1,  src: img01, alt: 'Air Pizza',             caption: 'Handcrafted with Precision'     },
  { id: 2,  src: img02, alt: 'Green Garden Pizza',    caption: 'Fresh Garden Flavours'           },
  { id: 3,  src: img03, alt: 'OvenZa Atmosphere',     caption: 'Our Cozy Space'                  },
  { id: 4,  src: img04, alt: 'OvenZa Kitchen',        caption: 'Where the Magic Happens'         },
  { id: 5,  src: img05, alt: 'OvenZa Dining',         caption: 'Warm Neighbourhood Vibes'        },
  { id: 6,  src: img06, alt: 'Restaurant Interior 1', caption: 'Crafted for Comfort'             },
  { id: 7,  src: img07, alt: 'Restaurant Interior 2', caption: 'Every Detail Matters'            },
  { id: 8,  src: img08, alt: 'Restaurant Interior 3', caption: 'A Place to Gather'              },
  { id: 9,  src: img09, alt: 'Restaurant Interior 4', caption: 'Rustic & Refined'               },
  { id: 10, src: img10, alt: 'Restaurant Interior 5', caption: 'Warmth in Every Corner'         },
  { id: 11, src: img11, alt: 'Restaurant Interior 6', caption: 'The Heart of OvenZa'            },
  { id: 12, src: img12, alt: 'Restaurant Interior 7', caption: 'Crafted Spaces'                 },
  { id: 13, src: img13, alt: 'OvenZa Restaurant',     caption: 'Come As You Are'                },
  { id: 14, src: img14, alt: 'The Classic Pizza',     caption: 'The Classic — Timeless Taste'   },
  { id: 15, src: img15, alt: 'Chicken Alfredo Pizza', caption: 'Chicken Alfredo — Fan Favourite' },
  { id: 16, src: img16, alt: 'The Greek Pizza',       caption: 'The Greek — Mediterranean Soul' },
  { id: 17, src: img17, alt: 'Wood Fire Oven 1',      caption: 'Wood-Fired Perfection'          },
  { id: 18, src: img18, alt: 'Wood Fire Oven 2',      caption: 'The Flame That Defines Us'      },
  { id: 19, src: img19, alt: 'Wood Fire Oven 3',      caption: 'Ancient Craft, Modern Taste'    },
  { id: 20, src: img20, alt: 'OvenZa Classic',        caption: 'A Timeless Classic'             },
];

export default function Gallery() {
  const [lightbox, setLightbox]   = useState(null); // index or null
  const [imgLoaded, setImgLoaded] = useState({});

  // ── Keyboard navigation ─────────────────────────────────
  const handleKey = useCallback((e) => {
    if (lightbox === null) return;
    if (e.key === 'Escape')     setLightbox(null);
    if (e.key === 'ArrowRight') setLightbox(i => (i + 1) % IMAGES.length);
    if (e.key === 'ArrowLeft')  setLightbox(i => (i - 1 + IMAGES.length) % IMAGES.length);
  }, [lightbox]);

  useEffect(() => {
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [handleKey]);

  // Lock body scroll when lightbox open
  useEffect(() => {
    document.body.style.overflow = lightbox !== null ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [lightbox]);

  const openLightbox  = (idx) => setLightbox(idx);
  const closeLightbox = ()    => setLightbox(null);
  const prevImg       = (e)   => { e.stopPropagation(); setLightbox(i => (i - 1 + IMAGES.length) % IMAGES.length); };
  const nextImg       = (e)   => { e.stopPropagation(); setLightbox(i => (i + 1) % IMAGES.length); };

  return (
    <>
      <Navbar />

      <main className="gl-page">

        {/* ── Hero ── */}
        <section className="gl-hero">
          <div className="gl-hero-overlay" />
          <div className="gl-hero-content">
            <span className="gl-hero-label">OvenZa Crust</span>
            <h1 className="gl-hero-title">Our Gallery</h1>
            <p className="gl-hero-sub">A glimpse into our world — from wood-fired ovens to warm, welcoming spaces</p>
            <div className="gl-hero-divider" />
            <p className="gl-hero-count">{IMAGES.length} moments captured</p>
          </div>
        </section>
