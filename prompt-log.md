## Task 1: Sector Selection

**Sector:** Digital Technology & AI

**Local Challenge:** College students may spend considerable time organizing lengthy lesson materials into study notes and preparing practice questions for examinations.

**Target Users:** College students who want to review their lessons efficiently.

**Proposed Project** QuizCraft - Notes and Quiz Generator

**Key Features:**
1. **Smart Notes Generator** 
2. **Quiz Generator**
3. **Study Review and Progress Tracker** 


# Task 2: Zero-Shot Prompting

**Objective:**

To test whether GitHub Copilot can generate a basic QuizCraft webpage from a simple prompt without providing examples or detailed instructions.

**Exact Prompt:**

Create a simple webpage named QuizCraft a notes and quiz generator for college students. Include a feature that generated study notes from text or file, a feature that generates practice quizzes, and a section to display quiz scores and topics they may need to review again.

**Actual Copilot Output:**

GitHub Copilot generated one file named `index.html`, containing HTML, CSS inside a `<style>` section, and JavaScript inside a `<script>` section. The webpage includes the Smart Notes Generator, Quiz Generator, and a section for quiz scores and topics that students may need to review.

**Saved Output:** `outputs/zero-shot-index.html`

**What Worked:**

- Copilot generated an initial webpage for QuizCraft.
- The webpage included the three requested features: study notes generation, practice quiz generation, and quiz score tracking.
- The generated features worked when tested.

**What Needs Improvement:**

- The HTML, CSS, and JavaScript were placed in a single file instead of separate files.
- The prompt did not specify a color palette or detailed design requirements.
- The prompt did not explicitly specify responsiveness, accessibility, or acceptance criteria.

**Next Action / Verification:**

Save a copy of the original `index.html` as `outputs/zero-shot-index.html` to preserve the baseline. Test the three features and record any issues observed. For Task 3, I will use a structured prompt with clearer requirements, has color palette, responsive design, and acceptance criteria. I will compare the improved output with the zero-shot baseline.

## Task 3: Improve: Anatomy of a Prompt

**Objective:**

To improve the initial QuizCraft webpage by giving GitHub Copilot clearer instructions, specific design requirements, constraints, and acceptance criteria.

**Exact Prompt:**

Act as a frontend web developer and improve QuizCraft, a study notes and quiz generator for college students, using semantic HTML, CSS, and Vanilla JavaScript. Create index.html, style.css, and script.js in the current project folder. Include a Smart Notes Generator for lesson text and file uploads if feasible, a Quiz Generator that creates practice questions from lesson content, and a score section showing results and topics to review.

Use a clean, accessible, student-friendly design that works on desktop and mobile. Apply a light purple theme: primary purple #B7A1FF, light lavender #C9B6FF, background #F7F2FF, white cards #FFFFFF, text #4B3F72, correct answers #22C55E, and wrong answers #F87171 with background #FEF2F2.

Use clear labels and readable text. Do not use a backend, database, or external API, or claim to use real AI if features rely on sample data or rule-based logic. Ensure students can generate notes, create and answer quizzes, view scores and review topics, and use the webpage without console errors during normal use.

**Actual Copilot Output:**

GitHub Copilot updated QuizCraft into three separate files: index.html, style.css, and script.js. The index.html file provides the semantic and accessible page structure, style.css applies the lavender color palette and responsive layout, and script.js handles lesson summaries, .txt and .md file uploads, quizzes, scores, and review topics locally. Progress is saved in the browser. The notes and quiz generation features use rule-based logic rather than a real AI service.

**Saved Output:**

`outputs/structured-prompt-index.html`


**What Worked:**

- The study notes, file upload, and quiz features were verified.
- Quiz progress is saved in the browser.
- No browser console errors or horizontal overflow on mobile screens were observed. 

**What Needs Improvement:**

- The main features worked during testing. Further testing with different lesson materials could help verify the consistency of the notes and quiz generation.

**Next Action / Verification:**

Preserve the Task 2 baseline and Task 3 snapshot. Compare the generated output with the zero-shot version and document at least two actual differences. Continue testing the notes, quiz, file upload, and progress-tracking features.

**Observation**
The difference between task 2 and task 3 is that the prompt in task 2 is very simple has basic reequirements that's why the file organization of HTML, CSS, and Javascript is in one file. In the task 3, the prompt is very detailed and it includes what color palette it will use, and the file organization is separated from one file.

## Task 4A: Few-Shot Prompting

**Objective:**

To improve QuizCraft's study notes and practice quiz features by providing examples of the expected output.

**Exact Prompt:**

Act as a frontend web developer improving my QuizCraft — Smart Notes and Quiz Generator webpage.

Use the existing QuizCraft project as your starting point. Improve the way study notes and practice quizzes are generated by following these examples.

**Example 1 — Study Notes**

Input lesson text:
"HTML stands for HyperText Markup Language. It is used to structure content on webpages. CSS is used to style webpages."

Expected study notes:

- **HTML:** A markup language used to structure webpage content.
- **CSS:** A stylesheet language used to style webpages.
- **Key takeaway:** HTML structures the content, while CSS controls its appearance.

**Example 2 — Practice Quiz**

Input lesson text:
"HTML is used to structure webpage content."

Expected quiz question:
"What is HTML primarily used for?"

Options:
A. Styling webpage content
B. Structuring webpage content
C. Managing databases
D. Creating animations

Correct answer: B

**Task:**
Improve QuizCraft's study notes and quiz generation features so their outputs follow the examples' format and are based on the lesson material provided by the user.

**Constraints:**

- Use HTML, CSS, and vanilla JavaScript.
- Do not use a backend or external API.
- Preserve the existing light purple design.
- Do not claim the webpage uses real AI if it relies on rule-based JavaScript.
- Preserve the original Task 2 baseline and the saved Task 3 version.

**Expected Output:**
Update the relevant project files and explain which files were changed.

**Acceptance Criteria:**

- Study notes are organized into key concepts and takeaways.
- Practice questions have four options and a clearly identified correct answer.
- Quiz results and topics for review continue to work.
- Existing features are not broken.

**Actual Copilot Output:**

GitHub Copilot updated only script.js and style.css. The saved Task 2 baseline and Task 3 snapshot remained unchanged. The notes generator now identifies HTML and CSS concepts and produces the requested key takeaway. The purpose-based quiz generator works with a single lesson sentence, displays four answer options labeled A–D, and identifies the correct answer. Quiz scores and topics for review continue to update after completion.

File-Change Report:

File Name: script.js

Action: Modified

Changes Made: Improved the study notes and purpose-based quiz generation behavior, including correct-answer handling and score/review-topic updates.

File Name: style.css

Action: Modified

Changes Made: Updated the styling associated with the improved QuizCraft features.

**Saved Output:**

`outputs/few-shot-index.html`

**What Worked:**

- The study notes identified HTML and CSS concepts and produced the requested takeaway.
- The quiz displayed four answer options and identified the correct answer.
- Both examples were verified, including correct and incorrect quiz answers.
- Quiz scores and review topics continued to update after completion.
- Browser diagnostics were clean, and the saved Task 2 and Task 3 versions remained unchanged.

**What Needs Improvement:**

The tested examples worked as expected. Further testing with different lesson materials would help determine whether the notes and quiz generation behave consistently beyond the two provided examples.

**Next Action / Verification:**

Preserve the updated Task 4A files and continue to Task 4B — Role Assignment. Ask GitHub Copilot to act as a web accessibility reviewer, inspect the existing project, identify actual accessibility issues, and recommend minimal corrections without rewriting the entire project.

## Task 4B: Role Assignment

### Objective
To evaluate the accessibility of the QuizCraft webpage by assigning GitHub Copilot the role of a web accessibility reviewer.

### Exact Prompt
Act as a web accessibility reviewer. Review my existing QuizCraft — Smart Notes and Quiz Generator project, including its HTML, CSS, and JavaScript files. Inspect the webpage for accessibility issues involving form labels, keyboard navigation, color contrast, heading structure, button names, and feedback for correct or incorrect quiz answers. Do not rewrite the entire project or make changes yet. List each issue you actually find, explain why it matters, identify the affected filename and relevant code, and recommend a minimal correction. If you do not find an issue in a particular area, state that clearly instead of inventing a problem. Preserve the existing light purple design and all current features.

### Actual Copilot Output
GitHub Copilot reviewed the QuizCraft project and identified four accessibility issues:

1. **File Upload Keyboard Accessibility:** The hidden file input in `index.html:37` is skipped when navigating with the Tab key.
2. **Text Color Contrast:** Several small text colors in `style.css` do not meet the WCAG contrast requirement of 4.5:1.
3. **Textarea Focus Indicator:** The textarea's focus border and outline have insufficient contrast.
4. **Quiz Progress Bar:** The progress fill has a contrast ratio of 2.37:1 against its track, making it difficult to distinguish.

Copilot also confirmed that the textarea and file picker have associated labels, the headings follow a logical sequence, the buttons have accessible names, and quiz feedback is provided through text and a polite live region.

**Files Reviewed:** `index.html`, `style.css`, and `script.js`

**File Changes:** None. Copilot only reviewed the project and provided recommendations.

### What Worked
- Copilot identified specific accessibility issues and provided the affected file locations.
- It provided contrast ratios and recommendations for improving accessibility.
- It identified accessibility features that were already implemented correctly.

### What Needs Improvement
The four identified accessibility issues still need to be corrected. The file upload should support keyboard navigation, text colors should have sufficient contrast, the textarea needs a clearer focus indicator, and the quiz progress bar needs better visual contrast.

### Next Action / Verification
Apply the recommended accessibility corrections while preserving the existing light purple design. Test keyboard navigation, verify color contrast, inspect the focus indicator, and confirm that the study notes, file upload, quiz generation, and score tracking continue to work.

## Task 5: Analyze Structured Reasoning and Refinement

### Objective
To analyze and refine QuizCraft by identifying implementation weaknesses, applying targeted corrections, and testing the results against the project requirements.

### Exact Prompt
Review and refine my QuizCraft — Smart Notes and Quiz Generator project. Ensure that Topics to Revisit displays the exact lesson topic associated with an incorrect answer, change the all-correct success message to green, shuffle quiz questions and answer choices for each new attempt, apply the specified red/amber/green score percentage colors, and remove dates and times from quiz attempt history without deleting saved scores. Preserve the existing light purple design and all working features. Make only the necessary changes, report the modified files, and verify the corrections through actual testing.

### Actual Copilot Output

**Modified Files**

- `script.js:351` — Removed dates from displayed quiz attempts while preserving saved history data. Topic mapping, deduplication, and question/answer shuffling remain intact.
- `style.css:124` — Maintains green styling for all-correct results, red styling for incorrect feedback, and the specified red/amber/green score bands.
- `script.js:298` — Applies the appropriate red or green state to answer feedback.

**Saved Output:** `outputs/task-5-analysis.md`


### What Worked
The requested refinements were implemented and tested. Review topics display the lesson concept, success and incorrect-answer messages use different colors, quiz questions and answers are shuffled, score percentages use the specified color ranges, and attempt history displays scores without dates.

### What Needs Improvement
Further testing with different lesson materials and additional quiz attempts could help confirm consistent behavior across a wider range of questions and topics.

### Next Action / Verification
Proceed to Task 6 by comparing the prompting techniques used in Tasks 2, 3, 4A, 4B, and 5, and reflecting on how they influenced the QuizCraft project.

## Task#6: Compare and Submit

**Technique: Zero-Shot** 
Observation: The AI generated a basic QuizCraft webpage from a short description. It included the main requested features, but the initial version placed the HTML, CSS, and JavaScript in one file and had fewer detailed requirements.

**Technique: Structured Prompt** 
Observation: Adding the role, context, constraints, expected output, and acceptance criteria improved the organization. The project was separated into `index.html`, `style.css`, and `script.js`, with a consistent lavender design and more clearly defined features. 

**Technique: Few-Shot**
Observation: Providing examples made the study notes and quiz questions more consistent with the expected format. The notes identified key concepts and takeaways, while practice questions used four choices and identified the correct answer. 

**Technique: Role Assignment** 
Observation: Assigning the AI the role of an accessibility reviewer helped identify specialized concerns, including keyboard access for file uploads, text contrast, focus indicators, and quiz progress-bar contrast.

**Technique: Structured Analysis**
Observation: Specific corrections and testing verified improvements to review-topic tracking, feedback colors, randomized question and answer order, score color bands, and the removal of dates from displayed quiz history.

## Final Reflection
The structured instructions can produced the most useful initial implementation because it clearly defined the required features, design, and technologies. While doing this activity, I learned that AI-generated code needs to be inspected and tested first before implementing. Combining different prompting techniques helped me developed more organized prototype and learn the difference of each technique.

**Selected Output:** Current QuizCraft prototype (root-level `index.html`, `style.css`, and `script.js`).

**Reason for Selection:** I selected the current prototype because it includes the Task 5 refinements to quiz scoring, answer feedback, question shuffling, review topics, and score history, which were documented and tested.