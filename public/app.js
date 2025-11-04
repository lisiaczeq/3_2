const fetchBtn = document.getElementById('fetchBtn');
const limitSelect = document.getElementById('limitSelect');
const loading = document.getElementById('loading');
const error = document.getElementById('error');
const results = document.getElementById('results');
const tableBody = document.getElementById('tableBody');
const resultCount = document.getElementById('resultCount');

fetchBtn.addEventListener('click', fetchStations);

async function fetchStations() {
    const limit = limitSelect.value;
    
    hideAll();
    loading.style.display = 'block';
    
    try {
        const response = await fetch(`/api/stations?limit=${limit}`);
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Błąd podczas pobierania danych');
        }
        
        const data = await response.json();
        displayResults(data);
        
    } catch (err) {
        showError(err.message);
    } finally {
        loading.style.display = 'none';
    }
}

function displayResults(data) {
    tableBody.innerHTML = '';
    
    if (!data.results || data.results.length === 0) {
        showError('Nie znaleziono żadnych stacji');
        return;
    }
    
    data.results.forEach(station => {
        const row = document.createElement('tr');
        
        const stationId = station.id || 'N/A';
        const name = station.name || 'N/A';
        const state = station.state || 'N/A';
        const latitude = station.latitude !== undefined ? station.latitude.toFixed(4) : 'N/A';
        const longitude = station.longitude !== undefined ? station.longitude.toFixed(4) : 'N/A';
        
        row.innerHTML = `
            <td>${stationId}</td>
            <td>${name}</td>
            <td>${state}</td>
            <td>${latitude}</td>
            <td>${longitude}</td>
        `;
        
        tableBody.appendChild(row);
    });
    
    resultCount.textContent = `Znaleziono ${data.results.length} stacji (z ${data.metadata.resultset.count} dostępnych)`;
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
