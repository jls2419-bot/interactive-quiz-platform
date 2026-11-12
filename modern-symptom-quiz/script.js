// Question 1 stays in index.html. Add future questions here; navigation and
// answer/retry behavior are shared by every question.
const additionalQuestions = [
  {
    index: 'SOCIAL BATTERY INDEX',
    eyebrow: 'You finally have a free evening.',
    prompt: "Your friend suddenly invites you out. What's your first thought?",
    answers: [
      {
        text: 'Perfect! I was hoping someone would make plans.',
        feedback: 'The social butterfly: your energy seems to recharge around other people.',
      },
      {
        text: "Sounds fun, but who's going to be there?",
        feedback: 'The selective socializer: you enjoy company, but the right people make all the difference.',
      },
      {
        text: 'I want to go, but my bed is calling my name.',
        feedback: 'The cozy overthinker: your social life and your comfort zone are in constant negotiation.',
      },
      {
        text: 'Sorry, I already have plans… with myself.',
        feedback: 'The professional recharger: protecting your alone time is practically a full-time job.',
      },
    ],
  },
  {
    index: 'DIGITAL DISTRACTION INDEX',
    eyebrow: 'You pick up your phone to check the time.',
    prompt: 'What happens next?',
    answers: [
      {
        text: 'I check the time and put it down.',
        feedback: 'The focused minimalist: your phone has a job, and you keep it on task.',
      },
      {
        text: 'I reply to a few messages first.',
        feedback: 'The connected multitasker: checking the time comes with a social detour.',
      },
      {
        text: 'I scroll for twenty minutes and forget the time.',
        feedback: 'The accidental explorer: one quick glance becomes an unexpected journey.',
      },
      {
        text: 'I forget why I picked it up.',
        feedback: 'The mystery opener: your phone is unlocked, but your mission remains unknown.',
      },
    ],
  },
];

const firstQuestion = document.querySelector('.quiz-card');
const questions = [firstQuestion];

additionalQuestions.forEach((question, index) => {
  const number = index + 2;
  const card = firstQuestion.cloneNode(true);
  card.id = `question-${number}`;
  card.hidden = true;
  card.setAttribute('aria-labelledby', `question-title-${number}`);
  card.querySelector('.question-meta span').textContent = `QUESTION ${String(number).padStart(2, '0')}`;
  card.querySelector('.question-meta span:last-child').textContent = `⌇ ${question.index}`;
  card.querySelector('.eyebrow').textContent = question.eyebrow;
  const title = card.querySelector('h1');
  title.id = `question-title-${number}`;
  title.textContent = question.prompt;
  card.querySelector('#result-text').id = `result-text-${number}`;
  card.querySelectorAll('.answer').forEach((answer, answerIndex) => {
    answer.querySelector('span:nth-child(2)').textContent = question.answers[answerIndex].text;
    answer.dataset.result = question.answers[answerIndex].feedback;
  });
  questions[questions.length - 1].after(card);
  questions.push(card);
});

let currentQuestion = 0;
const navigation = document.createElement('nav');
navigation.setAttribute('aria-label', 'Quiz questions');
navigation.className = 'answers';
navigation.style.marginTop = '24px';
navigation.style.maxWidth = '760px';
// Reuse the existing button styles for consistent typography and colors.
const previous = document.createElement('button');
const next = document.createElement('button');
[previous, next].forEach((button) => {
  button.type = 'button';
  button.className = 'answer';
  button.style.gridTemplateColumns = '1fr';
  navigation.append(button);
});
questions[questions.length - 1].after(navigation);

function showQuestion(index, moveFocus = true) {
  currentQuestion = index;
  questions.forEach((card, questionIndex) => {
    card.hidden = questionIndex !== index;
    const meter = card.querySelector('.meter');
    meter.setAttribute('aria-label', `Progress: question ${questionIndex + 1} of ${questions.length}`);
    meter.querySelector('span').style.width = `${((questionIndex + 1) / questions.length) * 100}%`;
  });
  document.querySelector('.topbar p span').textContent = `${String(index + 1).padStart(2, '0')} / ${String(questions.length).padStart(2, '0')}`;
  document.title = `Modern Symptoms · Question ${index + 1}`;
  previous.style.display = index === 0 ? 'none' : '';
  next.style.display = index === questions.length - 1 ? 'none' : '';
  previous.textContent = `← QUESTION ${String(index).padStart(2, '0')}`;
  next.textContent = `QUESTION ${String(index + 2).padStart(2, '0')} →`;
  if (moveFocus) {
    const title = questions[index].querySelector('h1');
    title.tabIndex = -1;
    title.focus();
  }
}

questions.forEach((card) => {
  const choices = card.querySelectorAll('.answer');
  const result = card.querySelector('.result');
  const resultText = result.querySelector('p');
  choices.forEach((choice) => {
    choice.addEventListener('click', () => {
      choices.forEach((item) => item.classList.remove('is-selected'));
      choice.classList.add('is-selected');
      resultText.textContent = choice.dataset.result;
      result.hidden = false;
      result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  });
  card.querySelector('.retry').addEventListener('click', () => {
    choices.forEach((item) => item.classList.remove('is-selected'));
    result.hidden = true;
    choices[0].focus();
  });
});

previous.addEventListener('click', () => showQuestion(currentQuestion - 1));
next.addEventListener('click', () => showQuestion(currentQuestion + 1));
document.querySelector('.brand').addEventListener('click', () => showQuestion(0));
showQuestion(0, false);
