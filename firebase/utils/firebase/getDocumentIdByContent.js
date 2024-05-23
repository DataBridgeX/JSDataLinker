/**
 * Retrieves the document ID based on the content provided in the query dictionary.
 * @param {Object} collection - Firestore collection reference.
 * @param {Object} queryDict - Dictionary containing query fields and their corresponding values.
 * @returns {Promise<string>} - Returns a promise that resolves to the document ID if found, otherwise throws an error.
 */
const getDocumentIdByContent = async (collection, queryDict) => {
  try {
    // Construct the query based on the provided query dictionary
    let query = collection;
    for (const [field, value] of Object.entries(queryDict)) {
      query = query.where(field, "==", value);
    }

    // Execute the query
    const querySnapshot = await query.get();

    // If no document is found, throw an error
    if (querySnapshot.empty) {
      throw new Error("No document found with the provided content");
    }

    // Retrieve and return the document ID from the query result
    return querySnapshot.docs[0].id;
  } catch (error) {
    // Re-throw the error to be handled by the caller
    throw new Error(`Error retrieving document ID: ${error.message}`);
  }
};

export default getDocumentIdByContent;
