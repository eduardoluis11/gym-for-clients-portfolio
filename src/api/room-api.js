import axios from 'axios';


class RoomApi {

  async getRooms(request) {
    try {
      const accessToken = localStorage.getItem('accessToken')
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_ROOT}/api/1/rooms/`, 
      {
        headers: 
        { Authorization: `JWT ${accessToken}`},
              }, );

    const rooms = response.data;
    return rooms
    } catch (e){
      console.log(e)
      throw new Error(e.response.data.detail);
    }
  }
  // TODO: Revisar si tiene sentido tener un slice que tengo "room" y "rooms" o si hemos de cambiar la api para que el lugar de hacer una llamada get "filtre directamente" en las rooms
  async getRoom(id) {
    try {
      const accessToken = localStorage.getItem('accessToken')
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_ROOT}/api/1/rooms/${id}`, 
      {
        headers: 
        { Authorization: `JWT ${accessToken}`},
              }, );
    const room = response.data;
    return room
    } catch (e){
      console.log(e)
      throw new Error(e.response.data.detail);
    }
  }
  async updateRoom(id, roomData) {
    try {
      const accessToken = localStorage.getItem('accessToken')
      const response = await axios.put(`${process.env.NEXT_PUBLIC_API_ROOT}/api/1/rooms/${id}`, 
      roomData, 
      {
        headers: 
        { Authorization: `JWT ${accessToken}`},
              }, );
    const room = response.data;
    return room
    } catch (e){
      console.log(e)
      throw new Error(e.response.data.detail);
    }
  }
  async createRoom(roomData) {
    try {
      const accessToken = localStorage.getItem('accessToken')
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_ROOT}/api/1/rooms/`, 
      roomData, 
      {
        headers: 
        { Authorization: `JWT ${accessToken}`},
              }, );
    const room = response.data;
    return room
    } catch (e){
      console.log(e)
      throw new Error(e.response.data.detail);
    }
  }
  async deleteRoom(id) {
    try {
      const accessToken = localStorage.getItem('accessToken')
      const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_ROOT}/api/1/rooms/${id}`, 
      {
        headers: 
        { Authorization: `JWT ${accessToken}`},
              }, );
    const room = response.data;
    return room
    } catch (e){
      console.log(e)
      throw new Error(e.response.data.detail);
    }
  }

}

export const roomApi = new RoomApi();
