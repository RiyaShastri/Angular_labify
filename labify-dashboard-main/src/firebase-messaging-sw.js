importScripts(
  "https://www.gstatic.com/firebasejs/9.1.3/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.1.3/firebase-messaging-compat.js"
);

const firebaseApp = firebase.initializeApp({
  projectId: 'courrier-389712',
  appId: '1:699363471527:web:7485848acf2c00534beb82',
  storageBucket: 'courrier-389712.appspot.com',
  apiKey: 'AIzaSyAP1IU8p6xu0BtCd3XpfNzujjmSgusssQk',
  authDomain: 'courrier-389712.firebaseapp.com',
  messagingSenderId: '699363471527',
  measurementId: 'G-210ZPPGFPN',
});

const messaging = firebase.messaging();
