import { DAYS_FLOW_DATA } from "@/components/days-flow/days-flow.types";
import { atom } from "jotai";
import { Edge } from "reactflow";

export const isNodeSelectedAtomStore = atom<boolean | null>(false);

export const nodeIdAtom = atom<string | null>(null);
export const isSelfSelectedNodeAtom = atom<boolean>(false);

export const daysWorkflowDataAtom = atom<DAYS_FLOW_DATA[]>([
  {
    day: {
      id: "7bf9c2e3-4aeb-4508-a45e-2d1be402b9c1",
      dayValue: 1,
      workflow: [],
    },
  },
  {
    day: {
      id: "bdb89b03-0ef7-48c6-bb16-b525e96d4ed2",
      dayValue: 2,
      workflow: [],
    },
  },

  {
    day: {
      id: "7218cada-6967-4714-91cc-1344b9d34bda",
      dayValue: 3,
      workflow: [],
    },
  },
]);
export const selectedDayAtom = atom<string>(
  "7bf9c2e3-4aeb-4508-a45e-2d1be402b9c1"
);
export const workflowEdgesAtom = atom<Edge[] | []>([]);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const undoAtom = atom<any[]>([]);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const redoAtom = atom<any[]>([]);

type REACT_FLOW_ELEMENT = Edge | Node;
export type REDO_UNDO_TYPE = {
  [key: string]: REACT_FLOW_ELEMENT[];
};
export const undoWorkflowAtom = atom<REDO_UNDO_TYPE[]>([]);
export const redoWorkflowAtom = atom<REDO_UNDO_TYPE[]>([]);

export type VIEW_TYPE = "detailed" | "summary";

export const currentViewAtom = atom<VIEW_TYPE>("detailed");
export const onDragging = atom<boolean>(false);
export const newNodeId = atom<string>("");
export const nodesConfigured = atom<boolean>(false);
