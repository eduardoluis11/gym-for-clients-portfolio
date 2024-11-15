import axios from 'axios';

class SupplierApi {

  async getSuppliers(request) {
    try {
      const accessToken = localStorage.getItem('accessToken')
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_ROOT}/api/1/suppliers/`, 
      {
        headers: 
        { Authorization: `JWT ${accessToken}`},
              }, );

    const suppliers = response.data;
    return suppliers
    } catch (e){
      console.log(e)
      throw new Error(e.response.data.detail);
    }
  }
  async getSupplier(id) {
    try {
      const accessToken = localStorage.getItem('accessToken')
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_ROOT}/api/1/suppliers/${id}`, 
      {
        headers: 
        { Authorization: `JWT ${accessToken}`},
              }, );
    const supplier = response.data;
    return supplier
    } catch (e){
      console.log(e)
      throw new Error(e.response.data.detail);
    }
  }
  async updateSupplier(id, supplierData) {
    try {
      const accessToken = localStorage.getItem('accessToken')
      const response = await axios.put(`${process.env.NEXT_PUBLIC_API_ROOT}/api/1/suppliers/${id}`, 
      supplierData, 
      {
        headers: 
        { Authorization: `JWT ${accessToken}`},
              }, );
    const supplier = response.data;
    return supplier
    } catch (e){
      console.log(e)
      throw new Error(e.response.data.detail);
    }
  }
  async createSupplier(supplierData) {
    try {
      const accessToken = localStorage.getItem('accessToken')
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_ROOT}/api/1/suppliers/`, 
      supplierData, 
      {
        headers: 
        { Authorization: `JWT ${accessToken}`},
              }, );
    const supplier = response.data;
    return supplier
    } catch (e){
      console.log(e)
      throw new Error(e.response.data.detail);
    }
  }
  async deleteSupplier(id) {
    try {
      const accessToken = localStorage.getItem('accessToken')
      const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_ROOT}/api/1/suppliers/${id}`, 
      {
        headers: 
        { Authorization: `JWT ${accessToken}`},
              }, );
    const supplier = response.data;
    return supplier
    } catch (e){
      console.log(e)
      throw new Error(e.response.data.detail);
    }
  }

}

export const supplierApi = new SupplierApi();