import {
  daysWorkflowDataAtom,
  nodeIdAtom,
  redoAtom,
  selectedDayAtom,
  undoAtom,
} from "@/store/workflow-atoms";
import { useAtomValue, useSetAtom } from "jotai";

import { BreadCrumbIcon } from "../../utils/days-flow-icons";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "../ui/menubar";

const DaysMenu = () => {
  const daysWorkflow = useAtomValue(daysWorkflowDataAtom);
  const setDaysWorkflow = useSetAtom(selectedDayAtom);
  const setUndo = useSetAtom(undoAtom);
  const setRedo = useSetAtom(redoAtom);
  const setAtomId = useSetAtom(nodeIdAtom);
  return (
    <Menubar asChild>
      <MenubarMenu>
        <MenubarTrigger className="w-full flex flex-row gap-2 cursor-pointer ">
          <BreadCrumbIcon />
          Work flow
        </MenubarTrigger>
        <MenubarContent className="bg-white rounded-[5px]">
          {daysWorkflow?.map((daywork) => (
            <MenubarItem
              key={daywork?.day?.id}
              className="cursor-pointer focus:bg-gray-300 rounded-[5px] text-[#2A2D2E] text-sm"
              onClick={() => {
                setDaysWorkflow(daywork?.day?.id);
                setUndo([]);
                setRedo([]);
                setAtomId(null);
              }}
            >
              Day {daywork?.day?.dayValue}
            </MenubarItem>
          ))}
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
};

export default DaysMenu;
