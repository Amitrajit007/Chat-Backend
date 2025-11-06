import express, { Request, Response } from "express";
import "dotenv/config";
const PORT = process.env.PORT || 5000;
const app = express();
app.use(express.json());
app.get("/", (req: Request, res: Response) => {
  res.json({ msg: `Hello World from ${PORT}` });
});

app.listen(PORT, () => {
  console.log(`Listening at ${PORT}`);
});
