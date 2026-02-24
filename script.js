const apiKey = '8e023511fab641b7199445a1e35f08f2';
const apiUrl = 'https://api.openweathermap.org/data/2.5/weather?units=metric&q=';

const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const weatherInfo = document.querySelector(".weather-info");
const errorBox = document.querySelector(".error");
const loadingSpinner = document.getElementById("loading");

async function getWeatherData(city) {
    if (!city.trim()) return;

    // UI Reset
    loadingSpinner.style.display = "block";
    weatherInfo.style.display = "none";
    errorBox.style.display = "none";

    try {
        const response = await fetch(apiUrl + city + `&appid=${apiKey}`);

        if (response.status == 404) {
            throw new Error("City not found");
        }

        const data = await response.json();
        
        // Update DOM Elements
        document.getElementById('city-name').textContent = data.name;
        document.getElementById('temperature').textContent = Math.round(data.main.temp) + "°c";
        document.getElementById('humidity').textContent = data.main.humidity + "%";
        document.getElementById('wind-speed').textContent = data.wind.speed + " km/h";
        document.getElementById('description').textContent = data.weather[0].description;
        
        // High-res icon
        document.getElementById('weather-icon').src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`;

        // Dynamic Background Logic
        updateBackground(data.weather[0].main);

        loadingSpinner.style.display = "none";
        weatherInfo.style.display = "block";

    } catch (error) {
        loadingSpinner.style.display = "none";
        errorBox.style.display = "block";
    }
}

function updateBackground(condition) {
    let color = "";
    switch(condition) {
        case "Clear": color = "linear-gradient(45deg, #f7b733, #fc4a1a)"; break;
        case "Clouds": color = "linear-gradient(45deg, #5D4157, #A8CABA)"; break;
        case "Rain": 
        case "Drizzle": 
        case "Mist": color = "linear-gradient(45deg, #203A43, #2C5364)"; break;
        case "Snow": color = "linear-gradient(45deg, #83a4d4, #b6fbff)"; break;
        default: color = "linear-gradient(45deg, #0f0c29, #302b63, #24243e)";
    }
    document.body.style.background = color;
}

searchBtn.addEventListener('click', () => getWeatherData(cityInput.value));

cityInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        getWeatherData(cityInput.value);
    }
});