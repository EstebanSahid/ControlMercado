// Array vacío para almacenar productos
let productsData = [];

async function getProducts() {
    let response;
    try {
        response = await gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: "1r7gID6GMISJ_ysgIo-uwKKALI-PjMP7WYKrt6_RckEc",
        range: "Productos!B2:C",
        });
    } catch (err) {
        console.error("Error:: " + err);
        return;
    }

    const range = response.result;
    if (!range || !range.values || range.values.length == 0) {
        console.warn("No se encontraron valores");
        alert("No se encontraron productos");
        return;
    }

    // Almacenamos los productos y los mostramos inicialmente
    productsData = range.values;
    displayProducts(productsData);
}

function displayProducts(data) {
    const tbody = document.getElementById("content");
    tbody.innerHTML = '';

    data.forEach((row) => {
        const tr = document.createElement("tr");
        row.forEach((cell) => {
            const td = document.createElement("td");
            td.textContent = cell;
            tr.appendChild(td);
        });
        tbody.appendChild(tr);
    });
}

function searchProducts() {
    const input = document.getElementById("searchInput").value.toLowerCase();
    
    // Filtrar productos por PLUS o nombre de producto
    const filteredData = productsData.filter((row) => {
        const plus = row[1].toLowerCase();
        const producto = row[2].toLowerCase();
        return plus.includes(input) || producto.includes(input);
    });

    displayProducts(filteredData); // Actualizar la tabla con los resultados filtrados
}
