import * as model from './model_todos.js';
import todosView from './view_todos.js';

const controlTodo = async function () {
  try {
    await model.loadTodos();
    todosView.renderList(model.state.todos, model.state.categories);
  } catch (err) {
    console.error(err);
  }
};

const controlAddCategory = async function (name) {
  try {
    await model.postNewCategory(name);
    todosView.renderList(model.state.todos, model.state.categories);
  } catch (err) {
    console.error(err);
  }
};

const controlAddTodo = async function (title, description, category) {
  try {
    await model.postNewTodo(title, description, category);
    todosView.renderList(model.state.todos, model.state.categories);
  } catch (err) {
    console.error(err);
  }
};

const controlUpdateTodo = async function (title, description, category, id) {
  try {
    await model.postUpdateTodo(title, description, category, id);
    todosView.renderList(model.state.todos, model.state.categories);
  } catch (err) {
    console.error(err);
  }
};

const controlDeleteTodo = async function (id) {
  try {
    await model.postDeleteTodo(id);
    todosView.renderList(model.state.todos, model.state.categories);
  } catch (err) {
    console.error(err);
  }
};

const controlChangeOrder = async function (id1, id2) {
  try {
    await model.changeOrder(id1, id2);
    todosView.renderList(model.state.todos, model.state.categories);
  } catch (err) {
    console.error(err);
  }
};

const controlToggleCheck = async function (id) {
  try {
    await model.toggleCheck(id);
    todosView.renderList(model.state.todos, model.state.categories);
  } catch (err) {
    console.error(err);
  }
};

const init = function () {
  todosView.addHandlerRender(controlTodo);
  todosView.addHandlerCreateCategory(controlAddCategory);
  todosView.addHandlerCreateTodo(controlAddTodo);
  todosView.addHandlerUpdateTodo(controlUpdateTodo);
  todosView.addHandlerDeleteTodo(controlDeleteTodo);
  todosView.addHandlerChangeOrder(controlChangeOrder);
  todosView.addHandlerToggleCheck(controlToggleCheck);
};
init();
