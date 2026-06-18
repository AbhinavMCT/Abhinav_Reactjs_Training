import "../styles/footer.css";

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="footer-section">
          <h3>USACFAS</h3>
          <p>Learn, Grow, and Succeed.</p>
        </div>

        <div className="footer-section">
          <h4>Contact</h4>
          <p>Email: usacas@gmail.com</p>
          <p>Phone: +91 9876543210</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          © {new Date().getFullYear()} USACAS. All Rights Reserved.Designed and Developed by <span className="footer-span">Abhinav Mohan</span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;