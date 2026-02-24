"use client";

import { ReactFlowProvider } from "@xyflow/react";
import { WorkflowTabs } from "@/components/warehouse/workflow-tabs";
import { WorkflowProvider } from "@/context/workflow-context";

export default function Page() {
  return (
    <WorkflowProvider>
      <ReactFlowProvider>
        <WorkflowTabs />
      </ReactFlowProvider>
    </WorkflowProvider>
  );
}
