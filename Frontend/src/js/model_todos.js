import { AJAX, sortCategoriesByName } from './utils';
import { sortTodosByOrderNumber } from './utils';

//state saves retrieved data of todos and categories of a user
export const state = {
  todos: [],
  categories: [],
};

//Called at start of loading the page and renders todos and categories on page
export const loadTodos = async function () {
  try {
    const todos = await AJAX(`http://localhost:8080/todos`);
    if (todos) {
      state.todos = sortTodosByOrderNumber(todos);
    }

    const categories = await AJAX(`http://localhost:8080/categories`);
    state.categories = categories;
  } catch (err) {
    throw err;
  }
};

/**
 * Creates a new category entry if successful in database for the user and pushes the category to state.categories
 *
 * @param {string} name - name of new category
 */
export const postNewCategory = async function (name) {
  try {
    const newCategoryID = await AJAX(
      `http://localhost:8080/create-category`,
      'application/json',
      {
        name: name,
      }
    );
    state.categories.push({ id: newCategoryID.category_id, name: name });
    state.categories = sortCategoriesByName(state.categories);
  } catch (err) {
    throw err;
  }
};

/**
 * Create a new todo entry if successful in database for the user then reloads the todos
 *
 * @param {string} title
 * @param {string} description
 * @param {string} category_name
 */
export const postNewTodo = async function (title, description, category_name) {
  try {
    //Find id of category comparing name to categories elements
    const category = state.categories.find(obj => obj.name === category_name);

    const _ = await AJAX(
      `http://localhost:8080/create-todo`,
      'application/json',
      {
        title: title,
        description: description,
        category_id: category.id,
      }
    );

    const todos = await AJAX(`http://localhost:8080/todos`);
    if (todos) {
      state.todos = sortTodosByOrderNumber(todos);
    }
  } catch (err) {
    throw err;
  }
};

/**
 * Updates a todo entry if successful in database for the user then reloads the todos
 *
 * @param {string} title
 * @param {string} description
 * @param {string} category_name
 * @param {string} id                - id of the todo thats updated converted to int
 */
export const postUpdateTodo = async function (
  title,
  description,
  category_name,
  id
) {
  try {
    //Find id of category comparing name to categories elements
    const category = state.categories.find(obj => obj.name === category_name);

    const _ = await AJAX(
      `http://localhost:8080/update-todo`,
      'application/json',
      {
        todo_id: Number(id),
        title: title,
        description: description,
        category_id: category.id,
      }
    );

    const todos = await AJAX(`http://localhost:8080/todos`);
    if (todos) {
      state.todos = sortTodosByOrderNumber(todos);
    }
  } catch (err) {
    throw err;
  }
};

/**
 * Deletes a todo entry if successful in database for the user then reloads the todos
 *
 * @param {string} id - id of the to be deleted todo converted to int
 */
export const postDeleteTodo = async function (id) {
  try {
    const _ = await AJAX(
      `http://localhost:8080/delete-todo`,
      'application/json',
      {
        todo_id: Number(id),
      }
    );

    const todos = await AJAX(`http://localhost:8080/todos`);
    if (todos) {
      state.todos = sortTodosByOrderNumber(todos);
    }
  } catch (err) {
    throw err;
  }
};

/**
 * Changes the order_number of two todos in database if successful
 *
 * @param {string} id1 - id of first todo converted to int
 * @param {string} id2 - id of second todo converted to int
 */
export const changeOrder = async function (id1, id2) {
  try {
    const _ = await AJAX(
      `http://localhost:8080/switch-order`,
      'application/json',
      {
        todo_id_1: Number(id1),
        todo_id_2: Number(id2),
      }
    );

    const todos = await AJAX(`http://localhost:8080/todos`);
    if (todos) {
      state.todos = sortTodosByOrderNumber(todos);
    }
  } catch (err) {
    throw err;
  }
};

/**
 * Toggles the boolean isChecked of a todo in database which indicates whether a todo is checked or not
 *
 * @param {string} id - id of todo converted to int
 */
export const toggleCheck = async function (id) {
  try {
    const _ = await AJAX(
      `http://localhost:8080/toggle-todo-checked`,
      'application/json',
      {
        todo_id: Number(id),
      }
    );

    const todos = await AJAX(`http://localhost:8080/todos`);
    if (todos) {
      state.todos = sortTodosByOrderNumber(todos);
    }
  } catch (err) {
    throw err;
  }
};
