import { addDays, endOfDay, setHours, setMinutes, startOfDay, subDays } from 'date-fns';
import axios from 'axios';
import { authApi } from '../__fake-api__/auth-api';

const now = new Date();



class CalendarApi {
  async getCustomerEvents(request) {
    try {
      const accessToken = localStorage.getItem('accessToken')
      const user = await authApi.me({ accessToken });
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_ROOT}/api/1/events/`,
      {
        headers:
        { Authorization: `JWT ${accessToken}`},
              }, );
      const events = response.data.map(event => {
        // Convert start_date and end_date to Unix timestamps
        const startDate = new Date(event.start_date).getTime();
        const endDate = new Date(event.end_date).getTime();
        const isUserParticipant = event.participants.includes(user.id)
        return {
          ...event,
          start: startDate,
          end: endDate,
          color: isUserParticipant ? '#00B32C' : '#B3000C'
      };
    })
      return events
    } catch (e){
      console.log(e)
      throw new Error(e.response.data.detail);
    }
  }
  async getEvents(request) {
    try {
      const accessToken = localStorage.getItem('accessToken')
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_ROOT}/api/1/events/`,
      {
        headers:
        { Authorization: `JWT ${accessToken}`},
              }, );
      const events = response.data.map(event => {
        // Convert start_date and end_date to Unix timestamps
        const startDate = new Date(event.start_date).getTime();
        const endDate = new Date(event.end_date).getTime();
        return {
          ...event,
          start: startDate,
          end: endDate
      };
    })
      return events
    } catch (e){
      console.log(e)
      throw new Error(e.response.data.detail);
    }
  }

  async createEvent(eventData) {
    // const { start_date, end_date, gym, activity, room, trainer, participants } = request;

    try {
      const accessToken = localStorage.getItem('accessToken')
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_ROOT}/api/1/events/`,
      eventData,
      {
        headers:
        { Authorization: `JWT ${accessToken}`},
              }, );
    const event = response.data;
    return event
    } catch (e){
      console.log(e)
      throw new Error(e.response.data.detail);
    }
  }


  async getEvent(id) {
    try {
      const accessToken = localStorage.getItem('accessToken')
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_ROOT}/api/1/events/${id}/`,
      {
        headers:
        { Authorization: `JWT ${accessToken}`},
      }, );
      const event = response.data;
    return event
  } catch (e){
    console.log(e)
    throw new Error(e.response.data.detail);
  }
    // const selectedEvent = events.find((event) => event.id === id)

    // return Promise.resolve(selectedEvent);
  }

  /* AQUI ESTA la primera instancia que encontre de una llamada a un PATCH request a la api /api/1/events/id_de_clase/
  * de la web app de Django.
  *
  * */
  async updateEvent(request) {
    const { eventId, update } = request;
    try {
      const accessToken = localStorage.getItem('accessToken')
      const response = await axios.patch(`${process.env.NEXT_PUBLIC_API_ROOT}/api/1/events/${eventId}/`,
      update,
      {
        headers:
        { Authorization: `JWT ${accessToken}`},
      }, );
      const event = response.data;
    console.log(event)
    return event
  } catch (e){
    console.log(e)
    throw new Error(e.response.data.detail);
  }
}

async deleteEvent(request) {
  const { eventId } = request;
    try {
      const accessToken = localStorage.getItem('accessToken')
      const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_ROOT}/api/1/events/${eventId}/`,
      {
        headers:
        { Authorization: `JWT ${accessToken}`},
      }, );
      const event = response.data;
      return event
    } catch (e){
      console.log(e)
      throw new Error(e.response.data.detail);
    }
  }
    async createRecurrentEvent(eventData) {
      try {
        const accessToken = localStorage.getItem('accessToken')
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_ROOT}/api/1/events/create_recurring/`,
        eventData,
        {
          headers:
          { Authorization: `JWT ${accessToken}`},
                }, );
      const event = response.data;
      return event
      } catch (e){
        console.log(e)
        throw new Error(e.response.data.detail);
      }
    }
    async updateRecurrentEvent(request) {
      const { update } = request;
      try {
        const accessToken = localStorage.getItem('accessToken')
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_ROOT}/api/1/events/update_recurring/`,
        update,
        {
          headers:
          { Authorization: `JWT ${accessToken}`},
                }, );
      const events = response.data;
      return events
      } catch (e){
        console.log(e)
        throw new Error(e.response.data.detail);
      }
    }
    async deleteRecurrentEvent(recurring_id) {
      try {
        const accessToken = localStorage.getItem('accessToken')
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_ROOT}/api/1/events/delete_recurring/`,
        recurring_id,
        {
          headers:
          { Authorization: `JWT ${accessToken}`},
                }, );
      const events = response.data;
      return events
      } catch (e){
        console.log(e)
        throw new Error(e.response.data.detail);
      }
    }
  async addCustomersToEvent(request) {
    const {eventId, customers: participants} = request
    try {
      // console.log("trying getting the access Token")
      const accessToken = localStorage.getItem('accessToken')
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_ROOT}/api/1/events/${eventId}/add-participants/`,
      {participants},
      {
        headers:
        { Authorization: `JWT ${accessToken}`},
              }, );
      const event = response.data;
      return event
    } catch (e){
      console.log(request)
      console.log(e)
      throw new Error(e.response.data.detail);
    }
  }

  async addAssistCustomersToEvent(request) {
    const {eventId, customers_ok: participants} = request
    try {
      // console.log("trying getting the access Token")
      console.log({participants})
      const accessToken = localStorage.getItem('accessToken')
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_ROOT}/api/1/events/${eventId}/mark-participants-assisted/`,
      {participants},
      {
        headers:
        { Authorization: `JWT ${accessToken}`},
              }, );
      const event = response.data;
      return event
    } catch (e){
      console.log(request)
      console.log(e)
      throw new Error(e.response.data.detail);
    }
  }
  async removeAssistCustomersToEvent(request) {
    const {eventId, customers_ok: participants} = request
    try {
      // console.log("trying getting the access Token")
      console.log({participants})
      const accessToken = localStorage.getItem('accessToken')
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_ROOT}/api/1/events/${eventId}/unmark-participants-assisted/`,
      {participants},
      {
        headers:
        { Authorization: `JWT ${accessToken}`},
              }, );
      const event = response.data;
      return event
    } catch (e){
      console.log(request)
      console.log(e)
      throw new Error(e.response.data.detail);
    }
  }

  async addLateCustomersToEvent(request) {
    const {eventId, customers_late: participants} = request
    try {
      // console.log("trying getting the access Token")
      console.log({participants})
      const accessToken = localStorage.getItem('accessToken')
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_ROOT}/api/1/events/${eventId}/mark-participants-late/`,
      {participants},
      {
        headers:
        { Authorization: `JWT ${accessToken}`},
              }, );
      const event = response.data;
      return event
    } catch (e){
      console.log(request)
      console.log(e)
      throw new Error(e.response.data.detail);
    }
  }
  async removeLateCustomersToEvent(request) {
    const {eventId, customers_late: participants} = request
    try {
      // console.log("trying getting the access Token")
      console.log({participants})
      const accessToken = localStorage.getItem('accessToken')
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_ROOT}/api/1/events/${eventId}/unmark-participants-late/`,
      {participants},
      {
        headers:
        { Authorization: `JWT ${accessToken}`},
              }, );
      const event = response.data;
      return event
    } catch (e){
      console.log(request)
      console.log(e)
      throw new Error(e.response.data.detail);
    }
  }


  async removeCustomersFromEvent(request) {
    const {eventId, customers: participants} = request
    try {
      // console.log("trying getting the access Token")
      const accessToken = localStorage.getItem('accessToken')
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_ROOT}/api/1/events/${eventId}/remove-participants/`,
      {participants},
      {
        headers:
        { Authorization: `JWT ${accessToken}`},
              }, );
      const event = response.data;
      return event
    } catch (e){
      console.log(request)
      console.log(e)
      throw new Error(e.response.data.detail);
    }
  }

}

export const calendarApi = new CalendarApi();