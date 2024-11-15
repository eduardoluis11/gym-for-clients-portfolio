import { subDays, subHours, subMinutes, subSeconds } from 'date-fns';

const now = new Date();

const DUMMY_ROOMS =  [
  {
    id: '5e887ac47aed253051be10cx',
    name: 'Sala Pequeña',
  },
  {
    id: '5e887ac47eed253091be10cb',
    name: 'Sala Grande',
  },
  {
    id: '5e333ac47eed253091be10cb',
    name: 'Piscina',
  },
];

class RoomApi {

  getRooms(request) {
    const rooms = DUMMY_ROOMS

    return Promise.resolve(rooms);
  }

  getRoom(id) {
    const selectedRoom = DUMMY_ROOMS.find((room) => room.id === id)

    return Promise.resolve(selectedRoom);
  }

}

export const roomApi = new RoomApi();
