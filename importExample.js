// Import the function from a local file
import { DiningObject } from "./DiningObject.js";

// Store the object under an alias, if you'd like
const obj = await DiningObject();

// After awaiting, you can then access the data
console.log(obj['Dining Center'].dinner['World of Flavor']);