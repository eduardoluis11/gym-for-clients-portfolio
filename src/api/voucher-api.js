import axios from 'axios';

class VoucherApi {

  async getVouchers(request) {
    try {
      const accessToken = localStorage.getItem('accessToken')
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_ROOT}/api/1/vouchers/`, 
      {
        headers: 
        { Authorization: `JWT ${accessToken}`},
              }, );

    const vouchers = response.data;
    return vouchers
    } catch (e){
      console.log(e)
      throw new Error(e.response.data.detail);
    }
  }
  async getVoucher(id) {
    try {
      const accessToken = localStorage.getItem('accessToken')
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_ROOT}/api/1/vouchers/${id}`, 
      {
        headers: 
        { Authorization: `JWT ${accessToken}`},
              }, );
    const voucher = response.data;
    return voucher
    } catch (e){
      console.log(e)
      throw new Error(e.response.data.detail);
    }
  }
  async updateVoucher(id, voucherData) {
    try {
      const accessToken = localStorage.getItem('accessToken')
      const response = await axios.put(`${process.env.NEXT_PUBLIC_API_ROOT}/api/1/vouchers/${id}`, 
      voucherData, 
      {
        headers: 
        { Authorization: `JWT ${accessToken}`},
              }, );
    const voucher = response.data;
    return voucher
    } catch (e){
      console.log(e)
      throw new Error(e.response.data.detail);
    }
  }
  async createVoucher(voucherData) {
    try {
      const accessToken = localStorage.getItem('accessToken')
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_ROOT}/api/1/vouchers/`, 
      voucherData, 
      {
        headers: 
        { Authorization: `JWT ${accessToken}`},
              }, );
    const voucher = response.data;
    return voucher
    } catch (e){
      console.log(e)
      throw new Error(e.response.data.detail);
    }
  }
  async deleteVoucher(id) {
    try {
      const accessToken = localStorage.getItem('accessToken')
      const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_ROOT}/api/1/vouchers/${id}`, 
      {
        headers: 
        { Authorization: `JWT ${accessToken}`},
              }, );
    const voucher = response.data;
    return voucher
    } catch (e){
      console.log(e)
      throw new Error(e.response.data.detail);
    }
  }
  async updateVoucherSale(id, voucherData) {
    try {
      const accessToken = localStorage.getItem('accessToken')
      const response = await axios.put(`${process.env.NEXT_PUBLIC_API_ROOT}/api/1/vouchersale/${id}`, 
      voucherData, 
      {
        headers: 
        { Authorization: `JWT ${accessToken}`},
              }, );
    const voucher = response.data;
    return voucher
    } catch (e){
      console.log(e)
      throw new Error(e.response.data.detail);
    }
  }

}

export const voucherApi = new VoucherApi();