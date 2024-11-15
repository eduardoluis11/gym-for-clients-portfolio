import { addDays, endOfDay, setHours, setMinutes, startOfDay, subDays } from 'date-fns';
import { createResourceId } from '../utils/create-resource-id';
import { deepCopy } from '../utils/deep-copy';

/* Este archivo simula la API de un servidor real, el cual me deja renderizar las Clases en el Calendario de la página
* de /dashboard/calendar de TODOS los Clientes, por lo que tengo que modificarlo para que SOLO agarre las clases
* del Cliente que está autenticado.
*
* Esta API falsa agarra de manera hard-coded las Clases del Gimnasio de TODOS los gimnasios. Dado a que esta es una
* API falsa, NO modificaré nada aquí. Simple y llanamente crearé una nueva API en la carpeta "api" (si es que
* no existe la API verdadera para renderizar clases en el Front-end del Calendario), y agarraré las clases del usuario
* autenticado desde la web app de Django.
*
*
* */

const now = new Date();

let events = [
  {
    id: '5e8882e440f6322fa399eeb8',
    allDay: false,
    color: '#FFB020',
    description: 'Clase de Spinning',
    end: setHours(setMinutes(subDays(now, 6), 0), 19).getTime(),
    start: setHours(setMinutes(subDays(now, 6), 30), 17).getTime(),
    title: 'Clase de Spinning con Alexia',
    customers: [],
    customers_ok: [],
    customers_late: []
  },
  {
    id: '5e8882eb5f8ec686220ff131',
    allDay: false,
    color: '#14B8A6',
    description: 'Clases de Cross Fit',
    end: setHours(setMinutes(addDays(now, 2), 30), 15).getTime(),
    start: setHours(setMinutes(addDays(now, 2), 0), 12).getTime(),
    title: 'Clases de Cross Fit con Alex',
    customers: [],
    customers_ok: [],
    customers_late: []
  },
  {
    id: '5e8882f1f0c9216396e05a9b',
    allDay: false,
    color: '#2196F3',
    description: 'Natación',
    end: setHours(setMinutes(addDays(now, 5), 0), 12).getTime(),
    start: setHours(setMinutes(addDays(now, 5), 0), 8).getTime(),
    title: 'Clase de natación con Fran',
    customers: [],
    customers_ok: [],
    customers_late: []
  },
  {
    id: '5e8882f6daf81eccfa40dee2',
    allDay: true,
    color: '#D14343',
    description: 'Abdominales - Principiantes',
    end: startOfDay(subDays(now, 11)).getTime(),
    start: endOfDay(subDays(now, 12)).getTime(),
    title: 'Clase de Abdominales para principiantes con Andrea',
    customers: [],
    customers_ok: [],
    customers_late: []
  },
  {
    id: '5e8882fcd525e076b3c1542c',
    allDay: false,
    color: '#14B8A6',
    description: 'Abdominales - Intermedio',
    end: setHours(setMinutes(addDays(now, 3), 31), 7).getTime(),
    start: setHours(setMinutes(addDays(now, 3), 30), 7).getTime(),
    title: 'Clase de Abdominales para intermediates con Andrea',
    customers: ['5e86805e2bafd54f66cc95c3','5e8680e60cba5019c5ca6fda',"5e887b209c28ac3dd97f6db5", "5e887b7602bdbc4dbb234b27", '5e86809283e28b96d2d38537'],
    customers_ok: [],
    customers_late: []
  },
  {
    id: '5e888302e62149e4b49aa609',
    allDay: false,
    color: '#10B981',
    description: 'Clase de Yoga',
    end: setHours(setMinutes(subDays(now, 6), 30), 9).getTime(),
    start: setHours(setMinutes(subDays(now, 6), 0), 9).getTime(),
    title: 'Clase de Yoga con Samantha',
    customers: [],
    customers_ok: [],
    customers_late: []
  },
  {
    id: '5e88830672d089c53c46ece3',
    allDay: false,
    color: '#2196F3',
    description: 'Pesas',
    end: setHours(setMinutes(now, 30), 17).getTime(),
    start: setHours(setMinutes(now, 30), 15).getTime(),
    title: 'Clase de pesas libres',
    customers: [],
    customers_ok: [],
    customers_late: []
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

      // Check if the update includes customers
      if (update.customers && Array.isArray(update.customers)) {
        // Add new customers to the existing event.customers array
        event.customers.push(...update.customers);

        // Remove duplicates by converting to Set and back to Array
        event.customers = Array.from(new Set(event.customers));
        
        // Remove selectedCustomers from event.customers
        if (update.selectedCustomers && Array.isArray(update.selectedCustomers)) {
          event.customers = event.customers.filter(
            (customer) => !update.selectedCustomers.includes(customer)
          );
        }
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
  addCustomersToEvent(request) {
    const {eventId, customers} = request
    return new Promise((resolve, reject) => {
      try {
        // Make a deep copy
        const clonedEvents = deepCopy(events);
  
        // Find the event that will be updated
        const event = clonedEvents.find((_event) => _event.id === eventId);
  
        if (!event) {
          reject(new Error('Event not found'));
          return;
        }
  
        if (Array.isArray(customers)) {
          // Add new customers to the existing event.customers array
          event.customers.push(...customers);
  
          // Remove duplicates by converting to Set and back to Array
          event.customers = Array.from(new Set(event.customers));
        } else {
          reject(new Error('Invalid customers data'));
          return;
        }
  
        // Save changes
        events = clonedEvents;
  
        resolve(deepCopy(event));
      } catch (err) {
        console.error('[Calendar Api]: ', err);
        reject(new Error('Internal server error'));
      }
    });
  }

  addAssistCustomersToEvent(request) {
    const {eventId, customers_ok} = request
    return new Promise((resolve, reject) => {
      try {
        // Make a deep copy
        const clonedEvents = deepCopy(events);
  
        // Find the event that will be updated
        const event = clonedEvents.find((_event) => _event.id === eventId);
  
        if (!event) {
          reject(new Error('Event not found'));
          return;
        }
  
        if (Array.isArray(customers_ok)) {
          // Add new customers_ok to the existing event.customers_ok array
          event.customers_ok.push(...customers_ok);
  
          // Remove duplicates by converting to Set and back to Array
          event.customers_ok = Array.from(new Set(event.customers_ok));
        } else {
          reject(new Error('Invalid customers data'));
          return;
        }
  
        // Save changes
        events = clonedEvents;
  
        resolve(deepCopy(event));
      } catch (err) {
        console.error('[Calendar Api]: ', err);
        reject(new Error('Internal server error'));
      }
    });
  }

  addLateCustomersToEvent(request) {
    const {eventId, customers_late} = request
    return new Promise((resolve, reject) => {
      try {
        // Make a deep copy
        const clonedEvents = deepCopy(events);
  
        // Find the event that will be updated
        const event = clonedEvents.find((_event) => _event.id === eventId);
  
        if (!event) {
          reject(new Error('Event not found'));
          return;
        }
  
        if (Array.isArray(customers_late)) {
          // Add new customers_late to the existing event.customers_late array
          event.customers_late.push(...customers_late);
  
          // Remove duplicates by converting to Set and back to Array
          event.customers_late = Array.from(new Set(event.customers_late));
        } else {
          reject(new Error('Invalid customers data'));
          return;
        }
  
        // Save changes
        events = clonedEvents;
  
        resolve(deepCopy(event));
      } catch (err) {
        console.error('[Calendar Api]: ', err);
        reject(new Error('Internal server error'));
      }
    });
  }


  removeCustomersFromEvent(request) {
    const { eventId, customers } = request;
    return new Promise((resolve, reject) => {
      try {
        // Make a deep copy
        const clonedEvents = deepCopy(events);
  
        // Find the event that will be updated
        const event = clonedEvents.find((_event) => _event.id === eventId);
  
        if (!event) {
          reject(new Error('Event not found'));
          return;
        }
  
        if (Array.isArray(customers)) {
          // Remove customers specified in request.customers from event.customers
          event.customers = event.customers.filter(
            (customer) => !customers.includes(customer)
          );
        } else {
          reject(new Error('Invalid customers data'));
          return;
        }
  
        // Save changes
        events = clonedEvents;
  
        resolve(deepCopy(event));
      } catch (err) {
        console.error('[Calendar Api]: ', err);
        reject(new Error('Internal server error'));
      }
    });
  }
}

export const calendarApi = new CalendarApi();
