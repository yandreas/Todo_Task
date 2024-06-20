import { AJAX } from './utils';

document
  .getElementById('createUserForm')
  .addEventListener('submit', function (event) {
    event.preventDefault();
    createUser();
  });

document
  .getElementById('authenticateUserForm')
  .addEventListener('submit', function (event) {
    event.preventDefault();
    authUser();
  });

const createUser = async function () {
  try {
    const username = document.getElementById('createUsername').value;
    const password = document.getElementById('createPassword').value;

    const data = AJAX(
      'http://localhost:8080/create-user',
      'application/x-www-form-urlencoded',
      {
        username: username,
        password: password,
      }
    );

    console.log(await data);
  } catch (err) {
    throw err;
  }
};

const authUser = async function () {
  try {
    const username = document.getElementById('authUsername').value;
    const password = document.getElementById('authPassword').value;

    const data = AJAX(
      'http://localhost:8080/authenticate-user',
      'application/x-www-form-urlencoded',
      {
        username: username,
        password: password,
      }
    );
    redirectToTodosPage(await data);
  } catch (err) {
    throw err;
  }
};

function redirectToTodosPage(session) {
  // Hier wird automatisch auf todos.html weitergeleitet
  if (session.message === 'Login user successfully')
    window.location.href = './todos.html';
}
