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
const INITIAL_CHECKBTN_COLOR = "rgb(255, 255, 255)";
const MODIFIED_CHECKBTN_COLOR = "rgb(170, 170, 170)";
const INITIAL_LINETHROUGH = false;

const FIRST_ID = 1;

const CHECKLISTS_LS = "checkListsData";
let checkListsData = [];

function savecheckListsData() {
  localStorage.setItem(CHECKLISTS_LS, JSON.stringify(checkListsData));
}

function changeInput(value) {
  if (value == PAINT_INPUT) {
    checkListForm.style.display = "flex";
  } else {
    checkListForm.style.display = "none";
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

function paintCheckList(value, lineThrough) {
  const li = document.createElement("li");
  const newId = checkListsData.length + 1;
  const checkBtn = document.createElement("button");
  const span = document.createElement("span");
  const delBtn = document.createElement("button");

  li.classList.add("checklist");
  li.id = newId;
  checkBtn.classList.add("check-btn");
  checkBtn.addEventListener("click", handleCheckBtnClick);
  span.classList.add("checklist-txt");
  span.innerText = value;
  delBtn.classList.add("del-btn");
  delBtn.addEventListener("click", handleDeleteBtnClick);
  delBtn.innerText = "X";

  if (lineThrough == false) {
    checkBtn.style.backgroundColor = INITIAL_CHECKBTN_COLOR;
  } else {
    checkBtn.style.backgroundColor = MODIFIED_CHECKBTN_COLOR;
    li.style.textDecoration = "line-through";
  }

  li.appendChild(checkBtn);
  li.appendChild(span);
  li.appendChild(delBtn);
  checkLists.appendChild(li);

  const checkListObj = {};
  checkListObj.value = value;
  checkListObj.id = newId;
  checkListObj.lineThrough = lineThrough;
  checkListsData.push(checkListObj);
  savecheckListsData();
}

function handleSubmit(event) {
  event.preventDefault();
  changeInput(HIDE_INPUT);
  changeAddCancelBtn(PAINT_ADDBTN);
  const currentValue = checkListInput.value;
  checkListInput.value = "";
  paintCheckList(currentValue, INITIAL_LINETHROUGH);
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
  const li = btn.parentNode;
  const span = li.children[1];
  const currentId = li.id;

  if (btn.style.backgroundColor == MODIFIED_CHECKBTN_COLOR) {
    btn.style.backgroundColor = INITIAL_CHECKBTN_COLOR;
    span.style.textDecoration = "none";
    checkListsData[currentId - 1].lineThrough = false;
  } else {
    btn.style.backgroundColor = MODIFIED_CHECKBTN_COLOR;
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
      paintCheckList(checkList.value, checkList.lineThrough);
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
