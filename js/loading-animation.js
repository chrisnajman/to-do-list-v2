export default function loadingAnimation() {
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
