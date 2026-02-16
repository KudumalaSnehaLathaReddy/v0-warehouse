"use client";

import { ReactFlowProvider } from "@xyflow/react";
import { WarehouseCanvas } from "@/components/warehouse/warehouse-canvas";

export default function Page() {
  return (
    <ReactFlowProvider>
      <WarehouseCanvas />
    </ReactFlowProvider>
  );
}
