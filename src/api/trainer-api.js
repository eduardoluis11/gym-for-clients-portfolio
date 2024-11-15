import axios from 'axios';

class TrainerApi {

  async getTrainers(request) {
    try {
      const accessToken = localStorage.getItem('accessToken')
    //   NEXT-STEPS: Eliminar la referencia a localhost en todas las llamadas a las APIs
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_ROOT}/api/teachers/`, 
      {
        headers: 
        { Authorization: `JWT ${accessToken}`},
              }, );

    const teachers = response.data;
    return teachers
    } catch (e){
      console.log(e)
      throw new Error(e.response.data.detail);
    }
  }
  }

export const trainerApi = new TrainerApi();