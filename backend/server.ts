import express from "express";
import cors from "cors";
import dotenv from 'dotenv'

dotenv.config();
// console.log(process.env);

const PORT = process.env.PORT || 8000;
const app = express();

app.use(cors());
app.use(express.json());

app.get('/data', (req, res) => {
    res.json({message: 'This is CORS-enabled for all origins!'})
});

app.listen(8000, () => {
    console.log(`Server listening on ${PORT}`);
})