import '../../styles.css'
import { controller } from '../control';
import { displayTasks} from '../displayTasks';

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
        console.log("filter")
        displayTasks.filterHiToLo(controller.getProjsAsJson());
    }
    else if(e.target.matches(".dateDue")){
        displayTasks.filterDateDue(controller.getProjsAsJson());
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
    let jsonProj = controller.getProjsAsJson();
    displayTasks.displayOnLoad(jsonProj);
};