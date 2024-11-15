import axios from 'axios';

class ServiceApi {

  async getServices(request) {
    try {
      const accessToken = localStorage.getItem('accessToken')
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_ROOT}/api/1/services/`, 
      {
        headers: 
        { Authorization: `JWT ${accessToken}`},
              }, );

    const services = response.data;
    return services
    } catch (e){
      console.log(e)
      throw new Error(e.response.data.detail);
    }
  }
  async getService(id) {
    try {
      const accessToken = localStorage.getItem('accessToken')
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_ROOT}/api/1/services/${id}`, 
      {
        headers: 
        { Authorization: `JWT ${accessToken}`},
              }, );
    const service = response.data;
    return service
    } catch (e){
      console.log(e)
      throw new Error(e.response.data.detail);
    }
  }
  async updateService(id, serviceData) {
    try {
      const accessToken = localStorage.getItem('accessToken')
      const response = await axios.put(`${process.env.NEXT_PUBLIC_API_ROOT}/api/1/services/${id}`, 
      serviceData, 
      {
        headers: 
        { Authorization: `JWT ${accessToken}`},
              }, );
    const service = response.data;
    return service
    } catch (e){
      console.log(e)
      throw new Error(e.response.data.detail);
    }
  }
  async createService(serviceData) {
    try {
      const accessToken = localStorage.getItem('accessToken')
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_ROOT}/api/1/services/`, 
      serviceData, 
      {
        headers: 
        { Authorization: `JWT ${accessToken}`},
              }, );
    const service = response.data;
    return service
    } catch (e){
      console.log(e)
      throw new Error(e.response.data.detail);
    }
  }
  async deleteService(id) {
    try {
      const accessToken = localStorage.getItem('accessToken')
      const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_ROOT}/api/1/services/${id}`, 
      {
        headers: 
        { Authorization: `JWT ${accessToken}`},
              }, );
    const service = response.data;
    return service
    } catch (e){
      console.log(e)
      throw new Error(e.response.data.detail);
    }
  }

}

export const serviceApi = new ServiceApi();