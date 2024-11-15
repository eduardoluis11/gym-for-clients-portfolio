import axios from 'axios';

const DUMMY_TRAINERS =  [
  {
    name: 'Fabio Capello',
    id: 1234, 
  },
  {
    name: 'Marco Van Basten',
    id: 1235,  
  },
  {
    name: 'Ruud Gullit',
    id: 1236,
  },
  {
    name: 'Fernando Alonso',
    id: 2234,  
  },
  {
    name: 'Giancarlo Fisichella',
    id: 2235,
  },

];

class TrainerApi {

  async getTrainers(request) {
    try {
      const accessToken = localStorage.getItem('accessToken')
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
