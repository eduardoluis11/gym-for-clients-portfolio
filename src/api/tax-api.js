import axios from 'axios';

class TaxApi {

  async getTaxes(request) {
    try {
      const accessToken = localStorage.getItem('accessToken')
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_ROOT}/api/1/taxes/`, 
      {
        headers: 
        { Authorization: `JWT ${accessToken}`},
              }, );

    const taxes = response.data;
    return taxes
    } catch (e){
      console.log(e)
      throw new Error(e.response.data.detail);
    }
  }
async getTax(id) {
    try {
      const accessToken = localStorage.getItem('accessToken')
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_ROOT}/api/1/taxes/${id}`, 
      {
        headers: 
        { Authorization: `JWT ${accessToken}`},
              }, );
    const tax = response.data;
    return tax
    } catch (e){
      console.log(e)
      throw new Error(e.response.data.detail);
    }
  }
  async updateTax(id, taxData) {
    try {
      const accessToken = localStorage.getItem('accessToken')
      const response = await axios.put(`${process.env.NEXT_PUBLIC_API_ROOT}/api/1/taxes/${id}`, 
      taxData, 
      {
        headers: 
        { Authorization: `JWT ${accessToken}`},
              }, );
    const tax = response.data;
    return tax
    } catch (e){
      console.log(e)
      throw new Error(e.response.data.detail);
    }
  }
  async createTax(taxData) {
    try {
      const accessToken = localStorage.getItem('accessToken')
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_ROOT}/api/1/taxes/`, 
      taxData, 
      {
        headers: 
        { Authorization: `JWT ${accessToken}`},
              }, );
    const tax = response.data;
    return tax
    } catch (e){
      console.log(e)
      throw new Error(e.response.data.detail);
    }
  }
  async deleteTax(id) {
    try {
      const accessToken = localStorage.getItem('accessToken')
      const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_ROOT}/api/1/taxes/${id}`, 
      {
        headers: 
        { Authorization: `JWT ${accessToken}`},
              }, );
    const tax = response.data;
    return tax
    } catch (e){
      console.log(e)
      throw new Error(e.response.data.detail);
    }
  }

}

export const taxApi = new TaxApi();
