# Local-First Adaptive Learning Application PRD

## 1. Overview
A local-first, browser-based learning system providing an adaptive, mastery-based experience using knowledge graphs, spaced repetition (via a modified SM-2 algorithm with FIRe), and fully offline operation. All data remains in the browser, leveraging static JSON for curriculum content and IndexedDB for student progress. The system emulates best practices from "The Math Academy Way" (mastery learning, targeted remediation, spaced repetition), ensuring short lessons under 10 minutes each.

---

## 2. Core Objectives

1. **Adaptive Learning Experience**  
   Automated tutor-like approach with mastery learning, spaced repetition, and targeted remediation.
2. **Local-Only Data**  
   All data stored in IndexedDB and static JSON files, no external servers.
3. **Effective Spaced Repetition & Review**  
   Track mastery state, schedule reviews at optimal intervals.
4. **Lightweight UI**  
   Minimal dependencies. HTML/CSS/JavaScript (plus optional HTMX or libraries), offline capability.
5. **Short Lessons**  
   Each lesson < 10 minutes.

### 2.1 Content Objectives
1. Discrete, modular lessons covering single core concepts.  
2. Explicit, measurable learning objectives per lesson.  
3. Logical sequencing, enforcing prerequisite knowledge.  
4. Worked examples with step-by-step demonstrations.  
5. Aligned practice exercises for immediate reinforcement.  
6. Diagnostic checkpoints to verify understanding.  
7. Scaffolded progression from foundational to advanced.  
8. Balanced emphasis on conceptual understanding and procedural fluency.  
9. Summaries that integrate and consolidate key ideas.  
10. Clear endpoints indicating mastery and readiness for new topics.

#### 2.1.1 Modularization
- Each lesson focuses on only one core idea.
- Textbook chapters are split into smaller modules, each with a single definable concept, example(s), and practice problems.

#### 2.1.2 Measurable Objectives
- Use specific, observable verbs (e.g., “solve,” “identify,” “simplify”) and attach concrete performance criteria (e.g., 80% accuracy).

---

## 3. Data Storage & Management

### 3.1 Storage Approach
- **Static JSON Files**: Human-editable format for curriculum structure, lessons, and example sets.  
- **IndexedDB**: Stores student progress (mastery states, review intervals, etc.).

### 3.2 Static JSON Files
- **Folder Structure** divides content by subject. Each topic has a dedicated folder containing `lesson.json` and individual `exampleX.json` files.  
- A root `index.json` lists which subject files to load.  
- Each subject file (e.g., `arithmetic.json`) references an array of topic objects (`id`, `directory`, `prerequisites`, etc.).

### 3.3 IndexedDB
- **`students` store**: Holds each student’s ID, name, and a `progress` object keyed by topic ID (interval, ease, last review date, etc.).
- **`knowledge_graph` store**: Retains the loaded topics from the static JSON (IDs, names, prerequisites). Examples remain in separate JSON but can be cached if needed.

---

## 4. UI Design

### 4.1 Home Page
- **Top Bar**:
  - Student info and Import/Export buttons for local JSON progress.
- **Left Panel**:
  - Static progress overview by subject/tag (e.g., “Arithmetic: 40%”).
- **Right Panel**:
  - Up to 25 total “cards” combining pending reviews and next lessons. If 25+ reviews are due, no new lessons appear.
  - Each item is clickable, launching either a review or a lesson.

### 4.2 Lesson Workflow
1. **Step 1: Explanation**  
   Short text or diagrams. MathJax for notation.
2. **Step 2: Worked Example**  
   A step-by-step demonstration. 
3. **Step 3: Practice Problems (~8)**  
   Multiple-choice. Immediate correctness feedback.  
   After the final problem, the lesson is marked complete and the user returns to Home. No partial progress is saved if they exit early.

### 4.3 Review Mode
- 1–2 questions per review, spaced repetition schedule from the student’s mastery state.
- If the student fails, immediate remediation or triggered prerequisite reviews.  
- Reviews are interleaved across diverse topics to prevent repetitive pattern-solving.

---

## 5. Review System

### 5.1 SM-2 with FIRe
A modified SM-2 that:
- Adjusts intervals and ease factors based on performance (“again,” “hard,” “good,” “easy”).  
- Includes fractional implicit reviews (FIRe). For advanced-topic reviews, a portion of the credit applies to prerequisite topics, updating their intervals and ease factors fractionally.

### 5.2 Interleaved Lessons & Reviews
- The system recommends new lessons from the “mastery frontier” — topics whose prerequisites are sufficiently mastered.
- Reviews and lessons are sorted to avoid clustering similar content, maximizing “Non-Interference Learning” and “Interleaved Repetition.”

---

## 6. Additional Implementation Details

1. **Maximum 25 Home Slots**  
   - If ≥25 reviews due, no new lessons are shown.  
   - Otherwise fill the rest with next lessons.
2. **Session Flow**  
   1. Home → user sees progress and recommended reviews/lessons.  
   2. Student chooses a review → immediate feedback.  
   3. Student chooses a lesson → explanation → worked example → practice problems → completion → home.  
3. **Import/Export**  
   - Buttons for progress JSON.  
   - No built-in “reset”; user can clear IndexedDB or import a blank file if desired.
4. **Predictive Remediation**  
   - If repeated failures occur, the system schedules additional prerequisite reviews.

---

## 7. Consolidated Minimal File Structure

```plaintext
learning_app/
├── index.html
├── style.css
├── main.js
├── knowledge_graphs/
│   ├── mathematics/
│   │   ├── index.json
│   │   ├── arithmetic.json
│   │   └── arithmetic/
│   │       └── basic_fractions/
│   │           ├── lesson.json
│   │           └── example1.json
```

### 7.1 `index.html`
- Loads the CSS, MathJax, optional HTMX, and `main.js`.  
- Basic layout with top bar (student info, import/export) and two panels (progress + cards).

### 7.2 `style.css`
- Minimal styling for body, header, left/right panels, and basic layout.

### 7.3 `main.js`
- Handles:
  - IndexedDB initialization.
  - Loading static JSON into the knowledge graph store on first run.
  - Displaying a simple home screen with up to 25 cards (reviews/lessons).
  - Stubs for “doReview” and “doLesson” calls.
  - Import/export functionality for the `students` store.

### 7.4 `knowledge_graphs/mathematics/index.json`
- Array referencing subject files, e.g. `["arithmetic.json"]`.

### 7.5 `knowledge_graphs/mathematics/arithmetic.json`
- Lists topics, each with `id`, `name`, `directory`, prerequisites, etc.

### 7.6 `knowledge_graphs/mathematics/arithmetic/basic_fractions/lesson.json`
- One lesson object with title, objectives, explanation, worked example, and a list of 8 (or fewer) practice problems.

### 7.7 `knowledge_graphs/mathematics/arithmetic/basic_fractions/example1.json`
- Optional extra examples, each with problem text, solution, and explanation.
