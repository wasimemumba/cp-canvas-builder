import { Edge, Node, NodeTypes } from "reactflow";
import {
  ChatIcon,
  InitialNodeIcon,
  MessageNodeIcon,
  QuestionIcon,
} from "./days-flow-icons";
import { NODE_CARD_TYPE } from "./types/days-flow.types";
import fileDownload from "js-file-download";
import NodeCardRender from "@/components/days-flow/node-card-render";
import TempNode from "@/components/days-flow/temp-node";
import CustomEdge from "@/components/days-flow/custom-edge";

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

export const NODES_CARD_WITH_TYPE: NODE_CARD_TYPE[] = [
  {
    nodeIcon: "dialogue",
    nodeTitle: "Dialogue Start",
    nodeDescription:
      "Marks the start of a new dialog tree and defines trigger time",
    nodeType: "initialNode",
    handle: "source",
  },
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

export const INITIAL_NODE = "initialNode";
export const TEMP_NODE = "tempNode";
export const MESSAGE_PATIENT_NODE = "messagePatientNode";
export const QUESTIONNAIRE_NODE = "questionnareNode";
export const LIVE_CHAT_NODE = "liveChatNode";

export const SOURCE_HANDLE = "source";
export const TARGET_HANDLE = "target";
export const BOTH_HANDLE = "both";

export const UNDO_ACTION_ADDED = "added";
export const UNDO_ACTION_DELETED = "deleted";

export const BUTTON_EDGE = "buttonEdge";
export const TEMP_EDGE = "tempEdge";

export const SMS_CONTACT = "sms";
export const IVR_CONTACT = "ivr";
export const EMAIL_CONTACT = "email";

export const DETAILED_VIEW = "detailed";
export const SUMMARY_VIEW = "summary";

export const TEMP_NODE_DATA_RELEASE = "Release to create a new node";

export const newNodeToAdd = {
  nodeIcon: "dialogue",
  nodeTitle: "Dialogue Start",
  nodeDescription:
    "Marks the start of a new dialog tree and defines trigger time",
  nodeType: INITIAL_NODE,
  handle: SOURCE_HANDLE,
  isConfigured: false,
};

export const nodeTypes = {
  initialNode: NodeCardRender,
  messagePatientNode: NodeCardRender,
  questionnareNode: NodeCardRender,
  liveChatNode: NodeCardRender,
  tempNode: TempNode,
};

export const edgeTypes = {
  buttonEdge: CustomEdge,
  tempEdge: CustomEdge,
};
