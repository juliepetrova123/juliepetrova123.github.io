const levelOneDataEasy = [
    {
        id: 0,
        imagePath: '../images/level-two/vector-one.svg',
    },
    {
        id: 1,
        imagePath: '../images/level-two/vector-two.svg',
    },
    {
        id: 2,
        imagePath: '../images/level-two/vector-3.svg',
    },
    {
        id: 3,
        imagePath: '../images/level-two/vector-4.svg',
    },
    {
        id: 4,
        imagePath: '../images/level-two/vector-5.svg',
    }
]
const levelOneDataHard = [
    {
        id: 0,
        imagePath: '../images/level-two/vector-one.svg',
    },
    {
        id: 1,
        imagePath: '../images/level-two/vector-two.svg',
    },
    {
        id: 2,
        imagePath: '../images/level-two/vector-3.svg',
    },
    {
        id: 3,
        imagePath: '../images/level-two/vector-4.svg',
    },
    {
        id: 4,
        imagePath: '../images/level-two/vector-5.svg',
    },
    {
        id: 5,
        imagePath: '../images/level-two/vector-6.svg',
    },
    {
        id: 6,
        imagePath: '../images/level-two/vector-7.svg',
    },
    {
        id: 7,
        imagePath: '../images/level-two/vector-8.svg',
    },
    {
        id: 8,
        imagePath: '../images/level-two/vector-9.svg',
    },
]

function shuffleIndexes(length) {
    const indices = Array.from(Array(length).keys()); // Создаем массив индексов от 0 до length-1
    for (let i = length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [indices[i], indices[j]] = [indices[j], indices[i]]; // Меняем местами индексы
    }
    return indices;
}

// Функция для загрузки SVG
function loadSVG(svgData, callback) {
    const xhr = new XMLHttpRequest();
    console.log(svgData.imagePath);
    xhr.open('GET', svgData.imagePath, true);

    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                callback(null, xhr.responseText);  // Успешная загрузка, передаем данные в коллбэк
            } else {
                callback(new Error(`Ошибка загрузки: ${xhr.status}`)); // Передаем ошибку в коллбэк
            }
        }
    };

    xhr.send();
}

// Функция для случайного размещения изображения
function showImageRandomly() {
    // Генерируем случайные координаты
    const randomX = Math.random() * (1200 - 100); // Убираем 100 для ширины изображения
    const randomY = Math.random() * (650 - 100); // Убираем 100 для высоты изображения

    const image = document.getElementById('randomImage');
    // Устанавливаем новые координаты
    image.style.left = randomX + 'px';
    image.style.top = randomY + 'px';
    image.style.display = 'block'; // Показываем изображение
}

function getRandomSecondsNumber (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function gameLevelTwo () {
    // Перемешиваем индексы
    let shuffledImages
    if (localStorage.getItem('selectedDifficulty') === 'easy') {
        const shuffledIndices = shuffleIndexes(levelOneDataEasy.length);
        // Загружаем изображения по перемешанным индексам
        shuffledImages = shuffledIndices.map(index => levelOneDataEasy[index]);
    } else {
        const shuffledIndices = shuffleIndexes(levelOneDataHard.length);
        // Загружаем изображения по перемешанным индексам
        shuffledImages = shuffledIndices.map(index => levelOneDataHard[index]);
    }

    //Генерируем количество секунд
    let randomNumber
    if (localStorage.getItem('selectedDifficulty') === 'easy') {
        randomNumber = getRandomSecondsNumber(3, 10);
    } else {
        randomNumber = getRandomSecondsNumber(3, 7);
    }

    let gameLevelTwoWrapper = document.getElementById('gameLevelTwoWrapper')
    gameLevelTwoWrapper.classList.add('game-wrapper_level-two-active');
    const hint = document.getElementById('gameLevelTwoHint');
    hint.innerHTML = `Задача - нажать на особенный ключ через ${randomNumber} секунд(-ы)<br>Чтобы начать игру, нажмите пробел на клавиатуре`;
    hint.style.display = 'flex';

    // Загружаем на страницу svg элементы
    shuffledImages.forEach((image) => {
        loadSVG(image, (error, svgData) => {
            if (error) {
                console.error(error);
            } else {
                console.log("SVG загружено:", svgData);
                // Здесь вы можете работать с загруженным SVG
                document.getElementById('gameLevelTwo').innerHTML += svgData
            }
        });
    });
    const svgs = document.getElementsByClassName("animated-svg");
    for (let svg of svgs) {
        svg.classList.add("start-animation"); // Добавляем класс для старта анимации
        svg.classList.add("svg_level-two");
    }

    document.addEventListener('keydown', function(event) {
        if (event.code === 'Space' && localStorage.getItem('action') === 'game') {
            console.log(19)
            const startTime = new Date();
            console.log(startTime, startTime.getTime())
            event.preventDefault();  // Предотвращаем прокрутку страницы при нажатии пробела

            //Включаем анимацию svg
            const motions = document.querySelectorAll('#motion');
            motions.forEach(motion => {
                console.log(motion);
                motion.beginElement(); // Запускаем анимацию для каждого найденного элемента
            });

            //Добавляем правильный ключик в случаное место
            showImageRandomly();

            document.getElementById('randomImage').addEventListener('click', function() {
                console.log(1)
                const endTime = new Date();
                console.log(endTime, endTime.getTime())
                const secondsPassed = Math.floor((endTime.getTime() - startTime.getTime()) / 1000);
                console.log(secondsPassed)

                const svgs = document.querySelectorAll('#animated-svg');
                const gameLevelTwo = document.getElementById('gameLevelTwo');
                svgs.forEach(svg => {
                    gameLevelTwo.removeChild(svg);
                });

                this.style.display = 'none';
                document.getElementById('gameLevelTwoHint').style.display = 'none';
                gameLevelTwoWrapper.classList.remove('game-wrapper_level-two-active');

                openModalWindow("game-modal-check");
                localStorage.setItem('action', 'check-first');
                checkAnswerTwo(randomNumber, startTime.getTime(), endTime.getTime())
            })
        }
    });
}

//Проверка ответа и вывод результата
function checkAnswerTwo (rightSecondsPassed, startTime, endTime) {
    const secondsPassed = Math.floor((endTime - startTime) / 1000);

    let score;

    const resultBlock = document.getElementById('checkResult');
    resultBlock.style.display = 'flex';

    const user = localStorage.getItem('userName');

    if (Math.abs(secondsPassed - rightSecondsPassed) <= rightSecondsPassed * 25 / 100) {
        score = 100;
        updateScore(user, score)
        document.getElementById('checkText').innerHTML = `Отличный результат!<br>Вы заработали ${score} баллов!<br><br>Ваш ответ: ${secondsPassed} секунд(-ы)`;
    } else if (Math.abs(secondsPassed - rightSecondsPassed) <= rightSecondsPassed * 50 / 100) {
        score = 50;
        updateScore(user, score)
        document.getElementById('checkText').innerHTML = `Неплохой результат!<br>Вы заработали ${score} баллов!<br><br>Ваш ответ: ${secondsPassed} секунд(-ы)`;
    } else {
        score = 0;
        document.getElementById('checkText').innerHTML = `Не совсем так...<br>Вы заработали ${score} баллов(<br><br>Ваш ответ: ${secondsPassed} секунд(-ы)`;
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
document.getElementById('levelTwoStartButton').addEventListener('click', function () {
    localStorage.setItem('action', 'game');
    closeModalWindow("game-modal-info");

    gameLevelTwo();
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

//Кнопка возврата на главную страницу для выбора уровня
document.getElementById('startGameButton2').addEventListener('click', function () {
    // openModalWindow("game-modal-level-choice");
    localStorage.setItem('action', 'level-choice');
    window.location.href = "../index.html";
    openModalWindow("game-modal-level-choice");
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

