"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";
import { useRouter } from "next/navigation";
const BoostStatus = ({
  open,
  onOpenChange,
}: {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
} = {}) => {
  const [isOpen, setIsOpen] = React.useState(open || false);
  const router = useRouter();
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (onOpenChange) {
      onOpenChange(open);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px] 2xl:max-w-[600px] rounded-2xl ">
        <DialogHeader className=" hidden">
          <DialogTitle className="hidden">Are you absolutely sure?</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center gap-2">
          <Image
            src="/images/boosted.svg"
            alt="Boost Status"
            width={300}
            height={300}
            className="mx-auto mb-4"
          />
          <h2 className="text-2xl font-bold text-center text-slate-900 dark:text-slate-100">
            Your property is boosted!
          </h2>
          <p className="text-sm text-center text-slate-500 dark:text-slate-400">
            Enjoy, your property has been bosted.
          </p>

          <button
            onClick={() => router.push("/profile")}
            className="w-full mt-4 rounded-full bg-primary px-4 py-3 text-sm font-medium text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Close
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BoostStatus;
