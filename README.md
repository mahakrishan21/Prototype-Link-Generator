# Figma Prototype Link Generator Plugin

A Figma plugin that generates prototype links for selected frames with Fit Width preview setting. The plugin provides a clean UI for generating, copying, and managing prototype links with comprehensive error handling.

## Features

### Core Functionality
- **Generate Prototype Links**: Creates prototype links for selected frames with `scaling=contain` (Fit Width)
- **Copy All Links**: One-click copying of all generated links to clipboard
- **Clear/Retry**: Clear results and regenerate links from new selection
- **Deduplication**: Automatically removes duplicate frames from selection
- **Parent Frame Detection**: Automatically finds parent frames for non-frame selections

### Error Handling
- **No Selection**: Clear message when no frames are selected
- **Invalid Selection**: Handles non-frame selections with helpful error messages
- **Empty Results**: Graceful handling when no valid frames are found
- **Clipboard Issues**: Fallback to text selection when clipboard API fails
- **File Key Missing**: Handles rare cases where file key is unavailable

### User Experience
- **Status Updates**: Real-time feedback during link generation
- **Loading States**: Visual indicators during processing
- **Responsive UI**: Clean, modern interface that fits Figma's design
- **Link Counter**: Shows number of generated links
- **Monospace Font**: Easy-to-read link display

## Installation

### Method 1: Development Installation
1. Download or clone this repository
2. Open Figma Desktop App
3. Go to `Plugins` → `Development` → `Import plugin from manifest...`
4. Select the `manifest.json` file from this directory
5. The plugin will appear in your plugins list

### Method 2: Manual Installation
1. Copy all files to a local directory
2. Follow Method 1 steps 2-5

## Usage

### Basic Workflow
1. **Select Frames**: Select one or more frames in your Figma file
2. **Open Plugin**: Go to `Plugins` → `Development` → `Prototype Link Generator`
3. **Generate Links**: Click "Generate Links" button
4. **Copy Links**: Use "Copy All" to copy all links to clipboard
5. **Clear/Retry**: Use "Clear" to start over with a new selection

### Supported Selections
- **Direct Frame Selection**: Select frames directly
- **Nested Selections**: Select elements inside frames (plugin finds parent frame)
- **Mixed Selections**: Combine frames and frame children
- **Duplicate Handling**: Same frame selected multiple times (automatically deduplicated)

### Link Format
Generated links follow this format:
```
https://www.figma.com/proto/<fileKey>?node-id=<nodeId>&scaling=contain&starting-point-node-id=<nodeId>
```

- `scaling=contain` ensures Fit Width preview setting
- Each frame gets a unique link based on its node ID

## User Flows

### Happy Path
1. User selects frames → clicks Generate Links → links appear → user copies them

### No Selection
- Shows: "No frames selected. Please select one or more frames."

### Wrong Node Selected
- Plugin auto-detects parent frame and generates link
- If no parent frame: "Selected node is not inside a frame."

### Duplicate Selection
- Plugin automatically removes duplicates before generating

### Large Selection (50-100+ frames)
- Plugin handles large selections efficiently
- Textarea scrolls to accommodate all links

### Reselect Frames
- User changes selection → clicks "Clear" → selects new frames → clicks "Generate Links"

## Error Cases

### Invalid Node Types
- **Message**: "Only frames are supported. Please reselect."
- **Cause**: Selected only groups/shapes with no parent frame

### Empty Results
- **Message**: "No valid frames found in selection."
- **Cause**: After filtering, no valid frames remain

### Clipboard Permission Issues
- **Fallback**: Selects all text in textarea for manual copying
- **Message**: "Text selected - press Ctrl+C (Cmd+C) to copy"

### File Key Missing
- **Message**: "Could not generate prototype link. Please try reopening the file."
- **Cause**: Rare case where `figma.fileKey` is unavailable

## Technical Details

### File Structure
```
ProtoLinks/
├── manifest.json    # Plugin configuration
├── code.js         # Main plugin logic
├── ui.html         # Plugin UI
└── README.md       # This file
```

### Key Functions
- `processSelection()`: Handles frame detection and deduplication
- `findParentFrame()`: Walks up node hierarchy to find parent frame
- `generatePrototypeLink()`: Creates prototype link with proper formatting
- `handleGenerateLinks()`: Main orchestration function

### Browser Compatibility
- Uses modern JavaScript features (ES6+)
- Clipboard API with fallback for older browsers
- CSS Grid and Flexbox for layout

## Troubleshooting

### Plugin Won't Load
- Ensure all files are in the same directory
- Check that `manifest.json` is valid JSON
- Try refreshing Figma and reimporting

### Links Not Generating
- Verify frames are selected (not just groups or shapes)
- Check that the file has been saved (file key required)
- Try selecting frames directly instead of nested elements

### Copy Not Working
- Use the fallback: text will be selected automatically
- Manually copy with Ctrl+C (Cmd+C on Mac)
- Check browser clipboard permissions

### Performance Issues
- For very large selections (100+ frames), generation may take a moment
- Consider selecting fewer frames at once for better performance

## Development

### Local Development
1. Make changes to `code.js` or `ui.html`
2. In Figma, go to `Plugins` → `Development` → `Prototype Link Generator`
3. Click the refresh icon to reload the plugin
4. Test your changes

### Debugging
- Open browser dev tools (F12) when plugin UI is open
- Check console for error messages
- Use `console.log()` statements in `code.js` for debugging

## License

This project is licensed under the [MIT License](LICENSE).

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the error messages in the plugin UI
3. Check the browser console for detailed error information
