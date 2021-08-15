/* ===============================================================
 * Companion Studio Coding Challenge
 * Author:  Cemal Okten
 * Github: https://github.com/cemalokten/fac-application-website
 * Language: JS
================================================================== */

'use strict';

// 01 - Variable Declarations
const boxInner = [...document.getElementsByClassName('flex--box--inner')];
const colorText = [...document.getElementsByClassName('flex--box--text')];

const main = document.querySelector('main');
const footer = document.querySelector('footer');
const infoContainer = document.querySelector('.info--container');

const save = document.getElementById('save');
const reload = document.getElementById('reload');
const info = document.getElementById('info');
// ============================================================================
// 02 - Random Number Generator
// Returns a random positive whole number between two values (min, max)
function randomNumber(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}
// ============================================================================
// 03 - Random RGB Colour Generator
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
// ============================================================================
// 04 - Convert RGB to HEX
// Takes random values assigned by randomColour() and converts them to HEX
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
// ============================================================================
// 05 - Background Colour Checker
// Checks background colour and selects suitable forground font color
// Formula (r * 0.299 + g * 0.587 + b * 0.114 > 186) taken from Stack Overflow
function textColor(r, g, b) {
  return r * 0.299 + g * 0.587 + b * 0.114 > 186 ? '#000000' : '#FFFFFF';
}
// ============================================================================
// 06 - Assign Random Colours
// Allocates random colour to individual blocks (instead of all 5)
function randomColourBlock(current) {
  const element = current;
  if (element.classList.contains('flex--box--inner')) {
    const rgbObj = randomColour();
    const r = rgbObj.r;
    const g = rgbObj.g;
    const b = rgbObj.b;
    let span = element.querySelector('span');
    element.style.color = textColor(r, g, b);
    element.style.backgroundColor = `rgb(${r},${g},${b})`;
    span.textContent = rgbToHex(rgbObj);
    span.style.backgroundColor = 'transparent';
  }
}

// Generates 5 random colours and updates the pages elements
// Add's the 5 random colours to an array (currentColors) and then stores them in localStorage
const currentColors = [];
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
    span.textContent = rgbToHex(rgbObj);
    localStorage.setItem('colors', JSON.stringify(currentColors));
  });
}
// ============================================================================
// 07 - Localstorage Session Data
// Retrieves localStorage data (currentColors) and applies the colours to the page
function applyLocalStorage(obj) {
  let i = 0;
  boxInner.forEach((current) => {
    const element = current;
    const r = obj[i].r;
    const g = obj[i].g;
    const b = obj[i].b;
    let span = element.querySelector('span');
    element.style.color = textColor(r, g, b);
    element.style.backgroundColor = `rgb(${r},${g},${b})`;
    span.textContent = rgbToHex(obj[i]);
    i += 1;
  });
}

// Transforms JSON into an object and stores it
const currentColorsLocalStorage = JSON.parse(localStorage.getItem('colors'));

// Check to see if previous session data exists
if (currentColorsLocalStorage.length > 0) {
  applyLocalStorage(currentColorsLocalStorage);
} else {
  populateRandomColours();
}
// ============================================================================
// 07 - Rearrange Individual Blocks (Upwards)
function moveUp(current) {
  let parent = current.parentNode;
  let prev = current.previousElementSibling;
  let oldChild = parent.removeChild(current);
  parent.insertBefore(oldChild, prev);
}

// 08 - Click to copy HEX code

colorText.forEach((current) => {
  const element = current;
  current.addEventListener('click', () => {
    // Create temporary textArea
    let textArea = document.createElement('textarea');
    // Load element textContent into that temporary textArea (e.g #000000)
    textArea.value = element.textContent;
    // Add the textArea to the page
    document.body.appendChild(textArea);
    // Select the contents of the textArea (e.g #000000)
    textArea.select();
    // Copy the contents of the textArea to the user's clipboard (e.g #000000)
    document.execCommand('Copy');
    textArea.remove();
    element.textContent = 'COPIED';
    setTimeout(() => {
      element.textContent = textArea.value;
      element.style.cursor = 'pointer';
    }, 800);
  });
});

// 09 - Save all colours to clipboard

function saveColours() {
  const saved = colorText.map((c, i) => {
    return ` COLOUR ${i + 1} - ${c.textContent}
     `;
  });
  return saved;
}

save.addEventListener('click', function () {
  let textArea = document.createElement('textarea');
  textArea.value = saveColours();
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

// 10 - Touch Functions & Events

let initialValueX = null;
let initialValueY = null;

// Stores coordinates or dimensions of the starting point of the touch event
function startTouch(e) {
  initialValueX = e.touches[0].clientX; // Horizontal postion of click (e.g far left = 0)
  initialValueY = e.touches[0].clientY; // Veritcal postion of click (eg. top = 0);
}

// Checks to see if touch event has started
// If it has it records the end point of the touch
// Compares the values and decides if it was more up than down, etc.
function moveTouchSpan(e) {
  if (initialValueX === null || initialValueY === null) {
    return;
  }

  let currentValueX = e.touches[0].clientX;
  let currentValueY = e.touches[0].clientY;
  let detectDiffereceX = initialValueX - currentValueX;
  let detectDiffereceY = initialValueY - currentValueY;

  if (Math.abs(detectDiffereceX) > Math.abs(detectDiffereceY)) {
    if (detectDiffereceX > 0) {
      randomColourBlock(e.target); // Swipe left
    } else {
      randomColourBlock(e.target); // Swipe right
    }
  } else if (detectDiffereceY > 0) {
    moveUp(e.target.parentNode); // Swipe up
  } else {
    populateRandomColours(); // Swipe down
  }
  initialValueX = null;
  initialValueY = null;
  e.preventDefault();
}

boxInner.forEach((current) => {
  current.addEventListener('touchstart', startTouch, false);
  current.addEventListener('touchmove', moveTouchSpan, false);
});

// 11 - Adjust viewport height for Mobile / Desktop

// Get viewport height * 0.01 = 1% of viewport
// https://css-tricks.com/the-trick-to-viewport-units-on-mobile/
let verticalHeight = window.innerHeight * 0.01;
document.documentElement.style.setProperty('--vh', `${verticalHeight}px`);

window.addEventListener('resize', function () {
  verticalHeight = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${verticalHeight}px`);
});

// 12 - Footer Button Events

// Show informatiom
info.addEventListener('click', function () {
  infoContainer.classList.toggle('hidden');
  footer.classList.toggle('blur');
  main.classList.toggle('blur');
});

// Hide information
infoContainer.addEventListener('click', function () {
  infoContainer.classList.toggle('hidden');
  footer.classList.toggle('blur');
  main.classList.toggle('blur');
});

// Refresh colours in desktop mode
reload.addEventListener('click', populateRandomColours);
