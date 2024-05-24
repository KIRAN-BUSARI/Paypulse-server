import app from "./app.js";
import { connectDB } from "./db/connectDB.js";

app.get("/", (req, res) => {
    res.json("Hello World!");
});

app.listen(process.env.PORT, () => {
    console.log(`Server is listening on port ${process.env.PORT}`);
    connectDB();
});