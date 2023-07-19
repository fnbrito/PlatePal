import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const fetchRecipe = async (recipeId) => {
  const baseUrl = process.env.NODE_ENV === 'production'
    ? 'https://platepal-chef.azurewebsites.net'
    : 'http://localhost:8000';

  const response = await fetch(`${baseUrl}/recipes/${recipeId}`);
  if (response.ok) {
    const data = await response.json();
    return data;
  } else {
    console.error('Error fetching recipe details');
  }
};

function ExpandedRecipe() {
  const { recipeId } = useParams();
  const [recipe, setRecipe] = useState(null);

  useEffect(() => {
    fetchRecipe(recipeId).then((data) => {
      setRecipe(data);
    });
  }, [recipeId]);

  return (
    <div className="content expanded-recipe">
      {recipe && (
        <>
          <h1 className="light-text">{recipe.title}</h1>
          <img className="recipe-image" src={recipe.imageUrl} alt={recipe.title} />
          <p className="light-text">{recipe.description}</p>
          <h2 className="light-text">Ingredients</h2>
          <ul className="light-text ingredients-list">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index}>{ingredient}</li>
            ))}
          </ul>
          <h2 className="light-text">Instructions</h2>
          <p className="light-text">{recipe.instructions}</p>
          <h2 className="light-text">Estimated Time</h2>
          <p className="light-text">{recipe.estimated_time}</p>
        </>
      )}
    </div>
  );
}

export default ExpandedRecipe;
