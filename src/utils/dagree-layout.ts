import dagre from "@dagrejs/dagre";
import { Edge, Node, Position } from "reactflow";
import { LIVE_CHAT_NODE, isSomething } from "./days-flow-constants";

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeWidth = 400;
const nodeHeight = 300;

export const getLayoutedElements = (nodes: Node[], edges: Edge[]) => {
  dagreGraph.setGraph({});

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, {
      width: nodeWidth,
      height: nodeHeight,
    });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  nodes.forEach((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);

    const nodeWidth = node.width || 200;
    const nodeHeight = node.height || 300;

    node.position = {
      x: nodeWithPosition.x - nodeWidth / 2,
      y: nodeWithPosition.y - nodeHeight / 2,
    };

    return node;
  });

  return { nodes, edges };
};

export const getLayoutedElementsNew = (nodes: Node[], edges: Edge[]) => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  dagreGraph.setGraph({ rankdir: "TB", marginx: 20, marginy: 20 });

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

    // We are shifting the dagre node position (anchor=center center) to the top-left

    const newWidth = node.width || nodeWidth;
    const newHeight = node.height || nodeHeight;

    node.position = {
      x: nodeWithPosition.x - newWidth / 2,
      y: nodeWithPosition.y + newHeight / 2,
    };

    return node;
  });

  return { nodes, edges };
};

export const getLayoutedElementsDagre = (
  nodes: Node[],
  edges: Edge[],
  direction = "TB"
) => {
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

    node.position = {
      x: nodeWithPosition.x - nodeWidth / 2,
      y: nodeWithPosition.y - nodeHeight / 2,
    };

    return node;
  });

  return { nodes, edges };
};

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
      node.position = {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      };
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
  const adjustOverlappingNodes = (nodes: Node[]) => {
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        if (areNodesOverlapping(nodes[i], nodes[j])) {
          nodes[j].position.y += nodeHeight;
        }
      }
    }
  };

  adjustOverlappingNodes(nodes);

  return { nodes, edges };
};

export const getLayoutedElementsDagreOverlapGroup = (
  nodes: Node[],
  edges: Edge[],
  direction = "TB"
) => {
  const nodeWidth = 100; // Define node width
  const nodeHeight = 50; // Define node height

  // Create a lookup for nodes by id
  const nodeLookup = new Map();
  nodes.forEach((node) => nodeLookup.set(node.id, node));

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
    if (!isSomething(node.parentId)) {
      const nodeWithPosition = dagreGraph.node(node.id);
      node.targetPosition = Position.Top;
      node.sourcePosition = Position.Bottom;

      if (node.type === LIVE_CHAT_NODE) {
        node.position = {
          x: nodeWithPosition.x - nodeWidth / 2,
          y: nodeWithPosition.y - nodeHeight + 500,
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

  // Function to adjust the position of overlapping nodes within the same parent
  const adjustOverlappingNodesWithinParent = (
    parent: Node,
    childNodes: Node[]
  ) => {
    for (let i = 0; i < childNodes.length; i++) {
      for (let j = i + 1; j < childNodes.length; j++) {
        if (areNodesOverlapping(childNodes[i], childNodes[j])) {
          childNodes[j].position.y += nodeHeight;
          // Ensure the child node stays within the parent's boundaries
          if (
            childNodes[j].position.y + nodeHeight >
            parent.position.y + nodeHeight
          ) {
            childNodes[j].position.y =
              parent.position.y + nodeHeight - nodeHeight;
          }
        }
      }
    }
  };

  // Group child nodes by their parentId
  const parentChildMap = new Map();
  nodes.forEach((node) => {
    if (node.parentId) {
      if (!parentChildMap.has(node.parentId)) {
        parentChildMap.set(node.parentId, []);
      }
      parentChildMap.get(node.parentId).push(node);
    }
  });

  // Adjust overlapping child nodes within each parent
  parentChildMap.forEach((childNodes, parentId) => {
    const parent = nodeLookup.get(parentId);
    if (parent) {
      adjustOverlappingNodesWithinParent(parent, childNodes);
    }
  });

  // Adjust child nodes to stay inside their parent node boundaries
  const adjustChildNodes = (nodes: Node[], nodeLookup: Map<string, Node>) => {
    nodes.forEach((node) => {
      if (node.parentId) {
        const parentNode = nodeLookup.get(node.parentId);
        if (parentNode) {
          node.position.x =
            parentNode.position.x +
            Math.max(
              0,
              Math.min(
                node.position.x - parentNode.position.x,
                nodeWidth - nodeWidth
              )
            );
          node.position.y =
            parentNode.position.y +
            Math.max(
              0,
              Math.min(
                node.position.y - parentNode.position.y,
                nodeHeight - nodeHeight
              )
            );
        }
      }
    });
  };

  // Adjust child nodes
  adjustChildNodes(nodes, nodeLookup);

  return { nodes, edges };
};
