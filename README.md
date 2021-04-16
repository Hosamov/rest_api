# REST API
REST API using Express - allows users to interact with the db to create new course, retrieve info, and update existing courses.

## Technologies & Libraries Used:
- Node.js
- Express
- Sequelize
- SQLite

## Dev Notes:
- Built using Sequelize, this web app allows users to create, retrieve, update, and delete (CRUD) data in a school database
- Routes:
  - '/api'
    - '/users' - GET (200 status code, returns current authenticated user)
    - '/users' - POST (201 status code, creates a user, sets Location header to "/", returns no content)
    - '/courses' - GET (200 status code, returns list of courses, including user who owns them)
    - '/courses/:id' - GET (200 status code, returns the selected course and the user that owns it)
    - '/courses' - POST (201 status code, creates course, sets Location header to URI of new course, returns no content)
    - '/courses/:id' - PUT (204 status code, updates course, returns no content)
    - '/courses/:id' - DELETE (204 status code, deletes course, returns no content)
- User Schema:
  - firstname (String)
  - lastName (String)
  - emailAddress (String)
  - password (String)
- Course Schema:
  - title (String)
  - description (Text)
  - estimatedTime (String)
  - materialsNeeded (String)
  - userId (created in model associations with foreignKey property)
- Validation (errors sent with 400 status code):
  - User
  - firstName
  - lastName
  - emailAddress
  - password
  - Course
  - title
  - description
- Permissions required for (auth errors return 401 status code):
  - /api/users GET route
  - /api/courses POST route
  - /api/courses/:id PUT route
  - /api/users/:id DELETE route

## Extra Features:
- User Routes:
  - Following properties are filtered out:
    - password
    - createdAt
    - updatedAt
  - '/api/users' POST route checks for and handles SequelizeUniqueConstraintError errors by returning 400 status code and error message
- Course Routes:
  - Following properties are filtered out:
    - createdAt
    - updatedAt
  - '/api/courses' PUT route returns 403 status code if current user doesn't own requested course
  - '/api/courses' DELETE route returns 403 status code if current user doesn't own requested course
- Validations:
  - '/api/users' POST route validates that the provided email address isn't already associated with an existing user

## Tracking Notes:
- Updated: 4/16/2021
