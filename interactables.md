# Interactables Interface Documentation

## Overview
Interactables are embeddable interactive applications that replace simple multiple-choice questions with engaging, interactive exercises. They provide a sandboxed environment where users manipulate state to demonstrate mastery.

## Implementation Requirements
1. **Technology**: Implement using pure HTML and JavaScript with interactive canvas or SVGs
2. **File Structure**: Single self-contained HTML file with inline JavaScript
3. **Location**: Store in the `knowledge_graphs/apps/` directory
4. **Embedding**: Must be iframe-compatible and communicate with the parent page

## Communication Protocol
Interactables use the `window.postMessage()` API to communicate with the parent page:

1. **Ready Signal**:
   ```javascript
   window.parent.postMessage({ type: 'ready' }, '*');
   ```

2. **Initialization**:
   The parent page sends configuration data after receiving the ready signal:
   ```javascript
   // Parent sends:
   iframe.contentWindow.postMessage({
       type: 'initialize',
       data: problemData
   }, '*');
   ```

3. **Answer Submission**:
   When a user submits an answer, the interactable reports the result:
   ```javascript
   window.parent.postMessage({
       type: 'answerSubmitted',
       isCorrect: true|false
   }, '*');
   ```

4. **Resize Handling**:
   When content changes size, notify the parent to adjust iframe height:
   ```javascript
   window.parent.postMessage({
       type: 'resize',
       height: document.documentElement.scrollHeight
   }, '*');
   ```

## Data Format
Each interactable should accept a JSON configuration object that defines:
- Question content/scenario
- Correct answer criteria
- Any feedback or explanations
- Required assets or resources

## UI Requirements
- Provide clear instructions on what the user needs to do
- For sandbox-style interactables without clear wrong answers, include a "give up" button
- For quiz-style interactables with defined wrong answers, provide appropriate feedback
- Match the application's visual style and theme

## Implementation Example
See `knowledge_graphs/apps/multi_choice_quiz.html` for a reference implementation.

## Creating New Interactables
1. Create a new HTML file in the `knowledge_graphs/apps/` directory
2. Implement the communication protocol
3. Create a class to encapsulate interactable functionality
4. Handle initialization, user interaction, and result submission
5. Add appropriate styling to match the application theme