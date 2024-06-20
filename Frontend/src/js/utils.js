/**
 * Ajax call template with GET request if uploadData is not entered as parameter, else POST request
 *
 * @param {string} url - request url
 * @param {string} contentType - content type of request
 * @param {json} uploadData - request body data
 * @return {Promise} data - requested data
 */
export const AJAX = async function (
  url,
  contentType = undefined,
  uploadData = undefined
) {
  try {
    const fetchPro = uploadData
      ? fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': contentType,
          },
          body: JSON.stringify(uploadData),
          credentials: 'include',
        })
      : fetch(url, {
          method: 'GET',
          credentials: 'include',
        });

    const res = await fetchPro;
    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data;
  } catch (err) {
    throw err;
  }
};

/**
 * Sorts an array of todos by their order_number from smallest to biggest
 *
 * @param {Array} todos - Array of todo objects
 * @return {Array}           - Array sorted oder_number
 */
export const sortTodosByOrderNumber = function (todos) {
  return todos.sort((a, b) => a.order_number - b.order_number);
};

/**
 * Sorts an array of categories by their name alphabetically
 *
 * @param {Array} categories - Array of category objects
 * @return {Array}           - Array sorted by alphabet
 */
export const sortCategoriesByName = function (categories) {
  return categories.sort((a, b) => a.name.localeCompare(b.name));
};
