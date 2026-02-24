import {
  RotationStrategy,
  StorageCoordinate,
  StructureData,
  StorageData,
  PartitionCapacity,
} from './types';

/**
 * FIFO (First In First Out) - Select the oldest partition with available space
 */
export const applyFIFO = (
  structures: StructureData[],
  storageMap: Map<string, StorageData>,
  quantity: number,
  excludePartitions: StorageCoordinate[] = []
): StorageCoordinate[] => {
  const assignments: StorageCoordinate[] = [];
  let remainingQuantity = quantity;

  for (const structure of structures) {
    for (let levelIndex = 0; levelIndex < structure.levels; levelIndex++) {
      for (let partitionIndex = 0; partitionIndex < structure.partitions; partitionIndex++) {
        if (remainingQuantity <= 0) break;

        const isExcluded = excludePartitions.some(
          (ep) =>
            ep.structureId === structure.id &&
            ep.levelIndex === levelIndex &&
            ep.partitionIndex === partitionIndex
        );

        if (isExcluded) continue;

        const storage = storageMap.get(structure.id);
        if (!storage) continue;

        const availableCapacity = structure.partitionCapacity - (storage.usedCapacity || 0);
        if (availableCapacity <= 0) continue;

        const assignQuantity = Math.min(remainingQuantity, availableCapacity);
        assignments.push({
          structureId: structure.id,
          levelIndex,
          partitionIndex,
          quantity: assignQuantity,
          assignedAt: new Date(),
        });

        remainingQuantity -= assignQuantity;
      }
    }
  }

  return assignments;
};

/**
 * FEFO (First Expired First Out) - Select partitions with earliest expiration
 * For this implementation, we prioritize partitions with lower index (simulating older stock)
 */
export const applyFEFO = (
  structures: StructureData[],
  storageMap: Map<string, StorageData>,
  quantity: number,
  excludePartitions: StorageCoordinate[] = []
): StorageCoordinate[] => {
  const assignments: StorageCoordinate[] = [];
  let remainingQuantity = quantity;

  // Sort structures by ID to maintain consistency
  const sortedStructures = [...structures].sort((a, b) => a.id.localeCompare(b.id));

  for (const structure of sortedStructures) {
    for (let levelIndex = 0; levelIndex < structure.levels; levelIndex++) {
      for (let partitionIndex = 0; partitionIndex < structure.partitions; partitionIndex++) {
        if (remainingQuantity <= 0) break;

        const isExcluded = excludePartitions.some(
          (ep) =>
            ep.structureId === structure.id &&
            ep.levelIndex === levelIndex &&
            ep.partitionIndex === partitionIndex
        );

        if (isExcluded) continue;

        const storage = storageMap.get(structure.id);
        if (!storage) continue;

        const availableCapacity = structure.partitionCapacity - (storage.usedCapacity || 0);
        if (availableCapacity <= 0) continue;

        const assignQuantity = Math.min(remainingQuantity, availableCapacity);
        assignments.push({
          structureId: structure.id,
          levelIndex,
          partitionIndex,
          quantity: assignQuantity,
          assignedAt: new Date(),
        });

        remainingQuantity -= assignQuantity;
      }
    }
  }

  return assignments;
};

/**
 * LIFO (Last In First Out) - Select the newest partition with available space
 * Reverse order prioritization
 */
export const applyLIFO = (
  structures: StructureData[],
  storageMap: Map<string, StorageData>,
  quantity: number,
  excludePartitions: StorageCoordinate[] = []
): StorageCoordinate[] => {
  const assignments: StorageCoordinate[] = [];
  let remainingQuantity = quantity;

  // Reverse iterate through structures
  for (let i = structures.length - 1; i >= 0; i--) {
    const structure = structures[i];
    for (let levelIndex = structure.levels - 1; levelIndex >= 0; levelIndex--) {
      for (let partitionIndex = structure.partitions - 1; partitionIndex >= 0; partitionIndex--) {
        if (remainingQuantity <= 0) break;

        const isExcluded = excludePartitions.some(
          (ep) =>
            ep.structureId === structure.id &&
            ep.levelIndex === levelIndex &&
            ep.partitionIndex === partitionIndex
        );

        if (isExcluded) continue;

        const storage = storageMap.get(structure.id);
        if (!storage) continue;

        const availableCapacity = structure.partitionCapacity - (storage.usedCapacity || 0);
        if (availableCapacity <= 0) continue;

        const assignQuantity = Math.min(remainingQuantity, availableCapacity);
        assignments.push({
          structureId: structure.id,
          levelIndex,
          partitionIndex,
          quantity: assignQuantity,
          assignedAt: new Date(),
        });

        remainingQuantity -= assignQuantity;
      }
    }
  }

  return assignments;
};

/**
 * Apply rotation strategy to get storage assignments
 */
export const applyRotationStrategy = (
  strategy: RotationStrategy,
  structures: StructureData[],
  storageMap: Map<string, StorageData>,
  quantity: number,
  excludePartitions?: StorageCoordinate[]
): StorageCoordinate[] => {
  switch (strategy) {
    case 'FIFO':
      return applyFIFO(structures, storageMap, quantity, excludePartitions);
    case 'FEFO':
      return applyFEFO(structures, storageMap, quantity, excludePartitions);
    case 'LIFO':
      return applyLIFO(structures, storageMap, quantity, excludePartitions);
    default:
      return [];
  }
};

/**
 * Calculate partition capacity
 */
export const calculatePartitionCapacity = (
  partitionCapacity: number,
  usedCapacity: number
): PartitionCapacity => {
  const utilized = Math.min(usedCapacity, partitionCapacity);
  return {
    used: utilized,
    total: partitionCapacity,
    utilization: (utilized / partitionCapacity) * 100,
  };
};

/**
 * Check if partition has available capacity
 */
export const hasAvailableCapacity = (
  partitionCapacity: number,
  usedCapacity: number,
  requiredQuantity: number
): boolean => {
  const available = partitionCapacity - (usedCapacity || 0);
  return available >= requiredQuantity;
};

/**
 * Find available partitions for assignment
 */
export const findAvailablePartitions = (
  structures: StructureData[],
  storageMap: Map<string, StorageData>,
  minimumCapacity: number
): StorageCoordinate[] => {
  const available: StorageCoordinate[] = [];

  for (const structure of structures) {
    for (let levelIndex = 0; levelIndex < structure.levels; levelIndex++) {
      for (let partitionIndex = 0; partitionIndex < structure.partitions; partitionIndex++) {
        const storage = storageMap.get(structure.id);
        if (!storage) continue;

        if (hasAvailableCapacity(structure.partitionCapacity, storage.usedCapacity || 0, minimumCapacity)) {
          const availableCapacity = structure.partitionCapacity - (storage.usedCapacity || 0);
          available.push({
            structureId: structure.id,
            levelIndex,
            partitionIndex,
            quantity: availableCapacity,
          });
        }
      }
    }
  }

  return available;
};

/**
 * Calculate total capacity utilization across structures
 */
export const calculateTotalUtilization = (
  structures: StructureData[],
  storageMap: Map<string, StorageData>
): { used: number; total: number; utilization: number } => {
  let totalUsed = 0;
  let totalCapacity = 0;

  for (const structure of structures) {
    const storage = storageMap.get(structure.id);
    if (!storage) continue;

    totalCapacity += structure.levelCapacity * structure.levels;
    totalUsed += storage.usedCapacity || 0;
  }

  return {
    used: totalUsed,
    total: totalCapacity,
    utilization: totalCapacity > 0 ? (totalUsed / totalCapacity) * 100 : 0,
  };
};
