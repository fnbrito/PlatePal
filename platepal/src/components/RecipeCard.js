// ./components/RecipeCard.js

import React from 'react';
import { Card } from 'react-bootstrap';

function RecipeCard({ recipe, onClick }) {
  return (
    <Card className="h-100" style={{ width: '18rem' }} onClick={onClick}>
      <Card.Img variant="top" src={recipe.imageUrl} />
      <Card.Body>
        <Card.Title>{recipe.title}</Card.Title>
        <Card.Text>
          {recipe.description.split('. ').slice(0, 2).join('. ')}
        </Card.Text>
      </Card.Body>
    </Card>
  );
}

export default RecipeCard;

