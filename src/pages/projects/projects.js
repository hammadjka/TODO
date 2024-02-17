import { controller } from "../control";
import '../../styles.css'


const display =(function(){
    const addProject = (title)=>{
        let pId = controller.addProj(title);
        displayProject(title, pId);
    }
    const displayProject = (title, pId)=>{
        let div = document.querySelector('#templateProject').cloneNode(true);
        div.setAttribute("pId", pId);
        div.querySelector("#projectTitle").textContent = title;
        div.style.display = "flex";
        let parentElement = document.querySelector("#projects")
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
            displayProject(jsonProj[projId]._title, projId);
        }
    }
    return{
        addProject,
        displayProjectsOnLoad,
        openProject
    }
})();

document.addEventListener("click", function(e){
    const taskAdd = e.target.closest("#taskAdd");
    if (e.target.matches('#addProject')){
        let title = prompt("Add new project title");
        display.addProject(title);
    }
    else if(e.target.closest("#templateProject")){
        let pId = e.target.closest("#templateProject").getAttribute("pId");
        display.openProject(pId);
    }
});
window.onload = function() {
    display.displayProjectsOnLoad();
};