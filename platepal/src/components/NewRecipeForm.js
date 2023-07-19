import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";

const NewRecipeForm = ({ onAddRecipe }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [ingredients, setIngredients] = useState([""]);
  const [instructions, setInstructions] = useState("");
  const [estimatedTime, setEstimatedTime] = useState("");

  const handleValidation = () => {
    if (description.length > 1000) {
      alert("Description should be 1000 characters or less.");
      return false;
    }

    if (
      imageUrl.match(
        /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)\.(?:png|gif|jpeg|jpg)$/i
      ) != null &&
      imageUrl.length > 1000
    ) {
      alert("Image URL is not valid");
      return false;
    }

    for (let i = 0; i < ingredients.length; i++) {
      if (ingredients[i].length > 200) {
        alert("Ingredients should be 200 characters or less.");
        return false;
      }
    }

    if (instructions.length > 5000) {
      alert("Instructions should be 5000 characters or less.");
      return false;
    }

    if (estimatedTime.length > 100) {
      alert("Invalid estimated time.");
      return false;
    }

    return true;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!handleValidation()) {
      return;
    }

    // Create a new recipe object with the form data
    const newRecipe = {
      title: title,
      description: description,
      imageUrl: imageUrl,
      ingredients: ingredients.filter((ingredient) => ingredient !== ""),
      instructions: instructions,
      estimated_time: estimatedTime,
    };

    // Call the onAddRecipe callback with the new recipe object
    onAddRecipe(newRecipe);

    // Reset the form fields
    setTitle("");
    setDescription("");
    setImageUrl("");
    setIngredients([""]);
    setInstructions("");
    setEstimatedTime("");
  };

  const handleIngredientChange = (index, value) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = value;
    setIngredients(newIngredients);
  };

  const handleAddIngredient = () => {
    setIngredients([...ingredients, ""]);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="title" className="mb-3">
        <Form.Label>Title</Form.Label>
        <Form.Control
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          required
        />
      </Form.Group>
      <Form.Group controlId="description" className="mb-3">
        <Form.Label>Description</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          required
        />
      </Form.Group>
      <Form.Group controlId="image" className="mb-3">
        <Form.Label>Image URL</Form.Label>
        <Form.Control
          type="text"
          value={imageUrl}
          onChange={(event) => setImageUrl(event.target.value)}
          required
        />
      </Form.Group>
      <Form.Group controlId="ingredients">
        <Form.Label>Ingredients</Form.Label>
        <div className="input-group mb-3">
          {ingredients.map((ingredient, index) => (
            <div key={index} className="col-md-11">
              <Form.Control
                className="form-control"
                aria-label="Add ingredient"
                aria-describedby="basic-addon2"
                type="text"
                value={ingredient}
                onChange={(event) =>
                  handleIngredientChange(index, event.target.value)
                }
                required
              />
            </div>
          ))}
          <Button
            id="basic-addon2"
            className="input-group-text platepal-button-primary col-md-1 text-white"
            variant="outline-secondary"
            onClick={handleAddIngredient}
          >
            +
          </Button>
        </div>
      </Form.Group>
      <Form.Group controlId="instructions" className="mb-3">
        <Form.Label>Instructions</Form.Label>
        <Form.Control
          as="textarea"
          rows={5}
          value={instructions}
          onChange={(event) => setInstructions(event.target.value)}
          required
        />
      </Form.Group>
      <Form.Group controlId="estimatedTime">
        <Form.Label>Estimated Time</Form.Label>
        <Form.Control
          type="text"
          value={estimatedTime}
          onChange={(event) => setEstimatedTime(event.target.value)}
          required
        />
      </Form.Group>
      <br />
      <Button type="submit" className="col-md-12 platepal-button-primary">
        Create Recipe
      </Button>
    </Form>
  );
};

export default NewRecipeForm;
