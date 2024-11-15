import { subDays, subHours, subMinutes, subSeconds } from 'date-fns';

const now = new Date();

const DUMMY_VOUCHERS =  [
  {
    id: '3d887ac47aed253051be10cx',
    buyer: 'Eduardo',
    price: 100,
    valid_from: new Date('2022-01-11'),
    activities: [{name: 'Natación',
                id: "5e887ac47eed253091be10cb", },
                {name: 'Clases Abdominales',
                id: "5e887b209c28ac3dd97f6db5", },
                {name: 'Clase de aeróbica',
                id: "5e887b7602bdbc4dbb234b27", },
              ],
    groups: [],
    valid_for: 90,
    available_sessions: 50,
    is_active: true,
    days_left: 89,
    expire_on: '03/02/2023',
  },
  {
    id: '3z137ac47aed253051be10cx',
    buyer: 'Juan',
    price: 200,
    valid_from: new Date('2022-02-01'),
    activities: [{name: 'Natación',
                id: "5e887ac47eed253091be10cb", },
              ],
    groups: [],
    valid_for: 30,
    available_sessions: 50,
    is_active: false,
    days_left: 0,
    expire_on: '01/03/2022',
  },
];

const DUMMY_VOUCHERS_GENERAL =  [
  {
    id: 1,
    name:'test bono 1',
    price:300
  },
  {
    id: 2,
    name:'test bono 2',
    price:200
  }
];

class VoucherApi {

  getVouchers(request) {
    const vouchers = DUMMY_VOUCHERS

    return Promise.resolve(vouchers);
  }

  getVoucher(id) {
    const selectedVoucher = DUMMY_VOUCHERS.find((voucher) => voucher.id === id)

    return Promise.resolve(selectedVoucher);
  }
  getVouchersAll(request){
 const vouchers = DUMMY_VOUCHERS_GENERAL

    return Promise.resolve(vouchers);
  }
}

export const voucherApi = new VoucherApi();
