import { Card } from "react-bootstrap";

function RecipeCardHome({ recipe, onClick }) {
  return (
    <Card className="" style={{ width: "18rem" }} onClick={onClick}>
      <Card.Img variant="top" src={recipe.imageUrl} className="img-fluid" />
      <Card.Body>
        <Card.Title>{recipe.title}</Card.Title>
        <Card.Text className="text-truncate">{recipe.description}</Card.Text>
      </Card.Body>
    </Card>
  );
}

export default RecipeCardHome;
