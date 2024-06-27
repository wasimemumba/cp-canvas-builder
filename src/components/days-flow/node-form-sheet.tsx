import { nodeIdAtom } from "@/store/workflow-atoms";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useSetAtom } from "jotai";

import NodeConfigurationForm from "./node-configuration-form";

const NodeFormSheet = () => {
  const setAtomId = useSetAtom(nodeIdAtom);

  return (
    <div className="p-5 flex flex-col">
      <div className="flex flex-row justify-between items-center">
        <h4 className="text-base text-[#2A2D2E]">Node Configuration</h4>

        <XMarkIcon
          className="w-4 h-4 text-[#777777] cursor-pointer hover:text-red-600"
          onClick={() => setAtomId(null)}
        />
      </div>

      <div className="mt-10">
        <NodeConfigurationForm />
      </div>
    </div>
  );
};

export default NodeFormSheet;
