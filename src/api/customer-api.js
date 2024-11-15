import { subDays, subHours, subMinutes, subSeconds } from 'date-fns';
import axios from 'axios';

/* Archivo agregado el 1/6/24.
*
* */

const now = new Date();

class CustomerApi {
  async getCustomers(request) {
      try {
        const accessToken = localStorage.getItem('accessToken')
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_ROOT}/api/customers/`,
        {
          headers:
          { Authorization: `JWT ${accessToken}`},
                }, );

      const customers = response.data;
      return customers
      } catch (e){
        console.log(e)
        throw new Error(e.response.data.detail);
      }
    }

}

export const customerApi = new CustomerApi();