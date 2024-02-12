import './styles.css'

function Task(title, desc, due, priority, id){
    let _title = title;
    let _desc = desc;
    let _due = due;
    let _priority = priority;
    const getPriority = () => _priority;
    const getTitle = () => _title;
    const getDesc = () => _desc;
    const getDue = () => _due;
    const setPriority = (newPriority) => _priority = newPriority; 
    const setTitle = (newTitle) => _title = newTitle;
    const setDesc = (newDesc) => _desc = newDesc;
    const setDue = (newDue) => _due = newDue;

    return{getPriority, getTitle, getDesc, getDue, setPriority, setTitle, setDesc, setDue};
}

function Project(title){
    let _title = title;
    let _tasks = {};
    let _taskId = 0; //could potentially cause an overflow issue *highly unlikely in the scope of this project*
    
    const setProjectTitle = (newTitle) => {
        _title = newTitle;
    }
    const getProjectTitle = () => _title;

    const addTask = (title, desc, due, priority) => {
        _tasks[_taskId] = Task(title,desc,due,priority);
        return _taskId++;
    }
    const removeTask = (targetId)=>{
        if (_tasks[targetId]) {
            delete _tasks[targetId]; 
            return true;
        }
        return false;
    }
    const editTask = (targetId, title, desc, due, priority) => {
        if(_tasks[targetId]){
            _tasks[targetId].setTitle(title);
            _tasks[targetId].setDesc(desc);
            _tasks[targetId].setDue(due);
            _tasks[targetId].setPriority(priority);
            return true;
        }
        return false;
    }
    return{setProjectTitle, getProjectTitle, addTask, removeTask, editTask}
}
const controller = (function(){
    let _projs = {0:Project('')};
    let _projId = 1;
    const addProj = (title) => _projs[_projId++] = Project(title);
    const editProjectTitle = (pId, newTitle) => _projs[pId].setProjectTitle(newTitle);
    const getProjectTitle = (pId) => _projs[pId].getProjectTitle();
    const addTaskToProj = (pId, title, desc, due, priority) => {
        let tId = _projs[pId].addTask(title,desc,due,priority);
        console.log(tId);
        return tId;
    }
    const removeTaskFromProj = (pId, tId) => _projs[pId].removeTask(tId);
    const editTaskOfProj = (pId, tId, title, desc, due, prio) => _projId[pId].editTask(tId, title, desc, due, prio);

    return{addProj, editProjectTitle, getProjectTitle, addTaskToProj, removeTaskFromProj, editTaskOfProj};
})();

const display = (function (){
    const showTaskForm = () => {
        let addTaskDiv = document.querySelector("#taskAdd");
        addTaskDiv.parentNode.removeChild(addTaskDiv);
        let form = document.querySelector("#taskForm");
        form.style.display = "block";

        let add = document.querySelector("#add");
        add.classList = "";
        add.classList.add("noPointer")
        add.appendChild(form);
        add.style.backgroundColor="white";
    }
    const closeTaskForm = () =>{
        document.querySelector("#add").appendChild(addTaskDivClone);
        add.style.backgroundColor="inherit";
        add.classList = "";
        add.classList.add("pointer")
        let form = document.querySelector("#taskForm");
        form.style.display = "none"
    }
    const parseTaskForm = (form) =>{
        let title = form.elements['taskTitle'].value;
        let date = new Date(document.getElementById('date').value);
        let options = document.getElementsByName('options');
        let priority;
        for (var i = 0; i < options.length; i++) {
            if (options[i].checked) {
              priority = options[i].value;
              break;
            }
        }
        let desc = form.elements['description'].value;
        // console.log(title + " " + date +  " " + priority +  " " + desc);
        closeTaskForm();
        return { title, date, priority, desc};
    }
    const submitTask = (form)=>{
        let {title, date, priority, desc} = parseTaskForm(form);
        let pId = form.querySelector("#submitBtn").getAttribute("pId");
        let tId = controller.addTaskToProj(pId,title,desc,date,priority);
        displayTask(pId, tId, title, date, priority, desc);
    }
    const displayTask = (pId, tId, title, date, priority, desc) => {
        let div = document.querySelector('#templateTask').cloneNode(true);
        div.setAttribute("pId", pId);
        div.setAttribute("tId", tId);
        div.querySelector()
        div.querySelector("#headTaskTitle").textContent = title;
        if(pId == 0){
            div.querySelector("#headProjectTitle").textContent = "";
        }
        else{
            div.querySelector("#headProjectTitle").textContent = '(' + controller.getProjectTitle(pId) + ')';
        }
        div.querySelector("#due").textContent = dateFormatter(date);
        div.classList = "";
        div.classList.add(priority);

        let parentElement = document.querySelector("#tasks")
        if(parentElement.childNodes[1].nodeType === 1){
            parentElement.insertBefore(div, parentElement.childNodes[1]);
        }
        else{
            parentElement.appendChild(div);
        }
    }
    const showTEditForm = (divToEdit) =>{
        divToEdit.querySelector("#taskHead").style.display = "none";
        divToEdit.querySelector("#taskOptions").style.display = "none";
        divToEdit.querySelector("#taskLower").style.display = "none";

        let editForm = document.querySelector("#taskForm").cloneNode(true);
        editForm.id = "taskEditForm";
        editForm.setAttribute("pId", divToEdit.getAttribute("pId"));
        editForm.setAttribute("tId", divToEdit.getAttribute("tId"))
        editForm.style.display = "block"
        divToEdit.classList.add("noPriority");
        divToEdit.appendChild(editForm);
    }
    const closeTEditForm = () =>{
        let editForm = document.querySelector("#taskEditForm");
        editForm.parentNode.removeChild(editForm);
        document.querySelector("#templateTask").classList.remove("noPriority");
        document.querySelector("#taskHead").style.display = "flex";
        document.querySelector("#taskOptions").style.display = "flex";
        document.querySelector("#taskLower").style.display = "flex";
    }
    const updateTask = (form) =>{
        let {title, date, priority, desc} = parseTaskForm(form);
        let pId = form.querySelector("#submitBtn").getAttribute("pId");
        let tId = form.querySelector("#submitBtn").getAttribute("pId");
        controller.editTaskOfProj(pId,tId,title,desc,date,priority);
        displayTask(0, tId, title, date, priority, desc);
    }
    const dateFormatter = (date)=>{
        let year = date.getFullYear();
        let month = (date.getMonth() + 1).toString().padStart(2, '0'); // Add 1 to month and pad with '0' if necessary
        let day = date.getDate().toString().padStart(2, '0'); // Pad with '0' if necessary

        let formattedDate = `${year}-${month}-${day}`;
        return formattedDate;
    }
    return {showTaskForm, closeTaskForm, submitTask, showTEditForm, closeTEditForm};
})();

document.addEventListener("click", function(e){
    const taskAdd = e.target.closest("#taskAdd");
    if(taskAdd){
        display.showTaskForm();
    }
    else if (e.target.matches('#cancel')) {
        console.log('Form cancelled');
        const form = e.target.closest('form');
        if (form.id === 'taskForm') {
            display.closeTaskForm();
        } else if (form.id === 'taskEditForm') {
            display.closeTEditForm();
        }
    }
    else if(e.target.matches(".priorityFilter")){
        console.log("filter")
    }
    else if(e.target.id == "editImg"){
        display.showTEditForm(e.target.closest('#templateTask'));
    }
});
document.addEventListener("submit", function(e){
    e.preventDefault();
    if (e.target.matches("#taskForm")) {
        const form = e.target;
        display.submitTask(form);
        console.log('task submitted');
    }
    else if(e.target.matches("#taskEditForm")) {
        const form = e.target;
        display.updateTask(form);
        console.log('task updated');
    }
});
let addTaskDivClone = document.querySelector("#taskAdd").cloneNode(true);






