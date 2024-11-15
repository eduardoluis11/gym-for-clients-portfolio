import axios from 'axios';


class AccountApi {

  async getAccounts(request) {
    try {
      const accessToken = localStorage.getItem('accessToken')
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_ROOT}/api/1/accounts/`, 
      {
        headers: 
        { Authorization: `JWT ${accessToken}`},
              }, );

    const accounts = response.data;
    return accounts
    } catch (e){
      console.log(e)
      throw new Error(e.response.data.detail);
    }
  }
  async getAccountByUsername(emailOrUsername) {
    try {
    const accounts = await this.getAccounts();
    const account = accounts.find(acc => acc.email === emailOrUsername || acc.username === emailOrUsername);
    if (account) {
      return account; 
    } else {
      throw new Error('No se encontró ninguna cuenta con el email proporcionado');
    }
    } catch (e){
      console.log(e)
      throw new Error(e.response.data.detail);
    }
  }
 
 


}

export const accountApi = new AccountApi();
