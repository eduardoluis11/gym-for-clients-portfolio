import { subDays, subHours, subMinutes, subSeconds } from 'date-fns';

const now = new Date();

const DUMMY_SUBSCRIPTIONS =  [
  {
    id: '5o887ac47aed253051be10cx',
    buyer: 'Hugo',
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
    is_active: true,
    first_rate_defferal: true,
  },
  {
    id: '5o137ac47aed253051be10cx',
    buyer: 'Silvia',
    price: 200,
    valid_from: new Date('2022-02-01'),
    activities: [{name: 'Natación',
                id: "5e887ac47eed253091be10cb", },
              ],
    groups: [],
    is_active: false,
    first_rate_defferal: true,
  },
];

const DUMMY_SUBSCRIPTIONS_GENERAL = [
  {
    id:1,
    name: 'Clases pilates',
    price:200
  },
  {
    id:2,
    name: 'Clases Yoga',
    price:200
  },
]

class SubscriptionApi {

  getSubscriptions(request) {
    const subscriptions = DUMMY_SUBSCRIPTIONS

    return Promise.resolve(subscriptions);
  }
  getSubscriptionsAll(request) {
    const subscriptions = DUMMY_SUBSCRIPTIONS_GENERAL;

    return Promise.resolve(subscriptions);
  }

  getSubscription(id) {
    const selectedSubscription = DUMMY_SUBSCRIPTIONS.find((subscription) => subscription.id === id)

    return Promise.resolve(selectedSubscription);
  }

}

export const subscriptionApi = new SubscriptionApi();
