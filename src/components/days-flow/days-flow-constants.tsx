import { Edge, Node, NodeTypes } from "reactflow";
import {
  ChatIcon,
  InitialNodeIcon,
  MessageNodeIcon,
  QuestionIcon,
} from "./days-flow-icons";
import { NODE_CARD_TYPE } from "./days-flow.types";
import fileDownload from "js-file-download";

export const initialEdges: Edge[] = [];

export const initialNodes: Node[] = [];

export const NODE_ICONS_MAPPER = {
  dialogue: <InitialNodeIcon />,
  message: <MessageNodeIcon />,
  question: <QuestionIcon />,
  chat: <ChatIcon />,
};

export const NODE_ICONS_TYPE_MAPPER = {
  initialNode: "dialogue",
  messagePatientNode: "message",
  questionnareNode: "question",
  liveChatNode: "chat",
};

export const NODE_HANDLE_MAPPER_BY_TYPE = {
  initialNode: "source",
  messagePatientNode: "both",
  questionnareNode: "both",
  liveChatNode: "target",
};

export const isSomething = (data: unknown) => {
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
  for (const edge of graph) {
    if (edge.source === source) {
      targets.push(edge.target);
    }
  }
  return targets;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const processGraph = (graph: any[], source: string): string[] => {
  const targets = extractTargets(graph, source);
  const result: string[] = [];
  for (const target of targets) {
    result.push(...processGraph(graph, target));
  }
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

  for (const obj of array) {
    const distanceX = Math.abs(obj.position.x - targetPosition.x);
    const distanceY = Math.abs(obj.position.y - targetPosition.y);
    const totalDistance = distanceX + distanceY;

    if (totalDistance <= 200 && totalDistance < minDistance) {
      closestObject = obj;
      minDistance = totalDistance;
    }
  }

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

export const NODES_WITH_TYPE_RENDERED: NODE_CARD_TYPE[] = [
  {
    nodeIcon: "message",
    nodeTitle: "Message Patient",
    nodeDescription: "Send an SMS, IVR or Email message to the Patient",
    nodeType: "messagePatientNode",
    handle: "both",
  },
  {
    nodeIcon: "question",
    nodeTitle: "Questionnaire",
    nodeDescription:
      "Select a survey template to send to the Patient via SMS/Email",
    nodeType: "questionnareNode",
    handle: "both",
  },
  {
    nodeIcon: "chat",
    nodeTitle: "Live Chat",
    nodeDescription: "Start a Live chat with patient",
    nodeType: "liveChatNode",
    handle: "target",
  },
];

export const checkIfNodesConfigured = (nodes: Node[]): boolean => {
  const nodesStatus = nodes.map((node) => {
    if (node && isSomething(node.data) && node.type !== "tempNode") {
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
    if (node?.id === closestNodeFound?.id && node?.type === "tempNode") {
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
