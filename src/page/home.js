import React from 'react';
import '../style/home.css'; // Import the CSS file
import { Container, Row, Col, Card, Button } from 'react-bootstrap'; // Import Bootstrap components
import useDocumentTitle from '../utils/useDocumentTitles';

function Home() {
  useDocumentTitle('Home - Rgreement');

  return (
    <div className="home-container">
      <Container fluid className="hero-section d-flex justify-content-center align-items-center text-center text-white">
        <div className="hero-content">
          <h1 className="display-4">Welcome to RGreement</h1>
          <p className="lead">Connecting Renters and Landlords Seamlessly</p>
          <Button variant="primary" size="lg" href="/register" className="mt-3">Get Started</Button>
        </div>
      </Container>

      <Container className="mt-5 video-section">
        <Row className="justify-content-center">
          <Col md={10} lg={8}>
            <h2 className="text-center">How It Works</h2>
            <div className="embed-responsive embed-responsive-16by9 mt-3">
              <iframe className="embed-responsive-item" src="https://www.youtube.com/embed/dQw4w9WgXcQ" title="Video" allowFullScreen></iframe>
            </div>
          </Col>
        </Row>
      </Container>

      <Container className="mt-5 comment-reviews-section">
        <h2 className="text-center">What Our Users Say</h2>
        <Row className="mt-3">
          <Col md={4}>
            <Card className="mb-3 shadow-sm">
              <Card.Body>
                <Card.Title>John Doe</Card.Title>
                <Card.Text>
                  "RGreement made finding a new home so easy and stress-free. Highly recommend!"
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="mb-3 shadow-sm">
              <Card.Body>
                <Card.Title>Jane Smith</Card.Title>
                <Card.Text>
                  "As a landlord, I found the perfect tenants quickly thanks to RGreement."
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="mb-3 shadow-sm">
              <Card.Body>
                <Card.Title>Robert Johnson</Card.Title>
                <Card.Text>
                  "A seamless experience from start to finish. I couldn't be happier!"
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Home;
