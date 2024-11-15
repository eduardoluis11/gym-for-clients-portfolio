import axios from 'axios';


class ActivityApi {

  async getActivities(request) {
    try {
      const accessToken = localStorage.getItem('accessToken')
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_ROOT}/api/1/activities/`, 
      {
        headers: 
        { Authorization: `JWT ${accessToken}`},
              }, );

    const activities = response.data;
    return activities
    } catch (e){
      console.log(e)
      throw new Error(e.response.data.detail);
    }
  }
  // TODO: Revisar si tiene sentido tener un slice que tengo "activity" y "activitys" o si hemos de cambiar la api para que el lugar de hacer una llamada get "filtre directamente" en las activitys
  async getActivity(id) {
    try {
      const accessToken = localStorage.getItem('accessToken')
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_ROOT}/api/1/activities/${id}`, 
      {
        headers: 
        { Authorization: `JWT ${accessToken}`},
              }, );
    const activity = response.data;
    return activity
    } catch (e){
      console.log(e)
      throw new Error(e.response.data.detail);
    }
  }
  async updateActivity(id, activityData) {
    try {
      const accessToken = localStorage.getItem('accessToken')
      const response = await axios.put(`${process.env.NEXT_PUBLIC_API_ROOT}/api/1/activities/${id}`, 
      activityData, 
      {
        headers: 
        { Authorization: `JWT ${accessToken}`},
              }, );
    const activity = response.data;
    return activity
    } catch (e){
      console.log(e)
      throw new Error(e.response.data.detail);
    }
  }
  async createActivity(activityData) {
    try {
      const accessToken = localStorage.getItem('accessToken')
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_ROOT}/api/1/activities/`, 
      activityData, 
      {
        headers: 
        { Authorization: `JWT ${accessToken}`},
              }, );
    const activity = response.data;
    return activity
    } catch (e){
      console.log(e)
      throw new Error(e.response.data.detail);
    }
  }
  async deleteActivity(id) {
    try {
      const accessToken = localStorage.getItem('accessToken')
      const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_ROOT}/api/1/activities/${id}`, 
      {
        headers: 
        { Authorization: `JWT ${accessToken}`},
              }, );
    const activity = response.data;
    return activity
    } catch (e){
      console.log(e)
      throw new Error(e.response.data.detail);
    }
  }

}

export const activityApi = new ActivityApi();
