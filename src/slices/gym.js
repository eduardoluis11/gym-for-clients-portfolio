import { createSlice } from '@reduxjs/toolkit';
import { trainerApi } from '../api/trainer-api';
import { activityApi } from '../api/activity-api';
import {roomApi} from '../api/room-api'
import { stripeApi } from '../api/stripe-api';

const initialState = {
  trainers: [
    {
    name: 'Eduardo Fox',
    id: 666, 
    }
  ],
  activities: [
    {
    name: "Natación",
    id: 123, 
    }
  ],
  rooms: [
  ],
  room: null,
  payment_methods:[]
};

/* Creo que esto
*
* */
const slice = createSlice({
  name: 'gym',
  initialState,
  reducers: {
    setTrainers(state, action) {
        state.trainers = action.payload
    },
    setActivities(state, action) {
        state.activities = action.payload
    },
    setRooms(state,action) {
        state.rooms = action.payload
    },
    setRoom(state,action) {
        state.room = action.payload
    },
    setPaymentMethods(state,action){
      state.payment_methods = action.payload
    }
  }
});

export const { reducer } = slice;

export default slice;

export const getTrainers = () => async (dispatch) => {
    // Here make an async request to your sever and extract the data from the server response
    // const response = await axios.get('/__fake-api__/blog/articles');
    // const { data } = reponse;
    const data = await trainerApi.getTrainers()
    dispatch(slice.actions.setTrainers(data));
  };
export const getActivitys = () => async (dispatch) => {
    // Here make an async request to your sever and extract the data from the server response
    // const response = await axios.get('/__fake-api__/blog/articles');
    // const { data } = reponse;
    const data = await activityApi.getActivities()
    dispatch(slice.actions.setActivities(data));
  };
export const getRooms = () => async (dispatch) => {

    const data = await roomApi.getRooms()
    dispatch(slice.actions.setRooms(data));
  };
export const getRoom = (id) => async (dispatch) => {

    const data = await roomApi.getRoom(id)
    dispatch(slice.actions.setRoom(data));
  };
export const updateRoom = (roomData) => async (dispatch) => {
    console.log(roomData)
    // const data = await roomApi.updateRoom(roomData)
    // dispatch(slice.actions.setRoom(data));
  };
  export const getPaymentMethods = (id) => async (dispatch) => {
    // Here make an async request to your sever and extract the data from the server response
    // const response = await axios.get('/__fake-api__/blog/articles');
    // const { data } = reponse;
    const data = await stripeApi.getPaymentMethods(id)
    dispatch(slice.actions.setPaymentMethods(data.data));
  };
