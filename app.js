const addBtn = document.querySelector(".js-add-btn");
const cancelBtn = document.querySelector(".js-cancel-btn");
const clearBtn = document.querySelector(".js-clear-btn");
const checkLists = document.querySelector(".js-checklists");
const checkListForm = document.querySelector(".js-checklist-form");
const checkListInput = document.querySelector(".js-checklist-input");

const PAINT_ADDBTN = 0;
const PAINT_CANCELBTN = 1;
const PAINT_INPUT = 0;
const HIDE_INPUT = 1;

const FIRST_ID = 1;

const CHECKLISTS_LS = "checkListsData";
let checkListsData = [];

function savecheckListsData() {
  localStorage.setItem(CHECKLISTS_LS, JSON.stringify(checkListsData));
}

function changeInput(value) {
  if (value == PAINT_INPUT) {
    checkListInput.style.display = "block";
  } else {
    checkListInput.style.display = "none";
  }
}

function changeAddCancelBtn(value) {
  if (value == PAINT_CANCELBTN) {
    addBtn.style.display = "none";
    cancelBtn.style.display = "inline-block";
  } else {
    addBtn.style.display = "inline-block";
    cancelBtn.style.display = "none";
  }
}

function paintCheckList(value) {
  const li = document.createElement("li");
  const newId = checkListsData.length + 1;
  const checkBtn = document.createElement("button");
  const span = document.createElement("span");
  const delBtn = document.createElement("button");

  li.classList.add("checklist");
  li.id = newId;
  checkBtn.classList.add("check-btn");
  checkBtn.classList.add("square-btn");
  checkBtn.addEventListener("click", handleCheckBtnClick);
  span.classList.add("checklist-txt");
  span.innerText = value;
  delBtn.classList.add("del-btn");
  delBtn.classList.add("square-btn");
  delBtn.addEventListener("click", handleDeleteBtnClick);
  delBtn.innerText = "X";

  li.appendChild(checkBtn);
  li.appendChild(span);
  li.appendChild(delBtn);
  checkLists.appendChild(li);

  const checkListObj = {};
  checkListObj.value = value;
  checkListObj.id = newId;
  checkListObj.lineThrough = false;
  checkListsData.push(checkListObj);
  savecheckListsData();
}

function handleSubmit(event) {
  event.preventDefault();
  changeInput(HIDE_INPUT);
  changeAddCancelBtn(PAINT_ADDBTN);
  const currentValue = checkListInput.value;
  checkListInput.value = "";
  paintCheckList(currentValue);
}

function handleDeleteBtnClick(event) {
  const btn = event.target;
  const li = btn.parentNode;
  let currentId = FIRST_ID;
  checkLists.removeChild(li);
  const newData = checkListsData.filter(function (data) {
    return data.id !== parseInt(li.id);
  });
  newData.forEach(function (data) {
    data.id = currentId;
    ++currentId;
  });
  checkListsData = newData;
  savecheckListsData();
}

function handleCheckBtnClick(event) {
  const btn = event.target;
  const btnValue = btn.innerText;
  const li = btn.parentNode;
  const span = li.children[1];
  const currentId = li.id;

  if (btnValue == "V") {
    btn.innerText = "";
    span.style.textDecoration = "none";
    checkListsData[currentId - 1].lineThrough = false;
  } else {
    btn.innerText = "V";
    span.style.textDecoration = "line-through";
    checkListsData[currentId - 1].lineThrough = true;
  }
  savecheckListsData();
}

function handleClearBtnClick(event) {
  let currentId = FIRST_ID;
  newData = checkListsData.filter(function (data) {
    return data.lineThrough !== true;
  });
  newData.forEach(function (data) {
    data.id = currentId;
    ++currentId;
  });
  checkListsData = newData;
  savecheckListsData();
  window.location.reload();
}

function handleCancelBtnClick(event) {
  changeInput(HIDE_INPUT);
  changeAddCancelBtn(PAINT_ADDBTN);
  checkListInput.value = "";
}

function handleAddBtnClick(event) {
  changeInput(PAINT_INPUT);
  changeAddCancelBtn(PAINT_CANCELBTN);
  checkListForm.addEventListener("submit", handleSubmit);
}

function loadCheckListData() {
  const loadedCheckListData = localStorage.getItem(CHECKLISTS_LS);
  if (loadedCheckListData !== null) {
    const parsedCheckListData = JSON.parse(loadedCheckListData);
    parsedCheckListData.forEach(function (checkList) {
      paintCheckList(checkList.value);
    });
  }
}

function init() {
  loadCheckListData();
  addBtn.addEventListener("click", handleAddBtnClick);
  cancelBtn.addEventListener("click", handleCancelBtnClick);
  clearBtn.addEventListener("click", handleClearBtnClick);
}

init();
