# TinyPaint

***TinyPaint*** is my small project of web application that allows you to draw simple images.

Check out my app: [TinyPaint](https://kamil-dolkowski.github.io/TinyPaint/)

<!-- In the future, I want to add a cooperative option to draw with friends :), but now I am working at basic functionalities of my graphic application. -->

The application can serve as an equivalent to **MS Paint** on **GNU/Linux** systems.

The application has only polish interface now, but I plan to add english interface in the future (but it's not a big problem, because app is very intuitive thanks to many icons :D).


# Technologies

- HTML
- CSS
- JavaScript
- Canvas API
- Font Awesome


# Changelog

## [1.0.0] - 2026-06-12

### Added
- New systems:
    - Canvas system
    - Input system (PointerManager, WheelManager, KeyboardManager, InteractionController)
    - Gesture system
    - Drawing state system (DrawingState and DrawingController)
- Improved mobile user experience:
    - Gesture support
    - UI adjustments
- Gestures: 
    - Pinch-to-zoom
    - Pinch-to-pan
- Tools: 
    - Move-zoom
    - Fit-to-screen
    - Eyedropper
    - Settings
- UI:
    - Contextual toolbar
    - Palette (color selector) (includes: color-palette and color-picker)
- Shortcuts: 
    - Tool shortcuts (change tool): 
        - P - Pencil
        - B - Brush
        - L - Line
        - E - Eraser
        - M - Manipulate
    - Temporary tool shortcuts (hold key to temporarily change tool):
        - CTRL - Manipulate
        - (CTRL+)ALT - Eyedropper
    - Operation shortcuts:
        - F - Fit-to-screen
        - CTRL+S - Save image
- Settings: 
    - Change canvas size
- UI Components:
    - Option slider
    - Palette control
- Other:
    - Roboto font
    - ToolBase class - the base of tool classes
    - `/code_ideas` directory for unused and experimental code ideas
   

### Changed
- Major UI update:
    - App color theme changed from light to dark
    - Tools toolbar split into two sections (app tools and basic tools)
    - Brush settings changed to contextual toolbar and moved to the bottom of app
    - SVG icons moved to local `/assets/icons` (no longer loaded from Font Awesome repository)
    - Buttons changed to circular shape
    - Color button changed to current color button and now is non-interactive
- Canvas:
    - Canvas is no longer fullscreen; it now has a fixed size
- Tools:
    - Pencil now draws true 1 px line using Bresenham algorithm
- Code structure: 
    - Refactored into multiple modules and directories
- Import/Export:
    - Updated import/export functions to support the new canvas system

 
### Fixed
- Undo/redo shortcuts
- Undo bug after switching eraser tool



## [0.5.0] - 2026-03-30
The first changes after uploading the project to GitHub.

### Added
- added button with link to github project

### Changed
- pencil draws 1 pixel line
 
### Fixed
- hidden unimplemented buttons (fill, text, move, zoom, pick color, select, background)
- fixed line color visualization - now visualization has the same color as drawing line



## [0.4.0] - 2026-03-26
The last changes before uploading the project to GitHub.

### Added
- added tool: line
- added line draw visualization
- added change tool visualization - radio buttons
- added perpendicular line draw option (hold SHIFT while drawing)
- added alert window while exitting or reloading the website
- added change brush size to scroll
### Changed
 
### Fixed



## [0.3.0] - 2026-03-25

### Added
- added tool: color picker
- added color change to brush
- added icons from `Font Awesome`
- added visualization to undo/redo buttons
### Changed
 
### Fixed



## [0.2.0] - 2026-03-24

### Added
- added change brush size
- added brush cursor visualization
- added import and export option
- added transparent background to canvas
### Changed
 
### Fixed
- fixed eraser - now is transparent, not background's color



## [0.1.0] - 2026-03-23
Start of the project.

### Added
- added canvas
- added tool: brush
- added tool: eraser
- added tool: clear
- added undo/redo actions, history of changes
### Changed

### Fixed



# Known Issues
- Slight color differences in canvas `getImageData()` on Brave (Chromium-based browsers). Firefox returns exact RGB values.