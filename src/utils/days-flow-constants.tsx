import CustomEdge from "@/components/days-flow/custom-edge";
import NodeCardRender from "@/components/days-flow/node-card-render";
import TempNode from "@/components/days-flow/temp-node";
import { Edge, Node } from "reactflow";

import {
  ChatIcon,
  InitialNodeIcon,
  MessageNodeIcon,
  QuestionIcon,
} from "./days-flow-icons";
import { NODE_CARD_TYPE } from "./types/days-flow.types";

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
