/* Inicio Variables */

let productsData = [];
let selectedProducts = [];

/* Fin Variables  */

/* */

/* Listar y Buscador */

//document.getElementById("warning_lbl").style.visibility = "Hidden";

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
    displayProducts(productsData);
}

function displayProducts(data) {
    const tbody = document.getElementById("content");
    tbody.innerHTML = '';

    if (data.length > 15) {
        // Mostrar una info para que busque los productos si la lista es larga
        document.getElementById("warning_lbl").innerText = "Utiliza el buscador para filtrar los productos";
        document.getElementById("warning_lbl").style.visibility = "visible";

    } else if (data.length == 0) {
        // Mostrar un mensaje si no se encontraron productos
        document.getElementById("warning_lbl").innerText = "No se encontraron productos";

    } else {
        // Mostrar los productos creando una tabla según los datos
        document.getElementById("warning_lbl").style.visibility = "Hidden";
        data.forEach((row) => {
            const tr = document.createElement("tr");
            row.forEach((cell) => {
                const td = document.createElement("td");
                td.textContent = cell;
                tr.appendChild(td);
            });

            // Capturar el Click para guardar en el arreglo
            tr.addEventListener("click", () => {
                selectedProducts.push(row);
                captureProducts(selectedProducts);
            })

            tbody.appendChild(tr);
        });
    }

}

function searchProducts() {
    const input = document.getElementById("searchInput").value.toLowerCase();

    // Filtrar productos por PLUS o nombre de producto
    const filteredData = productsData.filter((row) => {
        const plus = row[0].toLowerCase();
        const producto = row[1].toLowerCase();
        return plus.includes(input) || producto.includes(input);
    });

    //Filtrar que no Estén presentes en Pedidos
    const NoOrderFilteredData = filteredData.filter((row) => {
        // row[0] es el campo que representa el identificador del producto
        return !selectedProducts.some(
            selectedProduct => selectedProduct[0].toLowerCase() === row[0].toLowerCase());
    });

    /*
    console.log("Datos a mostrar");
    console.log(NoOrderFilteredData);

    console.log("Datos googleSheets");
    console.log(filteredData);

    console.log("Datos a pedir");
    console.log(selectedProducts);
    */ 

    displayProducts(NoOrderFilteredData);
}

/* Fin Listar y Buscador */

/* */

/* Inicio Table Pedidos */

function captureProducts(data) {
    const tbody = document.getElementById("content_order");
    tbody.innerHTML = '';

    data.forEach((row) => {
        const tr = document.createElement("tr");

        // Crear celdas de datos
        row.forEach((cell) => {
            const td = document.createElement("td");
            td.textContent = cell;
            tr.appendChild(td);
        });

        // Crear los input
        const inputTd = document.createElement("td");
        const input = document.createElement("input");
        input.type = "text";
        input.placeholder = "Cantidad"
        inputTd.appendChild(input);
        tr.appendChild(inputTd);

        tbody.appendChild(tr);
    });

    searchProducts();
}

/* Fin Table Pedidos */
