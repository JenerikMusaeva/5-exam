const URL = "http://localhost:1717/pastry/";

const getSweets = async () => {
  let res = await fetch(URL);
  return await res.json();
};

const postSweet = async (sweet) => {
  let config = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(sweet),
  };
  let res = await fetch(URL + "create/", config);
};

const updateSweet = async (id, sweet) => {
  let config = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify(sweet),
  };
  let res = fetch(URL + "update/" + id, config);
};

const deleteSweet = async (id) => {
  let config = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  };
  let res = fetch(URL + "delete/" + id, config);
};

export { getSweets, updateSweet, deleteSweet, postSweet };
