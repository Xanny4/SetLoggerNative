import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCszPnGpQldWAkqLGG1OvVwnOicNjk3FQE",
    authDomain: "setlogger-db51a.firebaseapp.com",
    projectId: "setlogger-db51a",
    storageBucket: "setlogger-db51a.appspot.com",
    messagingSenderId: "756373196413",
    appId: "1:756373196413:web:9073b650f479f8d29d6b14"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth with persistence
const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
});

// Initialize Storage
const storage = getStorage(app);

export { app, auth, storage };