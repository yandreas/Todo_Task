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

export const sortTodosByOrderNumber = function (todos) {
  return todos.sort((a, b) => a.order_number - b.order_number);
};

export const sortCategoriesByName = function (categories) {
  return categories.sort((a, b) => a.name.localeCompare(b.name));
};
