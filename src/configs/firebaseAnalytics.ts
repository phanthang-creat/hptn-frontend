// Firebase analytics
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

export const firebaseAnalyticsConfiguration = () => {
    // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  
  // Initialize Firebase
  if (process.env.NODE_ENV === 'production') {
    const firebaseConfig = {
      apiKey: "AIzaSyCcLBV77hXNwaw6SAgtUzW9NdUgkNjuPo0",
      authDomain: "panochess.firebaseapp.com",
      projectId: "panochess",
      storageBucket: "panochess.appspot.com",
      messagingSenderId: "236372603890",
      appId: "1:236372603890:web:c77b1185304d5760ee316b",
      measurementId: "G-THY67ZZX0B"
    };
    const app = initializeApp(firebaseConfig);
    getAnalytics(app);
  }
}