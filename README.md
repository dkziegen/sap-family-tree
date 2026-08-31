# SAP Family Tree

SAP Family Tree is a locally hosted application for tracking **atypical family trees and relationship networks**, such as those found in mythology.

Unlike a traditional family tree, the application does not assume that every person fits neatly into a parent → child hierarchy. Two entities can have multiple relationships with each other at the same time.

For example:

```text
        SIBLING_OF
     ┌──────────────┐
Zeus                  Hera
     └──────────────┘
        SPOUSE_OF
```

The application models this data as a **multigraph**, where:

* People or other entities are represented as **nodes**
* Relationships are represented as **edges**
* Two nodes can have multiple edges between them
* Relationships may be directional, such as `PARENT_OF`
* Relationships may contain their own metadata

The application runs locally and stores its Neo4j database on the user's own computer.

---

# Technology

## Frontend

* React
* TypeScript
* Vite
* Cytoscape.js

Cytoscape.js is responsible for rendering and interacting with the relationship graph.

## Backend

* Node.js
* TypeScript
* Express

Express provides the REST API used by the React frontend.

## Database

* Neo4j

Neo4j stores entities and their relationships as a graph database.

The general architecture is:

```text
React + Cytoscape.js
localhost:5173
        │
        │ /api/*
        ▼
Vite Development Proxy
        │
        ▼
Express + TypeScript
localhost:3000
        │
        │ neo4j-driver
        ▼
Neo4j
neo4j://127.0.0.1:7687
        │
        ▼
Local Database
```

The React frontend never communicates with Neo4j directly.

---

# Project Structure

```text
sap-family-tree/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   └── Graph.tsx
│   │   ├── App.tsx
│   │   └── main.tsx
│   │
│   ├── package.json
│   ├── vite.config.ts
│   └── ...
│
├── server/
│   ├── src/
│   │   ├── db.ts
│   │   └── index.ts
│   │
│   ├── .env
│   ├── package.json
│   ├── tsconfig.json
│   └── ...
│
└── README.md
```

---

# Developer Setup

These instructions are for setting up the project for development.

## 1. Install Required Software

Install:

* Node.js
* npm
* Visual Studio Code
* Neo4j Desktop

The project was initially developed with:

```text
Node.js: 25.0.0
npm:     11.6.3
```

Other modern Node.js versions supported by the installed version of Vite should also work.

Verify Node and npm:

```bash
node -v
npm -v
```

---

# 2. Install Neo4j Desktop

Download and install **Neo4j Desktop**.

Neo4j Desktop is used during development to create and manage a Neo4j database running entirely on the local computer.

A typical installation path may look like:

```text
C:\Users\<username>\AppData\Local\Programs\Neo4j Desktop 2
```

The actual database files are stored separately by Neo4j Desktop.

For example:

```text
C:\Users\<username>\.Neo4jDesktop2\Data\dbmss\
```

Neither location is a OneDrive directory unless OneDrive has explicitly been configured to include it.

---

# 3. Create the Neo4j Instance

Open Neo4j Desktop and create a new local instance.

Example:

```text
Name:
SAP Family Tree

Username:
neo4j

Password:
<your password>
```

Start the instance.

The local connection URI will normally be:

```text
neo4j://127.0.0.1:7687
```

The default application database is:

```text
neo4j
```

You do not need to create another database for development.

---

# 4. Test Neo4j

Open Neo4j Query and run:

```cypher
RETURN "Neo4j is working!" AS message
```

If a result is returned, the database is running correctly.

You can view all nodes with:

```cypher
MATCH (n)
RETURN n
```

You can view all relationships with:

```cypher
MATCH p=()-[r]->()
RETURN p
```

You can view relationships in table form with:

```cypher
MATCH (a)-[r]->(b)
RETURN a.name, type(r), b.name
```

---

# 5. Clone or Download the Project

Enter the project directory:

```bash
cd sap-family-tree
```

The project contains two separate Node.js applications:

```text
client/
server/
```

Each has its own `package.json` and dependencies.

---

# 6. Install Server Dependencies

Enter the server directory:

```bash
cd server
```

Install all dependencies already listed in `package.json`:

```bash
npm install
```

For reference, the server uses packages including:

```bash
npm install express neo4j-driver dotenv chalk morgan
```

and development dependencies including:

```bash
npm install --save-dev typescript @types/node tsx @types/express @types/morgan
```

Normally, after cloning the repository, you only need:

```bash
npm install
```

Do not reinstall every dependency individually unless you are creating the project from scratch.

---

# 7. Configure the Neo4j Connection

Inside:

```text
server/
```

create a file named:

```text
.env
```

Add:

```env
NEO4J_URI=neo4j://127.0.0.1:7687
NEO4J_USERNAME=neo4j
NEO4J_PASSWORD=YOUR_NEO4J_PASSWORD
NEO4J_DATABASE=neo4j
```

Replace:

```text
YOUR_NEO4J_PASSWORD
```

with the password chosen when creating the Neo4j instance.

The `.env` file should not be committed to Git.

The project's `.gitignore` should contain:

```gitignore
node_modules/
dist/
.env
```

---

# 8. Install Client Dependencies

Return to the project root:

```bash
cd ..
```

Then enter:

```bash
cd client
```

Install the frontend dependencies:

```bash
npm install
```

The frontend uses:

* React
* TypeScript
* Vite
* Cytoscape.js

If Cytoscape.js is not already installed:

```bash
npm install cytoscape
```

---

# Starting the Project for Development

The frontend and backend currently run as two separate development processes.

Neo4j must also be running.

## Step 1 — Start Neo4j

Open Neo4j Desktop.

Start the SAP Family Tree database instance.

It should be available at:

```text
neo4j://127.0.0.1:7687
```

---

## Step 2 — Start Express

Open a terminal.

From the project root:

```bash
cd server
npm run dev
```

A successful startup should look similar to:

```text
✓ Connected to Neo4j

✓ Mythology Tree API started
  Local: http://localhost:3000
```

The Express API is now available at:

```text
http://localhost:3000
```

---

## Step 3 — Start React

Open a second terminal.

From the project root:

```bash
cd client
npm run dev
```

Vite will normally start the frontend at:

```text
http://localhost:5173
```

Open that address in a browser.

---

# Development Startup Summary

Every time you want to work on the project:

```text
1. Start Neo4j Desktop
2. Start the Neo4j instance

3. Terminal #1
   cd server
   npm run dev

4. Terminal #2
   cd client
   npm run dev

5. Open
   http://localhost:5173
```

---

# Vite / Express Connection

During development, React runs on:

```text
localhost:5173
```

while Express runs on:

```text
localhost:3000
```

Vite proxies requests beginning with:

```text
/api
```

to Express.

The relevant configuration in:

```text
client/vite.config.ts
```

looks like:

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [react()],

    server: {
        proxy: {
            "/api": {
                target: "http://localhost:3000",
                changeOrigin: true,
            },
        },
    },
});
```

This allows React to use:

```ts
fetch("/api/graph");
```

instead of:

```ts
fetch("http://localhost:3000/api/graph");
```

---

# Neo4j Graph Model

Entities use the Neo4j label:

```text
Entity
```

A basic entity might look like:

```text
Entity

id:   UUID
name: Zeus
type: god
```

Example Cypher:

```cypher
CREATE (:Entity {
    id: randomUUID(),
    name: "Zeus",
    type: "god"
})
```

Relationships are stored directly between entities.

Example:

```cypher
MATCH (zeus:Entity {name: "Zeus"})
MATCH (hera:Entity {name: "Hera"})

CREATE (zeus)-[:SIBLING_OF]->(hera)
CREATE (zeus)-[:SPOUSE_OF]->(hera)
```

This allows multiple relationships between the same two entities.

---

# Example Test Data

To create a small graph:

```cypher
CREATE (:Entity {
    id: randomUUID(),
    name: "Zeus",
    type: "god"
});

CREATE (:Entity {
    id: randomUUID(),
    name: "Hera",
    type: "god"
});

CREATE (:Entity {
    id: randomUUID(),
    name: "Ares",
    type: "god"
});
```

Then create relationships:

```cypher
MATCH (zeus:Entity {name: "Zeus"})
MATCH (hera:Entity {name: "Hera"})
MATCH (ares:Entity {name: "Ares"})

CREATE (zeus)-[:SIBLING_OF]->(hera)
CREATE (zeus)-[:SPOUSE_OF]->(hera)

CREATE (zeus)-[:PARENT_OF]->(ares)
CREATE (hera)-[:PARENT_OF]->(ares);
```

The resulting graph is conceptually:

```text
             SIBLING_OF
        ┌─────────────────┐
        │                 ▼
      Zeus ──SPOUSE_OF──> Hera
        │                  │
        │ PARENT_OF        │ PARENT_OF
        │                  │
        └────────┐ ┌───────┘
                 ▼ ▼
                 Ares
```

---

# API

## Health Check

```text
GET /api/health
```

Used to verify that React can reach Express.

Example response:

```json
{
    "message": "React successfully reached Express!"
}
```

---

## Complete Graph

```text
GET /api/graph
```

Returns both nodes and relationships from Neo4j.

Example:

```json
{
    "nodes": [
        {
            "id": "uuid",
            "name": "Zeus",
            "type": "god"
        },
        {
            "id": "uuid",
            "name": "Hera",
            "type": "god"
        }
    ],

    "relationships": [
        {
            "id": "relationship-id",
            "source": "zeus-uuid",
            "target": "hera-uuid",
            "type": "SPOUSE_OF",
            "properties": {}
        }
    ]
}
```

React converts this response into Cytoscape elements.

---

# Useful Neo4j Commands

## Show every node

```cypher
MATCH (n)
RETURN n
```

## Show every connected path

```cypher
MATCH p=()-[r]->()
RETURN p
```

## Show relationships as text

```cypher
MATCH (a)-[r]->(b)
RETURN a.name, type(r), b.name
```

## Delete every node and relationship

WARNING: This deletes all graph data in the current database.

```cypher
MATCH (n)
DETACH DELETE n
```

## Delete a specific node using its Neo4j element ID

First verify the node:

```cypher
MATCH (n)
WHERE elementId(n) = "ELEMENT_ID_HERE"
RETURN n
```

Then delete it:

```cypher
MATCH (n)
WHERE elementId(n) = "ELEMENT_ID_HERE"
DETACH DELETE n
```

Application code should normally use the custom UUID stored in:

```text
entity.id
```

rather than relying on Neo4j's internal `elementId()`.

---

# Local User Setup

These instructions describe the **current development version** of the application.

Eventually, the project should be packaged so that a normal user does not need to manually run Vite or Express. Until that packaging work is completed, a user running the project locally will need Node.js and Neo4j installed.

## 1. Install Node.js

Install a modern Node.js version compatible with the project.

Verify:

```bash
node -v
npm -v
```

---

## 2. Install Neo4j

For development, Neo4j Desktop is convenient.

For a final self-hosted installation, **Neo4j Community Edition** can be used so that the database runs entirely on the user's own computer without relying on Neo4j's cloud services.

The database can remain accessible only locally:

```text
neo4j://127.0.0.1:7687
```

No cloud database is required.

---

## 3. Create a Local Neo4j Database

Create/start a Neo4j instance with:

```text
Username:
neo4j

Password:
<chosen password>
```

The application will use:

```text
Database:
neo4j
```

---

## 4. Download the Project

Download or clone the SAP Family Tree repository.

The project should contain:

```text
sap-family-tree/
├── client/
└── server/
```

---

## 5. Install Dependencies

Inside `server/`:

```bash
npm install
```

Inside `client/`:

```bash
npm install
```

---

## 6. Configure the Database

Create:

```text
server/.env
```

with:

```env
NEO4J_URI=neo4j://127.0.0.1:7687
NEO4J_USERNAME=neo4j
NEO4J_PASSWORD=YOUR_PASSWORD
NEO4J_DATABASE=neo4j
```

---

## 7. Start the Application

Start the Neo4j instance.

Then start the backend:

```bash
cd server
npm run dev
```

In another terminal, start the frontend:

```bash
cd client
npm run dev
```

Open:

```text
http://localhost:5173
```

The graph and database remain on the local computer.

---

# Data Storage

SAP Family Tree is designed to work without a cloud database.

Neo4j stores its database files locally on the computer running the application.

The application architecture therefore supports:

```text
User's Computer
│
├── React frontend
├── Express backend
└── Neo4j database
        │
        └── Entity and relationship data
```

No AWS, Azure, AuraDB, or other hosted database service is required.

---

# Planned Improvements

Potential future features include:

* Add entities through the UI
* Edit entities through the UI
* Delete entities through the UI
* Create relationships through the UI
* Edit relationship metadata
* Custom relationship types
* Search by entity name
* Click a node to open an information panel
* Display only entities within a selected relationship depth
* Filter relationship types
* Collapse large branches of the graph
* Support alternate or contradictory genealogies
* Store source information for mythology relationships
* Add images to entities
* Import/export graph data
* Database backup and restore
* Package the application so users do not need to manually run development servers
* Automatically start the local backend/database when launching the application

---

# Current Development Status

The following core components are currently connected:

```text
Neo4j
  │
  ▼
Express
  │
  ▼
React
  │
  ▼
Cytoscape.js
```

The application can retrieve the complete graph from Neo4j through:

```text
GET /api/graph
```

and render its entities and relationships through Cytoscape.js.
