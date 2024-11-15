import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  events: []
};

export const slice = createSlice({
  name: 'calendar',
  initialState,
  reducers: {
    getEvents(state, action) {
      state.events = action.payload;
    },
    getCustomerEvents(state, action) {
      state.events = action.payload;
    },

    getEvent(state, action) {
      const { eventId } = action.payload;
      const foundEvent = state.events.find(event => event.id === eventId);

      if (foundEvent) {
        state.events = [foundEvent];
      } else {
        state.events = [];
      }
    },

    createEvent(state, action) {
      state.events.push(action.payload);
    },

    updateEvent(state, action) {
      const event = action.payload;

      state.events = state.events.map((_event) => {
        if (_event.id === event.id) {
          return event;
        }

        return _event;
      });
    },

    deleteEvent(state, action) {
      state.events = state.events.filter((event) => event.id !== action.payload);
    },

    createRecurrentEvent(state, action) {
      state.events.push(action.payload);
    },

    updateRecurrentEvent(state, action) {
      const events = action.payload;
      for (let e of events) {

      state.events = state.events.map((_event) => {
        if (_event.id === e.id) {
          return e;
        }

        return _event;
      });
      }
    },

    deleteRecurrentEvent(state, action) {
      const events = action.payload;
      for (let e of events) {
      state.events = state.events.filter((event) => event.id !== action.payload);
      }
    },
  }
});

export const { reducer } = slice;