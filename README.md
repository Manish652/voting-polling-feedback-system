MERN Voting System

A full-stack, real-time voting application built with the MERN stack (MongoDB, Express.js, React.js, Node.js). This system allows users to create polls, vote on existing polls, and see results updated live.

Features

User Authentication: Secure user registration and login using JSON Web Tokens (JWT).

Poll Creation: Authenticated users can create new polls with multiple options.

Voting: Users can cast one vote per poll.

Real-time Results: Poll results are updated instantly for all connected clients using WebSockets (e.g., via Socket.io).

Poll Management: Users can view and delete polls they have created.

Responsive Design: A clean, mobile-first UI built with React.

Tech Stack

This project is built on the MERN stack:

Backend:

Node.js: JavaScript runtime environment

Express.js: Web framework for Node.js

MongoDB: NoSQL database for storing polls and user data

Mongoose: Object Data Modeling (ODM) library for MongoDB

JSON Web Token (JWT): For secure user authentication

Socket.io: For real-time, bi-directional event-based communication

bcrypt.js: For hashing user passwords

Frontend:

React.js: A JavaScript library for building user interfaces

React Router: For client-side routing

Axios: Promise-based HTTP client for making API requests

Socket.io Client: To connect to the real-time backend

Tailwind CSS / Chakra UI: (Choose your preferred UI library) For styling components

