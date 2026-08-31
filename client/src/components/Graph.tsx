import { useEffect, useRef, useState } from "react";
import cytoscape from "cytoscape";

type GraphNode = {
    id: string;
    name: string;
    type?: string;
    [key: string]: unknown;
};

type GraphRelationship = {
    id: string;
    source: string;
    target: string;
    type: string;
    properties?: Record<string, unknown>;
};

type GraphResponse = {
    nodes: GraphNode[];
    relationships: GraphRelationship[];
};

function Graph() {
    const graphRef = useRef<HTMLDivElement | null>(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!graphRef.current) {
            return;
        }

        let cy: cytoscape.Core | undefined;

        async function loadGraph() {
            try {
                const response = await fetch("/api/graph");

                if (!response.ok) {
                    throw new Error(
                        `Server responded with ${response.status}`
                    );
                }

                const graph: GraphResponse = await response.json();

                const elements: cytoscape.ElementDefinition[] = [
                    ...graph.nodes.map((node) => ({
                        data: {
                            ...node,
                            id: node.id,
                            label: node.name
                        }
                    })),

                    ...graph.relationships.map((relationship) => ({
                        data: {
                            id: relationship.id,
                            source: relationship.source,
                            target: relationship.target,
                            label: relationship.type,
                            relationshipType: relationship.type,
                            ...relationship.properties
                        }
                    }))
                ];

                cy = cytoscape({
                    container: graphRef.current!,

                    elements,

                    style: [
                        {
                            selector: "node",
                            style: {
                                label: "data(label)",

                                width: 80,
                                height: 80,

                                "text-valign": "center",
                                "text-halign": "center",

                                "font-size": 14,
                                "text-wrap": "wrap"
                            }
                        },

                        {
                            selector: "edge",
                            style: {
                                label: "data(label)",

                                width: 2,

                                "curve-style": "bezier",
                                "control-point-step-size": 40,

                                "target-arrow-shape": "triangle",

                                "font-size": 10,
                                "text-rotation": "autorotate"
                            }
                        }
                    ],

                    layout: {
                        name: "cose",
                        animate: false
                    }
                });
            } catch (error) {
                console.error(error);

                setError("Could not load graph.");
            } finally {
                setLoading(false);
            }
        }

        loadGraph();

        return () => {
            cy?.destroy();
        };
    }, []);

    return (
        <section>
            {loading && <p>Loading graph...</p>}

            {error && <p>{error}</p>}

            <div
                ref={graphRef}
                style={{
                    width: "100%",
                    height: "700px",
                    border: "1px solid #ccc"
                }}
            />
        </section>
    );
}

export default Graph;