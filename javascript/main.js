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
let createButton;
initNewNoteForm();
function initNewNoteForm() {
  newNoteForm = notesArea.querySelector(".newNoteForm");
  createButton = newNoteForm.querySelector("button");
  createButton.addEventListener("click", function () {
    addNoteToDB(
      new Data(
        ++noteCounter,
        newNoteForm.querySelector("input").value,
        newNoteForm.querySelector("textarea").value
      )
    );
    resetInputFileds();
    newNoteForm.classList.toggle("hide"); // Hide Input
    // console.log("Innefrån createListener " + newNoteForm.classList);
    hideNotes(); // Reveal notes
    renderNewPost(database, noteCounter);
  });
  let clearButton = newNoteForm.children[3].children[1];
  clearButton.addEventListener("click", function () {
    resetInputFileds();
  });
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
}
function addNoteToDB(note) {
  database.set(noteCounter, note);
  console.log("DB status after Insert: ");
  database.forEach((note) => console.log(note));
}
function Data(id, title, content) {
  this.id = id;
  this.title = title;
  this.content = content;
  this.bg = getBackgroundColor();
  this.color = getTextColor();
}
function hideNotes() {
  for (let note of notesArea.querySelectorAll(".note")) {
    note.classList.toggle("hide");
  }
}

function createHTMLNote(postData) {
  // console.log("PD: " + postData.counter);

  // return `
  //       <div class="note" >
  //           <div>
  //             <h4 class="title">${postData.title}#${postData.counter}</h4>
  //             <input class="hide" type="text" placeholder="${postData.title}" />
  //             <div>
  //             <button class="editNote hide"><i class="material-icons">edit</i></button>
  //             <button class="deleteNote hide"><i class="material-icons">delete</i></button>
  //             </div>
  //           </div>
  //           <p class="content">${postData.content}</p>
  //           <textarea class="hide"placeholder="${postData.content}"></textarea>
  //       </div>
  //   `;

  let clone = notePrototype.cloneNode(true);
  clone.querySelector(".title").innerText = postData.id + "#" + postData.title;
  clone.querySelector(".content").innerText = postData.content;
  clone.querySelector("input").value = postData.title;
  clone.querySelector("textarea").value = postData.content;
  clone.querySelector("span").innerText = postData.id;
  clone.classList.remove("prototype");
  clone.style.color = postData.color;
  clone.style.backgroundColor = postData.bg;

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

  title.classList.toggle("hide");
  inputTitle.classList.toggle("hide");
  content.classList.toggle("hide");
  inputContent.classList.toggle("hide");
}
