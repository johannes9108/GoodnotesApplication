let body = document.body;
let wrapper = body.getElementsByClassName("wrapper")[0];
let header = wrapper.getElementsByTagName("header")[0];
let nav = wrapper.getElementsByTagName("nav")[0];
let sections = wrapper.getElementsByTagName("section");
let notesTitle = sections[0];
let notesArea = sections[1];

let navButtons = nav.firstElementChild.children;
let postCounter = 0;
let database = new Map();

function Data(counter) {
  this.counter = counter;
  this.title = "Title";
  this.content =
    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore nihil soluta explicabo reprehenderit in quo hic, fugit temporibus aliquid mollitia?";
}
navButtons[1].addEventListener("click", function () {
  postCounter++;
  let x = new Data(postCounter);
  database.set(postCounter, x);
  // console.log(database);
  // for (post of database) {
  //   console.log("Post: " + post.counter);
  // }
  renderPosts(database, notesArea);
  attachListenersToPosts();
});

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
              <button class="editNote">Edit</button>
              <button class="deleteNote">Delete</button>
              </div>
            </div>
            <p class="content">${postData.content}</p>
        </div>
    `;
}
function renderPosts(database, container) {
  container.innerHTML = concatenateHTMLNotes(database);
  console.log(database);
}

function attachListenersToPosts() {
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
