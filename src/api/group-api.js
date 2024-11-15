import axios from 'axios';


class GroupApi {

  async getGroups(request) {
    try {
      const accessToken = localStorage.getItem('accessToken')
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_ROOT}/api/1/groups/`, 
      {
        headers: 
        { Authorization: `JWT ${accessToken}`},
              }, );

    const groups = response.data;
    return groups
    } catch (e){
      console.log(e)
      throw new Error(e.response.data.detail);
    }
  }
  // TODO: Revisar si tiene sentido tener un slice que tengo "group" y "groups" o si hemos de cambiar la api para que el lugar de hacer una llamada get "filtre directamente" en las groups
  async getGroup(id) {
    try {
      const accessToken = localStorage.getItem('accessToken')
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_ROOT}/api/1/groups/${id}/`, 
      {
        headers: 
        { Authorization: `JWT ${accessToken}`},
              }, );
    const group = response.data;
    return group
    } catch (e){
      console.log(e)
      throw new Error(e.response.data.detail);
    }
  }
  async updateGroup(id, groupData) {
    try {
      const accessToken = localStorage.getItem('accessToken')
      const response = await axios.put(`${process.env.NEXT_PUBLIC_API_ROOT}/api/1/groups/${id}/`, 
      groupData, 
      {
        headers: 
        { Authorization: `JWT ${accessToken}`},
              }, );
    const group = response.data;
    return group
    } catch (e){
      console.log(e)
      throw new Error(e.response.data.detail);
    }
  }
  async createGroup(groupData) {
    try {
      const accessToken = localStorage.getItem('accessToken')
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_ROOT}/api/1/groups/`, 
      groupData, 
      {
        headers: 
        { Authorization: `JWT ${accessToken}`},
              }, );
    const group = response.data;
    return group
    } catch (e){
      console.log(e)
      throw new Error(e.response.data.detail);
    }
  }
  async deleteGroup(id) {
    try {
      const accessToken = localStorage.getItem('accessToken')
      const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_ROOT}/api/1/groups/${id}/`, 
      {
        headers: 
        { Authorization: `JWT ${accessToken}`},
              }, );
    const group = response.data;
    return group
    } catch (e){
      console.log(e)
      throw new Error(e.response.data.detail);
    }
  }

}

export const groupApi = new GroupApi();
