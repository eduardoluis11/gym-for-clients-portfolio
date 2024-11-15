import { addDays, endOfDay, setHours, setMinutes, startOfDay, subDays } from 'date-fns';
import { createResourceId } from '../utils/create-resource-id';
import { deepCopy } from '../utils/deep-copy';

const now = new Date();

let events = [
  {
    id: '5e8882e440f6322fa399eeb8',
    allDay: false,
    color: '#D14343',
    description: 'Natación',
    end: setHours(setMinutes(subDays(now, 6), 0), 19).getTime(),
    start: setHours(setMinutes(subDays(now, 6), 30), 17).getTime(),
    title: 'Clase de natación con Fran',
    customers: []
  },
  {
    id: '5e8882eb5f8ec686220ff131',
    allDay: false,
    color: '#D14343',
    description: 'Abdominales - Principiantes',
    end: setHours(setMinutes(addDays(now, 2), 30), 15).getTime(),
    start: setHours(setMinutes(addDays(now, 2), 0), 12).getTime(),
    title: 'Clase de Abdominales para principiantes con Andrea',
    customers: []
  },
  {
    id: '5e8882f1f0c9216396e05a9b',
    allDay: false,
    color: '#D14343',
    description: 'Abdominales - Intermedio',
    end: setHours(setMinutes(addDays(now, 5), 0), 12).getTime(),
    start: setHours(setMinutes(addDays(now, 5), 0), 8).getTime(),
    title: 'Clase de Abdominales para intermediates con Andrea',
    customers: []
  },
  {
    id: '5e8882f6daf81eccfa40dee2',
    allDay: true,
    color: '#D14343',
    description: 'Pesas',
    end: startOfDay(subDays(now, 11)).getTime(),
    start: endOfDay(subDays(now, 12)).getTime(),
    title: 'Clase de pesas libres',
    customers: []
  },
  {
    id: '5e8882fcd525e076b3c1542c',
    allDay: false,
    color: '#D14343',
    description: 'Clase de Spinning',
    end: setHours(setMinutes(addDays(now, 3), 31), 8).getTime(),
    start: setHours(setMinutes(addDays(now, 3), 30), 7).getTime(),
    title: 'Clase de Spinning con Alexia',
    customers: []
  },
  {
    id: '5e888302e62149e4b49aa609',
    allDay: false,
    color: '#D14343',
    description: 'Clases de Cross Fit',
    end: setHours(setMinutes(subDays(now, 6), 30), 9).getTime(),
    start: setHours(setMinutes(subDays(now, 6), 0), 9).getTime(),
    title: 'Clases de Cross Fit con Alex',
    customers: []
  },
  {
    id: '5e88830672d089c53c46ece3',
    allDay: false,
    color: '#D14343',
    description: 'Get a new quote for the payment processor',
    end: setHours(setMinutes(now, 30), 17).getTime(),
    start: setHours(setMinutes(now, 30), 15).getTime(),
    title: 'Clases de padel',
    customers: []
  }
];

class CalendarApi {
  getEvents(request) {
    return Promise.resolve(deepCopy(events));
  }

  createEvent(request) {
    const { allDay, description, end, start, title } = request;

    return new Promise((resolve, reject) => {
      try {
        // Make a deep copy
        const clonedEvents = deepCopy(events);

        // Create the new event
        const event = {
          id: createResourceId(),
          allDay,
          description,
          end,
          start,
          title
        };

        // Add the new event to events
        clonedEvents.push(event);

        // Save changes
        events = clonedEvents;

        resolve(deepCopy(event));
      } catch (err) {
        console.error('[Calendar Api]: ', err);
        reject(new Error('Internal server error'));
      }
    });
  }
  createRecurrentEvent(request) {
    const { allDay, days, description, end, start, title } = request;
    return new Promise((resolve, reject) => {
      try {
        // Make a deep copy
        const clonedEvents = deepCopy(events);

        {
          const daysOfWeek = new Set(days.map(day => parseInt(day, 10)));
          const recurringEvents = [];
  
          let currentDate = new Date(start);
          const endDate = new Date(end);
          const hours = endDate.getHours() - currentDate.getHours() 
          const minutes = endDate.getMinutes() - currentDate.getMinutes()
          //  TODO: crear un id común para los eventos recurrentes para que se puedan borrar / modificar a la vez
          // REFACTOR: Que se pueda seleccionar el color en el component.
          // REFACTOR: minuts y hours calculados de forma más elegante
          // Iterate through the dates between start and end
          while (currentDate <= endDate) {
            if (daysOfWeek.has(currentDate.getDay())) {
              // If the current day is in the provided 'days' array, create an event
              const event = {
                id: createResourceId(),
                allDay,
                description,
                start: (new Date(currentDate)).getTime(),
                // end: (new Date(currentDate.getTime() + (endDate.getHours() * 60 * 60 * 1000 + endDate.getMinutes()* 60 * 1000))).getTime(),
                end: (new Date(currentDate.getTime() + hours * 60 * 60 * 1000 + minutes * 60 * 1000 )).getTime(),
                title,
                color: '#2196F3'
              };
              recurringEvents.push(event);
              clonedEvents.push(event);
            }
            currentDate.setDate(currentDate.getDate() + 1); // Move to the next day
          }
  
          events = clonedEvents;
  
          resolve(deepCopy(recurringEvents));
        }
      } catch (err) {
        console.error('[Calendar Api]: ', err);
        reject(new Error('Internal server error'));
      }
    });
  }

  getEvent(id) {
    const selectedEvent = events.find((event) => event.id === id)

    return Promise.resolve(selectedEvent);
  }

  updateEvent(request) {
    const { eventId, update } = request;

    return new Promise((resolve, reject) => {
      try {
        // Make a deep copy
        const clonedEvents = deepCopy(events);

        // Find the event that will be updated
        const event = events.find((_event) => _event.id === eventId);

        if (!event) {
          reject(new Error('Event not found'));
          return;
        }

        // Update the event
        Object.assign(event, update);

        // Save changes
        events = clonedEvents;

        resolve(deepCopy(event));
      } catch (err) {
        console.error('[Calendar Api]: ', err);
        reject(new Error('Internal server error'));
      }
    });
  }


  deleteEvent(request) {
    const { eventId } = request;

    return new Promise((resolve, reject) => {
      try {
        // Make a deep copy
        const clonedEvents = deepCopy(events);

        // Find the event that will be removed
        const event = events.find((_event) => _event.id === eventId);

        if (!event) {
          reject(new Error('Event not found'));
          return;
        }

        events = events.filter((_event) => _event.id !== eventId);

        // Save changes
        events = clonedEvents;

        resolve(true);
      } catch (err) {
        console.error('[Calendar Api]: ', err);
        reject(new Error('Internal server error'));
      }
    });
  }
}

export const calendarApi = new CalendarApi();
