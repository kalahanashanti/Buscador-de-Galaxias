
document.addEventListener('DOMContentLoaded', function () {
    const searchButton = document.querySelector('button');
    const searchInput = document.querySelector('input');
    const resultsContainer = document.createElement('div');
    resultsContainer.classList.add('row', 'mt-4');
    document.body.appendChild(resultsContainer);

    searchButton.addEventListener('click', async function () {
        const query = searchInput.value.trim();
        if (!query) return alert('Por favor, escribe algo para buscar.');

        resultsContainer.innerHTML = '<p class="text-center mt-3">Buscando imágenes...</p>';
        
        try {
            const response = await fetch(`https://images-api.nasa.gov/search?q=${encodeURIComponent(query)}`);
            const data = await response.json();

            const items = data.collection.items;
            if (!items || items.length === 0) {
                resultsContainer.innerHTML = '<p class="text-center mt-3">No se encontraron resultados.</p>';
                return;
            }

            resultsContainer.innerHTML = '';
            items.forEach(item => {
                const img = item.links && item.links[0] ? item.links[0].href : '';
                const title = item.data[0].title || 'Sin título';
                const desc = item.data[0].description || 'Sin descripción';
                const date = item.data[0].date_created || 'Fecha no disponible';

                const card = document.createElement('div');
                card.classList.add('col-md-4', 'mb-4');
                card.innerHTML = `
                    <div class="card h-100 shadow-sm">
                        <img src="${img}" class="card-img-top" alt="${title}">
                        <div class="card-body">
                            <h5 class="card-title">${title}</h5>
                            <p class="card-text" style="max-height:120px;overflow:auto;">${desc}</p>
                            <p class="text-muted small">${new Date(date).toLocaleDateString()}</p>
                        </div>
                    </div>
                `;
                resultsContainer.appendChild(card);
            });
        } catch (error) {
            resultsContainer.innerHTML = '<p class="text-center text-danger mt-3">Error al obtener los datos.</p>';
            console.error(error);
        }
    });
});
