import express from 'express';
import 'dotenv/config'; 
import cors from 'cors';

import { shuffle, getRandomItems } from './utils';
import { supabase } from '../src/supabaseClient';

const app = express();
const jsonBin = process.env.JSON_BIN; 
const weatherUrl = process.env.WEATHER_URL; 

if (!jsonBin || !weatherUrl) {
  throw new Error('Missing environment variables'); 
}

app.use(cors());

app.get('/menus', async (_req, res) => {
  try {
    const response = await fetch(jsonBin); 

    if (!response.ok) {
      throw new Error (`failed to fetch data: ${response.statusText}`);
    }

    const data = await response.json();
    const sorted = data.record.sort((a, b) => a.name.localeCompare(b.name));
    res.json(sorted); 
  }
  catch(error) {
    console.error("error fetching items", error);
    res.status(500).json({ error: 'server error' });
  }
});

app.get('/menu/recommendation', async (_req, res) => {
  try {
    const response = await fetch(jsonBin); 

    if (!response.ok) {
      throw new Error (`failed to fetch data: ${response.statusText}`);
    }

    const data = await response.json();
    const meals = data.record; 

    const randomMeal = meals[Math.floor(Math.random() * meals.length)];

    res.json(randomMeal); 
  }
  catch(error) {
    console.error("error fetching items", error);
    res.status(500).json({ error: 'server error' });
  }
});

app.get('/menu/weekly', async (_req, res) => {
  try {
    const response = await fetch(jsonBin); 

    if (!response.ok) {
      throw new Error (`failed to fetch data: ${response.statusText}`);
    }

    const data = await response.json();
    const meals = data.record; 


    const selectedMeals = [
      ...getRandomItems(meals, "beef", 1),
      ...getRandomItems(meals, "pork", 1),
      ...getRandomItems(meals, "chicken", 1),
      ...getRandomItems(meals, "vegetable", 2),
      ...getRandomItems(meals, "fish", 2),
    ];

    res.json(selectedMeals); 
  }
  catch(error) {
    console.error("error fetching items", error);
    res.status(500).json({ error: 'server error' });
  }
});

app.get('/menu/weather', async (_req, res) => {
  try {
    const response = await fetch(jsonBin); 
    //manila weather
    const weatherLink = await fetch(weatherUrl);

    if (!response.ok) {
      throw new Error (`failed to fetch data: ${response.statusText}`);
    }

    const data = await response.json();
    const meals = data.record;
    
    const weatherData = await weatherLink.json(); 
    const weatherAPI = weatherData; 

    const matchMeals = meals.filter(meal => 
      Array.isArray(meal.weather_category) && 
      meal.weather_category.some (category =>
        category.toLowerCase() === weatherAPI.weather[0].main.toLowerCase())
    ); 

    const selectedMeals = shuffle(matchMeals).slice(0,5); 

    res.json({
      meals: selectedMeals, 
      weather: weatherAPI.weather[0].main
    });  
  }
  catch(error) {
    console.error("error fetching items", error);
    res.status(500).json({ error: 'server error' });
  }
});

app.get('/ingredients', async (_req, res) => {
  try {
    const {data, error} = await supabase
      .from('ingredients')
      .select('*'); 

    if (error) {
      console.error("error fetching ingredients:", error.message || error);
    }

    res.json(data); 
  }
  catch(error) {
    console.error("error fetching items", error);
    res.status(500).json({ error: 'server error' });
  }
});

export default app;
