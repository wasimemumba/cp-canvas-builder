import { nodeIdAtom } from "@/store/workflow-atoms";
import { useAtomValue } from "jotai";
import { useRef } from "react";
import { ReactFlowProvider } from "reactflow";

import FlowNew from "./flow-new";
import NodeFormSheet from "./node-form-sheet";
import Header from "./header";

const DaysFlow = () => {
  const reactFlowWrapper = useRef(null);
  const nodeAtomId = useAtomValue(nodeIdAtom);

  return (
    <>
      <Header />
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
