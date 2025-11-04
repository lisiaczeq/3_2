const capitalInput = document.getElementById('capitalInput');
const searchBtn = document.getElementById('searchBtn');
const loading = document.getElementById('loading');
const error = document.getElementById('error');
const results = document.getElementById('results');
const tableBody = document.getElementById('tableBody');

searchBtn.addEventListener('click', searchCountry);
capitalInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchCountry();
    }
});

async function searchCountry() {
    const capital = capitalInput.value.trim();
    
    if (!capital) {
        showError('Proszę wpisać nazwę stolicy');
        return;
    }
    
    hideAll();
    loading.style.display = 'block';
    
    try {
        const response = await fetch(`https://restcountries.com/v3.1/capital/${capital}`);
        
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Nie znaleziono kraju z podaną stolicą');
            }
            throw new Error('Błąd podczas pobierania danych');
        }
        
        const data = await response.json();
        displayResults(data);
        
    } catch (err) {
        showError(err.message);
    } finally {
        loading.style.display = 'none';
    }
}

function displayResults(countries) {
    tableBody.innerHTML = '';
    
    countries.forEach(country => {
        const row = document.createElement('tr');
        
        const name = country.name.common || 'N/A';
        const capital = country.capital ? country.capital[0] : 'N/A';
        const population = country.population ? country.population.toLocaleString('pl-PL') : 'N/A';
        const region = country.region || 'N/A';
        const subregion = country.subregion || 'N/A';
        
        row.innerHTML = `
            <td>${name}</td>
            <td>${capital}</td>
            <td>${population}</td>
            <td>${region}</td>
            <td>${subregion}</td>
        `;
        
        tableBody.appendChild(row);
    });
    
    results.style.display = 'block';
}

function showError(message) {
    error.textContent = message;
    error.style.display = 'block';
}

function hideAll() {
    loading.style.display = 'none';
    error.style.display = 'none';
    results.style.display = 'none';
}
