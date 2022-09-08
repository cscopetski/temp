const getList = function () {
  fetch("/get-food", {
    method: "GET",
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      reloadList(data);
    });

  return false;
};

const submit = function (e) {
  e.preventDefault();

  const foodname = document.querySelector("#foodname").value;
  const foodtype = document.querySelector(
      'input[name="foodtype"]:checked'
    ).value,
    foodweight = document.querySelector("#foodweight").value,
    foodprice = document.querySelector("#foodprice").value,
    json = {
      foodname: foodname,
      foodtype: foodtype,
      foodweight: parseFloat(foodweight),
      foodprice: parseFloat(foodprice),
    },
    body = JSON.stringify(json);

  fetch("/submit", {
    method: "POST",
    body,
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      reloadList(data);
    });

  return false;
};

const deleteFood = function (e) {
  e.preventDefault();
  const checkboxes = document.querySelectorAll(
    'input[name="delete-select"]:checked'
  );
  const deleteids = [];
  checkboxes.forEach((element) => {
    deleteids.push(element.value);
  });

  const body = JSON.stringify(deleteids);

  fetch("/delete", {
    method: "POST",
    body,
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      reloadList(data);
    });

  return false;
};

window.onload = function () {
  getList();
  const submitbutton = document.querySelector("#submit-button");
  submitbutton.onclick = submit;
  const deletebutton = document.querySelector("#delete-button");
  deletebutton.onclick = deleteFood;
};

const removeAllChildNodes = (parent) => {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
};

const reloadList = (data) => {
  const table = document.querySelector("#foodtable");
  const template = document.querySelector("#foodrow");
  const headersTemp = document.querySelector("#table-header");
  const headers = headersTemp.content.cloneNode(true);

  removeAllChildNodes(table);

  table.append(headers);

  data.forEach((element) => {
    const row = template.content.cloneNode(true);
    let tr = row.querySelector("tr");
    tr.id = "food-" + element.id;
    let td = row.querySelectorAll("td");
    td[0].textContent = element.foodname;
    td[1].textContent = element.foodtype;
    td[2].textContent = element.foodweight;
    td[3].textContent = element.foodprice;
    td[4].textContent = element.priceperpound;
    td[5].querySelector('input[name="delete-select"]').value = element.id;
    table.append(row);
  });
};
