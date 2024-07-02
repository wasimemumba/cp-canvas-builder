import { nodeIdAtom } from "@/store/workflow-atoms";
import { useAtomValue } from "jotai";
import { useCallback, useMemo } from "react";
import { Panel, useReactFlow, useViewport } from "reactflow";

import { cn } from "@/lib/utils";
import { MinusIcon, PlusIcon } from "../../utils/days-flow-icons";
import { valueToPercentage } from "../../utils/react-flow.utils";
import { Button } from "../ui/button";

const ZoomPanel = () => {
  const { setViewport } = useReactFlow();
  const { zoom, x, y } = useViewport();
  const valuePercentage = useMemo(() => valueToPercentage(zoom), [zoom]);
  const nodeAtomId = useAtomValue(nodeIdAtom);

  const zoomOut = useCallback(() => {
    setViewport({
      zoom: zoom >= 0.5 ? Math.min(zoom - 0.25, 2) : 0.25,
      x,
      y,
    });
  }, [setViewport, x, y, zoom]);

  const zoomIn = useCallback(() => {
    setViewport({ zoom: Math.min(zoom + 0.25, 2), x, y });
  }, [setViewport, x, y, zoom]);

  return (
    <Panel
      position="bottom-right"
      className={cn(
        "bg-white rounded-[5px] flex flex-row justify-start items-center shadow-xl",
        {
          "mr-[324px]": nodeAtomId,
        }
      )}
      key="zoom-menu-panel"
    >
      <Button onClick={zoomOut} disabled={valuePercentage === 0}>
        <MinusIcon />
      </Button>
      <span className="text-base text-[#777777]">{valuePercentage} %</span>
      <Button onClick={zoomIn} disabled={valuePercentage === 100}>
        <PlusIcon />
      </Button>
    </Panel>
  );
};

export default ZoomPanel;
