const { parseISO, startOfWeek, endOfWeek, format } = require('date-fns');

function Task(title, desc, due, priority, id){
    let _title = title;
    let _desc = desc;
    let _due = due;
    let _priority = priority;
    return{_title, _desc, _due, _priority};
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
            if(title){
                _tasks[targetId]._title = title;
            }
            _tasks[targetId]._desc = desc;
            if(due){
                _tasks[targetId]._due = due;
            }
            if(priority){
                _tasks[targetId]._priority = priority;
            }
            console.log(priority + " " + title + " " +due);
            return true;
        }
        return false;
    }
    return{setProjectTitle, getProjectTitle, addTask, removeTask, editTask, _title, _tasks}
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
        console.log(_projs[pId])
        saveProjectsToLocalStorage();
    };

    const getProjsAsJson = () => {
        return JSON.parse(localStorage.getItem('projects'));
    };

    const flatten = (jsonProj) => {
        let tasksObject = jsonProj;
        let flattenedArray = [];
    
        // Iterate through the object
        for (let projId in tasksObject) {
            let tasks = tasksObject[projId]._tasks;
            // Iterate through tasks
            for (let taskId in tasks) {
                let taskObject = tasks[taskId];
                flattenedArray.push([projId, taskId, taskObject]);
            }
        }
        return flattenedArray;
    }

    const sortHiToLo = (jsonProj) =>{
        let flattenedArray = flatten(jsonProj);
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        flattenedArray.sort((a, b) => {
            const priorityA = priorityOrder[a[2]._priority];
            const priorityB = priorityOrder[b[2]._priority];
            return priorityA - priorityB;
        });
        return flattenedArray;
    }
    const sortDateDue = (jsonProj) => {
        let flattenedArray = flatten(jsonProj);
        flattenedArray.sort((a, b) => {
            const dueDateA = a[2]._due;
            const dueDateB = b[2]._due;
                if (dueDateA < dueDateB) {
                return 1;
            }
            if (dueDateA > dueDateB) {
                return -1;
            }
            return 0;
        });
        return flattenedArray;
    };
    const dueThisWeek = (jsonProj) => {
        let currentDate = new Date();
        let isoDate = format(currentDate, 'yyyy-MM-dd');
    
        let firstDayOfWeek = startOfWeek(currentDate, { weekStartsOn: 0 }); // 0 represents Sunday
        let lastDayOfWeek = endOfWeek(currentDate, { weekStartsOn: 0 }); // 0 represents Sunday
        let isoFirstDayOfWeek = format(firstDayOfWeek, 'yyyy-MM-dd');
        let isoLastDayOfWeek = format(lastDayOfWeek, 'yyyy-MM-dd');
    
        for (let projId in jsonProj) {
            let tasks = jsonProj[projId]._tasks;
            for (let taskId in tasks) {
                let taskDueDate = tasks[taskId]._due;
                let isoTaskDueDate = format(parseISO(taskDueDate), 'yyyy-MM-dd');
                if (!(isoTaskDueDate >= isoFirstDayOfWeek && isoTaskDueDate <= isoLastDayOfWeek)) {
                   // console.log('Task ID:', taskId, 'is due this week:', isoTaskDueDate);
                    delete jsonProj[projId]._tasks[taskId];
                }
            }
        }
        return jsonProj;
    }

    const dueToday = (jsonProj) => {
        let currentDate = new Date();
        let isoDate = format(currentDate, 'yyyy-MM-dd');
    
        for (let projId in jsonProj) {
            let tasks = jsonProj[projId]._tasks;
            for (let taskId in tasks) {
                let taskDueDate = tasks[taskId]._due;
                let isoTaskDueDate = format(parseISO(taskDueDate), 'yyyy-MM-dd');
                if (isoTaskDueDate !== isoDate) {
                    delete jsonProj[projId]._tasks[taskId];
                }
            }
        }
        return jsonProj;
    }
    
    
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
        getProjsAsJson,
        sortHiToLo,
        sortDateDue,
        dueThisWeek,
        dueToday
    };
})();
