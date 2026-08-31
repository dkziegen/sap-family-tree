import express, { type Request, type Response } from "express";
import morgan from "morgan";
import chalk from "chalk";

const app = express();
const PORT = 3000;

app.use(express.json());

// Colored HTTP request logging
app.use(morgan("dev"));

app.get("/", (req: Request, res: Response) => {
    res.send("Mythology Tree API is running!");
});

app.get("/api/entities", (req: Request, res: Response) => {
    res.json([
        {
            id: "zeus",
            name: "Zeus",
            type: "god"
        },
        {
            id: "hera",
            name: "Hera",
            type: "god"
        },
        {
            id: "athena",
            name: "Athena",
            type: "god"
        }
    ]);
});

app.listen(PORT, () => {
    console.log();
    console.log(chalk.bold.green("✓ Mythology Tree API started"));
    console.log(
        chalk.gray("  Local: ") +
        chalk.cyan.underline(`http://localhost:${PORT}`)
    );
    console.log();
});