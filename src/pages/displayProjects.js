import { controller } from "./control";
import '../styles.css'


const display =(function(){
    const addProject = (title)=>{
        let pId = controller.addProj(title);
        if(pId != null){
            displayProject(title, pId);
        }
    }
    const projectTotalTasks = (pId) =>{
        let jsonProj = controller.getProjsAsJson();

        if(jsonProj[pId]){
            return Object.keys(jsonProj[pId]._tasks).length;
        }
        return 0;
    }
    const displayProject = (title, pId)=>{
        let div = document.querySelector('#templateProject').cloneNode(true);
        div.setAttribute("pId", pId);
        div.querySelector("#projectTitle").textContent = title;
        div.querySelector('#projectTotalTasks').textContent = "Total Tasks: " + projectTotalTasks(pId);
        div.style.display = "grid";
        let parentElement = document.querySelector("#projects");
        parentElement.appendChild(div);

    }
    const openProject = (pId)=>{
        window.location.href = "projectTasks.html?data=" + encodeURIComponent(pId);
    }
    const displayProjectsOnLoad = ()=> {
        let jsonProj = controller.getProjsAsJson();
        if(jsonProj == undefined || Object.keys(jsonProj).length === 0){
            return;
        }
        for (let projId in jsonProj) {
            if(jsonProj[projId]._title == ""){ //default project where all tasks are stored.
                continue;
            }
            displayProject(jsonProj[projId]._title, projId);
        }
    }
    const deleteProject = (divToDelete)=>{
        let pId = divToDelete.getAttribute("pId");
        controller.removeProj(pId);
        divToDelete.parentElement.removeChild(divToDelete);
    }
    return{
        addProject,
        deleteProject,
        displayProjectsOnLoad,
        openProject
    }
})();

export {display as displayProjects}

