
import { displayProjects } from "../displayProjects";

document.addEventListener("click", function(e){
    const taskAdd = e.target.closest("#taskAdd");
    if (e.target.matches('#addProject')){
        let title = prompt("Add new project title");

        if(title !== null && title.length != 0){
            displayProjects.addProject(title);
        }
    }
    else if (e.target.closest("#templateProject")) {
        let pId = e.target.closest("#templateProject").getAttribute("pId");
        if (e.target.matches("#deleteIcon")) {
            let divToDelete = e.target.closest("#templateProject");
            displayProjects.deleteProject(divToDelete);
            return;
        }
        displayProjects.openProject(pId);
    }
});
window.onload = function() {
    displayProjects.displayProjectsOnLoad();
};