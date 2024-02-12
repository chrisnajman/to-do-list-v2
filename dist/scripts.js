"use strict"

/** Theme switcher */
function themeSwitcher() {
  const LOCAL_STORAGE_PREFIX = "TODOS-v2-local"
  const MODE_STORAGE_KEY = `${LOCAL_STORAGE_PREFIX}-switcher`

  const btnThemeToggle = document.getElementById("btn-theme-toggle")
  const themeLightMode = document.getElementById("theme-lightmode")
  const themeDarkMode = document.getElementById("theme-darkmode")
  const root = document.querySelector("html")
  const mode = document.getElementById("mode")

  btnThemeToggle.addEventListener("click", (e) => {
    e.preventDefault()
    root.classList.toggle("light-theme")

    const isLightMode = root.classList.contains("light-theme")

    e.target.setAttribute("aria-pressed", String(isLightMode))

    if (isLightMode) {
      lightModeStyle()
    } else {
      darkModeStyle()
    }

    const lightClass = themeLightMode.classList.contains("hide") ? "hide" : ""
    const darkClass = themeDarkMode.classList.contains("hide") ? "hide" : ""

    const themeItems = [isLightMode, lightClass, darkClass]
    localStorage.setItem(MODE_STORAGE_KEY, JSON.stringify(themeItems))
  })

  function setTheme() {
    const activeTheme = JSON.parse(localStorage.getItem(MODE_STORAGE_KEY)) || [
      false,
      "",
      "",
    ]

    const isLightMode = activeTheme[0]

    if (isLightMode) {
      root.classList.add("light-theme")
      lightModeStyle()
    } else {
      root.classList.remove("light-theme")
      darkModeStyle()
    }

    btnThemeToggle.setAttribute("aria-pressed", String(isLightMode))
  }

  function lightModeStyle() {
    themeDarkMode.classList.add("hide")
    themeLightMode.classList.remove("hide")
    mode.textContent = "off"
  }

  function darkModeStyle() {
    themeLightMode.classList.add("hide")
    themeDarkMode.classList.remove("hide")
    mode.textContent = "on"
  }

  setTheme()
}
themeSwitcher()

/** Loading animation */
function loadingAnimation() {
  window.addEventListener("load", () => {
    const loader = document.getElementById("loader")
    const pageLoaded = document.getElementById("page-loaded")

    loader.classList.add("loader-hidden")

    loader.addEventListener("transitionend", () => {
      loader.remove()

      // For screen readers
      pageLoaded.textContent = "Page has loaded."
      pageLoaded.setAttribute("aria-hidden", "false")
    })
  })
}
loadingAnimation()

/** To-do list */
/** ========== */

/** Delete all to-dos */
const deleteAllBtn = document.querySelector("[data-delete-all-todos]")

function deleteAllTodos() {
  deleteAllBtn.addEventListener("click", () => {
    if (window.confirm("Do you really want to delete all to-dos?")) {
      const keysToRemove = [
        "SORTABLE-TODO-LIST-v2-local-todos-redo",
        "SORTABLE-TODO-LIST-v2-local-sort-dates-enabled",
      ]

      keysToRemove.forEach((keyToRemove) => {
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i)
          if (key.startsWith(keyToRemove)) {
            localStorage.removeItem(key)
          }
        }
      })
      window.location.reload()
    }
  })
}

function enableDeleteAllBtn(todos) {
  if (todos.length > 1) {
    deleteAllBtn.removeAttribute("disabled")
  }
}

deleteAllBtn.setAttribute("disabled", "")
deleteAllTodos()

/** List */
function toDoList() {
  const LOCAL_STORAGE_PREFIX = "SORTABLE-TODO-LIST-v2-local"
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
toDoList()
