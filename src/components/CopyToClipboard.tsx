"use client";

import { Copy } from "lucide-react";
import { Button } from "./ui/button";

export function CopyToClipboard(props: { couponCode: string; }) {
  const copyToClipboard = async () => {
    if (!props.couponCode) return null;
    await navigator.clipboard.writeText(props.couponCode);
  };

  return (
    <div className="h-12 px-2 py-2 border-2 border-dashed rounded-md flex justify-between items-center">
      <p>
        {props.couponCode}
      </p>
      <Button size="icon" variant="ghost" onClick={copyToClipboard}>
        <Copy className="h-4 w-4" />
      </Button>
    </div>
  );
}