# W&A Digital — Agency Website

A full-stack website for a small business web design agency. Built with React + Vite (frontend) and Node.js + Express + SQLite (backend).

---

## Project Structure

```
agency-website/
├── backend/          # Express API server
│   ├── server.js
│   └── package.json
└── frontend/         # React + Vite app
    ├── src/
    ├── index.html
    ├── vite.config.js
    └── package.json
```

---

## Prerequisites

- **Node.js** v18 or higher
- **npm** v8 or higher

---

## Setup & Running Locally

### 1. Backend

```bash
cd backend
npm install
npm run dev
```

The backend starts on **http://localhost:3001**

> On first run, it automatically creates `agency.db` (SQLite database) and an `uploads/` folder.

### 2. Frontend

Open a **second terminal**:

```bash
cd frontend
npm install
npm run dev
```

The frontend starts on **http://localhost:5173**

> The Vite dev server proxies `/api` and `/uploads` requests to the backend at port 3001.

---

## Pages

| Route       | Description                              |
|-------------|------------------------------------------|
| `/`         | Home page with hero, services, CTA       |
| `/reviews`  | Public reviews + submit form             |
| `/examples` | Portfolio gallery                        |
| `/admin`    | Hidden admin login                       |

---

## Admin Access

Navigate to **http://localhost:5173/admin** and enter the password:

```
wisdomandy1234rocky
```

Once logged in you can:
- Upload new portfolio items on the Examples page
- Delete any review from the Reviews page
- Delete any portfolio item from the Examples page

The admin session token is stored in `localStorage` and persists across page refreshes (until you log out or the backend restarts).

---

## API Endpoints

| Method | Endpoint              | Auth     | Description             |
|--------|-----------------------|----------|-------------------------|
| POST   | `/api/auth/login`     | —        | Admin login             |
| POST   | `/api/auth/logout`    | Bearer   | Admin logout            |
| GET    | `/api/auth/verify`    | Bearer   | Verify token validity   |
| GET    | `/api/reviews`        | —        | List all reviews        |
| POST   | `/api/reviews`        | —        | Submit a new review     |
| DELETE | `/api/reviews/:id`    | Bearer   | Delete a review (admin) |
| GET    | `/api/portfolio`      | —        | List portfolio items    |
| POST   | `/api/portfolio`      | Bearer   | Upload portfolio item   |
| DELETE | `/api/portfolio/:id`  | Bearer   | Delete portfolio item   |

---

## Production Build

```bash
cd frontend
npm run build
```

Serve the `frontend/dist/` folder with any static host, and deploy the `backend/` with Node.js. Update the Vite proxy or set `VITE_API_URL` for the production backend URL.

---

## Tech Stack

- **Frontend:** React 18, React Router v6, Vite 5
- **Backend:** Node.js, Express 4
- **Database:** SQLite via better-sqlite3
- **Uploads:** Multer (stored in `backend/uploads/`)
- **Auth:** UUID session tokens in-memory (no third-party libraries)
- **Fonts:** Poppins (Google Fonts)
