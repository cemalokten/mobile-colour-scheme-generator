'use strict';

// Random Colour Generator

// Returns a random positive whole number between two values (min, max)
// Used throughout to select random array elements
function randomNumber(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

// Return random colour name from colourNames array using randomNumber()
function randomColour() {
  const a = randomNumber(0, 255);
  const b = randomNumber(0, 255);
  const c = randomNumber(0, 255);
  return `rgb(${a}, ${b}, ${c})`;
}

console.log(randomColour());
