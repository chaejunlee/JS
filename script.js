/*

투두 앱 추가할 기능

1. 날짜, 시간도 내용이랑 같이 입력
2. 목록 안의 내용을 수정 가능
3. 1번을 표시할 수 있는 자그마한 달력 ..?
같은 것들도 추가되면 괜찮을거 같아요
4. 중요도 체크

*/

let todoData
let highestIdx
const inputText = document.querySelector('.text-input')
const btn = document.querySelector('.button')
const saveButton = document.querySelector('.save')

btn.addEventListener('click', (e) => {
    const newContent = getText()
    if (newContent === '') return

    addToDB(newContent)

    printTodo()

    updateDB()
})

inputText.addEventListener('keypress', (e) => {
    if (e.key !== 'Enter') return

    const newContent = getText()

    addToDB(newContent)

    const todoList = document.querySelectorAll('.todo')

    printTodo()

    updateDB()
})

onStart()

function onStart() {
    todoData = JSON.parse(localStorage.getItem('todoData'))
    if (todoData === null) {
        localStorage.clear()
        todoData = []
    }

    highestIdx = parseInt(localStorage.getItem('highestIdx'))
    if (highestIdx === null) {
        highestIdx = 0
    }

    todoData.forEach((data) => {
        addNewTask(data)
    })
}

function addNewTask(newTodo) {
    if (newTodo.text === '') return

    const todoList = document.querySelector('.list')

    const newList = document.createElement('div')
    newList.className = 'todo'

    const checkButton = document.createElement('button')
    checkButton.className = 'checkButton'
    checkButton.innerText = '완료'
    checkButton.addEventListener('click', (e) => {
        const task = e.path[1].childNodes[1]
        task.classList.toggle('done')
        if (task.classList.contains('done')) {
            newTodo.done = true
        } else {
            newTodo.done = false
        }
        updateDB()
    })

    const textArea = document.createElement('p')
    textArea.className = 'text'
    textArea.innerText = newTodo.text
    if (newTodo.done === true) {
        textArea.classList.toggle('done')
    }
    textArea.addEventListener('click', (e) => {
        const task = e.path[0]
        console.log(task)
        task.classList.toggle('done')
        if (task.classList.contains('done')) {
            newTodo.done = true
        } else {
            newTodo.done = false
        }
        updateDB()
    })

    const deleteButton = document.createElement('button')
    deleteButton.className = 'deleteButton'
    deleteButton.innerText = '지우기'
    deleteButton.addEventListener('click', (e) => {
        e.path[1].remove()
        todoData = todoData.filter((data) => {
            return data.idx !== newTodo.idx
        })
        updateDB()
    })

    newList.append(checkButton)
    newList.append(textArea)
    // newList.append(editButton)
    newList.append(deleteButton)

    todoList.append(newList)
}

function addToDB(newContent) {
    if (newContent === '') return
    let newTodo = {
        idx: highestIdx++,
        text: newContent,
        done: false,
        important: 0
    }
    todoData.push(newTodo)
}

function printTodo() {
    const todoList = document.querySelectorAll('.todo')

    todoList.forEach((data) => {
        data.remove()
    })

    todoData.forEach((data) => {
        addNewTask(data)
    })
}

function getText() {
    const input = document.querySelector('.text-input')
    const inputText = input.value
    input.value = ''
    return inputText
}

function updateDB() {
    if (todoData.length === 0) highestIdx = 0

    localStorage.setItem('todoData', JSON.stringify(todoData))
    localStorage.setItem('highestIdx', highestIdx)
}