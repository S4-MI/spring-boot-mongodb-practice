const BASE_URL = "http://localhost:8080/api/todos";

async function request(method, url, body = null) {
    const options = {
        method,
        headers: {"Content-Type": "application/json"},
    };
    if (body) options.body = JSON.stringify(body);

    const res = await fetch(url, options);
    const text = await res.text();
    const data = text ? JSON.parse(text) : null;
    return {status: res.status, data};
}

function log(label, {status, data}) {
    console.log(`\n--- ${label} ---`);
    console.log(`Status : ${status}`);
    console.log(`Body   :`, JSON.stringify(data, null, 2));
}

async function run() {
    // 1. Get all todos (should be empty initially)
    log("GET all todos", await request("GET", BASE_URL));

    // 2. Create a todo
    const created = await request("POST", BASE_URL, {
        title: "Learn Spring Boot",
        description: "Focus on MongoDB integration",
    });
    log("POST create todo", created);
    const id = created.data?.id;

    if (!id) {
        console.error("\nCould not get ID from create response. Stopping.");
        return;
    }

    // 3. Get by ID
    log("GET todo by id", await request("GET", `${BASE_URL}/${id}`));

    // 4. Update
    log("PUT update todo", await request("PUT", `${BASE_URL}/${id}`, {
        title: "Learn Spring Boot (updated)",
        description: "Also cover service layer",
        completed: true,
    }));

    // 5. Get all again (should have 1)
    log("GET all todos (after create)", await request("GET", BASE_URL));

    // 6. Delete
    log("DELETE todo", await request("DELETE", `${BASE_URL}/${id}`));

    // 7. Get by ID after delete (should 404)
    log("GET deleted todo (expect 404)", await request("GET", `${BASE_URL}/${id}`));

    // 8. Get all again (should be empty)
    log("GET all todos (after delete)", await request("GET", BASE_URL));
}

run().catch(console.error);