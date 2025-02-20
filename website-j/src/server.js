const express = require("express");
const app = express();
const routes = require("./routes/index.js"); // Import routes
const PORT = 3000;

app.use(express.static("public"));

app.get("/", (req, res) => {
    res.send("Hello, World!");
});

app.use("/hello", routes); // Use the routes

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
