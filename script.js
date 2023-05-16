const express = require('express');
const request = require("request");
const cors = require("cors");

const app = express();

app.use(cors());

const key = "464243b996423326f3db39e9cc325380"

// const API_KEY = ""

app.get('/weather/:lat/:lon', (req, res) => {
    console.log("welcome to the root!");
    var lat = req.params.lat;
    var lon = req.params.lon;
    var url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}&units=imperial`

    console.log(url);

    request(url, (error, response, body) => {

        // Printing the error if occurred
        if (error) {
            console.log(error);
        }

        // Printing status code
        console.log(response.statusCode);

        body = JSON.parse(body);

        // Printing body
        console.log(body.main.temp);

        res.send({ "temperature": body.main.temp, "weatherStatus": body.weather[0].main });
    });
});

app.get('/5day/:lat/:lon', (req, res) => {
    var lat = req.params.lat;
    var lon = req.params.lon;
    var url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${key}&units=imperial`

    console.log(url);

    request(url, (error, response, body) => {

        // Printing the error if occurred
        if (error) {
            console.log(error);
        }

        // Printing status code
        console.log(response.statusCode);

        body = JSON.parse(body);

        // Printing body
        // console.log(body);

        const week = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        let forecast = [];
        let todaysDate = new Date().getDay();

        let temps = {};
        for (let dp of body.list) {
            let date = new Date(dp.dt * 1000);
            let day = date.getDay();
            if (temps[day] === undefined) {
                temps[day] = { "dayName": week[day], "temp": 0, "count": 0 };
            }
            temps[day].temp += dp.main.temp;
            temps[day].count++;
        }

        for (let day in temps) {
            day = temps[`${day}`];
            let avg = Math.round(day.temp / day.count);
            forecast.push({ "dayName": day.dayName, "temp": avg });
        }

        // for (let i = 0; i < 5; i++) {
        //     let tempSum = 0; // Sum of all temperatures in a day
        //     let count = 0; // Datapoints per day
        //     for (let datapoint of body.list) {
        //         let date = new Date(datapoint.dt * 1000);
        //         if (date.getDay() === todaysDate) {
        //             tempSum += datapoint.main.temp;
        //             count++;
        //         }
        //     }
        //     console.log(tempSum);
        //     let day = { "dayName": week[todaysDate], "temp": Math.round(tempSum / count) };
        //     forecast.push(day);
        //     todaysDate = (todaysDate + 1) % 7;
        // }

        res.send(forecast);
    });
});

app.listen(3000, () => {
    console.log('Example app listening on port 3000!');
});

