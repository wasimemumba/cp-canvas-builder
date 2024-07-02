import dagre from "@dagrejs/dagre";
import { Edge, Node, Position } from "reactflow";

import { LIVE_CHAT_NODE } from "./days-flow-constants";

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

export const getLayoutedElementsDagreOverlap = (
  nodes: Node[],
  edges: Edge[],
  direction = "TB"
) => {
  const nodeWidth = 400;
  const nodeHeight = 200;
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  nodes.forEach((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    node.targetPosition = Position.Top;
    node.sourcePosition = Position.Bottom;

    if (node.type === LIVE_CHAT_NODE) {
      node.position = {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      };
    } else {
      if (nodes.length === 1) {
        node.position = {
          x: 500,
          y: 200,
        };
      } else {
        node.position = {
          x: nodeWithPosition.x - nodeWidth / 2,
          y: nodeWithPosition.y - nodeHeight / 2,
        };
      }
    }
  });

  // Function to detect if two nodes overlap
  const areNodesOverlapping = (nodeA: Node, nodeB: Node) => {
    return !(
      nodeA.position.x + nodeWidth < nodeB.position.x ||
      nodeA.position.x > nodeB.position.x + nodeWidth ||
      nodeA.position.y + nodeHeight < nodeB.position.y ||
      nodeA.position.y > nodeB.position.y + nodeHeight
    );
  };

  // Function to adjust the position of overlapping nodes
  // Adjusts the position of overlapping nodes to prevent visual overlap
  const adjustOverlappingNodes = (nodes: Node[]) => {
    // Iterate over each node, providing both the node and its index
    nodes.forEach((node, i) => {
      // For the current node, check all subsequent nodes for overlap
      nodes.slice(i + 1).forEach((otherNode) => {
        // If the current node and the other node are overlapping, adjust the other node's position
        if (areNodesOverlapping(node, otherNode)) {
          otherNode.position.y += nodeHeight; // Adjust the Y position to prevent overlap
        }
      });
    });
  };

  adjustOverlappingNodes(nodes);

  return { nodes, edges };
};
