import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.get("/numbers/rand", (req, res) => {
  // Create an empty array to store the random numbers
  const newNumber = [];

  // Define a function to generate a random number
  function getRandomNum() {
    return Math.floor(Math.random() * 1000 + 1);
  }

  // Define a function to check if a number is already in the array
  function isInArray(array, num) {
    for (let i = 0; i < array.length; i++) {
      if (array[i] == num) {
        return true; // Return true if the number already exists in the array
      }
    }
    return false; // Return false if the number is not in the array
  }

  // Generate 10 random numbers and push them into the array
  for (let i = 0; i < 10; i++) {
    let randomNumber = getRandomNum();
    while (isInArray(newNumber, randomNumber)) { continue; } // If the generated number is a duplicate, generate another one and try again
    newNumber.push(randomNumber);
  }

  // Create an object with a single property called "number" that contains the array of random numbers
  const responseObject = { number: newNumber };

  // Send the object as the response
  res.json(responseObject);
})

app.get("/numbers/even", (req, res) => {
  // Create an empty array to store the random numbers
  const newNumber = [];

  // Define a function to generate a random start number
  function getRandomStart() {
    return Math.floor(Math.random() * 100 + 1);
  }

  // Define a function to check if a number is even
  function isEven(num) {
    return num % 2 == 0;
  }

  // Generate a random start number
  let startNumber = getRandomStart();
  if  (!isEven(startNumber)) {
    startNumber++; // Make sure it'
  }

  // Generate 10 consecutive even numbers starting from the random start number
  for (let i = 0; i < 10; i++) {
    newNumber.push(startNumber);
    startNumber += 2;
  }

  // Create an object with a single property called "number" that contains the array of random numbers
  const responseObject = { number: newNumber };

  // Send the object as the response
  res.json(responseObject);
});

app.listen(port, () => console.log(`Server running on http://localhost:${port}/`));