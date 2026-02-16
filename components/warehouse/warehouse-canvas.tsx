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

import { WarehouseNode } from "./nodes/warehouse-node";
import { ElementNode } from "./nodes/element-node";
import { ZoneNode } from "./nodes/zone-node";
import { StorageNode } from "./nodes/storage-node";
import { SidePanel } from "./side-panel";

import type {
  ElementData,
  StorageData,
  WarehouseData,
  ZoneType,
} from "./types";
import {
  createWarehouseNode,
  createElementNode,
  createZoneNode,
  createStorageNode,
  GRID_SIZE,
} from "./utils";

const nodeTypes: NodeTypes = {
  warehouse: WarehouseNode,
  element: ElementNode,
  zone: ZoneNode,
  storage: StorageNode,
};

export function WarehouseCanvas() {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [isEditingWarehouse, setIsEditingWarehouse] = useState(false);
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

  // Add internal elements
  const handleAddElement = useCallback(
    (type: ElementData["elementType"]) => {
      if (!warehouseNode) return;
      const wStyle = warehouseNode.style || {};
      const pw = (wStyle.width as number) || 800;
      const ph = (wStyle.height as number) || 600;
      const newNode = createElementNode(
        type,
        warehouseNode.position,
        { width: pw, height: ph }
      );
      setNodes((nds) => [...nds, newNode]);
    },
    [warehouseNode, setNodes]
  );

  // Add zones
  const handleAddZone = useCallback(
    (type: ZoneType) => {
      if (!warehouseNode) return;
      const wStyle = warehouseNode.style || {};
      const pw = (wStyle.width as number) || 800;
      const ph = (wStyle.height as number) || 600;
      const newNode = createZoneNode(type, { width: pw, height: ph });
      setNodes((nds) => [...nds, newNode]);
    },
    [warehouseNode, setNodes]
  );

  // Add storage to a zone
  const handleAddStorage = useCallback(
    (storageType: StorageData["storageType"], zoneId: string) => {
      const zone = nodes.find((n) => n.id === zoneId);
      if (!zone) return;
      const zStyle = zone.style || {};
      const pw = (zStyle.width as number) || 250;
      const ph = (zStyle.height as number) || 200;
      const newNode = createStorageNode(storageType, zoneId, {
        width: pw,
        height: ph,
      });
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

  // Rotate element
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
        }
      }
      if (node.type === "warehouse") {
        setIsEditingWarehouse(true);
        setSelectedNodeId(null);
      } else {
        setSelectedNodeId(node.id);
        setIsEditingWarehouse(false);
      }
    },
    [handleDuplicate, handleDelete, handleRotate, handleAddStorage]
  );

  const onPaneClick = useCallback(() => {
    setSelectedNodeId(null);
    setIsEditingWarehouse(false);
  }, []);

  // Snap to grid on drag
  const onNodeDrag: OnNodeDrag = useCallback((_event, node) => {
    // Snapping handled by React Flow snapToGrid prop
  }, []);

  // Handle node resize
  const handleNodesChange = useCallback(
    (changes: Parameters<typeof onNodesChange>[0]) => {
      onNodesChange(changes);

      // Sync style dimensions when resizing
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
    const editWarehouseClicked =
      !isEditingWarehouse && selectedNode?.type !== "warehouse";
    if (editWarehouseClicked) {
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
        warehouseExists={warehouseExists}
        warehouseData={warehouseData}
        selectedNode={selectedNode}
        isEditingWarehouse={isEditingWarehouse}
        onCreateWarehouse={handleCreateWarehouse}
        onUpdateNode={handleUpdateNode}
        onAddElement={handleAddElement}
        onAddZone={handleAddZone}
        onCloseEdit={handleCloseEdit}
      />
      <div className="flex-1" ref={reactFlowWrapper}>
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
          minZoom={0.2}
          maxZoom={2}
          proOptions={{ hideAttribution: true }}
          className="bg-muted/30"
        >
          <Background gap={GRID_SIZE} size={1} color="#E2E8F0" />
          <Controls
            position="bottom-right"
            className="rounded-lg border border-border bg-card shadow-sm"
          />
          <MiniMap
            position="bottom-left"
            nodeStrokeWidth={2}
            maskColor="rgba(0,0,0,0.08)"
            className="rounded-lg border border-border shadow-sm"
          />
        </ReactFlow>
      </div>
    </div>
  );
}
