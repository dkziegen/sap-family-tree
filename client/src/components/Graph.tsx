import { useEffect, useRef } from "react";
import cytoscape from "cytoscape";

function Graph() {
    const graphRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!graphRef.current) {
            return;
        }

        const cy = cytoscape({
            container: graphRef.current,

            elements: [
                {
                    data: {
                        id: "zeus",
                        label: "Zeus"
                    }
                },
                {
                    data: {
                        id: "hera",
                        label: "Hera"
                    }
                },
                {
                    data: {
                        id: "ares",
                        label: "Ares"
                    }
                },

                {
                    data: {
                        id: "zeus-hera-spouse",
                        source: "zeus",
                        target: "hera",
                        label: "SPOUSE_OF"
                    }
                },
                {
                    data: {
                        id: "zeus-ares-parent",
                        source: "zeus",
                        target: "ares",
                        label: "PARENT_OF"
                    }
                },
                {
                    data: {
                        id: "hera-ares-parent",
                        source: "hera",
                        target: "ares",
                        label: "PARENT_OF"
                    }
                }
            ],

            style: [
                {
                    selector: "node",
                    style: {
                        label: "data(label)",
                        "text-valign": "center",
                        "text-halign": "center",
                        width: 80,
                        height: 80
                    }
                },
                {
                    selector: "edge",
                    style: {
                        label: "data(label)",
                        "curve-style": "bezier",
                        "target-arrow-shape": "triangle"
                    }
                }
            ],

            layout: {
                name: "cose"
            }
        });

        return () => {
            cy.destroy();
        };
    }, []);

    return (
        <div
            ref={graphRef}
            style={{
                width: "100%",
                height: "600px",
                border: "1px solid #ccc"
            }}
        />
    );
}

export default Graph;