#  PlatePal-Chef
This is the server application for the PlatePal project. It will serve the main PlatePal application with data from the database and provide authentication to validate users.

##  Requirements
1. Python 3.10+
2. Pipenv
  

##  Installation
1. Clone this repository
2. Install dependencies by running `pipenv install` from the project directory


## Starting the Server
To start the server, run the following command from the project directory:
```
pipenv run uvicorn main:app --reload
```
This will start the server at http://localhost:8000.

##  Installing Packages
Packages must be installed using the `pipenv install <PACKAGE>` command. Doing this makes sure that the package is included in the project dependency file, `Pipfile` .

Example, installing `"python-jose[cryptography]"`:
```
pipenv install "python-jose[cryptography]"
```

## Deployment

### Creating and Running a Docker Container

Navigate to the root project folder and run: 

```
docker build -t platepal-chef .
```                        

Start the docker container:

```
docker run -p 8000:8000 --env-file ./.env platepal-chef
```

### Deploying the Image to Azure Container Registry

Create Docker Image tag in ACR:
```
docker tag platepal-chef platepal.azurecr.io/platepal-chef
```

Login to Azure CLI to authenticate the push to ACR:
```
az acr login --name platepal
```

Push image to ACR:
```
docker push platepal.azurecr.io/platepal-chef
```