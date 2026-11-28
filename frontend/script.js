
const API_BASE = "https://csci-4560-hw5.onrender.com";

const operations = {
    insertShipment1: {
        endpoint: "/shipment/1",
        method: "POST"
    },
    insertShipment2: {
        endpoint: "/shipment/2",
        method: "POST"
    },
    increaseStatus: {
        endpoint: "/supplier/status",
        method: "PATCH"
    },
    getSuppliers: {
        endpoint: "/suppliers",
        method: "GET"
    },
    getSuppliersByPart: {
        method: "GET",
        getEndpoint: () => {
            const pno = document.getElementById("partNumber").value.trim();
            return `/suppliers/ship/${encodeURIComponent(pno)}`;
        }
    }
};

const results = document.getElementById("results");

document.querySelectorAll("[data-operation]").forEach(button => {
    button.addEventListener("click", () => {
        executeOperation(button.dataset.operation, button);
    });
});

async function executeOperation(operationName, button) {
    results.replaceChildren();

    const operation = operations[operationName];

    // Validate Query 5's part number before making the API request
    if (operationName === "getSuppliersByPart") {
        const pno = document.getElementById("partNumber").value.trim().toLowerCase();

        const validPartNumbers = ["p1", "p2", "p3", "p4", "p5"];

        if (!validPartNumbers.includes(pno)) {
            showMessage(
                "Please enter a valid part number: p1, p2, p3, p4, or p5",
                "message"
            );
            return;
        }
    }

    const endpoint = operation.getEndpoint
        ? operation.getEndpoint()
        : operation.endpoint;

    button.disabled = true;
    button.textContent = "Running...";

    const loading = document.createElement("p");
    loading.className = "placeholder";
    loading.textContent = "Executing operation...";
    results.appendChild(loading);

    try {
        const response = await fetch(API_BASE + endpoint, {
            method: operation.method
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.detail || `HTTP Error ${response.status}`);
        }

        results.replaceChildren();
        displayResults(data);

    } catch (error) {
        results.replaceChildren();
        showMessage("Error: " + error.message, "error");

    } finally {
        button.disabled = false;
        button.textContent = "Execute";
    }
}


function displayResults(data) {
    // Handle API messages
    if (data && data.message) {
        showMessage(data.message, "success");
        return;
    }

    // Handle a single inserted shipment row
    if (
        data &&
        !Array.isArray(data) &&
        data.Sno !== undefined &&
        data.Pno !== undefined
    ) {
        const message = document.createElement("p");
        message.className = "success";
        message.textContent =
            `Successfully inserted shipment: ` +
            `Sno: ${data.Sno}, ` +
            `Pno: ${data.Pno}, ` +
            `Qty: ${data.Qty}, ` +
            `Price: ${data.Price}`;

        results.appendChild(message);
        return;
    }

    // Handle empty results
    if (!Array.isArray(data) || data.length === 0) {
        showMessage("No results found.", "message");
        return;
    }

    // Handle arrays of rows (display as a table)
    const columns = Object.keys(data[0]);
    const table = document.createElement("table");
    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");

    columns.forEach(column => {
        const th = document.createElement("th");
        th.textContent = column;
        headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);

    const tbody = document.createElement("tbody");

    data.forEach(row => {
        const tr = document.createElement("tr");

        columns.forEach(column => {
            const td = document.createElement("td");
            td.textContent = row[column] ?? "—";
            tr.appendChild(td);
        });

        tbody.appendChild(tr);
    });

    table.appendChild(thead);
    table.appendChild(tbody);
    results.appendChild(table);
}

function showMessage(message, className) {
    const element = document.createElement("p");
    element.className = className;
    element.textContent = message;
    results.replaceChildren(element);
}
