'use strict';

let dragElement = '';

function dragStart(e) {
  // this.style.opacity = '0.5';
  dragElement = this;
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/html', this.innerHTML);
}

function dragEnd(e) {
  // this.style.opacity = '1';
  // elipseArray.forEach(function (item) {
  //   item.firstElementChild.classList.remove('over');
  // });
}

function dragOver(e) {
  if (e.preventDefault) {
    e.preventDefault();
  }

  e.dataTransfer.dropEffect = 'move';

  return false;
}

/* The dragenter event handler is used to toggle the over class instead of dragover. If you use dragover, the CSS class would be toggled many times as the event dragover continued to fire. Ultimately, that would cause the browser's renderer to do a large amount of unnecessary work. */
function dragEnter(e) {
  // this.firstElementChild.classList.add('over');
}

function dragLeave(e) {
  // this.firstElementChild.classList.remove('over');
}

function dropEvent(e) {
  if (e.stopPropagation) {
    e.stopPropagation(); // stops the browser from redirecting.
  }

  if (dragElement !== this) {
    dragElement.innerHTML = this.innerHTML;
    this.innerHTML = e.dataTransfer.getData('text/html');
  }

  return false;
}

// elipseArray.forEach((current) => {
//   const element = current;
//   element.firstElementChild.classList.remove('over');
// });

// What does the false do here
elipseArray.forEach((current) => {
  const element = current;
  element.addEventListener('dragstart', dragStart, false);
  element.addEventListener('dragend', dragEnd, false);
  element.addEventListener('dragenter', dragEnter, false);
  element.addEventListener('dragover', dragOver, false);
  element.addEventListener('dragleave', dragLeave, false);
  element.addEventListener('drop', dropEvent, false);
  element.addEventListener('dragend', dragEnd, false);
});
