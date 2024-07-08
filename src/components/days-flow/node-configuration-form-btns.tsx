import { useSetAtom } from "jotai";

import { Button } from "../ui/button";
import { nodeIdAtom } from "@/store/workflow-atoms";

type NodeConfigurationFormBtnsProps = {
  isValid: boolean;
};

const NodeConfigurationFormBtns = (props: NodeConfigurationFormBtnsProps) => {
  const { isValid } = props;
  const setAtomId = useSetAtom(nodeIdAtom);
  return (
    <div className="flex flex-row justify-start items-center gap-2">
      <Button
        type="submit"
        variant="secondary"
        className="text-white bg-[#00B2E3]  rounded-[5px] hover:bg-[#00B2E3] hover:opacity-70"
        disabled={!isValid}
      >
        Save
      </Button>
      <Button
        type="button"
        variant="outline"
        className="text-[#00B2E3] bg-white border border-[#00B2E3] rounded-[5px] hover:text-[#00B2E3] hover:opacity-70"
        onClick={() => setAtomId(null)}
      >
        Cancel
      </Button>
    </div>
  );
};

export default NodeConfigurationFormBtns;
