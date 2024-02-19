import '../../styles.css'
import { controller } from '../control';
import { displayTasks} from '../displayTasks';

document.addEventListener("click", function(e){
    if (e.target.matches('#cancel')) {
        console.log('Form cancelled');
        let form = e.target.closest('form');
        if(!form){
            form = e.target.parentElement.querySelector('form')
        }
        if (form.id === 'taskEditForm') {
            displayTasks.closeTEditForm();
        }
    }
    else if(e.target.matches(".priorityFilter")){
        let taskDiv = document.querySelector('#templateTask:not(.noPriority)');
        if(!taskDiv){
            return;
        }
        let jsonProj = controller.dueThisWeek(controller.getProjsAsJson());
        displayTasks.filterHiToLo(jsonProj);
    }
    else if(e.target.matches(".dateDue")){
        let taskDiv = document.querySelector('#templateTask:not(.noPriority)');
        if(!taskDiv){
            return;
        }
        let jsonProj = controller.dueThisWeek(controller.getProjsAsJson());
        displayTasks.filterDateDue(jsonProj);
    }
    else if(e.target.id == "editImg"){
        displayTasks.showTEditForm(e.target.closest('#templateTask'));
    }
    else if(e.target.id == "deleteImg"){
        displayTasks.deleteTask(e.target.closest("#templateTask"));
        location.reload();
    }
});
document.addEventListener("submit", function(e){
    if(e.target.matches("#taskEditForm")) {
        const form = e.target;
        displayTasks.updateTask(form);
        location.reload();
        console.log('task updated');
    }
});
window.onload = function() {
    let jsonProj = controller.dueToday(controller.getProjsAsJson());
    console.log(jsonProj);
    displayTasks.displayOnLoad(jsonProj);
};