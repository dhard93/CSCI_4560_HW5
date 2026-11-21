
const API_BASE = "http://127.0.0.1:8000";

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
    if (data && data.message) {
        showMessage(data.message, "success");
        return;
    }

    if (!Array.isArray(data) || data.length === 0) {
        showMessage("No results found.", "message");
        return;
    }

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
