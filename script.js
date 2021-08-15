/* ===============================================================
 * Companion Studio Coding Challenge
 * Author:  Cemal Okten
 * Github: https://github.com/cemalokten/fac-application-website
 * Language: JS
================================================================== */

'use strict';

// Variable Declarations

const boxInner = [...document.getElementsByClassName('flex--box--inner')];
const colorText = [...document.getElementsByClassName('flex--elipse--text')];

const main = document.querySelector('main');
const footer = document.querySelector('footer');
const infoContainer = document.querySelector('.info--container');

const save = document.getElementById('save');
const reload = document.getElementById('reload');
const info = document.getElementById('info');

// Random Colour Generator

// Returns a random positive whole number between two values (min, max)
// Used throughout to select random array elements
function randomNumber(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

// Returns Object with three random values from 0 - 255
function randomColour() {
  const r = randomNumber(0, 255);
  const g = randomNumber(0, 255);
  const b = randomNumber(0, 255);
  return {
    r,
    g,
    b,
  };
}

/* Takes random values assigned by randomColour() and converts them to base16 / HEX */
function rgbToHex(obj) {
  const rgbObj = obj;
  let r = rgbObj.r.toString(16);
  let g = rgbObj.g.toString(16);
  let b = rgbObj.b.toString(16);
  r = r.length === 1 ? '0' + r : r;
  g = g.length === 1 ? '0' + g : g;
  b = b.length === 1 ? '0' + b : b;
  return `#${r}${g}${b}`.toUpperCase();
}

function textColor(r, g, b) {
  return r * 0.299 + g * 0.587 + b * 0.114 > 186 ? '#000000' : '#FFFFFF';
}

// Set Colours

// childNode[4].parentNode.insertBefore(childNode[4], childNode[3]);

function moveUp(current) {
  let parent = current.parentNode;
  let prev = current.previousElementSibling;
  let oldChild = parent.removeChild(current);
  parent.insertBefore(oldChild, prev);
  console.log(current);
  console.log(parent);
}

const currentColors = [];

function randomColourSpan(current) {
  const element = current;
  const rgbObj = randomColour();
  const r = rgbObj.r;
  const g = rgbObj.g;
  const b = rgbObj.b;
  let span = element.querySelector('span');
  element.style.color = textColor(r, g, b);
  element.style.backgroundColor = `rgb(${r},${g},${b})`;
  // element.style.background = `radial-gradient(circle, rgb(${r},${g},${b}) 0%, rgba(255, 255, 255, 0) 200%)`;
  span.textContent = rgbToHex(rgbObj);
}

function populateRandomColours() {
  boxInner.forEach((current) => {
    const element = current;
    const rgbObj = randomColour();
    const r = rgbObj.r;
    const g = rgbObj.g;
    const b = rgbObj.b;
    let span = element.querySelector('span');
    currentColors.push({ r, g, b });
    element.style.color = textColor(r, g, b);
    element.style.backgroundColor = `rgb(${r},${g},${b})`;
    // element.style.background = `radial-gradient(circle, rgb(${r},${g},${b}) 0%, rgba(255, 255, 255, 0) 80%)`;
    span.textContent = rgbToHex(rgbObj);
    localStorage.setItem('colors', JSON.stringify(currentColors));
  });
}

const stor = JSON.parse(localStorage.getItem('colors'));
console.log(stor);

function applyLocalStorage(obj) {
  let i = 0;
  boxInner.forEach((element) => {
    const r = obj[i].r;
    const g = obj[i].g;
    const b = obj[i].b;
    let span = element.querySelector('span');
    element.style.color = textColor(r, g, b);
    // element.style.background = `radial-gradient(circle, rgb(${r},${g},${b}) 0%, rgba(255, 255, 255, 0) 200%)`;

    element.style.backgroundColor = `rgb(${r},${g},${b})`;
    span.textContent = rgbToHex(obj[i]);
    i++;
  });
}

if (stor !== null) {
  applyLocalStorage(stor);
  console.log('OLD COLOURS!');
} else {
  populateRandomColours();
  console.log('NEW');
}

colorText.forEach((current) => {
  const element = current;
  current.addEventListener('click', () => {
    console.log('run');
    let textArea = document.createElement('textarea');
    textArea.value = element.textContent;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('Copy');
    textArea.remove();
    element.textContent = 'COPIED';
    setTimeout(() => {
      element.textContent = textArea.value;
      element.style.cursor = 'pointer';
    }, 800);
  });
});

// ================

// Swipe Up / Down / Left / Right
let initialValueX = null; // Before move
let initialValueY = null;

function startTouch(e) {
  initialValueX = e.touches[0].clientX; // Horizontal postion of click (e.g far left = 0)
  initialValueY = e.touches[0].clientY; // Veritcal postion of click (eg. top = 0);
}

function moveTouchSpan(e) {
  if (initialValueX === null || initialValueY === null) {
    return;
  }

  let currentValueX = e.touches[0].clientX;
  let currentValueY = e.touches[0].clientY;

  let detectDiffereceX = initialValueX - currentValueX;
  let detectDiffereceY = initialValueY - currentValueY;

  if (Math.abs(detectDiffereceX) > Math.abs(detectDiffereceY)) {
    // sliding horizontally
    if (detectDiffereceX > 0) {
      // swiped left
      randomColourSpan(e.target);
    } else {
      // swiped right
      randomColourSpan(e.target);
    }
  } else if (detectDiffereceY > 0) {
    moveUp(e.target.parentNode);
  } else {
    populateRandomColours();
  }

  initialValueX = null;
  initialValueY = null;

  e.preventDefault();
}

// document.addEventListener('touchstart', startTouch, false);
// document.addEventListener('touchmove', moveTouch, false);

boxInner.forEach((current) => {
  current.addEventListener('touchstart', startTouch, false);
  current.addEventListener('touchmove', moveTouchSpan, false);
});

function shareColours() {
  const share = colorText.map((c, i) => {
    return ` COLOUR ${i + 1} - ${c.textContent}
     `;
  });
  return share;
}

save.addEventListener('click', function (e) {
  let textArea = document.createElement('textarea');
  textArea.value = shareColours();
  document.body.appendChild(textArea);
  textArea.select();
  document.execCommand('Copy');
  textArea.remove();
  save.textContent = 'COPIED';
  setTimeout(() => {
    save.textContent = 'SAVE';
    save.style.cursor = 'pointer';
  }, 800);
});

reload.addEventListener('click', populateRandomColours);

// First we get the viewport height and we multiple it by 1% to get a value for a vh unit
let vh = window.innerHeight * 0.01;
// Then we set the value in the --vh custom property to the root of the document
document.documentElement.style.setProperty('--vh', `${vh}px`);

window.addEventListener('resize', function () {
  vh = window.innerHeight * 0.01;
  // Then we set the value in the --vh custom property to the root of the document
  document.documentElement.style.setProperty('--vh', `${vh}px`);
});

info.addEventListener('click', function () {
  infoContainer.classList.toggle('hidden');
  footer.classList.toggle('blur');
  main.classList.toggle('blur');
});

infoContainer.addEventListener('click', function () {
  infoContainer.classList.toggle('hidden');
  footer.classList.toggle('blur');
  main.classList.toggle('blur');
});

// DRAG

// let dragElement = '';

// function dragStart(e) {
//   // this.style.opacity = '0.5';
//   dragElement = this;
//   e.dataTransfer.effectAllowed = 'move';
//   e.dataTransfer.setData('text/html', this.innerHTML);
// }

// function dragEnd(e) {
//   // this.style.opacity = '1';
//   // elipseArray.forEach(function (item) {
//   //   item.firstElementChild.classList.remove('over');
//   // });
// }

// function dragOver(e) {
//   if (e.preventDefault) {
//     e.preventDefault();
//   }

//   e.dataTransfer.dropEffect = 'move';

//   return false;
// }

// /* The dragenter event handler is used to toggle the over class instead of dragover. If you use dragover, the CSS class would be toggled many times as the event dragover continued to fire. Ultimately, that would cause the browser's renderer to do a large amount of unnecessary work. */
// function dragEnter(e) {
//   // this.firstElementChild.classList.add('over');
// }

// function dragLeave(e) {
//   // this.firstElementChild.classList.remove('over');
// }

// function dropEvent(e) {
//   if (e.stopPropagation) {
//     e.stopPropagation(); // stops the browser from redirecting.
//   }

//   if (dragElement !== this) {
//     dragElement.innerHTML = this.innerHTML;
//     this.innerHTML = e.dataTransfer.getData('text/html');
//   }

//   return false;
// }

// // elipseArray.forEach((current) => {
// //   const element = current;
// //   element.firstElementChild.classList.remove('over');
// // });

// // What does the false do here
// elipseArray.forEach((current) => {
//   const element = current;
//   element.addEventListener('dragstart', dragStart, false);
//   element.addEventListener('dragend', dragEnd, false);
//   element.addEventListener('dragenter', dragEnter, false);
//   element.addEventListener('dragover', dragOver, false);
//   element.addEventListener('dragleave', dragLeave, false);
//   element.addEventListener('drop', dropEvent, false);
//   element.addEventListener('dragend', dragEnd, false);
// });
