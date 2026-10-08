import styles from "./Home.module.css";

const categories = [
  { id: "pizza", title: "Pizza", icon: "🍕", subtitle: "Cheesy & hot" },
  { id: "burger", title: "Burger", icon: "🍔", subtitle: "Juicy & filling" },
  { id: "pasta", title: "Pasta", icon: "🍝", subtitle: "Creamy comfort" },
  { id: "drinks", title: "Drinks", icon: "🥤", subtitle: "Cold & fresh" },
  { id: "desserts", title: "Desserts", icon: "🍰", subtitle: "Sweet treats" }
];

const featuredDishes = [
  {
    id: "f1",
    name: "Pepperoni Pizza",
    desc: "Classic pepperoni, mozzarella & house sauce",
    price: 2890,
    rating: 4.7,
    image:
      "https://images.unsplash.com/photo-1601924582975-7e1f11f7b1b0?auto=format&fit=crop&w=1200&q=70"
  },
  {
    id: "f2",
    name: "Smash Beef Burger",
    desc: "Juicy patty, cheese, pickles & special sauce",
    price: 1990,
    rating: 4.5,
    image:
      "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1200&q=70"
  },
  {
    id: "f3",
    name: "Creamy Alfredo Pasta",
    desc: "Rich alfredo, parmesan, and herbs",
    price: 1690,
    rating: 4.6,
    image:
      "https://images.unsplash.com/photo-1523986371872-9d3ba2e2f642?auto=format&fit=crop&w=1200&q=70"
  },
  {
    id: "f4",
    name: "Chocolate Lava Cake",
    desc: "Warm, gooey center with cocoa richness",
    price: 790,
    rating: 4.8,
    image:
      "https://images.unsplash.com/photo-1614707267537-2b3f03d8b9d6?auto=format&fit=crop&w=1200&q=70"
  }
];

const highlights = [
  {
    id: "h1",
    title: "Fast Delivery",
    desc: "Quick service with real-time updates (UI demo).",
    icon: "⚡"
  },
  {
    id: "h2",
    title: "Fresh Food",
    desc: "Carefully prepared meals from trusted kitchens.",
    icon: "🥗"
  },
  {
    id: "h3",
    title: "Best Quality",
    desc: "Highly rated dishes picked by our community.",
    icon: "⭐"
  },
  {
    id: "h4",
    title: "Easy Ordering",
    desc: "Clean, simple flow designed for mobile and desktop.",
    icon: "🛒"
  }
];

const testimonials = [
  {
    id: "t1",
    name: "Amaya Perera",
    text: "Super smooth UI and the food cards look amazing. Love the clean design!",
    tag: "Regular customer"
  },
  {
    id: "t2",
    name: "Kasun Silva",
    text: "The layout is perfect on my phone. Everything feels fast and modern.",
    tag: "Mobile-first user"
  },
  {
    id: "t3",
    name: "Nadeesha Fernando",
    text: "Great spacing, great typography. This looks like a real delivery app.",
    tag: "Food lover"
  }
];

function formatLKR(amount) {
  return new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    maximumFractionDigits: 0
  }).format(amount);
}

function Stars({ value }) {
  const full = Math.max(0, Math.min(5, Math.round(value)));
  const empty = 5 - full;
  return (
    <span className={styles.stars} aria-label={`Rating ${value} out of 5`}>
      {"★".repeat(full)}
      <span className={styles.starsMuted}>{"★".repeat(empty)}</span>
    </span>
  );
}

function CategoryCard({ icon, title, subtitle }) {
  return (
    <article className={styles.categoryCard}>
      <div className={styles.categoryIcon} aria-hidden="true">
        {icon}
      </div>
      <div className={styles.categoryTitle}>{title}</div>
      <div className={styles.categorySubtitle}>{subtitle}</div>
    </article>
  );
}

function DishCard({ dish, onAdd }) {
  return (
    <article className={styles.dishCard}>
      <div className={styles.dishMedia}>
        <img className={styles.dishImg} src={dish.image} alt={dish.name} loading="lazy" />
        <div className={styles.dishRatingPill}>
          <Stars value={dish.rating} /> <span className={styles.ratingNumber}>{dish.rating.toFixed(1)}</span>
        </div>
      </div>
      <div className={styles.dishBody}>
        <div className={styles.dishTop}>
          <h3 className={styles.dishName}>{dish.name}</h3>
          <div className={styles.dishPrice}>{formatLKR(dish.price)}</div>
        </div>
        <p className={styles.dishDesc}>{dish.desc}</p>
        <button className={styles.addBtn} type="button" onClick={onAdd}>
          Add to Cart
        </button>
      </div>
    </article>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <article className={styles.featureCard}>
      <div className={styles.featureIcon} aria-hidden="true">
        {icon}
      </div>
      <div className={styles.featureTitle}>{title}</div>
      <div className={styles.featureDesc}>{desc}</div>
    </article>
  );
}

function TestimonialCard({ name, text, tag }) {
  return (
    <article className={styles.reviewCard}>
      <p className={styles.reviewText}>&ldquo;{text}&rdquo;</p>
      <div className={styles.reviewFooter}>
        <div>
          <div className={styles.reviewName}>{name}</div>
          <div className={styles.reviewTag}>{tag}</div>
        </div>
        <div className={styles.reviewBadge}>Verified</div>
      </div>
    </article>
  );
}

export default function Home() {
  function handlePrimaryCta() {
    // Home-only demo: no navigation, no API calls.
    window.alert("Demo: This is a Home-only UI. Menu/Cart pages are not included.");
  }

  return (
    <div className={styles.page}>
      {/* 1) Hero Section */}
      <header className={styles.hero} aria-label="Hero">
        <div className={styles.container}>
          <div className={styles.heroGrid}>
            <div className={styles.heroText}>
              <div className={styles.pill}>Free delivery on your first order</div>
              <h1 className={styles.h1}>Modern food delivery, made effortless.</h1>
              <p className={styles.lead}>
                Explore popular dishes, pick a category, and place your order in minutes. Frontend-only UI with mock data.
              </p>
              <div className={styles.heroCtas}>
                <button className={styles.primaryBtn} type="button" onClick={handlePrimaryCta}>
                  Order Now
                </button>
                <button className={styles.ghostBtn} type="button" onClick={handlePrimaryCta}>
                  View Menu
                </button>
              </div>

              <dl className={styles.heroStats} aria-label="Highlights">
                <div className={styles.stat}>
                  <dt className={styles.statLabel}>Avg rating</dt>
                  <dd className={styles.statValue}>4.7</dd>
                </div>
                <div className={styles.stat}>
                  <dt className={styles.statLabel}>Delivery</dt>
                  <dd className={styles.statValue}>25–35 min</dd>
                </div>
                <div className={styles.stat}>
                  <dt className={styles.statLabel}>Choices</dt>
                  <dd className={styles.statValue}>100+ dishes</dd>
                </div>
              </dl>
            </div>

            <div className={styles.heroArt} aria-label="Food illustration">
              <div className={styles.artCard}>
                <div className={styles.artTop}>
                  <div className={styles.artTitle}>Today’s Picks</div>
                  <div className={styles.artHint}>Fresh & trending</div>
                </div>
                <div className={styles.artList}>
                  {[
                    { dot: styles.dot1, title: "Pepperoni Pizza", meta: "Hot • Cheesy" },
                    { dot: styles.dot2, title: "Smash Burger", meta: "Juicy • Classic" },
                    { dot: styles.dot3, title: "Iced Drink", meta: "Cold • Smooth" }
                  ].map((x) => (
                    <div className={styles.artRow} key={x.title}>
                      <span className={`${styles.dot} ${x.dot}`} aria-hidden="true" />
                      <div>
                        <div className={styles.artRowTitle}>{x.title}</div>
                        <div className={styles.artRowMeta}>{x.meta}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className={styles.artBottom}>Responsive UI • Static mock data</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 2) Categories Section */}
      <section className={styles.section} aria-labelledby="categories-title">
        <div className={styles.container}>
          <div className={styles.sectionHead}>
            <h2 id="categories-title" className={styles.h2}>
              Categories
            </h2>
            <p className={styles.subtext}>Pick what you’re craving today.</p>
          </div>
          <div className={styles.categoryGrid}>
            {categories.map((c) => (
              <CategoryCard key={c.id} icon={c.icon} title={c.title} subtitle={c.subtitle} />
            ))}
          </div>
        </div>
      </section>

      {/* 3) Featured Dishes Section */}
      <section className={styles.section} aria-labelledby="featured-title">
        <div className={styles.container}>
          <div className={styles.sectionHeadRow}>
            <div>
              <h2 id="featured-title" className={styles.h2}>
                Featured dishes
              </h2>
              <p className={styles.subtext}>A few top picks from our mock menu.</p>
            </div>
            <div className={styles.notePill}>Home page only</div>
          </div>

          <div className={styles.dishGrid}>
            {featuredDishes.map((dish) => (
              <DishCard key={dish.id} dish={dish} onAdd={handlePrimaryCta} />
            ))}
          </div>
        </div>
      </section>

      {/* 4) Why Choose Us Section */}
      <section className={styles.sectionAlt} aria-labelledby="why-title">
        <div className={styles.container}>
          <div className={styles.sectionHead}>
            <h2 id="why-title" className={styles.h2}>
              Why choose us
            </h2>
            <p className={styles.subtext}>Built for speed, comfort, and great UX.</p>
          </div>
          <div className={styles.featureGrid}>
            {highlights.map((h) => (
              <FeatureCard key={h.id} icon={h.icon} title={h.title} desc={h.desc} />
            ))}
          </div>
        </div>
      </section>

      {/* 5) App Promotion Section */}
      <section className={styles.promo} aria-labelledby="promo-title">
        <div className={styles.container}>
          <div className={styles.promoCard}>
            <div className={styles.promoText}>
              <div className={styles.pillDark}>Mobile app</div>
              <h2 id="promo-title" className={styles.h2}>
                Save more with the app
              </h2>
              <p className={styles.subtext}>
                Get exclusive deals, faster checkout, and order updates. (UI-only promo section)
              </p>
              <div className={styles.promoCtas}>
                <button className={styles.darkBtn} type="button" onClick={handlePrimaryCta}>
                  Download on App Store
                </button>
                <button className={styles.ghostBtn} type="button" onClick={handlePrimaryCta}>
                  Get it on Google Play
                </button>
              </div>
            </div>

            <div className={styles.promoMock} aria-hidden="true">
              <div className={styles.mockPhone}>
                <div className={styles.mockTop}>Quick checkout</div>
                <div className={styles.mockLine} />
                <div className={styles.mockLine2} />
                <div className={styles.mockLine3} />
                <div className={styles.mockBottom}>Smooth • Responsive</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6) Testimonials Section */}
      <section className={styles.section} aria-labelledby="testimonials-title">
        <div className={styles.container}>
          <div className={styles.sectionHead}>
            <h2 id="testimonials-title" className={styles.h2}>
              What customers say
            </h2>
            <p className={styles.subtext}>Loved for the clean UI and easy flow.</p>
          </div>
          <div className={styles.reviewGrid}>
            {testimonials.map((t) => (
              <TestimonialCard key={t.id} name={t.name} text={t.text} tag={t.tag} />
            ))}
          </div>
        </div>
      </section>

      {/* 7) Final CTA Section */}
      <section className={styles.finalCta} aria-label="Final call to action">
        <div className={styles.container}>
          <div className={styles.finalCard}>
            <div>
              <h2 className={styles.finalTitle}>Ready to order your next meal?</h2>
              <p className={styles.finalText}>
                Start now and enjoy a modern food delivery experience. (Home-only demo)
              </p>
            </div>
            <div className={styles.finalActions}>
              <button className={styles.primaryBtn} type="button" onClick={handlePrimaryCta}>
                Start Ordering
              </button>
              <button className={styles.ghostBtn} type="button" onClick={handlePrimaryCta}>
                Browse Dishes
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}