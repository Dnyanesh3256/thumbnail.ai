import express, { Request, Response } from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './configs/db.js';

await connectDB();

const app = express();

app.use(cors());

app.use(express.json());

const port = process.env.PORT || 3000;

app.get("/", (req: Request, res: Response) => {
    res.send("Server is live!");
});

app.listen(port, () => {
    console.log(`Server is running at port ${port}`);
});