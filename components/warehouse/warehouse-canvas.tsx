"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  type NodeTypes,
  type Node,
  type OnNodeDrag,
  type NodeMouseHandler,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { nanoid } from "nanoid";
import { Menu, X } from "lucide-react";

import { WarehouseNode } from "./nodes/warehouse-node";
import { ElementNode } from "./nodes/element-node";
import { ZoneNode } from "./nodes/zone-node";
import { StorageNode } from "./nodes/storage-node";
import { StructureNode } from "./nodes/structure-node";
import { SidePanel } from "./side-panel";

import {
  GRID_SIZE,
  type StorageData,
  type WarehouseData,
  type ZoneType,
  type StructureType,
  type BinSize,
} from "./types";
import {
  createWarehouseNode,
  createZoneNode,
  createStorageNode,
  createStructureNode,
} from "./utils";

const nodeTypes: NodeTypes = {
  warehouse: WarehouseNode,
  element: ElementNode,
  zone: ZoneNode,
  storage: StorageNode,
  structure: StructureNode,
};

export function WarehouseCanvas() {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [isEditingWarehouse, setIsEditingWarehouse] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  const warehouseNode = useMemo(
    () => nodes.find((n) => n.type === "warehouse"),
    [nodes]
  );

  const warehouseData = warehouseNode?.data as WarehouseData | null;
  const warehouseExists = !!warehouseNode;

  const selectedNode = useMemo(
    () => nodes.find((n) => n.id === selectedNodeId) || null,
    [nodes, selectedNodeId]
  );

  const zones = useMemo(
    () => nodes.filter((n) => n.type === "zone"),
    [nodes]
  );

  // Create or update warehouse
  const handleCreateWarehouse = useCallback(
    (data: { name: string; width: number; height: number; length: number }) => {
      if (warehouseExists) {
        setNodes((nds) =>
          nds.map((n) =>
            n.id === "warehouse"
              ? {
                  ...n,
                  data: {
                    ...n.data,
                    label: data.name,
                    width: data.width,
                    height: data.height,
                    length: data.length,
                  },
                  style: { ...n.style, width: data.width, height: data.height },
                }
              : n
          )
        );
        setIsEditingWarehouse(false);
      } else {
        const node = createWarehouseNode(data);
        setNodes([node]);
        setIsEditingWarehouse(false);
      }
    },
    [warehouseExists, setNodes]
  );

  // Add zones with optional form data
  const handleAddZone = useCallback(
    (
      type: ZoneType,
      formData?: {
        name?: string;
        width?: number;
        height?: number;
        length?: number;
        color?: string;
        temperatureMin?: number;
        temperatureMax?: number;
      }
    ) => {
      if (!warehouseNode) return;
      const wStyle = warehouseNode.style || {};
      const pw = (wStyle.width as number) || 800;
      const ph = (wStyle.height as number) || 600;
      const newNode = createZoneNode(type, { width: pw, height: ph }, formData);
      setNodes((nds) => [...nds, newNode]);
    },
    [warehouseNode, setNodes]
  );

  // Add structures
  const handleAddStructure = useCallback(
    (
      type: StructureType,
      formData?: {
        name?: string;
        width?: number;
        height?: number;
        levels?: number;
        partitions?: number;
        color?: string;
      }
    ) => {
      if (!warehouseNode) return;
      const wStyle = warehouseNode.style || {};
      const pw = (wStyle.width as number) || 800;
      const ph = (wStyle.height as number) || 600;
      const newNode = createStructureNode(
        type,
        { width: pw, height: ph },
        formData
      );
      setNodes((nds) => [...nds, newNode]);
    },
    [warehouseNode, setNodes]
  );

  // Add storage to a zone
  const handleAddStorage = useCallback(
    (
      storageType: StorageData["storageType"],
      zoneId: string,
      formData?: {
        name?: string;
        width?: number;
        height?: number;
        depth?: number;
        color?: string;
        shelfCount?: number;
        shelfCapacity?: number;
        binCapacity?: number;
        binSize?: BinSize;
      }
    ) => {
      const zone = nodes.find((n) => n.id === zoneId);
      if (!zone) return;
      const zStyle = zone.style || {};
      const pw = (zStyle.width as number) || 250;
      const ph = (zStyle.height as number) || 200;
      const newNode = createStorageNode(
        storageType,
        zoneId,
        { width: pw, height: ph },
        formData
      );
      setNodes((nds) => [...nds, newNode]);
    },
    [nodes, setNodes]
  );

  // Update any node's data
  const handleUpdateNode = useCallback(
    (id: string, data: Record<string, unknown>) => {
      setNodes((nds) =>
        nds.map((n) => {
          if (n.id !== id) return n;
          const updatedNode = {
            ...n,
            data: { ...n.data, ...data },
          };
          if (data.width || data.height) {
            updatedNode.style = {
              ...n.style,
              ...(data.width ? { width: data.width as number } : {}),
              ...(data.height ? { height: data.height as number } : {}),
            };
          }
          return updatedNode;
        })
      );
    },
    [setNodes]
  );

  // Duplicate node
  const handleDuplicate = useCallback(
    (id: string) => {
      const node = nodes.find((n) => n.id === id);
      if (!node || node.type === "warehouse") return;
      const newNode: Node = {
        ...node,
        id: `${node.type}-${nanoid(6)}`,
        position: {
          x: node.position.x + 20,
          y: node.position.y + 20,
        },
        selected: false,
        data: { ...node.data },
      };
      setNodes((nds) => [...nds, newNode]);
    },
    [nodes, setNodes]
  );

  // Delete node (and children if zone)
  const handleDelete = useCallback(
    (id: string) => {
      if (id === "warehouse") return;
      setNodes((nds) => {
        const node = nds.find((n) => n.id === id);
        if (!node) return nds;
        if (node.type === "zone") {
          return nds.filter((n) => n.id !== id && n.parentId !== id);
        }
        return nds.filter((n) => n.id !== id);
      });
      if (selectedNodeId === id) setSelectedNodeId(null);
    },
    [setNodes, selectedNodeId]
  );

  // Rotate element -- only on user rotate action
  const handleRotate = useCallback(
    (id: string) => {
      setNodes((nds) =>
        nds.map((n) => {
          if (n.id !== id) return n;
          const d = n.data as Record<string, unknown>;
          return {
            ...n,
            data: {
              ...d,
              rotation: (((d.rotation as number) || 0) + 90) % 360,
            },
          };
        })
      );
    },
    [setNodes]
  );

  // Export as JSON
  const handleExportJSON = useCallback(() => {
    const data = JSON.stringify(nodes, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "warehouse-layout.json";
    a.click();
    URL.revokeObjectURL(url);
  }, [nodes]);

  // Import from JSON
  const handleImportJSON = useCallback(
    (file: File) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const imported = JSON.parse(e.target?.result as string);
          if (Array.isArray(imported)) {
            setNodes(imported);
          }
        } catch {
          // silent fail for invalid JSON
        }
      };
      reader.readAsText(file);
    },
    [setNodes]
  );

  // Handle node click: toolbar actions or select
  const onNodeClick: NodeMouseHandler = useCallback(
    (_event, node) => {
      const target = _event.target as HTMLElement;
      const btn = target.closest("[data-action]") as HTMLElement | null;
      if (btn) {
        const action = btn.dataset.action;
        const nodeId = btn.dataset.nodeId || node.id;
        switch (action) {
          case "edit":
            setSelectedNodeId(nodeId);
            setIsEditingWarehouse(false);
            if (!sidebarOpen) setSidebarOpen(true);
            return;
          case "duplicate":
            handleDuplicate(nodeId);
            return;
          case "delete":
            handleDelete(nodeId);
            return;
          case "rotate":
            handleRotate(nodeId);
            return;
          case "add-rack":
            handleAddStorage("rack", nodeId);
            return;
          case "add-shelf":
            handleAddStorage("shelf", nodeId);
            return;
          case "add-bin":
            handleAddStorage("bin", nodeId);
            return;
          case "add-floor":
            handleAddStorage("floor", nodeId);
            return;
        }
      }
      if (node.type === "warehouse") {
        setIsEditingWarehouse(true);
        setSelectedNodeId(null);
        if (!sidebarOpen) setSidebarOpen(true);
      } else {
        setSelectedNodeId(node.id);
        setIsEditingWarehouse(false);
        if (!sidebarOpen) setSidebarOpen(true);
      }
    },
    [
      handleDuplicate,
      handleDelete,
      handleRotate,
      handleAddStorage,
      sidebarOpen,
    ]
  );

  const onPaneClick = useCallback(() => {
    setSelectedNodeId(null);
    setIsEditingWarehouse(false);
  }, []);

  // Snap to grid on drag
  const onNodeDrag: OnNodeDrag = useCallback(() => {
    // Snapping handled by React Flow snapToGrid prop
  }, []);

  // Handle node resize
  const handleNodesChange = useCallback(
    (changes: Parameters<typeof onNodesChange>[0]) => {
      onNodesChange(changes);

      for (const change of changes) {
        if (change.type === "dimensions" && change.dimensions) {
          setNodes((nds) =>
            nds.map((n) =>
              n.id === change.id
                ? {
                    ...n,
                    data: {
                      ...n.data,
                      width: change.dimensions!.width,
                      height: change.dimensions!.height,
                    },
                    style: {
                      ...n.style,
                      width: change.dimensions!.width,
                      height: change.dimensions!.height,
                    },
                  }
                : n
            )
          );
        }
      }
    },
    [onNodesChange, setNodes]
  );

  const handleCloseEdit = useCallback(() => {
    if (
      !isEditingWarehouse &&
      selectedNode?.type !== "warehouse"
    ) {
      setIsEditingWarehouse(true);
      setSelectedNodeId(null);
    } else {
      setSelectedNodeId(null);
      setIsEditingWarehouse(false);
    }
  }, [isEditingWarehouse, selectedNode]);

  return (
    <div className="flex h-screen w-full bg-background">
      <SidePanel
        isOpen={sidebarOpen}
        warehouseExists={warehouseExists}
        warehouseData={warehouseData}
        selectedNode={selectedNode}
        isEditingWarehouse={isEditingWarehouse}
        onCreateWarehouse={handleCreateWarehouse}
        onUpdateNode={handleUpdateNode}
        onAddZone={handleAddZone}
        onAddStructure={handleAddStructure}
        onAddStorage={handleAddStorage}
        onCloseEdit={handleCloseEdit}
        onExportJSON={handleExportJSON}
        onImportJSON={handleImportJSON}
        zones={zones}
      />
      <div className="relative flex-1" ref={reactFlowWrapper}>
        {/* Hamburger toggle */}
        <button
          onClick={() => setSidebarOpen((v) => !v)}
          className="absolute left-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-md border border-border bg-card shadow-sm transition-colors hover:bg-accent"
          aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          {sidebarOpen ? (
            <X size={18} className="text-foreground" />
          ) : (
            <Menu size={18} className="text-foreground" />
          )}
        </button>

        <ReactFlow
          nodes={nodes}
          edges={[]}
          onNodesChange={handleNodesChange}
          onNodeClick={onNodeClick}
          onNodeDrag={onNodeDrag}
          onPaneClick={onPaneClick}
          nodeTypes={nodeTypes}
          snapToGrid
          snapGrid={[GRID_SIZE, GRID_SIZE]}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          minZoom={0.1}
          maxZoom={3}
          proOptions={{ hideAttribution: true }}
          className="bg-muted/30"
        >
          <Background gap={GRID_SIZE} size={1} color="hsl(var(--border))" />
          <Controls
            position="bottom-right"
            className="rounded-lg border border-border bg-card shadow-sm"
          />
          <MiniMap
            position="bottom-left"
            nodeStrokeWidth={2}
            maskColor="rgba(0,0,0,0.08)"
            className="rounded-lg border border-border shadow-sm"
            style={{ marginLeft: sidebarOpen ? 0 : 0 }}
          />
        </ReactFlow>
      </div>
    </div>
  );
}
