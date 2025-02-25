The idea is that some problems use an interactable instead of a list of options. Ideally, these should be implemented in pure html and javascript using either interctable canvas or SVGs which are manipulated by the javascript live. Some tasks may be simple enough to be implemented with custom forms (for example, an interface that's just a text input and a live text update to provide feedback). This should mean that each app is a single html file, and a js file that is loaded when the problem is loaded.

The applications should live inside the knowledge graphs in a folder called "apps" next to the main index.json file.

The apps need to be embedable into a page, and should require json input, provided by the quiz question, to get the specific scenario being tested.

The apps should be sandboxes, where the user is tasked to put the app into a specific state, and this state should make a signal which indicates a correct answer; the same as if "submit answer" were pressed.

For sandbox-style interactables that don't have a clear "wrong answer" analog (like manipulating a 3D object or constructing a graph), there should be a "give up" button, allowing the user to move on, counting as a wrong answer/"again" grade. For quiz-style interactables that already provide feedback for wrong answers (like multiple-choice quizzes), no "give up" button is needed.