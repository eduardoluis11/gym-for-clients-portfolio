// import { calendarApi } from '../__fake-api__/customercalendar-api';
import { calendarApi } from '../api/calendar-api';
import { slice } from '../slices/calendar';

export const getEvents = () => async (dispatch) => {
  const response = await calendarApi.getEvents();

  dispatch(slice.actions.getEvents(response));
};
export const getCustomerEvents = () => async (dispatch) => {
  const response = await calendarApi.getCustomerEvents();

  dispatch(slice.actions.getCustomerEvents(response));
};

export const createEvent = (params) => async (dispatch) => {
  const response = await calendarApi.createEvent(params);

  dispatch(slice.actions.createEvent(response));
};
export const createRecurrentEvent = (params) => async (dispatch) => {
  const response = await calendarApi.createRecurrentEvent(params);

  dispatch(slice.actions.createRecurrentEvent(response));
};
export const updateRecurrentEvent = (params) => async (dispatch) => {
  const response = await calendarApi.updateRecurrentEvent(params);

  dispatch(slice.actions.updateRecurrentEvent(response));
};
export const deleteRecurrentEvent = (params) => async (dispatch) => {
  const response = await calendarApi.deleteRecurrentEvent(params);

  dispatch(slice.actions.deleteRecurrentEvent(response));
};

export const updateEvent = (params) => async (dispatch) => {
  const response = await calendarApi.updateEvent(params);

  dispatch(slice.actions.updateEvent(response));
};
export const getEvent = (params) => async (dispatch) => {
  const response = await calendarApi.getEvent(params);

  dispatch(slice.actions.getEvent(response));
};

export const deleteEvent = (params) => async (dispatch) => {
  await calendarApi.deleteEvent(params);

  dispatch(slice.actions.deleteEvent(params.eventId));
};