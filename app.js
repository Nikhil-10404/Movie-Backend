import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Enable CORS (Allows frontend to access backend)
app.use(cors());

// TMDB API Configuration
const TMDB_API_KEY = process.env.EXPO_PUBLIC_MOVIE_API_KEY; // Ensure this is set in .env
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

// Proxy Route for Searching Movies
app.get("/movies", async (req, res) => {
  const { query } = req.query;
  const endpoint = query
    ? `${TMDB_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
    : `${TMDB_BASE_URL}/discover/movie?sort_by=popularity.desc`;

  try {
    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${TMDB_API_KEY}`, // Use the Bearer token authentication
      },
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: "Failed to fetch movies" });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch movies" });
  }
});

// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
