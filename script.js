'use strict';

const storageKey = 'quizcraft-study-data-v1';
const stopWords = new Set(('about after again all also am an and any are as at be because been before being between both but by can could did do does doing down each few for from further had has have having he her here hers herself him himself his how i if in into is it its itself just more most my myself no nor not of off on once only or other our ours ourselves out over own same she should so some such than that the their theirs them themselves then there these they this those through to too under until up very was we were what when where which while who whom why will with would you your yours').split(' '));
const sourceInput = document.querySelector('#lesson-text');
const fileInput = document.querySelector('#file-upload');
const notesOutput = document.querySelector('#notes-output');
const quizIntro = document.querySelector('#quiz-intro');
const questionView = document.querySelector('#quiz-question-view');
const quizResult = document.querySelector('#quiz-result');
let currentTitle = 'Study session';
let questionBank = [];
let questions = [];
let questionIndex = 0;
let correctAnswers = 0;
let missedTopics = [];
let previousQuizMaterial = '';

function readProgress() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || '{}');
    return {
      history: Array.isArray(saved.history) ? saved.history : [],
      reviews: Array.isArray(saved.reviews) ? saved.reviews : [],
    };
  } catch {
    return { history: [], reviews: [] };
  }
}

function saveProgress(progress) {
  try {
    localStorage.setItem(storageKey, JSON.stringify(progress));
  } catch {
    showToast('Progress could not be saved in this browser.');
  }
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[character]);
}

function getSentences(text) {
  return text.replace(/\s+/g, ' ').match(/[^.!?]+[.!?]?/g)?.map((sentence) => sentence.trim())
    .filter((sentence) => sentence.length > 24) ?? [];
}

function getKeywords(text) {
  const counts = new Map();
  for (const match of text.match(/[A-Za-z][A-Za-z'-]{2,}/g) ?? []) {
    const word = match.toLowerCase().replace(/^[^a-z0-9]+|[^a-z0-9-]+$/g, '');
    if (word.length < 4 || stopWords.has(word)) continue;
    counts.set(word, (counts.get(word) ?? 0) + 1);
  }
  return [...counts.entries()].sort((first, second) => second[1] - first[1] || first[0].localeCompare(second[0]))
    .map(([word]) => word);
}

function scoreSentence(sentence, keywords) {
  const words = new Set((sentence.toLowerCase().match(/[a-z][a-z'-]*/g) ?? []));
  return keywords.reduce((score, keyword) => score + Number(words.has(keyword)), 0);
}

function normalizePurpose(purpose, term) {
  const cleaned = purpose.trim().replace(/[.!?]+$/, '');
  if (term === 'HTML') return cleaned.replace(/\bcontent on webpages\b/i, 'webpage content');
  return cleaned;
}

function getConcepts(text) {
  const concepts = new Map();
  let previousTerm = '';

  for (const sentence of getSentences(text)) {
    const expansion = sentence.match(/\b([A-Z][A-Z0-9]{1,9})\s+stands for\s+([^.!?]+)/i);
    const purposeMatch = sentence.match(/\b([A-Z][A-Za-z0-9-]{1,19})\s+(?:is|are)\s+(?:primarily\s+)?used to\s+([^.!?]+)/i);
    const directPurpose = purposeMatch && !/^(?:It|This|They)$/i.test(purposeMatch[1]) ? purposeMatch : null;
    const pronounPurpose = sentence.match(/^\s*(?:It|This|They)\s+(?:is|are)\s+(?:primarily\s+)?used to\s+([^.!?]+)/i);
    const term = directPurpose?.[1] ?? expansion?.[1];

    if (term) previousTerm = term;
    if (expansion) {
      const concept = concepts.get(expansion[1]) ?? { term: expansion[1] };
      concept.expansion = expansion[2].trim();
      concepts.set(expansion[1], concept);
    }
    if (directPurpose) {
      const concept = concepts.get(directPurpose[1]) ?? { term: directPurpose[1] };
      concept.purpose = normalizePurpose(directPurpose[2], concept.term);
      concepts.set(directPurpose[1], concept);
      previousTerm = directPurpose[1];
    } else if (pronounPurpose && previousTerm) {
      const concept = concepts.get(previousTerm) ?? { term: previousTerm };
      concept.purpose = normalizePurpose(pronounPurpose[1], previousTerm);
      concepts.set(previousTerm, concept);
    }
  }

  return [...concepts.values()];
}

function generateNotes() {
  const text = sourceInput.value.trim();
  if (text.length < 30) {
    showToast('Add a little more lesson material to create useful notes.');
    return;
  }

  const sentences = getSentences(text);
  const keywords = getKeywords(text);
  const concepts = getConcepts(text);
  const mainIdeas = sentences.map((sentence, index) => ({ sentence, index, score: scoreSentence(sentence, keywords) }))
    .sort((first, second) => second.score - first.score || first.index - second.index)
    .slice(0, 5).sort((first, second) => first.index - second.index);
  const typeByTerm = { HTML: 'markup language', CSS: 'stylesheet language', JavaScript: 'scripting language' };
  const conceptItems = concepts.length
    ? concepts.map((concept) => {
      const kind = typeByTerm[concept.term];
      const description = concept.purpose
        ? `${kind ? `A ${kind} ` : ''}used to ${concept.purpose}.`
        : concept.expansion || 'A key concept in this lesson.';
      return `<li><strong>${escapeHtml(concept.term)}:</strong> ${escapeHtml(description)}</li>`;
    })
    : mainIdeas.map(({ sentence }) => `<li>${escapeHtml(sentence)}</li>`);
  let takeaway;
  const htmlConcept = concepts.find((concept) => concept.term === 'HTML');
  const cssConcept = concepts.find((concept) => concept.term === 'CSS');
  if (htmlConcept?.purpose && cssConcept?.purpose) {
    takeaway = 'HTML structures the content, while CSS controls its appearance.';
  } else if (concepts.length) {
    takeaway = concepts.filter((concept) => concept.purpose).map((concept) => `${concept.term} is used to ${concept.purpose}.`).join(' ');
  } else {
    takeaway = mainIdeas[0]?.sentence ?? 'Review the key concepts from your lesson.';
  }
  notesOutput.innerHTML = `<p class="output-label">Rule-based study notes</p><h4>${escapeHtml(currentTitle.replace(/\.[^.]+$/, ''))}</h4><h5>Key concepts</h5><ul class="concept-list">${conceptItems.join('')}</ul><p class="key-takeaway"><strong>Key takeaway:</strong> ${escapeHtml(takeaway)}</p>`;
  notesOutput.hidden = false;
  notesOutput.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function getQuestionTopic(term, purpose) {
  const action = purpose.trim().split(/\s+/)[0].toLowerCase();
  const topicByAction = {
    structure: 'Structure', style: 'Styling', manage: 'Management', create: 'Creation',
    organize: 'Organization', convert: 'Conversion', absorb: 'Absorption',
    produce: 'Production', release: 'Release', capture: 'Capture', control: 'Control',
  };
  const topicAction = topicByAction[action] ?? `${action.charAt(0).toUpperCase()}${action.slice(1)}`;
  return `${term} ${topicAction}`;
}

function getFallbackTopic(sentence, answer) {
  const subject = sentence.trim().match(/^(?:(?:a|an|the)\s+)?([a-z][a-z0-9-]*)/i)?.[1];
  if (!subject || subject.toLowerCase() === answer.toLowerCase() || stopWords.has(subject.toLowerCase())) {
    return 'Lesson concept';
  }
  return `${subject.charAt(0).toUpperCase()}${subject.slice(1)}`;
}

function shuffleItems(items) {
  const shuffled = [...items];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }
  return shuffled;
}

function getScoreBand(score) {
  if (Number(score) === 100) return 'score-band-perfect';
  if (Number(score) >= 50) return 'score-band-mid';
  return 'score-band-low';
}

function makeQuestions(text) {
  const concepts = getConcepts(text).filter((concept) => concept.purpose);
  const distractorsByTerm = {
    HTML: ['Styling webpage content', 'Managing databases', 'Creating animations'],
    CSS: ['Structuring webpage content', 'Managing databases', 'Creating animations'],
  };
  if (concepts.length) {
    return concepts.slice(0, 5).map((concept) => {
      const purpose = normalizePurpose(concept.purpose, concept.term);
      const [verb, ...rest] = purpose.split(/\s+/);
      const gerund = verb.toLowerCase().endsWith('ie')
        ? `${verb.slice(0, -2)}ying`
        : verb.toLowerCase().endsWith('e') ? `${verb.slice(0, -1)}ing` : `${verb}ing`;
      const answerText = `${gerund} ${rest.join(' ')}`.trim();
      const correctAnswer = answerText.charAt(0).toUpperCase() + answerText.slice(1);
      const distractors = distractorsByTerm[concept.term] ?? ['Organizing information', 'Managing databases', 'Creating animations'];
      const uniqueDistractors = [...new Set(distractors.filter((option) => option.toLowerCase() !== correctAnswer.toLowerCase()))];
      const fillerOptions = ['Organizing information', 'Managing databases', 'Creating animations', 'Saving files'];
      for (const filler of fillerOptions) {
        if (uniqueDistractors.length === 3) break;
        if (filler.toLowerCase() !== correctAnswer.toLowerCase() && !uniqueDistractors.includes(filler)) uniqueDistractors.push(filler);
      }
      return {
        prompt: `What is ${concept.term} primarily used for?`,
        answer: correctAnswer,
        topic: getQuestionTopic(concept.term, purpose),
        options: [uniqueDistractors[0], correctAnswer, uniqueDistractors[1], uniqueDistractors[2]],
      };
    });
  }

  const sentences = getSentences(text);
  const keywords = getKeywords(text);
  const candidates = [];
  for (const sentence of sentences) {
    const sentenceWords = new Set((sentence.toLowerCase().match(/[a-z][a-z'-]*/g) ?? []));
    const answer = keywords.find((word) => sentenceWords.has(word));
    if (!answer || candidates.some((item) => item.answer === answer)) continue;
    candidates.push({ sentence, answer });
  }
  return candidates.slice(0, 5).map(({ sentence, answer }) => {
    const distractorPool = [...keywords.filter((word) => word !== answer), 'Styling webpage content', 'Managing databases', 'Creating animations', 'Saving files'];
    const distractors = [...new Set(distractorPool.filter((word) => word.toLowerCase() !== answer.toLowerCase()))].slice(0, 3);
    const options = [answer, ...distractors];
    const blank = new RegExp(`\\b${escapeRegExp(answer)}\\b`, 'i');
    return { prompt: sentence.replace(blank, '_____'), answer, topic: getFallbackTopic(sentence, answer), options };
  });
}

function startQuiz() {
  const text = sourceInput.value.trim();
  if (text !== previousQuizMaterial) {
    questionBank = makeQuestions(text);
    previousQuizMaterial = text;
  }
  if (!questionBank.length) {
    showToast('Add a sentence that defines a concept or describes what it is used for.');
    return;
  }

  questions = shuffleItems(questionBank).map((question) => ({
    ...question,
    options: shuffleItems(question.options),
  }));
  questionIndex = 0;
  correctAnswers = 0;
  missedTopics = [];
  renderQuestion();
  document.querySelector('#quiz-panel').scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function renderQuestion() {
  const question = questions[questionIndex];
  const progress = Math.round((questionIndex / questions.length) * 100);
  quizIntro.hidden = true;
  quizResult.hidden = true;
  questionView.hidden = false;
  document.querySelector('#question-number').textContent = `Question ${questionIndex + 1} of ${questions.length}`;
  document.querySelector('#quiz-title-source').textContent = currentTitle;
  document.querySelector('.progress-track').setAttribute('aria-valuenow', String(progress));
  document.querySelector('#progress-fill').style.width = `${progress}%`;
  const prompt = document.querySelector('#question-prompt');
  prompt.textContent = question.prompt;
  prompt.focus({ preventScroll: true });
  const feedback = document.querySelector('#answer-feedback');
  feedback.textContent = '';
  feedback.classList.remove('is-correct', 'is-wrong');
  const nextButton = document.querySelector('#next-question');
  nextButton.disabled = true;
  nextButton.textContent = 'Choose an answer';

  const answerList = document.querySelector('#answer-list');
  answerList.replaceChildren();
  question.options.forEach((option, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'answer-option';
    button.dataset.answer = option;
    button.innerHTML = `<span class="choice-letter">${String.fromCharCode(65 + index)}.</span> ${escapeHtml(option)}`;
    button.addEventListener('click', () => chooseAnswer(button, option));
    answerList.append(button);
  });
}

function chooseAnswer(selectedButton, answer) {
  const question = questions[questionIndex];
  const isCorrect = answer === question.answer;
  if (isCorrect) correctAnswers += 1;
  else missedTopics.push(question.topic);

  for (const button of document.querySelectorAll('.answer-option')) {
    button.disabled = true;
    if (button.dataset.answer === question.answer) button.classList.add('is-correct');
  }
  if (!isCorrect) selectedButton.classList.add('is-wrong');
  const correctIndex = question.options.indexOf(question.answer);
  const correctLabel = String.fromCharCode(65 + correctIndex);
  const feedback = document.querySelector('#answer-feedback');
  feedback.classList.add(isCorrect ? 'is-correct' : 'is-wrong');
  feedback.textContent = `${isCorrect ? 'Correct.' : 'Not quite.'} Correct answer: ${correctLabel}. ${question.answer}.`;
  const nextButton = document.querySelector('#next-question');
  nextButton.disabled = false;
  nextButton.textContent = questionIndex === questions.length - 1 ? 'View your score' : 'Next question';
}

function finishQuiz() {
  const score = Math.round((correctAnswers / questions.length) * 100);
  const progress = readProgress();
  const completedAt = new Date().toISOString();
  progress.history.unshift({ title: currentTitle, score, correct: correctAnswers, total: questions.length, date: completedAt });
  progress.history = progress.history.slice(0, 20);

  for (const topic of new Set(missedTopics)) {
    const existing = progress.reviews.find((item) => item.topic === topic);
    if (existing) {
      existing.count += 1;
      existing.lastSeen = completedAt;
    } else {
      progress.reviews.push({ topic, count: 1, lastSeen: completedAt });
    }
  }

  saveProgress(progress);
  renderProgress();
  questionView.hidden = true;
  const missed = [...new Set(missedTopics)];
  quizResult.innerHTML = `<p class="result-caption">Quiz complete</p><div class="result-score ${getScoreBand(score)}">${score}%</div><p>${correctAnswers} of ${questions.length} correct. ${score >= 80 ? 'Nice work!' : 'Reviewing these ideas will help them stick.'}</p>${missed.length
    ? `<div class="result-review"><strong>Topics to revisit</strong>${missed.map(escapeHtml).join(' · ')}</div>`
    : '<div class="result-review result-success">You got every question right. No topics to revisit this round.</div>'}<button class="button button-primary" id="retry-quiz" type="button">Try again</button>`;
  quizResult.hidden = false;
  quizResult.querySelector('#retry-quiz').addEventListener('click', startQuiz);
  document.querySelector('.progress-track').setAttribute('aria-valuenow', '100');
  document.querySelector('#progress-fill').style.width = '100%';
}

function renderProgress() {
  const { history, reviews } = readProgress();
  document.querySelector('#quiz-total').textContent = String(history.length);
  const average = history.length
    ? Math.round(history.reduce((total, item) => total + item.score, 0) / history.length) : null;
  document.querySelector('#average-score').textContent = average === null ? '—' : `${average}%`;
  document.querySelector('#review-total').textContent = String(reviews.length);

  const historyList = document.querySelector('#history-list');
  historyList.replaceChildren();
  if (!history.length) {
    historyList.innerHTML = '<p class="empty-state">Completed quizzes and scores will appear here.</p>';
  } else {
    for (const item of history.slice(0, 5)) {
      const row = document.createElement('div');
      row.className = 'history-row';
      row.innerHTML = `<span class="history-name">${escapeHtml(item.title)}</span><span class="score-pill ${getScoreBand(item.score)}">${Number(item.score)}%</span>`;
      historyList.append(row);
    }
  }

  const reviewList = document.querySelector('#review-list');
  reviewList.replaceChildren();
  if (!reviews.length) {
    reviewList.innerHTML = '<p class="empty-state">Missed concepts will appear here after your first quiz.</p>';
  } else {
    const sortedReviews = [...reviews].sort((first, second) => second.count - first.count
      || second.lastSeen.localeCompare(first.lastSeen)).slice(0, 6);
    for (const item of sortedReviews) {
      const row = document.createElement('div');
      row.className = 'review-row';
      row.innerHTML = `<span class="review-topic">${escapeHtml(item.topic)}</span><span class="review-count">Missed ${Number(item.count)} ${item.count === 1 ? 'time' : 'times'}</span>`;
      reviewList.append(row);
    }
  }
}

function showToast(message) {
  const toast = document.querySelector('#toast');
  toast.textContent = message;
  toast.classList.add('is-visible');
  window.clearTimeout(showToast.timeout);
  showToast.timeout = window.setTimeout(() => toast.classList.remove('is-visible'), 3000);
}

sourceInput.addEventListener('input', () => {
  const words = sourceInput.value.trim().match(/\S+/g) ?? [];
  document.querySelector('#word-count').textContent = `${words.length} ${words.length === 1 ? 'word' : 'words'}`;
  document.querySelector('#start-quiz').disabled = words.length < 5;
  if (sourceInput.value.trim() !== previousQuizMaterial) {
    questionView.hidden = true;
    quizResult.hidden = true;
    quizIntro.hidden = false;
  }
});

fileInput.addEventListener('change', async () => {
  const file = fileInput.files?.[0];
  if (!file) return;
  if (file.size > 2 * 1024 * 1024) {
    showToast('Choose a text file smaller than 2 MB.');
    fileInput.value = '';
    return;
  }
  try {
    sourceInput.value = await file.text();
    currentTitle = file.name;
    document.querySelector('#file-name').textContent = file.name;
    sourceInput.dispatchEvent(new Event('input'));
    showToast('File added to your lesson material.');
  } catch {
    showToast('This file could not be read. Try a .txt or .md file.');
  }
});

document.querySelector('#generate-notes').addEventListener('click', generateNotes);
document.querySelector('#start-quiz').addEventListener('click', startQuiz);
document.querySelector('#next-question').addEventListener('click', () => {
  if (document.querySelector('#next-question').disabled) return;
  if (questionIndex < questions.length - 1) {
    questionIndex += 1;
    renderQuestion();
  } else {
    finishQuiz();
  }
});

renderProgress();