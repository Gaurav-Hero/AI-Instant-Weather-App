import express from "express";
import { createClient } from "redis";
import dotenv from "dotenv";
import cors from "cors";
import fetch from "node-fetch";

dotenv.config();

const app = express();
app.use(cors());

const redisClient = createClient();
redisClient.connect().catch(console.error);

app.get("/weather", async (req, res) => {
  console.log("Request received!");
  const city = req.query.city?.toLowerCase();

  if (!city) {
    return res.status(400).json({ error: "City name is required!" });
  }

  try {
    const cachedData = await redisClient.get(city);

    if (cachedData) {
      console.log("Data from Redis ✅");
      return res.status(200).json(JSON.parse(cachedData));
    }

    const apiKey = process.env.open_weather_api_secret;
    if (!apiKey) {
      return res.status(500).json({ error: "Missing OpenWeather API key" });
    }

    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    const response = await fetch(apiUrl);

    if (!response.ok) {
      const errText = await response.text();
      console.error("API error:", errText);
      return res.status(response.status).json({ error: "Failed to fetch weather data" });
    }

    const data = await response.json();
    await redisClient.setEx(city, 300, JSON.stringify(data));

    res.json(data);
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
