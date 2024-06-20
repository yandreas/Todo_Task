import deleteImg from '../img/delete.svg';
import editImg from '../img/edit.svg';

class todosView {
  postUpdate;
  postDelete;
  changeOrder;
  toggleCheck;

  constructor() {}

  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }

  addHandlerToggleCheck(handler) {
    this.toggleCheck = handler;
  }

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

  addHandlerUpdateTodo(handler) {
    this.postUpdate = handler;
  }

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
            // Set the 'selected' attribute of the found <option> to true
            selectElement.options[i].selected = true;
            break; // Exit the loop since we found our option
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

  addHandlerDeleteTodo(handler) {
    this.postDelete = handler;
  }

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

  addHandlerChangeOrder(handler) {
    this.changeOrder = handler;
  }

  renderList(todos, categories) {
    this.#renderCategories(todos, categories);
    this.#renderSelectedTodos(todos, categories);
  }

  #addToggleDescription() {
    document.querySelectorAll('li.content').forEach(function (contentElement) {
      contentElement.addEventListener('click', function (event) {
        // Prüfe, ob das geklickte Element ein Button oder eine Checkbox ist
        if (
          event.target.closest('button') ||
          event.target.closest('input[type="checkbox"]')
        )
          return;

        // Finde das nächste Kindelement mit der Klasse 'content-description'
        const descriptionElement = contentElement.querySelector(
          '.content-description'
        );
        if (descriptionElement) {
          // Toggle die Klasse 'hidden'
          descriptionElement.classList.toggle('hidden');
        }
      });
    });
  }

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

        // Parent-Element finden
        const parentElement = document.querySelector('.list');

        // Neues Element als letztes Kind-Element hinzufügen
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

        // Parent-Element finden
        const parentElement = document.querySelector('.list');

        // Neues Element als letztes Kind-Element hinzufügen
        parentElement.appendChild(newElement);
      });
    }
    this.#addToggleDescription();
    this.#addHandlerEditBtn();
    this.#addHandlerDeleteBtn();
  }

  #clearTodos() {
    document.querySelector('.list').innerHTML = '';
  }

  #renderCategories(todos, categories) {
    const newElement = this.#generateCategoriesMarkup(categories);

    // Parent-Element finden
    const parentElement = document.querySelector('.categoryBox');

    // Clear old categories
    const oldCategorySelect = parentElement.querySelector('.category-select');
    let oldSelected = '';
    if (oldCategorySelect) {
      oldSelected = oldCategorySelect.value;

      for (let i = 0; i < newElement.options.length; i++) {
        if (newElement.options[i].value === oldSelected.trim()) {
          // Set the 'selected' attribute of the found <option> to true
          newElement.options[i].selected = true;
          break; // Exit the loop since we found our option
        }
      }
      parentElement.removeChild(oldCategorySelect);
    }

    // Neues Element als letztes Kind-Element hinzufügen
    parentElement.prepend(newElement);

    const categorySelector = document.querySelector('.category-select');
    categorySelector.addEventListener('change', e => {
      this.#renderSelectedTodos(todos, categories);
    });
  }

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

export default new todosView();
