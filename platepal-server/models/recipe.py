from bson import ObjectId
from pydantic import BaseModel, Field
from models.pyobjectid import PyObjectId


class RecipeThumbnail(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    imageUrl: str = Field(...)
    title: str = Field(...)
    description: str = Field(...)

    class Config:
        json_encoders = {ObjectId: str}
        schema_extra = {
            "example": {
                "_id": "643efff0b5d3987606e26628",
                "imageUrl": "https://via.placeholder.com/150",
                "title": "Peanut Butter Jelly Madness",
                "decription": "Everyone loves it!"
            }
        }

class Recipe(BaseModel):
    user_id: str = Field(...)
    title: str = Field(...)
    description: str = Field(...)
    imageUrl: str = Field(...)
    ingredients: list[str] | None = Field(default_factory=list)
    instructions: str = Field(...)
    estimated_time: str | None = Field(...)

    class Config:
        allow_population_by_field_name = True
        allow_arbitrary_types = True
        json_encoders = {ObjectId: str}
        schema_extra = {
            "example": {
                "user_id": "643adcf0b5d3987606e26628",
                "title": "Peanut Butter Jelly Madness",
                "description": "Everyone loves it!",
                "ingredients": [
                    "1 jar of peanut butter",
                    "1 jar of jelly",
                    "1 packet of sandwich bread"
                ],
                "instructions": "Grab the packet of sandwich bread and put everything in a bowl. Add the peanut butter and jelly and mix it with your bare hands.",
                "estimated_time": "4 minutes"
            }
        }

class RecipeInDB(Recipe):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    class Config:
        allow_population_by_field_name = True
        allow_arbitrary_types = True
        json_encoders = {ObjectId: str}
        schema_extra = {
            "example": {
                "_id": "643efff0b5d3987606e26628",
                "user_id": "643adcf0b5d3987606e26628",
                "title": "Peanut Butter Jelly Madness",
                "description": "Everyone loves it!",
                "ingredients": [
                    "1 jar of peanut butter",
                    "1 jar of jelly",
                    "1 packet of sandwich bread"
                ],
                "instructions": "Grab the packet of sandwich bread and put everything in a bowl. Add the peanut butter and jelly and mix it with your bare hands.",
                "estimated_time": "4 minutes"
            }
        }

class RecipeUpdate(BaseModel):
    user_id: str = Field(...)
    imageUrl: str = Field(...)
    title: str | None = Field(...)
    description: str | None = Field(...)
    ingredients: list[str] | None = Field(default_factory=list)
    instructions: str | None = Field(...)
    estimated_time: str | None = Field(...)

    class Config:
        schema_extra = {
            "example": {
                "user_id": "643adcf0b5d3987606e26628",
                "title": "Peanut Butter Jelly Madness",
                "description": "Everyone loves it!",
                "user_id": "643adcf0b5d3987606e26628",
                "ingredients": [
                    "1 jar of peanut butter",
                    "1 jar of jelly",
                    "1 packet of sandwich bread"
                ],
                "instructions": "Grab the packet of sandwich bread and put everything in a bowl. Add the peanut butter and jelly and mix it with your bare hands.",
                "estimated_time": "4 minutes"
            }
        }