import { controller } from "../control";
import {displayTasks} from '../displayTasks';
import '../../styles.css'

document.addEventListener("click", function(e){
    const taskAdd = e.target.closest("#taskAdd");
    if(taskAdd){
        displayTasks.showTaskForm();
    }
    else if (e.target.matches('#cancel')) {
        console.log('Form cancelled');
        const form = e.target.closest('form');
        if (form.id === 'taskForm') {
            displayTasks.closeTaskForm(e.target.closest('#templateTask'));
        } else if (form.id === 'taskEditForm') {
            displayTasks.closeTEditForm(e.target.closest('#templateTask'));
        }
    }
    else if(e.target.matches(".priorityFilter")){
        console.log("filter")
    }
    else if(e.target.id == "editImg"){
        displayTasks.showTEditForm(e.target.closest('#templateTask'));
    }
    else if(e.target.id == "deleteImg"){
        displayTasks.deleteTask(e.target.closest("#templateTask"));
    }
});
document.addEventListener("submit", function(e){
    e.preventDefault();
    if (e.target.matches("#taskForm")) {
        const form = e.target;
        displayTasks.submitTask(form);
        console.log('task submitted');
    }
    else if(e.target.matches("#taskEditForm")) {
        const form = e.target;
        displayTasks.updateTask(form, e.target.closest('#templateTask'));
        console.log('task updated');
    }
});

window.onload = function() {
    let urlParams = new URLSearchParams(window.location.search);
    let pId = urlParams.get('data');

    let newContent = document.querySelector("#content2");
    newContent.querySelector("#contentHeading").textContent = controller.getProjectTitle(pId);
    newContent.querySelector("#submitBtn").setAttribute("pId", pId);

    let jsonProj = controller.getProjsAsJson();
    for(let projId in jsonProj){
        if (projId != pId){
            delete jsonProj[projId];
        }
    }
    newContent.id = "content";
    newContent.style.display = 'grid'

    displayTasks.displayOnLoad(jsonProj);
};