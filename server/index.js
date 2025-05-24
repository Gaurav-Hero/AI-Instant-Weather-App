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
      // Parse it back to object before sending
      return res.status(200).json(JSON.parse(cachedData));
    }

    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${process.env.open_weather_api_secret}`;
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data.cod !== 200) {
      return res.status(data.cod).json(data);
    }

    // Save to Redis for 5 minutes
    await redisClient.setEx(city, 300, JSON.stringify(data));

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
