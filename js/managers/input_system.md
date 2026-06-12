# Input System

## Input processing pipeline (diagrams)

```
Pointer Event
 |
\|/
PointerManager (mouse, touch, pen) (input unification) [sensor]
 |       |
 |      \|/
 |    GestureManager (detects gestures) [detection]
 |       |
\|/     \|/
InteractionController (decides which data (pointer or gesture) gives to ToolManager) [decision]
 |
\|/
ToolManager (decides which tool draw) [router]
 |                                    |
\|/                                  \|/
Gesture (gesture functionality) --> Tool (draw logic) [interpreter]
                                      |
                                     \|/
                                    Canvas (basic canvas operations)
```

```
Pointer Event -> PointerManager
PointerManager -> GestureManager
PointerManager + GestureManager -> InteractionController
InteractionController -> Tool / Gesture
Gesture -> Tool
Tool -> Canvas
```

## System Details
### 1. PointerManager [PM]
- storing, normalization and unification pointer data
- gives pointerData to InteractionManager
- gives activePointers array (snapshot) to GestureManager

### 2. GestureManager [GM]
- identifying gestures
- gives gestureData to InteractionManager

### 3. InteractionController [IC]
- decides if tool or gesture:
  - sends gestureData to ToolManager if gesture exists 
  - or sends pointerData to ToolManager if gesture does not exist

### 4.1 Tool [T]
- has implemented draw logic (uses canvas - ctx)
- gets pointerData
- knows what to do with pointerData 

### 4.2 Gesture [G]
- execute gesture functionality - uses moveZoom tool
- gets gestureData
- knows what to do with gestureData

### 5. Canvas [C]
- has basic canvas operations - for example: moveRelative, moveAbsolute
- has all canvases and ctx'es in one place

## Diagram
```
[PM] --activePointers-> [GM] --gestureData-> [IC] --> [TM] --> [T] --> [C]
  |                                           ^         |       ^
  \-------------pointerData-------------------|         \- --> [G]
```