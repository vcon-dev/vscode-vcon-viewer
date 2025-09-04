# vCon Viewer for VS Code

A Visual Studio Code extension for viewing and interacting with IETF vCon (Voice Conversation) files.

## Features

- **Automatic Detection**: Automatically detects vCon files when opened
- **Rich Viewer**: Beautiful, organized view of vCon data with sections for:
  - Metadata (version, UUID, timestamps, subject)
  - Parties (participants in the conversation)
  - Dialog (conversation content, audio, text)
  - Attachments (files, documents, media)
  - Analysis (AI analysis, transcripts, sentiment)
  - Jumps (conversation flow markers)
  - Groups (participant groupings)
  - Signing (digital signatures)
  - Encryption (encryption metadata)
- **Export Options**: Export vCon data as JSON or plain text
- **Audio Support**: Play audio content directly in the viewer
- **File Validation**: Validates vCon files against IETF specification
- **VSCode Integration**: Seamless integration with VS Code's theme and UI

## Installation

1. Clone this repository
2. Run `npm install` to install dependencies
3. Run `npm run compile` to build the extension
4. Press `F5` in VS Code to launch the extension in debug mode

## Usage

### Opening a vCon File

1. Open a `.json` file that contains vCon data
2. The extension will automatically detect if it's a valid vCon file
3. Use the command palette (`Ctrl+Shift+P` / `Cmd+Shift+P`) and run "Open vCon Viewer"
4. Or right-click on the JSON file in the explorer and select "Open vCon Viewer"

### Using the Viewer

The viewer provides a comprehensive interface for exploring vCon data:

- **Metadata Section**: Shows basic vCon information like version, UUID, creation date, etc.
- **Parties Section**: Lists all participants with their contact information
- **Dialog Section**: Displays conversation content with timestamps and media
- **Attachments Section**: Shows files and documents with download options
- **Analysis Section**: Displays AI analysis, transcripts, and other processed data
- **Jumps Section**: Shows conversation flow markers and transitions
- **Groups Section**: Displays participant groupings
- **Signing Section**: Shows digital signature information
- **Encryption Section**: Displays encryption metadata

### Exporting Data

Use the export buttons in the viewer header to:
- **Export JSON**: Opens the vCon data in a new JSON editor tab
- **Export Text**: Opens a plain text version in a new text editor tab

## vCon Format Support

This extension supports the IETF vCon specification, including:

- **vCon Version**: Supports multiple vCon versions
- **Required Fields**: vcon, uuid, created
- **Optional Fields**: updated, subject, redacted
- **Arrays**: parties, dialog, attachments, analysis, jumps, group, signing, encryption

## Configuration

The extension can be configured through VS Code settings:

- `vconViewer.autoDetect`: Enable/disable automatic vCon file detection (default: true)

## Development

### Project Structure

```
vscode-vcon-viewer/
├── src/
│   ├── extension.ts          # Main extension entry point
│   ├── vconValidator.ts      # vCon validation and parsing
│   └── vconViewerProvider.ts # Webview provider for the viewer
├── media/
│   ├── reset.css            # CSS reset styles
│   ├── vscode.css           # VSCode theme variables
│   └── main.js              # Webview JavaScript
├── package.json             # Extension manifest
└── tsconfig.json           # TypeScript configuration
```

### Building

```bash
npm install
npm run compile
```

### Testing

```bash
npm run test
```

## Sample vCon File

Here's an example of a valid vCon file:

```json
{
  "vcon": "1.0",
  "uuid": "550e8400-e29b-41d4-a716-446655440000",
  "created": "2023-01-15T10:30:00Z",
  "subject": "Customer Support Call",
  "parties": [
    {
      "uuid": "550e8400-e29b-41d4-a716-446655440001",
      "name": "John Doe",
      "tel": "+1234567890",
      "email": "john@example.com"
    },
    {
      "uuid": "550e8400-e29b-41d4-a716-446655440002",
      "name": "Support Agent",
      "tel": "+0987654321"
    }
  ],
  "dialog": [
    {
      "uuid": "550e8400-e29b-41d4-a716-446655440003",
      "type": "audio",
      "start": "2023-01-15T10:30:00Z",
      "end": "2023-01-15T10:35:00Z",
      "duration": 300,
      "parties": [0, 1],
      "mimetype": "audio/wav",
      "body": "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT..."
    }
  ],
  "analysis": [
    {
      "uuid": "550e8400-e29b-41d4-a716-446655440004",
      "type": "transcript",
      "mimetype": "text/plain",
      "body": "Customer: Hi, I'm having trouble with my account.\nAgent: I'd be happy to help you with that. Can you provide your account number?\nCustomer: Sure, it's 123456789."
    }
  ]
}
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- IETF vCon Working Group for the specification
- VS Code Extension API documentation
- The open source community for inspiration and tools
