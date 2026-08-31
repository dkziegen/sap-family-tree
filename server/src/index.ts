import express, {
    type Request,
    type Response
} from "express";

import morgan from "morgan";
import chalk from "chalk";

import { driver } from "./db.js";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req: Request, res: Response) => {
    res.send("Mythology Tree API is running!");
});

app.get(
    "/api/test-database",
    async (req: Request, res: Response) => {
        try {
            const { records } = await driver.executeQuery(
                `
                RETURN "Express successfully reached Neo4j!" AS message
                `,
                {},
                {
                    database: process.env.NEO4J_DATABASE
                }
            );

            res.json({
                message: records[0].get("message")
            });
        } catch (error) {
            console.error(error);

            res.status(500).json({
                error: "Database query failed"
            });
        }
    }
);

async function startServer() {
    try {
        await driver.verifyConnectivity();

        console.log(chalk.green("✓ Connected to Neo4j"));

        app.listen(PORT, () => {
            console.log();
            console.log(chalk.bold.green("✓ Mythology Tree API started"));

            console.log(
                chalk.gray("  Local: ") +
                chalk.cyan.underline(`http://localhost:${PORT}`)
            );

            console.log();
        });
    } catch (error) {
        console.error(chalk.red("✗ Could not connect to Neo4j"));
        console.error(error);
    }
}

startServer();