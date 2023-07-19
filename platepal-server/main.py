import os
from datetime import timedelta
from typing import Annotated

import uvicorn
from fastapi import Depends, FastAPI, Form, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from starlette.responses import RedirectResponse

import db.crud as crud
from auth.authentication import (create_access_token, get_password_hash,
                                 verify_password)
from db.database import Database
from models.token import Token, TokenData
from models.recipe import Recipe, RecipeInDB, RecipeThumbnail, RecipeUpdate

# load environment variables
PORT = int(str(os.environ["PORT"]))

SECRET_KEY = str(os.environ.get('SECRET_KEY'))
ALGORITHM = str(os.environ.get('ALGORITHM'))
ACCESS_TOKEN_EXPIRE_MINUTES = int(str(
    os.environ.get('ACCESS_TOKEN_EXPIRE_MINUTES')))

COSMOSDB_URI = str(os.environ.get('COSMOSDB_URI'))
DATABASE_NAME = str(os.environ.get('DATABASE_NAME'))

db = Database()

users = db.get_collection("Users")
recipes = db.get_collection("Recipes")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# initialize FastAPI
app = FastAPI()

# allow non-https request origin endpoint.
origins = ["http://localhost:3000", "https://platepal-app.azurewebsites.net"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def authenticate_user(username: str, password: str):
    user = crud.read_user_by_username(users, username)
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user


# Routes

@app.get("/best-recipes", response_model=list[RecipeThumbnail], description="Get the best recipes")
async def get_best_recipes() -> list[RecipeThumbnail]:
    result = crud.read_recipes(recipes, skip=2, limit=4)
    return result


@app.get("/recipes", response_model=list[RecipeThumbnail], description="Get all recipes")
async def get_all_recipes() -> list[RecipeThumbnail]:
    result = crud.read_recipes(recipes)
    return result


@app.get("/my_recipes", response_model=list[RecipeThumbnail], description="Get user's recipes")
async def get_my_recipes(token: Annotated[str, Depends(oauth2_scheme)]) -> list[RecipeThumbnail]:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user_id = crud.read_user_id_by_username(users, username)
    result = crud.read_recipes_by_user(recipes, str(user_id))
    return result


@app.get("/recipes/{recipe_id}", response_model=RecipeInDB, description="Get a detailed recipe by id")
async def get_recipe(recipe_id: str) -> RecipeInDB:
    result = crud.read_recipe_by_id(recipes, recipe_id)
    return result


@app.post("/recipes", response_model=RecipeInDB, description="Create a new recipe")
async def add_new_recipe(recipe: Recipe, token: Annotated[str, Depends(oauth2_scheme)]) -> RecipeInDB:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user_id = crud.read_user_id_by_username(users, username)
    recipe.user_id = str(user_id)
    result = crud.create_recipe(recipes, recipe)
    return result


@app.put("/recipes/{recipe_id}", response_model=RecipeInDB, description="Update a recipe by id")
async def update_recipe(recipe_id: str, recipe: RecipeUpdate) -> RecipeInDB:
    current_recipe = crud.read_recipe_by_id(recipes, recipe_id)
    if (current_recipe is None):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Recipe not found"
        )
    modified_count = crud.update_recipe(recipes, recipe_id, recipe)
    if (modified_count == 0):
        raise HTTPException(
            status_code=status.HTTP_304_NOT_MODIFIED,
            detail="Recipe not updated."
        )
    else:
        return crud.read_recipe_by_id(recipes, recipe_id)


@app.delete("/recipes/{recipe_id}", response_model=str, description="Delete a recipe by id")
async def delete_recipe(recipe_id: str) -> str:
    result = crud.delete_recipe(recipes, recipe_id)
    return result


@app.post("/token", response_model=Token)
async def login_for_access_token(
        form_data: Annotated[OAuth2PasswordRequestForm, Depends()]
):
    user = authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}


# define a route to create a new user
@app.post("/users")
async def create_user(username: str = Form(...), password: str = Form(...)):
    # check if a user with the same username already exists
    existing_user = users.find_one({"username": username})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Username already exists"
        )
    # insert the new user into the collection
    result = users.insert_one(
        {"username": username, "hashed_password": get_password_hash(password)})
    new_user_id = result.inserted_id

    # return the newly created user
    return {"id": str(new_user_id), "username": username}


@app.get("/", response_description="Redirect to docs", status_code=status.HTTP_200_OK)
async def docs_redirect():
    return RedirectResponse(url='/docs')


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=PORT, reload=False)
