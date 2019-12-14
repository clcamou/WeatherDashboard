$(document).ready(function () {
    //click listeners to activate the functions and Calls
    $("#search-btn").click(weatherNow);
    $("#search-btn").click(fiveDayForecast);
    $("#cityList").click(weatherNow);
    $("#cityList").click(fiveDayForecast);

    let userInput;
    let time = moment().format("LL");
    let myKey = "ad5b05f2107956afacca6e7b08b1f854";
    $(".figure").css("display", "none");
    // $("#search-container").css("left", "320px");
    $(".ul-container").css("display", "none");

    //Function to call current weather  
    function weatherNow(event) {
        event.preventDefault();
        //will target the value of the user userInput or the saved list
        if ($(this).attr("id") === "cityList") {
            let x = event.target;
            userInput = $(x).text();
            console.log(userInput);
        } else {
            userInput = $(this).prev().val(); //getting value of user input
        }
        $(".figure").empty(); //empty search results upon each new search
        $("#search-container").animate({ "left": "10px"}, 600);
        $(".ul-container").css("display", "flex");
        let queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + userInput + "&APPID=" + myKey;
        //calling the API
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            console.log(response);
            $(".figure").css("display", "block");
            //setting the values to a new DOM element 
            let city = $("<h1>").addClass("city-name").text(`City: ${response.name}`);
            let date = $("<h3>").addClass("date").text(`Date: ${time}`);
            let iconImage = $("<img>").addClass("icon-image").attr("src", "https://openweathermap.org/img/w/" + response.weather[0].icon + ".png");
            let tempF = parseInt((response.main.temp - 273.15) * 1.8 + 32); //kelvin to farenheight Conversion
            let temperature = $("<h4>").addClass("current-temp").text(`Current Temperature: ${tempF} F°`);
            let humidity = $("<h4>").addClass("humidity").text(`Humidity: ${response.main.humidity}%`);
            let windSpeed = $("<h4>").addClass("wind-speed").text(`Wind Speed ${response.wind.speed} mph`);
            //Appending the values to the figure box
            $(".figure").append(city, iconImage, date, temperature, humidity, windSpeed);

        })

    }
    //end current day call begin Five day forecast call
    function fiveDayForecast() {
        if ($(this).attr("id") === "cityList") {
            let x = event.target;
            userInput = $(x).text();
            console.log(userInput);
        } else {
            userInput = $(this).prev().val(); //getting value of user input
        }
        let dayDisplay = 1;
        let fiveDayCall = "https://api.openweathermap.org/data/2.5/forecast?q=" + userInput + "&APPID=" + myKey;
        //calling the 5 day forecast
        $.ajax({
            url: fiveDayCall,
            method: "GET"
        }).then(function (response) {
            console.log(response);
            let listArray = response.list;
            listArray.forEach(element => {   //use for each method to loop through object list
                //   console.log(element);
                let yearDateTime = element.dt_txt;
                //    console.log (yearDatetime);    
                let currentDate = yearDateTime.split(" ")[0]; //splitting the full date
                let currentTime = yearDateTime.split(" ")[1]; //and time  in the object
                
                //getting a specific time of day to pull data from and insert inot the DOM
                if (currentTime === "15:00:00") {
                    let day = currentDate.split("-")[2];
                    let month = currentDate.split("-")[1];
                    let year = currentDate.split("-")[0];
                    $("#day-" + dayDisplay).children(".date-display").html(`${month}/${day}/${year}`);
                    $("#day-" + dayDisplay).children("#daily-icon").attr("src", "http://openweathermap.org/img/w/" + element.weather[0].icon + ".png");
                    $("#day-" + dayDisplay).children("#daily-temp").html(`Temperature: ${parseInt((element.main.temp - 273.15) * 1.8 + 32)}°F`);
                    $("#day-" + dayDisplay).children("#5day-humidity").html(`Humidity: ${element.main.humidity}% `);
                    dayDisplay++

                }
            })
        })
    }

    //-------------------------Local Storage-----------//
    let ul = $("#cityList");
    let itemsArray = localStorage.getItem('items') ? JSON.parse(localStorage.getItem('items')) : [];
    let data = JSON.parse(localStorage.getItem('items'));

    let liMaker = text => {
        let li = $('<li>').addClass("created-city btn btn-light");
        li.text(text);
        ul.prepend(li);
    }
    $("#search-btn").click(function () {
        itemsArray.push(userInput);
        localStorage.setItem('items', JSON.stringify(itemsArray));
        liMaker(userInput);
    })

    data.forEach(item => {
        liMaker(item);
        console.log(item);
    })
    $(".clr-btn").on("click", function () {
        $(".created-city").remove();
        localStorage.clear();
        $("input").empty();
    })
})