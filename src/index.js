let apiKey = '63608bc5eef30d17258d77a3cb58927f'
let units = 'metric'

function getCurrent() {
	console.log('button clicked!')

	let options = {
		enableHighAccuracy: true,
		timeout: 5000,
		maximumAge: 0,
	}

	function success(pos) {
		let lat = pos.coords.latitude
		let lon = pos.coords.longitude

		let apiUrl = `https://api.openweathermap.org/data/2.5/weather?units=${units}&lat=${lat}&lon=${lon}&appid=${apiKey}`

		axios.get(apiUrl).then(processWeatherResponse)
	}

	function error(err) {
		let apiUrl = `https://api.openweathermap.org/data/2.5/weather?units=${units}&q=Kyiv&appid=${apiKey}`

		axios.get(apiUrl).then(processWeatherResponse)
		console.warn(`ERROR(${err.code}): ${err.message}`)
	}

	navigator.geolocation.getCurrentPosition(success, error, options)
}

function getCityWeather(city_name) {
	let apiUrl = `https://api.openweathermap.org/data/2.5/weather?units=${units}&q=${city_name}&appid=${apiKey}`
	axios
		.get(apiUrl)
		.then((response) => processWeatherResponse(response, city_name))
		.catch((error) => {
			console.log(error.response.status)
			if (error.response.status === 404) {
				let weatherInputSearch = document.querySelector(
					'#weather-input-search'
				)
				weatherInputSearch.value = ''
				weatherInputSearch.placeholder = 'Please try again 🙂!'
				return
			}
		})
}

function processWeatherResponse(response, city_name = '') {
	console.log(response)
	console.log(city_name)
	console.log(response.status)

	if (response.status === 200) {
		if (city_name === '') {
			city_name = response.data.name
		}

		document.querySelector('#weather-city').innerHTML = city_name
		let temperature = Math.round(response.data.main.temp)
		console.log(response.data.main.temp) // temperature
		let humidity = response.data.main.humidity
		console.log(response.data.main.humidity) // humidity
		let wind_speed = Math.ceil(response.data.wind.speed)
		console.log(response.data.wind.speed) // wind
		let weather_description = response.data.weather[0].description
		console.log(response.data.weather[0].description) // description

		let temperature_elem = document.querySelector('#temperature-value')
		temperature_elem.innerHTML = temperature

		let weather_description_elem = document.querySelector(
			'#weather-description'
		)
		weather_description_elem.innerHTML = weather_description

		let weather_humidity_elem = document.querySelector('#weather-humidity')
		weather_humidity_elem.innerHTML = `${humidity} %`

		let weather_wind_speed_elem = document.querySelector(
			'#weather-wind-speed'
		)
		weather_wind_speed_elem.innerHTML = `${wind_speed} m/s`
	}
}

// ⏰Feature #1
// In your project, display the current date and time using JavaScript: Tuesday 16:00

function formatDateAsDayTime(dateObject) {
	let days = [
		'Sunday',
		'Monday',
		'Tuesday',
		'Wednesday',
		'Thursday',
		'Friday',
		'Saturday',
	]

	let day = days[dateObject.getDay()]
	let hour = dateObject.getHours()
	let minutes = dateObject.getMinutes()
	minutes = minutes < 10 ? `0${minutes}` : minutes

	return `${day} ${hour}:${minutes}`
}

document.querySelector('#weather-date').innerHTML = formatDateAsDayTime(
	new Date()
)
getCityWeather('Kyiv')
getCurrent()

document
	.querySelector('#weather-show-current')
	.addEventListener('click', getCurrent)

// Your task
// In your project, when a user searches for a city (example: New York), it should display the name of the city on the result page and the current temperature of the city.
document
	.querySelector('#weather-button-search')
	.addEventListener('click', function (event) {
		event.preventDefault()

		document.querySelector('#weather-date').innerHTML = formatDateAsDayTime(
			new Date()
		)

		let weatherInputSearch = document.querySelector('#weather-input-search')
		let city_name = weatherInputSearch.value
		city_name = city_name.trim()
		if (city_name) {
			getCityWeather(city_name)
		} else {
			weatherInputSearch.placeholder = 'City is required!'
		}
	})
