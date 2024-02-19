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
        let form = e.target.closest('form');
        if(!form){
            form = e.target.parentElement.querySelector('form')
        }
        if (form.id === 'taskForm') {
            displayTasks.closeTaskForm();
        } else if (form.id === 'taskEditForm') {
            displayTasks.closeTEditForm();
        }
    }
    else if(e.target.matches(".priorityFilter")){
        let taskDiv = document.querySelector('#templateTask:not(.noPriority)');
        if(!taskDiv){
            return;
        }
        let json = controller.getProjsAsJson();
        let pId = taskDiv.getAttribute("pId");
        for (let projId in json){
            if(projId != pId){
                delete json[projId];
            }
        }
        displayTasks.filterHiToLo(json);
    }
    else if(e.target.matches(".dateDue")){
        let taskDiv = document.querySelector('#templateTask:not(.noPriority)');
        if(!taskDiv){
            return;
        }
        let json = controller.getProjsAsJson();
        let pId = taskDiv.getAttribute("pId");
        for (let projId in json){
            if(projId != pId){
                delete json[projId];
            }
        }
        console.log(json)
        displayTasks.filterDateDue(json);
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
        displayTasks.updateTask(form);
        console.log('task updated');
    }
});
window.onload = function() {
    let urlParams = new URLSearchParams(window.location.search);
    let pId = urlParams.get('data');
    console.log(pId);
    let newContent = document.querySelector("#content2");
    if(newContent){
        console.log("ASDASD")
    }
    newContent.querySelector("#contentHeading").textContent = controller.getProjectTitle(pId);
    document.querySelector("#submitBtn").setAttribute("pId", pId);

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