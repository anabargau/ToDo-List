import './style.css'
import {compareAsc, format, fromUnixTime, sub} from 'date-fns'

const Project = (name) => {
    let projectTasks = []
    
    const getProjectName = () => {
        return name
    }   

    return {getProjectName, projectTasks}
}

const Task = (name, dueDate, priority, description, project) => {
    const getTaskName = () => {
        return name
    }

    const getTaskDueDate = () => {
        return dueDate
    }

    const getTaskPriority = () => {
        return priority
    }

    const getTaskDescription = () => {
        return description
    }

    return {getTaskName, getTaskDueDate, getTaskPriority, getTaskDescription}
}

const toDoList = (() => {
  
    const addTaskToProject = () => {
        let taskName = document.getElementById('title-input').value
        let dueDate = document.getElementById('due-date').value
        let taskPriority = document.querySelector('input[name="priority"]:checked').value
        let taskDescription = document.getElementById('description').value
        let taskProject = document.getElementById('select-project')
        let taskProjectValue = taskProject.options[taskProject.selectedIndex].value
        let newTask = Task(taskName, dueDate, taskPriority, taskDescription, taskProject)
        let projectIndex = indexOfProject(taskProjectValue)
        projectsList[projectIndex].projectTasks.push(newTask)
    }

    const addProjectToList = () => {
        let projectName = document.getElementById('project-name').value
        if(projectName) {
            let newProject = Project(projectName)
            projectsList.push(newProject)
            manageDOM.addProjectToSelector(newProject)
        }
    } 

    const indexOfProject = (projectName) => {
        let projectsListNames = []
        for(let i = 0; i < projectsList.length; i++){
            projectsListNames.push(projectsList[i].getProjectName())
        }
        let index = projectsListNames.indexOf(projectName)
        return index
    }

    const sortByPriorityLTH = (project) => {
        project.projectTasks.sort((a, b) => {
            let priorityA = a.getTaskPriority()
            let priorityB = b.getTaskPriority()
            return compare(priorityA, priorityB)
        })
    }

    const sortByPriorityHTL = (project) => {
        project.projectTasks.sort((a, b) => {
            let priorityA = a.getTaskPriority()
            let priorityB = b.getTaskPriority()
            return compare(priorityB, priorityA)  
        })
    }

    const sortByDateLTH = (project) => {
        project.projectTasks.sort((a, b) => {
            let dateA = a.getTaskDueDate()
            let dateB = b.getTaskDueDate()
            return compare(dateA, dateB) 
        })
    }

    const sortByDateHTL = (project) => {
        project.projectTasks.sort((a, b) => {
            let dateA = a.getTaskDueDate()
            let dateB = b.getTaskDueDate()
            return compare(dateB, dateA)
        })
    }

    const sortTasks = (project) => {
        let sortSelector = document.getElementById('sort-selector')
        let sortValue = sortSelector.options[sortSelector.selectedIndex].value
        switch(sortValue) {
            case '1':
                sortByDateLTH(project)
                break
            case '2':
                sortByDateHTL(project)
                break
            case '3':
                sortByPriorityLTH(project)
                break
            case '4':
                sortByPriorityHTL(project)
                break
        }
    }

    const compare = (a, b) => {
        if(a < b) {
            return -1
        } 
        if(a > b) {
            return 1
        }
        return 0
    }

    return {addTaskToProject, addProjectToList, indexOfProject, sortByPriorityHTL, sortByPriorityLTH, sortTasks}
})()

const manageDOM = (() => {
    const displayNewTaskModal = () => {
        disableAddButtons()

        let content = document.getElementById('content')

        let modal = document.createElement('div')
        content.appendChild(modal)
        modal.classList.add('task-modal')
        modal.setAttribute('id', 'task-modal')

        let closeTaskModal = document.createElement('button')
        closeTaskModal.setAttribute('id', 'close-task-modal')
        closeTaskModal.setAttribute('type', 'button')
        modal.appendChild(closeTaskModal)
        closeTaskModal.textContent = 'X'

        let form = document.createElement('form')
        modal.appendChild(form)
        form.classList.add('task-form')
        form.setAttribute('onsubmit', 'return false')
        form.setAttribute('id', 'task-form')

        let titleLabel = document.createElement('label')
        form.appendChild(titleLabel)
        titleLabel.setAttribute('for', 'title-input')
        titleLabel.textContent = 'Title'

        let titleInput = document.createElement('input')
        form.appendChild(titleInput)
        titleInput.setAttribute('type', 'text')
        titleInput.setAttribute('id', 'title-input')
        titleInput.required = true

        let dueDateLabel = document.createElement('label')
        form.appendChild(dueDateLabel)
        dueDateLabel.setAttribute('for', 'due-date')
        dueDateLabel.textContent = 'Due Date'

        let dueDate = document.createElement('input')
        form.appendChild(dueDate)
        dueDate.setAttribute('id', 'due-date')
        dueDate.setAttribute('type', 'date')
        dueDate.required = true

        let priorityFieldset = document.createElement('fieldset')
        form.appendChild(priorityFieldset)
        priorityFieldset.classList.add('priority-fieldset')

        let priorityLegend = document.createElement('label')
        priorityFieldset.appendChild(priorityLegend)
        priorityLegend.textContent = 'Priority:'

        let priorityDiv = document.createElement('div')
        priorityFieldset.appendChild(priorityDiv)

        let lowPriorityLabel = document.createElement('label')
        priorityDiv.appendChild(lowPriorityLabel)
        lowPriorityLabel.setAttribute('for', 'low-priority')
        lowPriorityLabel.textContent = 'Low'

        let lowPriority = document.createElement('input')
        priorityDiv.appendChild(lowPriority)
        lowPriority.setAttribute('type', 'radio')
        lowPriority.setAttribute('id', 'low-priority')
        lowPriority.setAttribute('value', '1')
        lowPriority.setAttribute('name', 'priority')
        lowPriority.checked = true

        let mediumPriorityLabel = document.createElement('label')
        priorityDiv.appendChild(mediumPriorityLabel)
        mediumPriorityLabel.setAttribute('for', 'medium-priority')
        mediumPriorityLabel.textContent = 'Medium'

        let mediumPriority = document.createElement('input')
        priorityDiv.appendChild(mediumPriority)
        mediumPriority.setAttribute('type', 'radio')
        mediumPriority.setAttribute('id', 'medium-priority')
        mediumPriority.setAttribute('value', '2')
        mediumPriority.setAttribute('name', 'priority')

        let highPriorityLabel = document.createElement('label')
        priorityDiv.appendChild(highPriorityLabel)
        highPriorityLabel.setAttribute('for', 'high-priority')
        highPriorityLabel.textContent = 'High'

        let highPriority = document.createElement('input')
        priorityDiv.appendChild(highPriority)
        highPriority.setAttribute('type', 'radio')
        highPriority.setAttribute('id', 'high-priority')
        highPriority.setAttribute('value', '3')
        highPriority.setAttribute('name', 'priority')

        let selectProjectLabel = document.createElement('label')
        form.appendChild(selectProjectLabel)
        selectProjectLabel.setAttribute('for', 'select-project')
        selectProjectLabel.textContent = 'Select Project'

        let selectProject = document.createElement('select')
        selectProject.setAttribute('id', 'select-project')
        form.appendChild(selectProject)
        addProjectOptions(selectProject)
        selectProject.setAttribute('name', 'projects')

        let descriptionLabel = document.createElement('label')
        descriptionLabel.setAttribute('for', 'description')
        descriptionLabel.textContent = 'Description'
        form.appendChild(descriptionLabel)

        let description = document.createElement('textarea')
        form.appendChild(description)
        description.setAttribute('id', 'description')

        let submitTaskBtn = document.createElement('button')
        form.appendChild(submitTaskBtn)
        submitTaskBtn.setAttribute('id', 'submit-task')
        submitTaskBtn.setAttribute('type', 'button')
        submitTaskBtn.textContent = 'Create Task'
    }

    const displayNewProjectModal = () => {
        disableAddButtons()
        
        let content = document.getElementById('content')

        let modal = document.createElement('div')
        content.appendChild(modal)
        modal.classList.add('project-modal')
        modal.setAttribute('id', 'project-modal')

        let projectForm = document.createElement('form')
        modal.appendChild(projectForm)
        projectForm.classList.add('project-form')
        projectForm.setAttribute('id', 'project-form')
        projectForm.setAttribute('onsubmit', 'return false')

        let closeProjectModal = document.createElement('button')
        closeProjectModal.setAttribute('id', 'close-project-modal')
        closeProjectModal.setAttribute('type', 'button')
        projectForm.appendChild(closeProjectModal)
        closeProjectModal.textContent = 'X'

        let nameLabel = document.createElement('label')
        nameLabel.setAttribute('for', 'project-name')
        nameLabel.textContent = 'Project Name'
        projectForm.appendChild(nameLabel)

        let nameInput = document.createElement('input')
        projectForm.appendChild(nameInput)
        nameInput.setAttribute('id', 'project-name')
        nameInput.setAttribute('type', 'text')
        nameInput.required = true

        let submitProjectBtn = document.createElement('button')
        projectForm.appendChild(submitProjectBtn)
        submitProjectBtn.setAttribute('id', 'submit-project')
        submitProjectBtn.setAttribute('type', 'button')
        submitProjectBtn.textContent = 'Create Project'
    }

    const emptyProjectModal = () => {
        let projectModal = document.getElementById('project-modal')
        projectModal.remove()
        enableAddButtons()
    }

    const emptyTaskModal = () => {
        let taskModal = document.getElementById('task-modal')
        taskModal.remove()
        enableAddButtons()
    }

    const disableAddButtons = () => {
        let addProjectBtn = document.getElementById('add-new-project')
        let addTaskBtn = document.getElementById('add-new-task')
        addProjectBtn.disabled = true
        addTaskBtn.disabled = true
    }

    const enableAddButtons = () => {
        let addProjectBtn = document.getElementById('add-new-project')
        let addTaskBtn = document.getElementById('add-new-task')
        addProjectBtn.disabled = false
        addTaskBtn.disabled = false
    }

    const setEventListeners = () => {
        let addNewTaskBtn = document.getElementById('add-new-task')
        addNewTaskBtn.addEventListener('click', () => {
            displayNewTaskModal()
            let closeTaskModal = document.getElementById('close-task-modal')
             closeTaskModal.addEventListener('click', emptyTaskModal)
            let submitTask = document.getElementById('submit-task')
            submitTask.addEventListener('click', () => {
                let form = document.getElementById('task-form')
                toDoList.addTaskToProject()
                form.reset()
                emptyTaskModal()
                displayTasksOfProject()
            })
        })

        let addNewProjectBtn = document.getElementById('add-new-project')
        addNewProjectBtn.addEventListener('click', () => {
            displayNewProjectModal()
            let closeProjectModal = document.getElementById('close-project-modal')
            closeProjectModal.addEventListener('click', emptyProjectModal)
            let submitProject = document.getElementById('submit-project')
            submitProject.addEventListener('click', () => { 
                let form = document.getElementById('project-form')
                toDoList.addProjectToList()
                form.reset()
                emptyProjectModal()
                displayTasksOfProject()
            })
        })

        let selectProjects = document.getElementById('projects')
        selectProjects.addEventListener('change', () => {
            displayTasksOfProject()
        })

        let sortSelector = document.getElementById('sort-selector')
        sortSelector.addEventListener('change', displayTasksOfProject)
    }

    const addProjectToSelector = (project) => {
        let projectSelector = document.getElementById('projects')
        let newProjectOption = document.createElement('option')
        projectSelector.appendChild(newProjectOption)
        newProjectOption.textContent = project.getProjectName()
        newProjectOption.setAttribute('value', project.getProjectName())
    }

   const addProjectOptions = (node) => {
       node.textContent = ''
       for(let i = 0; i < projectsList.length; i++) {
           let projectOption = document.createElement('option')
           node.appendChild(projectOption)
           projectOption.textContent = projectsList[i].getProjectName()
           projectOption.setAttribute('value', projectOption.textContent)
       }
    }

    const displayTasksOfProject = () => {
        let selector = document.getElementById('projects')
        if(selector.options.length == 0){
            return
        }
        enableAddButtons()
        let projectName = selector.options[selector.selectedIndex].value 
        let index = toDoList.indexOfProject(projectName)
        let project = projectsList[index]
        toDoList.sortTasks(project)
        let tasksContent = document.getElementById('task-list')
        tasksContent.textContent = ''
        if(project.projectTasks.length == 0) {
            tasksContent.textContent = ''
            return
        }
        for(let i = 0; i < project.projectTasks.length; i++) {
            let task = document.createElement('div')
            tasksContent.appendChild(task)
            task.textContent = `${i + 1}. ${project.projectTasks[i].getTaskName()}, ${project.projectTasks[i].getTaskDueDate()}, ${project.projectTasks[i].getTaskPriority()}, ${project.projectTasks[i].getTaskDescription()}` 
        }
    } 

    return {setEventListeners, addProjectToSelector}
})()

manageDOM.setEventListeners()
let projectsList = []
window.addEventListener('open', () => {
    if(projectsList.length == 0) {
        let addTaskBtn = document.getElementById('add-new-task')
        addTaskBtn.disabled = tru
    }
    manageDOM.displayTasksOfProject
})

