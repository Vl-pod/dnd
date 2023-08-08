/* eslint-disable linebreak-style */
/* eslint-disable class-methods-use-this */

export default class Template {
  constructor() {
    this.columnTodo = document.querySelector('.todo');
    this.columnInProgress = document.querySelector('.in_progress');
    this.columnDone = document.querySelector('.done');
  }

  static renderTask(column, text) {
    const containerTask = document.createElement('DIV');
    const textTask = document.createElement('P');

    containerTask.classList.add('task');
    textTask.classList.add('task_text');

    textTask.textContent = text;

    column.querySelector('.add_card').parentNode.insertBefore(containerTask, column.querySelector('.add_card'));
    containerTask.prepend(textTask);
  }

  defaultContent() {
    return [];
  }

  actionDefault() {
    const emptyContent = this.defaultContent();
    emptyContent.forEach((element) => {
      Template.renderTask(this.columnTodo, element);
    });
  }

  actionStorage(data) {
    const emptyContent = this.defaultContent();
    emptyContent.forEach((element) => {
      Template.renderTask(this.columnTodo, element);
    });
    data.toDo.forEach((element) => {
      Template.renderTask(this.columnTodo, element);
    });
    data.inProgress.forEach((element) => {
      Template.renderTask(this.columnInProgress, element);
    });
    data.done.forEach((element) => {
      Template.renderTask(this.columnDone, element);
    });
  }
}
