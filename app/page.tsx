"use client";

import { ReactFlowProvider } from "@xyflow/react";
import { WarehouseCanvas } from "@/components/warehouse/warehouse-canvas";
import Link from "next/link";
import { Package } from "lucide-react";

export default function Page() {
  return (
    <div className="relative">
      {/* Navigation Bar */}
      <div className="fixed top-0 right-0 z-50 p-4">
        <Link
          href="/inbound"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-accent hover:bg-accent-secondary text-accent-foreground font-medium transition-colors shadow-lg"
        >
          <Package className="w-5 h-5" />
          <span>Inbound Workflow</span>
        </Link>
      </div>

      <ReactFlowProvider>
        <WarehouseCanvas />
      </ReactFlowProvider>
    </div>
  );
}
