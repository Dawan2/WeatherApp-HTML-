function suggestCities(query) {
    const geonamesApiUrl = `https://api.geonames.org/searchJSON?q=${query}&maxRows=5&username=your_geonames_username`;

    return fetch(geonamesApiUrl)
        .then(response => response.json())
        .then(data => data.geonames.map(city => city.name));
}

function displaySuggestions(suggestions) {
    const suggestionList = document.getElementById('suggestion-list');
    suggestionList.innerHTML = '';

    suggestions.forEach(city => {
        const listItem = document.createElement('li');
        listItem.textContent = city;
        listItem.addEventListener('click', () => {
            document.getElementById('cityInput').value = city;
            searchWeather();
        });

        suggestionList.appendChild(listItem);
    });
}

function searchWeather() {
    const cityInput = document.getElementById('cityInput').value;

    if (cityInput.trim() === '') {
        alert('Please enter a city name');
        return;
    }

    showLoadingMessage();
    clearInterval(updateInterval);
    getWeatherInfo(cityInput);
}

function refreshWeather() {
    const defaultCity = 'London';
    showLoadingMessage();
    getWeatherInfo(defaultCity);
}

function showLoadingMessage() {
    document.getElementById('weather-info').innerHTML = 'Loading...';
}

function handleInput() {
    const query = document.getElementById('cityInput').value;

    if (query.trim() === '') {
        document.getElementById('suggestion-list').innerHTML = '';
        return;
    }

    suggestCities(query)
        .then(suggestions => displaySuggestions(suggestions))
        .catch(error => console.error('Error fetching city suggestions:', error));
}

function getWeatherInfo(cityName) {
    const apiKey = 'YOUR_API_KEY';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&APPID=${apiKey}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const location = data.name;
            const country = data.sys.country;
            const description = data.weather[0].description;
            const temperature = (data.main.temp - 273.15).toFixed(2);
            const feelsLike = (data.main.feels_like - 273.15).toFixed(2);
            const humidity = data.main.humidity;
            const windSpeed = data.wind.speed;

            const weatherInfo = `
                <p>Location: ${location}, ${country}</p>
                <p>Description: ${description}</p>
                <p>Temperature: ${temperature} °C</p>
                <p>Feels like: ${feelsLike} °C</p>
                <p>Humidity: ${humidity}%</p>
                <p>Wind speed: ${windSpeed} m/s</p>
            `;

            document.getElementById('weather-info').innerHTML = weatherInfo;
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            document.getElementById('weather-info').innerText = 'Unable to fetch weather data';
        });
}

getWeatherInfo('London');

const updateInterval = setInterval(function() {
    const defaultCity = 'London';
    getWeatherInfo(defaultCity);
}, 5000);

document.getElementById('search-btn').addEventListener('click', searchWeather);
document.getElementById('cityInput').addEventListener('input', handleInput);