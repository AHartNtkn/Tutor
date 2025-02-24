// Constants
const DB_NAME = 'learning_system';
const DB_VERSION = 1;
const STORES = {
    STUDENTS: 'students',
    KNOWLEDGE_GRAPH: 'knowledge_graph'
};

// Default ease factors and intervals
const DEFAULT_EASE = 2.5;
const MIN_EASE = 1.3;
const MAX_EASE = 3.5;
const IMPLICIT_FRACTION = 0.5;

// IndexedDB setup
class Database {
    static db = null;
    static isInitialized = false;

    static async init() {
        console.log('Starting Database initialization...');
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, DB_VERSION);

            request.onerror = () => {
                console.error('Database initialization error:', request.error);
                reject(request.error);
            };
            
            request.onsuccess = () => {
                Database.db = request.result;
                Database.isInitialized = true;
                console.log('Database initialized successfully');
                resolve(Database.db);
            };

            request.onupgradeneeded = (event) => {
                console.log('Database upgrade needed, creating stores...');
                const db = event.target.result;

                // Create students store
                if (!db.objectStoreNames.contains(STORES.STUDENTS)) {
                    db.createObjectStore(STORES.STUDENTS, { keyPath: 'id' });
                    console.log('Created students store');
                }

                // Create knowledge graph store
                if (!db.objectStoreNames.contains(STORES.KNOWLEDGE_GRAPH)) {
                    db.createObjectStore(STORES.KNOWLEDGE_GRAPH, { keyPath: 'id' });
                    console.log('Created knowledge graph store');
                }
            };
        });
    }

    static async getStudent(id) {
        return await Database.performTransaction(STORES.STUDENTS, 'readonly', store => store.get(id));
    }

    static async saveStudent(student) {
        return await Database.performTransaction(STORES.STUDENTS, 'readwrite', store => store.put(student));
    }

    static async performTransaction(storeName, mode, operation) {
        if (!Database.isInitialized || !Database.db) {
            console.error('Attempting to perform transaction before database is initialized');
            throw new Error('Database not initialized');
        }

        return new Promise((resolve, reject) => {
            const transaction = Database.db.transaction(storeName, mode);
            const store = transaction.objectStore(storeName);

            try {
                const request = operation(store);
                
                // Add specific handlers for the request
                if (request && typeof request.then !== 'function') {
                    request.onerror = () => {
                        console.error(`Store operation failed for ${storeName}:`, request.error);
                        reject(request.error);
                    };
                    request.onsuccess = () => resolve(request.result);
                }

                transaction.oncomplete = () => {
                    if (request && typeof request.then !== 'function') {
                        resolve(request.result);
                    } else {
                        resolve(request);
                    }
                };
                
                transaction.onerror = () => {
                    console.error(`Transaction failed for ${storeName}:`, transaction.error);
                    reject(transaction.error);
                };
            } catch (error) {
                console.error(`Error in transaction for ${storeName}:`, error);
                reject(error);
            }
        });
    }
}

// Content loading
class ContentLoader {
    static async loadLesson(topicId) {
        try {
            // First find which knowledge graph contains this topic
            const indexResponse = await fetch('knowledge_graphs/index.json');
            if (!indexResponse.ok) throw new Error('Failed to load index');
            const indexData = await indexResponse.json();
            
            // Search through each knowledge graph
            for (const graph of indexData.knowledge_graphs) {
                // Load the graph's index
                const graphIndexResponse = await fetch(`knowledge_graphs/${graph.id}/index.json`);
                if (!graphIndexResponse.ok) continue;
                const graphIndexData = await graphIndexResponse.json();
                
                // Search through each subject in the graph
                for (const subject of graphIndexData.subjects) {
                    const subjectResponse = await fetch(`knowledge_graphs/${graph.id}/${subject}`);
                    if (!subjectResponse.ok) continue;
                    const subjectData = await subjectResponse.json();
                    
                    const topic = subjectData.topics.find(t => t.id === topicId);
                    if (topic) {
                        // Load the lesson file directly from the topic's directory
                        const response = await fetch(`knowledge_graphs/${graph.id}/${topic.directory}.json`);
                        if (!response.ok) throw new Error('Failed to load lesson');
                        return await response.json();
                    }
                }
            }
            throw new Error('Topic not found');
        } catch (error) {
            console.error('Error loading lesson:', error);
            throw error;
        }
    }

    static async loadTopic(topicId) {
        try {
            // First find which knowledge graph contains this topic
            const indexResponse = await fetch('knowledge_graphs/index.json');
            if (!indexResponse.ok) throw new Error('Failed to load index');
            const indexData = await indexResponse.json();
            
            // Search through each knowledge graph
            for (const graph of indexData.knowledge_graphs) {
                // Load the graph's index
                const graphIndexResponse = await fetch(`knowledge_graphs/${graph.id}/index.json`);
                if (!graphIndexResponse.ok) continue;
                const graphIndexData = await graphIndexResponse.json();
                
                // Search through each subject in the graph
                for (const subject of graphIndexData.subjects) {
                    const subjectResponse = await fetch(`knowledge_graphs/${graph.id}/${subject}`);
                    if (!subjectResponse.ok) continue;
                    const subjectData = await subjectResponse.json();
                    
                    const topic = subjectData.topics.find(t => t.id === topicId);
                    if (topic) {
                        return topic;
                    }
                }
            }
            throw new Error('Topic not found');
        } catch (error) {
            console.error('Error loading topic:', error);
            throw error;
        }
    }
}

// Progress Details Manager
class ProgressDetailsManager {
    constructor() {
        this.view = document.getElementById('progress-details-view');
        this.searchInput = this.view.querySelector('#progress-search');
        this.filterSelect = this.view.querySelector('#progress-filter');
        this.detailsList = this.view.querySelector('.progress-details-list');
        this.viewTitle = this.view.querySelector('.view-title');
        this.currentKnowledgeGraph = null;
        this.currentSubject = null;
        this.topics = [];
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.view.querySelector('.back-button').addEventListener('click', () => {
            if (this.currentSubject) {
                this.showSubjects();
            } else {
                this.exit();
            }
        });
        this.searchInput.addEventListener('input', () => this.updateList());
        this.filterSelect.addEventListener('change', () => this.updateList());
        
        // Add click handler for subjects
        this.detailsList.addEventListener('click', (e) => {
            const item = e.target.closest('.progress-detail-item');
            if (item && !this.currentSubject) {
                const subjectId = item.dataset.subjectId;
                if (subjectId) {
                    this.showLessonsForSubject(subjectId);
                }
            }
        });
    }

    async start(knowledgeGraphId) {
        try {
            // First load the graph's index
            const indexResponse = await fetch(`knowledge_graphs/${knowledgeGraphId}/index.json`);
            if (!indexResponse.ok) throw new Error('Failed to load graph index');
            const indexData = await indexResponse.json();
            
            this.currentKnowledgeGraph = knowledgeGraphId;
            this.currentSubject = null;
            
            // Show progress details view
            document.querySelector('.content-panel').classList.add('hidden');
            this.view.classList.remove('hidden');

            // Set title and show subjects
            this.viewTitle.textContent = `${knowledgeGraphId.charAt(0).toUpperCase() + knowledgeGraphId.slice(1)} Progress`;
            await this.showSubjects();
        } catch (error) {
            console.error('Failed to load progress details:', error);
            alert('Failed to load progress details. Please try again.');
        }
    }

    async showSubjects() {
        this.currentSubject = null;
        this.viewTitle.textContent = `${this.currentKnowledgeGraph.charAt(0).toUpperCase() + this.currentKnowledgeGraph.slice(1)} Progress`;
        
        try {
            const indexResponse = await fetch(`knowledge_graphs/${this.currentKnowledgeGraph}/index.json`);
            if (!indexResponse.ok) throw new Error('Failed to load graph index');
            const indexData = await indexResponse.json();
            
            // Load all subjects
            const subjects = [];
            for (const subject of indexData.subjects) {
                const subjectResponse = await fetch(`knowledge_graphs/${this.currentKnowledgeGraph}/${subject}`);
                if (!subjectResponse.ok) continue;
                const subjectData = await subjectResponse.json();
                subjects.push({
                    id: subject.replace('.json', ''),
                    name: subject.replace('.json', '').charAt(0).toUpperCase() + subject.replace('.json', '').slice(1),
                    topics: subjectData.topics
                });
            }
            
            this.updateSubjectsList(subjects);
        } catch (error) {
            console.error('Failed to load subjects:', error);
            this.detailsList.innerHTML = '<p class="error">Failed to load subjects. Please try again.</p>';
        }
    }

    async showLessonsForSubject(subjectId) {
        try {
            const response = await fetch(`knowledge_graphs/${this.currentKnowledgeGraph}/${subjectId}.json`);
            if (!response.ok) throw new Error('Failed to load subject');
            const data = await response.json();
            
            this.currentSubject = {
                id: subjectId,
                name: subjectId.charAt(0).toUpperCase() + subjectId.slice(1),
                topics: data.topics
            };
            
            this.viewTitle.textContent = `${this.currentSubject.name} Progress`;
            this.updateList();
        } catch (error) {
            console.error('Failed to load subject:', error);
            alert('Failed to load subject details. Please try again.');
        }
    }

    updateList() {
        if (this.currentSubject) {
            this.updateLessonsList();
        } else {
            this.updateSubjectsList();
        }
    }

    updateSubjectsList(subjects) {
        const searchTerm = this.searchInput.value.toLowerCase();
        const filterValue = this.filterSelect.value;
        const studentProgress = UI.currentStudent.progress;

        // Clear current list
        this.detailsList.innerHTML = '';

        subjects
            .filter(subject => subject.name.toLowerCase().includes(searchTerm))
            .forEach(subject => {
                const totalLessons = subject.topics.length;
                const completedLessons = subject.topics.filter(topic => 
                    studentProgress[topic.id] && studentProgress[topic.id].reps > 3
                ).length;

                // Check if it matches the filter
                let showSubject = false;
                switch (filterValue) {
                    case 'started':
                        showSubject = completedLessons > 0 && completedLessons < totalLessons;
                        break;
                    case 'completed':
                        showSubject = completedLessons === totalLessons;
                        break;
                    case 'not-started':
                        showSubject = completedLessons === 0;
                        break;
                    default:
                        showSubject = true;
                }

                if (showSubject) {
                    const template = document.getElementById('progress-detail-template');
                    const clone = template.content.cloneNode(true);
                    const item = clone.querySelector('.progress-detail-item');
                    
                    item.dataset.subjectId = subject.id;
                    clone.querySelector('.lesson-name').textContent = subject.name;
                    
                    const statusElement = clone.querySelector('.lesson-status');
                    statusElement.textContent = `${completedLessons}/${totalLessons} Topics`;
                    
                    if (completedLessons === 0) {
                        statusElement.classList.add('not-started');
                    } else if (completedLessons === totalLessons) {
                        statusElement.classList.add('completed');
                    } else {
                        statusElement.classList.add('started');
                    }

                    // Hide stats for subject view
                    clone.querySelector('.progress-stats').style.display = 'none';
                    clone.querySelector('.progress-dates').style.display = 'none';
                    
                    this.detailsList.appendChild(clone);
                }
            });
    }

    updateLessonsList() {
        const searchTerm = this.searchInput.value.toLowerCase();
        const filterValue = this.filterSelect.value;
        const studentProgress = UI.currentStudent.progress;

        // Clear current list
        this.detailsList.innerHTML = '';

        this.currentSubject.topics
            .filter(topic => {
                const matchesSearch = topic.name.toLowerCase().includes(searchTerm) ||
                                   topic.id.toLowerCase().includes(searchTerm);
                
                const progress = studentProgress[topic.id];
                const status = !progress ? 'not-started' :
                             progress.interval > 30 ? 'completed' : 'started';
                
                return matchesSearch && (filterValue === 'all' || status === filterValue);
            })
            .forEach(topic => {
                const progress = studentProgress[topic.id] || {
                    interval: '-',
                    ease: null,
                    reps: 0,
                    last_review: null,
                    next_review: null
                };

                const template = document.getElementById('progress-detail-template');
                const clone = template.content.cloneNode(true);

                clone.querySelector('.lesson-name').textContent = topic.name;
                const statusElement = clone.querySelector('.lesson-status');
                
                if (!progress || progress.reps === 0) {
                    statusElement.textContent = 'Not Started';
                    statusElement.classList.add('not-started');
                } else if (progress.interval > 30) {
                    statusElement.textContent = 'Mastered';
                    statusElement.classList.add('completed');
                } else {
                    statusElement.textContent = 'In Progress';
                    statusElement.classList.add('started');
                }

                // Show full stats
                clone.querySelector('.interval').textContent = progress.interval;
                clone.querySelector('.ease').textContent = 
                    typeof progress.ease === 'number' ? progress.ease.toFixed(2) : '-';
                clone.querySelector('.reps').textContent = progress.reps;
                clone.querySelector('.last-review').textContent = 
                    progress.last_review ? new Date(progress.last_review).toLocaleDateString() : 'Never';
                clone.querySelector('.next-review').textContent = 
                    progress.next_review ? new Date(progress.next_review).toLocaleDateString() : '-';

                this.detailsList.appendChild(clone);
            });
    }

    exit() {
        this.view.classList.add('hidden');
        document.querySelector('.content-panel').classList.remove('hidden');
        UI.updateUI();
    }
}

// Student progress management
class Student {
    constructor(id, name) {
        if (!id || !name) {
            console.error('Attempting to create student with invalid parameters:', { id, name });
            throw new Error('Invalid student parameters');
        }
        this.id = id;
        this.name = name;
        this.enrolled = new Date().toISOString();
        this.progress = {};  // Ensure progress is always an object
    }

    static async create(id, name) {
        console.log('Creating new student:', { id, name });
        const student = new Student(id, name);
        await Database.saveStudent(student);
        return student;
    }

    static async load(id) {
        console.log('Loading student:', id);
        const data = await Database.getStudent(id);
        if (!data) {
            console.log('No existing student found for id:', id);
            return null;
        }

        console.log('Loaded student data:', data);
        const student = new Student(data.id, data.name);
        student.enrolled = data.enrolled;
        student.progress = data.progress || {};  // Ensure progress is always an object
        return student;
    }

    async save() {
        await Database.saveStudent(this);
    }

    updateProgress(topicId, review) {
        if (!this.progress[topicId]) {
            this.progress[topicId] = {
                interval: 1,
                ease: DEFAULT_EASE,
                reps: 0,
                last_review: null,
                next_review: null,
                last_example: null
            };
        }

        const topic = this.progress[topicId];
        const now = new Date().toISOString();

        // Update based on review grade
        switch (review.grade) {
            case 'again':
                topic.ease = Math.max(MIN_EASE, topic.ease - 0.20);
                topic.reps = 0;
                topic.interval = Math.max(1, Math.floor(topic.interval * 0.5));
                break;
            case 'hard':
                topic.ease = Math.max(MIN_EASE, topic.ease - 0.15);
                topic.reps += 1;
                topic.interval = Math.floor(topic.interval * 1.2);
                break;
            case 'good':
                topic.reps += 1;
                topic.interval = Math.floor(topic.interval * topic.ease);
                break;
            case 'easy':
                topic.ease = Math.min(MAX_EASE, topic.ease + 0.15);
                topic.reps += 1;
                topic.interval = Math.floor(topic.interval * topic.ease * 1.3);
                break;
        }

        topic.last_review = now;
        topic.next_review = new Date(Date.now() + topic.interval * 24 * 60 * 60 * 1000).toISOString();
        topic.last_example = review.example_id;
    }

    getDueReviews() {
        if (!this.progress) {
            console.warn('Progress object is undefined in getDueReviews');
            this.progress = {};
            return [];
        }

        const now = new Date();
        console.log('Getting due reviews, current progress:', this.progress);
        
        return Object.entries(this.progress)
            .filter(([_, data]) => {
                if (!data || !data.next_review) {
                    console.log('Skipping invalid progress entry:', data);
                    return false;
                }
                return new Date(data.next_review) <= now;
            })
            .map(([topicId, data]) => ({
                topicId,
                dueDate: new Date(data.next_review),
                interval: data.interval
            }))
            .sort((a, b) => a.dueDate - b.dueDate);
    }

    exportProgress() {
        return {
            id: this.id,
            name: this.name,
            enrolled: this.enrolled,
            progress: this.progress
        };
    }

    async importProgress(data) {
        this.name = data.name;
        this.enrolled = data.enrolled;
        this.progress = data.progress;
        await this.save();
    }
}

// Lesson Manager
class LessonManager {
    constructor() {
        this.currentLesson = null;
        this.currentProblemIndex = 0;
        this.selectedAnswer = null;
        this.view = document.getElementById('lesson-view');
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.view.querySelector('.back-button').addEventListener('click', () => this.exit());
        this.view.querySelector('.show-solution').addEventListener('click', () => this.showSolution());
        this.view.querySelector('.submit-answer').addEventListener('click', () => this.submitAnswer());
        this.view.querySelector('.next-problem').addEventListener('click', () => this.nextProblem());
        this.view.querySelector('.return-home').addEventListener('click', () => this.exit());

        // Delegate click events for option buttons
        this.view.querySelector('.problem-options').addEventListener('click', (e) => {
            if (e.target.classList.contains('option-button')) {
                this.selectAnswer(e.target);
            }
        });
    }

    async start(topicId) {
        try {
            this.currentLesson = await ContentLoader.loadLesson(topicId);
            this.currentProblemIndex = 0;
            this.selectedAnswer = null;

            // Show lesson view
            document.querySelector('.content-panel').classList.add('hidden');
            this.view.classList.remove('hidden');

            // Reset lesson state
            this.view.querySelector('.lesson-complete').classList.add('hidden');
            this.view.querySelector('.lesson-practice').classList.add('hidden');
            this.view.querySelector('.example-solution').classList.add('hidden');
            this.view.querySelector('.example-explanation').classList.add('hidden');
            this.view.querySelector('.show-solution').classList.remove('hidden');
            this.view.querySelector('.submit-answer').classList.remove('hidden');

            // Populate lesson content
            this.view.querySelector('.lesson-title').textContent = this.currentLesson.title;
            
            // Objectives
            const objectivesList = this.view.querySelector('.objectives-list');
            objectivesList.innerHTML = this.currentLesson.objectives
                .map(obj => `<li>${obj}</li>`)
                .join('');

            // Explanation
            const explanationContent = this.view.querySelector('.explanation-content');
            explanationContent.innerHTML = this.currentLesson.explanation.content;

            // Worked Example
            const exampleProblem = this.view.querySelector('.example-problem');
            const exampleSolution = this.view.querySelector('.example-solution');
            const exampleExplanation = this.view.querySelector('.example-explanation');

            exampleProblem.innerHTML = this.currentLesson.worked_example.problem;
            exampleSolution.innerHTML = this.currentLesson.worked_example.solution;
            exampleExplanation.innerHTML = this.currentLesson.worked_example.explanation;

            // Refresh MathJax
            if (window.MathJax) {
                window.MathJax.typesetPromise();
            }
        } catch (error) {
            console.error('Failed to start lesson:', error);
            alert('Failed to load lesson. Please try again.');
        }
    }

    showSolution() {
        this.view.querySelector('.example-solution').classList.remove('hidden');
        this.view.querySelector('.example-explanation').classList.remove('hidden');
        this.view.querySelector('.show-solution').classList.add('hidden');
        this.view.querySelector('.lesson-practice').classList.remove('hidden');
        
        // Load first practice problem
        this.loadProblem(0);
    }

    loadProblem(index) {
        const problem = this.currentLesson.practice_problems[index];
        const problemText = this.view.querySelector('.problem-text');
        const problemOptions = this.view.querySelector('.problem-options');
        const problemCounter = this.view.querySelector('.problem-counter');
        
        problemText.innerHTML = problem.question;
        problemOptions.innerHTML = problem.options
            .map((option, i) => `
                <button class="option-button" data-index="${i}">
                    ${option}
                </button>
            `)
            .join('');

        problemCounter.textContent = `Problem ${index + 1}/${this.currentLesson.practice_problems.length}`;
        
        this.view.querySelector('.submit-answer').disabled = true;
        this.view.querySelector('.problem-feedback').classList.add('hidden');
        this.view.querySelector('.next-problem').classList.add('hidden');
        this.selectedAnswer = null;

        if (window.MathJax) {
            window.MathJax.typesetPromise();
        }
    }

    selectAnswer(optionButton) {
        // Remove selection from all options
        this.view.querySelectorAll('.option-button').forEach(btn => {
            btn.classList.remove('selected');
        });

        // Select the clicked option
        optionButton.classList.add('selected');
        this.selectedAnswer = parseInt(optionButton.dataset.index);
        this.view.querySelector('.submit-answer').disabled = false;
    }

    submitAnswer() {
        const problem = this.currentLesson.practice_problems[this.currentProblemIndex];
        const isCorrect = this.selectedAnswer === problem.correct_answer;
        const feedback = this.view.querySelector('.problem-feedback');
        
        // Show feedback
        feedback.innerHTML = problem.explanation;
        feedback.classList.remove('hidden');
        feedback.classList.toggle('correct', isCorrect);
        feedback.classList.toggle('incorrect', !isCorrect);

        // Style the options
        const options = this.view.querySelectorAll('.option-button');
        options[problem.correct_answer].classList.add('correct');
        if (!isCorrect) {
            options[this.selectedAnswer].classList.add('incorrect');
        }

        // Show next button or finish button
        this.view.querySelector('.submit-answer').classList.add('hidden');
        const nextButton = this.view.querySelector('.next-problem');
        
        // Only change text to "Finish Lesson" if it's the last problem
        if (this.currentProblemIndex === this.currentLesson.practice_problems.length - 1) {
            nextButton.textContent = 'Finish Lesson';
        } else {
            nextButton.textContent = 'Next Problem';
        }
        nextButton.classList.remove('hidden');

        // Refresh MathJax for the explanation
        if (window.MathJax) {
            window.MathJax.typesetPromise();
        }
    }

    nextProblem() {
        if (this.currentProblemIndex === this.currentLesson.practice_problems.length - 1) {
            // If this was the last problem, complete the lesson
            this.completePractice();
        } else {
            // Otherwise, go to next problem
            this.currentProblemIndex++;
            this.loadProblem(this.currentProblemIndex);
            this.view.querySelector('.submit-answer').classList.remove('hidden');
        }
    }

    async completePractice() {
        // Update student progress
        await UI.currentStudent.updateProgress(this.currentLesson.id, {
            grade: 'good',  // First completion always counts as 'good'
            example_id: this.currentLesson.practice_problems[this.currentProblemIndex].id
        });
        await UI.currentStudent.save();

        // Update UI
        this.view.querySelector('.lesson-practice').classList.add('hidden');
        this.view.querySelector('.lesson-complete').classList.remove('hidden');
        this.view.querySelector('.completion-message').textContent = 
            'You have completed this lesson! The material will be scheduled for review based on your performance.';
    }

    exit() {
        this.view.classList.add('hidden');
        document.querySelector('.content-panel').classList.remove('hidden');
        UI.updateUI();
    }
}

// Review Manager
class ReviewManager {
    constructor() {
        this.currentReview = null;
        this.currentProblem = null;
        this.selectedAnswer = null;
        this.view = document.getElementById('review-view');
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.view.querySelector('.back-button').addEventListener('click', () => this.exit());
        this.view.querySelector('.submit-answer').addEventListener('click', () => this.submitAnswer());
        this.view.querySelector('.next-review').addEventListener('click', () => this.nextReview());
        this.view.querySelector('.finish-review').addEventListener('click', () => this.exit());

        // Grade buttons
        const gradeButtons = this.view.querySelector('.grade-buttons');
        gradeButtons.addEventListener('click', (e) => {
            if (e.target.classList.contains('grade-again')) this.gradeReview('again');
            if (e.target.classList.contains('grade-hard')) this.gradeReview('hard');
            if (e.target.classList.contains('grade-good')) this.gradeReview('good');
            if (e.target.classList.contains('grade-easy')) this.gradeReview('easy');
        });

        // Problem options
        this.view.querySelector('.problem-options').addEventListener('click', (e) => {
            if (e.target.classList.contains('option-button')) {
                this.selectAnswer(e.target);
            }
        });
    }

    async start(topicId) {
        try {
            const lesson = await ContentLoader.loadLesson(topicId);
            const topic = await ContentLoader.loadTopic(topicId);
            
            this.currentReview = {
                topicId,
                lesson,
                topic,
                problems: this.selectReviewProblems(lesson.practice_problems)
            };

            // Show review view
            document.querySelector('.content-panel').classList.add('hidden');
            this.view.classList.remove('hidden');

            // Set title
            this.view.querySelector('.review-title').textContent = `Review: ${topic.name}`;

            // Load first problem
            this.loadProblem(0);
        } catch (error) {
            console.error('Failed to start review:', error);
            alert('Failed to load review. Please try again.');
        }
    }

    selectReviewProblems(problems) {
        // For now, randomly select 2 problems
        return problems
            .sort(() => Math.random() - 0.5)
            .slice(0, 2);
    }

    loadProblem(index) {
        this.currentProblem = this.currentReview.problems[index];
        const problemText = this.view.querySelector('.problem-text');
        const problemOptions = this.view.querySelector('.problem-options');
        
        problemText.innerHTML = this.currentProblem.question;
        problemOptions.innerHTML = this.currentProblem.options
            .map((option, i) => `
                <button class="option-button" data-index="${i}">
                    ${option}
                </button>
            `)
            .join('');

        this.view.querySelector('.submit-answer').disabled = true;
        this.view.querySelector('.problem-feedback').classList.add('hidden');
        this.view.querySelector('.grade-buttons').classList.add('hidden');
        this.view.querySelector('.next-review').classList.add('hidden');
        this.view.querySelector('.finish-review').classList.add('hidden');
        this.selectedAnswer = null;

        if (window.MathJax) {
            window.MathJax.typesetPromise();
        }
    }

    selectAnswer(optionButton) {
        // Remove selection from all options
        this.view.querySelectorAll('.option-button').forEach(btn => {
            btn.classList.remove('selected');
        });

        // Select the clicked option
        optionButton.classList.add('selected');
        this.selectedAnswer = parseInt(optionButton.dataset.index);
        this.view.querySelector('.submit-answer').disabled = false;
    }

    submitAnswer() {
        const isCorrect = this.selectedAnswer === this.currentProblem.correct_answer;
        const feedback = this.view.querySelector('.problem-feedback');
        
        // Show feedback
        feedback.innerHTML = this.currentProblem.explanation;
        feedback.classList.remove('hidden');
        feedback.classList.toggle('correct', isCorrect);
        feedback.classList.toggle('incorrect', !isCorrect);

        // Style the options
        const options = this.view.querySelectorAll('.option-button');
        options[this.currentProblem.correct_answer].classList.add('correct');
        if (!isCorrect) {
            options[this.selectedAnswer].classList.add('incorrect');
        }

        // Show grade buttons
        this.view.querySelector('.submit-answer').classList.add('hidden');
        this.view.querySelector('.grade-buttons').classList.remove('hidden');

        // Refresh MathJax for the explanation
        if (window.MathJax) {
            window.MathJax.typesetPromise();
        }
    }

    async gradeReview(grade) {
        // Update progress
        await UI.currentStudent.updateProgress(this.currentReview.topicId, {
            grade,
            example_id: this.currentProblem.id
        });
        await UI.currentStudent.save();

        // Show next problem or finish
        this.view.querySelector('.grade-buttons').classList.add('hidden');
        if (this.currentProblem !== this.currentReview.problems[this.currentReview.problems.length - 1]) {
            this.view.querySelector('.next-review').classList.remove('hidden');
        } else {
            this.view.querySelector('.finish-review').classList.remove('hidden');
        }
    }

    nextReview() {
        const currentIndex = this.currentReview.problems.indexOf(this.currentProblem);
        this.loadProblem(currentIndex + 1);
        this.view.querySelector('.submit-answer').classList.remove('hidden');
    }

    exit() {
        this.view.classList.add('hidden');
        document.querySelector('.content-panel').classList.remove('hidden');
        UI.updateUI();
    }
}

// UI Management
class UI {
    static currentStudent = null;
    static lessonManager = null;
    static reviewManager = null;
    static progressDetailsManager = null;
    static currentKnowledgeGraph = null;

    static async init() {
        console.log('Starting UI initialization...');
        UI.lessonManager = new LessonManager();
        UI.reviewManager = new ReviewManager();
        UI.progressDetailsManager = new ProgressDetailsManager();
        UI.setupEventListeners();
        
        try {
            await UI.loadCurrentStudent();
            if (!UI.currentStudent) {
                console.error('Failed to load or create student');
                throw new Error('No student available');
            }
            UI.showKnowledgeGraphSelection();
        } catch (error) {
            console.error('Error during UI initialization:', error);
            throw error;
        }
    }

    static setupEventListeners() {
        document.getElementById('import-progress').addEventListener('click', UI.handleImport);
        document.getElementById('export-progress').addEventListener('click', UI.handleExport);
        document.getElementById('show-progress').addEventListener('click', () => {
            if (UI.currentKnowledgeGraph) {
                UI.progressDetailsManager.start(UI.currentKnowledgeGraph);
            }
        });
        
        // Hide progress button initially
        document.getElementById('show-progress').style.display = 'none';
        
        // Delegate card clicks
        document.getElementById('cards-container').addEventListener('click', (e) => {
            const card = e.target.closest('.card');
            if (!card) return;

            const type = card.dataset.type;
            const id = card.dataset.id;

            if (type === 'knowledge-graph') {
                UI.selectKnowledgeGraph(id);
            } else if (type === 'review') {
                UI.startReview(id);
            } else if (type === 'lesson') {
                UI.startLesson(id);
            }
        });
    }

    static async loadCurrentStudent() {
        console.log('Loading current student...');
        try {
            UI.currentStudent = await Student.load('default');
            console.log('Loaded student:', UI.currentStudent);
            
            if (!UI.currentStudent) {
                console.log('No existing student found, creating new one...');
                UI.currentStudent = await Student.create('default', 'Student');
                console.log('Created new student:', UI.currentStudent);
            }

            if (!UI.currentStudent.progress) {
                console.warn('Student has no progress object, initializing empty progress');
                UI.currentStudent.progress = {};
                await UI.currentStudent.save();
            }

            document.getElementById('student-name').textContent = UI.currentStudent.name;
        } catch (error) {
            console.error('Failed to load or create student:', error);
            throw error;
        }
    }

    static async showKnowledgeGraphSelection() {
        const container = document.getElementById('cards-container');
        container.innerHTML = '';

        try {
            const response = await fetch('knowledge_graphs/index.json');
            if (!response.ok) throw new Error('Failed to load knowledge graphs');
            const data = await response.json();

            const template = document.getElementById('card-template');

            // Add a card for each knowledge graph
            for (const graph of data.knowledge_graphs) {
                const clone = template.content.cloneNode(true);
                const card = clone.querySelector('.card');
                
                card.dataset.type = 'knowledge-graph';
                card.dataset.id = graph.id;
                
                clone.querySelector('.card-title').textContent = graph.name;
                clone.querySelector('.card-description').textContent = graph.description;
                clone.querySelector('.card-type').textContent = 'Knowledge Graph';
                clone.querySelector('.card-due').textContent = 'Click to explore';
                
                container.appendChild(clone);
            }

            // Hide progress button on main selection screen
            document.getElementById('show-progress').style.display = 'none';
            document.querySelector('.content-panel h2').textContent = 'Select a Knowledge Graph';

        } catch (error) {
            console.error('Failed to load knowledge graphs:', error);
            container.innerHTML = '<p class="error">Failed to load knowledge graphs. Please refresh the page.</p>';
        }
    }

    static getKnowledgeGraphProgress(graphId, graphData) {
        const progress = UI.currentStudent.progress;
        const totalTopics = graphData.topics.length;
        const completedTopics = graphData.topics.filter(topic => 
            progress[topic.id] && progress[topic.id].reps >= 5
        ).length;
        return `${completedTopics}/${totalTopics} Topics Complete`;
    }

    static async selectKnowledgeGraph(graphId) {
        UI.currentKnowledgeGraph = graphId;
        document.getElementById('show-progress').style.display = 'inline-block';
        document.querySelector('.content-panel h2').textContent = `${graphId.charAt(0).toUpperCase() + graphId.slice(1)}: Reviews & Lessons`;
        UI.updateCards();
    }

    static updateUI() {
        if (UI.currentKnowledgeGraph) {
            UI.updateCards();
        } else {
            UI.showKnowledgeGraphSelection();
        }
    }

    static async updateCards() {
        const container = document.getElementById('cards-container');
        container.innerHTML = '';

        // Ensure we have a valid student and knowledge graph
        if (!UI.currentStudent || !UI.currentKnowledgeGraph) {
            return;
        }

        try {
            // First load the graph's index
            const indexResponse = await fetch(`knowledge_graphs/${UI.currentKnowledgeGraph}/index.json`);
            if (!indexResponse.ok) throw new Error('Failed to load graph index');
            const indexData = await indexResponse.json();

            // Then load all subjects and collect their topics
            let allTopics = [];
            for (const subject of indexData.subjects) {
                const subjectResponse = await fetch(`knowledge_graphs/${UI.currentKnowledgeGraph}/${subject}`);
                if (!subjectResponse.ok) continue;
                const subjectData = await subjectResponse.json();
                allTopics = allTopics.concat(subjectData.topics);
            }

            const progress = UI.currentStudent.progress;
            const now = new Date();
            const template = document.getElementById('card-template');

            // First, add due reviews
            const dueReviews = allTopics
                .filter(topic => {
                    const topicProgress = progress[topic.id];
                    return topicProgress && 
                           topicProgress.next_review && 
                           new Date(topicProgress.next_review) <= now;
                })
                .map(topic => ({
                    id: topic.id,
                    name: topic.name,
                    dueDate: new Date(progress[topic.id].next_review)
                }))
                .sort((a, b) => a.dueDate - b.dueDate);

            // Add review cards
            dueReviews.slice(0, 25).forEach(review => {
                const clone = template.content.cloneNode(true);
                const card = clone.querySelector('.card');
                
                card.dataset.type = 'review';
                card.dataset.id = review.id;
                
                clone.querySelector('.card-title').textContent = `Review: ${review.name}`;
                clone.querySelector('.card-description').textContent = 'Time to review this topic!';
                clone.querySelector('.card-type').textContent = 'Review';
                clone.querySelector('.card-due').textContent = `Due: ${review.dueDate.toLocaleDateString()}`;
                
                container.appendChild(clone);
            });

            // If less than 25 reviews, add available lessons
            if (dueReviews.length < 25) {
                const availableLessons = allTopics
                    .filter(topic => {
                        // Check if all prerequisites have at least 3 reps
                        const prereqsMet = topic.prerequisites.every(prereqId => {
                            const prereqProgress = progress[prereqId];
                            return prereqProgress && 
                                   prereqProgress.reps >= 3 &&
                                   prereqProgress.next_review && 
                                   new Date(prereqProgress.next_review) > now;
                        });

                        // Check if this topic has never been started
                        const topicProgress = progress[topic.id];
                        const notStarted = !topicProgress || topicProgress.reps === 0;

                        return prereqsMet && notStarted;
                    })
                    .slice(0, 25 - dueReviews.length);

                // Add lesson cards
                availableLessons.forEach(lesson => {
                    const clone = template.content.cloneNode(true);
                    const card = clone.querySelector('.card');
                    
                    card.dataset.type = 'lesson';
                    card.dataset.id = lesson.id;
                    
                    clone.querySelector('.card-title').textContent = lesson.name;
                    clone.querySelector('.card-description').textContent = lesson.content;
                    clone.querySelector('.card-type').textContent = 'New Lesson';
                    clone.querySelector('.card-due').textContent = 'Ready to start';
                    
                    container.appendChild(clone);
                });
            }
        } catch (error) {
            console.error('Failed to update cards:', error);
            container.innerHTML = '<p class="error">Failed to load topics. Please try again.</p>';
        }
    }

    static async handleImport() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        
        input.onchange = async (e) => {
            const file = e.target.files[0];
            const reader = new FileReader();
            
            reader.onload = async (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    await UI.currentStudent.importProgress(data);
                    UI.updateUI();
                } catch (error) {
                    console.error('Failed to import progress:', error);
                    alert('Failed to import progress. Please check the file format.');
                }
            };
            
            reader.readAsText(file);
        };
        
        input.click();
    }

    static handleExport() {
        const data = UI.currentStudent.exportProgress();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `progress_${data.id}_${new Date().toISOString()}.json`;
        a.click();
        
        URL.revokeObjectURL(url);
    }

    static async startReview(topicId) {
        await UI.reviewManager.start(topicId);
    }

    static async startLesson(topicId) {
        await UI.lessonManager.start(topicId);
    }
}

// Initialize the application
async function init() {
    console.log('Starting application initialization...');
    try {
        await Database.init();
        if (!Database.isInitialized) {
            throw new Error('Database failed to initialize properly');
        }
        await UI.init();
        console.log('Application initialized successfully');
    } catch (error) {
        console.error('Failed to initialize application:', error);
        // Display error to user
        alert('Failed to start the application. Please refresh the page and try again.');
    }
}

init(); 