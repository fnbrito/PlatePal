import React, { useState, useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import { useLocation } from 'react-router-dom';
import RecipeCard from "./RecipeCard";
import NewRecipeForm from "./NewRecipeForm";
import { useNavigate } from "react-router-dom";

// Use production url when in production.
const baseUrl = process.env.NODE_ENV === 'production'
? 'https://platepal-chef.azurewebsites.net'
: 'http://localhost:8000';

const fetchRecipes = async () => {
  try {
    const response = await fetch(`${baseUrl}/recipes`, {
      method: "GET",
    });
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      console.log("Not good");
    }
  } catch (error) {
    console.log("Error");
  }
  return;
};

function Recipes() {
  const [recipes, setRecipes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [expandedRecipe, setExpandedRecipe] = useState(null);
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();

  // Check for token changes when router location changes.
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && !isTokenExpired(token)) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [location]);

  function isTokenExpired(token) {
    if (!token) return true;
    const decoded = JSON.parse(atob(token.split('.')[1]));
    return decoded.exp * 1000 < Date.now();
  }

  const handleAddRecipe = async (newRecipe) => {
    newRecipe.user_id = '';
    const token = localStorage.getItem('token');
    const response = await fetch(`${baseUrl}/recipes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(newRecipe),
    });

    if (response.ok) {
      setShowModal(false);
    }
  };

  useEffect(() => {
    fetchRecipes().then((data) => {
      if (data != null) {
        setRecipes(data);
      }
    });
  }, []);

  const handleCardClick = (recipeId) => {
    navigate(`/recipes/${recipeId}`);
  };

  return (
    <div className="content">
      <h1 className="light-text">Recipes Page</h1>
      <p className="light-text">Check out our delicious recipes!</p>
      <div className="container mt-3 mb-3">
        <div className="cards-container">
          {recipes.map((recipe) => (
            <div key={recipe._id} className="mb-4">
              <RecipeCard
                recipe={recipe}
                isExpanded={expandedRecipe && expandedRecipe._id === recipe._id}
                onClick={() => handleCardClick(recipe._id)}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="text-center mt-4">
        {isLoggedIn ? (
          <>
            <Button className="platepal-button-tertiary" onClick={() => setShowModal(true)}>Add Recipe</Button>
            <Modal show={showModal} onHide={() => setShowModal(false)}>
              <Modal.Header closeButton>
                <Modal.Title>Create New Recipe</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <NewRecipeForm onAddRecipe={handleAddRecipe} />
              </Modal.Body>
            </Modal>
          </>
        ) : (
          <b className="light-text">
            Log in to add a recipe
          </b>
        )}
      </div>
    </div>
  );
}

export default Recipes;
