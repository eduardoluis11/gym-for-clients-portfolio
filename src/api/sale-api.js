import axios from 'axios';


class SalesApi {

  async getSales(request) {
    try {
      const accessToken = localStorage.getItem('accessToken')
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_ROOT}/api/1/sales/`, 
      {
        headers: 
        { Authorization: `JWT ${accessToken}`},
              }, );

    const sales = response.data;
    return sales
    } catch (e){
      console.log(e)
      throw new Error(e.response.data.detail);
    }
  }
  async getSale(id) {
    try {
      const accessToken = localStorage.getItem('accessToken')
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_ROOT}/api/1/sales/${id}`, 
      {
        headers: 
        { Authorization: `JWT ${accessToken}`},
              }, );
    const sale = response.data;
    return sale
    } catch (e){
      console.log(e)
      throw new Error(e.response.data.detail);
    }
  }
  async updateSale(id, saleData) {
    try {
      const accessToken = localStorage.getItem('accessToken')
      const response = await axios.put(`${process.env.NEXT_PUBLIC_API_ROOT}/api/1/sales/${id}`, 
      saleData, 
      {
        headers: 
        { Authorization: `JWT ${accessToken}`},
              }, );
    const sale = response.data;
    return sale
    } catch (e){
      console.log(e)
      throw new Error(e.response.data.detail);
    }
  }
  async createSale(saleData) {
    try {
      const accessToken = localStorage.getItem('accessToken')
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_ROOT}/api/1/sales/`, 
      saleData, 
      {
        headers: 
        { Authorization: `JWT ${accessToken}`},
              }, );
    const sale = response.data;
    return sale
    } catch (e){
      console.log(e)
      throw new Error(e.response.data.detail);
    }
  }
  async deleteSale(id) {
    try {
      const accessToken = localStorage.getItem('accessToken')
      const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_ROOT}/api/1/sales/${id}`, 
      {
        headers: 
        { Authorization: `JWT ${accessToken}`},
              }, );
    const sale = response.data;
    return sale
    } catch (e){
      console.log(e)
      throw new Error(e.response.data.detail);
    }
  }

  async getSellers(request) {
    try {
      const accessToken = localStorage.getItem('accessToken')
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_ROOT}/api/1/employees/`, 
      {
        headers: 
        { Authorization: `JWT ${accessToken}`},
              }, );

    const sellers = response.data;
    return sellers
    } catch (e){
      console.log(e)
      throw new Error(e.response.data.detail);
    }
  }
  async getSellerByEmail(email) {
    try {
      const accessToken = localStorage.getItem('accessToken')
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_ROOT}/api/1/employees/${email}`, 
      {
        headers: 
        { Authorization: `JWT ${accessToken}`},
              }, );
    const sale = response.data;
    return sale
    } catch (e){
      console.log(e)
      throw new Error(e.response.data.detail);
    }
  }

}

export const saleApi = new SalesApi();
