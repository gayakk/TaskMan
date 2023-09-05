const sortButton = document.querySelector("#sort");
var sortStatus = "ascending";

function getAndUpdate(){
    console.log("Updating List...");
    task = document.getElementById('title').value;
    desc = document.getElementById('description').value;
    dte =document.getElementById('date').value;
    cate =document.getElementById('typeOfWork').value; 
    if(task===""||desc===""||dte===""||cate===""){
        alert("enter data");
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
    // Populate the table
    let tableBody = document.getElementById("tableBody");
    let str = "";
    itemJsonArray.forEach((element, index) => {
        str += `
        <td scope="row" class="read"><input type="checkbox" onchange="complete(event)" class="radioBtn"></td>
         <td class="td content">${element[0]}</td>
        <td class="td">${element[1]}</td> 
        <td class="td">${element[3]}</td>
        <td class="td">${element[2]}</td>
        <td><button class="btn btn-sm btn-primary" onclick="deleted(${index})">Delete</button> 
        <button class="btn btn-sm btn-primary editbutton" onclick="editDate(${index})">Edit</button>
        </tr>
        `;
    });

    tableBody.innerHTML = str;
}

function editDate(i){
    itemJsonArrayStr = localStorage.getItem('itemsJson')
    itemJsonArray = JSON.parse(itemJsonArrayStr); 

    let newValueOfTask = prompt("Enter New Task Name");
    
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
        console.log("Invalid date format. Please use DD-MM-YYYY format.");
    }


    let tableBody = document.getElementById("tableBody");
    let str = "";
    let m = "";
    itemJsonArray.forEach((element, index) => {
        if(index == i){
            m=newValueOfTask;
            element[0] = m;
            n=formattedDate;
            element[2] = n;
        }
        else{
            m = element[0];
            n = element[2];
        };
        
        str+= (`
        <td scope="row" class="read"><input type="radio" onchange="complete(event)" class="radioBtn"></td>
         <td class="td content">${m}</td>
        <td class="td">${element[1]}</td> 
        <td class="td">${element[3]}</td>
        <td class="td">${n}</td>
        <td><button class="btn btn-sm btn-primary" onclick="deleted(${index})">Delete</button> 
        <button class="btn btn-sm btn-primary editbutton" onclick="editDate(${index})">Edit</button>
        </tr>
        `);

        localStorage.setItem('itemsJson', JSON.stringify(itemJsonArray));
        update();
    
    });

    

    

    tableBody.innerHTML = str;

    

    // console.log(i);
    // const input=document.querySelector(".read").querySelector(".content");
    // const edit=prompt("Update the name");   
    // input.addEventListener("blur",e=>{
    //     input.innerHTML=e.target.value;
    //     localStorage.setItem('itemJson',JSON.stringify(itemJsonArray));
    //     update();
    // })
}



let radioBtn = document.querySelector('.radioBtn');
console.log(radioBtn);      
add = document.getElementById("add");
add.addEventListener("click", getAndUpdate);
update();
function deleted(itemIndex){
    console.log("Delete", itemIndex);
    itemJsonArrayStr = localStorage.getItem('itemsJson')
    itemJsonArray = JSON.parse(itemJsonArrayStr);
    // Delete itemIndex element from the array
    itemJsonArray.splice(itemIndex, 1);
    localStorage.setItem('itemsJson', JSON.stringify(itemJsonArray));
    update();

}

// sortByDate
function sortListByDate() {
    // Retrieve the items from local storage
    itemJsonArrayStr = localStorage.getItem('itemsJson');
    itemJsonArray = JSON.parse(itemJsonArrayStr);

    // Sort the array by date (assuming the date is in "YYYY-MM-DD" format)
    
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
    
    

    // Update the local storage with the sorted array
    localStorage.setItem('itemsJson', JSON.stringify(itemJsonArray));

    // Refresh the display
    update();
}

function clearStorage(){
    if (confirm("You pressed clear list button")){
    console.log('Clearing the storage')
    localStorage.clear();
    update()
    }
}


function complete(e){
//     console.log(idx);
//     itemJsonArrayStr = localStorage.getItem('itemsJson');
//     itemJsonArrayStr.forEach((i,ind)=>{
//         if(idx===ind) i
//     })
    console.log(e);
    let task=e.target.parentElement.textContent;
    console.log(task);
    task.classList.add('name');
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
                    <button class="btn btn-sm btn-primary editbutton" onclick="editDate(${index})">Edit</button>
                </td>
            </tr>
            `;
        }
    });

    tableBody.innerHTML = str;
}



// document.getElementsByClassName("container1").style.marginLeft= '15%';
// document.getElementsByClassName("container1").style.marginRight= '15%';
document.getElementById("date").valueAsDate = new Date();

sortButton.addEventListener("click",sortListByDate);