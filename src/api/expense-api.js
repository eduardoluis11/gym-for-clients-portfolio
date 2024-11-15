import axios from 'axios';
import { accountApi } from './account-api';


class ExpenseApi {

  async getExpenses(request) {
    try {
      const accessToken = localStorage.getItem('accessToken')
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_ROOT}/api/1/expenses/`, 
      {
        headers: 
        { Authorization: `JWT ${accessToken}`},
              }, );

    const expenses = response.data;
    return expenses
    } catch (e){
      console.log(e)
      throw new Error(e.response.data.detail);
    }
  }
async getExpense(id) {
    try {
      const accessToken = localStorage.getItem('accessToken')
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_ROOT}/api/1/expenses/${id}`, 
      {
        headers: 
        { Authorization: `JWT ${accessToken}`},
              }, );
    const expense = response.data;
    return expense
    } catch (e){
      console.log(e)
      throw new Error(e.response.data.detail);
    }
  }
  async updateExpense(id, expenseData) {
    try {
      const accessToken = localStorage.getItem('accessToken')
      const response = await axios.put(`${process.env.NEXT_PUBLIC_API_ROOT}/api/1/expenses/${id}`, 
      expenseData, 
      {
        headers: 
        { Authorization: `JWT ${accessToken}`},
              }, );
    const expense = response.data;
    return expense
    } catch (e){
      console.log(e)
      throw new Error(e.response.data.detail);
    }
  }
  async createExpense(expenseData) {
    let email = localStorage.getItem('user_email')
    let logged_user = await accountApi.getAccountByUsername(email)
    if(email && logged_user) expenseData.user = logged_user.id
    else expenseData.user = 1
    try {
      const accessToken = localStorage.getItem('accessToken')
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_ROOT}/api/1/expenses/`, 
      expenseData, 
      {
        headers: 
        { Authorization: `JWT ${accessToken}`},
              }, );
    const expense = response.data;
    return expense
    } catch (e){
      console.log(e)
      throw new Error(e.response.data.detail);
    }
  }
  async deleteExpense(id) {
    try {
      const accessToken = localStorage.getItem('accessToken')
      const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_ROOT}/api/1/expenses/${id}`, 
      {
        headers: 
        { Authorization: `JWT ${accessToken}`},
              }, );
    const expense = response.data;
    return expense
    } catch (e){
      console.log(e)
      throw new Error(e.response.data.detail);
    }
  }

}

export const expenseApi = new ExpenseApi();
