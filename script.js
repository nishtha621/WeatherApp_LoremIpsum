const express = require('express');
const https = require('https');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});

app.post('/', (req, res) => {
    const query = req.body.cityName;
    const apiKey = 'bd14f0cb47b2495d87c114353240109';
    const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${query}`;

    https.get(url, (response) => {
        let data = '';

        response.on('data', (chunk) => {
            data += chunk;
        });

        response.on('end', () => {
                const weatherData = JSON.parse(data);
                const temp = weatherData.current.temp_c;
                const icon = weatherData.current.condition.icon;
                const condition = weatherData.current.condition.text;
                const windSpeed = weatherData.current.wind_kph;
                
                res.send(`
                    <!DOCTYPE html>
                    <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Weather App</title>
                    </head>
                     <style>
        @import url('https://fonts.googleapis.com/css2?family=Poiret+One&display=swap');
        
        body {
            background-color: #282c34;
            color: #ffffff;
            font-family: 'Poiret One', sans-serif;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
        }

        .card {
            background-color: #3b4049;
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
            border-radius: 12px;
            padding: 30px;
            max-width: 400px;
            width: 100%;
            text-align: center;
        }

        .card h1 {
            margin-bottom: 20px;
            font-size: 24px;
            color: #f9f9f9;
        }

        form {
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        #city {
            width: 100%;
            border-radius: 25px;
            border: 2px solid #61dafb;
            padding: 10px;
            font-size: 18px;
            margin-bottom: 20px;
            outline: none;
            transition: border-color 0.3s ease;
            background-color: #2c313a;
            color: #ffffff;
        }

        #city:focus {
            border-color: #21a1f1;
        }

        button {
            background-color: #2bc6f1;
            color: #282c34;
            font-size: 18px;
            padding: 10px 20px;
            border: none;
            border-radius: 25px;
            cursor: pointer;
            transition: background-color 0.3s ease;
        }

        button:hover {
            background-color: #4f8b77;
        }

        #weatherResult {
            margin-top: 20px;
            font-size: 18px;
            color: #f9f9f9;
        }
    </style>
                    <body>
                        <div class="card">
                            <h2>Weather App</h2>
                            <form method="post" action="/">
                                <input type="text" name="cityName" id="city" placeholder="Enter City Name">
                                <button type="submit">Go</button>
                            </form>
                            <div id="weatherResult">
                                <h3>Weather Details for ${query}:</h3>
                                <p class="temperature">Temperature: ${temp}°C</p>
                                <img src=${icon}>
                                <p class="condition">Condition: ${condition}</p>
                                <p class="wind">Wind Speed: ${windSpeed} kph</p>
                            </div>
                        </div>
                        <script src="/js/script.js"></script>
                    </body>
                    </html>
                `); 
        });
    })
});

app.listen(3001, () => {
    console.log("Listening to port 3001");
});
