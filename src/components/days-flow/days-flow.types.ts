import { Edge, Node } from "reactflow";

export type NodeIconType = "dialogue" | "message" | "question" | "chat";
export type HandleType = "both" | "source" | "target";

export type NODE_CARD_TYPE = {
  nodeIcon: NodeIconType;
  nodeTitle: string;
  nodeDescription: string;
  nodeType: string;
  handle: HandleType;
  dayId?: string;
  undoType?: string;
  score?: string;
  contactType?: string[];
  nodeParent?: string | undefined;
};

export type DAYS_FLOW_DATA = {
  day: {
    id: string;
    dayValue: number;
    workflow: Node[];
    edges?: Edge[];
  };
};
