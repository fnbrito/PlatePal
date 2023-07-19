import React, { useState, useEffect } from "react";
import { Carousel, Container, Row, Col } from "react-bootstrap";
import RecipeCardHome from "./RecipeCardHome";
import { useNavigate } from "react-router-dom";

const baseUrl = process.env.NODE_ENV === 'production'
? 'https://platepal-chef.azurewebsites.net'
: 'http://localhost:8000';

function Home() {
  const [bestRecipes, setBestRecipes] = useState([]);
  const [expandedRecipe] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`${baseUrl}/best-recipes`);
      const data = await response.json();
      setBestRecipes(data);
    };
    fetchData();
  }, []);

  const handleCardClick = (recipeId) => {
    navigate(`/recipes/${recipeId}`);
  };

  return (
    <div>
      <Carousel fade>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="https://source.unsplash.com/1600x300/?food"
            alt="First slide"
          />
          <Carousel.Caption className="bg-light bg-gradient  text-dark">
            <h3>This is the real deal!</h3>
            <p>Try out this new cooking technique!</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="https://source.unsplash.com/1600x300/?recipe"
            alt="Second slide"
          />
          <Carousel.Caption className="bg-light bg-gradient  text-dark">
            <h3>A taste of France</h3>
            <p>Did you know this dish is actually french?</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="https://source.unsplash.com/1600x300/?cooking"
            alt="Third slide"
          />
          <Carousel.Caption className="bg-light bg-gradient  text-dark">
            <h3>Don't leave home without this one</h3>
            <p>The best dish to take out is here!</p>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>
      <Container className="py-5">
        <h2 className="mb-4 light-text">Hottest Recipes 🔥</h2>
        <Row>
          {bestRecipes.map((recipe) => (
            <Col className="col-xxl-3 col-lg-4 col-md-5 col-sm-7 mb-4">
              <div key={recipe._id}>
                <RecipeCardHome
                  recipe={recipe}
                  isExpanded={
                    expandedRecipe && expandedRecipe._id === recipe._id
                  }
                  onClick={() => handleCardClick(recipe._id)}
                />
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
}

export default Home;
