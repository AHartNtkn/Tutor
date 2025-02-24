# Learning App Design Document

## 1. Overview
This document provides detailed specifications for the local-first, browser-based learning app. The system implements an adaptive, mastery-driven approach using a knowledge graph, spaced repetition, and minimal external dependencies. It runs entirely offline and stores data in the browser.

---
## 2. Core Objectives
1. **Adaptive Learning Experience**
   - Provide an automated tutor-like experience, emulating best practices from "The Math Academy Way" (including mastery learning, targeted remediation, and spaced repetition).
2. **Local-Only Data**
   - All data is stored and retrieved from the local machine via IndexedDB and static JSON files—no external servers.
3. **Effective Spaced Repetition & Review**
   - Track each student's mastery state. Schedule reviews to maximize retention.
4. **Lightweight UI**
   - Use only HTML/CSS/JavaScript (plus htmx or minimal libraries) to keep dependencies small.
5. **Short Lessons**
   - Ensure lessons take less than 10 minutes.

### 2.1. Content Objectives

1. Discrete, modular lessons each covering a single core concept.  
2. Explicit, measurable learning objectives per lesson.  
3. Logical sequencing that builds on prerequisite knowledge.  
4. Worked examples that demonstrate key concepts step-by-step.  
5. Aligned practice exercises to reinforce the material.  
6. Diagnostic checkpoints to verify understanding before progression.  
7. Scaffolded content that shifts from foundational skills to advanced applications.  
8. Emphasis on both conceptual comprehension and procedural fluency.  
9. Summaries that consolidate and integrate key ideas.  
10. Clear endpoints indicating mastery and readiness for subsequent topics.

### 2.2 Modularization

What defines success for "Discrete, modular lessons each covering a single core concept"?

Success means each lesson isolates one key idea with clear objectives, focused content, and measurable outcomes. For example:

• A lesson titled “Solving Two-Step Equations” includes the definition, one worked example, and exercises only on that equation type.
• A lesson on “Identifying Equivalent Fractions” provides a clear explanation, a step-by-step example of simplifying fractions, and practice problems that target equivalence exclusively.
• A lesson called “Calculating the Area of a Triangle” covers only the area formula, a worked example using base and height, and problems solely on area computation.

Textbooks usually blend several concepts in continuous chapters. To achieve discrete, modular lessons, you’d need to:

• Segment chapters into individual core ideas.
• Rewrite introductions to focus solely on one concept.
• Extract or create targeted examples and exercises.
• Define explicit, measurable objectives per module.

An individual core idea is a fundamental, self-contained concept that can be defined, exemplified, and practiced without relying on multiple intertwined topics. To extract them from a textbook:

• Identify distinct definitions, formulas, or procedures stated as key points.
• Map the chapter’s structure to reveal subtopics that can function independently.
• Isolate sections with clear, measurable learning outcomes.
• Reframe integrated discussions into focused modules by separating examples and practice tied to one principle.

For instance, from a chapter on linear equations, "isolating the variable" qualifies as an individual core idea, as it’s defined, demonstrated, and can be practiced independently of other concepts.

A high level of granularity is paramount. Lessons should always be focused on a single core idea. Topics should be exhaustively broken down into individual core ideas.

### 2.3 Measurable Objectives

What defines success for "Explicit, measurable learning objectives per lesson"?

Success means objectives are written as clear, actionable statements using measurable verbs. For example:

• "By the end of this lesson, students will solve two-step equations with 80% accuracy on a quiz."
• "Students will identify and simplify equivalent fractions correctly in 90% of practice problems."

These objectives define success by specifying exactly what the learner must do, how many examples or problems they must complete correctly, and by what criteria their performance will be measured.

---
## 3. Data Storage & Management
### 3.1 Overview
The app uses **a hybrid approach** for data storage:
1. **Static JSON Files** for storing the *knowledge graph* structure and example sets.
2. **IndexedDB** for storing *student progress, mastery states, and dynamic data*.

This dual setup balances simplicity (easy editing of JSON) with performance (IndexedDB queries are fast and persistent).

### 3.2 Static JSON Files
Static JSON files capture the **curriculum** and **example data** in a human-editable format. They are split by subject to reduce file size and make the content more organized. In addition, each topic can reference separate files for example sets.

#### 3.2.1 Folder & File Structure
```
learning_app/
├── index.html
├── main.js
├── knowledge_graphs/
│   ├── blender/
│   │   └── ...
│   ├── physics/
│   │   └── ...
│   ├── mathematics/
│   │   ├── index.json            <-- main entry point listing subject files
│   │   ├── arithmetic.json       <-- topics & references for arithmetic
│   │   ├── arithmetic/
│   │   |   ├── single_digit_addition.json
│   │   |   ├── single_digit_addition/
│   │   |   |   ├── lesson.json
│   │   |   |   ├── question1.json
│   │   |   |   ├── question2.json
│   │   |   |   ├── question3.json
│   │   |   |   └── ...
│   |   |   ├── adding_fractions_of_equal_denominators/
│   │   │   |   ├── lesson.json
│   │   │   │   |   ├── question1.json
│   │   |   │   ├── question2.json
│   │   │   |   └── ...
│   │   │   └── ...
│   │   ├── algebra.json          <-- topics & references for algebra
│   │   ├── algebra/
│   │   │   └── ...
│   │   ├── geometry.json         <-- topics & references for geometry
│   │   ├── geometry/
│   │   │   └── ...
│   │   ├── calculus.json         <-- topics & references for calculus
│   │   ├── calculus/
│   │   │   └── ...
│   └── ...
└── ...
```
1. **`index.json`**: A root file listing all subject files to load (e.g. `["arithmetic.json", "algebra.json"]`).
2. **Subject Files**: Each file (like `arithmetic.json`) contains a `topics` array with topic metadata and prerequisites. Each topic points to a directory containing its lesson and example content.
3. **Topic Directories**: Each topic has its own directory (e.g. `arithmetic/single_digit_addition/`) containing:
   - `lesson.json`: Core lesson content and learning objectives
   - `question1.json`, `question2.json`, etc.: Individual example files with problems and solutions

#### 3.2.2 Sample Subject File
```json
{
  "topics": [
    {
      "id": "basic_fractions",
      "name": "Basic Fractions",
      "prerequisites": ["multiplication_of_whole_numbers"],
      "tags": ["fractions"],
      "content": "How to identify and represent fractions.",
      "directory": "arithmetic/basic_fractions"
    },
    {
      "id": "adding_fractions_of_equal_denominators",
      "name": "Adding Fractions of Equal Denominators",
      "prerequisites": ["basic_fractions", "adding_whole_numbers"],
      "tags": ["fractions"],
      "content": "Adding fractions with common denominators.",
      "directory": "arithmetic/adding_fractions_of_equal_denominators"
    }
  ]
}
```

#### 3.2.3 Sample Examples File
```json
{
  "examples": [
    {
      "id": "example_1",
      "problem": "1/4 + 2/4 = ?",
      "solution": "3/4",
      "explanation": "The denominators are the same, and so the fractions can be added by adding their numerators. Those are 1 and 2, and 1 + 2 = 3. By using the same denominator, and this sum as the numerator, we have our answer as 3/4"
    },
    {
      "id": "example_2",
      "problem": "2/5 + 3/5 = ?",
      "solution": "1",
      "explanation": "..."
    },
    ...
  ]
}
```

#### 3.2.4 Loading Process
1. On first run, the app checks if IndexedDB’s `knowledge_graph` store is empty.
2. If empty, it **fetches `index.json`** and iterates each subject file.
3. For each subject file, it loads `topics` into IndexedDB.
4. Example sets remain in JSON until needed; the system fetches them on demand.

### 3.3 IndexedDB for Dynamic Data
**IndexedDB** stores:
- **Progress Data**: Student ID, name, enrollment date, and per-topic progress including:
  - Interval (days until next review)
  - Ease factor
  - Number of successful reviews (reps)
  - Last review date
  - Next review date
  - Last example shown

#### 3.3.1 Data Model in IndexedDB
- **`students` store** (keyPath: `id`):
  ```json
  {
    "id": "student_1",
    "name": "Alice",
    "enrolled": "2025-02-17",
    "progress": {
      "basic_fractions": {
        "interval": 16,  // Days until next review
        "ease": 2.5,     // Current ease factor
        "reps": 4,       // Number of successful reviews
        "last_review": "2025-02-10",
        "next_review": "2025-02-26",
        "last_example": "example_1"
      },
      "adding_fractions_of_equal_denominators": {
        "interval": 8,
        "ease": 2.1,
        "reps": 2,
        "last_review": "2025-02-10", 
        "next_review": "2025-02-18",
        "last_example": "example_2"
      },
      ...
    },
    ...
  }
  ```
- **`knowledge_graph` store** (keyPath: `id`): topics loaded from JSON subject files. Example sets remain external but can be cached.


---
## 4. UI Design
### 4.1 Home Page Layout
1. **Top Bar** (horizontal, full width):
   - **Basic User Info:** name, optional avatar.
   - **Import/Export Buttons:**
     - Import local JSON of progress.
     - Export current progress to JSON.
2. **Left Third**:
   - **Progress Overview**: A static percentage of topics completed under each relevant tag (e.g., "Algebra: 40%, Geometry: 55%").
   - No clickthrough or expansion.
3. **Right Two-Thirds** (vertical stacking):
   - **Pending Reviews and Lessons mixed together**:
     - Lists up to **25 review tasks**. If 25 or more tasks are due, **no next lessons** are shown.
     - Each review task is clickable, leading to a review page or modal.
   - **Next Lessons (muxed with reviews)**:
     - Selected from the "mastery frontier" acording to divisity weighting.
     - Each lesson is clickable, leading to a lesson view.

### 4.2 Lesson Structure
A lesson is split into three distinct segments:
1. **Step 1: Explanation**
   - A short text (~1 screen) with embedded MathJax for LaTeX.
   - No scrolling if possible. If content is bigger, break it up.
2. **Step 2: Worked Example**
   - An example problem. Possibly includes step-by-step math or diagrams rendered with MathJax.
   - No user interaction in MVP.
3. **Step 3: Practice Problems (Around 8 for most skills)**
   - Multiple-choice for MVP.
   - Each problem has 4–5 options and a single correct choice.
   - The "Next" button is grayed out until the student selects an answer.
   - After each problem is answered, the system shows correctness, possibly a short explanation.
   - Once all are done, the lesson is marked complete.

**Returning to Home:** After finishing the last problem, the student returns automatically to the home page. Incomplete lessons are not stored in IndexedDB—if the student leaves mid-lesson, it’s treated as never started.

### 4.3 Review Mode
- **Accessed by clicking a pending review** on the home page.
- Typically 1–2 question prompts (multiple-choice).
- On an **incorrect answer**, the system immediately issues a remedial review or flags the topic for extra reviews.
- Additional logic checks if the student has repeated failures, in which case the system schedules prerequisite reviews.

---
## 5. Review System

The core algorithm is a version of SM-2 augmented with FIRe (Fractional Implicit Repetition). What this means is that topics in the knowledge graph may rely on eachother. Reviewing one topic will implicitly count as a partial review of the prerequisite topics. Additionally, failing at a topic review may trigger a review of the prerequisite topics.

### 5.1 Rough Algorithm

```python
# Constants
DEFAULT_EASE = 2.5
MIN_EASE = 1.3
MAX_EASE = 3.5
TARGET_RECALL = 0.90
EASY_BONUS = 1.3
HARD_MULTIPLIER = 1.2
LAPSE_FACTOR = 0.5
IMPLICIT_FRACTION = 0.5   # Fraction of a full review credit for each encompassed topic
MAX_DELAY_FACTOR = 2.0

# Assume today_date() returns the current date as a float (in days)
def today_date():
    return current_time_in_days()

# Update schedule for a directly reviewed topic based on grade.
def update_topic_schedule(topic, grade, delay_factor):
    # If the topic has been reviewed before, use its interval; else, default to 1 day.
    base_interval = topic.interval if topic.interval is not None else 1
    if grade == 'again':
        # Failure: reduce ease slightly and reset reps.
        topic.ease = max(MIN_EASE, topic.ease - 0.20)
        topic.reps = 0
        new_interval = max(1, int(base_interval * LAPSE_FACTOR))
    elif grade == 'hard':
        topic.reps += 1
        topic.ease = max(MIN_EASE, topic.ease - 0.15)
        new_interval = base_interval * HARD_MULTIPLIER
    elif grade == 'good':
        topic.reps += 1
        # No change to ease.
        new_interval = base_interval * topic.ease
    elif grade == 'easy':
        topic.reps += 1
        topic.ease = min(MAX_EASE, topic.ease + 0.15)
        new_interval = base_interval * topic.ease * EASY_BONUS
    # Apply delay factor (for overdue reviews) but cap it.
    new_interval *= min(delay_factor, MAX_DELAY_FACTOR)
    topic.interval = max(1, int(round(new_interval)))
    topic.last_review = today_date()
    topic.next_review = today_date() + topic.interval
    return

# Compute delay factor from expected vs. actual review time.
def compute_delay_factor(topic):
    if topic.last_review is None or topic.interval is None:
        return 1.0
    elapsed = today_date() - topic.last_review
    return elapsed / topic.interval

# Primary function: record a review of a topic.
def record_review(topic, grade):
    delay_factor = compute_delay_factor(topic)
    update_topic_schedule(topic, grade, delay_factor)
    return

# FIRe: When an advanced topic is reviewed, update its own schedule and also update all encompassed topics fractionally.
def record_advanced_review(advanced_topic, grade):
    # First, update the advanced topic as a full review.
    record_review(advanced_topic, grade)
    
    # Now, for each lower-level (encompassed) topic, update it fractionally.
    for lower_topic in advanced_topic.encompassed_topics:
        # Compute the delay factor for the lower-level topic separately.
        lower_delay = compute_delay_factor(lower_topic)
        # Determine an "implicit grade": if the advanced review was successful (grade in ['good','easy']),
        # then assume a fractional success; if not, apply a fractional penalty.
        if grade in ['good', 'easy']:
            implicit_grade = 'good'
            fraction = IMPLICIT_FRACTION  # e.g. 50% credit
        else:
            implicit_grade = 'again'
            fraction = IMPLICIT_FRACTION
        
        # Instead of a full update, blend the lower topic's state with a fractional update.
        # Calculate a "delta" update as if the lower topic were fully reviewed.
        original_interval = lower_topic.interval if lower_topic.interval is not None else 1
        temp_topic = Topic(lower_topic.topic_id, lower_topic.ease)
        temp_topic.interval = original_interval
        temp_topic.reps = lower_topic.reps
        temp_topic.last_review = lower_topic.last_review
        
        # Simulate a full review on the temporary topic.
        update_topic_schedule(temp_topic, implicit_grade, lower_delay)
        
        # Now, apply only a fraction of that change to the lower topic.
        # For example, a linear blend: new_state = (1 - fraction) * old_state + fraction * temp_state.
        lower_topic.interval = int(round((1 - fraction) * original_interval + fraction * temp_topic.interval))
        lower_topic.ease = (1 - fraction) * lower_topic.ease + fraction * temp_topic.ease
        lower_topic.last_review = today_date()  # Implicit review updates timestamp.
        lower_topic.next_review = today_date() + lower_topic.interval
        # Optionally, adjust reps similarly (e.g., add a fractional count)
        lower_topic.reps = int(round((1 - fraction) * lower_topic.reps + fraction * temp_topic.reps))
    return

# A simple Topic class for context.
class Topic:
    def __init__(self, topic_id, ease):
        self.topic_id = topic_id
        self.ease = ease
        self.interval = None
        self.last_review = None
        self.next_review = None
        self.reps = 0
        self.encompassed_topics = []  # List of lower-level Topic objects
```

### 5.2 Interleaved Lessons & Reviews

Lessons are reccomended automatically from the "mastery frontier". These are topics that the student won't need to review again for a while. The topics are suggested based on how related they are in the knowledge graph to what the student is currently learning. Things least related to the student's current topic are suggested first. This is to maximize Non-Interference Learning.

Similarly, reviews are interleaved by topic. That is, reviews will be on different topics, organized to maximize diversity and minimize relatedness among what's being reviewed. This prevents the student from falling into a rythm of solving the same types of problems over and over again. This is called "Interleaved Repetition".

Generally speaking, two lessons are considered very related if they are close in the graph (e.g. they share a prerequisite). They are also considered related if they share tags or belong to the same topic. These are used to create a relatedness score which is used to sort new lessons and reviews when creating the reccomendations list.


---
## 6. Additional Implementation Details
### 6.1 Maximum Lesson/Review Slots
- The system enforces **25 total "cards"** on the home page (where each card is either a review or a next lesson item).
  - If 25 or more reviews exist, 0 next lessons are shown.
  - If fewer than 25 reviews exist, next lessons fill up to 25 total.

### 6.2 Session Flow
1. **Load Home** → View progress, reviews, next lessons.
2. **Pick a Review** → Possibly fail → triggers immediate remediation.
3. **Pick a Lesson** → Explanation → Example → 8 Problems → Mark complete.
4. **Finish** → Return to home.

### 6.3 Import/Export
- **Buttons in the Top Bar**: "Import Progress" and "Export Progress".
- **JSON-based**: The progress is serialized to a JSON file containing the student’s mastery states, schedule, XP.
- **No reset**: If the user wants to start over, they manually import a blank state or use the dev tools to clear IndexedDB.

### 6.4 Spaced Repetition Algorithm (Advanced Notes)
- Currently, the system schedules a **new review** for a topic X days after success based on a modified SM-2 algorithm.
- Each topic’s difficulty can accelerate or slow the interval.
- For **predictive remediation**, the system calculates average "time spent" or "fail rate" for that topic across all lessons; if above a threshold, it boosts prerequisite reviews.

---
## 7. Future Considerations (Post-MVP)
1. **Interactive Elements**
   - Beyond multiple choice: free text input with partial-credit recognition, drag-and-drop, dynamic hints.
2. **Graphical Knowledge Graph**
   - For advanced debugging or teacher usage: display node/edge relationships.
3. **Better Spacing Algorithm**
   - Replace SM-2 with FSRS-5 (Free Spaced Repetition Scheduler) 
