import axios from 'axios';

/* API que te permite agarrar la Clave de Stripe del Gimnasio seleccionado del modelo de Gym para Crear Cuotas.
*
* Esto NO me permite agarrar todos lso datos del Gimnasio seleccionado, solo la Clave de Stripe.
*
* Tuve que editar esto para arreglar un Bug que no te dejaba Crear Cuotas desde el Dashboard.
* */

class GymApi {

  async getGymApiKey(id) {
    try {
      const accessToken = localStorage.getItem('accessToken')
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_ROOT}/api/${id}`,
      {
        headers:
        { Authorization: `JWT ${accessToken}`},
              }, );
    const gym = response.data;
    return gym.stripe_api_key
    } catch (e){
      console.log(e)
      throw new Error(e.response.data.detail);
    }
  }
  async updateGymApiKey(id, stripe_api_key) {
    try {
      const accessToken = localStorage.getItem('accessToken')


      const response = await axios.put(`${process.env.NEXT_PUBLIC_API_ROOT}/api/${id}/`,
      {stripe_api_key: stripe_api_key},
      {
        headers:
        { Authorization: `JWT ${accessToken}`},
              }, );
    const gym = response.data;
    return gym
    } catch (e){
      console.log(e)
      throw new Error(e.response.data.detail);
    }
  }

}

export const gymApi = new GymApi();



// import axios from 'axios';
//
// /* Esto es el API para acceder a los datos del Gimnasio del modelo de Gym de la web app de Django.
// *
// * Aquí se hacen 2 cosas: 1) Agarrar los datos del Gimnasio desde la base de datos para luego mostrarlos en el front-end,
// * y 2) Editar los datos del Gimnasio en la base de datos al entregar el Formulario del Front-end.
// *
// * Pues, tengo que hacer 2 ediciones: 1) agarrar el metodo de pago (si es Stripe o Redsys), y las claves de Redsys
// * del Gimnasio seleccionado; y 2) editar el método de pago (si es Stripe o Redsys) y las claves de Redsys del Gimnasio
// * cuando se entregue el Formulario del Front-end.
// */
// class GymApi {
//
//   /* Esto agarra los datos del Gimnasio del Modelo de Gym de la base de datos, paral uegos mostrarlos en el Front-end.
//   *
//   * NECESITO EDITAR ESTO para poder mostrar el Método de pago (si es Stripe o Redsys) y las Claves de Redsys
//   * del Gimnasio guardadas en la base de datos para poder mostrarlas en el Front-end.
//   *
//   * */
//   async getGymApiKey(id) {
//     try {
//       const accessToken = localStorage.getItem('accessToken')
//       const response = await axios.get(`${process.env.NEXT_PUBLIC_API_ROOT}/api/${id}`,
//       {
//         headers:
//         { Authorization: `JWT ${accessToken}`},
//               }, );
//     const gym = response.data;
//     // return gym.stripe_api_key
//     // Aquí cojo las claves de Stripe y Redsys del Gimnasio seleccionado.
//     return {
//       stripeApiKey: gym.stripe_api_key,
//       paymentMethod: gym.payment_method,
//       redsysKey: gym.redsys_key,
//       redsysMerchantCode: gym.redsys_merchant_code
//     }
//     } catch (e){
//       console.log(e)
//       throw new Error(e.response.data.detail);
//     }
//   }
//
//   /* Esto Edita los datos del Gimnasio del Modelo de Gym en la base de datos al entregar el Formulario del Front-end.
//   *
//   * NECESITO EDITAR ESTO para poder editar el Método de pago (si es Stripe o Redsys) y las Claves de Redsys del Gimnasio
//   * en la base de datos al entregar el Formulario del Front-end.
//   *
//   * Primero, en lugar de "stripe_api_key", le cambiaré el nombre al segundo parámetro que se le mete a esta API a
//   * "data", ya que esto no solo agarra la Clave de Stripe, y para evitar confusiones. Luego, al llamar a la URL de la
//   * API a la web app de Django, voy a coger los 4 campos del Formulario de config-fom.js (el Formulario de
//   * Configuración del Apartado de "Finanzas"). Para acceder a esos 4 campos, y así meterlos en la llamada de la API
//   * de Django, accederé a estos 4 campos de la variable "data", la cual es un array que contiene esos 4 campos.
//   * */
//   async updateGymApiKey(id, data) {
//     try {
//       const accessToken = localStorage.getItem('accessToken')
//
//
//       const response = await axios.put(`${process.env.NEXT_PUBLIC_API_ROOT}/api/${id}/`,
//       // {stripe_api_key: stripe_api_key},
// {
//             stripe_api_key: data.stripeApiKey,
//             payment_method: data.paymentMethod,
//             redsys_key: data.redsysKey,
//             redsys_merchant_code: data.redsysMerchantCode
//         },
//       {
//         headers:
//         { Authorization: `JWT ${accessToken}`},
//               }, );
//     const gym = response.data;
//     return gym
//     } catch (e){
//       console.log(e)
//       throw new Error(e.response.data.detail);
//     }
//   }
//
// }
//
// export const gymApi = new GymApi();


