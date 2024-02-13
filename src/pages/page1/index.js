import '../../styles.css'
import { controller } from '../control';

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
        let date = new Date( form.elements['date'].value);
        let options = form.elements['options'];
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
    const submitNewTask = (form)=>{
        let {title, date, priority, desc} = parseTaskForm(form);
        //by default all tasks go to project id 0, this would be done via the add task form when no project is specified.
        //if a task is added by selecting a project first we will change the value of the pId to respective project id in the form.
        let pId = form.querySelector("#submitBtn").getAttribute("pId"); 
        let tId = controller.addTaskToProj(pId,title,desc,date,priority);
        console.log("pId is: " + pId + " tId is: " + tId)
        displayNewTask(pId, tId, title, date, priority, desc);
    }
    const displayNewTask = (pId, tId, title, date, priority, desc) => {
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
        if(date === ''){
            div.querySelector("#due").textContent = dateFormatter(date);
        }
        if(priority){
            div.classList = "";
            div.classList.add(priority);
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
    }
    const filterPriority = ()=>{
        
    }
    const dateFormatter = (date)=>{
        let year = date.getFullYear();
        let month = (date.getMonth() + 1).toString().padStart(2, '0'); // Add 1 to month and pad with '0' if necessary
        let day = date.getDate().toString().padStart(2, '0'); // Pad with '0' if necessary

        let formattedDate = `${year}-${month}-${day}`;
        return formattedDate;
    }

    const addProject = (title)=>{
        controller.addProj(title);
    }
    const showProjects = ()=>{
        // let parentDiv =  document.querySelector("#projects")
        // const children = parentDiv.children;
        // for (let i = children.length - 1; i >= 0; i--) {
        //     const child = children[i];
        //     const childId = child.getAttribute('id');
        //             if (childId && !['templateProject', 'newProject'].includes(childId)) {
        //         parentDiv.removeChild(child);
        //     }
        // }

        // let projects = controller.getProjs();
        // for (let key in projects) {
        //     // console.log(`Key: ${key}, Value: ${controller.getProjectTitle(key)}`);
        //     let projectDiv = parentDiv.querySelector("#templateProject").cloneNode(true);
        //     projectDiv.id = controller.getProjectTitle(key)
        //     projectDiv.querySelector("#projectTitle").textContent = controller.getProjectTitle(key);
        //     projectDiv.style.display = "flex";
        //     parentDiv.appendChild(projectDiv);
        // }

    }
    return {
        showTaskForm, 
        closeTaskForm, 
        submitNewTask, 
        showTEditForm, 
        closeTEditForm, 
        updateTask, 
        deleteTask, 
        addProject, 
        showProjects};
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
            display.closeTaskForm(e.target.closest('#templateTask'));
        } else if (form.id === 'taskEditForm') {
            display.closeTEditForm(e.target.closest('#templateTask'));
        }
    }
    else if(e.target.matches(".priorityFilter")){
        console.log("filter")
    }
    else if(e.target.id == "editImg"){
        display.showTEditForm(e.target.closest('#templateTask'));
    }
    else if(e.target.id == "deleteImg"){
        display.deleteTask(e.target.closest("#templateTask"));
    }
    else if(e.target.id == "priorityFilter"){
    }
    else if(e.target.id == "addProject"){
        let title = prompt("Add Title");
        display.addProject(title);
        display.showProjects();
    }
    else if(e.target.id == "switchToProject"){
        display.showProjects();
    }
});
document.addEventListener("submit", function(e){
    e.preventDefault();
    if (e.target.matches("#taskForm")) {
        const form = e.target;
        display.submitNewTask(form);
        console.log('task submitted');
    }
    else if(e.target.matches("#taskEditForm")) {
        const form = e.target;
        display.updateTask(form, e.target.closest('#templateTask'));
        console.log('task updated');
    }
});