import { Node } from "reactflow";
import { v4 as uuidv4 } from "uuid";

export const getTempNodes = (nodes: Node[]) => {
  return nodes
    .filter(
      (node) =>
        node.type !== "liveChatNode" && JSON.parse(node.data)?.isConfigured
    )
    .map((node) => {
      const tempTargetId = uuidv4();
      const nodeWidth = node.width || 50;
      const nodeHeight = node.height || 50;

      const tempNode = {
        id: tempTargetId,
        type: "tempNode",
        position: {
          x: nodeWidth,
          y: node.position.y + nodeHeight + 20,
        },
        data: "Drag here to add new node",
        undoType: "added",
        sourceId: node.id,
      };

      const tempEdge = {
        animated: true,
        id: uuidv4(),
        type: "tempEdge",
        undoType: "added",
        source: node.id,
        sourceHandle: null,
        target: tempTargetId,
      };

      return {
        tempEdge,
        tempNode,
      };
    });
};
