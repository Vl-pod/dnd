/* eslint-disable no-tabs */
import Template from './template';
import Storage from './storge';
import addform from './addForm';

const render = new Template();
const storage = new Storage();
const loadData = storage.load();
const dataTrello = {};
let initialCursorX = 0;
let initialCursorY = 0;

if (loadData === null || loadData.toDo === undefined) {
  render.actionDefault();
} else {
  render.actionStorage(loadData);
}

function isSaveLokal() {
  const columnTodo = Array.from(document.querySelector('.todo').querySelectorAll('.task_text'));
  const columnInProgress = Array.from(document.querySelector('.in_progress').querySelectorAll('.task_text'));
  const columnDone = Array.from(document.querySelector('.done').querySelectorAll('.task_text'));
  dataTrello.toDo = [];
  dataTrello.inProgress = [];
  dataTrello.done = [];
  columnTodo.forEach((item) => {
    dataTrello.toDo.push(item.textContent);
  });
  columnInProgress.forEach((item) => {
    dataTrello.inProgress.push(item.textContent);
  });
  columnDone.forEach((item) => {
    dataTrello.done.push(item.textContent);
  });

  storage.save(dataTrello);
}

function createClosedElement() {
  const div = document.createElement('div');
  div.classList.add('closed_element');
  div.textContent = '\u2573';
  isSaveLokal();
  return div;
}

function createShadowElement(element) {
  const div = document.createElement('div');
  const { width, height } = element.getBoundingClientRect();

  div.classList.add('shadow_element');

  div.style.width = `${width}px`;
  div.style.height = `${height}px`;
  isSaveLokal();
  return div;
}

let actualElement;

const onMouseMove = (evt) => {
  const { target } = evt;
  const { pageX, pageY } = evt;
  actualElement.style.top = `${pageY - initialCursorY}px`;
  actualElement.style.left = `${pageX - initialCursorX}px`;

  if (target.classList.contains('task') || target.classList.contains('title')) {
    const { y, height } = target.getBoundingClientRect();

    const shadowElement = createShadowElement(document.querySelector('.dragged'));
    let shadowZone;

    if ((y + height / 2) > evt.clientY && !target.classList.contains('title')) {
      if (document.querySelector('.shadow_element')) {
        document.querySelector('.shadow_element').remove();
      }
      shadowZone = evt.target.previousElementSibling.closest('.task') || evt.target.previousElementSibling.closest('h1');
      if (shadowZone) {
        shadowZone.insertAdjacentElement('afterend', shadowElement);
      }
    }
    if ((y + height / 2) < evt.clientY) {
      if (document.querySelector('.shadow_element')) {
        document.querySelector('.shadow_element').remove();
      }
      shadowZone = evt.target.nextElementSibling.closest('.task') || evt.target.nextElementSibling.closest('.add_card');
      if (shadowZone) {
        shadowZone.insertAdjacentElement('beforebegin', shadowElement);
      }
    }
  }
};

const onTouchMove = (evt) => {
  const touch = evt.targetTouches[0];
  const { target } = evt;

  actualElement.style.top = `${evt.clientY - initialCursorY}px`;
  actualElement.style.left = `${evt.clientX - initialCursorX}px`;

  if ((touch.pageX + 20) < target.closest('.column').offsetLeft) {
    target.closest('.task').remove();
  }
};

const addNewTask = document.querySelectorAll('.add_card');

addNewTask.forEach((item) => {
  item.addEventListener('click', (e) => {
    e.preventDefault();
    addform(item);
    item.remove(item);
    isSaveLokal();
  });
});

const taskInFokus = (e) => {
  const activeTask = e.target.closest('.task');
  if (activeTask) {
    const columnInFokus = activeTask.closest('.column');
    const closed = createClosedElement();

    const { width } = activeTask.getBoundingClientRect();

    closed.style.top = `${activeTask.offsetTop + 2}px`;
    closed.style.left = `${width + activeTask.offsetLeft - 17}px`;

    if (!columnInFokus.querySelector('.closed_element')) {
      closed.addEventListener('click', () => {
        activeTask.remove();
        closed.remove();
        isSaveLokal();
      });

      columnInFokus.insertAdjacentElement('afterbegin', closed);
    }
  }

  if (document.querySelector('.closed_element') && !activeTask && e.target !== document.querySelector('.closed_element')) {
    document.querySelector('.closed_element').remove();
  }
};

const onMouseUp = (e) => {
  const mouseUpColomn = e.target.closest('.column');

  if (e.target.classList.contains('shadow_element')) {
    const shadowZone = mouseUpColomn.querySelector('.shadow_element');
    mouseUpColomn.insertBefore(actualElement, shadowZone);
  }

  actualElement.style.width = null;
  actualElement.style.height = null;
  actualElement.style.top = null;
  actualElement.style.left = null;
  actualElement.classList.remove('dragged');
  actualElement = undefined;
  storage.save(dataTrello);

  isSaveLokal();
  if (document.querySelector('.shadow_element')) {
    document.querySelector('.shadow_element').remove();
  }
  document.documentElement.removeEventListener('mousemove', onMouseMove);
  document.documentElement.removeEventListener('mouseup', onMouseUp);

  document.documentElement.removeEventListener('touchmove', onTouchMove);
  document.documentElement.removeEventListener('touchend', onMouseUp);
  document.addEventListener('mousemove', taskInFokus);
  document.addEventListener('touchmove', taskInFokus);
  document.documentElement.style.cursor = 'auto';
};

document.addEventListener('mousemove', taskInFokus);
document.addEventListener('touchmove', taskInFokus);

const columns = Array.from(document.querySelectorAll('.column'));

columns.forEach((item) => item.addEventListener('mousedown', (e) => {
  const { target } = e;
  if (target.closest('.task')) {
    e.preventDefault();

    actualElement = target.closest('.task');
    const { width, height } = actualElement.getBoundingClientRect();
    actualElement.classList.add('dragged');
    document.documentElement.style.cursor = 'grabbing';

    document.removeEventListener('mousemove', taskInFokus);

    if (document.querySelector('.closed_element')) {
      document.querySelector('.closed_element').remove();
    }
    initialCursorX = e.offsetX;
    initialCursorY = e.offsetY;

    actualElement.style = `
		 		left: ${e.pageX - initialCursorX}px;
		 		top: ${e.pageY - initialCursorY}px;
                width: ${width}px;
                height: ${height}px;
			`;
    // actualElement.style.width = `${width}px`;
    // actualElement.style.height = `${height}px`;

    document.documentElement.addEventListener('mousemove', onMouseMove);
    document.documentElement.addEventListener('mouseup', onMouseUp);
  }
}));

columns.forEach((item) => item.addEventListener('touchstart', (e) => {
  if (e.target.closest('.task')) {
    e.preventDefault();

    actualElement = e.target.closest('.task');
    const { width, height } = actualElement.getBoundingClientRect();
    actualElement.classList.add('dragged');

    document.removeEventListener('touchmove', taskInFokus);

    if (document.querySelector('.closed_element')) {
      document.querySelector('.closed_element').remove();
    }
    actualElement.style.width = `${width}px`;
    actualElement.style.height = `${height}px`;

    document.documentElement.addEventListener('touchmove', onTouchMove);
    document.documentElement.addEventListener('touchend', onMouseUp);
  }
}));
