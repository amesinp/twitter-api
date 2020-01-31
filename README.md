## Twitter API clone

Simple clone of twitter API built using Node.js. 

# Features

- User signup
- User signin (using JWT)

For Authenticated users

- Post tweet
- Reply to a posted tweet
- View your timeline
- Search tweets
- Search users

# Code Structure

```
twitter-api
│─── src 
│    │─── controllers
│    │─── data (DAL)
│    │    └─── dummy (for unit tests)
│    │─── helpers
│    │─── middleware
│    │─── models
│    │─── routes
│    │─── app.js 
│    │─── di-container.js
│    └─── index.js
│
|─── test
|
|─── .env.example
|─── .gitignore
|─── package.json
└─── README.md
```

# How to Run

- Prerequisites
    - Node (http://nodejs.org/)
    - MongoDb (https://www.mongodb.com/)
- Clone the repository 
- Open repository folder in terminal
- Copy .env.example to .env. ``` cp .env.example .env ```
- Open .env and configure database url and other variables
- Run ```npm install``` to install node modules
- Run tests ```npm run test```. If you there are any failing tests, please verify that no steps were missed out during setup.
- To start development server, run ```npm run dev```
- To start production server, run ```npm start```

# Documentation

Documentation on API endpoints, expected inputs, and responses can be found at: https://app.swaggerhub.com/apis-docs/Tijesunimi/Twitter-API/1.0.0