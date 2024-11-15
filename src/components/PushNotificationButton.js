// import React, { useEffect } from 'react';
// import { messaging, getToken } from '../firebase';
// // import {getToken} from "firebase/messaging";
//
// /* Componente con un Botón para aceptar el consentimiento de Recibir Push Notifications de Firebase
// * (fuente: ajay upreti de https://dev.to/ajayupreti/how-to-use-push-notifications-in-react-a-step-by-step-guide-341d ).
// *
// * Debo usar el componente "Notification", NO el componente "messaging". Solo el componente "Notification" tiene la
// * función request.Permission().
// *
// * Problem 1: Incorrect Method to Request Permission for Notifications
// * The requestPermission method is not available on the messaging object. Instead, you should use the Notification API to
// * request permission.  Fix: Use the Notification API to Request Permission.
// *
// * The `Notification` API allows web applications to display notifications to the user. These notifications can be used to inform users about important events, updates, or messages even when the web page is not in focus. Here are the key aspects of the `Notification` API:
// *
// *### Key Features
// *
// *1. **Requesting Permission**:
// *   Before displaying notifications, you must request permission from the user.
// *
// 2. **Creating Notifications**:
//    Once permission is granted, you can create and display notifications.
//
// 3. **Handling Notification Events**:
//    You can handle events such as clicks on the notification.
//
// ### Example Usage
//
// Here is a complete example demonstrating how to request permission and display a notification:
//
// ### Browser Support
//
// The `Notification` API is widely supported in modern browsers, but it's always a good idea to check for compatibility and handle cases where the API is not available.
//
// ### Security Considerations
//
// - **User Consent**: Always request user consent before displaying notifications.
// - **Respect User Preferences**: Respect the user's decision if they deny notification permissions.
// - **Avoid Spamming**: Use notifications judiciously to avoid overwhelming or annoying users.
//
// * The `Notification` API is a powerful tool for engaging users with timely and relevant information, but it should be
// * used responsibly to maintain a good user experience.
// *
// * Eliminé el botón de la función PushNotificationButton() porque no lo necesito. Solo necesito la función
// * PushNotificationButton() para que se ejecute el código de la función useEffect() que está dentro de la función
// * PushNotificationButton(). Es decir, comentare el código del return() con el botón para eliminarlo, y así solo me
// * salga directamente la notificación Push de Consentimiento de Firebase en el Navegador, sin necesidad de hacer clic en
// * ningún botón.
// * */
//
// const PushNotificationButton = () => {
//   useEffect(() => {
//     // messaging.requestPermission()
//     // Request permission to display notifications
//     Notification.requestPermission()
//       .then(permission => {
//         if (permission === 'granted') {
//           // return getToken(messaging, { vapidKey: process.env.FIREBASE_VAPID_KEY });
//                   return navigator.serviceWorker.register('/service-worker.js')
//             .then((registration) => {
//               return getToken(messaging, { vapidKey: process.env.FIREBASE_VAPID_KEY, serviceWorkerRegistration: registration });
//             });
//
//
//         } else {
//           throw new Error('Permission not granted for Notification');
//         }
//       })
//
//
//       // .then(() => {
//       //   return messaging.getToken();
//       // })
//
//
//
//
//       .then(token => {
//         console.log('Token:', token);
//       })
//       .catch(error => {
//         console.error('Error:', error);
//       });
//   }, []);
//
//   // return (
//   //   <button>Enable Push Notifications</button>
//   // );
// };
//
// export default PushNotificationButton;