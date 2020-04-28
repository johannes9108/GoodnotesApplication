let noteCounter = 0;
let database = new Map();
let body = document.body;
let wrapper = body.getElementsByClassName("wrapper")[0];
let header = wrapper.getElementsByTagName("header")[0];
let nav = wrapper.getElementsByTagName("nav")[0];
let sections = wrapper.getElementsByTagName("section");
let notesTitle = sections[0];
let notesArea = sections[1];
let newNoteForm = notesArea.querySelector(".newNoteForm");
let notePrototype = notesArea.querySelector(".note.prototype");
let checkListForm = newNoteForm.querySelector(".checkListForm");
let title = checkListForm.querySelector("#title");
let listItemPrototype = checkListForm.querySelector(".listItem.prototype");
let checkListPrototype = newNoteForm.querySelector(".checkList.prototype");

console.log("Proto: " + checkListPrototype);
let createButton;

initNewNoteForm();
function initNewNoteForm() {
  newNoteForm = notesArea.querySelector(".newNoteForm");
  createButton = newNoteForm.querySelector("button.createButton");
  createButton.addEventListener("click", function () {
    addNoteToDB(
      new Data(
        ++noteCounter,
        newNoteForm.querySelector("input").value,
        newNoteForm.querySelector("textarea").value,
        convertDOMCLtoDBCL(newNoteForm.querySelectorAll(".concrete"))
      )
    );
    for (entry of database) console.log(entry);

    resetInputFileds();
    newNoteForm.classList.toggle("hide"); // Hide Input
    // console.log("Innefrån createListener " + newNoteForm.classList);
    hideNotes(); // Reveal notes
    renderNewPost(database, noteCounter);
  });
  let clearButton = newNoteForm.querySelector("button.clearButton");
  clearButton.addEventListener("click", function () {
    resetInputFileds();
  });
  let addCheckButton = newNoteForm.querySelector("button.addCheckItem");
  addCheckButton.addEventListener("click", function () {
    let clone = listItemPrototype.cloneNode(true);
    clone.classList.remove("prototype");
    clone.querySelector("button").addEventListener("click", function () {
      console.log("This parent: " + this.parentElement.remove());
    });
    checkListForm.querySelector("div.listItemContainer").append(clone);
  });
  let saveCheckListButton = newNoteForm.querySelector("button.saveCheckList");
  saveCheckListButton.addEventListener("click", function () {
    let edit = newNoteForm.querySelector(".editable");
    let items = checkListForm.querySelectorAll(".item");

    if (edit != null) {
      edit.replaceWith(createNewDOMCheckList(items));
      edit.classList.toggle("editable");
      resetCheckListForm();
    } else {
      if (items.length > 0) {
        console.log("Title : " + title.value);
        let container = newNoteForm.querySelector(".checkListContainer");
        container.append(createNewDOMCheckList(items));
      }
    }
  });
  let deleteCheckListButton = newNoteForm.querySelector(
    "button.deleteCheckList"
  );
  deleteCheckListButton = deleteCheckListButton.addEventListener(
    "click",
    function () {
      deleteSelectedCheckList();
    }
  );
}
function convertDOMCLtoDBCL(checklists) {
  if (checklists.length > 0) {
    let checkListArray = [];
    for (let checklist of checklists) {
      let title = checklist.querySelector("h5").innerText;
      let items = [];
      for (let item of checklist.querySelectorAll("li")) {
        items.push(item.innerText);
      }
      checkListArray.push(new CheckList(title, items));
      console.log("CLA: " + checkListArray.length);
    }
    return checkListArray;
  } else {
    console.log("Empty");
    return [];
  }
}
function createNewDOMCheckList(items) {
  let clone = checkListPrototype.cloneNode(true);

  clone.addEventListener("click", function () {
    if (!clone.classList.contains("editable")) {
      clone.classList.toggle("editable");
      title.value = this.querySelector("h5").innerText;
      let editInputs = this.querySelectorAll("li");
      let editContainer = checkListForm.querySelector(".listItemContainer");
      for (editInput of editInputs) {
        let newItem = listItemPrototype.cloneNode(true);
        newItem.classList.remove("prototype");
        newItem.querySelector("button").addEventListener("click", function () {
          console.log("This parent: " + this.parentElement.remove());
        });
        newItem.querySelector(".item").value = editInput.innerText;
        editContainer.append(newItem);
      }
    }
  });

  clone.classList.remove("prototype");
  clone.classList.add("concrete");
  clone.querySelector("h5").innerText = title.value;
  title.value = "";
  let ul = clone.querySelector("ul");
  for (let item of items) {
    console.log("Item: " + item.value);
    let li = document.createElement("li");
    li.innerText = item.value;
    item.parentElement.remove();
    ul.append(li);
  }
  return clone;
}
function createNewDOMCheckListFromDB(checkList) {
  let h5 = document.createElement("h5");
  // h5.contentEditable = "true";
  let ul = document.createElement("ul");
  let li = document.createElement("li");
  // li.contentEditable = "true";
  h5.innerText = checkList.title;
  for (let item of checkList.items) {
    li.innerText = item;
    ul.append(li);
  }
  let div = document.createElement("div");
  div.append(h5);
  div.append(ul);
  return div;
}
function deleteSelectedCheckList() {
  let edit = newNoteForm.querySelector(".editable");
  console.log("Delete clicked: " + edit);
  if (edit != null) {
    edit.remove();
    resetCheckListForm();
  }
}

function resetCheckListForm() {
  let title = checkListForm.querySelector("#title");
  let items = checkListForm.querySelectorAll(".item");
  title.value = "";
  for (item of items) {
    item.parentElement.remove();
  }
}
let navButtons = nav.firstElementChild.children;
navButtons[0].addEventListener("click", function () {
  // Change the view of Notesarea
  notesArea.classList.toggle("list");
  let x = notesArea.querySelectorAll(".note");
});
navButtons[1].addEventListener("click", function () {
  // Open up NewArticleForm
  resetInputFileds();
  hideNotes(); // Hide notes
  // let x = document.querySelector("p");
  newNoteForm.style.backgroundColor = getBackgroundColor();
  // newNoteForm.style.backgroundColor = `${activeBackgroundColor}`;
  newNoteForm.style.color = getTextColor();
  newNoteForm.classList.toggle("hide"); // Reveal Input
  // console.log("Innefrån navButton[1]Listener " + newNoteForm.classList);
});
navButtons[2].addEventListener("click", function () {
  // Change the view of select multiple notes???
});
navButtons[3].addEventListener("click", function () {
  // Open up colorpicker and change text color
});
navButtons[4].addEventListener("click", function () {
  // Open up colorpicker and change background color
});

let activeColor = getTextColor();
function getTextColor() {
  return navButtons[3].querySelector("input").value;
}
let activeBackgroundColor = getBackgroundColor();
function getBackgroundColor() {
  return navButtons[4].querySelector("input").value;
}
console.log(activeColor + ":" + activeBackgroundColor);

function resetInputFileds() {
  newNoteForm.querySelector("input").value = "";
  newNoteForm.querySelector("textarea").value = "";
  let clChildren = checkListForm.querySelectorAll(".listItem");
  for (clChild of clChildren) {
    clChild.remove();
  }
}
function addNoteToDB(note) {
  database.set(noteCounter, note);
  console.log("DB status after Insert: ");
  database.forEach((note) => console.log(note));
}
function Data(id, title, content, checkLists) {
  this.id = id;
  this.title = title;
  this.content = content;
  this.bg = getBackgroundColor();
  this.color = getTextColor();
  this.checkLists = checkLists;
}
function CheckList(title, items) {
  this.title = title;
  this.items = items;
}
function hideNotes() {
  for (let note of notesArea.querySelectorAll(".note")) {
    note.classList.toggle("hide");
  }
}

function createHTMLNote(postData) {
  let clone = notePrototype.cloneNode(true);
  clone.querySelector(".title").innerText = postData.id + "#" + postData.title;
  clone.querySelector(".content").innerText = postData.content;
  clone.querySelector("input").value = postData.title;
  clone.querySelector("textarea").value = postData.content;
  clone.querySelector("span").innerText = postData.id;
  clone.classList.remove("prototype");
  clone.style.color = postData.color;
  clone.style.backgroundColor = postData.bg;
  let checkLists = clone.querySelector(".checklists");
  for (checklist of postData.checkLists) {
    checkLists.append(createNewDOMCheckListFromDB(checklist));
  }

  return clone;
}
function renderNewPost(database, key) {
  let newNote = createHTMLNote(database.get(key));
  attachListenersToNote(newNote);
  notesArea.append(newNote);
  // container.innerHTML += createHTMLNote(database[database.length - 1]);
  // initNewNoteForm();
}
const expandFunc = function (note) {
  note.classList.toggle("noteExpanded");
  hideNotes();
  note.classList.toggle("hide");
  for (let button of note.querySelectorAll(".editNote, .deleteNote")) {
    button.classList.toggle("hide");
  }
  let checkList = note.querySelector(".checklists");
  checkList.classList.toggle("hide");
};
function attachListenersToNote(newNote) {
  let noteIndex = noteCounter;
  let expandButton = newNote.querySelector(".expandNote");
  expandButton.addEventListener("click", function () {
    if (newNote.classList.contains("edit-mode")) {
      newNote.classList.remove("edit-mode");
      editModeToggle(newNote);
    }
    console.log("Expand: " + expandButton.classList);
    expandFunc(expandButton.parentElement.parentElement.parentElement);
  });

  let editButton = newNote.querySelector(".editNote");
  // editButtons.splice(0,1)
  editButton.addEventListener("click", () => {
    if (newNote.classList.contains("edit-mode")) {
      console.log("Saving!!");
      updateNote(newNote);

      console.log("Id: " + newNote.querySelector("span").innerText);
      updateDatabase(
        newNote,
        parseInt(newNote.querySelector("span").innerText)
      );
      editModeToggle(newNote);
      newNote.classList.toggle("edit-mode");
      console.log("DB status after update: ");
      database.forEach((note) => console.log(note));
    } else {
      console.log("Entering edit mode");
      editModeToggle(newNote);
      newNote.classList.toggle("edit-mode");
    }
  });

  let deleteButton = newNote.querySelector(".deleteNote");

  deleteButton.addEventListener("click", () => {
    notesArea.removeChild(newNote);
    database.delete(parseInt(newNote.querySelector("span").innerText));
    console.log("DB status after delete: ");
    database.forEach((note) => console.log(note));
    hideNotes();
  });
}
function updateNote(note) {
  note.querySelector(".title").innerText = note.querySelector("input").value;
  note.querySelector(".content").innerText = note.querySelector(
    "textarea"
  ).value;
}
function updateDatabase(updateNote, noteID) {
  let dbNote = database.get(noteID);
  console.log(dbNote);
  dbNote.title = updateNote.querySelector("input").value;
  dbNote.content = updateNote.querySelector("textarea").value;
}
function editModeToggle(note) {
  let title = note.querySelector(".title");
  let inputTitle = note.querySelector("input");
  let content = note.querySelector(".content");
  let inputContent = note.querySelector("textarea");
  // let checklistForm = note.querySelector(".editCheckListForm");
  // let section = note.querySelector("section");

  title.classList.toggle("hide");
  inputTitle.classList.toggle("hide");
  content.classList.toggle("hide");
  inputContent.classList.toggle("hide");
  checklistForm.classList.toggle("hide");
  // section.classList.toggle("edit-view");
}
