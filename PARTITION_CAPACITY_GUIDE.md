# Partition Capacity System - Implementation Guide

## Overview
The warehouse layout designer now includes a comprehensive partition capacity management system where each partition tracks its used and maximum capacity with visual representation.

## Features

### 1. Color-Coded Capacity Visualization
Each partition displays a proportional fill based on usage percentage:
- **Green** (< 40%): Low capacity usage
- **Yellow** (40-70%): Medium capacity usage  
- **Red** (≥ 70%): High capacity usage

The fill is displayed from bottom to top, making it easy to see capacity at a glance.

### 2. Structure-Level Capacity Tracking
Each structure tracks:
- `max_capacity`: Total capacity across all partitions (calculated from partition capacities)
- `used_capacity`: Total used capacity across all partitions (sum of all partition used_capacity values)

### 3. Partition Details Modal
Click on any partition (P1, P2, P3, etc.) to open the Partition Details modal which shows:

**Capacity Section:**
- Visual capacity fill indicator (0-100%)
- Fill color based on usage percentage (green/yellow/red)
- Current/max capacity display (e.g., "30 / 50")
- Percentage filled (e.g., "60.0% filled")
- Status indicator (Low/Medium/High)

**Basic Information:**
- Partition Name (e.g., "P1")
- Partition Code (e.g., "P1")

**Capacity Configuration:**
- Max Capacity: Maximum items this partition can hold
- Used Capacity: Currently stored items (auto-capped at max_capacity)

**Optional Product Information:**
- Product Name: Name of the product stored (optional)
- Product Type: Category of product (optional)
- UOM (Unit of Measure): e.g., "Boxes", "Units" (optional)
- Product Value: Monetary value of stored product (optional)

### 4. JSON Structure

#### Structure Data
```json
{
  "label": "Section A",
  "code": "SEC-001",
  "width": 250,
  "height": 200,
  "color": "#E8F0FE",
  "structureType": "section",
  "max_capacity": 3600,
  "used_capacity": 1200,
  "levels": [...]
}
```

#### Level Data
```json
{
  "id": "level-abc123",
  "name": "Level 1",
  "code": "L1",
  "height": 50,
  "partitions": [...]
}
```

#### Partition Data
```json
{
  "id": "partition-xyz789",
  "name": "P1",
  "code": "P1",
  "width": 80,
  "max_capacity": 100,
  "used_capacity": 45,
  "product_name": "Widget A",
  "product_type": "Electronic",
  "product_value": 5000,
  "product_uom": "Boxes"
}
```

## How It Works

### Creating a Structure
1. Click "Create Structure" in the sidebar
2. Configure:
   - Structure name and code
   - Dimensions (width × height)
   - Add/remove levels
   - Set partitions per level
3. Each partition is created with default max_capacity of 100

### Editing Partition Capacity
1. Click on any partition in the structure (e.g., click on "P1" box)
2. The Partition Details modal opens
3. Adjust:
   - Max capacity (default 100)
   - Used capacity (0 to max)
   - Optional product information
4. Click "Save Partition"
5. Changes are reflected immediately:
   - Partition fill updates
   - Color changes based on percentage
   - Structure's total capacity updates

### Understanding Capacity Fill
- Fill percentage = (used_capacity / max_capacity) × 100
- The partition fills from bottom to top based on this percentage
- Color changes dynamically as usage increases

## Example Scenarios

### Scenario 1: Low Capacity (Green)
- Max: 100 items
- Used: 30 items
- Percentage: 30% (< 40%)
- Visual: 30% fill, green color

### Scenario 2: Medium Capacity (Yellow)
- Max: 100 items
- Used: 55 items
- Percentage: 55% (40-70%)
- Visual: 55% fill, yellow/amber color

### Scenario 3: High Capacity (Red)
- Max: 100 items
- Used: 85 items
- Percentage: 85% (≥ 70%)
- Visual: 85% fill, red color

## Technical Details

### Capacity Calculation
- **Structure max_capacity** = Sum of all partition max_capacity values
- **Structure used_capacity** = Sum of all partition used_capacity values

### Event Handling
Partition updates trigger a `partition-updated` custom event that:
1. Updates the partition data
2. Recalculates all capacity values
3. Updates the structure visualization
4. Maintains referential integrity

### UI Responsiveness
- Modal uses z-index 9999 to appear above canvas
- Click outside modal to close
- Smooth transitions for capacity fill changes
- Color updates automatically based on percentage changes
