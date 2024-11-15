import Head from "next/head";
import NextLink from "next/link"; 
import { useCallback, useEffect, useRef, useState } from "react"; 
import {
  Avatar,
  Box,
  Button,
  Card,
  Chip,
  Container,
  Divider,
  Grid,
  InputAdornment,
  Link,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material"; 
import { DashboardLayout } from "../../components/dashboard/dashboard-layout";

import { gtm } from '../../lib/gtm';
import { AuthGuard } from "../../components/authentication/auth-guard";
import { clientApi } from "../../api/client-api";
import { useMounted } from "../../hooks/use-mounted"; 
import { ArrowLeft } from "../../icons/arrow-left";
import { ArrowRight } from "../../icons/arrow-right";
import {useRouter} from 'next/router'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { getInitials } from '../../utils/get-initials';
import { ClientProfile } from '../../components/client/client-profile';
import { ClientCobrar } from '../../components/client/client-cobrar';
import { stripeApi } from '../../api/stripe-api';

// Esto me debería permitir obtener el token JWT del Cliente logueado, para así obtener su ID del modelo de Account
import jwtDecode from 'jwt-decode';

// Esto me deja usar la función useAuth() para obtener el token JWT del Cliente logueado
import {useAuth} from "../../hooks/use-auth";

// Esto me dejará llamar APIs usando Axios.
import axios from 'axios';

/* Esta es la página que se le debería renderizar al Cliente cuando inicia sesión. Es decir, esta es la página para
* los clientes, NO para los administradores.
*
*
* */



const tabs = [
  {
    label: "All",
    value: "all",
  },
];
const sortOptions = [
  {
    label: 'Last update (newest)',
    value: 'updatedAt|desc'
  },
];

const getComparator = (sortDir, sortBy) => (sortDir === 'desc'
  ? (a, b) => descendingComparator(a, b, sortBy)
  : (a, b) => -descendingComparator(a, b, sortBy));


const applySort = (customers, sort) => {
  const [sortBy, sortDir] = sort.split('|');
  const comparator = getComparator(sortDir, sortBy);
  const stabilizedThis = customers.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const newOrder = comparator(a[0], b[0]);

    if (newOrder !== 0) {
      return newOrder;
    }

    return a[1] - b[1];
  });

  return stabilizedThis.map((el) => el[0]);
};

const applyPagination = (customers, page, rowsPerPage) => customers.slice(page * rowsPerPage,
  page * rowsPerPage + rowsPerPage);


/* Componente de User. Aquí se renderiza la página del Cliente logueado.
*
* Quiero imprimir el nombre de usuario del usuario logueado, por lo que tendré que cambiar vaios snippets aquí.
*
* The issue you're encountering is due to the client variable being undefined when you're trying to access
* client.first_name. This happens because the client variable is only defined when user is not null. However, if user
* is null (which means the user data has not been fetched yet), the client variable remains undefined.
*
* Solution: Initialize client with a default value  To fix this, you can initialize the client variable with a default
* value. This ensures that client is never undefined, even if user is null.
*
* the client variable is initialized with a default value. If user is not null, the first_name property of client is
* updated with user.first_name. This should resolve the issue of TypeError: can't access property "first_name", client
* is undefined. If you're still facing issues, please provide more details about the error you're encountering.
* */
const User = () => { 
  const isMounted = useMounted();
  const queryRef = useRef(null);
  const [clients, setClients] = useState([]);
  const [currentTab, setCurrentTab] = useState('all');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sort, setSort] = useState(sortOptions[0].value);
  const [filters, setFilters] = useState({
    query: '',
    hasAcceptedMarketing: undefined,
    isProspect: undefined,
    isReturning: undefined
  });

  // Variable que almacenará todos los datos del Cliente logueado.
  const [user, setUser] = useState(null);

  // // Esto lo estoy cogiendo de hooks/use-auth.js. Lo necesito para agarrar el token JWT del Cliente logueado.
  // const { token } = useAuth();  // Assuming you have a hook that provides the auth token


  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  const applyFilters = (customers, filters) => customers.filter((customer) => {
    if (filters.query) {
      let queryMatched = false;
      const properties = ['username','email'];
  
      properties.forEach((property) => {
        if ((customer[property]).toLowerCase().includes(filters.query.toLowerCase())) {
          queryMatched = true;
        }
      });
  
      if (!queryMatched) {
        return false;
      }
    }
  
    if (filters.hasAcceptedMarketing && !customer.hasAcceptedMarketing) {
      return false;
    }
  
    if (filters.isProspect && !customer.isProspect) {
      return false;
    }
  
    if (filters.isReturning && !customer.isReturning) {
      return false;
    }
  
    if(filters.genre!='Todos' && customer.genre!=filters.genre){
      return false
    }
  
    if(filters.postal_code!='Todos' && customer.postal_code!=filters.postal_code){
      return false
    }
  
    if(filters.estado!='Todos' && (filters.estado!=customer.subscription_status && filters.estado!=customer.voucher_status)){
      return false
    }
    if(filters.product!='Todos' && !customer.products?.includes(parseInt(filters.product))){
      return false
    }
    if(filters.voucher!='Todos' && !customer.vouchers?.includes(parseInt(filters.voucher))){
      return false
    }
    if(filters.service!='Todos' && !customer.services?.includes(parseInt(filters.service))){
      return false
    }
    if(filters.subscription!='Todos' && !customer.subscriptions?.includes(parseInt(filters.subscription))){
      return false
    }
    return true;
  });
  // const getClients = useCallback(async () => {
  //   try {
  //     const data = await clientApi.getClients();
  //     if (useMounted()) {
  //       setClients(data);
  //     }
  //     res = await data.json();
  //     console.log(res)
  //   } catch (err) {
  //     console.error(err);
  //   }
  // }, [useMounted]);
  //
  // useEffect(() => {
  //   getClients();
  //   console.log(getClients());
  // }, []);

  const getClients = useCallback(async (isMountedValue) => {
    try {
      const data = await clientApi.getClients();
      if (isMountedValue) {
        setClients(data);
      }
      // res = await data.json();
      // console.log(res)
      // console.log(data);
    } catch (err) {
      console.error(err);
    }
  }, []);

  /* Esto estaba causando el mensaje "Promise { <state>: "pending" }" en el Inspector del navegador. Por lo tanto, lo
  * comenté. Además, no necesito este snippet por los momentos.
  * */
  // useEffect(() => {
  //   getClients(isMounted());
  //   console.log(getClients());
  // }, [getClients]);

  /* Esto agarra las Credenciales del Cliente logueado del modelo de Account.
  *
  * Primero, imprimiré unos mensajes de DEBUGGEO que luego VOY A BORRAR para hacer pruebas.
  *
  * You can make a similar API call in your index.js file to fetch the user's details and print the username. You would
  * need to import axios and get the access token from local storage. This code will fetch the user's details from the
  * /auth/users/me/ endpoint and print the username to the console. It's placed inside a useEffect hook to run when the
  * component mounts. Please ensure that the NEXT_PUBLIC_API_ROOT environment variable is correctly set in your project.
  * */
  // Inside your User component or useEffect hook
  useEffect(() => {
    const fetchUserDetails = async () => {
      const accessToken = localStorage.getItem('accessToken');

      if (accessToken) {
        try {

          // API para llamar a las credenciales del Cliente logueado. Toma los datos del modelo de Account.
          const response = await axios.get(
              `${process.env.NEXT_PUBLIC_API_ROOT}/auth/users/me/`,
              {headers: { Authorization: `JWT ${accessToken}`}});
          // const user = response.data;
          const userData = response.data;

          // Set the user data to the user state variable
          setUser(userData);

          // // Print the user's username to the console. DEBUGGEO. BORRAR DESPUES.
          // console.log(`User Name: ${userData.username}`);
          // console.log(`User Account ID: ${userData.id}`); // Esto debería imprimir el ID del del usuario logueado
          // // Esto debería agarrar el primer nombre del usuario. ME DA UNDEFINED.
          // console.log(`User First Name: ${userData.first_name}`);
          // Fin del snippet que me imprime las credenciales del Cliente logueado. BORRAR DESPUES.
        } catch (error) {
          console.error('Error fetching user details:', error);
        }
      }
    };  // Fin del snippet que me imprime las credenciales del Cliente logueado.

    fetchUserDetails();
  }, []); // Fin de la API que llama las credenciales del Cliente autenticado.



  /* Esto imprime el Nombre del Cliente logueado.
  *
  * Está hard-coded como "Usuario 1" pero debería ser el nombre del cliente logueado. Entonces, HAY QUE EDITARLO
  *  */
  let client = {
    first_name: "Loading...",
    username: "nombre_usuario",
  };
  if (user) {
    client = {
      // first_name: user.first_name, // Esto no esta funcionando, y no se porque.
      // first_name: user.email, // ESTO FUNCIONA.
      first_name: user.username,  // ESTO FUNCIONA.
      // first_name: "Usuario 1", // Esto funciona.
    };
  }
  // const client = {
  //   // first_name: "Usuario 1",  // Esto funciona.
  //   first_name: user.first_name, // Esto NO FUNCIONA.
  //   // Esto agarra el Nombre del Cliente logueado de la llamada a la API.
  //   // first_name: user ? user.first_name : "Loading...",
  //   username: "nombre_usuario",
  // };
  //   // Define the client variable after the user state variable
  // const client = user ? {
  //   first_name: user.first_name,
  //   username: "nombre_usuario",
  // } : null;


  // useEffect(() => {
  //   if (token) {
  //     jwtDecode(token)
  //       .then(decodedToken => {
  //         const userId = decodedToken.sub;  // 'sub' usually contains the user ID in a JWT
  //
  //         // Now you can use userId in your component
  //         console.log(`User ID: ${userId}`);
  //       })
  //       .catch(error => {
  //         console.error('Error decoding token:', error);
  //       });
  //   }
  //   else {
  //     console.error('No token found');
  //   }
  // }, [token]); // End of the snippet that prints the logged in Client's ID.
  // useEffect(() => {
  //   if (token) {
  //     const decodedToken = jwtDecode(token);
  //     const userId = decodedToken.sub;  // 'sub' usually contains the user ID in a JWT
  //
  //     // Now you can use userId in your component
  //     console.log(`User ID: ${userId}`);
  //   }
  // }, [token]); // Fin del snippet que me imprime el ID del Cliente logueado.

   
  useEffect(() => {
    if(clients.length){
      let pcs =['Todos'];
      clients.map(e=>{
        if(e && e.postal_code && !pcs.includes(e.postal_code)) pcs.push(e.postal_code)
      })
    // setPostalCodesOptions(pcs)
    }
  },[clients]);

  const handleQueryChange = (event) => {
    event.preventDefault();
    setFilters((prevState) => ({
      ...prevState,
      query: queryRef.current?.value
    }));
  };

  const handleSortChange = (event) => {
    setSort(event.target.value);
  };
 
  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
  };
 
  // Usually query is done on backend with indexing solutions
  
  const filteredCustomers = applyFilters(clients, filters);
  const sortedCustomers = applySort(filteredCustomers, sort);
  const  paginatedCustomers = applyPagination(sortedCustomers, page, rowsPerPage);
  


     return (
    <>
      <Head>
        <title>Dashboard: Cliente</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}>
        <Box sx={{ mb: 4 }}>
          <Grid container  >
            <Grid item >
              {/* Esto imprime el Nombre del Usuario Logueado en el HTML de la página */}
              <Typography variant="h4">
                {client.first_name}</Typography>
            </Grid>
          </Grid>
          
        </Box>
        <Card>
        <Grid  >
                <Typography  variant="h4">
                  ¡Buenos días!
                </Typography>
          </Grid>
          <Divider />
          <br></br>
          <Box sx={{ mb: 4 }}>
            <Grid container   spacing={3}>
              <Grid container item xs = {12} justifyContent="space-between">
                <Typography variant="h4">Inicio</Typography>
                <NextLink href="/dashboard">
                <Button 
                  startIcon={<ArrowRight fontSize="small" />}
                  variant="contained">
                  
                </Button>
                </NextLink>
              </Grid>

              {/* Botón de "Perfil" que te permite ir a la página para Editar los Datos del Cliente. */}
              <Grid container item xs = {12} justifyContent="space-between">
                <Typography variant="h4">Perfil</Typography>
                {/* <NextLink href={`/user/${clients.id}`}> */}
                <NextLink href={`/user/edit`}>
                <Button 
                  startIcon={<ArrowRight fontSize="small" />}
                  variant="contained">
                  
                </Button>
                </NextLink>
              </Grid>

              {/* Botón de "Código QR" que te permite ir a la página para ver tu propio Código QR */}
              <Grid container item xs = {12} justifyContent="space-between">
                <Typography variant="h4">Código QR</Typography>
                <NextLink href={`/user/qr-code`}>
                <Button
                  startIcon={<ArrowRight fontSize="small" />}
                  variant="contained">

                </Button>
                </NextLink>
              </Grid>

              <Grid container item xs = {12} justifyContent="space-between">
                <Typography variant="h4">Tus reservas</Typography>

                {/*Enlace a las reservas / Ordenes.*/}
                {/*ESTO POR LOS MOMENTOS TIENE UN BUG QUE NO ME DEJA RENDERIZAR ESTA PAGINA. LUEGO LO ARREGLARE*/}
                {/*<NextLink href={`/user/orders/${order.id}`}>*/}
                <Button 
                  startIcon={<ArrowRight fontSize="small" />}
                  variant="contained">
                  
                </Button>
                {/*</NextLink>*/}
              </Grid>
            </Grid>
          </Box>
        </Card>
      </Box>
      <br></br>
    </>
  );
};

User.getLayout = (page) => (
  <AuthGuard>
    <DashboardLayout>{page}</DashboardLayout>
  </AuthGuard>
);

export default User;

/*
*

const Client = (props) => {
  const isMounted = useMounted();
  const [client, setClient] = useState(null);
  const {userId} = props
  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);


  const getClient = useCallback(async () => {
    try {
      const data = await clientApi.getClient(userId);
      // call API to set the requested activity

      if (isMounted()) {
        setClient(data);
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMounted, userId]);

  useEffect(() => {
      getClient(userId);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
  []);


  if (!client) {
    return null;
  }



  return (
    <>
      <Head>
        <title>
          Dashboard: Cliente | Perfil
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

export async function getServerSideProps(ctx) {
  const { userId } = ctx.query;
  return {
    props: {
      userId,
    },
  };
}
* */