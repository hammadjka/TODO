import { controller } from './control';
import { parseISO, format} from 'date-fns';

const display = (function (){
    const showTaskForm = () => {
        let modal = document.getElementById("myModal");
        modal.style.display = "flex";
        modal.style.justifyContent = "center"
    }
    const closeTaskForm = () =>{
        let modal = document.getElementById("myModal");
        modal.style.display = "none";
        let form = modal.querySelector('#taskForm');
        if (form) {
            form.reset();
        }

    }
    const parseTaskForm = (form) =>{
        let title = form.elements['taskTitle'].value;
        let dateValue = form.elements['date'].value;
        let date = '';
        if(dateValue){
            date = format(parseISO(dateValue), "yyyy-MM-dd");        
        }
        let options = form.elements['options'];
        let priority;
        for (var i = 0; i < options.length; i++) {
            if (options[i].checked) {
              priority = options[i].value;
              break;
            }
        }
        let desc = form.elements['description'].value;
        closeTaskForm();
        return { title, date, priority, desc};
    }

    const setTaskDivContent = ( div, pId, title, date, priority, desc) => {
        if(title){
            div.querySelector("#headTaskTitle").textContent = title;
        }
        if(controller.getProjectTitle(pId) === ""){
            div.querySelector("#headProjectTitle").textContent = "";
        }
        else{
            div.querySelector("#headProjectTitle").textContent = '(' + controller.getProjectTitle(pId) + ')';
        }
        if(date !== ''){
            div.querySelector("#due").textContent = date;
        }
        if(priority){
            div.classList = "";
            div.classList.add(priority);
        }
    }
    const submitTask = (form)=>{
        let {title, date, priority, desc} = parseTaskForm(form);
        //by default all tasks go to project id 0, this would be done via the add task form when no project is specified.
        //if a task is added by selecting a project first we will change the value of the pId to respective project id in the form.
        let pId = form.querySelector("#submitBtn").getAttribute("pId"); 
        let tId = controller.addTaskToProj(pId,title,desc,date,priority);
        displayTask(pId, tId, title, date, priority, desc);
    }
    const displayTask = (pId, tId, title, date, priority, desc) => {
        let div = document.querySelector('#templateTask').cloneNode(true);
        div.setAttribute("pId", pId);
        div.setAttribute("tId", tId);
        setTaskDivContent(div, pId, title, date, priority,desc);
        div.style.display = "flex";
        let parentElement = document.querySelector("#tasks")
        if(parentElement.childNodes[1].nodeType === 1){
            parentElement.insertBefore(div, parentElement.childNodes[1]);
        }
        else{
            parentElement.appendChild(div);
        }
    }

    const showTEditForm = (divToEdit) =>{
        let modal =  document.querySelector("#myModal").cloneNode(true);
        modal.id = "editModal";
        let editForm = modal.querySelector("#taskForm");
        editForm.id = "taskEditForm"
        editForm.querySelector("#submitBtn").setAttribute("pId", divToEdit.getAttribute("pId"));
        editForm.querySelector("#submitBtn").setAttribute("tId", divToEdit.getAttribute("tId"))
        editForm.taskTitle.removeAttribute('required');
        editForm.date.removeAttribute('required');
        editForm.option1.removeAttribute('required');
        document.body.appendChild(modal);
        modal.style.display = "flex";
        modal.style.justifyContent = "center"
    }
    const closeTEditForm = () =>{
        let modal = document.querySelector("#editModal");
        modal.style.display = "none";
        let form = modal.querySelector('#taskForm');
        if (form) {
            form.reset();
        }
        modal.parentNode.removeChild(modal);
    }
    const updateTask = (form) =>{
        let {title, date, priority, desc} = parseTaskForm(form);
        let pId = form.querySelector("#submitBtn").getAttribute("pId");
        let tId = form.querySelector("#submitBtn").getAttribute("tId");
        controller.editTaskOfProj(pId,tId,title,desc,date,priority);
        console.log(pId + " " + tId + " " + date + " " + priority + " " + desc );
        let divToEdit = findTaskDiv(tId, pId);
        setTaskDivContent(divToEdit, pId, title, date, priority, desc);
        closeTEditForm(divToEdit);
    }
    const findTaskDiv = (tId, pId) => {
        let tasksDiv = document.querySelector("#tasks")
        // Iterate through the children of the tasks div
        for (let i = 0; i < tasksDiv.children.length; i++) {
            let child = tasksDiv.children[i];
            
            // Check if the child contains both tId and pId attributes
            if (child.getAttribute('tId') === tId && child.getAttribute('pId') === pId) {
                return child; // Return the child div if both attributes match
            }
        }
        
        // If no matching child div is found, return null
        return null;
    }
    const deleteTask = (divToEdit)=>{
        divToEdit.parentNode.removeChild(divToEdit);
        controller.removeTaskFromProj(divToEdit.getAttribute("pId"), divToEdit.getAttribute("tId"))
    }

    const displayOnLoad = (jsonProj)=>{
        if(jsonProj == undefined || Object.keys(jsonProj).length === 0){
            return;
        }
        for (let projId in jsonProj) {
            for (let taskId in jsonProj[projId]._tasks){
                let task = jsonProj[projId]._tasks[taskId];
                displayTask(projId, taskId, task._title, task._due, task._priority, task._desc)
            }
        }
    }
    const clearDisplay = ()=>{
        const parentDiv = document.getElementById('tasks');
        const children = parentDiv.children;
        const childrenArray = Array.from(children);
        const childToKeep = childrenArray.find(child => {
            return child.getAttribute('pId') === '-1';
        });
        childrenArray.forEach(child => {
            if (child !== childToKeep) {
                parentDiv.removeChild(child);
            }
        });

    }
    const filterHiToLo = (jsonProj)=>{
        if (jsonProj === undefined || Object.keys(jsonProj).length === 0) {
            return;
        }
        clearDisplay();
        let flattenedTasks = controller.sortHiToLo(jsonProj);
        flattenedTasks.forEach( (taskArr) => {
            let task = taskArr[2];
            let tId = taskArr[1];
            let pId = taskArr[0];
            displayTask(pId, tId, task._title, task._due, task._priority, task._desc);    
        })
    }
    const filterDateDue = (jsonProj)=>{
        if (jsonProj === undefined || Object.keys(jsonProj).length === 0) {
            return;
        }
        clearDisplay();
        let flattenedTasks = controller.sortDateDue(jsonProj);
        console.log(flattenedTasks);
        flattenedTasks.forEach( (taskArr) => {
            let task = taskArr[2];
            let tId = taskArr[1];
            let pId = taskArr[0];
            displayTask(pId, tId, task._title, task._due, task._priority, task._desc);    
        })
    }

    return {
        showTaskForm, 
        closeTaskForm, 
        submitTask, 
        showTEditForm, 
        closeTEditForm, 
        updateTask, 
        deleteTask,
        displayOnLoad,
        filterHiToLo,
        filterDateDue};
})();



export { display as displayTasks};