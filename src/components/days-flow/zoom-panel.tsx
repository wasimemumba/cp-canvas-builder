import { useMemo } from "react";
import { Panel, useReactFlow, useViewport } from "reactflow";
import { Button } from "../ui/button";
import { MinusIcon, PlusIcon } from "./days-flow-icons";
import { valueToPercentage } from "./days-flow-constants";
import { nodeIdAtom } from "@/store/workflow-atoms";
import { useAtomValue } from "jotai";

const ZoomPanel = () => {
  const { setViewport } = useReactFlow();
  const { zoom, x, y } = useViewport();
  const valuePercentage = useMemo(() => valueToPercentage(zoom), [zoom]);
  const nodeAtomId = useAtomValue(nodeIdAtom);

  return (
    <Panel
      position="bottom-right"
      className={`bg-white rounded-[5px] flex flex-row justify-start items-center  shadow-xl ${
        nodeAtomId && "mr-[21%]"
      } `}
      key="zoom-menu-panel"
    >
      <Button
        onClick={() =>
          setViewport({
            zoom: zoom >= 0.5 ? Math.min(zoom - 0.25, 2) : 0.25,
            x,
            y,
          })
        }
        disabled={valuePercentage === 0}
      >
        <MinusIcon />
      </Button>
      <span className="text-base text-[#777777]">{valuePercentage} %</span>
      <Button
        onClick={() => setViewport({ zoom: Math.min(zoom + 0.25, 2), x, y })}
        disabled={valuePercentage === 100}
      >
        <PlusIcon />
      </Button>
    </Panel>
  );
};

export default ZoomPanel;
