# Wanderlust

Wanderlust is a full-stack web application built with Node.js, Express, and MongoDB. It serves as a clone of a popular vacation rental website, allowing users to browse, add, edit, and delete property listings.

## Features

The application implements complete CRUD (Create, Read, Update, Delete) functionality for listings and reviews.

### Listings

-   **View All Listings**: An index page that displays all available property listings.
-   **View Listing Details**: A show page for each listing with more detailed information and associated reviews.
-   **Create New Listing**: A form to add a new property to the database.
-   **Edit Listing**: A form to update the details of an existing listing.
-   **Delete Listing**: Functionality to remove a listing from the database.

### Reviews

-   **Add Reviews**: Users can add reviews to any listing.
-   **Display Reviews**: Reviews are displayed on the listing's detail page.

### Error Handling

-   **Async Error Handling**: Uses a `wrapAsync` utility to gracefully handle errors in asynchronous route handlers.
-   **Custom Error Middleware**: A centralized middleware to catch and process errors, rendering a user-friendly error page.
-   **404 Not Found**: A handler for requests to undefined routes.

## Technologies Used

### Backend

-   **Node.js**: JavaScript runtime environment.
-   **Express.js**: Web framework for Node.js.
-   **MongoDB**: NoSQL database for storing data.
-   **Mongoose**: Object Data Modeling (ODM) library for MongoDB and Node.js.

### Frontend

-   **EJS (Embedded JavaScript)**: Templating engine to generate HTML.
-   **EJS-Mate**: A boilerplate and layout helper for EJS.
-   **HTML5 & CSS3**: For structuring and styling the web pages.

### Middleware & Utilities

-   **method-override**: To use HTTP verbs such as PUT or DELETE in places where the client doesn't support it.

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

-   Node.js and npm installed.
-   MongoDB installed and running on `mongodb://127.0.0.1:27017`.

### Installation

1.  Clone the repository.
2.  Install NPM packages: `npm install`
3.  Start the server: `node app.js`
4.  Open your browser and navigate to `http://localhost:8080`

## Future Modifications

Here are some planned features and improvements for the future development of Wanderlust:

-   **User Authentication & Authorization**: Implement user sign-up, login, and logout functionality using Passport.js. This will allow for authorization, ensuring that only the owner of a listing can edit or delete it.
-   **Server-Side Schema Validation**: Integrate a validation library like Joi to create and enforce schemas for listings and reviews on the server-side, providing more robust data validation than the current implementation.
-   **Flash Messages**: Add flash messages using `connect-flash` to provide users with feedback after performing actions (e.g., "Listing created successfully!").
-   **Refactor Routes**: Reorganize the route logic by moving it from `app.js` into separate `express.Router()` files (e.g., `listings.js`, `reviews.js`) for better code structure and scalability.
-   **Image Uploads**: Add functionality for users to upload images for their listings using `multer`, with cloud storage integration via a service like Cloudinary.
-   **Map Integration**: Implement an interactive map on the listing detail pages (using a service like Mapbox) to show the geographical location of the property.
-   **Cascading Deletes**: Implement Mongoose middleware to ensure that when a listing is deleted, all of its associated reviews are also automatically deleted from the database.