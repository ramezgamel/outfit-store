import { Button } from "@/components/ui/button";
import { ArrowRight, Loader } from "lucide-react";

const SubmitButton = ({
  isPending,
  btnName,
}: {
  isPending: boolean;
  btnName: string;
}) => {
  return (
    <div className="flex gap-2 mt-4">
      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? (
          <Loader className="w-4 h-4 animate-spin" />
        ) : (
          <ArrowRight className="w-4 h-4" />
        )}
        {btnName}
      </Button>
    </div>
  );
};

export default SubmitButton;
