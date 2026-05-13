# TinyPaint

***TinyPaint*** is my small project of web application that allows you to draw simple images.

Check out my app: [TinyPaint](https://kamil-dolkowski.github.io/TinyPaint/)

In the future, I want to add a cooperative option to draw with friends :), but now I am working at basic functionalities of my graphic application.

The application has only polish interface now, but I plan to add english interface in the future (but it's not a big problem, because app is very intuitive thanks to many icons :D).


# Changelog

## [1.0.0] - 2026-04-23

### Added
- new canvas system
- new input system
- gesture support
- gesture: pinch-to-zoom
- gesture: pinch-to-pan
- new tools: move-zoom, fit-to-screen, eyedropper, palette (color-palette and color-picker)
- new settings options (change canvas size)
- move-zoom: holding CTRL switches current tool to move-zoom
- move-zoom: holding SCROLL switches current tool to move-zoom
- new 'Roboto' font
- ToolBase class - the base of tool classes
- 'code_ideas' directory for unused and experimental code ideas
- Slider class - custom slider

### Changed
- canvas has size, it's not fullscreen now
- color button was changed to current color button and now is non-interactive
- new import/export functions
- pencil: pencil now draws true 1 px line (thanks to Bresenham algorithm)
- improved code structure: division code into multiple files/modules and directories, better OOP
 
### Fixed
- shortcuts for undo/redo
- undo after changing eraser bug
- can draw on space between buttons
- canvas border (offset) bug


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
- after draw, choose eraser and do undo action, chosen is brush instead of eraser
- line's edges (round, square) depends on the latest chosen tool - brush or pencil
- after color change, line's visualization is always black