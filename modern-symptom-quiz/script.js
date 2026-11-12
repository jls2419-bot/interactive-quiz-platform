const choices = document.querySelectorAll('.answer');
const result = document.querySelector('.result');
const resultText = document.querySelector('#result-text');
const retry = document.querySelector('.retry');

choices.forEach((choice) => {
  choice.addEventListener('click', () => {
    choices.forEach((item) => item.classList.remove('is-selected'));
    choice.classList.add('is-selected');
    resultText.textContent = choice.dataset.result;
    result.hidden = false;
    result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
});

retry.addEventListener('click', () => {
  choices.forEach((item) => item.classList.remove('is-selected'));
  result.hidden = true;
  choices[0].focus();
});
