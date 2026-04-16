# Testing the vCon Viewer Extension

## Installation Steps

1. **Install the extension locally:**
   ```bash
   code --install-extension vcon-viewer-0.0.1.vsix
   ```

2. **Or install from VS Code:**
   - Open VS Code
   - Go to Extensions (Ctrl+Shift+X / Cmd+Shift+X)
   - Click the "..." menu and select "Install from VSIX..."
   - Choose the `vcon-viewer-0.0.1.vsix` file

## Testing Steps

1. **Open a vCon file:**
   - Open the `sample.vcon.json` file in VS Code
   - The extension should automatically detect it as a vCon file

2. **Open the vCon Viewer:**
   - Use Command Palette (Ctrl+Shift+P / Cmd+Shift+P)
   - Type "Open vCon Viewer" and select it
   - Or right-click on the JSON file and select "Open vCon Viewer"

3. **Verify functionality:**
   - Check that the viewer displays all vCon sections
   - Test the export functionality (JSON and Text)
   - Verify that the viewer integrates with VS Code's theme

## Expected Behavior

- Automatic detection of vCon files
- Rich viewer interface showing all vCon data
- Export functionality working
- Proper VS Code theme integration
- No console errors

## Troubleshooting

If the extension doesn't work:
1. Check the Developer Console (Help > Toggle Developer Tools)
2. Look for any error messages
3. Verify the extension is activated in the Extensions panel
4. Check that the vCon file is valid JSON
