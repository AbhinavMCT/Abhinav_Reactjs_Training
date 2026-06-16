import Footer from "../../components/Footer.tsx";
import Navbar from "../../components/Navbar.tsx";

const StaffHome = () => {
   const navLinks = [
    { label: "Profile", path: "/staff-home/profile" },

  ];
  return (
      <>
      <Navbar title="Home" links={navLinks} />

      <main className="home-container">
        <section className="hero-section">
          <div className="hero-content">
            <h1>USA SCHOOL FOR ADVANCED STUDIES</h1>
            <p>
              Empowering students with quality education, innovation, and
              excellence for a brighter future.
            </p>
            <a href="/view-course" className="hero-btn">
              Explore Courses
            </a>
          </div>
        </section>

        <section className="about-section">
          <h2>About Our School</h2>
          <p>
            We provide world-class education with experienced faculty,
            modern facilities, and industry-focused learning opportunities.
          </p>
        </section>

        <section className="features-section">
          <div className="features-grid">
            <div className="feature-card">
              <h3>Expert Teachers</h3>
              <p>Learn from highly qualified and experienced educators.</p>
            </div>

            <div className="feature-card">
              <h3>Modern Campus</h3>
              <p>State-of-the-art facilities for effective learning.</p>
            </div>

            <div className="feature-card">
              <h3>Career Growth</h3>
              <p>Programs designed to prepare students for successful careers.</p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default StaffHome;


