export const deleteAllBtn = document.querySelector("[data-delete-all-todos]")

export default function deleteAllTodos() {
  deleteAllBtn.addEventListener("click", () => {
    if (window.confirm("Do you really want to delete all to-dos?")) {
      const keysToRemove = [
        "SORTABLE-TODO-LIST-todos-redo",
        "SORTABLE-TODO-LIST-sort-dates-enabled",
        "SORTABLE-TODO-LIST-toolbar-border-state",
        "SORTABLE-TODO-LIST-list-border-state",
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

export function enableDeleteAllBtn(todos) {
  if (todos.length > 1) {
    deleteAllBtn.removeAttribute("disabled")
  }
}
