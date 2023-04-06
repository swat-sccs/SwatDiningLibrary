// Import the function from a local file
import { DiningObject } from "./DiningObject.js";

// Store the object under an alias, if you'd like
const obj = DiningObject();

// Wait for the object to fill in
await new Promise(r => setTimeout(r, 150));

// After waiting, you can then access the data
console.log(obj['Dining Center'].dinner['World of Flavor']);