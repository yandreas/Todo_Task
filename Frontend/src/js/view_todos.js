import deleteImg from '../img/delete.svg';
import editImg from '../img/edit.svg';

class todosView {
  //Set view functions to handler when handlers need to be updated after loading the page
  postUpdate;
  postDelete;
  changeOrder;
  toggleCheck;

  constructor() {}

  //Event handler when page loads
  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }

  //Sets eventhandler as parameter needed for content that updates dynamically
  addHandlerToggleCheck(handler) {
    this.toggleCheck = handler;
  }

  addHandlerChangeOrder(handler) {
    this.changeOrder = handler;
  }

  addHandlerUpdateTodo(handler) {
    this.postUpdate = handler;
  }

  addHandlerDeleteTodo(handler) {
    this.postDelete = handler;
  }

  //Handler for button to create a new category option in select categories
  addHandlerCreateCategory(handler) {
    const btnCategory = document.querySelector('.btn-category');
    btnCategory.addEventListener('click', e => {
      const newElement = this.#createCategoryMarkup();
      document.querySelector('body').appendChild(newElement);

      document.querySelector('.btn-confirm').addEventListener('click', e => {
        const name = document.getElementById('newCategory').value.trim();

        if (name != '' && name != 'All') {
          handler(name);

          document
            .querySelector('body')
            .removeChild(document.querySelector('.modal'));
        }
      });

      document.querySelector('.close').addEventListener('click', e => {
        document
          .querySelector('body')
          .removeChild(document.querySelector('.modal'));
      });

      window.onclick = function (e) {
        if (e.target == document.querySelector('.modal')) {
          document
            .querySelector('body')
            .removeChild(document.querySelector('.modal'));
        }
      };
    });
  }

  //Modal window to enter name of new category option that is to be added
  #createCategoryMarkup() {
    const newElement = document.createElement('div');
    newElement.classList.add('modal');
    newElement.innerHTML = `         
      <div class="modal-content">
        <span class="close">&times;</span>
        <label for="newCategory">New category name:</label>
        <input type="text" id="newCategory" name="newCategory">
        <button class="btn-confirm" type="button">Confirm</button>
      </div>
    `;

    return newElement;
  }

  //Handler for button to create a new todo in todolist
  addHandlerCreateTodo(handler) {
    const btnAdd = document.querySelector('.btn-add');
    btnAdd.addEventListener('click', e => {
      const newElement = this.#createTodoMarkup();
      document.querySelector('body').appendChild(newElement);

      document.querySelector('.btn-confirm').addEventListener('click', e => {
        const title = document.getElementById('title').value;
        const description = document.getElementById('description').value;
        const category = document.getElementById('category').value;

        handler(title, description, category);

        document
          .querySelector('body')
          .removeChild(document.querySelector('.modal'));
      });

      document.querySelector('.close').addEventListener('click', e => {
        document
          .querySelector('body')
          .removeChild(document.querySelector('.modal'));
      });

      window.onclick = function (e) {
        if (e.target == document.querySelector('.modal')) {
          document
            .querySelector('body')
            .removeChild(document.querySelector('.modal'));
        }
      };
    });
  }

  //Modal window for entering data to create a new todo
  #createTodoMarkup() {
    const catSelect = document.querySelector('.category-select');

    const categories = [];

    for (let i = 0; i < catSelect.options.length; i++) {
      categories.push(catSelect.options[i].value);
    }

    const selectEl =
      `<select id="category" name="category">` +
      categories
        .slice(1)
        .map(c => `<option value="${c}">${c}</option>`)
        .join('') +
      `</select>`;

    const newElement = document.createElement('div');
    newElement.classList.add('modal');
    newElement.innerHTML = `         
      <div class="modal-content">
        <span class="close">&times;</span>
        <label for="title">Title:</label>
        <input type="text" id="title" name="title"><br><br>
        <label for="description">Description:</label>
        <textarea id="description" name="description"></textarea><br><br>
        <label for="category">Category:</label>
        ${selectEl}
        <button class="btn-confirm" type="button">Confirm</button>
      </div>
    `;

    return newElement;
  }

  //Handler for Edit button to edit an existing todo
  #addHandlerEditBtn() {
    const btnAdd = document.querySelectorAll('.btn-edit');
    btnAdd.forEach(btn => {
      btn.addEventListener('click', e => {
        const newElement = this.#createTodoUpdateMarkup();

        newElement.querySelector('#title').value = e.currentTarget
          .closest('.content')
          .querySelector('.content-title').textContent;

        newElement.querySelector('#description').value = e.currentTarget
          .closest('.content')
          .querySelector('.content-description').textContent;

        const selectElement = newElement.querySelector('#category');

        for (let i = 0; i < selectElement.options.length; i++) {
          if (
            selectElement.options[i].value ===
            e.currentTarget
              .closest('.content')
              .querySelector('.todo-category')
              .textContent.trim()
          ) {
            selectElement.options[i].selected = true;
            break;
          }
        }

        document.querySelector('body').appendChild(newElement);

        const currentTodo = e.currentTarget;
        document.querySelector('.btn-confirm').addEventListener('click', e => {
          const id = currentTodo.closest('.content').dataset.id;
          const title = document.getElementById('title').value;
          const description = document.getElementById('description').value;
          const category = document.getElementById('category').value;

          this.postUpdate(title, description, category, id);

          document
            .querySelector('body')
            .removeChild(document.querySelector('.modal'));
        });

        document.querySelector('.close').addEventListener('click', e => {
          document
            .querySelector('body')
            .removeChild(document.querySelector('.modal'));
        });

        window.onclick = function (e) {
          if (e.target == document.querySelector('.modal')) {
            document
              .querySelector('body')
              .removeChild(document.querySelector('.modal'));
          }
        };

        btn.blur();
      });
    });
  }

  //Modal window for entering data to edit a todo, which holds the old values of the todo as starting values in input fields
  #createTodoUpdateMarkup() {
    const catSelect = document.querySelector('.category-select');

    const categories = [];

    for (let i = 0; i < catSelect.options.length; i++) {
      categories.push(catSelect.options[i].value);
    }

    const selectEl =
      `<select id="category" name="category">` +
      categories
        .slice(1)
        .map(c => `<option value="${c}">${c}</option>`)
        .join('') +
      `</select>`;

    const newElement = document.createElement('div');
    newElement.classList.add('modal');
    newElement.innerHTML = `         
      <div class="modal-content">
        <span class="close">&times;</span>
        <label for="title">Title:</label>
        <input type="text" id="title" name="title"><br><br>
        <label for="description">Description:</label>
        <textarea id="description" name="description"></textarea><br><br>
        <label for="category">Category:</label>
        ${selectEl}
        <button class="btn-confirm" type="button">Confirm</button>
      </div>
    `;

    return newElement;
  }

  //Handler for button to delete a todo from todolist
  #addHandlerDeleteBtn() {
    const btnDelete = document.querySelectorAll('.btn-delete');
    btnDelete.forEach(btn => {
      btn.addEventListener('click', e => {
        const newElement = this.#createTodoDeleteMarkup();

        document.querySelector('body').appendChild(newElement);

        const currentTodo = e.currentTarget;
        document.getElementById('yesBtn').addEventListener('click', e => {
          this.postDelete(currentTodo.closest('.content').dataset.id);

          document
            .querySelector('body')
            .removeChild(document.querySelector('.modal'));
        });

        document.getElementById('noBtn').addEventListener('click', e => {
          document
            .querySelector('body')
            .removeChild(document.querySelector('.modal'));
        });

        document.querySelector('.close').addEventListener('click', e => {
          document
            .querySelector('body')
            .removeChild(document.querySelector('.modal'));
        });

        window.onclick = function (e) {
          if (e.target == document.querySelector('.modal')) {
            document
              .querySelector('body')
              .removeChild(document.querySelector('.modal'));
          }
        };

        btn.blur();
      });
    });
  }

  //Modal window to confirm if you are sure to delete the todo
  #createTodoDeleteMarkup() {
    const newElement = document.createElement('div');
    newElement.classList.add('modal');
    newElement.innerHTML = `         
      <div class="modal-content">
        <span class="close">&times;</span>
         <h2>Are you sure?</h2>
            <div class="modal-buttons">
                <button id="yesBtn">Yes</button>
                <button id="noBtn">No</button>
            </div>
      </div>
    `;
    return newElement;
  }

  renderList(todos, categories) {
    this.#renderCategories(todos, categories);
    this.#renderSelectedTodos(todos, categories);
  }

  //Handler to toggle the checked state of a todo
  #addToggleDescription() {
    document.querySelectorAll('li.content').forEach(function (contentElement) {
      contentElement.addEventListener('click', function (event) {
        if (
          event.target.closest('button') ||
          event.target.closest('input[type="checkbox"]')
        )
          return;

        const descriptionElement = contentElement.querySelector(
          '.content-description'
        );
        if (descriptionElement) {
          descriptionElement.classList.toggle('hidden');
        }
      });
    });
  }

  //Renders the in categories selected todos
  #renderSelectedTodos(todos, categories) {
    const selectedCategory = document.querySelector('.category-select').value;

    if (selectedCategory === 'All') {
      this.#clearTodos();
      todos.forEach(todo => {
        const newElement = this.#generateTodoMarkup(todo, categories);

        newElement.addEventListener('dragstart', function (e) {
          e.dataTransfer.setData('text/plain', e.currentTarget.dataset.id);
        });

        newElement.addEventListener('dragover', function (e) {
          e.preventDefault(); // Necessary to allow drop
        });

        newElement.addEventListener('drop', e => {
          e.preventDefault();
          const dragged = e.dataTransfer.getData('text/plain');
          const tempID = dragged;
          const tempID2 = e.currentTarget.dataset.id;

          if (tempID === tempID2) return;

          this.changeOrder(tempID, tempID2);
        });

        const parentElement = document.querySelector('.list');
        parentElement.appendChild(newElement);
      });
    } else {
      this.#clearTodos();
      todos.forEach(todo => {
        const categoryText = categories.find(
          c => c.id === todo.category_id
        ).name;
        if (categoryText != selectedCategory) return;

        const newElement = this.#generateTodoMarkup(todo, categories);

        newElement.addEventListener('dragstart', function (e) {
          e.dataTransfer.setData('text/plain', e.currentTarget.dataset.id);
        });

        newElement.addEventListener('dragover', function (e) {
          e.preventDefault(); // Necessary to allow drop
        });

        newElement.addEventListener('drop', e => {
          e.preventDefault();
          const dragged = e.dataTransfer.getData('text/plain');
          const tempID = dragged;
          const tempID2 = e.currentTarget.dataset.id;

          this.changeOrder(tempID, tempID2);
        });

        const parentElement = document.querySelector('.list');
        parentElement.appendChild(newElement);
      });
    }
    this.#addToggleDescription();
    this.#addHandlerEditBtn();
    this.#addHandlerDeleteBtn();
  }

  //clears old todo html
  #clearTodos() {
    document.querySelector('.list').innerHTML = '';
  }

  //renders category select element
  #renderCategories(todos, categories) {
    const newElement = this.#generateCategoriesMarkup(categories);

    const parentElement = document.querySelector('.categoryBox');

    // Clear old categories
    const oldCategorySelect = parentElement.querySelector('.category-select');
    let oldSelected = '';
    if (oldCategorySelect) {
      oldSelected = oldCategorySelect.value;

      for (let i = 0; i < newElement.options.length; i++) {
        if (newElement.options[i].value === oldSelected.trim()) {
          newElement.options[i].selected = true;
          break;
        }
      }
      parentElement.removeChild(oldCategorySelect);
    }

    parentElement.prepend(newElement);

    const categorySelector = document.querySelector('.category-select');
    categorySelector.addEventListener('change', e => {
      this.#renderSelectedTodos(todos, categories);
    });
  }

  //Generates html markup of category select
  #generateCategoriesMarkup(categories) {
    const newElement = document.createElement('select');
    newElement.classList.add('category-select');
    newElement.name = 'category-select';
    newElement.innerHTML =
      `<option value="All">All</option>` +
      categories
        .map(c => `<option value="${c.name}">${c.name}</option>`)
        .join('');

    return newElement;
  }

  //Generates the html markup of a new todo entry
  #generateTodoMarkup(
    { id, title, description, category_id, isChecked },
    categories
  ) {
    const categoryText = categories.find(c => c.id === category_id).name;

    const newElement = document.createElement('li');
    newElement.classList.add('content');
    newElement.dataset.id = id;
    newElement.draggable = true;

    newElement.innerHTML = `
              <div class="todo-category">
              ${categoryText}
               </div>
              <div class="content-box">
                <input class="checkbox" type="checkbox" name="checkbox"></input>
              <div class="content-title"><p>${title}</p></div>
              <div class="icon-box">
              <button class="btn-edit" type="button">
                <img src=${editImg} alt="edit icon">
              </button>
              <button class="btn-delete" type="button"> <img src=${deleteImg} alt="delete icon"></button>
            </div>
            </div>
              <div class="content-description hidden"><p>${description}</p></div>`;

    const checkboxEl = newElement.querySelector('.checkbox');

    if (isChecked) {
      checkboxEl.checked = true;
      newElement.classList.add('checked');
    }

    checkboxEl.addEventListener('change', e => {
      this.toggleCheck(id);
      newElement.classList.toggle('checked');
    });

    return newElement;
  }
}

//Creates an instance of the view used by controller
export default new todosView();
