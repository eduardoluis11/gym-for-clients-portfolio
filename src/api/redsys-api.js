
/* Archivo para llamar a la API de Redsys. */

// Esto me deja usar Axios
const axios = require('axios');

// Replace with your test secret key
// const secretKey = 'your_test_secret_key';
const secretKey = '123456';

// Set up the data for the request
const data = {
  // Parámetros necesarios según la documentación de Redsys
  "DS_MERCHANT_AMOUNT": 300,
  "DS_MERCHANT_ORDER": Math.floor(Date.now() / 1000).toString(), // Orden basada en timestamp
  "DS_MERCHANT_MERCHANTCODE": "tuCodigoDeComercio", // Debe ser proporcionado por Redsys al registrarte
  "DS_MERCHANT_CURRENCY": "978", // Código numérico para EUR
  "DS_MERCHANT_TRANSACTIONTYPE": "0", // Tipo de transacción (autorización)
  "DS_MERCHANT_TERMINAL": "1", // Número de terminal que te asignó Redsys
  "DS_MERCHANT_MERCHANTURL": "urlNotificacionComercio", // URL de tu comercio para recibir confirmaciones
  "DS_MERCHANT_URLOK": "urlRetornoClienteOK", // URL a la que redirigir si todo va bien
  "DS_MERCHANT_URLKO": "urlRetornoClienteKO", // URL a la que redirigir si hay un error
};
// const data = {
//   // Add the data required by Redsys here
// };

// Set up the headers for the request
const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${secretKey}`
};

/* Principio de la clase RedsysApi. Necesito poner esto para acceder a este archivo como un "import" desde otro archivo.
* To test the connection to Redsys, you can modify the `testMethod` function to make a request to the Redsys API. You
* can use the `axios` library to make the request. If the request is successful, you can print a debug message saying
* "Connection to Redsys successful". If the request fails, you can print an error message.
*
* Please replace `'https://sis-t.redsys.es:25443/sis/realizarPago'` with the actual URL of the Redsys API. Also, you'll
* need to replace the `data` object with the actual data required by Redsys for the request.
*/
class RedsysApi {

  // Add the testMethod as a method of the RedsysApi class
  async testMethod() {
    // DEBUGGEO: esto es para probar que llamo a redsys-api.js desde subscription-create-form.js.
    console.log("Hola mundo desde redsys-api.js");

     try {
      // Make the request to the Redsys API
      // Replace 'https://sis-t.redsys.es:25443/sis/realizarPago' with the actual URL of the Redsys API
      // const response = await axios.post('https://sis-t.redsys.es:25443/sis/realizarPago', data, { headers });
      const response = await axios.post('https://sis-t.redsys.es:25443/sis/rest/trataPeticionREST/', data, { headers });
      

      // // If the request is successful, print a debug message
      // console.log('Connection to Redsys successful');

      // Si la solicitud es exitosa, imprime un mensaje de depuración
      if (response.status === 200) {
        console.log('Connection to Redsys successful');
        console.log(response.data);
      } else {
        console.log('Response received, but was not successful:', response.data);
      }
    } catch (error) {
      // If the request fails, print an error message
      console.error('Failed to connect to Redsys:', error);
    }
  }

  // // Make the request
  // axios.post('https://sis-t.redsys.es:25443/sis/realizarPago', data, { headers })
  //   .then(response => {
  //     console.log(response.data);
  //   })
  //   .catch(error => {
  //     console.error(error);
  //   });


  // import axios from 'axios';
  //
  // // URL base de la API de Redsys para el entorno de pruebas
  // const url = "https://sis-t.redsys.es:25443/sis/rest/trataPeticionREST/";
  //
  // function stringify(data) {
  //   return JSON.stringify(data);
  // }
  //
  // class RedsysApi {
  //
  //   async createTransaction(client, amount) {
  //     // Obtiene la clave secreta de Redsys desde tu API de configuración del gimnasio
  //     const REDSYS_SECRET_KEY = await gymApi.getGymApiKey();
  //     let data = {
  //       // Parámetros necesarios según la documentación de Redsys
  //       "DS_MERCHANT_AMOUNT": amount,
  //       "DS_MERCHANT_ORDER": Math.floor(Date.now() / 1000).toString(), // Orden basada en timestamp
  //       "DS_MERCHANT_MERCHANTCODE": "tuCodigoDeComercio", // Debe ser proporcionado por Redsys al registrarte
  //       "DS_MERCHANT_CURRENCY": "978", // Código numérico para EUR
  //       "DS_MERCHANT_TRANSACTIONTYPE": "0", // Tipo de transacción (autorización)
  //       "DS_MERCHANT_TERMINAL": "1", // Número de terminal que te asignó Redsys
  //       "DS_MERCHANT_MERCHANTURL": "urlNotificacionComercio", // URL de tu comercio para recibir confirmaciones
  //       "DS_MERCHANT_URLOK": "urlRetornoClienteOK", // URL a la que redirigir si todo va bien
  //       "DS_MERCHANT_URLKO": "urlRetornoClienteKO", // URL a la que redirigir si hay un error
  //     };
  //
  //     try {
  //       const response = await axios.post(url, stringify(data), {
  //         headers: {
  //           'Content-Type': 'application/json',
  //           'Authorization': `Bearer ${REDSYS_SECRET_KEY}`
  //         }
  //       });
  //       console.log(response.data);
  //       return response.data;
  //     } catch (e) {
  //       console.error(e);
  //       throw new Error(e.response.data.detail);
  //     }
  //   }
  //
  //   // Añade más métodos según necesites para manejar otras operaciones de Redsys
  // }
} // Fin de la clase RedsysApi

// Esto me permite acceder a este archivo desde otro archivo como un componente de React
// usando "import { redsysApi } from 'path/to/redsys-api.js';".
export const redsysApi = new RedsysApi();