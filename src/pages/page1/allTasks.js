import '../../styles.css'
import { controller } from '../control';
import { displayTasks as display} from '../displayTasks';

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
        display.updateTask(form, e.target.closest('#templateTask'));
        console.log('task updated');
    }
});
window.onload = function() {
    let jsonProj = controller.getProjsAsJson();
    display.displayOnLoad(jsonProj);
};