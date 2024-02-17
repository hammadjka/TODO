import { controller } from './control';
import { parseISO, format} from 'date-fns';

const display = (function (){
    const showTaskForm = () => {
        let addTaskDiv = document.querySelector("#taskAdd");
        addTaskDiv.style.display = "none";
        let form = document.querySelector("#taskForm");
        form.style.display = "block";

        let add = document.querySelector("#add");
        add.classList = "";
        add.classList.add("noPointer")
        add.appendChild(form);
        add.style.backgroundColor="white";
    }
    const closeTaskForm = () =>{
        document.querySelector("#taskAdd").style.display = "flex";
        add.style.backgroundColor="inherit";
        add.classList = "";
        add.classList.add("pointer")
        let form = document.querySelector("#taskForm");
        form.style.display = "none"
        form.reset();
    }
    const parseTaskForm = (form) =>{
        let title = form.elements['taskTitle'].value;
        let dateValue = form.elements['date'].value;
        let date = format(parseISO(dateValue), "yyyy-MM-dd");        
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
        console.log(date);
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
        divToEdit.querySelector("#taskHead").style.display = "none";
        divToEdit.querySelector("#taskOptions").style.display = "none";
        divToEdit.querySelector("#taskLower").style.display = "none";
        divToEdit.classList.add("noPriority");

        let editForm = document.querySelector("#taskForm").cloneNode(true);
        editForm.id = "taskEditForm";
        editForm.querySelector("#submitBtn").setAttribute("pId", divToEdit.getAttribute("pId"));
        editForm.querySelector("#submitBtn").setAttribute("tId", divToEdit.getAttribute("tId"))
        editForm.style.display = "block"
        //since we're editing the task and all values are already set, we'll only look for changes.
        editForm.taskTitle.removeAttribute('required');
        editForm.date.removeAttribute('required');
        editForm.option1.removeAttribute('required');
        divToEdit.appendChild(editForm);
    }
    const closeTEditForm = (divToEdit) =>{
        let editForm = divToEdit.querySelector("#taskEditForm");
        editForm.reset();
        editForm.parentNode.removeChild(editForm);
        divToEdit.classList.remove("noPriority");
        divToEdit.querySelector("#taskHead").style.display = "flex";
        divToEdit.querySelector("#taskOptions").style.display = "flex";
        divToEdit.querySelector("#taskLower").style.display = "flex";
    }
    const updateTask = (form, divToEdit) =>{
        let {title, date, priority, desc} = parseTaskForm(form);
        let pId = form.querySelector("#submitBtn").getAttribute("pId");
        let tId = form.querySelector("#submitBtn").getAttribute("tId");
        controller.editTaskOfProj(pId,tId,title,desc,date,priority);
        console.log( pId + " " + title + " " + date + " " + priority + " " + desc)
        setTaskDivContent(divToEdit, pId, title, date, priority, desc);
        closeTEditForm(divToEdit);
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
        let parentElement = document.querySelector("#tasks");
        const elementsWithoutAttribute = parentElement.querySelectorAll(`:not([${attributeName}="${attributeValue}"])`);
            elementsWithoutAttribute.forEach(element => {
            if (element.parentNode) {
                element.parentNode.removeChild(element);
            }
        });
    }   
    const filterHiToLo = (jsonProj)=>{
        clearDisplay();
        if (jsonProj === undefined || Object.keys(jsonProj).length === 0) {
            return;
        }
        // for (let projId in jsonProj) {
        //     let sortedTasks = Object.values(jsonProj[projId]._tasks).sort((a, b) => b._priority - a._priority);
        //     sortedTasks.forEach((task, index) => {
        //         displayTask(projId, index, task._title, task._due, task._priority, task._desc);
        //     });
        // }
    }

    return {
        showTaskForm, 
        closeTaskForm, 
        submitTask, 
        showTEditForm, 
        closeTEditForm, 
        updateTask, 
        deleteTask,
        displayOnLoad};
})();



export { display as displayTasks};