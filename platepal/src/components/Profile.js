import React, { useState, useEffect } from "react";
import RecipeCard from "./RecipeCard";
import { useNavigate } from "react-router-dom";

// Use production url when in production.
const baseUrl = process.env.NODE_ENV === 'production'
? 'https://platepal-chef.azurewebsites.net'
: 'http://localhost:8000';

const fetchRecipes = async () => {
  try {
    const token = localStorage.getItem('token');
    console.log("token: " + token)
    const response = await fetch(`${baseUrl}/my_recipes`, {
      method: "GET",
      "Authorization": `Bearer ${token}`
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

function Profile() {
  const [recipes, setRecipes] = useState([]);
  const [expandedRecipe, setExpandedRecipe] = useState(null);
  const navigate = useNavigate();

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
      <h1 className="light-text">Your Profile</h1>
      {recipes.length === 0 ? (
        <p className="light-text">You have no recipes yet.</p>
      ) : (
        <>
          <p className="light-text">Check out your recipes!</p>
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
        </>
      )}
    </div>
  );
}

export default Profile;
