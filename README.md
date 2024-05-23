# JSDataLinker

JSDataLinker is the ultimate JavaScript package for database connectivity. Designed to work seamlessly with Firebase and other databases, JSDataLinker provides developers with a powerful toolkit for building robust applications. Streamline your frontend and backend development with JSDataLinker.

## Installation

To install JSDataLinker, simply run:

```bash
npm install jsdatalinker
```

## Usage

### Firebase Storage Operations

```javascript
import { Storage } from 'jsdatalinker';

// Initialize Firebase Storage instance
const storage = new Storage('path/to/storage');

// Upload a base64-encoded image
const uploadResult = await storage.uploadByte8Array('path/to/image.jpg', 'base64EncodedImageData');
console.log(uploadResult); // [true, 'downloadURL']

// Upload a file
const file = ...; // File object
const uploadFileResult = await storage.uploadFile(file, 'path/to/file');
console.log(uploadFileResult); // [true, 'downloadURL']

// Get download URL of a file
const downloadURLResult = await storage.getDownloadURL('path/to/file');
console.log(downloadURLResult); // [true, 'downloadURL']

// Delete a file
const deleteResult = await storage.deleteFile('path/to/file');
console.log(deleteResult); // [true, NaN]
```

### Firebase Realtime Database Operations

```javascript
import { RealTime } from "jsdatalinker";

// Initialize Firebase Realtime Database instance
const database = new RealTime("path/to/database");

// Create a new item
const createResult = await database.create({ name: "John", age: 30 });
console.log(createResult); // [true, 'newItemId']

// Read all items
const readResult = await database.read();
console.log(readResult); // [true, [{ id: 'itemId', name: 'John', age: 30 }]]

// Update an item
const updateResult = await database.update("itemId", { name: "Jane", age: 35 });
console.log(updateResult); // [true, true]

// Delete an item
const deleteResult = await database.delete("itemId");
console.log(deleteResult); // [true, true]
```

## Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
