import { PlusCircleIcon } from "@heroicons/react/24/outline";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Toggle } from "@/components/ui/toggle";
import NodeCard from "./node-card";
import { NODE_CARD_TYPE } from "./days-flow.types";
import { nodesConfigured } from "@/store/workflow-atoms";
import { useAtomValue } from "jotai";

const NODES_CARD_WITH_TYPE: NODE_CARD_TYPE[] = [
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

const Sidebar = () => {
  const allNodesConfigured = useAtomValue(nodesConfigured);
  return (
    <aside>
      <Popover>
        <PopoverTrigger>
          <Toggle aria-label="Toggle plus">
            <PlusCircleIcon className="h-6 w-6 text-[#777777]" />
          </Toggle>
        </PopoverTrigger>

        <PopoverContent className="bg-white min-w-[50vw] border border-transparent rounded-xl flex flex-col gap-3">
          <div className="flex flex-row gap-2 justify-start items-center">
            <h3 className="text-gray-950 text-sm">Add New Node</h3>

            <span className="inline-block text-gray-300 text-xs">
              {allNodesConfigured && "Drag and drop to add a new node"}
              {!allNodesConfigured && "Please configure an unconfigured node"}
            </span>
          </div>

          <div className="grid grid-cols-auto-fit-minmax gap-2">
            {NODES_CARD_WITH_TYPE?.map((nodeCard) => (
              <NodeCard nodeCardDetails={nodeCard} key={nodeCard?.nodeType} />
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </aside>
  );
};

export default Sidebar;
