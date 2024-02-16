import { controller } from "../control";
import { displayTasks} from '../page1/tasks';
import '../../styles.css'


const display =(function(){
    const displayModal = ()=>{

    }
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
        let content = document.querySelector("#content");
        content.style.display = "none";
        content.id = "projectsDoNotShow";
        let newContent = document.querySelector("#content2");
        newContent.querySelector("#contentHeading").textContent = controller.getProjectTitle(pId);
        newContent.id = "content";
        newContent.style.display = 'grid'
        newContent.querySelector("#submitBtn").setAttribute("pId", pId);
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
        displayModal,
        addProject,
        displayProjectsOnLoad,
        openProject
    }
})();

document.addEventListener("click", function(e){
    if (e.target.matches('#addProject')){
        let title = prompt("Add new project title");
        display.addProject(title);
    }
    else if(e.target.closest("#templateProject")){
        display.openProject(0);
    }
});

window.onload = function() {
    display.displayProjectsOnLoad();
};