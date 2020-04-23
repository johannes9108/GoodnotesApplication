let postCounter = 0;
let database = new Map();
let body = document.body;
let wrapper = body.getElementsByClassName("wrapper")[0];
let header = wrapper.getElementsByTagName("header")[0];
let nav = wrapper.getElementsByTagName("nav")[0];
let sections = wrapper.getElementsByTagName("section");
let notesTitle = sections[0];
let notesArea = sections[1];
let newNoteForm = notesArea.children[0];
let createButton = newNoteForm.children[3].children[0];
createButton.addEventListener("click", function () {
  addNoteToDB(
    new Data(
      ++postCounter,
      newNoteForm.querySelector("input").value,
      newNoteForm.querySelector("textarea").value
    )
  );
  resetInputFileds();
  newNoteForm.classList.toggle("hide"); // Hide Input
  console.log("Innefrån createListener " + newNoteForm.classList);
  hideNotes(); // Reveal notes
  renderPosts(database, notesArea);
  // attachListenersToPosts();
});
let clearButton = newNoteForm.children[3].children[1];
clearButton.addEventListener("click", function () {
  resetInputFileds();
});

let navButtons = nav.firstElementChild.children;
navButtons[0].addEventListener("click", function () {
  // Change the view of Notesarea
});
navButtons[1].addEventListener("click", function () {
  // Open up NewArticleForm
  hideNotes(); // Hide notes
  newNoteForm.classList.toggle("hide"); // Reveal Input
  console.log("Innefrån navButton[1]Listener " + newNoteForm.classList);
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

function resetInputFileds() {
  newNoteForm.querySelector("input").value = "";
  newNoteForm.querySelector("textarea").value = "";
}
function addNoteToDB(note) {
  database.set(postCounter, note);
}
function Data(counter, title, content) {
  this.counter = counter;
  this.title = title;
  this.content = content;
}
function hideNotes() {
  for (let note of notesArea.querySelectorAll(".note")) {
    note.classList.toggle("hide");
  }
}

function concatenateHTMLNotes(posts) {
  let res = "";
  posts.forEach((element) => {
    res += createHTMLNote(element);
  });
  return res;
  // return `
  //           ${posts.map((post) => createHTMLNote(post)).join("")}

  //   `;
}
function createHTMLNote(postData) {
  // console.log("PD: " + postData.counter);

  return `
        <div class="note" >
            <div>
              <h4 class="title">${postData.title}#${postData.counter}</h4>
              <div>
              <button class="editNote hide"><i class="material-icons">edit</i></button>
              <button class="deleteNote hide"><i class="material-icons">delete</i></button>
              </div>
            </div>
            <p class="content">${postData.content}</p>
        </div>
    `;
}
function renderPosts(database, container) {
  console.log(database.get(postCounter));
  container.innerHTML += createHTMLNote(database.get(postCounter));
}

function attachListenersToPosts() {
  let notes = notesArea.querySelectorAll(".note");

  for (let note of notes) {
    note.addEventListener("click", function () {
      note.classList.toggle("noteExpanded");
      hideNotes();
      note.classList.toggle("hide");
      for (let button of note.querySelectorAll("button")) {
        button.classList.toggle("hide");
      }
    });
  }

  let editButtons = notesArea.querySelectorAll(".editNote");
  let deleteButtons = notesArea.querySelectorAll(".deleteNote");
  for (let editButton of editButtons) {
    editButton.addEventListener("click", () => {
      console.log("Test");
    });
  }
  for (let deleteButton of deleteButtons) {
    deleteButton.addEventListener("click", () => {
      let target = deleteButton.parentElement.parentElement.parentElement;
      let text = deleteButton.parentElement.parentElement.children[0].innerHTML;
      console.log(text);
      let key = text.split("#")[1];
      console.log(`key ${key} is being removed`);
      let x = notesArea.removeChild(target);
      database.delete(parseInt(key));
      console.log(database);
    });
  }
}
