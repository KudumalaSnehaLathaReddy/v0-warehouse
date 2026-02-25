"use client";

import { ReactFlowProvider } from "@xyflow/react";
import { WarehouseCanvas } from "@/components/warehouse/warehouse-canvas";
import { WorkflowProvider } from "@/components/warehouse/workflow-context";

export default function Page() {
  return (
    <WorkflowProvider>
      <ReactFlowProvider>
        <WarehouseCanvas />
      </ReactFlowProvider>
    </WorkflowProvider>
  );
}
