import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000; // Ensure this uses Render's assigned port

app.use(cors());

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

if (!TMDB_API_KEY) {
  console.error("❌ TMDB_API_KEY is missing! Set it in .env or Render.");
}

app.get("/movies", async (req, res) => {
  try {
    const { query } = req.query;
    const endpoint = query
      ? `${TMDB_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
      : `${TMDB_BASE_URL}/discover/movie?sort_by=popularity.desc`;

    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${TMDB_API_KEY}`,
      },
    });

    if (!response.ok) {
      console.error(`❌ TMDB API Error: ${response.status} ${response.statusText}`);
      return res.status(response.status).json({ error: "Failed to fetch movies from TMDB" });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("❌ Error in backend:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Explicitly bind to the port Render provides
app.listen(PORT, "0.0.0.0", () => console.log(`✅ Server running on port ${PORT}`));
