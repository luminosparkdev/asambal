import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDdX9p-JF0l44b81FBCPbMKoHuMk8naWUo",
    authDomain: "asambal.firebaseapp.com",
    projectId: "asambal",
    storageBucket: "asambal.firebasestorage.app",
    messagingSenderId: "304151661518",
    appId: "1:304151661518:web:75d696bc25035f35ddf99f",
    measurementId: "G-KW1RZVRK0Q"
};

const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);