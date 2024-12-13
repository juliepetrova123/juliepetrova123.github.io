const levelOneDataEasy = [
    {
        id: 0,
        imagePath: '../images/level-one/vector-one.svg',
        time: 8000,
    },
    {
        id: 1,
        imagePath: '../images/level-one/vector-3.svg',
        time: 5000,
    },
    {
        id: 2,
        imagePath: '../images/level-one/vector-4.svg',
        time: 6000,
    },
    {
        id: 3,
        imagePath: '../images/level-one/vector-5.svg',
        time: 6000,
    },
]
const levelOneDataHard = [
    {
        id: 0,
        imagePath: '../images/level-one/vector-6.svg',
        time: 4000,
    },
    {
        id: 1,
        imagePath: '../images/level-one/vector-7.svg',
        time: 4000,
    },
    {
        id: 2,
        imagePath: '../images/level-one/vector-8.svg',
        time: 3000,
    },
    {
        id: 3,
        imagePath: '../images/level-one/vector-9.svg',
        time: 3000,
    },
]

function chooseSVG() {
    let levelOneData
    if (localStorage.getItem('selectedDifficulty') === 'easy') {
        levelOneData = levelOneDataEasy
    } else {
        levelOneData = levelOneDataHard
    }
    const randomIndex = Math.floor(Math.random() * levelOneData.length);

    // Получение случайного элемента
    const selectedItem = levelOneData[randomIndex];

    // Возврат imagePath и time
    return {
        imagePath: selectedItem.imagePath,
        time: selectedItem.time
    };
}
function gameLevelOne () {
    //Выбираем случайную картинку
    const svgData = chooseSVG()
    // Создаем новый XMLHttpRequest для загрузки SVG из папки images
    console.log("gameLevelOne")
    const xhr = new XMLHttpRequest();
    xhr.open('GET', svgData.imagePath, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            // Получаем содержимое SVG
            const svgContent = xhr.responseText;
            //Вставляем svg на страницу
            document.getElementById('gameLevelOne').innerHTML += svgContent;

            //Отображаем подсказку
            const hint = document.getElementById('gameLevelOneHint');
            hint.innerHTML = "Чтобы начать игру, нажмите пробел на клавиатуре";
            hint.style.display = 'flex';

            const svg = document.getElementById("animated-svg-one");
            svg.classList.add("start-animation"); // Добавляем класс для старта анимации

            document.addEventListener('keydown', function(event) {
                if (event.code === 'Space' && localStorage.getItem('action') === 'game') {
                    event.preventDefault();  // Предотвращаем прокрутку страницы при нажатии пробела
                    hint.style.display = 'none';
                    const motion = document.getElementById('motion');
                    motion.beginElement();  // Запускаем анимацию

                    //Через заданное время переходим к вводу и проверке ответа
                    setTimeout(function() {
                        const gameLevelOne = document.getElementById('gameLevelOne');
                        if (gameLevelOne.contains(svg)) {
                            gameLevelOne.removeChild(svg);
                        }

                        check(svgData.time)
                    }, svgData.time);
                }
            });
        }
    };
    xhr.send();
}

//Ввод ответа
function check(rightAnswer) {
    openModalWindow("game-modal-check");
    if(localStorage.getItem('try') === 'second' && localStorage.getItem('action') === 'game') {
        document.getElementById('checkResult').style.display = 'none';
        document.getElementById('checkResultInput').style.display = 'flex';
        document.getElementById('checkInput').value = null;
    }
    localStorage.setItem('action', 'check-first');
    const levelOneCheckHandler = function () {
        const answerInput = document.getElementById('checkInput');
        const answer = answerInput.value;
        if (answer) {
           checkAnswer(rightAnswer, answer);
        } else {
            let confirmed = confirm('Для продолжения игры введите ответ!');
            if (confirmed) {
                return false
            }
        }

    };
    const levelOneCheckButton = document.getElementById('levelOneCheckButton');
    levelOneCheckButton.removeEventListener('click', levelOneCheckHandler);
    levelOneCheckButton.addEventListener('click', levelOneCheckHandler);
}

//Проверка ответа и вывод результата
function checkAnswer (rightAnswer, answer) {
    const bestValue = rightAnswer / 1000;
    let score;

    const chekingBlock = document.getElementById('checkResultInput');
    chekingBlock.style.display = 'none';
    const resultBlock = document.getElementById('checkResult');
    resultBlock.style.display = 'flex';

    const user = localStorage.getItem('userName');

    if (Math.abs(answer - bestValue) <= bestValue * 25 / 100) {
        score = 100;
        // foundStatistic.score += score;
        updateScore(user, score)
        document.getElementById('checkText').innerHTML = `Отличный результат!<br>Вы заработали ${score} баллов!<br><br>Правильный ответ: ${bestValue} секунд(-ы)`;
    } else if (Math.abs(answer - bestValue) <= bestValue * 50 / 100) {
        score = 50;
        updateScore(user, score)
        document.getElementById('checkText').innerHTML = `Неплохой результат!<br>Вы заработали ${score} баллов!<br><br>Правильный ответ: ${bestValue} секунд(-ы)`;
    } else {
        score = 0;
        document.getElementById('checkText').innerHTML = `Не совсем так...<br>Вы заработали ${score} баллов(<br><br>Правильный ответ: ${bestValue} секунд(-ы)`;
    }
}

//Выбор сложности
document.getElementById('difficultyChosenButton').addEventListener('click', function () {
    // Сохраняем выбранную сложность в localStorage
    const difficultyOptions = document.querySelectorAll('input[name="difficulty"]');
    let chosenDifficulty = '';
    difficultyOptions.forEach((option) => {
        if (option.checked) {
            chosenDifficulty = option.value;
        }
    });
    localStorage.setItem('selectedDifficulty', chosenDifficulty);

    localStorage.setItem('action', 'info');

    openModalWindow("game-modal-info");
    if (!localStorage.getItem('try')) {
        localStorage.setItem('try', 'first');
    }
    if (localStorage.getItem('try') === 'first') {
        document.getElementById('gameModalTitleTry').innerHTML = "Инструкция. Попытка 1"
    } else {
        document.getElementById('gameModalTitleTry').innerHTML = "Инструкция. Попытка 1";
    }
});

//Запуск игры - открытие инструкции
document.getElementById('levelOneStartButton').addEventListener('click', function () {
    localStorage.setItem('action', 'game');
    closeModalWindow("game-modal-info");

    gameLevelOne();
});

//Кнопка продолжения игры
document.getElementById('levelOneContinueButton').addEventListener('click', function () {
    if (!localStorage.getItem('try')) {
        localStorage.setItem('try', 'first');
    }
    if (localStorage.getItem('try') === 'first') {
        document.getElementById('gameModalTitleTry').innerHTML = "Инструкция. Попытка 2";
        document.getElementById('checkResult').style.display = 'none';

        localStorage.setItem('action', 'info');
        localStorage.setItem('try', 'second');
        openModalWindow("game-modal-info");
    } else {
        localStorage.setItem('action', 'result');
        localStorage.setItem('try', 'first');
        openModalWindow("game-modal-result");
    }
});

//Кнопка возврата на главную страницу для выбора уровня
document.getElementById('startGameButton2').addEventListener('click', function () {
    localStorage.setItem('action', 'level-choice');
    window.location.href = "../index.html";
    openModalWindow("game-modal-level-choice");
});

//Кнопка возврата на главную страницу для смены игрока
document.getElementById('openModalUserButton').addEventListener('mouseover', function(event) {
    const user = localStorage.getItem('userName');
    console.log(user);
    // Получаем текущую статистику из localStorage
    let statistics = JSON.parse(localStorage.getItem('gameStatistics')) || [];

    // Находим индекс объекта с соответствующим именем пользователя
    const index = statistics.findIndex(stat => stat.user === user);

    const score = statistics[index].score;

    document.getElementById('userInfo').style.display = 'block';
    document.getElementById('userInfo').innerHTML = `Пользователь: ${user}<br><br>Очки: ${score}`;
});
document.getElementById('openModalUserButton').addEventListener('mouseleave', function(event) {
    document.getElementById('userInfo').style.display = 'none';
});

//Кнопки выхода
document.getElementById('changeUserButton').addEventListener('click', function () {
    localStorage.removeItem('try');
    localStorage.removeItem('selectedLevel');
    localStorage.removeItem('action');
    localStorage.removeItem('userName');

    window.location.href = "../index.html";
});

const exitbuttons = document.querySelectorAll('.exit-button_in-modal');

exitbuttons.forEach(button => {
    button.addEventListener('click', function() {
        localStorage.removeItem('try');
        localStorage.removeItem('selectedLevel');
        // localStorage.removeItem('action');

        window.location.href = "../index.html";
    });
});
