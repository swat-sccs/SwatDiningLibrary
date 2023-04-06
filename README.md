# Swat Dining Object
Allows users to get information in a better JSON format than the one currently given by Swarthmore's Dining API. All menu items will be turned into individual objects with properties including allergy tags, dietary restrictions, menu type, lunch and dinner, etc. Users will be able to query a menu object which can return menu information from each individual dining option. Each menu will have each individual food option separated an object of its own, complete with dietary tag information.
This allows users to sort, filter, and compile lists of menu items based on dining location, dietary restrictions, etc.

Currently the library is only limited to the current and next day's menu items.

To use the library, download the library into the working directory. Next, 
import the function into your file by adding the following line at the top of
your code file:


```
import { DiningObject } from "./DiningObject.js";
```


You will now be able to access the Dining object by calling the command and 
storing the object in a variable to work with like so:


```
const myObj = DiningObject();
await new Promise(r => setTimeout(r, 150));
```


The object takes some time to load in before accessing, so the line below is 
essentially a "sleep()" function for 150ms. You can modify the milliseconds
by editing the '150' number as needed. (I know this is incredibly scuffed but
I've tried all other await/async functions and nothing but this seems to work;
If you have a solution, *please* help me out!)

For example, you can access the Dining Center lunch menu like so:


```
const diningCenterMenu = myObj['Dining Center'].lunch;
console.log(diningCenterMenu);
```


For a full detailed example, see './importExample.js'.