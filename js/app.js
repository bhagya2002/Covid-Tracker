// select the elements from HTML
const country_name_element = document.querySelector(".country .name");
const total_cases_element = document.querySelector(".total-cases .value");
const new_cases_element = document.querySelector(".total-cases .new-value");
const recovered_element = document.querySelector(".recovered .value");
const new_recovered_element = document.querySelector(".recovered .new-value");
const deaths_element = document.querySelector(".deaths .value");
const new_deaths_element = document.querySelector(".deaths .new-value");

// select the canvas element
const ctx = document.querySelector("canvas").getContext("2d");

// DATA collected
let app_data = [],
	cases_list = [],
	recovered_list = [],
	deaths_list = [],
	dates = [],
	formatedDates = [];

// get the users country code
let country_code = geoplugin_countryCode();
let user_country;

// check the country codes to the one retreived from geoplugin and check for comparisions, if they compare then we know the location of the user
country_list.forEach(country => {
	if (country.code == country_code) {
		user_country = country.name;
	}
});

// fetch statement to retreive data from the API
function fetchData(user_country) {
	// reset the laoding animation title for the country
	country_name_element.innerHTML = "Loading...";
	// set arrays to empty to reset for each country
	cases_list = [], recovered_list = [], deaths_list = [], dates = [], formatedDates = [];

	// fetch from API
	fetch(`https://covid19-monitor-pro.p.rapidapi.com/coronavirus/cases_by_days_by_country.php?country=${user_country}`, {
			"method": "GET",
			"headers": {
				"x-rapidapi-host": "covid19-monitor-pro.p.rapidapi.com",
				"x-rapidapi-key": "11f9888308msh1a247f9e34000b6p1c316fjsned0bcd69a910"
			}
		})
		// only when this is connected and data is retireved then run this (promise)
		.then(response => {
			return response.json();
		})
		// only when the API responds to the users call this will run and gets the data in an Object class (promise)
		.then(data => {
			dates = Object.keys(data);

			// remove the commas from the numbers and push them into the array
			dates.forEach(date => {
				let DATA = data[date];

				formatedDates.push(formatDate(date));
				app_data.push(DATA)
				cases_list.push(parseInt(DATA.total_cases.replace(/,/g, "")));
				recovered_list.push(parseInt(DATA.total_recovered.replace(/,/g, "")));
				deaths_list.push(parseInt(DATA.total_deaths.replace(/,/g, "")));
			})
		})
		// after the data is stored in an array then update front-end (promise)
		.then(() => {
			updateUI();
		})
		// catch the errors in the fetch statment and code after it runs
		.catch(error => {
			alert(error);
		})
}

// set parameter
fetchData(user_country);

// update the user inteface (stats) and the canas (chart)
function updateUI() {
	updateStats();
	axesLinearChart();
}

// update the numbers displayed on the screen
function updateStats() {
	// get the last and second last recorded data
	let last_entry = app_data[app_data.length - 1];
	let before_last_entry = app_data[app_data.length - 2];
	console.log(last_entry);

	// change the name of the country to the user's country or the new selected country
	country_name_element.innerHTML = last_entry.country_name;

	// get the total number of cases
	total_cases_element.innerHTML = last_entry.total_cases || 0;
	new_cases_element.innerHTML = `+${last_entry.new_cases || 0}`

	// number of recovered cases
	recovered_element.innerHTML = last_entry.total_recovered || 0;
	new_recovered_element.innerHTML = `+${parseInt(last_entry.total_recovered.replace(/,/g, "")) - parseInt(before_last_entry.total_recovered.replace(/,/g, ""))}`;

	// number of deaths
	deaths_element.innerHTML = last_entry.total_deaths;
	new_deaths_element.innerHTML = `+${last_entry.new_deaths || 0}`;
}

// update the chart
let my_chart;

function axesLinearChart() {
	// reset the chart when a new country is choosen
	if (my_chart) {
		my_chart.destroy();
	}

	my_chart = new Chart(ctx, {
		type: 'line',
		data: {
			datasets: [{
				label: 'Cases',
				data: cases_list,
				fill: false,
				borderColor: '#fff',
				backgroundColor: '#fff',
				borderWidth: 1
			}, {
				label: 'Recovered',
				data: recovered_list,
				fill: false,
				borderColor: '#009688',
				backgroundColor: '#009688',
				borderWidth: 1
			}, {
				label: 'Deaths',
				data: deaths_list,
				fill: false,
				borderColor: '#f44336',
				backgroundColor: '#f44336',
				borderWidth: 1
			}],
			labels: formatedDates

		},
		options: {
			responsive: true,
			maintainAspectRatio: false
		}
	});
}

// Format the dates to show as months
const monthsNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function formatDate(dateString) {
	let date = new Date(dateString);

	return `${date.getDate()} ${monthsNames[date.getMonth()]}`;
}