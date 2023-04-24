import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;

const refs = {
  countryInput: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

function onCountryInput() {
  const name = refs.countryInput.value.trim();
  refs.countryList.innerHTML = '';
  refs.countryInfo.innerHTML = '';
  if (refs.countryInput.value === '') {
    return;
  }
  fetchCountries(name)
    .then(countries => {
      // refs.countryList.innerHTML = ''
      // refs.countryInfo.innerHTML = ''
      if (countries.length === 1) {
            renderCountryInfo(countries);
      } else if (countries.length > 1 && countries.length <= 10) {
            renderCountryList(countries);
      } else {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      }
    })
    .catch(Notiflix.Notify.failure('Oops, there is no country with that name'));
}

refs.countryInput.addEventListener(
  'input',
  debounce(onCountryInput, DEBOUNCE_DELAY)
);

function renderCountryList(countries) {
  const markup = countries
    .map(country => {
      return `
        <li class="country-list__item">
            <img class="country-list__flag" src="${country.flags.svg}" alt="Flag of ${country.name.official}" width = 30px height = 30px>
            <h2 class="country-list__name">${country.name.official}</h2>
        </li>
        `;
    })
    .join('');
    refs.countryList.innerHTML = markup;
}

function renderCountryInfo(countries) {
  const markup = countries
    .map(country => {
      return `
        <ul class="country-info__list">
        <li class="country-list__item">
        <img class="country-list__flag" src="${
          country.flags.svg
        }" alt="Flag of ${country.name.official}" width = 30px height = 30px>
        <h2 class="country-list__name">${country.name.official}</h2>
    </li>
            <li class="country-info__item"><p><b>Capital: </b>${
              country.capital
            }</p></li>
            <li class="country-info__item"><p><b>Population: </b>${
              country.population
            }</p></li>
            <li class="country-info__item"><p><b>Languages: </b>${Object.values(
              country.languages
            ).join(', ')}</p></li>
        </ul>
        `;
    })
    .join('');
    refs.countryInfo.innerHTML = markup;
}
