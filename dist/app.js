"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("dotenv/config");
const cors_1 = __importDefault(require("cors"));
const supabaseClient_1 = require("./supabaseClient");
const app = (0, express_1.default)();
const port = 3000;
const jsonBin = 'https://api.jsonbin.io/v3/b/6858e85e8a456b7966b3c53d';
app.use((0, cors_1.default)());
app.get('/menus', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield fetch(jsonBin);
        if (!response.ok) {
            throw new Error(`failed to fetch data: ${response.statusText}`);
        }
        const data = yield response.json();
        const sorted = data.record.sort((a, b) => a.name.localeCompare(b.name));
        // res.set('Access-Control-Allow-Origin', 'http://localhost:5173');
        res.json(sorted);
    }
    catch (error) {
        console.error("error fetching items", error);
        res.status(500).json({ error: 'server error' });
    }
}));
app.get('/menu/recommendation', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield fetch(jsonBin);
        if (!response.ok) {
            throw new Error(`failed to fetch data: ${response.statusText}`);
        }
        const data = yield response.json();
        const meals = data.record;
        const randomMeal = meals[Math.floor(Math.random() * meals.length)];
        res.json(randomMeal);
    }
    catch (error) {
        console.error("error fetching items", error);
        res.status(500).json({ error: 'server error' });
    }
}));
app.get('/menu/weekly', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield fetch(jsonBin);
        if (!response.ok) {
            throw new Error(`failed to fetch data: ${response.statusText}`);
        }
        const data = yield response.json();
        const meals = data.record;
        function shuffle(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
        }
        function getRandomMeals(category, count) {
            const filtered = meals.filter(meal => meal.category.toLowerCase() === category.toLowerCase());
            if (filtered.length < count)
                throw new Error(`Not enough meals in category: ${category}`);
            const shuffled = shuffle(filtered);
            return shuffled.slice(0, count);
        }
        const selectedMeals = [
            ...getRandomMeals("beef", 1),
            ...getRandomMeals("pork", 1),
            ...getRandomMeals("chicken", 1),
            ...getRandomMeals("vegetable", 2),
            ...getRandomMeals("fish", 2),
        ];
        res.json(selectedMeals);
    }
    catch (error) {
        console.error("error fetching items", error);
        res.status(500).json({ error: 'server error' });
    }
}));
app.get('/menu/weather', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield fetch(jsonBin);
        //manila weather
        const weatherLink = yield fetch('https://api.openweathermap.org/data/2.5/weather?lat=14.5995&lon=120.9842&appid=c3396e5e2e2abade593313b1fde02551');
        if (!response.ok) {
            throw new Error(`failed to fetch data: ${response.statusText}`);
        }
        const data = yield response.json();
        const meals = data.record;
        const weatherData = yield weatherLink.json();
        const weatherAPI = weatherData;
        const matchMeals = meals.filter(meal => Array.isArray(meal.weather_category) &&
            meal.weather_category.some(category => category.toLowerCase() === weatherAPI.weather[0].main.toLowerCase()));
        function shuffle(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
        }
        function getRandomMeals(count) {
            if (matchMeals.length < count) {
                throw new Error('Not enough meals');
            }
            const shuffled = shuffle(matchMeals);
            return shuffled.slice(0, count);
        }
        const selectedMeals = getRandomMeals(5);
        res.json({
            meals: selectedMeals,
            weather: weatherAPI.weather[0].main
        });
    }
    catch (error) {
        console.error("error fetching items", error);
        res.status(500).json({ error: 'server error' });
    }
}));
app.get('/ingredients', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { data, error } = yield supabaseClient_1.supabase
            .from('ingredients')
            .select('*');
        if (error) {
            console.error("error fetching ingredients:", error.message || error);
        }
        res.json(data);
    }
    catch (error) {
        console.error("error fetching items", error);
        res.status(500).json({ error: 'server error' });
    }
}));
app.listen(port, () => {
    return console.log(`listening at http://localhost:${port}`);
});
//# sourceMappingURL=app.js.map