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
const updateButton = document.querySelector('.addButton')
const todoDialog = document.querySelector('.todoDialog')
const inputBox = document.querySelector('.input-box')

const shadowTop = document.querySelector('.shadow--top')
const shadowBottom = document.querySelector('.shadow--bottom')
const content = document.querySelector('.list-content')
const container = document.querySelector('.list-container')
const placeholder = document.createElement('p')
placeholder.classList.add('placeholder')
placeholder.innerText = `엔터를 눌러
새로운 태스크를
추가하세요`

window.addEventListener('keypress', enterToShow)

const TRANSITION_TIME = 250

let contentScrollHeight = content.scrollHeight - container.offsetHeight

function addShadow() {
    contentScrollHeight = content.scrollHeight - container.offsetHeight
    if (contentScrollHeight > 0) {
        console.log(contentScrollHeight)
        shadowBottom.style.opacity = 1
        return
    }

    shadowTop.style.opacity = 0
    shadowBottom.style.opacity = 0
}

// content.addEventListener('scroll', function () {
//     // addShadow()
//     contentScrollHeight = content.scrollHeight - container.offsetHeight
//     console.log(contentScrollHeight)
//     let currentScroll = this.scrollTop / (contentScrollHeight)
//     //console.log(this.scrollTop)
//     shadowTop.style.opacity = currentScroll
//     shadowBottom.style.opacity = 1 - currentScroll
// })

updateButton.addEventListener('click', () => {
    if (typeof todoDialog.showModal === 'function') {
        todoDialog.showModal();
        window.removeEventListener('keypress', enterToShow)
        requestAnimationFrame(() => {
            todoDialog.classList.add('show-modal')
        })
    } else {
        alert("The <dialog> API is not supported by this browser");
    }
})

todoDialog.addEventListener('close', () => {
    //
})

btn.addEventListener('click', (e) => {
    const newContent = getText()
    if (newContent === '') return

    setTimeout(() => {
        todoDialog.close()

        printTodo()
        // addNewTask(addToDB(newContent))

        updateDB()

        // addShadow()
        window.addEventListener('keypress', enterToShow)
    }, TRANSITION_TIME)

    todoDialog.classList.remove('show-modal')
})

inputText.addEventListener('keypress', (e) => {
    if (e.key !== 'Enter') return

    const newContent = getText()

    setTimeout(() => {
        todoDialog.close()

        addToDB(newContent)

        printTodo()
        // addNewTask(addToDB(newContent))

        updateDB()

        // addShadow()
        window.addEventListener('keypress', enterToShow)
    }, TRANSITION_TIME)

    todoDialog.classList.remove('show-modal')
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

    // addShadow()
}

function addNewTask(newTodo, show = 0) {
    if (newTodo.text === '') return

    const todoList = document.querySelector('.list')

    const newList = document.createElement('div')
    newList.className = 'todo'

    const checkButton = document.createElement('input')
    checkButton.setAttribute('type', 'checkbox')
    checkButton.classList.add('icon')
    checkButton.checked = newTodo.done
    checkButton.addEventListener('click', (e) => {
        newTodo.done = !newTodo.done
        checkButton.checked = newTodo.done

        const task = e.path[1].childNodes[1]
        if (newTodo.done) {
            task.classList.add('done')
        } else {
            task.classList.remove('done')
        }

        updateDB()
    })

    const textArea = document.createElement('p')
    textArea.classList.add('text')
    textArea.innerText = newTodo.text
    if (newTodo.done) {
        textArea.classList.add('done')
    } else {
        textArea.classList.remove('done')
    }
    textArea.addEventListener('click', (e) => {
        newTodo.done = !newTodo.done
        const task = e.path[1].childNodes[0]
        if (newTodo.done) {
            textArea.classList.add('done')
            task.checked = true
        } else {
            textArea.classList.remove('done')
            task.checked = false
        }
        updateDB()
    })

    // const deleteButton = document.createElement('button')
    // deleteButton.className = 'deleteButton'
    // deleteButton.innerText = '지우기'
    // deleteButton.addEventListener('click', (e) => {
    //     e.path[1].remove()
    //     todoData = todoData.filter((data) => {
    //         return data.idx !== newTodo.idx
    //     })
    //     updateDB()
    // })

    const deleteIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    // deleteIcon.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
    deleteIcon.setAttribute('height', '20px')
    deleteIcon.setAttribute('width', '20px')
    deleteIcon.setAttribute('viewBox', '0 0 24 24')
    deleteIcon.setAttribute('fill', '#666666')

    const deleteIconSVG = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    deleteIconSVG.setAttribute('d', 'M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z')
    deleteIconSVG.setAttribute('height', '300px')
    deleteIcon.append(deleteIconSVG)

    deleteIcon.classList.add('close')

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

function addToDB(newContent) {
    if (newContent === '') return
    let newTodo = {
        idx: highestIdx++,
        text: newContent,
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

    // addShadow()
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

function enterToShow(e, args) {
    if (e.key !== 'Enter') return

    if (typeof todoDialog.showModal === 'function') {
        todoDialog.showModal();
        requestAnimationFrame(() => {
            todoDialog.classList.add('show-modal')
        })
        window.removeEventListener('keypress', enterToShow);
    } else {
        alert("The <dialog> API is not supported by this browser");
    }
}