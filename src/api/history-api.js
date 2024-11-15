import axios from 'axios';


class HistoryApi {

  async getHistorial(request) {
    try {
      const accessToken = localStorage.getItem('accessToken')
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_ROOT}/api/1/history/`, 
      {
        headers: 
        { Authorization: `JWT ${accessToken}`},
              }, );

    const data = response.data;    
    return data
    } catch (e){
      console.log(e)
      throw new Error(e.response.data.detail);
    }
  }
  async getHistory(id) {
    try {
      const accessToken = localStorage.getItem('accessToken')
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_ROOT}/api/1/history/${id}`, 
      {
        headers: 
        { Authorization: `JWT ${accessToken}`},
              }, );
    const history = response.data;
    return history
    } catch (e){
      console.log(e)
      throw new Error(e.response.data.detail);
    }
  }
  async updateHistory(id, historyData) {
    try {
      const accessToken = localStorage.getItem('accessToken')
      const response = await axios.put(`${process.env.NEXT_PUBLIC_API_ROOT}/api/1/history/${id}`, 
      historyData, 
      {
        headers: 
        { Authorization: `JWT ${accessToken}`},
              }, );
    const history = response.data;
    return history
    } catch (e){
      console.log(e)
      throw new Error(e.response.data.detail);
    }
  }
  async createHistory(historyData) {
    try {
      const old = await this.getLastHistory(historyData.account)
      if(old.current_status==null || old.current_status!=historyData.current_status){

      
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_ROOT}/api/1/history/`, 
        {account:historyData.account,current_status:historyData.current_status,old_status:old.current_status}, 
        {}, );
        const history = response.data;
        return history
        }
        return {}
    } catch (e){
      console.log(e)
      throw new Error(e.response.data.detail);
    }
  }
  async deleteHistory(id) {
    try {
      const accessToken = localStorage.getItem('accessToken')
      const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_ROOT}/api/1/history/${id}`, 
      {
        headers: 
        { Authorization: `JWT ${accessToken}`},
              }, );
    const history = response.data;
    return history
    } catch (e){
      console.log(e)
      throw new Error(e.response.data.detail);
    }
  }
  async getLastHistory(user_id){
    try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_ROOT}/api/1/${user_id}/history/`, 
        {}, );
        if(response.data.length){
            return response.data[0]
        }
        return {current_status:null}
      
      } catch (e){
        console.log(e)
        throw new Error(e.response.data.detail);
      }
  }
  async getUserStatus(user_id){
    try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_ROOT}/api/1/${user_id}/history/`, 
        {}, );
        if(response.data.length){
            let last = response.data[0]
            if(last.current_status==0) return 0 // baja
            if(last.current_status==1){
              for(let i=1; i<response.data.length;i++){
                let h = response.data[i]
                if(new Date(h.date) >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) && h.old_status==1 && h.current_status==0){
                  return 3 //alta
                }
              }
              return 1 // activo
            }

        }
        return -1 // informado
      
      } catch (e){
        console.log(e)
        throw new Error(e.response.data.detail);
      }
  }
  async getCuentasMesPasado(){
    try {
      const accessToken = localStorage.getItem('accessToken')
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_ROOT}/api/1/cuentas_mes_pasado/`, 
      {
        headers: 
        { Authorization: `JWT ${accessToken}`},
              }, );

    const data = response.data;    
    return data
    } catch (e){
      console.log(e)
      throw new Error(e.response.data.detail);
    }
  }
}

export const historyApi = new HistoryApi();
