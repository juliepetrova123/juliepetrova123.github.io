const questions = [
    {
        question: "А голос у него был не такой, как у почтальона Печкина, дохленький. У Гаврюши голосище был, как у электрички. Он _____ _____ на ноги поднимал.",
        answers: [
            { answer: "Пол деревни, за раз", isRight: false },
            { answer: "Полдеревни, зараз", isRight: true },
            { answer: "Пол-деревни, за раз", isRight: false }
        ],
        comment: "Правильно! Раздельно существительное будет писаться в случае наличия дополнительного слова между существительным и частицей...",
    },
    {
        question: "А эти слова как пишутся?",
        answers: [
            { answer: "Капуччино и эспрессо", isRight: false },
            { answer: "Каппуччино и экспресо", isRight: false },
            { answer: "Капучино и эспрессо", isRight: true }
        ],
        comment: "Конечно! По орфографическим нормам русского языка единственно верным написанием будут «капучино» и «эспрессо».",
    },
    {
        question: "Как нужно писать?",
        answers: [
            { answer: "Черезчур", isRight: false },
            { answer: "Черес-чур", isRight: false },
            { answer: "Чересчур", isRight: true }
        ],
        comment: "Да! Это слово появилось от соединения предлога «через» и древнего слова «чур»...",
    },
    {
        question: "Где допущена ошибка?",
        answers: [
            { answer: "Аккордеон", isRight: false },
            { answer: "Белиберда", isRight: false },
            { answer: "Эпелепсия", isRight: true }
        ],
        comment: "Верно! Это слово пишется так: «эпИлепсия».",
    },
];

const range = (from, to) => [...Array(to - from).keys()].map(v => v + from);

const shuffle = a => {
    for (let i = 1; i < a.length; ++i) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
};

let currentQuestionIndex;
let answered;
let correctAnswersCount;
let mixedIds = [];

function resetQuiz() {
    const ids = range(0, questions.length);
    mixedIds = shuffle(ids);
    currentQuestionIndex = 0;
    answered = false;
    correctAnswersCount = 0;
}

function displayQuestion() {
    const questionsElement = document.querySelector('.questions');
    const answersElement = document.querySelector('.answers');
    const resultElement = document.querySelector('.result');
    const questionCounter = document.querySelector('.question-counter');

    // Сбрасываем состояние
    answered = false;
    resultElement.innerHTML = '';
    answersElement.innerHTML = '';

    // Проверяем, есть ли еще вопросы
    if (currentQuestionIndex >= mixedIds.length) {
        displayStatistics();
        return;
    }

    // Получаем текущий вопрос
    const questionIndex = mixedIds[currentQuestionIndex];
    const currentQuestion = questions[questionIndex];

    // Отображаем вопрос и номер
    const questionDiv = document.createElement('div');
    questionDiv.className = 'question';

    questionDiv.innerHTML = `
        <p>${currentQuestionIndex + 1}. ${currentQuestion.question}</p>
        <img alt="Индикатор" class="question-image">
    `;

    const ind = currentQuestionIndex;

    // Добавляем возможность щелкнуть по вопросу для получения ответа
    questionDiv.addEventListener('click', function() {
        showCorrectAnswer(ind)
    });
    questionsElement.appendChild(questionDiv);

    questionCounter.textContent = `Вопрос ${currentQuestionIndex + 1} из ${questions.length}`;

    currentQuestion.answers.forEach((answer) => {
        const answerDiv = document.createElement('div');
        answerDiv.className = 'answer';
        answerDiv.textContent = answer.answer;

        answerDiv.addEventListener('click', function () {
            displayResult(answer.isRight, currentQuestion.comment, answerDiv, questionDiv);
        });

        answersElement.appendChild(answerDiv);
    });
}

function displayResult(isRight, comment, selectedAnswerDiv, questionDiv) {
    if (answered) return;

    const resultElement = document.querySelector('.result');
    let questionImage = questionDiv.querySelector('.question-image');

    // Отображение результата
    if (isRight) {
        correctAnswersCount++;
        resultElement.innerHTML = comment;
        resultElement.classList.add('result-correct');
        selectedAnswerDiv.classList.add('answer-selected-correct');

        const answers = document.querySelectorAll('.answer');
        setTimeout(() => {
            answers.forEach((div, index) => {
                setTimeout(() => {
                    if (!div.classList.contains('answer-selected-correct')) {
                        div.classList.add('moved');
                    } else {
                        div.classList.add('increased');
                    }
                }, index * 700);
            });
            questionImage.src = "../../../images/galka.png";
            questionImage.classList.add('question-image_active');
        }, 2000);
    } else {
        resultElement.textContent = 'Неправильно!';
        resultElement.classList.add('result-wrong');
        selectedAnswerDiv.classList.add('answer-selected-wrong');

        const answers = document.querySelectorAll('.answer');

        setTimeout(() => {
            answers.forEach((div, index) => {
                setTimeout(() => {
                    div.classList.add('moved');
                }, index * 700);
            });
            questionImage.src = "../../../images/crestic.png";
            questionImage.classList.add('question-image_active');
        }, 2000);
    }

    answered = true;

    // Автоматический переход к следующему вопросу через 7 секунд
    setTimeout(() => {
        currentQuestionIndex++;

        resultElement.classList.remove('wrong');
        resultElement.classList.remove('correct');

        displayQuestion();
    }, 7000);
}

function showCorrectAnswer(questionIndex) {
    // Проверяем, был ли вопрос уже выбран
    if (currentQuestionIndex >= mixedIds.length) {
        const currentQuestion = questions[mixedIds[questionIndex]];
        const answersElement = document.querySelector('.answers');
        const answerDiv = document.createElement('div');
        answerDiv.className = 'answer';
        answerDiv.textContent = currentQuestion.answers.find(ans => ans.isRight).answer

        answersElement.innerHTML = '';
        answersElement.appendChild(document.createElement('div')).textContent = 'Правильный ответ: ';
        answersElement.appendChild(answerDiv);
    }
}

function displayStatistics() {
    const questionElement = document.querySelector('.questions');
    const answersElement = document.querySelector('.answers');
    const resultElement = document.querySelector('.result');
    const questionCounter = document.querySelector('.question-counter');
    const againButton = document.querySelector('.again-button');

    questionCounter.textContent = 'Вопросы закончились!';
    resultElement.innerHTML = `Вы правильно ответили на ${correctAnswersCount} из ${questions.length} вопросов.<br> Нажмите на вопрос, чтобы увидеть правильный ответ`;

    againButton.classList.add('again-button_active');

    againButton.addEventListener('click', function() {
        //Сбрасываем все элементы на странице
        questionElement.textContent = '';
        answersElement.textContent = '';
        resultElement.innerHTML = '';
        questionCounter.innerHTML = '';
        againButton.classList.remove('again-button_active');

        // Запускаем показ вопросов заново
        resetQuiz();
        displayQuestion();
    });
}

// Показываем первый вопрос при загрузке страницы.
resetQuiz();
displayQuestion();
