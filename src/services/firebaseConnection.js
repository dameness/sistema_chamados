import { initializeApp }  from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
    apiKey: "AIzaSyBuUZc3zSdDl_hLRVCNk7yT9Q_bvjS86cs",
    authDomain: "chamados-658f3.firebaseapp.com",
    projectId: "chamados-658f3",
    storageBucket: "chamados-658f3.appspot.com",
    messagingSenderId: "1032752526363",
    appId: "1:1032752526363:web:930834d11222561cf6b4be",
    measurementId: "G-2ZXXCHTM92"
  };

  const firebaseApp = initializeApp(firebaseConfig);
  const auth = getAuth(firebaseApp);
  const db = getFirestore(firebaseApp);
  const storage = getStorage(firebaseApp);

  export {auth, db, storage}