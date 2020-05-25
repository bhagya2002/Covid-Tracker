// select the elements
const country_name_element = document.querySelector(".country .name");
const total_cases_element = document.querySelector(".total-cases .value");
const new_cases_element = document.querySelector(".total-cases .new-value");
const recovered_element = document.querySelector(".recovered .value");
const new_recovered_element = document.querySelector(".recovered .new-value");
const deaths_element = document.querySelector(".deaths .value");
const new_deaths_element = document.querySelector(".deaths .new-value");


const ctx = document.querySelector("canvas").getContext("2d");

// DATA collected
let app_data = [],
	cases_list = [],
	recovered_list = [],
	deaths_list = [],
	dates = [];

// get the users country code
let country_code = geoplugin_countryCode();
let user_country;

country_list.forEach(country => {
	if (country.code == country_code) {
		user_country = country.name;
	}
});


function fetchData(user_country) {
	fetch(`https://covid19-monitor-pro.p.rapidapi.com/coronavirus/cases_by_days_by_country.php?country=${user_country}`, {
			"method": "GET",
			"headers": {
				"x-rapidapi-host": "covid19-monitor-pro.p.rapidapi.com",
				"x-rapidapi-key": "11f9888308msh1a247f9e34000b6p1c316fjsned0bcd69a910"
			}
		})
		.then(response => {
			return response.json();
		}).then(data => {
			dates = Object.keys(data);

			dates.forEach(date => {
				let DATA = data[date];
				app_data.push(DATA)
				cases_list.push(parseInt(DATA.total_cases.replace(/,/g, "")));
				recovered_list.push(parseInt(DATA.total_recovered.replace(/,/g, "")));
				deaths_list.push(parseInt(DATA.total_deaths.replace(/,/g, "")));
			})
		})
		.then(() => {
			updateUI();
		})
		.catch(error => {
			alert(error);
		})
}
fetchData(user_country);

// update the user inteface
function updateUI() {
	updateStats();
	// axesLinearChart();
}

function updateStats() {
	let last_entry = app_data[app_data.length - 1];
	let before_last_entry = app_data[app_data.length - 2];
	console.log(last_entry);

	country_name_element.innerHTML = last_entry.country_name;

	total_cases_element.innerHTML = last_entry.total_cases || 0;
	new_cases_element.innerHTML = `+${last_entry.new_cases || 0}`

	recovered_element.innerHTML = last_entry.total_recovered;
	new_recovered_element.innerHTML = `+${parseInt(last_entry.total_recovered.replace(/,/g, "")) - parseInt(before_last_entry.total_recovered.replace(/,/g, ""))}`;

	deaths_element.innerHTML = last_entry.total_deaths;
	new_deaths_element.innerHTML = `+${parseInt(last_entry.total_deaths.replace(/,/g, "")) - parseInt(before_last_entry.total_deaths.replace(/,/g, ""))}`;
}