# Sortable Todo List (V2)

---

- [Description](#description)
- [Form](#form)
- [Toolbar](#toolbar)
  - [Button: Reorder Entries by Date (asc)](#button-reorder-entries-by-date-asc)
  - [Button: Delete all entries](#button-delete-all-entries)- [To-do List](#to-do-list)
- [To-do List](#to-do-list)
- [The 'dist' Folder](#the-dist-folder)
  - [JavaScript](#javascript)
  - [CSS](#css)
- [Accessibility](#accessibility)
  - [WAVE Web Accessibility Evaluation Tools Report](#wave-web-accessibility-evaluation-tools-report)
- [Testing](#testing)

---

## Description

- Create to-do tasks and add them to a list.
- Edit and complete to-do tasks.
- Delete individual tasks
- Delete all tasks.
- Tasks can be resorted in ascending date order, if the dates get out of synch.
- All to-dos are saved to local storage. The data will still be present after refreshing or reopening the page.
  - Deleting to-dos, singly or collectively, will delete them permanently from local storage.

> [!NOTE]
> This is an upgrading and updating of an [earlier app](https://chrisnajman.github.io/sortable-todo-list/) which I now consider deprecated. The main difference is that in the current version the 'Reorder entries?' button (for maintaining date order) substitutes for drag-and-drop in the earlier version (which I found to be buggy).

---

## Form

### Inputs

- **Date**: Required.
- **To-do**: Required.

### Buttons

- **Add to-do**: Submit a task to the to-do list.
- **Reset**: Clear date and text inputs and prevent submission to the to-do list.

---

## Toolbar

### Button: Reorder Entries by Date (asc)

Disabled until two to-dos have been generated. Its function is to sort the to-dos in ascending order if the date sequence gets out of sync. 

> [!NOTE]
> This might occur, for example, if a day is missed and added later, or if a to-do is accidentally deleted  and needs to be reinserted.
> Something else.

### Button: Delete all entries

Disabled until two to-dos have been generated. Clicking it will launch a 'confirm' dialog. If 'yes' is clicked, local storage for the following keys will be deleted:

- To-dos for all dates in the to-do list.
- The 'Reorder entries?' button state value.

> [!NOTE]
> Local storage will be cleared for only this specific pair of keys in the Sortable Todo List (V2) app; local storage for other apps will not be affected.

> [!CAUTION] 
> **All** to-dos will be permanently deleted from local storage.

---

## To-do List

- **Edit**: Change or delete the to-do text. Then click `Save Edit`.
- **Complete**: Grey-out the to-do item and `strike-through` the to-do text. Click `Uncomplete` to revert.
- **Delete**: Delete the to-do item.

> [!CAUTION] 
> Clicking 'Delete' will permanently delete the individual to-do item from local storage.

---

## The 'dist' Folder

### JavaScript

The 'main' version structures the JavaScript with ES6 Modules. ES6 Modules will not work if you want to run the app from the local file system (In Windows, this is `file:///C:/Users/...`). Therefore, in the 'dist' folder, all JavaScript is consolidated into 1 file (`scripts.js`). `scripts.js` is minified in a ['Babel'-like JavaScript compressor](https://jscompress.com/) and output to `scripts.min.js`. The app can then be run locally by clicking 'index.html'.

> [!NOTE]
> The 'dist' version also runs on the server.

> [!NOTE] 
> `scripts.min.js` is not readable by humans. To inspect the JavaScript, look in `scripts.js`.

> [!NOTE]
> The functionality remains the same in both versions.

### CSS

The 'main' version structures the CSS with individual files imported into `index.css`. The 'dist'version compresses all CSS files into one, `style.css`. This is then minified and output to `style.min.css`.

> [!NOTE]
> The styling remains the same in both versions.


### SVGs

The 'main' version loads SVG icons via `./img/sprite.svg`. As SVG sprites don't work on the local file system, the SVG icons in 'dist' are coded directly into `index.html`.

---

## Accessibility

### WAVE Web Accessibility Evaluation Tools Report

- [Automated accessibility analysis results (passed)](https://wave.webaim.org/report#/https://chrisnajman.github.io/to-do-list-v2/)

---

## Testing

Tested on Windows 10 with:

- Chrome
- Firefox
- Microsoft Edge

Page tested in both browser and device views.
