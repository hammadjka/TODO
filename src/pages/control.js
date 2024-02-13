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
    return{setProjectTitle, getProjectTitle, addTask, removeTask, editTask, _title, _taskId}
}
export const controller = (function(){
    // Retrieve projects from local storage, or use an empty object if not found
    // localStorage.removeItem('projects');
    let jsonProjs = JSON.parse(localStorage.getItem('projects'));
    let _projs = {};
    if(_projs[0] == undefined){
        _projs[0] = Project("all");
    }
    let _projId = Object.keys(_projs).length || 0;

    const loadProjectFromJson = (json) =>{
        for (let key in json) {
            console.log(_projs[key]._title);
        }
    }
    const saveProjectsToLocalStorage = () => {
        localStorage.setItem('projects', JSON.stringify(_projs));
    };

    const addProj = (title) => {
        _projs[_projId] = Project(title);
        saveProjectsToLocalStorage();
        return _projId++;
    };

    const editProjectTitle = (pId, newTitle) => {
        _projs[pId].setProjectTitle(newTitle);
        saveProjectsToLocalStorage();
    };

    const getProjectTitle = (pId) => _projs[pId].getProjectTitle();

    const addTaskToProj = (pId, title, desc, due, priority) => {
        console.log(_projs[0].hasOwnProperty("setProjectTitle"));
        let tId = _projs[pId].addTask(title, desc, due, priority);
        saveProjectsToLocalStorage();
        let copy = JSON.parse(localStorage.getItem('projects'));
        // loadProjectFromJson(copy);
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

    const getProjs = () => {
        return _projs;
    };

    return {
        addProj,
        editProjectTitle,
        getProjectTitle,
        addTaskToProj,
        removeTaskFromProj,
        editTaskOfProj,
        getProjs
    };
})();
