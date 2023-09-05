const sortButton = document.querySelector("#sort");
var sortStatus = "ascending";

function getAndUpdate(){
    console.log("Updating List...");
    task = document.getElementById('title').value;
    desc = document.getElementById('description').value;
    dte =document.getElementById('date').value;
    cate =document.getElementById('typeOfWork').value; 
    if(task===""||desc===""||dte===""||cate===""){
        alert("enter Task's data");
        return;
    }
    if (localStorage.getItem('itemsJson')==null){
        itemJsonArray = [];
        itemJsonArray.push([task, desc,dte,cate]);
        localStorage.setItem('itemsJson', JSON.stringify(itemJsonArray))
    }
    else{
        itemJsonArrayStr = localStorage.getItem('itemsJson')
        itemJsonArray = JSON.parse(itemJsonArrayStr);
        itemJsonArray.push([task, desc,dte,cate]);
        localStorage.setItem('itemsJson', JSON.stringify(itemJsonArray))
    }
    update();
}

function update(){
    if (localStorage.getItem('itemsJson')==null){
        itemJsonArray = []; 
        localStorage.setItem('itemsJson', JSON.stringify(itemJsonArray))
    } 
    else{
        itemJsonArrayStr = localStorage.getItem('itemsJson')
        itemJsonArray = JSON.parse(itemJsonArrayStr); 
    }
    let tableBody = document.getElementById("tableBody");
    let str = "";
    itemJsonArray.forEach((element, index) => {
        str += `
        <td scope="row" class="read">
        <input type="checkbox" onchange="complete(event)" class="radioBtn"></td>
        <td class="td content">${element[0]}</td>
        <td class="td">${element[1]}</td> 
        <td class="td">${element[3]}</td>
        <td class="td">${element[2]}</td>
        <td>
        <button class="btn btn-sm btn-primary" onclick="deleted(${index})">Delete</button> 
        <button class="btn btn-sm btn-primary editbutton" onclick="editTask(${index})">Edit</button>
        </tr>
        `;
    });

    tableBody.innerHTML = str;
}

function editTask(i) {
    itemJsonArrayStr = localStorage.getItem('itemsJson');
    itemJsonArray = JSON.parse(itemJsonArrayStr); 
    let newValueOfTask = prompt("Update the Task's name");
    let newvalueOfDes = prompt("Update Task's detail"); // Prompt for task details
    let promptDate = prompt("Enter Date (YYYY-MM-DD):");
    let dateParts = promptDate.split('-');
    let formattedDate = '';

    if (dateParts.length === 3) {
        let day = parseInt(dateParts[0], 10);
        let month = parseInt(dateParts[1], 10);
        let year = parseInt(dateParts[2], 10);
        let newDateOfTask = new Date(year, month - 1, day);
        formattedDate = `${day}-${month}-${year}`;
        console.log(formattedDate);
    } else {
        console.log("Invalid date format. Please use YYYY-MM-DD format.");
    }

    let tableBody = document.getElementById("tableBody");
    let str = "";
    let m = "";
    itemJsonArray.forEach((element, index) => {
        if(index == i){
            m = newValueOfTask;
            element[0] = m;
            n = formattedDate;
            element[2] = n;
            element[1] = newvalueOfDes;
            
            str += (`
                <tr class="edited-task">
                    <td scope="row" class="read"><input type="radio" onchange="complete(event)" class="radioBtn"></td>
                    <td class="td content">${m}</td>
                    <td class="td">${element[1]}</td> 
                    <td class="td">${element[3]}</td>
                    <td class="td">${n}</td>
                    <td><button class="btn btn-sm btn-primary" onclick="deleted(${index})">Delete</button> 
                    <button class="btn btn-sm btn-primary editbutton" onclick="editTask(${index})">Edit</button>
                    </tr>
            `);   
        }
        else{
            m = element[0];
            n = element[2];
            
            str += (`
                <tr>
                    <td scope="row" class="read"><input type="radio" onchange="complete(event)" class="radioBtn"></td>
                    <td class="td content">${m}</td>
                    <td class="td">${element[1]}</td> 
                    <td class="td">${element[3]}</td>
                    <td class="td">${n}</td>
                    <td><button class="btn btn-sm btn-primary" onclick="deleted(${index})">Delete</button> 
                    <button class="btn btn-sm btn-primary editbutton" onclick="editTask(${index})">Edit</button>
                    </tr>
            `);
        }
    });

    tableBody.innerHTML = str;
}

// start voice search
function startVoiceSearch() {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US';
  
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.toLowerCase();
      document.getElementById('search').value = transcript;
      searchTasks();
    };
  
    recognition.start();
  }

    const voiceSearchButton = document.getElementById('voiceSearch');
  voiceSearchButton.addEventListener('click', startVoiceSearch);
    
// finish voice search

let radioBtn = document.querySelector('.radioBtn');
console.log(radioBtn);      
add = document.getElementById("add");
add.addEventListener("click", getAndUpdate);
update();

// deleat
function deleted(itemIndex){
    console.log("Delete", itemIndex);
    itemJsonArrayStr = localStorage.getItem('itemsJson')
    itemJsonArray = JSON.parse(itemJsonArrayStr);
    itemJsonArray.splice(itemIndex, 1);
    localStorage.setItem('itemsJson', JSON.stringify(itemJsonArray));
    update();

}

// sortByDate
function sortListByDate() {
    itemJsonArrayStr = localStorage.getItem('itemsJson');
    itemJsonArray = JSON.parse(itemJsonArrayStr);
    
    if(sortStatus == "ascending"){
        itemJsonArray.sort((a, b) => {
            const dateA = new Date(a[2]);
            const dateB = new Date(b[2]);
            return dateA - dateB;
        });
        sortStatus="descending";
        sortButton.innerHTML = "Sort ⬆️👆 ";
    }
    else{
        itemJsonArray.sort((a, b) => {
            const dateA = new Date(a[2]);
            const dateB = new Date(b[2]);
            return dateB - dateA;
        });
        sortStatus="ascending";
        sortButton.innerHTML = "Sort ⬇️👇";

    }
    localStorage.setItem('itemsJson', JSON.stringify(itemJsonArray));

    update();
}

function clearStorage(){
    if (confirm("You pressed clear list button")){
    console.log('Clearing the storage')
    localStorage.clear();
    update()
    }
}

function searchTasks() {
    const searchQuery = document.getElementById('search').value.toLowerCase();
    const tableBody = document.getElementById('tableBody');
    let str = '';

    itemJsonArray.forEach((element, index) => {
        const taskName = element[0].toLowerCase();
        const taskDescription = element[1].toLowerCase();
        const taskCategory = element[3].toLowerCase();

        if (
            taskName.includes(searchQuery) ||
            taskDescription.includes(searchQuery) ||
            taskCategory.includes(searchQuery)
        ) {
            str += `
            <tr>
                <td scope="row" class="read">
                    <input type="checkbox" onchange="complete(event)" class="radioBtn">
                </td>
                <td class="td content">${element[0]}</td>
                <td class="td">${element[1]}</td> 
                <td class="td">${element[3]}</td>
                <td class="td">${element[2]}</td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="deleted(${index})">Delete</button> 
                    <button class="btn btn-sm btn-primary editbutton" onclick="editTask(${index})">Edit</button>
                </td>
            </tr>
            `;
        }
    });

    tableBody.innerHTML = str;
}

// mark as done
function complete(event) {
    const parentRow = event.target.closest('tr');
    
    if (event.target.checked) {
        const taskNameElement = parentRow.querySelector('.task-name');
        if (taskNameElement) {
            taskNameElement.style.color = '#696969';
        }

        parentRow.style.backgroundColor = '#696969';

        const tableBody = parentRow.parentNode;
        tableBody.appendChild(parentRow);
    } else {
        const taskNameElement = parentRow.querySelector('.task-name');
        if (taskNameElement) {
            taskNameElement.style.color = '';
        }

        parentRow.style.backgroundColor = '';
    }

    const table = parentRow.closest('table');
    const rows = Array.from(table.querySelectorAll('tbody tr'));

    rows.sort((a, b) => {
        const aIsDone = a.querySelector('input[type="checkbox"]').checked;
        const bIsDone = b.querySelector('input[type="checkbox"]').checked;

        if (aIsDone && !bIsDone) {
            return 1;
        } else if (!aIsDone && bIsDone) {
            return -1;
        } else {
            return 0;
        }
    });

    rows.forEach((row) => {
        table.querySelector('tbody').appendChild(row);
    });

}

document.getElementById("date").valueAsDate = new Date();
sortButton.addEventListener("click",sortListByDate);

