import { useCallback, useEffect, useState } from 'react';
import {useRouter} from 'next/router'
import NextLink from 'next/link';
import Head from 'next/head';
import { Avatar, Box, Button, Chip, Container, Link, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { DashboardLayout } from '../../../components/dashboard/dashboard-layout';
import { useMounted } from '../../../hooks/use-mounted';
import { gtm } from '../../../lib/gtm';
import { getInitials } from '../../../utils/get-initials';
import { AuthGuard } from '../../../components/authentication/auth-guard';

// Formulario de Formik para editar los datos del Cliente logueado.
import { ClientProfile } from '../../../components/client/client-profile';

// API para coger los datos del Cliente del modelo de Account de la web app de Django
import { clientApi } from '../../../api/client-api';

import { ClientCobrar } from '../../../components/client/client-cobrar';
import { stripeApi } from '../../../api/stripe-api';

// Necesitaré estas bibliotecas para poder coger los datos del Cliente Logueado
import jwtDecode from 'jwt-decode';
import axios from 'axios';

/* Página para Editar los Datos del Cliente Logueado, y para poder comprar los distintos servicios del Gimnasio al
* ir a la URL de "/user/edit".
*
* Aquí puedes editar los datos del Usuario logueado desde un Formulario, y puedes comprar los distintos servicios que
* ofrece el Gimnasio al hacer clic en un botón.
*
* */

/* Props de esta página (se llama "Clients").
*
* Aquí voy a crear la variable que va a contener los datos del usuario logueado, los cuales voy a obtener del JWT Token.
*
* Problem 1: Fetching user data on the client-side.  The issue you're encountering is related to fetching user data on
* the client-side. The getServerSideProps function is a Next.js feature that runs on the server-side. However, you're
* trying to fetch user data on the client-side using the useEffect hook. This is why you're encountering an error.
*
* Solution: Fetch user data in the useEffect hook.  To fix this, you can use the useEffect hook to fetch user data on
* the client-side. You can use the axios library to send a GET request to your API endpoint and fetch the user data.
* You can then set this data to your user state variable.
*
* The useEffect hook is used to fetch user data on the client-side. The axios library is used to send a GET request to
* your API endpoint. The user data is then set to the user state variable. This ensures that the user data is fetched on
*  the client-side and can be used in your component.
*
* You can replace the existing useEffect and getClient function in your Client component with the new useEffect
* function. In this updated code, the useEffect hook is used to fetch user data on the client-side when the component
* mounts. The axios library is used to send a GET request to your API endpoint. The user data is then set to the client
* state variable. This ensures that the user data is fetched on the client-side and can be used in your component.
*
* The useEffect hook first fetches the user ID from the auth/users/me API. It then uses this ID to fetch the complete
* user data from the getClientApi component. The complete user data is then set to the client state variable. This
* ensures that the complete user data is fetched on the client-side and can be used in your component.
*
* El género, al igual que el nombre y el apellido del usuario, están como “undefined”. Quiero ver exactamente que datos
* se están metiendo correctamente del usuario logueado en el JSON al llamar a la API de “auth/me/”. Cuando haga eso, le
* preguntaré a Copilot porque el “/auth/me” no me está agarrando los datos del usuario. Pero, ahora que lo pienso, lo
* único que necesito de la API de “auth/me” es la ID del usuario. No necesito nada más. Luego, con la ID del usuario
* simple y llanamente usaré otra API (como la de getClientApi) para agarrar la instancia del modelo de Account que tenga
* esa ID. De ahí, SI podre agarrar todos los datos del usuario agarrado.
*
* OJO: esto solo funciona para los clientes (Accounts de tipo “Customer”). Para los empleados (Accounts de tipo
* “Employee”, como “eduardo”), no me va a imprimir nada. Me va a imprimir la página en blanco.
* */
const Client = (props) => {
  const isMounted = useMounted();

  // Variable en donde voy a meter los datos del usuario logueado.
  const [client, setClient] = useState(null);

  // Función useEffect para coger los datos del Cliente Logueado usando el JWT Token.
  useEffect(() => {
    const fetchUserDetails = async () => {
      const accessToken = localStorage.getItem('accessToken');

      // Si se detecta el JWT Token
      if (accessToken) {
        try {

          // API que agarra los datos del Usuario logueado del JWT Token.
          // IDEALMENTE necesito usar un POST request, NO un GET request.
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_ROOT}/auth/users/me/`,
            { headers: { Authorization: `JWT ${accessToken}` } }
          );

          // // JSON con los datos del Usuario logueado.
          // const userData = response.data;

          // JSON con el ID del Usuario logueado obtenido por el JWT Token.
          const userId = response.data.id;

          // // DEBUGGEO: Imprimo el ID del Usuario logueado.
          // console.log('User ID:', userId);

          // Esto agarra todos los datos del Cliente del modelo de Account que tiene la ID del Usuario Logueado.
          const clientData = await clientApi.getClient(userId);

          if (isMounted()) {

            // Meto los todos datos del Cliente del JSON de la llamada de getClient() en la variable "client".
            // setClient(userData);
            setClient(clientData);
          }
        } catch (error) {
          console.error('Error fetching user details:', error);
        }
      }
    };

    fetchUserDetails();
  }, [isMounted]);

  // ... rest of your code ...


  // Este snippet agarraba al Cliente de la ID que estaba hard-coded (que en este caso era "1"). NO LO VOY A USAR.
  // const {userId} = props
  // useEffect(() => {
  //   gtm.push({ event: 'page_view' });
  // }, []);
  //
  //
  // const getClient = useCallback(async () => {
  //   try {
  //     const data = await clientApi.getClient(userId);
  //     // call API to set the requested activity
  //
  //     if (isMounted()) {
  //       setClient(data);
  //     }
  //   } catch (err) {
  //     console.error(err);
  //   }
  // }, [isMounted, userId]);
  //
  // useEffect(() => {
  //     getClient(userId);
  //   },
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // []);
  // Fin del Snippet que agarraba al Cliente de la ID que estaba hard-coded que NO VOY A USAR.

  // Si no hay datos del Cliente, no muestro nada.
  if (!client) {
    return null;
  }


  // Si hay datos del Cliente, muestro el Formulario con los datos del Cliente.
  return (
    <>
      <Head>
        <title>
          Editar Perfil
        </title>
      </Head>
      <Box
        component="main"
        sx={{
          backgroundColor: 'background.default',
          flexGrow: 1,
          py: 8
        }}
      >
        <Container maxWidth="md">
          <Box sx={{ mb: 4 }}>
            <NextLink
              href="/user"
              passHref
            >
              <Link
                color="textPrimary"
                component="a"
                sx={{
                  alignItems: 'center',
                  display: 'flex'
                }}
              >
                <ArrowBackIcon
                  fontSize="small"
                  sx={{ mr: 1 }}
                />
                <Typography variant="subtitle2">
                Inicio
                </Typography>
              </Link>
            </NextLink>
          </Box>
          <Box
            sx={{
              alignItems: 'center',
              display: 'flex',
              overflow: 'hidden'
            }}
          >
            <Box sx={{width:'100%'}}>
              <Typography
                noWrap
                variant="h4"
              >
                {client.username}
              </Typography>
              <ClientCobrar client={client} />
              <Box
                sx={{
                  alignItems: 'center',
                  display: 'flex',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
          }}
              >
                <Typography variant="subtitle2">
                  id:
                </Typography>
                <Chip
                  label={client.id}
                  size="small"
                  sx={{ ml: 1 }}
                />
              </Box>
            </Box>
          </Box>
          <Box mt={3}>
            <ClientProfile client={client}/>
          </Box>
        </Container>
      </Box>
    </>
  );
};

Client.getLayout = (page) => (
  <AuthGuard>
    <DashboardLayout>
      {page}
    </DashboardLayout>
  </AuthGuard>
);

export default Client;

// /* Esto agarra el ID del Cliente de la URL. EDITAR PARA QUE NO LO AGARRE DESDE LA URL POR MOTIVOS DE CIBERSEGURIDAD.
// * QUIERO COGER LOS DATOS DEL USUARIO LOGUADO DESDE EL BACKEND USANDO EL JWT TOKEN, NO DESDE LA URL.
// *
// * Por los momentos, voy a pasar el ID del Usuario de manera Hard-coded. MODIFICAR DESPUES, ya que esto se debe tomar del
// * usuario logueado.
// * */
// export async function getServerSideProps(ctx) {
//   // Extract the JWT token from the request headers
//   const token = ctx.req.headers.authorization.split(' ')[1];
//
//   // Decode the token to get the user ID
//   const decodedToken = jwtDecode(token);
//   const userId = decodedToken.sub;
//
//   // Fetch the user data from your API
//   const response = await axios.get(
//     `${process.env.NEXT_PUBLIC_API_ROOT}/auth/users/${userId}/`,
//     { headers: { Authorization: `JWT ${token}` } }
//   );
//
//   const userData = response.data;
//
//   return {
//     props: {
//       userId: userData.id,
//       // Add other user data as props if needed
//     },
//   };
// }

// export async function getServerSideProps(ctx) {
//   // const { userId } = ctx.query;
//   // const { userId } = 1;
//
//   // Esto pasa el ID de manera Hard-coded. MODIFICAR DESPUES, ya que esto se debe tomar del usuario logueado.
//   const userId = 1;
//   return {
//     props: {
//       userId,
//     },
//   };
// }