import express from "express";
import cors from "cors";
import { pool } from "./db.js";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/blocks", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM blocks");
        res.json(result.rows);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.listen(5000, () => console.log("Server running on port 5000"));
