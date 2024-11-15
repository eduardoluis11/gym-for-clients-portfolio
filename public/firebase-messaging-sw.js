// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here. Other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');

/* Service Worker de Firebase, el cual me permite recibir notificaciones push en el navegador en el segundo plano,
* y me permite generar el Token IID para generar las notificaciones Push (fuente de gran parte del código:
* Documentación oficial de google en: https://firebase.google.com/docs/cloud-messaging/js/receive#web_7 ).
* */

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp({
//   apiKey: "apiKey",
//   authDomain: "authDomain",
//   projectId: "projectId",
//   storageBucket: "storageBucket",
//   messagingSenderId: "messagingSenderId",
//   appId: "appId:",
//   measurementId: "measurementId"
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

/* To set options, call onBackgroundMessage in firebase-messaging-sw.js. In this example, we create a notification with
* title, body and icon fields.
* */
messaging.onBackgroundMessage((payload) => {
  console.log(
    '[firebase-messaging-sw.js] Received background message ',
    payload
  );
  // // Customize notification here
  // const notificationTitle = 'Background Message Title';
  // const notificationOptions = {
  //   body: 'Background Message body.',
  //   icon: '/firebase-logo.png'
  // };
  //
  // self.registration.showNotification(notificationTitle, notificationOptions);
});

