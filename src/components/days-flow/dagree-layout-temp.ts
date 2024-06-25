import dagre from "@dagrejs/dagre";
import { Node, Edge, Position } from "reactflow";

export const getLayoutedElementsDagreOverlapTemp = (
  nodes: Node[],
  edges: Edge[],
  direction = "TB"
) => {
  const nodeWidth = 600;
  const nodeHeight = 200;
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({ rankdir: direction });

  const parentNodes = nodes.filter((node) => !node.parentId);
  const childNodes = nodes.filter((node) => node.parentId);

  parentNodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  parentNodes.forEach((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);

    node.position = {
      x: nodeWithPosition.x - nodeWidth / 2,
      y: nodeWithPosition.y - nodeHeight / 2,
    };
    node.targetPosition = Position.Top;
    node.sourcePosition = Position.Bottom;
  });

  const areNodesOverlapping = (nodeA: Node, nodeB: Node) => {
    return !(
      nodeA.position.x + nodeWidth < nodeB.position.x ||
      nodeA.position.x > nodeB.position.x + nodeWidth ||
      nodeA.position.y + nodeHeight < nodeB.position.y ||
      nodeA.position.y > nodeB.position.y + nodeHeight
    );
  };

  const adjustOverlappingNodes = (
    nodes: Node[],
    boundary: { x: number; y: number; width: number; height: number }
  ) => {
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        if (areNodesOverlapping(nodes[i], nodes[j])) {
          nodes[j].position.y += nodeHeight;
          if (nodes[j].position.y + nodeHeight > boundary.y + boundary.height) {
            nodes[j].position.y = boundary.y; // Reset to top of the parent boundary if it exceeds the height
            nodes[j].position.x += nodeWidth; // Move to the right
          }
        }
      }
    }
  };

  parentNodes.forEach((parentNode) => {
    const childNodesOfParent = childNodes.filter(
      (childNode) => childNode.parentId === parentNode.id
    );
    let startX = parentNode.position.x + 20; // Adding some padding inside the parent node
    // const startY = parentNode.position.y + 20;
    const parentBoundary = {
      x: parentNode.position.x,
      y: parentNode.position.y,
      width: nodeWidth,
      height: nodeHeight,
    };

    childNodesOfParent.forEach((childNode, index) => {
      childNode.position = {
        x: 50 + (index + 1 * 100),
        y: 50,
      };

      // childNode.position = {
      //   x: startX,
      //   y: startY + index * (nodeHeight + 20),
      // };

      if (
        childNode.position.y + nodeHeight >
        parentBoundary.y + parentBoundary.height
      ) {
        childNode.position.y = parentBoundary.y + 20; // Reset to top of the parent boundary if it exceeds the height
        startX += nodeWidth + 20; // Move to the right
        childNode.position.x = startX;
      }
    });

    adjustOverlappingNodes(childNodesOfParent, parentBoundary);
  });

  return { nodes, edges };
};

export const getLayoutedElementsTemp = (nodes: Node[], edges: Edge[]) => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({ rankdir: "TB" });

  edges.forEach((edge) => dagreGraph.setEdge(edge.source, edge.target));
  nodes.forEach((node) =>
    dagreGraph.setNode(node.id, { width: 200, height: 200 })
  );

  dagre.layout(dagreGraph);

  return {
    nodes: nodes.map((node) => {
      if (node.type === "nodeGroup") {
        return node;
      }
      const { x, y } = dagreGraph.node(node.id);
      return {
        ...node,
        position: { x, y },
        positionAbsolute: { x, y },
        data: { ...node.data, newNode: false },
      };
    }),
    edges: edges.map((edge) => {
      return {
        ...edge,
        data: { ...edge.data, newEdge: false },
      };
    }),
  };
};
