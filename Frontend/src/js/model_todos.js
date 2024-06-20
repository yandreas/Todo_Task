import { AJAX, sortCategoriesByName } from './utils';
import { sortTodosByOrderNumber } from './utils';

export const state = {
  todos: [],
  categories: [],
};

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

export const postNewTodo = async function (title, description, category_name) {
  try {
    const category = state.categories.find(obj => obj.name === category_name);

    const newTodoID = await AJAX(
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

export const postUpdateTodo = async function (
  title,
  description,
  category_name,
  id
) {
  try {
    const category = state.categories.find(obj => obj.name === category_name);

    const updateTodo = await AJAX(
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

export const postDeleteTodo = async function (id) {
  try {
    const deleteTodo = await AJAX(
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

export const changeOrder = async function (id1, id2) {
  try {
    const deleteTodo = await AJAX(
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

export const toggleCheck = async function (id) {
  try {
    const toggleCheck = await AJAX(
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
