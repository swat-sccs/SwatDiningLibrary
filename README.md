# Swat Dining Object
Version: v1.3.0

Big thank you to Jesse Li for helping for "unscuffing" v1.2.0!

Allows users to get information in a better JSON format than the one currently 
given by Swarthmore's Dining API. All menu items will be turned into individual 
objects with properties including allergy tags, dietary restrictions, menu type,
lunch and dinner, etc. Users will be able to query a menu object which can 
return menu information from each individual dining option. Each menu will have
each individual food option separated an object of its own, complete with 
dietary tag information. This allows users to sort, filter, and compile lists 
of menu items based on dining location, dietary restrictions, etc.

Currently, the library is only limited to the current day's menu items.

To use the library, download the library into the working directory. Next, 
import the function into your file by adding the following line at the top of
your code file:


```
import { DiningObject } from "./DiningObject.js";
```


You will now be able to access the Dining object by calling the command and 
storing the object in a variable to work with like so:


```
const myObj = await DiningObject();
```

You can access the Dining Center lunch menu like so:


```
const diningCenterMenu = myObj['Dining Center'].lunch;
console.log(diningCenterMenu);
```


For a full detailed example, see './importExample.js'.