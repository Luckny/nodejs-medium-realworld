# Medium Sample

I created this application as a learning project demonstrating a fully fledged backend REST API built with **Node.js** including CRUD operations, authentication, routing and more.

## Getting Started

Follow instructions below to have a copy of this project up and running on your local machine for development and testing purposes.

### Prerequisites

You will need to have the following software installed on your system

- [Nodejs](https://nodejs.org/en/download/), a JavaScript runtime that lets you run applications outside the browser
- NPM, a package manager for Nodejs software packages (Comes with Node)
- MongoDB installation

### Installing

Clone the repository to your local machine

```
git clone https://github.com/Luckny/nodejs-medium-realworld.git
```

Navigate into root of repository

```
cd online-shop
```

Install application dependencies

```
npm install
```

Create a `.env` file based on this example:
`SERVER_PORT=3000`
`DB_URI=mongodb://localhost:27017/medium`
`JWT_SECRET=secret-key`

## Running the application

Run the command below in the project's root folder

```
npm start
```
