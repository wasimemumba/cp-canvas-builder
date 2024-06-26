import { Panel } from "reactflow";
import { Button } from "../ui/button";
import { useAtomValue, useSetAtom } from "jotai";
import { currentViewAtom, nodeIdAtom } from "@/store/workflow-atoms";

const VidewTogglePanel = () => {
  const setCurrentView = useSetAtom(currentViewAtom);
  const currentView = useAtomValue(currentViewAtom);
  const nodeAtomId = useAtomValue(nodeIdAtom);
  return (
    <Panel
      position="top-right"
      className={`bg-white rounded-[5px] flex flex-row justify-start items-center mt-14  shadow-xl ${
        nodeAtomId && "mr-[21%]"
      }`}
      key="view-panel"
    >
      <Button
        className={`text-[#777777] text-sm rounded-l-[5px] hover:text-[#00B2E3] ${
          currentView === "summary" &&
          "bg-[#00B2E3] text-white hover:bg-opacity-70 hover:bg-[#00B2E3] hover:text-[white]"
        }`}
        onClick={() => setCurrentView("summary")}
      >
        Summary
      </Button>

      <Button
        className={`text-[#777777] text-sm rounded-r-[5px] hover:text-[#00B2E3] ${
          currentView === "detailed" &&
          "bg-[#00B2E3] text-white hover:bg-opacity-70 hover:bg-[#00B2E3] hover:text-[white]"
        }`}
        onClick={() => setCurrentView("detailed")}
      >
        Detailed
      </Button>
    </Panel>
  );
};

export default VidewTogglePanel;
