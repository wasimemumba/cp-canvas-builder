import fileDownload from "js-file-download";
import { Edge, Node, NodeTypes } from "reactflow";
import { v4 as uuidv4 } from "uuid";

import {
  EMAIL_CONTACT,
  IVR_CONTACT,
  LIVE_CHAT_NODE,
  NODE_HANDLE_MAPPER_BY_TYPE,
  NODE_ICONS_TYPE_MAPPER,
  SMS_CONTACT,
  TEMP_EDGE,
  TEMP_NODE,
  UNDO_ACTION_ADDED,
} from "./days-flow-constants";
import { EmailIcon, MessageIcon, PhoneIcon } from "./days-flow-icons";
import { NODE_CARD_TYPE } from "./types/days-flow.types";

export const getTempNodes = (nodes: Node[]) => {
  return nodes
    .filter(
      (node) =>
        node.type !== LIVE_CHAT_NODE && JSON.parse(node.data)?.isConfigured
    )
    .map((node) => {
      const tempTargetId = uuidv4();
      const nodeWidth = node.width || 50;
      const nodeHeight = node.height || 50;

      const tempNode = {
        id: tempTargetId,
        type: TEMP_NODE,
        position: {
          x: nodeWidth,
          y: node.position.y + nodeHeight + 20,
        },
        data: "Drag here to add new node",
        undoType: UNDO_ACTION_ADDED,
        sourceId: node.id,
      };

      const tempEdge = {
        animated: true,
        id: uuidv4(),
        type: TEMP_EDGE,
        undoType: UNDO_ACTION_ADDED,
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

export const renderContactIcons = (contactTypes: string[] | undefined) => {
  return contactTypes?.map((contactType) => {
    if (contactType === SMS_CONTACT) {
      return <MessageIcon />;
    }
    if (contactType === IVR_CONTACT) {
      return <PhoneIcon />;
    }
    if (contactType === EMAIL_CONTACT) {
      return <EmailIcon />;
    }
  });
};

export const checkIfEdge = (value: Edge | Node) => {
  if (Object.prototype.hasOwnProperty.call(value, "targetHandle")) {
    return true;
  } else {
    return false;
  }
};

export const isSomething = (data: unknown): boolean => {
  if (data === null || data === undefined) return false;

  if (typeof data === "number") return true;

  if (typeof data === "string" && data.length === 0) return false;

  if (typeof data === "object" && Object.keys(data).length === 0) return false;

  if (Array.isArray(data) && data.length === 0) return false;

  return true;
};

export const getParsedNodeData = (
  data: unknown
): NodeTypes & NODE_CARD_TYPE => {
  return typeof data === "string"
    ? JSON.parse(data)
    : {
        nodeIcon: "question",
        nodeDescription: "",
        nodeTitle: "",
        nodeType: "",
      };
};

export const getEdgesBySource = (edgesArray: Edge[], nodeId: string) => {
  return edgesArray.filter((item) => item.source === nodeId);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const extractTargets = (graph: any[], source: string): string[] => {
  const targets: string[] = [];
  graph.forEach((edge) => {
    if (edge.source === source) {
      targets.push(edge.target);
    }
  });
  return targets;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const processGraph = (graph: any[], source: string): string[] => {
  const targets = extractTargets(graph, source);
  const result: string[] = [];
  targets.forEach((target) => {
    result.push(...processGraph(graph, target));
  });
  return [...targets, ...result];
};

export const getIcon = (key: keyof typeof NODE_ICONS_TYPE_MAPPER): string => {
  return NODE_ICONS_TYPE_MAPPER[key];
};

export const getHandle = (key: keyof typeof NODE_ICONS_TYPE_MAPPER): string => {
  return NODE_HANDLE_MAPPER_BY_TYPE[key];
};

export const findClosestNode = (
  array: Node[],
  targetPosition: {
    x: number;
    y: number;
  }
): Node | null => {
  let closestObject = null;
  let minDistance = Number.MAX_SAFE_INTEGER;

  array.forEach((obj) => {
    const distanceX = Math.abs(obj.position.x - targetPosition.x);
    const distanceY = Math.abs(obj.position.y - targetPosition.y);
    const totalDistance = distanceX + distanceY;

    if (totalDistance <= 200 && totalDistance < minDistance) {
      closestObject = obj;
      minDistance = totalDistance;
    }
  });

  return closestObject || null;
};

export const valueToPercentage = (value: number): number => {
  const valueRange = 2 - 0.25;

  const percentage = ((value - 0.25) / valueRange) * 100;

  return Math.floor(percentage);
};

export const downloadJsonFile = (
  e: { stopPropagation: () => void },
  textToRender: string,
  downloadFileName: string
) => {
  e.stopPropagation();
  // JSON.stringify(data, null, 2)
  fileDownload(textToRender, downloadFileName);
};

export const checkIfNodesConfigured = (nodes: Node[]): boolean => {
  const nodesStatus = nodes.map((node) => {
    if (node && isSomething(node.data) && node.type !== TEMP_NODE) {
      const parsedData = JSON.parse(node.data);
      return parsedData.isConfigured;
    }
  });

  return nodesStatus.every((node) => node === true);
};

export const getTempNodesForConfiguredNodes = (
  nodes: Node[],
  closestNodeFound: Node | null
): Node[] => {
  return nodes?.map((node) => {
    if (node?.id === closestNodeFound?.id && node?.type === TEMP_NODE) {
      node.data = closestNodeFound
        ? "Release to create a new node"
        : "Drag here to create new node";
    }
    return node;
  });
};

export const updateNewlyAddedNodeType = (
  nodes: Node[],
  newlyAddedNodeId: string,
  nodeType: string
): Node[] => {
  return nodes.map((node) => {
    if (node.id === newlyAddedNodeId) {
      const parsedNodeData = JSON.parse(node.data);

      const updatedNodeData = {
        ...parsedNodeData,
        handle: getHandle(nodeType as keyof typeof NODE_HANDLE_MAPPER_BY_TYPE),
        nodeType,
      };

      const stringifyData = JSON.stringify(updatedNodeData);

      return {
        ...node,
        data: stringifyData,
        type: nodeType,
      };
    }
    return node;
  });
};

export const updateNewlyAddedNodeTitle = (
  nodes: Node[],
  newlyAddedNodeId: string,
  nodeTitle: string
): Node[] => {
  return nodes.map((node) => {
    if (node.id === newlyAddedNodeId) {
      const parseCurrentNodeData = JSON.parse(node.data);

      const updatedNodeData = {
        ...parseCurrentNodeData,
        nodeTitle,
      };

      const stringifyData = JSON.stringify(updatedNodeData);

      return {
        ...node,
        data: stringifyData,
      };
    }
    return node;
  });
};
