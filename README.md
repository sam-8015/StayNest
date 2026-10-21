# StayNest
Airbnb-style stay listing app built with Node.js, Express, MongoDB and EJS. Features auth, image uploads, Mapbox maps and star-rated reviews.

# StayNest

A full-stack web application for listing and discovering places to stay, inspired by Airbnb. Users can browse stays, host their own listings with photos, view them on a map, and leave star-rated reviews.

Built with **Node.js, Express, MongoDB and EJS**, following the **MVC** pattern.

---

## Features

- **Browse stays** - home page shows all listings as cards with price per night (in INR) and a "Display total after taxes" toggle (+18% GST)
- **Listing details** - photo, description, owner, location, country and price
- **Create, edit and delete listings** - only the owner of a listing can change or remove it
- **Image upload** - photos are uploaded to Cloudinary
- **Interactive map** - location is converted to coordinates with Mapbox geocoding and shown on a Mapbox map with a marker
- **Reviews and ratings** - logged-in users can post star-rated reviews; only the author can delete their review
- **Authentication** - sign up, log in and log out with Passport (local strategy); after login, users return to the page they were trying to open
- **Persistent sessions** - sessions are stored in MongoDB
- **Flash messages** - success and error alerts (for example "Welcome to StayNest!")
- **Validation and error handling** - server-side validation with Joi, a custom error class and a 404 / error page
- **Cleanup** - deleting a listing also deletes its reviews

## Tech Stack

| Area | Technology |
|---|---|
| Runtime / Server | Node.js, Express 5 |
| Database | MongoDB Atlas, Mongoose |
| Templating | EJS, ejs-mate (layouts) |
| Frontend | Bootstrap 5, Font Awesome, custom CSS |
| Authentication | Passport, passport-local, passport-local-mongoose |
| Sessions | express-session, connect-mongo, connect-flash |
| File upload | Multer, Cloudinary |
| Maps | Mapbox GL JS, Mapbox Geocoding API |
| Validation | Joi |

## Getting Started

### Prerequisites
- Node.js 22 or newer
- A MongoDB Atlas database (or any MongoDB connection string)
- A free [Cloudinary](https://cloudinary.com) account
- A free [Mapbox](https://www.mapbox.com) access token

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/<your-username>/StayNest.git
cd StayNest

# 2. Install dependencies
npm install

# 3. Create a .env file in the project root (see below)

# 4. Start the app
node app.js
```

Open **http://localhost:8080** and go to `/listings`.

### Environment variables

Create a `.env` file in the root folder:

```env
CLOUD_NAME=your_cloudinary_cloud_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret
MAP_TOKEN=your_mapbox_public_token
ATLASDB_URL=your_mongodb_connection_string
```

> Never commit your `.env` file. Add `.env` and `node_modules/` to `.gitignore`.

### Optional: add sample data

`init/seedSample.js` adds 50 demo users and 50 listings (with images and map coordinates) to your database. Every demo user has the password `demo`.

```bash
node init/seedSample.js
```

It only replaces the demo users and listings it created, so your own data is not deleted.

## Project Structure

```
StayNest/
├── app.js                 # App setup, sessions, passport, routes, error handling
├── cloudConfig.js         # Cloudinary + Multer storage setup
├── middleware.js          # isLoggedIn, isOwner, isReviewAuthor, validation
├── schema.js              # Joi validation schemas
├── controllers/           # Route logic (listing, review, user)
├── models/                # Mongoose models (Listing, Review, User)
├── routes/                # Express routers
├── utils/                 # ExpressError, wrapAsync
├── views/                 # EJS templates
│   ├── layouts/           #   boilerplate layout
│   ├── includes/          #   navbar, footer, flash messages
│   ├── listings/          #   index, show, new, edit
│   └── users/             #   login, signup
├── public/                # CSS and client-side JS (map, form validation)
└── init/                  # Sample data and seed scripts
```

## Routes

| Method | Route | Description | Access |
|---|---|---|---|
| GET | `/listings` | All listings | Public |
| GET | `/listings/new` | New listing form | Logged in |
| POST | `/listings` | Create listing | Logged in |
| GET | `/listings/:id` | Listing details | Public |
| GET | `/listings/:id/edit` | Edit form | Owner |
| PUT | `/listings/:id` | Update listing | Owner |
| DELETE | `/listings/:id` | Delete listing | Owner |
| POST | `/listings/:id/reviews` | Add review | Logged in |
| DELETE | `/listings/:id/reviews/:reviewId` | Delete review | Review author |
| GET / POST | `/signup` | Register | Public |
| GET / POST | `/login` | Log in | Public |
| GET | `/logout` | Log out | Logged in |

## Data Models

- **Listing** - title, description, image (url, filename), price, location, country, geometry (GeoJSON point), owner (User), reviews (Review[])
- **Review** - comment, rating (1-5), createdAt, author (User)
- **User** - username, email, password (hashed by passport-local-mongoose)

## Future Improvements

- Working search and category filters (the search bar and category icons on the home page are currently visual only)
- Booking and availability calendar
- User profiles and wishlists
- Pagination for large numbers of listings

## Author

**Your Name**
GitHub: [@your-username](https://github.com/your-username)

---

If you like this project, give it a star.
