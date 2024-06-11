import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import useDocumentTitle from '../utils/useDocumentTitles';
import '../style/home.css'; // Import the CSS file for other styles

function Home() {
  useDocumentTitle('Home - Rgreement');

  const heroSectionStyle = {
    // background: 'url("/bg3.jpg") no-repeat center center',
    background: 'url("https://static.vecteezy.com/system/resources/previews/008/028/244/large_2x/exterior-luxury-house-classic-style-on-white-background-concept-for-real-estate-sale-or-property-investment3d-rendering-free-photo.jpg") no-repeat center center',
    backgroundSize: 'cover',
    // height: '100vh',
    minHeight: '100vh', 
    position: 'relative',
    color: 'white',
    textAlign: 'center',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px'
  };
  // const heroSectionStyle = {
  //   background: 'url("https://static.vecteezy.com/system/resources/previews/008/028/244/large_2x/exterior-luxury-house-classic-style-on-white-background-concept-for-real-estate-sale-or-property-investment3d-rendering-free-photo.jpg") no-repeat center center',
  //   backgroundSize: 'cover',
  //   minHeight: '60vh', // Adjust the min-height to a reasonable value
  //   position: 'relative',
  //   color: 'white',
  //   textAlign: 'center',
  //   display: 'flex',
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   padding: '20px' // Add padding for better text placement
  // };
  


  const heroContentStyle = {
    zIndex: 1
  };

  return (
    <div className="home-container">
      <div style={heroSectionStyle}>
  
        <div style={heroContentStyle}>
          <div className='main-text-cover'>
          <h1 className="display-4 shiny-white-text">Welcome to RGreement</h1>
          <p className="lead shiny-white-text-lead">Connecting Renters and Landlords Seamlessly</p>
          </div>
          <Button variant="primary" size="lg" href="/register" className="mt-3">Get Started</Button>
        </div>
      </div>

      <Container className="mt-5 comment-reviews-section">
      <h2 className="text-center custom-heading">What Our Users Say</h2>
        <Row className="mt-3">
          <Col md={4}>
            <Card className="mb-3 shadow-sm comment-card">
              <div className="comment-card-header">
                <img
                  src="https://www.benchmarkone.com/wp-content/uploads/2019/11/woman-in-white-blazer-holding-tablet-computer-789822-e1574718684226.jpg"
                  alt="User"
                  className="comment-card-image"
                />
              </div>
              <Card.Body className="comment-card-body">
                <blockquote className="blockquote mb-0">
                  <p>"RGreement made finding a new home so easy and stress-free. Highly recommend!"</p>
                  <footer className="blockquote-footer">
                    <cite title="Source Title">John Doe</cite>
                  </footer>
                </blockquote>
                <p className="comment-card-role">Property Developer</p>
                <div className="comment-card-stars">
                  <span className="star">&#9733;</span>
                  <span className="star">&#9733;</span>
                  <span className="star">&#9733;</span>
                  <span className="star">&#9733;</span>
                  <span className="star">&#9733;</span>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="mb-3 shadow-sm comment-card">
              <div className="comment-card-header">
                <img
                  src="https://www.marketing91.com/wp-content/uploads/2020/11/Customer-Satisfaction.jpg"
                  alt="User"
                  className="comment-card-image"
                />
              </div>
              <Card.Body className="comment-card-body">
                <blockquote className="blockquote mb-0">
                  <p>"As a landlord, I found the perfect tenants quickly thanks to RGreement."</p>
                  <footer className="blockquote-footer">
                    <cite title="Source Title">Jane Smith</cite>
                  </footer>
                </blockquote>
                <p className="comment-card-role">House Owner</p>
                <div className="comment-card-stars">
                  <span className="star">&#9733;</span>
                  <span className="star">&#9733;</span>
                  <span className="star">&#9733;</span>
                  <span className="star">&#9733;</span>
                  <span className="star">&#9733;</span>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="mb-3 shadow-sm comment-card">
              <div className="comment-card-header">
                <img
                  src="https://cdn.smartkarrot.com/wp-content/uploads/2020/09/Satisfied-Customers.png"
                  alt="User"
                  className="comment-card-image"
                />
              </div>
              <Card.Body className="comment-card-body">
                <blockquote className="blockquote mb-0">
                  <p>"A seamless experience from start to finish. I couldn't be happier!"</p>
                  <footer className="blockquote-footer">
                    <cite title="Source Title">Robert Johnson</cite>
                  </footer>
                </blockquote>
                <p className="comment-card-role">Best Tenant Award</p>
                <div className="comment-card-stars">
                  <span className="star">&#9733;</span>
                  <span className="star">&#9733;</span>
                  <span className="star">&#9733;</span>
                  <span className="star">&#9733;</span>
                  <span className="star">&#9733;</span>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Home;
