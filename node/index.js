const express = require("express");
const app = express();
const port = 3000;
const windowSize = 10;
const axios = require("axios")

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
app.get("/numbers/:numberid", async (req, res) => {
  // Parse the number ID from the request parameters
  const numberId = req.params.numberid;

  // Generate a list of numbers based on the number ID
  let numbers = [];
  switch (numberId) {
    case "p":
      result = await axios.get("http://20.244.56.144/numbers/primes")
      numbers = result.data.numbers
      break;
    case "f":
      result = await axios.get("http://20.244.56.144/numbers/fibo")
      numbers = result.data.numbers
      break;
    case "e":
      result = await axios.get("http://20.244.56.144/numbers/even")
      numbers = result.data.numbers
      break;
    case "r":
      result = await axios.get("http://20.244.56.144/numbers/rand")
      numbers = result.data.numbers
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

