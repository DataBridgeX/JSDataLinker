import { Authentication } from "./firebase/AuthenticationModel.js";
import Firestore from "./firebase/FirestoreModel.js";
import RealTime from "./firebase/RealTimeModel.js";
import Storage from "./firebase/StorageModel.js";
import { configureFirebase } from "./firebase/utils/firebase/config.js";
export { configureFirebase, Authentication, Firestore, RealTime, Storage };
