import axios from 'axios';

/* Componente de React con una API para agarrar TODOS LOS DATOS del Gimnasio seleccionado.
*
* */

class GymApiAllData {

    // async getClients(request) {
    //     try {
    //         const accessToken = localStorage.getItem('accessToken')
    //         const response = await axios.get(`${process.env.NEXT_PUBLIC_API_ROOT}/api/1/clients/`,
    //             {
    //                 headers:
    //                     {Authorization: `JWT ${accessToken}`},
    //             },);
    //
    //         const data = response.data;
    //         return data
    //     } catch (e) {
    //         console.log(e)
    //         throw new Error(e.response.data.detail);
    //     }
    // }

    /* Esto agarrará todos los datos del Gimnasio seleccionado.
    *
    *
    * */
    async getGym(id) {
        try {
            const accessToken = localStorage.getItem('accessToken')
            // const response = await axios.get(`${process.env.NEXT_PUBLIC_API_ROOT}/api/1/clients/${id}`,

            // Esto llama a la API de Django usando Axios para agarrar los datos del Gimnasio seleccionado
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_ROOT}/api/${id}`,
                {
                    headers:
                        {Authorization: `JWT ${accessToken}`},
                },);

            // const client = response.data;
            // return client

            // Esto exporta / devuelve todos los datos del Gimnasio seleccionado como datos JSON
            return response.data

        } catch (e) {
            console.log(e)
            throw new Error(e.response.data.detail);    // Mensaje de error si ocurre un error al llamar a la API
        }
    }
}


export const gymApiAllData = new GymApiAllData();