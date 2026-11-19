const fs = require('fs');
const html = fs.readFileSync('c:/Users/mangr/OneDrive/Documents/sigma web devlopment code/solar project/index.html', 'utf8');

const headMatch = html.match(/[\s\S]*?<\/head>/);
let head = headMatch ? headMatch[0] : '';

const galleryCss = `
  <style>
    /* ───────────── PRODUCTS GALLERY ───────────── */
    #products-hero {
      padding: 120px 0 60px;
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f2d40 100%);
      text-align: center;
      color: white;
    }
    .products-title { font-size: clamp(32px, 5vw, 48px); font-weight: 900; margin-bottom: 16px; letter-spacing: -1px; }
    .products-sub { font-size: 18px; color: rgba(255,255,255,0.7); max-width: 600px; margin: 0 auto; }
    
    #products-section {
      padding: 80px 0;
      background: #f8fafc;
    }
    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 24px;
    }
    .product-item {
      position: relative;
      border-radius: 16px;
      overflow: hidden;
      aspect-ratio: 4 / 3;
      cursor: pointer;
      box-shadow: 0 10px 30px rgba(0,0,0,0.08);
      transition: all 0.4s ease;
      background: #fff;
    }
    .product-img-wrap {
      width: 100%;
      height: 75%;
      overflow: hidden;
    }
    .product-item img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.6s ease;
    }
    .product-item:hover {
      transform: translateY(-8px);
      box-shadow: 0 20px 40px rgba(0,0,0,0.15);
    }
    .product-item:hover img {
      transform: scale(1.08);
    }
    .product-details {
      padding: 16px;
      text-align: center;
      background: white;
      height: 25%;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    .product-details h3 {
      font-size: 18px;
      font-weight: 800;
      color: var(--navy);
      margin-bottom: 4px;
    }
    .product-details p {
      color: var(--sun-dark);
      font-size: 13px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    /* Lightbox Modal */
    #lightbox {
      position: fixed;
      inset: 0;
      background: rgba(15,23,42,0.95);
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 40px;
      backdrop-filter: blur(8px);
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.3s ease;
    }
    #lightbox.active {
      opacity: 1;
      pointer-events: all;
    }
    #lightbox img {
      max-width: 90%;
      max-height: 90vh;
      border-radius: 12px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.5);
      transform: scale(0.9);
      transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    #lightbox.active img {
      transform: scale(1);
    }
    .lightbox-close {
      position: absolute;
      top: 30px;
      right: 40px;
      color: white;
      font-size: 40px;
      cursor: pointer;
      line-height: 1;
      transition: color 0.2s;
      z-index: 10000;
    }
    .lightbox-close:hover { color: var(--sun); }
  </style>
</head>`;
head = head.replace('</head>', galleryCss);

const topbarMatch = html.match(/(<div class="topbar">[\s\S]*?)<!-- ══ HERO ══ -->/);
let header = topbarMatch ? topbarMatch[1] : '';

header = header.replace(
  '<li><a href="index.html" class="active">Home</a></li>',
  '<li><a href="index.html">Home</a></li>'
);

header = header.replace(
  '<a href="index.html" class="nav-logo">',
  '<a href="index.html" class="nav-logo">'
);

header = header.replace(
  '<li><a href="index.html#about">About Us</a></li>',
  '<li><a href="about.html#about">About Us</a></li>'
);

header = header.replace(
  '<li><a href="products.html">Product Gallery</a></li>',
  '<li><a href="products.html" class="active">Product Gallery</a></li>'
);

// Fix other hash links to point back to index.html
header = header.replaceAll('href="#services"', 'href="index.html#services"');
header = header.replaceAll('href="#srv-', 'href="index.html#srv-');
header = header.replaceAll('href="#why"', 'href="index.html#why"');
header = header.replaceAll('href="#contact"', 'href="index.html#contact"');

const footerMatch = html.match(/(<!-- ══ FOOTER ══ -->[\s\S]*?)<\/body>/);
let footerAndScripts = footerMatch ? footerMatch[1] : '';

const bodyContent = `
  <!-- ══ PRODUCTS HERO ══ -->
  <section id="products-hero">
    <div class="container">
      <h1 class="products-title">Our <span style="color:var(--sun);">Products</span></h1>
      <p class="products-sub">Explore our high-efficiency solar panels, inverters, and premium mounting structures used across all our installations.</p>
    </div>
  </section>

  <!-- ══ PRODUCTS GRID ══ -->
  <section id="products-section">
    <div class="container products-grid">
      <!-- Product 1 -->
      <div class="product-item" onclick="openLightbox('gallery photos/p1.jpeg')">
        <div class="product-img-wrap">
          <img src="gallery photos/p1.jpeg" alt="Monocrystalline Panel">
        </div>
        <div class="product-details">
          <h3>High-Efficiency Monocrystalline Panels</h3>
          <p>Tier-1 Solar Modules</p>
        </div>
      </div>
      <!-- Product 2 -->
      <div class="product-item" onclick="openLightbox('gallery photos/p2.png')">
        <div class="product-img-wrap">
          <img src="gallery photos/p2.png" alt="Solar Inverter">
        </div>
        <div class="product-details">
          <h3>Smart Grid-Tied Inverters</h3>
          <p>99% Maximum Efficiency</p>
        </div>
      </div>
      <!-- Product 3 -->
      <div class="product-item" onclick="openLightbox('gallery photos/p3.jpeg')">
        <div class="product-img-wrap">
          <img src="gallery photos/p3.jpeg" alt="Mounting Structure">
        </div>
        <div class="product-details">
          <h3>Premium Mounting Structures</h3>
          <p>Anodized Aluminum</p>
        </div>
      </div>
      <!-- Product 4 -->
      <div class="product-item" onclick="openLightbox('gallery photos/p4.jpg')">
        <div class="product-img-wrap">
          <img src="gallery photos/p4.jpg" alt="Solar Batteries">
        </div>
        <div class="product-details">
          <h3>Li-ion Battery Storage</h3>
          <p>Advanced BESS</p>
        </div>
      </div>
      <!-- Product 5 -->
      <div class="product-item" onclick="openLightbox('gallery photos/p5.jpg')">
        <div class="product-img-wrap">
          <img src="gallery photos/p5.jpg" alt="Solar Lighting">
        </div>
        <div class="product-details">
          <h3>Commercial Solar Street Lights</h3>
          <p>All-in-one Lighting Systems</p>
        </div>
      </div>
      <!-- Product 6 -->
      <div class="product-item" onclick="openLightbox('gallery photos/p6.png')">
        <div class="product-img-wrap">
          <img src="gallery photos/p6.png" alt="Solar Cables">
        </div>
        <div class="product-details">
          <h3>UV Resistant Solar Cables</h3>
          <p>TUV Certified</p>
        </div>
      </div>
    </div>
  </section>

  <!-- Lightbox Modal -->
  <div id="lightbox" onclick="closeLightbox(event)">
    <span class="lightbox-close" onclick="closeLightboxObj()">&times;</span>
    <img id="lightbox-img" src="" alt="Product Image">
  </div>
`;

const lightboxScript = `
  <script>
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');

    function openLightbox(src) {
      lightboxImg.src = src;
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden'; 
    }

    function closeLightbox(e) {
      if (e.target === lightbox || e.target.classList.contains('lightbox-close')) {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto'; 
      }
    }
    function closeLightboxObj() {
      lightbox.classList.remove('active');
      document.body.style.overflow = 'auto';
    }

    // Scroll effect for navbar
    window.addEventListener('scroll', () => {
      const navbar = document.getElementById('navbar');
      if (window.scrollY > 50) navbar.classList.add('scrolled');
      else navbar.classList.remove('scrolled');
    });
  </script>
`;

footerAndScripts = footerAndScripts + lightboxScript;

const finalHtml = head + '\n<body>\n' + header + '\n' + bodyContent + '\n' + footerAndScripts + '\n</body>\n</html>';

fs.writeFileSync('c:/Users/mangr/OneDrive/Documents/sigma web devlopment code/solar project/products.html', finalHtml);
console.log('products.html created directly from about.html!');
