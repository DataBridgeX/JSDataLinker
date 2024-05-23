import { admin } from "./utils/firebase/config.js";
import getDocumentIdByContent from "./utils/firebase/getDocumentIdByContent.js";

/**
 * Class representing Firestore operations.
 */
export default class Firestore {
  /**
   * Create a new Firestore instance.
   * @param {string} collectionName - The name of the Firestore collection.
   * @param {string} uid - The UID for the document.
   * @param {Array} nestedPaths - Array containing nested collection/document paths.
   */
  constructor(collectionName, uid, nestedPaths = []) {
    this.collectionName = collectionName;
    this.collection = admin.firestore().collection(collectionName);
    this.uid = uid;
    this.nestedPaths = nestedPaths;
  }

  /**
   * Creates a new document in the Firestore collection.
   * @param {Object} data - The data to be stored in the document.
   * @returns {Promise<Array>} - A promise that resolves to an array containing a boolean indicating success and the ID of the created document.
   */
  async create(data) {
    const docRef = this.getNestedCollectionReference();
    await docRef.set(data);
    const docID = await getDocumentIdByContent(docRef, data);
    return [true, docID];
  }

  /**
   * Reads a document from the Firestore collection.
   * @returns {Promise<Array>} - A promise that resolves to an array containing a boolean indicating success and the data of the document if found, otherwise an error message.
   */
  async read() {
    const docSnapshot = await this.getNestedCollectionReference(this.uid).get();
    if (!docSnapshot.exists) {
      return [false, "Document does not exist"];
    }
    return [true, docSnapshot.data()];
  }

  /**
   * Updates a document in the Firestore collection.
   * @param {Object} data - The data to update the document with.
   * @returns {Promise<Array>} - A promise that resolves to an array containing a boolean indicating success and NaN (not a number).
   */
  async update(data) {
    await this.getNestedCollectionReference(this.uid).update(data);
    return [true, NaN];
  }

  /**
   * Deletes a document from the Firestore collection.
   * @returns {Promise<Array>} - A promise that resolves to an array containing a boolean indicating success and NaN (not a number).
   */
  async delete() {
    await this.getNestedCollectionReference(this.uid).delete();
    return [true, NaN];
  }

  /**
   * Reads nested paths of the Firestore collection.
   * @returns {Promise<Array>} - A promise that resolves to an array containing a boolean indicating success and an array of nested paths.
   */
  async readPaths() {
    const docs = await this.getNestedCollectionReference().listDocuments();
    const paths = docs.map((doc) => doc.path.split("/")[1]);
    return [true, paths];
  }

  /**
   * Reads all documents from the Firestore collection.
   * @returns {Promise<Array>} - A promise that resolves to an array containing a boolean indicating success and an object containing all documents.
   */
  async readAll() {
    let paths = await this.readPaths();
    paths = paths[1];
    const allDocs = {};
    for (const path of paths) {
      const iterFirestore = new Firestore(this.collectionName, path);
      const docSnapshot = await iterFirestore.read();
      allDocs[path] = docSnapshot[1];
    }
    return [true, allDocs];
  }

  /**
   * Retrieves the nested collection reference.
   * @param {string|null} uid - The UID for the document (optional).
   * @returns {Object} - The nested collection reference.
   */
  getNestedCollectionReference(uid = null) {
    let collectionRef = this.collection;
    for (let i = 0; i < this.nestedPaths.length; i += 2) {
      if (this.nestedPaths.length > i + 1) {
        collectionRef = collectionRef
          .doc(this.nestedPaths[i])
          .collection(this.nestedPaths[i + 1]);
      } else {
        collectionRef = collectionRef.doc(this.nestedPaths[i]);
      }
    }
    return uid ? collectionRef.doc(uid) : collectionRef.doc();
  }
}
