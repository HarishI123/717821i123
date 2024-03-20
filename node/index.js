const express = require("express");
const app = express();
const port = 3000;
const windowSize = 10;

app.use(express.json());

// Define a data structure to store the window of numbers
const window = {
  previous: [],
  current: []
};

// Define a function to check if a number is already in the window
function isInWindow(number) {
  return window.current.includes(number) || window.previous.includes(number);
}

// Define a function to calculate the average of a list of numbers
function calculateAverage(numbers) {
  if (numbers.length == 0) {
    return 0;
  }
  let sum = 0;
  for (let i = 0; i < numbers.length; i++) {
    sum += numbers[i];
  }
  return sum / numbers.length;
}

// Define the route for the API
app.get("/numbers/:numberid", (req, res) => {
  // Parse the number ID from the request parameters
  const numberId = req.params.numberid;

  // Generate a list of numbers based on the number ID
  let numbers = [];
  switch (numberId) {
    case "p":
      // Generate a list of prime numbers
      for (let i = 2; i < 100; i++) {
        if (isPrime(i)) {
          numbers.push(i);
        }
      }
      break;
    case "f":
      // Generate a list of Fibonacci numbers
      numbers = [0, 1];
      for (let i = 2; i < 10; i++) {
        numbers.push(numbers[i - 2] + numbers[i - 1]);
      }
      break;
    case "e":
      // Generate a list of even numbers
      for (let i = 2; i < 100; i += 2) {
        numbers.push(i);
      }
      break;
    case "r":
      // Generate a list of random numbers
      for (let i = 0; i < 10; i++) {
        numbers.push(Math.floor(Math.random() * 100));
      }
      break;
    default:
      return res.status(400).json({ error: "Invalid number ID" });
  }

  // Filter out any duplicate or out-of-window numbers
  const filteredNumbers = numbers.filter(number => {
    if (isInWindow(number)) {
      return false;
    }
    if (window.current.length + window.previous.length >= windowSize) {
      window.previous.shift();
    }
    window.current.push(number);
    return true;
  });

  // Calculate the average of the current window
  const currentAverage = calculateAverage(window.current);

  // Create the response object
  const responseObject = {
    numbers: numbers,
    windowPrevState: window.previous,
    windowCurrState: window.current,
    avg: currentAverage.toFixed(2)
  };

  // Send the response
  res.json(responseObject);
});

// Define a function to check if a number is prime
function isPrime(num) {
  if (num < 2) {
    return false;
  }
  for (let i = 2; i < num; i++) {
    if (num % i == 0) {
      return false;
    }
  }
  return true;
}

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}.`);
});