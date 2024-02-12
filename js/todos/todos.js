import deleteAllTodos, {
  deleteAllBtn,
  enableDeleteAllBtn,
} from "./delete-all-todos.js"

deleteAllBtn.setAttribute("disabled", "")
deleteAllTodos()

export default function toDoList() {
  const LOCAL_STORAGE_PREFIX = "SORTABLE-TODO-LIST"
  const TODOS_STORAGE_KEY = `${LOCAL_STORAGE_PREFIX}-todos-redo`
  const SORT_DATE_BUTTON_STORAGE_KEY = `${LOCAL_STORAGE_PREFIX}-sort-dates-enabled`
  const form = document.querySelector("#new-todo-form")
  const resetFormButton = document.getElementById("reset")
  const inputText = document.querySelector("[data-input-text]")
  const inputDate = document.querySelector("[data-input-date]")
  const list = document.getElementById("list")
  const template = document.querySelector("#list-item-template")

  const sortButton = document.querySelector("[data-sort-button]")
  sortButton.setAttribute("disabled", "")

  let todos = loadTodos()
  todos.forEach((todo) => renderTodo(todo))

  form.addEventListener("submit", (e) => {
    e.preventDefault()

    const todoName = inputText.value

    const dateValue = inputDate.value
    const dateArray = dateValue.split("-")
    const dateString = dateArray.reverse().join("/")

    if (todoName === "") return
    const newTodo = {
      date: dateString,
      name: todoName,
      complete: false,
      edited: false,
      id: new Date().valueOf().toString(),
    }

    todos.push(newTodo)
    renderTodo(newTodo)
    saveTodos()
    inputDate.value = ""
    inputText.value = ""
    inputText.setAttribute("placeholder", "Add a task...")
  })

  function renderTodo(todo) {
    const templateClone = template.content.cloneNode(true)

    const listItem = templateClone.querySelector(".list-item")
    listItem.dataset.todoId = todo.id

    const textElement = templateClone.querySelector("[data-list-item-text]")
    textElement.innerText = todo.name

    if (todo.date) {
      const date = templateClone.querySelector("[data-list-item-date]")
      const dateParts = todo.date.split("/")
      const parsedDate = new Date(
        `${dateParts[1]}/${dateParts[0]}/${dateParts[2]}`
      )
      date.textContent = parsedDate.toLocaleDateString("en-GB")
    }

    const completeBtnText = templateClone.querySelector(
      "[data-button-complete]"
    )
    todo.complete
      ? (completeBtnText.innerText = "Uncomplete")
      : (completeBtnText.innerText = "Complete")
    listItem.classList.toggle("complete", todo.complete)

    enableSortButton()
    enableDeleteAllBtn(todos)

    list.appendChild(templateClone)
  }

  // Edit button
  list.addEventListener("click", (e) => {
    if (!e.target.matches("[data-button-edit]")) return

    e.target.innerText = e.target.innerText === "Edit" ? "Save edit" : "Edit"
    const parent = e.target.closest(".list-item")
    const text = parent.querySelector("[data-list-item-text]")

    text.toggleAttribute("contenteditable")

    const todoId = parent.dataset.todoId
    const todo = todos.find((t) => {
      return t.id === todoId
    })

    todo.edited = !text.hasAttribute("contenteditable")

    if (todo.edited) todo.name = text.innerText

    saveTodos()
  })

  // Complete button
  list.addEventListener("click", (e) => {
    if (!e.target.matches("[data-button-complete]")) return
    e.target.innerText =
      e.target.innerText === "Complete" ? "Uncomplete" : "Complete"

    const parent = e.target.closest(".list-item")

    parent.classList.toggle("complete")

    const todoId = parent.dataset.todoId
    const todo = todos.find((t) => {
      return t.id === todoId
    })
    todo.complete = parent.classList.contains("complete")

    saveTodos()
  })

  // Delete button (single to-do)
  list.addEventListener("click", (e) => {
    if (!e.target.matches("[data-button-delete]")) return

    // Remove from the screen
    const parent = e.target.closest(".list-item")

    parent.remove()

    // Remove from list
    const todoId = parent.dataset.todoId

    todos = todos.filter((todo) => {
      return todo.id !== todoId
    })

    saveTodos()
  })

  // Sort button: date oldest first (ascending)
  sortButton.addEventListener("click", () => {
    todos.sort((a, b) => {
      return parseDate(a.date) - parseDate(b.date)
    })
    saveAndRenderTodos()
  })

  // Form reset
  resetFormButton.addEventListener("click", (e) => {
    e.preventDefault()
    inputDate.value = ""
    inputText.value = ""
  })

  // Local storage
  function saveTodos() {
    localStorage.setItem(TODOS_STORAGE_KEY, JSON.stringify(todos))
  }

  function loadTodos() {
    const todosString = localStorage.getItem(TODOS_STORAGE_KEY)
    return JSON.parse(todosString) || []
  }

  // save todos and render the list
  function saveAndRenderTodos() {
    saveTodos()
    // Clear existing list
    list.innerHTML = ""
    // Render sorted todos
    todos.forEach((todo) => renderTodo(todo))
  }

  /**
    Enable sort button only when there are 2 or more todos;
    disable when there are less than 2
  */
  function enableSortButton() {
    if (todos.length >= 2) {
      sortButton.removeAttribute("disabled")
      localStorage.setItem(SORT_DATE_BUTTON_STORAGE_KEY, "true")
    } else {
      sortButton.setAttribute("disabled", "")
      localStorage.setItem(SORT_DATE_BUTTON_STORAGE_KEY, "false")
    }
  }

  // Parse date string into Date object
  function parseDate(dateString) {
    const dateArray = dateString.split("/")
    const reversedDateArray = dateArray.reverse()
    const formattedDateString = reversedDateArray.join("/")
    return new Date(formattedDateString)
  }
}
