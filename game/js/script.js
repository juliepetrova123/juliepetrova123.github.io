// Функция для сохранения имени в localStorage
function saveName() {
    const nameInput = document.getElementById('nameInput');
    const name = nameInput.value;
    const passwordInput = document.getElementById('passwordInput');
    const password = passwordInput.value;

    let users = JSON.parse(localStorage.getItem('gameUsers')) || [];
    const index = users.findIndex(stat => stat.user === name);

    if (name && password && index === -1) {
        localStorage.setItem('userName', name);
        const statistic = {
            user: name,
            score: 0
        }
        saveStatistics(statistic);
        const user = {
            user: name,
            password: password
        }
        saveUsers(user)
        return true
    } else if (name && password && index !== -1) {
        const realPassword = users[index].password;
        if (realPassword === password) {
            localStorage.setItem('userName', name);
            return true
        } else {
            let confirmed = confirm('Неверный пароль! Попробуйте еще раз');
            if (confirmed) {
                openModalWindow('game-modal-name-input')
                return false
            }
        }
    } else {
        let confirmed = confirm('Пожалуйста, введите логин и пароль!');
        if (confirmed) {
            openModalWindow('game-modal-name-input')
            return false
        }
    }
}

//Обновление счета
function updateScore(userName, newScore) {
    // Получаем текущую статистику из localStorage
    let statistics = JSON.parse(localStorage.getItem('gameStatistics')) || [];

    // Находим индекс объекта с соответствующим именем пользователя
    const index = statistics.findIndex(stat => stat.user === userName);

    if (index !== -1) {
        // Обновляем score для найденного объекта
        statistics[index].score += newScore;

        // Сохраняем обновленный массив обратно в localStorage
        localStorage.setItem('gameStatistics', JSON.stringify(statistics));
        console.log(`Score для пользователя ${userName} обновлен на ${newScore}.`);
    } else {
        console.log(`Пользователь с именем ${userName} не найден.`);
    }
}

// Функция для сохранения статистики
function saveStatistics(statistic) {
    // Получаем текущую статистику из localStorage, если она есть
    let statistics = JSON.parse(localStorage.getItem('gameStatistics')) || [];

    // Добавляем новую информацию о пользователе в массив
    statistics.push(statistic);

    // Сохраняем обновленный массив обратно в localStorage
    localStorage.setItem('gameStatistics', JSON.stringify(statistics));
}

// Функция для сохранения логина и пароля юзера
function saveUsers(user) {
    // Получаем текущую статистику из localStorage, если она есть
    let users = JSON.parse(localStorage.getItem('gameUsers')) || [];

    // Добавляем новую информацию о пользователе в массив
    users.push(user);

    // Сохраняем обновленный массив обратно в localStorage
    localStorage.setItem('gameUsers', JSON.stringify(users));
}

function getStatistics() {
    return JSON.parse(localStorage.getItem('gameStatistics')) || [];
}

function openModalWindow(modalWindowId) {
    const allModalWindows = document.getElementsByClassName('game-modal');
    for (let i = 0; i < allModalWindows.length; i++) {
        allModalWindows[i].style.display = 'none';
    }

    try {
        const startButton = document.getElementById('startGameButton')
        startButton.style.display = 'none';
    } catch (e) {}

    const modalWindow = document.getElementById(modalWindowId)
    modalWindow.style.display = 'flex';
}

function closeModalWindow(modalWindowId) {
    const modalWindow = document.getElementById(modalWindowId)
    modalWindow.style.display = 'none';

    try {
        const startButton = document.getElementById('startGameButton')
        startButton.style.display = 'block';
    } catch (e) {}

    if (localStorage.getItem('action') === 'difficulty-choice') {
        const difficultyModalWindow = document.getElementById('game-modal-difficulty-choice');
        difficultyModalWindow.style.display = 'flex';
    }
    if (localStorage.getItem('action') === 'info') {
        const difficultyModalWindow = document.getElementById('game-modal-info');
        difficultyModalWindow.style.display = 'flex';
    }
    if (localStorage.getItem('action') === 'check-first') {
        const difficultyModalWindow = document.getElementById('game-modal-check');
        difficultyModalWindow.style.display = 'flex';
    }
    if (localStorage.getItem('action') === 'result') {
        const difficultyModalWindow = document.getElementById('game-modal-result');
        difficultyModalWindow.style.display = 'flex';
    }
    if (localStorage.getItem('action') === 'name-input') {
        const difficultyModalWindow = document.getElementById('game-modal-name-input');
        difficultyModalWindow.style.display = 'flex';
        const startButton = document.getElementById('startGameButton')
        startButton.style.display = 'none';
    }

}

//Смена темы модальных окон
function setTheme(theme) {
    const allModalWindows = document.getElementsByClassName('game-modal');
    for (let i = 0; i < allModalWindows.length; i++) {
        allModalWindows[i].classList.remove(`game-modal_gryffindor`);
        allModalWindows[i].classList.remove(`game-modal_hufflepuff`);
        allModalWindows[i].classList.remove(`game-modal_ravenclaw`);
        allModalWindows[i].classList.remove(`game-modal_slytherin`);
        allModalWindows[i].classList.add(`game-modal_${theme}`);
    }
}

//Показ статистики
function showStatistics() {
    let stats = getStatistics();

    // Сортировка массива по score в порядке убывания
    stats.sort((a, b) => b.score - a.score);

    const container = document.getElementById('statisticsContainer');
    container.innerHTML = '';

    if (container) {
        stats.forEach((stat, index) => {
            const statElement = document.createElement('div');
            statElement.textContent = `${index + 1}. ${stat.user}: ${stat.score}`;
            statElement.classList.add('game-modal__stat-text');
            container.appendChild(statElement);
        });
    }
}


//Обработка нажатий на кнопки
document.getElementById('openModalStatisticsButton').addEventListener('click', function() {
    openModalWindow("game-modal-statistics");
    showStatistics();
});
document.getElementById('openModalSettingsButton').addEventListener('click', function() {
    openModalWindow("game-modal-settings");
});

document.getElementById('gryffindorButton').addEventListener('click', function () {
    setTheme('gryffindor');
});
document.getElementById('hufflepuffButton').addEventListener('click', function () {
    setTheme('hufflepuff');
});
document.getElementById('ravenclawButton').addEventListener('click', function () {
    setTheme('ravenclaw');
});
document.getElementById('slytherinButton').addEventListener('click', function () {
    setTheme('slytherin');
});

document.getElementById('startGameButton').addEventListener('click', function () {
    openModalWindow("game-modal-level-choice");
});
document.getElementById('startGameButton1').addEventListener('click', function () {
    const isNameSaved = saveName()
    if (isNameSaved) {
        openModalWindow("game-modal-level-choice");
    }
});

document.getElementById('levelChosenButton').addEventListener('click', function(event) {
    // Получаем выбранный уровень
    const selectedLevel = document.querySelector('input[name="level"]:checked');

    // Сохраняем выбранный уровень в localStorage
    localStorage.setItem('selectedLevel', selectedLevel.value);
    localStorage.setItem('action', 'difficulty-choice');

    if (selectedLevel.value === 'first') {
        window.location.href = "levels/level-one.html";
    } else {
        window.location.href = "levels/level-two.html";
    }
});

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
    console.log('user clicked');
    localStorage.removeItem('try');
    localStorage.removeItem('selectedLevel');
    localStorage.removeItem('action');
    localStorage.removeItem('userName');

    localStorage.setItem('action', 'name-input');
    openModalWindow("game-modal-name-input");
    document.getElementById('nameInput').value = null;
    document.getElementById('passwordInput').value = null;
});


window.onload = function() {
    if (!localStorage.getItem('action')) {
        localStorage.setItem('action', 'name-input');
    }
    if (localStorage.getItem('action') !== 'name-input') {
        try {
            const startButton = document.getElementById('startGameButton')
            startButton.style.display = 'block';
        } catch (e) {}
        closeModalWindow("game-modal-name-input");
    }
    const action = localStorage.getItem("action");
    if (action === 'level-choice') {
        openModalWindow("game-modal-level-choice");
    }
}