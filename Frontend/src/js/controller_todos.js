import * as model from './model_todos.js';
import todosView from './view_todos.js';

//Calls loadTodos, when loading the page, to set state data of categories and todos then renders it in view
const controlTodo = async function () {
  try {
    await model.loadTodos();
    todosView.renderList(model.state.todos, model.state.categories);
  } catch (err) {
    console.error(err);
  }
};

//Calls controlAddCategory, when trying to add a new category, to set state data of categories and todos then renders it in view
const controlAddCategory = async function (name) {
  try {
    await model.postNewCategory(name);
    todosView.renderList(model.state.todos, model.state.categories);
  } catch (err) {
    console.error(err);
  }
};

//Calls controlAddTodo, when trying to add a new todo, to set state data of categories and todos then renders it in view
const controlAddTodo = async function (title, description, category) {
  try {
    await model.postNewTodo(title, description, category);
    todosView.renderList(model.state.todos, model.state.categories);
  } catch (err) {
    console.error(err);
  }
};

//Calls controlUpdateTodo, when trying to update a todo, to set state data of categories and todos then renders it in view
const controlUpdateTodo = async function (title, description, category, id) {
  try {
    await model.postUpdateTodo(title, description, category, id);
    todosView.renderList(model.state.todos, model.state.categories);
  } catch (err) {
    console.error(err);
  }
};

//Calls controlDeleteTodo, when trying to delete a todo, to set state data of categories and todos then renders it in view
const controlDeleteTodo = async function (id) {
  try {
    await model.postDeleteTodo(id);
    todosView.renderList(model.state.todos, model.state.categories);
  } catch (err) {
    console.error(err);
  }
};

//Calls controlChangeOrder, when trying to switch the position of two todos, to set state data of categories and todos then renders it in view
const controlChangeOrder = async function (id1, id2) {
  try {
    await model.changeOrder(id1, id2);
    todosView.renderList(model.state.todos, model.state.categories);
  } catch (err) {
    console.error(err);
  }
};

//Calls controlToggleCheck, when checking a todo, to set state data of categories and todos then renders it in view
const controlToggleCheck = async function (id) {
  try {
    await model.toggleCheck(id);
    todosView.renderList(model.state.todos, model.state.categories);
  } catch (err) {
    console.error(err);
  }
};

//Initializes view handler with their control functions(which data to be retrieved)
const init = function () {
  todosView.addHandlerRender(controlTodo);
  todosView.addHandlerCreateCategory(controlAddCategory);
  todosView.addHandlerCreateTodo(controlAddTodo);
  todosView.addHandlerUpdateTodo(controlUpdateTodo);
  todosView.addHandlerDeleteTodo(controlDeleteTodo);
  todosView.addHandlerChangeOrder(controlChangeOrder);
  todosView.addHandlerToggleCheck(controlToggleCheck);
};

//Called at the very start of loading the page
init();
