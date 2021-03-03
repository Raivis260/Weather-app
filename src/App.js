import "./styles/app.scss";
import React, { useState, useEffect } from "react";
import Loading from "./components/Loading";
import formatDate from "./utils/formatDate";
import axios from "axios";
import { Line } from "react-chartjs-2";

function App() {
  const [position, setPosition] = useState();
  const [data, setData] = useState();

  useEffect(() => {
    if (!navigator.geolocation) {
      console.log("Not available.");
    } else {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setPosition(pos);
        },
        () => {
          console.log("ERROR");
        }
      );
    }
  }, []);

  useEffect(() => {
    if (position) {
      axios
        .get(
          ` https://api.openweathermap.org/data/2.5/onecall?lat=${position.coords.latitude}&lon=${position.coords.longitude}&units=metric&appid=${process.env.REACT_APP_KEY}`
        )
        .then((result) => setData(result.data))
        .catch((err) => console.log(err.message));
    } else {
      console.log("Loading...");
    }
  }, [position]);

  if (position && data) {
    let currentDayIcon = `http://openweathermap.org/img/wn/${data.current.weather[0].icon}@2x.png`;
    let date = formatDate(Number(data.current.dt + "000"));
    const days = [];
    const graphTempData = [];
    const graphLabels = [];
    for (let i = 0; i < 4; i++) {
      let dayIcon = `http://openweathermap.org/img/wn/${data.daily[i].weather[0].icon}@2x.png`;
      days.push(
        <div className="day" key={data.daily[i].dt}>
          <h3>{formatDate(Number(data.daily[i].dt + "000"))}</h3>
          <img src={dayIcon} alt="day_icon" />
          <h4>Humidity</h4>
          <h3>{data.daily[i].humidity}%</h3>
          <h3>{data.daily[i].temp.day}&deg;C</h3>
        </div>
      );
      graphTempData.push(data.daily[i].temp.day);
      graphLabels.push(formatDate(Number(data.daily[i].dt + "000")));
    }

    return (
      <div className="App">
        <div className="container">
          <h1>Hey, check weather out!</h1>
          <div className="header">
            <h1>
              Your location: {position.coords.latitude},
              {position.coords.longitude}
            </h1>
          </div>
          <div className="content">
            <div className="content__today">
              <div className="today__time">
                <h2>{date}</h2>
              </div>
              <div className="today__temperature">
                <img src={currentDayIcon} alt="weather_icon" />
                <h1 className="temperature__number">
                  {data.current.temp}&deg;C
                </h1>
              </div>
              <div className="today__type">
                <h1>{data.current.weather[0].main}</h1>
              </div>
              <div className="today__extraInfo">
                <div className="extraInfo__humidity">
                  <p>Humidity</p>
                  <h2>{data.current.humidity}%</h2>
                </div>
                <div className="extraInfo__wind">
                  <p>Wind speed</p>
                  <h2>{data.current.wind_speed} km/h</h2>
                </div>
              </div>
            </div>
            <div className="content__week">
              <h2>Temperature</h2>
              <div className="week__graph">
                <Line
                  data={{
                    labels: graphLabels,
                    datasets: [
                      {
                        label: "# degrees of Celcius",
                        data: graphTempData,
                        backgroundColor: "rgba(137, 196, 244, 0.5)",
                        borderWidth: 1,
                        borderColor: "blue",
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    scales: {
                      xAxes: [
                        {
                          display: false,
                        },
                      ],
                      yAxes: [
                        {
                          display: true,
                        },
                      ],
                    },
                  }}
                />
              </div>
              <div className="week__days">{days}</div>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div>
        <Loading />
      </div>
    );
  }
}

export default App;
