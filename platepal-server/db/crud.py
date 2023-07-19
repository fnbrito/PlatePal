from pymongo.collection import Collection
from models.user import UserInDB
#from pymongo import MongoClient
from models.pyobjectid import PyObjectId
from models.user import *
from fastapi import Form, HTTPException
from pymongo.collection import Collection
from models.recipe import Recipe, RecipeInDB, RecipeThumbnail, RecipeUpdate
from auth.authentication import get_password_hash
from bson import ObjectId

# Recipe CRUD

def read_recipes(collection: Collection, skip: int = 0, limit: int = 20) -> list[RecipeThumbnail]:
    result: list[RecipeThumbnail] = []
    for doc in collection.find({}, {"_id": 1, "title": 1, "description": 1, "imageUrl": 1}).skip(skip).limit(limit):
        result.append(doc)
    return result

def read_recipes_by_user(collection: Collection, user_id: str, skip: int = 0, limit: int = 20) -> list[RecipeThumbnail]:
    result: list[RecipeThumbnail] = []
    query_filter = {"user_id": user_id}
    projection = {"_id": 1, "title": 1, "description": 1, "imageUrl": 1}
    for doc in collection.find(query_filter, projection).skip(skip).limit(limit):
        result.append(doc)
    return result


def read_recipe_by_id(collection: Collection, recipe_id: str) -> RecipeInDB:
    result = collection.find_one({"_id": PyObjectId(recipe_id)})
    if result is None:
        raise HTTPException(status_code=404, detail="Recipe not found")
    return result

def create_recipe(collection: Collection, recipe: Recipe) -> RecipeInDB:
    new_recipe = collection.insert_one(recipe.dict())
    result = read_recipe_by_id(collection, new_recipe.inserted_id)
    return result

def update_recipe(collection: Collection, recipe_id: str, recipe: RecipeUpdate) -> int:
    result = collection.replace_one({"_id": recipe_id}, recipe.dict())
    return result.modified_count

def delete_recipe(collection: Collection, recipe_id: str) -> str:
    result = collection.delete_one({"_id": PyObjectId(recipe_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Recipe not found")
    return recipe_id

# User CRUD
def read_user_by_id(collection: Collection, user_id: ObjectId) -> UserInDB:
    user = collection.find_one({"_id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    else:
        return user
    
def read_user_id_by_username(users: Collection, username: str) -> ObjectId:
    user = users.find_one({"username": username})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    else:
        return user["_id"]

def read_user_by_username(users: Collection, username: str) -> UserInDB:
    user = users.find_one({"username": username})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    else:
        return UserInDB(**user)

def create_user(collection: Collection, username: str = Form(...), password: str = Form(...)) -> ObjectId:
    # check if a user with the same username already exists
    existing_user = collection.find_one({"username": username})
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    # insert the new user into the collection
    result = collection.insert_one(
        {"username": username, "hashed_password": get_password_hash(password)})
    if (result.inserted_id is None):
        raise HTTPException(status_code=500, detail="Unable to create user")
    # return the newly created user
    return result.inserted_id
