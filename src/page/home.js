// Home.js
import React from 'react';
import '../style/home.css'; // Import the CSS file
import { Container, Row, Col, Card } from 'react-bootstrap'; // Import Bootstrap components

function Home() {
  return (
    <div className="content">
      <h1>Welcome to Home Page!</h1>
      <p>This is the home page content.</p>

      {/* Video Section */}
      <Container>
        <Row>
          <Col>
            <div className="embed-responsive embed-responsive-16by9">
              {/* Replace the src attribute with your video URL */}
              <iframe className="embed-responsive-item" src="https://www.youtube.com/embed/dQw4w9WgXcQ" title="Video"></iframe>
            </div>
          </Col>
        </Row>
      </Container>

      {/* Comment Reviews Section */}
      <Container className="mt-5">
        <h2>Comment Reviews</h2>
        <Row>
          <Col>
            <div className="comment-section">
              {/* Add some dummy comments */}
              <Card>
                <Card.Body>
                  <Card.Title>Comment 1</Card.Title>
                  <Card.Text>
                    This is a comment review.
                  </Card.Text>
                </Card.Body>
              </Card>
              <Card>
                <Card.Body>
                  <Card.Title>Comment 2</Card.Title>
                  <Card.Text>
                    This is another comment review.
                  </Card.Text>
                </Card.Body>
              </Card>
              <Card>
                <Card.Body>
                  <Card.Title>Comment 3</Card.Title>
                  <Card.Text>
                    This is yet another comment review.
                  </Card.Text>
                </Card.Body>
              </Card>
              {/* Add more comments as needed */}
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Home;
