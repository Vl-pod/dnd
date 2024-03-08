/* eslint-disable linebreak-style */
function addform(element) {
  const form = document.createElement('div');
  const textarea = document.createElement('textarea');
  const buttonAdd = document.createElement('button');
  const btnclosed = document.createElement('span');

  form.classList.add('form');
  textarea.classList.add('textarea_task');
  buttonAdd.classList.add('button_add');
  btnclosed.classList.add('span_closed');

  buttonAdd.textContent = 'Add Card';
  btnclosed.textContent = '\u2573';

  element.closest('.column').appendChild(form);
  form.prepend(btnclosed);
  form.prepend(buttonAdd);
  form.prepend(textarea);

  const closedAddForm = () => {
    form.closest('.column').appendChild(element);
    form.remove(form);
  };

  btnclosed.addEventListener('click', closedAddForm);

  buttonAdd.addEventListener('click', () => {
    const newTask = document.createElement('DIV');
    newTask.classList.add('task');

    form.closest('.column').appendChild(newTask);

    const taskText = document.createElement('P');
    taskText.classList.add('task_text');
    taskText.textContent = textarea.value;

    newTask.prepend(taskText);

    closedAddForm();
  });
}

export default addform;
