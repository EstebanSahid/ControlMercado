let productos;

async function getProducts() {
    let response;
    try {
        response = await gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: "1r7gID6GMISJ_ysgIo-uwKKALI-PjMP7WYKrt6_RckEc",
        range: "Productos!A:C",
        });
    } catch (err) {
        console.error("Error:: " + err);
        return;
    }
    const range = response.result;
    if (!range || !range.values || range.values.length == 0) {
        console.warn("No se encontraron valores");
        return;
    }

    console.log("Productos");
    console.log(range.values);
    // Flatten to string to display
    const output = range.values.reduce(
        (str, row) => `${str}${row[0]}, ${row[1]}, ${row[2]}\n`,
        "ID, PLUS, PRODUCTO\n"
    );
    document.getElementById("content").innerText = output;
}