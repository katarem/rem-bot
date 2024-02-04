# API

## Index

- [Create JSON Files](#create-json-files)
- [Deleting JSON Files](#deleting-json-files)
- [Creating a JsonHandler Instance](#creating-jsonhandler-instance)
- [Get Json Data](#get-json-data)
- [Push Element in Array](#push-element-in-array)
- [Unshift Element in Json Array](#unshift-element)
- [Drop Element in Json Array](#drop-element-in-json-array)
- [Pop Element in Json Array](#pop-element-in-json-array)
- [Shift Element in Json Array](#shift-element-in-json-array)
- [Set Property in Json Object](#set-property-in-json-object)
- [Drop Property in Json Object](#drop-property-in-json-object)
- [Set Json Data](#set-json-data)
- [Get Json Data Type](#get-json-data-type)
- [Notes](#notes)



## Create JSON Files

This Static Function creates a new `JSON File` and returns a new Instance of `JsonHandler`:

### Params

`filename`: `string`
Absolute path to create the new Json File.

`?isArray`: `boolean` The JSON gonna be created with a `{}` in the root file by default. If we set `isArray` with `true`, the file gonna be created with a `[]` in the root file.

### Returns

Returns a new Instance of `JsonHandler`

### Example

```
let myNewJsonHandler = JsonHandler.createJson("my/absolute/path");
```

## Deleting JSON Files

This Static Function deletes an existing JSON File:

### Params

`JsonFile`: `JsonHandler` JsonHandler Object Instance of the Json File that we want to delete.

### Returns

This Function has no return.

### Example

```
let myJsonHandler = new JsonHandler("my/absolute/path");

JsonHandler.deleteJson(myJsonHandler);
```

## Creating JsonHandler Instance

Constructor of the JsonHandler Class:

### Params

`path`: `string` Absolute path of the __existing__ `JSON File`.

### Returns

Returns a new Instance of `JsonHandler`

### Example

```
let myJsonHandler = new JsonHandler("my/absolute/path");
```

## Get JSON Data

This function returns the JSON Data.

### Params

No params needed.

### Returns

Returns an `Object` or an `Array<any>` depending of the content of the JSON File.

### Example

```
let myJsonHandler = new JsonHandler("my/absolute/path");

let data = myJsonHandler.getJson();

console.log(data); // Example log: ["Hello", "World"] or { Hello: "World" }
```

## Push Element in Array

Set a element in the last position in the JSON's root Array (if the root element is not an Array, you have to use [setProperty](#set-property-in-json-object)). The Json File gonna be saved by default.

### Params

`element`: `any` Element to push in the array

`?save`: `boolean` Is setted on `true` by default, meaning that the Json gonna be stored automatically. You can set it in `false` to avoid the autosave.

### Returns

This Function has no return.

### Example

```
let myJsonHandler = new JsonHandler("my/absolute/path");

myJsonHandler.pushElement("hello!", false); // Whoops! Here i didn't save it

myJsonHandler.pushElement("hello!"); // Now it does :)

console.log(myJsonHandler.getJson()); // [..., "hello!"]
```

## Unshift Element

Set a element in the first position in the JSON's root Array (if the root element is not an Array, you have to use [setProperty](#set-property-in-json-object)). The Json File gonna be saved by default.

### Params

`element`: `any` Element to unshift in the array

`?save`: `boolean` Is setted on `true` by default, meaning that the Json gonna be stored automatically. You can set it in `false` to avoid the autosave.

### Returns

This Function has no return.

### Example

```
let myJsonHandler = new JsonHandler("my/absolute/path");

myJsonHandler.unshiftElement("hello!", false); // Whoops! Here i didn't save it

myJsonHandler.unshiftElement("hello!"); // Now it does :)

console.log(myJsonHandler.getJson()); // ["hello!", ...]
```

## Drop Element in Json Array

Deletes a element in the position given in the JSON's root Array (if the root element is not an Array, you have to use [dropProperty](#drop-property-in-json-object)). The Json File gonna be saved by default.

### Params

`elementIndex`: `any` Index of the Element to drop it

`?save`: `boolean` Is setted on `true` by default, meaning that the Json gonna be stored automatically. You can set it in `false` to avoid the autosave.

### Returns

This Function has no return.

### Example

```
let myJsonHandler = new JsonHandler("my/absolute/path");

myJsonHandler.pushElement("Hello");

myJsonHandler.pushElement("New");

myJsonHandler.pushElement("World!");

myJsonHandler.dropElement(1); 

console.log(myJsonHandler.getJson()); // ["Hello", "World!"]
```

## Pop Element in Json Array

Deletes the last element in the JSON's root Array (if the root element is not an Array, you have to use [dropProperty](#drop-property-in-json-object)). The Json File gonna be saved by default.

### Params

`?save`: `boolean` Is setted on `true` by default, meaning that the Json gonna be stored automatically. You can set it in `false` to avoid the autosave.

### Returns

This Function has no return.

### Example

```
let myJsonHandler = new JsonHandler("my/absolute/path");

myJsonHandler.pushElement("Hello");

myJsonHandler.pushElement("New");

myJsonHandler.pushElement("World!");

myJsonHandler.popElement(); 

console.log(myJsonHandler.getJson()); // ["Hello", "New"]
```

## Shift Element in Json Array

Deletes the first element in the JSON's root Array (if the root element is not an Array, you have to use [dropProperty](#drop-property-in-json-object)). The Json File gonna be saved by default.

### Params

`?save`: `boolean` Is setted on `true` by default, meaning that the Json gonna be stored automatically. You can set it in `false` to avoid the autosave.

### Returns

This Function has no return.

### Example

```
let myJsonHandler = new JsonHandler("my/absolute/path");

myJsonHandler.pushElement("Hello");

myJsonHandler.pushElement("New");

myJsonHandler.pushElement("World!");

myJsonHandler.shiftElement(); 

console.log(myJsonHandler.getJson()); // ["New", "World!"]
```

## Set Property in Json Object

Set a new property in the JSON's Root Object (if the root element is an Array, you have to use [pushElement](#push-element-in-array)). The Json File gonna be saved by default.

### Params

`propertyName`: `string` Property's name

`propertyValue`: `any` Property's value

`?save`: `boolean` Is setted on `true` by default, meaning that the Json gonna be stored automatically. You can set it in `false` to avoid the autosave.

### Returns

This Function has no return.

### Example

```
let myJsonHandler = new JsonHandler("my/absolute/path");

myJsonHandler.setProperty("name", "My Project");

myJsonHandler.setProperty("dependencies", {
    "@types/node": "^20.8.4",
    "typescript": "^5.2.2"
});

console.log(myJsonHandler.getJson()); // { name: "My Project", dependencies: { "@types/node": "^20.8.4", "typescript": "^5.2.2" } }
```

## Drop Property in Json Object

Delete a property in the JSON's Root Object (if the root element is an Array, you have to use [pushElement](#push-element-in-array)). The Json File gonna be saved by default.

### Params

`propertyName`: `string` Property's name

`?save`: `boolean` Is setted on `true` by default, meaning that the Json gonna be stored automatically. You can set it in `false` to avoid the autosave.

### Returns

This Function has no return.

### Example

```
let myJsonHandler = new JsonHandler("my/absolute/path");

myJsonHandler.setProperty("name", "My Project");

myJsonHandler.setProperty("description", "This is my description!");

myJsonHandler.dropProperty("name");

console.log(myJsonHandler.getJson()); // { description: "This is my description!" }
```

## Set Json Data

Set to the Json Data the information that we want.

### Params

`newJson`: `Object | Array<any>` New Json Data

`?save`: `boolean` Is setted on `true` by default, meaning that the Json gonna be stored automatically. You can set it in `false` to avoid the autosave.

### Returns

This Function has no return.

### Example

```
let myJsonHandler = new JsonHandler("my/absolute/path");

myJsonHandler.setJson({
    hello: "world!",
    name: "funny :D"
});

console.log(myJsonHandler.getJson()); // { hello: "world!", name: "funny :D" }
```

## Get Json Data Type

Get the Type of the Root element of the Json (Array or Object)

### Params

This function has no params

### Returns

Return a string that only can be `"Array"` or `"Object"`

### Example

```
let myJsonHandler = new JsonHandler("my/absolute/path");

console.log(myJsonHandler.getJson()); // {}

console.log(myJsonHandler.JsonType()) // "Object"

myJsonHandler.setJson([]);

console.log(myJsonHandler.JsonType()) // "Array"
```

## Notes

We highly recommend a little file of configuration for routes, this gonna make it easier to create JsonHandler Instances or Jsons Files.
For example:
```
import * as path from "node:path"

export myPaths = {
    projectPath = path.join(__dirname, ".."),
    jsonDir = path.join(__dirname, "../data")
}
```
Now we can create easier our JsonHandlers:

```
import { myPaths } from "../myPaths.js";

let myJsonPath = path.join(myPaths.jsonDir, "test.json");

let myNewJsonHandler = new JsonHandler(myJsonPath);
```

[API Index](#api)

[HomePage](../README.md)