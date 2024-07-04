import { Edge, Node } from "reactflow";

export type NODE_ICON_TYPE = "dialogue" | "message" | "question" | "chat";
export type HANDLE_TYPE = "both" | "source" | "target";

export type NODE_CARD_TYPE = {
  nodeIcon: NODE_ICON_TYPE;
  nodeTitle: string;
  nodeDescription: string;
  nodeType: string;
  handle: HANDLE_TYPE;
  dayId?: string;
  undoType?: string;
  score?: string;
  contactType?: string[];
};

export type DAYS_FLOW_DATA = {
  day: {
    id: string;
    dayValue: number;
    workflow: Node[];
    edges?: Edge[];
  };
};
