const inputBox = document.getElementById('enter-task') as HTMLInputElement;
const listContainer = document.getElementById('list-container');

function addTask() {

    if (!inputBox || !listContainer) return;

    if (inputBox.value === '') {
        alert('Please enter a task');
    } else {
        let li = document.createElement("li");
        li.textContent = inputBox.value; 
        listContainer.appendChild(li);

        let span = document.createElement("span");
        span.textContent = "x";  
        li.appendChild(span);
    }
    inputBox.value = '';  
}



listContainer?.addEventListener("click", function(e) {
    const target = e.target as HTMLElement;

    if (target.tagName === "LI") {
        target.classList.toggle("done");
    } else if (target.tagName === "SPAN") {
        target.parentElement?.remove();
    }
}, false);
