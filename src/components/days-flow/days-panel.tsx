import { Panel } from "reactflow";
import DaysMenu from "./days-menu";

const DaysPanel = () => {
  return (
    <Panel
      position="top-left"
      className="bg-white rounded-[5px] w-[120px] shadow-xl mt-16"
      key="days-menu"
    >
      <DaysMenu />
    </Panel>
  );
};

export default DaysPanel;
