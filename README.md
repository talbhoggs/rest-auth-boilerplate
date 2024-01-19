
## Introduction
This project is a Rest app built with node js. It demonstrates how to implement Authorization and Authentication in node js. The app has two versions: v1 and v2. V1 uses a json file as a database, while v2 uses mongodb. V1 is a good way to learn the fundamentals of node js, while v2 is a more advanced and realistic app that uses mongodb. 

### Build with
<p align="left">
<a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/javascript-colored.svg" width="36" height="36" alt="JavaScript" /></a>
<a href="https://nodejs.org/en/" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/nodejs-colored.svg" width="36" height="36" alt="NodeJS" /></a>
<a href="https://expressjs.com/" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/express-colored.svg" width="36" height="36" alt="Express" /></a>
<a href="https://www.mongodb.com/" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/mongodb-colored.svg" width="36" height="36" alt="MongoDB" /></a>
<a href="https://git-scm.com/downloads" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/git-colored.svg" width="36" height="36" alt="Git" /></a>
</p>

### Installation

#### Precondition:
0: Create .env file
```
ACCESS_TOKEN_SECRET=<TOKEN_1>
REFRESH_TOKEN_SECRET=<TOKEN_2>
DATABASE_URI=mongodb://127.0.0.1:27017/companyDB
```

Steps:
1. First, you need to set up a local mongodb database using a docker image. In this example, we are using podman as the container engine. To run the mongodb image, use this command:

```
podman run --name mongodb -d -p 27017:27017 mongodb/mongodb-community-server:7.0.3-ubi8
```

2. Next, you need to create a database named companyDB in mongodb. You can use any tool or client that connects to mongodb, such as mongo shell or Compass.

3. Then, you need to install the dependencies for your node js app. Open a terminal and navigate to the folder where your app is located. Run this command:

```
npm install
```
4. Finally, you need to start your app using nodemon. This will automatically restart your app when you make changes to the code. Run this command:

```
nodemon
```

### API
```
//v1
POST /api/signup
POST /api/signin
POST /api/refreshtoken

GET /api/employees [ADMIN, USER]
GET /api/employees/:id [ADMIN]
PUT /api/employees/:id
DELETE /api/employees/:id [ADMIN]

//v2
POST /api/v2/signup
POST /api/v2/signin
POST /api/v2/refreshtoken

GET /api/v2/employees [ADMIN]
GET /api/v2/employees/:id 
PUT /api/v2/employees/:id
DELETE /api/v2/employees/:id [ADMIN]
```

#### Backlog 
1. Swagger integration
2. <strike>Add Linting</strike>
3. Add releases
4. Refactor code

[^1]: [gitdagray](https://github.com/gitdagray/mongo_async_crud)
[^2]: [DaveGray](https://www.youtube.com/playlist?list=PL0Zuz27SZ-6PFkIxaJ6Xx_X46avTM1aYw)
[^3]: [Codingwithjaygithub](https://github.com/codergogoi/nodejs_complete_rest_api/)

