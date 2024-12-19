// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getMessaging,getToken } from "firebase/messaging";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDQKNRukMGg1y8jYblL-ooZH7bdM-4A40U",
  authDomain: "servostay-488da.firebaseapp.com",
  projectId: "servostay-488da",
  storageBucket: "servostay-488da.firebasestorage.app",
  messagingSenderId: "569987427092",
  appId: "1:569987427092:web:877a6cb69408cb06ed3001",
  measurementId: "G-SZ49DPK0CY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);


export const generateToken=async()=>{
    const permission=await Notification.requestPermission();
    console.log(permission)
    if(permission === 'granted'){
        const token=await getToken(messaging,{
            vapidKey:'BJnOZpIa7ns9M9nFqt1sOw0cLYrplYRe6UWsWkBuuDxCye1aHXxOLy33ugCAiKBbcsXog3Y6_iDlIL_xe_EWpu4'
        })
        console.log(token)
    }
}