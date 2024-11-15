import axios from 'axios';

/* API para Crear y editar a Clientes llamando a la API De Django.
* Esto envía los datos de los Formularios del Front End al la web app de Django.
* */

class ClientApi {

  async getClients(request) {
    try {
      const accessToken = localStorage.getItem('accessToken')
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_ROOT}/api/1/clients/`,
      {
        headers:
        { Authorization: `JWT ${accessToken}`},
              }, );

    const data = response.data;
    return data
    } catch (e){
      console.log(e)
      throw new Error(e.response.data.detail);
    }
  }
  async getClient(id) {
    try {
      const accessToken = localStorage.getItem('accessToken')
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_ROOT}/api/1/clients/${id}`,
      {
        headers:
        { Authorization: `JWT ${accessToken}`},
              }, );
    const client = response.data;
    return client
    } catch (e){
      console.log(e)
      throw new Error(e.response.data.detail);
    }
  }

  /* Esto Actualiza y Modifica a un Cliente.
  *
  * PUEDO USAR UNA FUNCION SIMILAR A ESTA PARA CREAR A UN CLIENTE NUEVO.
  * */
  async updateClient(id, clientData) {
    try {
      const accessToken = localStorage.getItem('accessToken')
      const response = await axios.put(`${process.env.NEXT_PUBLIC_API_ROOT}/api/1/clients/${id}`,
      clientData,
      {
        headers:
        { Authorization: `JWT ${accessToken}`},
              }, );
    const client = response.data;
    return client
    } catch (e){
      console.log(e)
      throw new Error(e.response.data.detail);
    }
  }

    /* Esta se supone que es la función para Crear a los Clientes.
  *
  * Entonces, ¿porque usa la URL de la API de Django para Editar a clientes ("/api/1/clients/")? Debería usar o la API
  * de ir a la lista de clientes (/api/1/clients/), o la de crear un cliente nuevo (/api/1/clients/new/).
  *
  * YA VA: sí: me está llevando a la lista de clientes. NO me está editando a un cliente existente!
  *
  * El error debe estar en otra parte.
  *
  * Creé una nueva API en Django para crear a los clientes. La nueva URL es "/api/1/clients/create".
  *
  * Necesito convertir los datos a JSON antes de enviarlos a la API de Django. Para ello, usaré
  * JSON.stringify(clientData).
  * */
  async createClient(clientData) {
    try {
      const accessToken = localStorage.getItem('accessToken')
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_ROOT}/api/1/clients/create`,
      // clientData,
      JSON.stringify(clientData),
      {
        headers:
        { Authorization: `JWT ${accessToken}`},
              }, );
    const client = response.data;
    return client
    } catch (e){
      console.log(e)
      throw new Error(e.response.data.detail);
    }
  }
  async deleteClient(id) {
    try {
      const accessToken = localStorage.getItem('accessToken')
      const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_ROOT}/api/1/clients/${id}`,
      {
        headers:
        { Authorization: `JWT ${accessToken}`},
              }, );
    const client = response.data;
    return client
    } catch (e){
      console.log(e)
      throw new Error(e.response.data.detail);
    }
  }

}

export const clientApi = new ClientApi();