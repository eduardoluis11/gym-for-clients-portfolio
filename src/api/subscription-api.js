import axios from 'axios';
import { stripeApi } from './stripe-api';
import { saleApi } from './sale-api';
import { historyApi } from './history-api';
import { accountApi } from './account-api';
import { clientApi } from './client-api';

class SubscriptionApi {

  async getSubscriptions(request) {
    try {
      const accessToken = localStorage.getItem('accessToken')
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_ROOT}/api/1/subscriptions/`,
      {
        headers:
        { Authorization: `JWT ${accessToken}`},
              }, );

    const subscriptions = response.data;
    return subscriptions
    } catch (e){
      console.log(e)
      throw new Error(e.response.data.detail);
    }
  }
  async getSubscription(id) {
    try {
      const accessToken = localStorage.getItem('accessToken')
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_ROOT}/api/1/subscriptions/${id}`,
      {
        headers:
        { Authorization: `JWT ${accessToken}`},
              }, );
    const subscription = response.data;
    return subscription
    } catch (e){
      console.log(e)
      throw new Error(e.response.data.detail);
    }
  }
  async getSubscriptionBySc(id) {
    try {
      const accessToken = localStorage.getItem('accessToken')
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_ROOT}/api/1/subscriptionscustomer/${id}`,
      {
        headers:
        { Authorization: `JWT ${accessToken}`},
              }, );
    const subscription = response.data;
    return subscription
    } catch (e){
      console.log(e)
      throw new Error(e.response.data.detail);
    }
  }
  async updateSubscription(id, subscriptionData) {
    try {
      const accessToken = localStorage.getItem('accessToken')
      const response = await axios.put(`${process.env.NEXT_PUBLIC_API_ROOT}/api/1/subscriptions/${id}`,
      subscriptionData,
      {
        headers:
        { Authorization: `JWT ${accessToken}`},
              }, );
    const subscription = response.data;
    return subscription

    /*try{
      const response2 = stripeApi.updateProduct(subscriptionData.price,subscriptionData.name, subscriptionData.price)
      console.log(response2)

    }catch(e){
      console.log(e)
      throw new Error(e.response.data.detail);
    }*/

    } catch (e){
      console.log(e)
      throw new Error(e.response.data.detail);
    }
  }
  async createSubscription(subscriptionData) {
    try {
      const accessToken = localStorage.getItem('accessToken')
      const price_id = await stripeApi.createProduct(subscriptionData.name,subscriptionData.price)
      subscriptionData.price_id_stripe = price_id;
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_ROOT}/api/1/subscriptions/`,
      subscriptionData,
      {
        headers:
        { Authorization: `JWT ${accessToken}`},
              }, );
    const subscription = response.data;
    return subscription

  } catch (e){
      console.log(e)
      throw new Error(e.response.data.detail);
    }
  }


  async deleteSubscription(id) {
    try {
      const accessToken = localStorage.getItem('accessToken')
      const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_ROOT}/api/1/subscriptions/${id}`,
      {
        headers:
        { Authorization: `JWT ${accessToken}`},
              }, );
    const subscription = response.data;
    return subscription
    } catch (e){
      console.log(e)
      throw new Error(e.response.data.detail);
    }
  }

  /* Función que renderiza las suscripciones de un cliente seleccionado en la página de Editar a un Cliente.
  *
  *
  * BUGFIX: Pycharm me estaba indicando que había un error aquí, y que lo corrigiera usando un "for of" en lugar de un
  * "forEach", y, cuando hice esa corrección, ahora, a penas entro en la página de editar a un cliente, ya me aparece
  * correctamente la lista de suscripciones del cliente seleccionado. Ya no tengo que hacer un "on change", es decir,
  * ya no tengo que hacer ninguna edición en el Formulario de Editar a un Cliente para que se me renderice la
  * lista de suscripciones del cliente seleccionado.
  * */
  async getSubscriptionsCustomer(customer_id){
    try {
      const accessToken = localStorage.getItem('accessToken')
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_ROOT}/api/1/${customer_id}/subscriptions/`,
      {
        headers:
        { Authorization: `JWT ${accessToken}`},
              }, );
    const subs = response.data;
    let subscriptions = [];
    for (const s of subs) {
      //console.log(s)
      const r = await axios.get(`${process.env.NEXT_PUBLIC_API_ROOT}/api/1/subscriptions/${s.subscription}`,
      {
        headers:
        { Authorization: `JWT ${accessToken}`},
              }, );
      s.subscription=r.data;
      subscriptions.push(s)
    }

      return subscriptions
    } catch (e){
      console.log(e)
      throw new Error(e.response.data.detail);
    }

  }

  /*async getSubscriptionCustomer(id){
    try {
      const accessToken = localStorage.getItem('accessToken')
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_ROOT}/api/1/${customer_id}/subscriptions/`,
      {
        headers:
        { Authorization: `JWT ${accessToken}`},
              }, );
    const subs = response.data;
    let subscriptions = [];
    subs.forEach(async function(s){
      const r = await axios.get(`${process.env.NEXT_PUBLIC_API_ROOT}/api/1/subscriptions/${s.id}`,
      {
        headers:
        { Authorization: `JWT ${accessToken}`},
              }, );
      s.subscription=r.data;
      subscriptions.push(s)
    });

    return subscriptions
    } catch (e){
      console.log(e)
      throw new Error(e.response.data.detail);
    }

  }*/

  async createSubscriptionCustomer(data){
    try {
      let subCusData={
        buyer: data.buyer.id,
        subscription:data.subscription_id,
        valid_from:data.fecha,
        sub_id_stripe: data.sub_id_stripe

      }
      const accessToken = localStorage.getItem('accessToken')
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_ROOT}/api/1/${data.buyer.id}/subscriptions/`,
      subCusData,
      {
        headers:
        { Authorization: `JWT ${accessToken}`},
              }, );
      const subscription = response.data;
      const h = await historyApi.createHistory({account:data.buyer.id,current_status:1})
      console.log(h)
      return subscription

  } catch (e){
      console.log(e)
      throw new Error(e.response.data.detail);
    }
  }

  async updateSubscriptionCustomer(id, subscriptionData) {
    try {
      const accessToken = localStorage.getItem('accessToken')
      const response = await axios.put(`${process.env.NEXT_PUBLIC_API_ROOT}/api/1/${subscriptionData.buyer}/subscriptions/${id}`,
      subscriptionData,
      {
        headers:
        { Authorization: `JWT ${accessToken}`},
              }, );

      const usuario = await clientApi.getClient(subscriptionData.buyer)
      if(usuario.subscription_status==subscriptionData.status){
        const h = await historyApi.createHistory({account:subscriptionData.buyer,current_status:subscriptionData.status})
      }
    return response.data
    } catch (e){
      console.log(e)
      throw new Error(e.response.data.detail);
    }
  }

  async deleteSubscriptionCustomer(sub) {

      const accessToken = localStorage.getItem('accessToken')
      const response = await axios.put(`${process.env.NEXT_PUBLIC_API_ROOT}/api/1/${sub.buyer}/subscriptions/${sub.id}`,
      {
        buyer:sub.buyer,
        valid_from: sub.valid_from,
        sub_id_stripe: sub.sub_id_stripe,
        subscription: sub.subscription.id,
        status:0
      },
      {
        headers:
        { Authorization: `JWT ${accessToken}`},
              }, );
    const subscription = response.data;
    const usuario = await clientApi.getClient(sub.buyer)
    // HACER SOLO SI NO TIENE OTRAS ACTIVAS A LA ACTUALIZACIÓN DEL HISTORIAL
    if(usuario.subscription_status==0){
      const h = await historyApi.createHistory({account:sub.buyer,current_status:0})
      console.log(h)
    }
    await stripeApi.deleteSubscription(sub.sub_id_stripe)
    return subscription

  }
}

export const subscriptionApi = new SubscriptionApi();