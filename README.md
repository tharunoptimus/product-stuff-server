# Product Stuff Server 

This server manages the Authentication, CRUD operations on Products, Uploading of Images with REST endpoints

Uses MongoDB as the database and ImageKit as the Image CDN

## Libraries Used:
- [ExpressJS](https://expressjs.com/) - Web framework for NodeJS
- [Mongoose](https://mongoosejs.com/) - MongoDB object modeling for NodeJS
- [Multer](https://www.npmjs.com/package/multer) - NodeJS middleware for handling multipart/form-data
- [JsonWebTokens](https://www.npmjs.com/package/jsonwebtoken) - NodeJS library for generating JWTs
- [BcryptHS](https://www.npmjs.com/package/bcryptjs) - NodeJS library for hashing passwords
- [MongoDB](https://www.mongodb.com/) - NoSQL Database Driver
- [DotEnv](https://www.npmjs.com/package/dotenv) - NodeJS library for loading environment variables from a .env file
- [Cors](https://www.npmjs.com/package/cors) - NodeJS library for providing a Connect/Express middleware that can be used to enable CORS with various options
- [ImageKit](https://www.npmjs.com/package/imagekit) - NodeJS SDK for ImageKit.io (Image CDN)
- [Node-Fetch](https://www.npmjs.com/package/node-fetch) - NodeJS library for fetching data from an API


## Installation

### Setting up Environment Variables
These environment variables are necessary for the server to run. Create a .env file in the root directory of the project and add the following variables to it:

```bash
MONGODB_URI # MongoDB URI
ACCESS_TOKEN_SECRET # Secret for generating JWTs
IMAGE_KIT_PUBLIC_KEY # ImageKit Public Key
IMAGE_KIT_PRIVATE_KEY # ImageKit Private Key
IMAGE_KIT_URL_ENDPOINT # ImageKit URL Endpoint
```

For getting the Image Kit Credentials, Sign up for a new account at [ImageKit](https://imagekit.io/)

### Installing Dependencies
```bash
npm install
```

### Running the Server
```bash
npm start
```

## API Documentation - REST Endpoints

### Root Endpoint (/)
- `GET / `
    - Returns a JSON object with the message "Product Stuff Server"

### Authentication Endpoints (/api/auth)
- `GET /api/auth`
    - Returns a JSON object with the message "AUTH Endpoint Active"

- `POST /api/auth/register`
    - Registers a new user
    - Request Body:
        - firstName: String
        - lastName: String
        - email: String
        - password: String
    - `201 Created` Returns a JSON object with the newly created user
        {

        - `_id`: String
        - `firstName`: String
        - `lastName`: String
        - `email`: String
        - `password`: String (Hashed)
        - `username`: String (firstName.lastName)
        - `profilePic`: String
        - `token`: String (JWT)

        }

    - Possible Errors:
        - 400: Missing Fields (missing fields in request body)
        - 400: Email Already Exists (User with the given email already exists)
        - 500: Server Error (MongoDB Error)

- `POST /api/auth/login`
    - Logs in a user
    - Request Body:
        - emailOrUsernameString: String (Email or Username)
        - password: String
    - `200 OK` Returns a JSON object with the user

        {

        - `_id`: String
        - `firstName`: String
        - `lastName`: String
        - `email`: String
        - `password`: String (Hashed)
        - `username`: String (firstName.lastName)
        - `profilePic`: String
        - `token`: String (JWT)

        }

    - Possible Errors:
        - 400: Missing Fields (missing fields in request body)
        - 400: User Not Found (User with the given email or username does not exist)
        - 401: Incorrect Password (Invalid Credentials)
        - 500: Server Error (MongoDB Error)

- `POST /api/auth/fireoauth`
    - Logs in a user using Fire OAuth
    - Request Body:
        - token: String (Firebase ID Token)
    - `200 OK` Returns a JSON object with the user

        {

        - `_id`: String
        - `firstName`: String
        - `lastName`: String
        - `email`: String
        - `password`: String (Hashed)
        - `username`: String (firstName.lastName)
        - `profilePic`: String
        - `token`: String (JWT)

        }

    - Possible Errors:
        - 400: Missing Fields (missing token field in request body)
        - 500: Server Error (MongoDB Error)

- `POST /api/auth/verify`
    - Verifies the JWT token and sends the user
    - Request Body:
        - token: String (JWT)
    - `200 OK` Returns a JSON object with the user

        {

        - `_id`: String
        - `firstName`: String
        - `lastName`: String
        - `email`: String
        - `password`: String (Hashed)
        - `username`: String (firstName.lastName)
        - `profilePic`: String
        - `token`: String (JWT)

        }

    - Possible Errors:
        - 400: Missing Fields (missing token field in request body)
        - 401: Invalid Token (Invalid JWT)
        - 401: User Not Found (User with the given JWT extracted from the request body does not exist)
        - 500: Server Error (MongoDB Error)



### Product Endpoints (/api/product)

- `GET /api/product`
    - Returns a JSON object with the message "AUTH Endpoint Active"

- `GET /api/product/some/:skip/:limit`
    - Get a list of products from the database with the given skip and limit
    - Request Params:
        - skip: Number | Default: 0
        - limit: Number | Default: 10
    - `200 OK` Returns an array of JSON object with a list of products from the database with the given skip and limit 

        - [

            {
            - `_id`: String
            - `imgSrc`: String (ImageKit URL)
            - `quantity`: String (Pieces or Grams)
            - `price`: Number
            - `productName`: String
            - `productDescription`: String
            - `uuid`: String (Unique ID)
            - `addedBy`: String (User ID)

            }, ...

        ]

    - Possible Errors:
        - 500: Server Error (MongoDB Error)

- `GET /api/product/all`
    - Get a list of all products from the database
    - `200 OK` Returns an array of JSON object with a list of all products from the database

        - [
            {
            - `_id`: String
            - `imgSrc`: String (ImageKit URL)
            - `quantity`: String (Pieces or Grams)
            - `price`: Number
            - `productName`: String
            - `productDescription`: String
            - `uuid`: String (Unique ID)
            - `addedBy`: String (User ID)
            }, ...
        ]

    - Possible Errors:
        - 500: Server Error (MongoDB Error)

- `GET /api/product/:uuid`
    - Get a product from the database with the given uuid
    - Request Params:
        - uuid: String
    - `200 OK` Returns a JSON object with the product from the database with the given uuid
        
        {

        - `_id`: String
        - `imgSrc`: String (ImageKit URL)
        - `quantity`: String (Pieces or Grams)
        - `price`: Number
        - `productName`: String
        - `productDescription`: String
        - `uuid`: String (Unique ID)
        - `addedBy`: String (User ID)

        }
    
    - Possible Errors:
        - 400: Missing Fields (missing UUID in request body)
        - 500: Server Error (MongoDB Error)
        - 404: Product Not Found (Product with the given UUID does not exist)

- `PATCH /api/product/:uuid`
    - Should be authenticated with a valid JWT in the Authorization Header
    - Update a product from the database with the given uuid and request body with fields [`imgSrc`, `quantity`, `price`, `productName`, `productDescription`]
    - Request Params:
        - uuid: String
    - Request Body: (Optional but atleast one field is required)
        - imgSrc: String (ImageKit URL)
        - quantity: String (Pieces or Grams)
        - price: Number
        - productName: String
        - productDescription: String

    - `204 No Content` Returns no content   

    - Possible Errors:
        - 400: Missing Fields UUID (missing UUID in request body)
        - 400: Missing Body (missing fields in request body)
        - 500: Server Error (MongoDB Error)
        - 404: Product Not Found (Product with the given UUID does not exist)
    
- `DELETE /api/product/:uuid`
    - Should be authenticated with a valid JWT in the Authorization Header
    - Delete a product from the database with the given uuid
    - Request Params:
        - uuid: String
    - `204 No Content` Returns no content   

    - Possible Errors:
        - 400: Missing Fields UUID (missing UUID in request body)
        - 500: Server Error (MongoDB Error)
        - 404: Product Not Found (Product with the given UUID does not exist)

### Image Endpoints (/api/image)
- `GET /api/image`
    - Returns a JSON object with the message "IMAGE Endpoint Active"

- `POST /api/image/:uuid`
    - Should be authenticated with a valid JWT in the Authorization Header
    - Upload an image to ImageKit and update the product with the given uuid with the image URL
    - Request Params:
        - uuid: String
    - Request Body: (Multipart Form Data - Required)
        - image: File

    - `200 OK` Returns a JSON object with the product from the database with the given uuid

        - `imgSrc`: String (ImageKit URL) (Updated the product with the new image with the given uuid) 

    - Possible Errors:
        - 400: Missing Fields UUID (missing UUID in request body)
        - 400: Missing Fields Image (missing field `image` in request body)
        - 400: Error Uploading Image (Error uploading image to ImageKit - something wrong with the image or with the connection to ImageKit using its SDK)
        - 500: Server Error (MongoDB Error)
        - 404: Product Not Found (Product with the given UUID does not exist) But still, it will return the image URL from ImageKit
            - `imgSrc`: String (ImageKit URL) (Couldn't update the product with the new image - Product with the given UUID does not exist)
            - `message`: "Product Not Found"
        - 500: Server Error (ImageKit Error)