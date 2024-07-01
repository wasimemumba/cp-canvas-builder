import { PlusCircleIcon } from "@heroicons/react/24/outline";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Toggle } from "@/components/ui/toggle";
import NodeCard from "./node-card";
import { nodesConfigured } from "@/store/workflow-atoms";
import { useAtomValue } from "jotai";
import { NODES_CARD_WITH_TYPE } from "@/utils/days-flow-constants";

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
