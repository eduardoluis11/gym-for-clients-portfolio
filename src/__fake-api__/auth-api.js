import { createResourceId } from '../utils/create-resource-id';
import { decode, JWT_EXPIRES_IN, JWT_SECRET, sign } from '../utils/jwt';
import { wait } from '../utils/wait';
import axios from 'axios';
import { historyApi } from '../api/history-api';

/* Este es el archivo que hace que el usuario pueda loguearse.
*
* El método de Autenticación es a través de JWT, que es un token que se genera cuando el usuario se loguea.
* */

//NEXT-STEPS: Refactorizar para meter en otro fichero qeu no se llame fakeapi
//NEXT-STEPS: Gestionar errores cuando no se encuetra el user o el pwd
const users = [
  {
    id: '5e86809283e28b96d2d38537',
    avatar: '/static/mock-images/avatars/avatar-anika_visser.png',
    email: 'demo@devias.io',
    name: 'Anika Visser',
    password: 'Password123!',
    plan: 'Premium'
  }
];

class AuthApi {

  /* Función que le permite al usuario Iniciar Sesión en su cuenta si inserta las credenciales correctas.
  *
  * You can modify the login method in the auth-api.js file to print the user's name and email to the console after a
  * successful login. This modification fetches the user's details after a successful login and prints the user's name
  * and email to the console. Please note that this will only work if your API returns the user's details when you send
  * a GET request to the /auth/users/me/ endpoint with a valid access token.
  *
  * To address the issue of not being able to log in into both of the React web apps at the same time (one in
  * localhost:3000 and the other in localhost:3001), you should consider the following:
  *
  * 1. **Same Origin Policy & Local Storage:** If you're using local storage to store JWT tokens, remember that local
  * storage is separate for each port. If the second app is trying to access a token that was set by the first app, it
  * won't be able to find it because they're running on different ports. To fix this, you should ensure that each app is
  * using its own local storage to store and retrieve the JWT token.
  *
  * 2. **Shared State or Side Effects:** If there's shared state or side effects between the two apps (for example, if
  * they're both trying to use the same authentication endpoint and there's some sort of rate limiting or session
  * conflict), that could cause issues. To fix this, you should ensure that each app is handling its own state and side
  * effects independently. If they're both using the same authentication endpoint, you might need to implement some sort
  * of mechanism to prevent conflicts, such as using different user agents.
  *
  * Here's a general approach to handle these issues:
  *
  *1. **Separate Local Storage:** Make sure each app uses its own local storage for storing the JWT token. This can be
  *  achieved by using different key names for each app when storing the token in local storage. For example, the first
  * app could use `localStorage.setItem('app1_token', token)` and the second app could use
  * `localStorage.setItem('app2_token', token)`.
  *
  *2. **Handle Shared State:** If the apps are sharing state or causing side effects on each other, you need to isolate
  * them. This could be achieved by using different endpoints for each app if possible, or by implementing a mechanism
  * to prevent conflicts.
  *
  *If the issue persists, it would be helpful to inspect the network requests in the browser's developer tools. This
  * can provide more information about what might be going wrong when the second app tries to log in.
  *
  * Lo que terminé haciendo fue guardar el JWT Token y el email en una cookie con un nombre distinto a la cookie del
  * administrador que guarda el JWT Token y el email del administrador. En este caso, el nombre de la cookie es
  * 'token_app_gimnasio' y 'email_app_gimnasio'.
  *
  * Además, tuve que ir al settings.py de mi web app de Django, y agregar la URL de la segunda web app de React
  * (que, en el caso de un ambiente de desarrollo, es localhost:3001) en la lista de CORS_ALLOWED_ORIGINS para así
  * poder correr ambas web apps de React al mismo tiempo.
  * */
  async login(request) {
    const { email, password } = request;

    await wait(500);

    try {

      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_ROOT}/auth/jwt/create/`, {
        username: email,
        password: password 
      }, {headers: { 'Accept-Language': 'es-ES' }}, );
      const accessToken = response.data.access;

      // Esto coloca el JWT Token y el email en una cookie. DEBE SER DISTINTA A LA COOKIE DEL ADMINISTRADOR.
      localStorage.setItem('token_app_gimnasio', accessToken )
      localStorage.setItem('email_app_gimnasio', email);

      // localStorage.setItem('accessToken', accessToken )
      // localStorage.setItem('user_email', email);


    // Snippet para agarrar e imprimir el nombre y el email del usuario justo después de loguearse.
    // Fetch the user's details.
    // API que me agarra los datos de la Cuenta del usuario logueado. Debería tomar los datos de Account.
    const userResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_ROOT}/auth/users/me/`, {headers: { Authorization: `JWT ${accessToken}`}});
    const user = userResponse.data;

    // // Print the user's name and email to the console. DEBUGGEO. BORRAR DESPUES.
    // console.log(`User Name: ${user.username}`);
    // console.log(`User Email: ${user.email}`);
    //
    // // Esto debería imprimir el ID del Account de la cuenta del usuario logueado
    // console.log(`User Account ID: ${user.id}`);
    // Fin del snippet que me imprime el nombre y el email del usuario

      return {accessToken}
    } catch (e){
      throw new Error(e.response.data.detail);
    }

    return new Promise((resolve, reject) => {
      try {
        // Find the user
        const user = users.find((_user) => _user.email === email);

        if (!user || (user.password !== password)) {
          reject(new Error('Please check your email and password'));
          return;
        }

        // Create the access token
        const accessToken = sign({ userId: user.id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

        resolve({ accessToken });
      } catch (err) {
        console.error('[Auth Api]: ', err);
        reject(new Error('Internal server error'));
      }
    });
  }

  async register(request) {
    const {password, email } = request;

    try {

      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_ROOT}/auth/users/`, {
        username: email,
        password: password,
        email: email

    }, {headers: { 'Accept-Language': 'es-ES' }}, );
    const user = response.data
    
    const h = await historyApi.createHistory({account:user.id,current_status:-1})
    console.log(h)
    return user

    } catch (e){
      throw new Error(e.response.data.detail);
    }

    return new Promise((resolve, reject) => {
      try {
        // Check if a user already exists
        let user = users.find((_user) => _user.email === email);

        if (user) {
          reject(new Error('User already exists'));
          return;
        }

        user = {
          id: createResourceId(),
          avatar: undefined,
          email,
          name,
          password,
          plan: 'Standard'
        };

        users.push(user);

        const accessToken = sign({ userId: user.id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

        resolve({ accessToken });
      } catch (err) {
        console.error('[Auth Api]: ', err);
        reject(new Error('Internal server error'));
      }
    });
  }

  async me(request) {
    const { accessToken } = request;


    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_ROOT}/auth/users/me/`, {headers: { Authorization: `JWT ${accessToken}`}});
    const user = response.data
    return {
      id: user.id,
      avatar: '/static/mock-images/avatars/avatar-anika_visser.png',
      email: user.email,
      name: user.usernname,
      plan: "Premium"
    }

    return new Promise((resolve, reject) => {
      try {
        // Decode access token
        const { userId } = decode(accessToken);

        // Find the user
        const user = users.find((_user) => _user.id === userId);

        if (!user) {
          reject(new Error('Invalid authorization token'));
          return;
        }

        resolve({
          id: user.id,
          avatar: user.avatar,
          email: user.email,
          name: user.name,
          plan: user.plan
        });
      } catch (err) {
        console.error('[Auth Api]: ', err);
        reject(new Error('Internal server error'));
      }
    });
  }
}

export const authApi = new AuthApi();
