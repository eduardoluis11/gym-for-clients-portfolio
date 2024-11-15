// /* Aquí instalo el Service Worker en la web app de Clientes del archivo service-worker.js.
// *
// * Solo me funciona si lo pongo en este archivo aquí en la carpeta src. NO PUEDO REGITRAR EL SERVICE WORKER EN EL ARCHIVO
// * notifications-popover.js.js.
// *
// * Fuente de la mayor parte del código: ajay upreti de
// * https://dev.to/ajayupreti/how-to-use-push-notifications-in-react-a-step-by-step-guide-341d .)
// * */
//
// if ('serviceWorker' in navigator) {
//   navigator.serviceWorker.register('/service-worker.js')
//     .then(registration => {
//       console.log('Service Worker registered with scope:', registration.scope);
//     })
//     .catch(error => {
//       console.error('Service Worker registration failed:', error);
//     });
// }