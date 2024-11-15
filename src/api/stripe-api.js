import axios from 'axios';
import { clientApi } from './client-api';
import { subscriptionApi } from './subscription-api';
import { gymApi } from './gym-api';
const url = "https://api.stripe.com/v1/";

function stringify(data) {
    return Object.keys(data)
      .map(key => {
        if (typeof data[key] === 'object') {
          // Si el valor es un objeto, iteramos sobre sus claves y valores
          return Object.keys(data[key])
            .map(subKey => {
              return encodeURIComponent(`${key}[${subKey}]`) + '=' + encodeURIComponent(data[key][subKey]);
            })
            .join('&');
        } else {
          // Si el valor no es un objeto, lo codificamos y lo concatenamos con su clave
          return encodeURIComponent(key) + '=' + encodeURIComponent(data[key]);
        }
      })
      .join('&');
  }
  
class StripeApi {
  async createCustomer(id,client){
    
  const STRIPE_SECRET_API_KEY = await gymApi.getGymApiKey(1)
    let data = {
      name: client.first_name+" "+client.last_name,
      email: client.email
    }
    console.log(id)
    try {
      const response = await axios.post(`${url}customers`, 
      stringify(data),
      {
          headers: { 
              Authorization: `Bearer ${STRIPE_SECRET_API_KEY}`,
              'Content-Type': 'application/x-www-form-urlencoded'
          },
      }, );
      client['stripe_customer_id']=response.data.id;
      let client_id = client.id;
      delete client.id;
      clientApi.updateClient(client_id,client)
      
  } catch (e){
    console.log(e)
    throw new Error(e.response.data.detail);
  }
  }

  async createPaymentMethod(stripe_customer_id,data) {
    
    const STRIPE_SECRET_API_KEY = await gymApi.getGymApiKey(1)
    try {
        const response = await axios.post(`${url}payment_methods`, 
        stringify(data),
        {
            headers: { 
                Authorization: `Bearer ${STRIPE_SECRET_API_KEY}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
        }, );
        console.log(response.data);
        if(response.error) return response.error;
        try {
            let data2={
                customer: stripe_customer_id
            }
            const response2 = await axios.post(`${url}payment_methods/${response.data.id}/attach`, 
            stringify(data2),
            {
                headers: { 
                    Authorization: `Bearer ${STRIPE_SECRET_API_KEY}`,
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
            }, );
            console.log(response2.data);
            
            
        } catch (e){
          console.log(e)
          throw new Error(e.response.data.detail);
        }
        
    } catch (e){
      console.log(e)
      throw new Error(e.response.data.detail);
    }
  }
  async getPaymentMethods(stripe_customer_id){
    const STRIPE_SECRET_API_KEY = await gymApi.getGymApiKey(1)
    try {
        const response = await axios.get(`${url}customers/${stripe_customer_id}/payment_methods`, 
        
        {
            headers: { 
                Authorization: `Bearer ${STRIPE_SECRET_API_KEY}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
        }, );
        return response.data;
    } catch (e){
      console.log(e)
      throw new Error(e.response.data.detail);
    }
  }
  async deletePaymentMethod(id){
    const STRIPE_SECRET_API_KEY = await gymApi.getGymApiKey(1)
    try {
        const response = await axios.post(`${url}payment_methods/${id}/detach`, {},
         {
            headers: { 
                Authorization: `Bearer ${STRIPE_SECRET_API_KEY}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
        }, );
        console.log(response.data);
        
        
    } catch (e){
      console.log(e)
      throw new Error(e.response.data.detail);
    }
    
  }

  async createPayment(data) {
    const STRIPE_SECRET_API_KEY = await gymApi.getGymApiKey(1)
    try {
        const response = await axios.post(`${url}payment_intents`, 
        stringify(data),
        {
            headers: { 
                Authorization: `Bearer ${STRIPE_SECRET_API_KEY}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
        }, );
        //console.log(response.data)
        return response.data
        
    } catch (e){
      console.log(e)
      throw new Error(e.response.data.detail);
    }
  }

  async createSubscription(data,pm,fecha_valid){
    const STRIPE_SECRET_API_KEY = await gymApi.getGymApiKey(1)
    let f = new Date(fecha_valid)> new Date()? new Date(fecha_valid): new Date()
    let dataStripe = {
      customer: data.stripe_customer_id,
      'items[0][price]': data.price_id,
      default_payment_method: pm.id,
      "trial_end": Math.floor(f.getTime() / 1000)
    }
    try {
      const response = await axios.post(`${url}subscriptions`, 
      stringify(dataStripe),
      {
          headers: { 
              Authorization: `Bearer ${STRIPE_SECRET_API_KEY}`,
              'Content-Type': 'application/x-www-form-urlencoded'
          },
      }, );
      console.log(response.data)
      const response2 = await subscriptionApi.createSubscriptionCustomer({buyer:data.client,subscription_id:data.id,fecha:fecha_valid,sub_id_stripe:response.data.id})
      console.log(response2)
      response.data.sc = response2.id;
      return response.data
      
    } catch (e){
    console.log(e)
    throw new Error(e.response.data.detail);
    }
  }

  async deleteSubscription(id){
    const STRIPE_SECRET_API_KEY = await gymApi.getGymApiKey(1)
    try {
      const response = await axios.delete(`${url}subscriptions/${id}`,
       {
          headers: { 
              Authorization: `Bearer ${STRIPE_SECRET_API_KEY}`,
              'Content-Type': 'application/x-www-form-urlencoded'
          },
      }, );
      console.log(response.data);
      return response.data;
      
  } catch (e){
    return 'ok';
  }
  }

  async createProduct(name,price){
    const STRIPE_SECRET_API_KEY = await gymApi.getGymApiKey(1)
    try {
        let data = {
          unit_amount: price*100,// price,
          currency: 'usd',
          recurring:{
            interval: 'month'
          },
          product_data:{
            name: name
          }
        }
        const response = await axios.post(`${url}prices`, 
        stringify(data),
        {
            headers: { 
                Authorization: `Bearer ${STRIPE_SECRET_API_KEY}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
        }, );
        let id_producto = response.data.product;
        let id_price = response.data.id;
        return id_price;

      }catch(e){
        console.log(e)
        throw new Error(e.response.detail)
      }
      
  }
  async freezeSubscription(subscription){
    const STRIPE_SECRET_API_KEY = await gymApi.getGymApiKey(1)
    try {
      const response = await axios.delete(`${url}subscriptions/${subscription.sub_id_stripe}`,
       {
          headers: { 
              Authorization: `Bearer ${STRIPE_SECRET_API_KEY}`,
              'Content-Type': 'application/x-www-form-urlencoded'
          },
      }, );
      if(response.data){
        await subscriptionApi.updateSubscriptionCustomer(subscription.id,{status:2,buyer:subscription.buyer,valid_from:new Date(),subscription:subscription.subscription})
      }
      return response.data;
      
  } catch (e){
    return 'ok';
  }
  }
  async reactivateSubscription(data,pm,stripe_customer_id,price_id){
    const STRIPE_SECRET_API_KEY = await gymApi.getGymApiKey(1)
    let f = new Date(Date.now() + 24 * 60 * 60 * 1000)
    let dataStripe = {
      customer: stripe_customer_id,
      'items[0][price]': price_id,
      "default_payment_method": pm,
      "trial_end": Math.floor(f.getTime() / 1000)
    }
    try {
      const response = await axios.post(`${url}subscriptions`, 
      stringify(dataStripe),
      {
          headers: { 
              Authorization: `Bearer ${STRIPE_SECRET_API_KEY}`,
              'Content-Type': 'application/x-www-form-urlencoded'
          },
      }, );
      const sub_id_stripe = response.data.id
      const response2 = await subscriptionApi.updateSubscriptionCustomer(data.id,{status:1,valid_from:data.valid_from,subscription:data.subscription,sub_id_stripe:sub_id_stripe,buyer:1})
      console.log(response2)
      return response2
      
    } catch (e){
    console.log(e)
    throw new Error(e.response.data.detail);
    }
  }

}

export const stripeApi = new StripeApi();