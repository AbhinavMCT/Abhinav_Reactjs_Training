import Navbar from "../components/Navbar.tsx";
import Footer from "../components/Footer.tsx";
import "../styles/home.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

import school1 from "../assets/college1.png";
import school2 from "../assets/college2.png";
import school3 from "../assets/college3.png";

const Home = () => {
  const navLinks = [
    { label: "Courses", path: "/view-course" },
    { label: "Teachers", path: "/view-staff" },
    { label: "Login", path: "/login" },
  ];

  const testimonials = [
    {
      name: "Arjun Nair",
      course: "MCA Graduate",
      message:
        "The college provided excellent opportunities for learning and placements. The faculty support was outstanding.",
    },
    {
      name: "Anjali Thomas",
      course: "MBA Graduate",
      message:
        "Industry-focused education and practical exposure helped me secure a great career opportunity.",
    },
    {
      name: "Rahul Menon",
      course: "BCA Graduate",
      message:
        "A vibrant campus with modern facilities and experienced teachers made my journey memorable.",
    },
  ];

  return (
    <>
      <Navbar title="Home" links={navLinks} />

      <main className="home-container">
        <section className="hero-section">
          <div className="hero-content">
            <h1>USA COLLEGE FOR ADVANCED STUDIES</h1>
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
            We provide world-class education with experienced faculty, modern
            facilities, and industry-focused learning opportunities.
          </p>
        </section>
        <section className="carousel-section">
          <Swiper
            modules={[Autoplay, Pagination]}
            autoplay={{ delay: 3000 }}
            pagination={{ clickable: true }}
            loop={true}
            className="hero-swiper"
          >
            <SwiperSlide>
              <img src={school1} alt="Campus" />
            </SwiperSlide>

            <SwiperSlide>
              <img src={school2} alt="Students" />
            </SwiperSlide>

            <SwiperSlide>
              <img src={school3} alt="Library" />
            </SwiperSlide>
          </Swiper>
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
              <p>
                Programs designed to prepare students for successful careers.
              </p>
            </div>
          </div>
        </section>

        <section className="principal-section">
          <div className="principal-card">
            <h2>Message from the Principal</h2>
            <p>
              Our mission is to provide students with quality education,
              practical skills, and strong values. We are dedicated to creating
              future leaders capable of making meaningful contributions to
              society.
            </p>
            <h4>Dr. Robert Anderson</h4> <span>Principal</span>
          </div>
        </section>

        <section className="placement-section">
          <div className="section-header">
            <h2>Placement Highlights</h2>
            <p>Preparing students for successful professional careers.</p>
          </div>
          <div className="placement-grid">
            <div className="placement-card">
              <h3>95%</h3> <p>Placement Rate</p>
            </div>
            <div className="placement-card">
              <h3>₹12 LPA</h3> <p>Highest Package</p>
            </div>
            <div className="placement-card">
              <h3>150+</h3> <p>Recruiters</p>
            </div>
            <div className="placement-card">
              <h3>500+</h3> <p>Offers Every Year</p>
            </div>
          </div>
        </section>

        <section className="testimonial-section">
          <div className="section-header">
            <h2>Student Testimonials</h2>
            <p>Hear what our students say about their learning experience.</p>
          </div>
          <div className="testimonial-grid">
            {testimonials.map((item) => (
  <div key={item.name} className="testimonial-card">
                {" "}
                <p>"{item.message}"</p> <h4>{item.name}</h4>
                <span>{item.course}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="events-section">
          <div className="section-header">
            <h2>Upcoming Events</h2>
            <p>Stay updated with our latest academic and cultural events.</p>
          </div>
          <div className="event-grid">
            <div className="event-card">
              <h3>Tech Fest 2026</h3> <p>August 15, 2026</p>
            </div>
            <div className="event-card">
              <h3>Career Expo</h3> <p>September 10, 2026</p>
            </div>
            <div className="event-card">
              <h3>Innovation Summit</h3> <p>October 20, 2026</p>
            </div>
          </div>
        </section>

        <section className="about-section">
          {" "}
          <div className="section-header">
            {" "}
            <h2>About Our College</h2>{" "}
            <p>
              {" "}
              A premier institution committed to academic excellence,
              innovation, and holistic student development.{" "}
            </p>{" "}
          </div>{" "}
          <div className="about-grid">
            {" "}
            <div className="about-content">
              {" "}
              <p>
                {" "}
                USA College for Advanced Studies has been a beacon of higher
                education, nurturing students to become skilled professionals,
                innovators, and leaders. We offer a wide range of undergraduate
                and postgraduate programs designed to meet global industry
                standards.{" "}
              </p>{" "}
              <ul>
                {" "}
                <li>NAAC Accredited Institution</li>{" "}
                <li>Industry-Oriented Curriculum</li>{" "}
                <li>Highly Qualified Faculty</li> <li>Modern Infrastructure</li>{" "}
                <li>Excellent Placement Support</li>{" "}
              </ul>{" "}
            </div>{" "}
            <div className="about-image">
              {" "}
              <img src={school1} alt="College Campus" />{" "}
            </div>{" "}
          </div>{" "}
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Home;
