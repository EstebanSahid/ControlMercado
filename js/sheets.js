/* Listar y Buscador */
// Variables
let productsData = [];

document.getElementById("warning_lbl").style.visibility = "Hidden";

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
        document.getElementById("warning_lbl").innerText = "No se encontraron productos";
    } 

    // Almacenamos los productos y los mostramos inicialmente
    productsData = range.values;
    console.log("Products Data");
    console.log(productsData);
    displayProducts(productsData);
}

function displayProducts(data) {
    const tbody = document.getElementById("content");
    tbody.innerHTML = '';

    console.log("Datos N");
    console.log(data.length);

    if (data.length > 15) {
        document.getElementById("warning_lbl").innerText = "Utiliza el buscador para filtrar los productos";
        document.getElementById("warning_lbl").style.visibility = "visible";
    } else if (data.length == 0) {
        document.getElementById("warning_lbl").innerText = "No se encontraron productos";
    } else {
        document.getElementById("warning_lbl").style.visibility = "Hidden";
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

}

function searchProducts() {
    const input = document.getElementById("searchInput").value.toLowerCase();
    console.log("input ", input)
    // Filtrar productos por PLUS o nombre de producto
    const filteredData = productsData.filter((row) => {
        console.log(row);
        const plus = row[0].toLowerCase();
        const producto = row[1].toLowerCase();
        console.log(plus, " ", producto)
        return plus.includes(input) || producto.includes(input);
    });

    displayProducts(filteredData);
}
