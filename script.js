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
const inputDate = document.querySelector('.date-input')
const btn = document.querySelector('.button')
const updateButton = document.querySelector('.addButton')
const todoDialog = document.querySelector('.todoDialog')
const inputBox = document.querySelector('.input-box')
const modalCloseButton = document.querySelector('.modal-close')

const placeholder = document.createElement('p')
placeholder.classList.add('placeholder')
placeholder.innerText =
    `엔터 혹은 + 를 눌러
새로운 태스크를
추가하세요`

const TRANSITION_TIME = 250

window.addEventListener('keypress', openModal)
updateButton.addEventListener('click', openModal)

btn.addEventListener('click', closeModal)
inputText.addEventListener('keypress', (e) => closeModal(e, { method: 'keyboard' }))
modalCloseButton.addEventListener('click', (e) => closeModal(e, { method: 'button' }))

todoDialog.addEventListener('close', () => {
    window.addEventListener('keypress', openModal)
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

    if (todoData.length === 0) {
        const todoList = document.querySelector('.list')
        todoList.append(placeholder)
    }

    todoData.forEach((data) => {
        addNewTask(data)
    })
}

function addNewTask(newTodo, show = 0) {
    if (newTodo.text === '') return

    const todoList = document.querySelector('.list')

    const newList = document.createElement('div')
    newList.className = 'todo'

    const checkButton = document.createElement('input')
    const textArea = document.createElement('p')

    checkButton.setAttribute('type', 'checkbox')
    checkButton.classList.add('icon')
    checkButton.checked = newTodo.done
    checkButton.addEventListener('click', (e) => {
        newTodo.done = !newTodo.done
        checkButton.checked = newTodo.done

        const task = textArea
        if (newTodo.done) {
            task.classList.add('done')
        } else {
            task.classList.remove('done')
        }

        updateDB()
    })

    textArea.classList.add('text')
    const date = new Date(newTodo.dueDate)
    textArea.innerText = newTodo.text + ' ' + newTodo.dueDate

    if (newTodo.done) {
        textArea.classList.add('done')
    } else {
        textArea.classList.remove('done')
    }
    textArea.addEventListener('click', (e) => {
        newTodo.done = !newTodo.done
        const task = checkButton
        if (newTodo.done) {
            textArea.classList.add('done')
            task.checked = true
        } else {
            textArea.classList.remove('done')
            task.checked = false
        }
        updateDB()
    })

    const deleteIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    // deleteIcon.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
    deleteIcon.setAttribute('height', '1.5rem')
    deleteIcon.setAttribute('width', '1.5rem')
    deleteIcon.setAttribute('viewBox', '0 0 24 24')
    deleteIcon.setAttribute('fill', '#666666')

    const deleteIconSVG = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    deleteIconSVG.setAttribute('d', 'M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z')
    // deleteIconSVG.setAttribute('height', '300px')
    deleteIcon.append(deleteIconSVG)

    deleteIcon.classList.add('close')
    deleteIcon.classList.add('icon')

    deleteIcon.addEventListener('click', (e) => {
        todoData = todoData.filter((data) => {
            return data.idx !== newTodo.idx
        })
        updateDB()
        printTodo()
    })

    // newList.classList.add('show')
    newList.append(checkButton)
    newList.append(textArea)
    // newList.append(editButton)
    // newList.append(deleteButton)
    newList.append(deleteIcon)

    todoList.prepend(newList)
}

function addToDB(newContent, dueDate) {
    if (newContent === '') return
    let newTodo = {
        idx: highestIdx++,
        text: newContent,
        dueDate: dueDate,
        done: false,
        important: 0
    }
    todoData.push(newTodo)

    return newTodo
}

function printTodo() {
    const todoList = document.querySelectorAll('.todo')

    todoList.forEach((data) => {
        data.remove()
    })

    todoData.forEach((data, idx) => {
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

    if (todoData.length === 0) {
        const todoList = document.querySelector('.list')
        todoList.append(placeholder)
    } else {
        placeholder.remove();
    }
}

function openModal(e, args) {
    if (e.key === 'Enter' || e.key === undefined) {
        if (typeof todoDialog.showModal === 'function') {
            todoDialog.showModal();
            inputDate.value = getCurrentTime()
            requestAnimationFrame(() => {
                todoDialog.classList.add('show-modal')
            })
            window.removeEventListener('keypress', openModal)
        } else {
            alert("The <dialog> API is not supported by this browser");
        }
    }
}

function closeModal(e, args) {
    if (e.key === 'Enter' || args.method === 'button' || args.method !== 'keyboard') {
        const newContent = getText()

        if (newContent == '' && args.method !== 'button') return;

        const dueDate = document.querySelector('.date-input').value
        const todoDialog = document.querySelector('.todoDialog')

        setTimeout(() => {
            todoDialog.close()

            addToDB(newContent, dueDate)

            printTodo()

            updateDB()

            // addShadow()
            window.addEventListener('keypress', openModal)
        }, TRANSITION_TIME)

        todoDialog.classList.remove('show-modal')
    }
}

function getCurrentTime() {
    const offset = new Date().getTimezoneOffset() * 60000;
    const now = new Date(Date.now() - offset)
    return now.toISOString().substring(0, 16)
}