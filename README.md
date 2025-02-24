# Local-First Adaptive Learning System

A browser-based learning system that provides an adaptive, mastery-based experience using knowledge graphs and spaced repetition. All data remains in the browser, leveraging static JSON for curriculum content and IndexedDB for student progress.

## Features

- 🧠 Adaptive Learning with Knowledge Graphs
- 📚 Mastery-Based Progression
- 🔄 Spaced Repetition (Modified SM-2 with FIRe)
- 💾 Local-First Data Storage
- 📱 Responsive Design
- ⚡ Lightweight & Fast

## Project Structure

```
learning_app/
├── index.html           # Main HTML file
├── style.css           # Styles
├── main.js             # Core application logic
└── knowledge_graphs/   # Curriculum content
    └── mathematics/
        ├── index.json  # Lists subject files
        ├── arithmetic.json  # Topic definitions
        └── arithmetic/
            └── basic_fractions/
                └── lesson.json  # Lesson content
```

## Setup

1. Clone the repository
2. Due to CORS restrictions when loading local JSON files, you'll need to serve the files through a local HTTP server. Here are a few ways to do this:

   ```bash
   # Using Python 3 (recommended)
   python3 -m http.server

   # Using Python 2
   python -m SimpleHTTPServer

   # Using Node.js's http-server (requires npm install -g http-server)
   http-server
   ```

3. Open your browser and navigate to:
   - Python server: `http://localhost:8000`
   - Node http-server: `http://localhost:8080`

The application will create a default student profile on first run.

## Development

### Knowledge Graph Structure

Topics are organized in a hierarchical structure:

1. Subjects (e.g., Mathematics)
2. Topics (e.g., Arithmetic)
3. Lessons (e.g., Basic Fractions)

Each lesson includes:
- Learning objectives
- Explanation
- Worked examples
- Practice problems

### Data Storage

- **Static JSON**: Curriculum structure and content
- **IndexedDB**: Student progress and mastery states

### Adding New Content

1. Create a new directory under the appropriate subject
2. Add topic metadata to the subject's JSON file
3. Create lesson.json with content
4. (Optional) Add additional example files

## License

MIT License - See LICENSE file for details
