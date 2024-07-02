import { cn } from "@/lib/utils";
import { daysWorkflowDataAtom, nodeIdAtom } from "@/store/workflow-atoms";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import { useAtomValue } from "jotai";
import { useCallback, useRef } from "react";
import { ReactFlowProvider } from "reactflow";

import { downloadJsonFile, isSomething } from "../../utils/days-flow-constants";
import { TelevoxIcon } from "../../utils/days-flow-icons";
import { Button } from "../ui/button";
import FlowNew from "./flow-new";
import NodeFormSheet from "./node-form-sheet";

const DaysFlow = () => {
  const reactFlowWrapper = useRef(null);
  const nodeAtomId = useAtomValue(nodeIdAtom);
  const daysWorkflow = useAtomValue(daysWorkflowDataAtom);

  const downloadFile = useCallback(
    (e: { stopPropagation: () => void }) => {
      downloadJsonFile(
        e,
        JSON.stringify(daysWorkflow, null, 2),
        `days-flow.json`
      );
    },
    [daysWorkflow]
  );

  return (
    <>
      <div
        className={cn(
          "h-[40px] flex flex-row justify-between items-center p-4 bg-white z-10 fixed top-0 w-full",
          isSomething(nodeAtomId) && "w-[1214px] rounded-r-xl"
        )}
      >
        <TelevoxIcon />

        <div className="flex flex-row  justify-start items-center gap-2">
          <Button
            className={` rounded-[5px] text-sm h-[28px]  bg-[#00B2E3] text-white hover:bg-opacity-70 hover:bg-[#00B2E3] hover:text-[white]
          `}
          >
            Save Workflow
          </Button>
          <Button
            className="text-[#777777] hover:text-[#00B2E3]"
            onClick={downloadFile}
          >
            <ArrowDownTrayIcon className="h-5 w-5" />
          </Button>
        </div>
      </div>
      <ReactFlowProvider>
        <div className="relative flex flex-row justify-between">
          <div className={`bg-gray-100  ${nodeAtomId && "max-w-[80%]"} flex-1`}>
            <div className="h-[100vh]" ref={reactFlowWrapper}>
              <FlowNew />
            </div>
          </div>

          {nodeAtomId && (
            <div
              className="w-[20%] bg-white max-h-[100vh] overflow-y-auto shadow-md"
              key={nodeAtomId}
            >
              <NodeFormSheet />
            </div>
          )}
        </div>
      </ReactFlowProvider>
    </>
  );
};

export default DaysFlow;
