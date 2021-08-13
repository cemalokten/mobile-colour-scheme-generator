'use strict';

// Variable Declarations

const colorArray = [...document.getElementsByClassName('js--color--select')];

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
  return { r, g, b };
}

/* Takes random values assigned by randomColour() and converts them to base16 / HEX */
function rgbToHex(obj) {
  const rgbObj = obj;
  const r = rgbObj.r.toString(16);
  const g = rgbObj.g.toString(16);
  const b = rgbObj.b.toString(16);
  return `#${r}${g}${b}`.toUpperCase();
}

function textColor(r, g, b) {
  return r * 0.299 + g * 0.587 + b * 0.114 > 186 ? '#000000' : '#FFFFFF';
}

// Set Colour

colorArray.forEach((current) => {
  const element = current;
  const rgbObj = randomColour();
  const r = rgbObj.r;
  const g = rgbObj.g;
  const b = rgbObj.b;
  element.style.color = textColor(r, g, b);
  element.parentElement.style.backgroundColor = `rgb(${r},${g},${b})`;
  element.textContent = rgbToHex(rgbObj);
});

colorArray.forEach((color) => {
  color.addEventListener('click', () => {
    var textArea = document.createElement('textarea');
    textArea.value = color.textContent;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('Copy');
    textArea.remove();
    console.log('copied');
  });
});
