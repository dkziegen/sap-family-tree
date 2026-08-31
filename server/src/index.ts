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

app.get("/api/health", (req: Request, res: Response) => {
    res.json({
        message: "React successfully reached Express!"
    });
});

app.get(
    "/api/entities",
    async (req: Request, res: Response) => {
        try {
            const entitiesResults = await driver.executeQuery(
                `
                MATCH (entity:Entity)
                RETURN properties(entity) AS properties
                ORDER BY entity.name
                `,
                {},
                {
                    database: process.env.NEO4J_DATABASE
                }
            );

            const entities = entitiesResults.records.map((record) => {
                return record.get("properties");
            });

            res.json(entities);
        } catch (error) {
            console.error(
                chalk.red("✗ Failed to retrieve entities")
            );

            console.error(error);

            res.status(500).json({
                error: "Failed to retrieve entities"
            });
        }
    }
);

app.get(
    "/api/graph",
    async (req: Request, res: Response) => {
        try {
            const database = process.env.NEO4J_DATABASE;

            const nodesResult = await driver.executeQuery(
                `
                MATCH (entity:Entity)
                RETURN properties(entity) AS properties
                ORDER BY entity.name
                `,
                {},
                {
                    database
                }
            );

            const relationshipsResult = await driver.executeQuery(
                `
                MATCH (source:Entity)-[relationship]->(target:Entity)
                RETURN
                    elementId(relationship) AS id,
                    source.id AS source,
                    target.id AS target,
                    type(relationship) AS type,
                    properties(relationship) AS properties
                `,
                {},
                {
                    database
                }
            );

            const nodes = nodesResult.records.map((record) => {
                return record.get("properties");
            });

            const relationships =
                relationshipsResult.records.map((record) => ({
                    id: record.get("id"),
                    source: record.get("source"),
                    target: record.get("target"),
                    type: record.get("type"),
                    properties: record.get("properties")
                }));

            res.json({
                nodes,
                relationships
            });
        } catch (error) {
            console.error(
                chalk.red("✗ Failed to retrieve graph")
            );

            console.error(error);

            res.status(500).json({
                error: "Failed to retrieve graph"
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