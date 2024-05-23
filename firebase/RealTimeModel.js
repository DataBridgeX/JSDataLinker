import {
  getDatabase,
  ref,
  push,
  child,
  set,
  get,
  remove,
} from "firebase/database";

/**
 * RealTime class for performing CRUD operations in Firebase Realtime Database.
 */
export default class RealTime {
  /**
   * Creates a new instance of the RealTime class.
   * @param {string} path - The path to the database reference.
   */
  constructor(path) {
    // Initialize Firebase Realtime Database and reference to the specified path
    this.database = getDatabase();
    this.itemsRef = ref(this.database, path);
  }

  /**
   * Creates a new item in the database.
   * @param {Object} data - The data to be stored.
   * @returns {Array} An array containing a boolean indicating success and the ID of the newly created item.
   */
  async create(data) {
    try {
      // Check for undefined values in the data
      if (Object.values(data).some((value) => value === undefined)) {
        return [false, "Data contains undefined values"];
      }
      // Push a new item to the database and set its value to the provided data
      const newItemRef = push(this.itemsRef);
      await set(newItemRef, data);
      // Return success and the ID of the newly created item
      return [true, newItemRef.key];
    } catch (error) {
      // Return failure and the error message if an error occurs
      return [false, error.message];
    }
  }

  /**
   * Retrieves all items from the database.
   * @returns {Array} An array containing a boolean indicating success and an array of items.
   */
  async read() {
    try {
      // Fetch data from the database
      const snapshot = await get(this.itemsRef);
      const items = [];
      // Iterate over the snapshot to extract item data and IDs
      snapshot.forEach((childSnapshot) => {
        items.push({ id: childSnapshot.key, ...childSnapshot.val() });
      });
      // Return success and the array of items
      return [true, items];
    } catch (error) {
      // Return failure and the error message if an error occurs
      return [false, error.message];
    }
  }

  /**
   * Updates an item in the database.
   * @param {string} id - The ID of the item to update.
   * @param {Object} newData - The new data to replace the existing data.
   * @returns {Array} An array containing a boolean indicating success and a boolean indicating whether the update was successful.
   */
  async update(id, newData) {
    try {
      // Get the reference to the item to be updated
      const itemRef = child(this.itemsRef, id);
      // Set the new data for the item
      await set(itemRef, newData);
      // Return success
      return [true, true];
    } catch (error) {
      // Return failure and the error message if an error occurs
      return [false, error.message];
    }
  }

  /**
   * Deletes an item from the database.
   * @param {string} id - The ID of the item to delete.
   * @returns {Array} An array containing a boolean indicating success and a boolean indicating whether the deletion was successful.
   */
  async delete(id) {
    try {
      // Get the reference to the item to be deleted
      const itemRef = child(this.itemsRef, id);
      // Remove the item from the database
      await remove(itemRef);
      // Return success
      return [true, true];
    } catch (error) {
      // Return failure and the error message if an error occurs
      return [false, error.message];
    }
  }
}
