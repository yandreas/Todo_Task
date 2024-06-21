import { AJAX } from './utils';

//Event Listener for register and login button
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

//Post request to create a new user
const createUser = async function () {
  try {
    const username = document.getElementById('createUsername').value;
    const password = document.getElementById('createPassword').value;

    const data = AJAX(
      'https://todotask-production.up.railway.app/create-user',
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

/**
 * Post request to authenticate user
 * Redirectes to todos.html when successfully authorized username and password
 */
const authUser = async function () {
  try {
    const username = document.getElementById('authUsername').value;
    const password = document.getElementById('authPassword').value;

    const data = AJAX(
      'https://todotask-production.up.railway.app/authenticate-user',
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

//redirectes to todos.html after pressing confirm button with successful entry
function redirectToTodosPage(session) {
  if (session.message === 'Login user successfully')
    window.location.href = './todos.html';
}
