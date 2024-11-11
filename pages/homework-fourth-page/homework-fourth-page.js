let draggedItem;

function createItem() {
    const input = document.getElementById('inputText');
    const text = input.value;

    if (text) {
        const newItem = document.createElement('div');
        newItem.className = 'draggable';
        newItem.draggable = true;
        newItem.textContent = text;

        newItem.addEventListener('dragstart', function() {
            draggedItem = newItem;
            setTimeout(() => {
                newItem.style.display = 'none';
            }, 0);
        });

        newItem.addEventListener('dragend', function() {
            setTimeout(() => {
                draggedItem = null;
                newItem.style.display = 'block';
            }, 0);
        });

        document.querySelector('#box1').appendChild(newItem);
        input.value = '';
    }
}

document.querySelectorAll('.box').forEach(box => {
    box.addEventListener('dragover', function(e) {
        e.preventDefault();
        this.classList.add('over');
    });

    box.addEventListener('dragleave', function() {
        this.classList.remove('over');
    });

    box.addEventListener('drop', function(e) {
        e.preventDefault();
        this.classList.remove('over');
        if (draggedItem) {
            this.appendChild(draggedItem);
        }
    });
});
