import { Panel, useReactFlow } from "reactflow";
import { Button } from "../ui/button";
import { daysWorkflowDataAtom, selectedDayAtom } from "@/store/workflow-atoms";
import { useAtomValue, useSetAtom } from "jotai";
import { edgesEdit, editTest } from "@/utils/temp-edit-test";
import { isSomething } from "../../utils/days-flow-constants";

const OnEditPanel = () => {
  const { setEdges, setNodes } = useReactFlow();
  const setDaysWorkflow = useSetAtom(daysWorkflowDataAtom);
  const selectedWorkflowId = useAtomValue(selectedDayAtom);

  const onEditTest = () => {
    setDaysWorkflow(editTest);
    const nodesSelected = editTest?.find(
      (workdflow) => workdflow?.day?.id === selectedWorkflowId
    );

    if (
      nodesSelected &&
      isSomething(nodesSelected?.day) &&
      isSomething(nodesSelected)
    ) {
      const { workflow } = nodesSelected.day;
      setNodes(workflow || []);
      const edgesTest = edgesEdit;

      setEdges(edgesTest || []);
    } else {
      setNodes([]);
    }
  };
  return (
    <Panel
      position="bottom-left"
      className="bg-white rounded-[5px] w-[120px] shadow-xl mt-16"
      key="edit-test"
      onClick={onEditTest}
    >
      <Button
        className={` rounded-[5px] text-sm h-[28px]  bg-[#00B2E3] text-white hover:bg-opacity-70 hover:bg-[#00B2E3] hover:text-[white] w-full
          `}
      >
        Edit Test
      </Button>
    </Panel>
  );
};

export default OnEditPanel;
