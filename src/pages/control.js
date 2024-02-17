function Task(title, desc, due, priority, id){
    let _title = title;
    let _desc = desc;
    let _due = due;
    let _priority = priority;
    const getPriority = () => _priority;
    const getTitle = () => _title;
    const getDesc = () => _desc;
    const getDue = () => _due;
    const setPriority = (newPriority) => _priority = newPriority; 
    const setTitle = (newTitle) => _title = newTitle;
    const setDesc = (newDesc) => _desc = newDesc;
    const setDue = (newDue) => _due = newDue;

    return{getPriority, getTitle, getDesc, getDue, setPriority, setTitle, setDesc, setDue, _title, _desc, _due, _priority};
}

function Project(title){
    let _title = title;
    let _tasks = {};
    let _taskId = 0; //could potentially cause an overflow issue *highly unlikely in the scope of this project*
    
    const setProjectTitle = (newTitle) => {
        _title = newTitle;
    }
    const getProjectTitle = () => _title;

    const addTask = (title, desc, due, priority) => {
        _tasks[_taskId] = Task(title,desc,due,priority);
        return _taskId++;
    }
    const removeTask = (targetId)=>{
        if (_tasks[targetId]) {
            delete _tasks[targetId]; 
            return true;
        }
        return false;
    }
    const editTask = (targetId, title, desc, due, priority) => {
        if(_tasks[targetId]){
            _tasks[targetId].setTitle(title);
            _tasks[targetId].setDesc(desc);
            _tasks[targetId].setDue(due);
            _tasks[targetId].setPriority(priority);
            return true;
        }
        return false;
    }
    return{setProjectTitle, getProjectTitle, addTask, removeTask, editTask, _title, _taskId, _tasks}
}
export const controller = (function(){
    // Retrieve projects from local storage, or use an empty object if not found
    // localStorage.removeItem('projects');
    let _projs = {};
    let _projId = 0;
    let jsonProjs = JSON.parse(localStorage.getItem('projects'));

    const projectTitleExists = (titleToCheck)=>{
        for (let pId in _projs) {
            if (_projs[pId].getProjectTitle() === titleToCheck) {
                return true;
            }
        }
    }
    const addProj = (title) => {
        if(projectTitleExists(title)){
            return;
        }
        _projs[_projId] = Project(title);
        saveProjectsToLocalStorage();
        return _projId++;
    };
    const removeProj = (pId) =>{
        if(_projs.hasOwnProperty(pId)){
            delete _projs[pId];
            saveProjectsToLocalStorage();
        }
    }

    const editProjectTitle = (pId, newTitle) => {
        _projs[pId].setProjectTitle(newTitle);
        saveProjectsToLocalStorage();
    };

    const getProjectTitle = (pId) => _projs[pId].getProjectTitle();

    const addTaskToProj = (pId, title, desc, due, priority) => {
        let tId = _projs[pId].addTask(title, desc, due, priority);
        saveProjectsToLocalStorage();
        return tId;
    };

    const removeTaskFromProj = (pId, tId) => {
        _projs[pId].removeTask(tId);
        saveProjectsToLocalStorage();
    };

    const editTaskOfProj = (pId, tId, title, desc, due, prio) => {
        _projs[pId].editTask(tId, title, desc, due, prio);
        saveProjectsToLocalStorage();
    };

    const getProjsAsJson = () => {
        return JSON.parse(localStorage.getItem('projects'));
    };
    
    const saveProjectsToLocalStorage = () => {
        localStorage.setItem('projects', JSON.stringify(_projs));
    };
    
    const loadProjectFromJson = (jsonProj) =>{
        if(jsonProj == undefined || Object.keys(jsonProj).length === 0){
            addProj("");
            return;
        }
        for (let projId in jsonProj) {
            addProj(jsonProj[projId]._title);
            for (let taskId in jsonProj[projId]._tasks){
                let task = jsonProj[projId]._tasks[taskId];
                addTaskToProj(projId, task._title, task._desc, task._due, task._priority)
            }
        }
    }
    loadProjectFromJson(jsonProjs);
    console.log(JSON.parse(localStorage.getItem('projects')))

    return {
        addProj,
        removeProj,
        editProjectTitle,
        getProjectTitle,
        addTaskToProj,
        removeTaskFromProj,
        editTaskOfProj,
        getProjsAsJson
    };
})();
