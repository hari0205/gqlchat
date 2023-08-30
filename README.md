## Description
Chat Application that leverages the use of Subscriptions in GraphQL

## Prerequisites
This project uses PostgreSQL database. Connect to an instance running on your local machine or use docker.

- Docker: [Install Docker](https://docs.docker.com/get-docker/)
-  Run the following command to start the PostgreSQL container:
     ```
     docker run -d --name postgres-container -e POSTGRES_USER=myuser -e POSTGRES_PASSWORD=mypassword -e POSTGRES_DB=dev_db -p 5432:5432 postgres:latest
     ```
     
   - This command will start a PostgreSQL container with the specified username, password, and database name. Port 5432 is exposed and mapped to the host machine.

## Installation

1. Clone the V2 branch of this repository. 
2. Navigate to the project directory.
3. Install dependencies: `yarn install`
4. Create a .env file in root directory with following values
```
SECRET_KEY = "SECRET KEY FOR JWT"
```
5. To build typescript files: ` tsc`. This will create a new directory build.
6. To run the project: `node build/app.js`

7. To run dev build: `yarn dev`

8. You can use the GraphQL at `/graphql` endpoint.





