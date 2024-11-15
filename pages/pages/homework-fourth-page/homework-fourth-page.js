let draggedElement = null;

const associativeArray = {};

function createItems() {
    const inputText = document.getElementById('inputText').value;
    if (inputText === '') {
        return;
    }
    const elements = inputText.split('-').map(e => e.trim());

    const lowercaseWords = [];
    const uppercaseWords = [];
    const numbers = [];

    elements.forEach(element => {
        if (!isNaN(element)) {
            numbers.push(Number(element));
        } else if (element[0] === element[0].toLowerCase()) {
            lowercaseWords.push(element);
        } else if (element[0] === element[0].toUpperCase()) {
            uppercaseWords.push(element);
        }
    });

    lowercaseWords.sort();
    uppercaseWords.sort();
    numbers.sort((a, b) => a - b);

    lowercaseWords.forEach((word, index) => {
        const randomColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
        associativeArray[`a${index + 1}`] = {
            value: word,
            color: randomColor,
            visible: true,
        };
    });

    uppercaseWords.forEach((word, index) => {
        const randomColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
        associativeArray[`b${index + 1}`] = {
            value: word,
            color: randomColor
        };
    });

    numbers.forEach((num, index) => {
        const randomColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
        associativeArray[`n${index + 1}`] = {
            value: num,
            color: randomColor
        };
    });

    //Очистка перед добавлением новых элементов
    const box2 = document.getElementById('box2');
    box2.innerHTML = '';
    const box3 = document.getElementById('box3');
    box3.innerHTML = '';
    const box4 = document.getElementById('box4');
    box4.innerHTML = '';

    Object.entries(associativeArray).forEach(([key, { value, color }]) => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'draggable';
        itemDiv.textContent = `${key} ${value}`;
        itemDiv.style.backgroundColor = color;
        itemDiv.style.color = '#FFFFFF';
        itemDiv.draggable = true;
        itemDiv.ondragstart = drag;
        itemDiv.id = key;
        box2.appendChild(itemDiv);
    });
}

function allowDrop(event) {
    event.preventDefault();
}

function drag(event) {
    draggedElement = event.target;
    event.dataTransfer.setData("text", event.target.innerText);
    event.dataTransfer.setData("source", event.target.parentNode.id);
}

function drop(event) {
    event.preventDefault();
    const data = event.dataTransfer.getData("text");
    const sourceId = event.dataTransfer.getData("source");
    const sourceBox = document.getElementById(sourceId);

    const box2 = document.getElementById('box2');
    const box3 = document.getElementById('box3');

    //Если перетаскиваем внутри блока 2 или не в рамках блоков 2 и 3
    if (sourceId === 'box2' && event.target === box2 || sourceId !== 'box2' && sourceId !== 'box3') {
        return;
    }
    //Если перетаскиваем внутри блока 3
    else if (sourceId === 'box3' && event.target === box3) {
        const rect = box3.getBoundingClientRect();

        const offsetX = event.clientX - rect.left;
        const offsetY = event.clientY - rect.top;

        draggedElement.className = 'draggable';
        draggedElement.style.position = "absolute";
        draggedElement.style.left = `${offsetX - draggedElement.offsetWidth / 2}px`;
        draggedElement.style.top = `${offsetY - draggedElement.offsetHeight / 2}px`;

        if (!box3.contains(draggedElement)) {
            box3.appendChild(draggedElement);
        }
    }
    //Если перетаскиваем в блок 3 (из блока 2)
    else if (event.target === box3) {
        const rect = box3.getBoundingClientRect();

        const offsetX = event.clientX - rect.left;
        const offsetY = event.clientY - rect.top;

        const newElement = document.createElement('div');
        newElement.className = 'draggable';
        newElement.style.position = "absolute";
        newElement.style.left = `${offsetX - newElement.offsetWidth / 2}px`;
        newElement.style.top = `${offsetY - newElement.offsetHeight / 2}px`;
        newElement.draggable = true;
        newElement.innerText = data;
        newElement.ondragstart = drag;
        newElement.onclick = function() {
            addTextToBlock4(data.split(' ')[1]);
        };

        if (!box3.contains(newElement)) {
            box3.appendChild(newElement);
        }
        const element = document.getElementById(data.split(' ')[0]);
        element.style.display = 'none';
    }
    //Если перетаскиваем в блок 2 (из блока 3)
    else {
        const element = document.getElementById(data.split(' ')[0]);
        element.style.display = 'block';

        const items = sourceBox.getElementsByClassName('draggable');
        for (let i = 0; i < items.length; i++) {
            if (items[i].innerText === data) {
                sourceBox.removeChild(items[i]);
                break;
            }
        }
    }
}

function addTextToBlock4(text) {
    const textOutput = document.getElementById('box4');
    const newText = document.createElement('div');
    newText.textContent = text;
    newText.style.margin = '5px 0';
    textOutput.appendChild(newText);
}
