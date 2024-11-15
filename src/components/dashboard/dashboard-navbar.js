import {useEffect, useRef, useState} from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import {
  AppBar,
  Avatar,
  Badge,
  Box,
  ButtonBase,
  IconButton,
  Toolbar,
  Tooltip
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Menu as MenuIcon } from '../../icons/menu';
import { Bell as BellIcon } from '../../icons/bell';
import { Search as SearchIcon } from '../../icons/search';
import { UserCircle as UserCircleIcon } from '../../icons/user-circle';
import { Users as UsersIcon } from '../../icons/users';
import { AccountPopover } from './account-popover';
import { ContactsPopover } from './contacts-popover';
import { ContentSearchDialog } from './content-search-dialog';
import { NotificationsPopover } from './notifications-popover';
import { LanguagePopover } from './language-popover';

// Esto importa el componente que le pide permiso al usuario para mandarle notificaciones push, y que genera el token
import { requestNotificationPermission, messaging } from "../../../firebase";

// Esto me importa el componente le muestra al usuario las Notificaciones Push en su navegador
import { onMessage } from "firebase/messaging";
import axios from "axios";

/* Barra de Navegación Superior de la Web App de Clientes.
*
* Aquí está tanto la Campana de Notificaciones como el Icono de la Foto de Perfil.
*
* El icono de iniciar sesión, la campana de las notificaciones, etc, están aquí.
*
* Tengo que modificar el código de la campana de Notificaciones del Top Navbar de la web app de Clientes para que NO
* agarre todas las notificaciones, sino que solo agarre las notificaciones con el mismo ID que el usuario autenticado,
* y las notificaciones de tipo “Cliente”.
*
* Aquí también meteré el código de las Notificaciones Push. Quiero que el aviso de consentimiento de notificaciones me
* salga EN CUALQUIER PARTE DE LA WEB APP. No quiero que solo salga en /dashboard. Es decir, que aunque esté en la página
* de actividades o en el calendario, aún así te pida el permiso de enviarte notificaciones, y aun así genere el token
* IID.
* */

const languages = {
  en: '/static/icons/uk_flag.svg',
  de: '/static/icons/de_flag.svg',
  es: '/static/icons/es_flag.svg'
};


const DashboardNavbarRoot = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  ...(theme.palette.mode === 'light'
    ? {
      boxShadow: theme.shadows[3]
    }
    : {
      backgroundColor: theme.palette.background.paper,
      borderBottomColor: theme.palette.divider,
      borderBottomStyle: 'solid',
      borderBottomWidth: 1,
      boxShadow: 'none'
    })
}));

/* Icono de la Bandera para cambiar el idioma. Esto no me sirve por los momentos.
* */
// const LanguageButton = () => {
//   const anchorRef = useRef(null);
//   const { i18n } = useTranslation();
//   const [openPopover, setOpenPopover] = useState(false);
//
//   const handleOpenPopover = () => {
//     setOpenPopover(true);
//   };
//
//   const handleClosePopover = () => {
//     setOpenPopover(false);
//   };
//
//   return (
//     <>
//       <IconButton
//         onClick={handleOpenPopover}
//         ref={anchorRef}
//         sx={{ ml: 1 }}
//       >
//         <Box
//           sx={{
//             display: 'flex',
//             height: 20,
//             width: 20,
//             '& img': {
//               width: '100%'
//             }
//           }}
//         >
//           <img
//             alt=""
//             src={languages[i18n.language]}
//           />
//         </Box>
//       </IconButton>
//       <LanguagePopover
//         anchorEl={anchorRef.current}
//         onClose={handleClosePopover}
//         open={openPopover}
//       />
//     </>
//   );
// };

const ContentSearchButton = () => {
  const [openDialog, setOpenDialog] = useState(false);

  const handleOpenSearchDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseSearchDialog = () => {
    setOpenDialog(false);
  };

  return (
    <>
      <Tooltip title="Search">
        <IconButton
          onClick={handleOpenSearchDialog}
          sx={{ ml: 1 }}
        >
          <SearchIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <ContentSearchDialog
        onClose={handleCloseSearchDialog}
        open={openDialog}
      />
    </>
  );
};

/* Icono de "Contacts". Esto no me servirá for the time being. */
// const ContactsButton = () => {
//   const anchorRef = useRef(null);
//   const [openPopover, setOpenPopover] = useState(false);
//
//   const handleOpenPopover = () => {
//     setOpenPopover(true);
//   };
//
//   const handleClosePopover = () => {
//     setOpenPopover(false);
//   };
//
//   return (
//     <>
//       <Tooltip title="Contacts">
//         <IconButton
//           onClick={handleOpenPopover}
//           sx={{ ml: 1 }}
//           ref={anchorRef}
//         >
//           <UsersIcon fontSize="small" />
//         </IconButton>
//       </Tooltip>
//       <ContactsPopover
//         anchorEl={anchorRef.current}
//         onClose={handleClosePopover}
//         open={openPopover}
//       />
//     </>
//   );
// };

const NotificationsButton = () => {
  const anchorRef = useRef(null);
  const [unread, setUnread] = useState(0);
  const [openPopover, setOpenPopover] = useState(false);
  // Unread notifications should come from a context and be shared with both this component and
  // notifications popover. To simplify the demo, we get it from the popover

  const handleOpenPopover = () => {
    setOpenPopover(true);
  };

  const handleClosePopover = () => {
    setOpenPopover(false);
  };

  const handleUpdateUnread = (value) => {
    setUnread(value);
  };

  return (
    <>
      <Tooltip title="Notifications">
        <IconButton
          ref={anchorRef}
          sx={{ ml: 1 }}
          onClick={handleOpenPopover}
        >
          <Badge
            color="error"
            badgeContent={unread}
          >
            <BellIcon fontSize="small" />
          </Badge>
        </IconButton>
      </Tooltip>

      {/*Esto contiene las notificaciones de Prueba, y me muestra el numero de notificaciones en la campana.*/}
      {/*TENGO QUE CAMBIAR ESTO PARA QUE NO ME MUESTRE LAS NOTIFICACIONES DE PRUEBA DE MATERIAL UI.*/}
      <NotificationsPopover
        anchorEl={anchorRef.current}
        onClose={handleClosePopover}
        onUpdateUnread={handleUpdateUnread}
        open={openPopover}
      />
    </>
  );
};

/* Botón del Icono con la Foto de Perfil en la Barra de Navegación Superior, el cual, cuando hace clic, te dejará
* cerrar tu sesión.
*
* Esta esl a Foto de Perfil que aparece en la barra de navegación, FUERA del menú que aparece si clicas en la foto de
* perfil. Es decir, esta es la foto que debes de lcicar para abrir el menú para cerrar la sesión.
*
* Cambié la foto de perfil por una foto de perfil genérica libre de copyright.
* */
const AccountButton = () => {
  const anchorRef = useRef(null);
  const [openPopover, setOpenPopover] = useState(false);
  // To get the user from the authContext, you can use
  // `const { user } = useAuth();`
  const user = {
    avatar: '/static/mock-images/avatars/avatar-generico.png',    // Foto de Perfil del Usuario.
    // name: 'Anika Visser'    // Nombre del Usuario. NO SE ESTA IMPRIMIENDO EN LA PAGINA.
  };

  const handleOpenPopover = () => {
    setOpenPopover(true);
  };

  const handleClosePopover = () => {
    setOpenPopover(false);
  };

  return (
    <>
      <Box
        component={ButtonBase}
        onClick={handleOpenPopover}
        ref={anchorRef}
        sx={{
          alignItems: 'center',
          display: 'flex',
          ml: 2
        }}
      >
        {/* Foto de Perfil del Usuario que está en la barra de navegación, el cual puedes clicar apra cerrar sesión */}
        <Avatar
          sx={{
            height: 40,
            width: 40
          }}
          src={user.avatar}
        >
          <UserCircleIcon fontSize="small" />
        </Avatar>
      </Box>
      <AccountPopover
        anchorEl={anchorRef.current}
        onClose={handleClosePopover}
        open={openPopover}
      />
    </>
  );
};

/* Barra de Navegación o Navbar superior de toda la web app cuando inicias sesión de la web app de Clientes.
*
* Aquí es donde meteré todo el código de las Notificaciones Push. Quiero que el aviso de consentimiento de
* notificaciones me salga EN CUALQUIER PARTE DE LA WEB APP. No quiero que solo salga en /dashboard. Es decir, que aunque
* esté en la página de actividades o en el calendario, aún así te pida el permiso de enviarte notificaciones, y aún así
* genere el token IID. ESTO SERÍA IMPORTANTE PARA QUE, independientemente de en que pagina se encuentre el usuario (sea
* el /dashboard, o sea el calendario), SIEMPRE PUEDA RECIBIR LAS NOTIFICACIONES PUSH. Eso es porque quiero que el Token
* IID siempre se genere si has permitido las notificaciones, para que asi ese token IID se envie con axios a django, y
* si django detecta que hay que enviarle una notificación push, se la envia. Y quitare el codigo de messaging y lo de
* enviar notificaciones push del index.js del /dashboard.
*
* Por lo tanto, meteré el código para detectar las Notificaciones Push en este componente.
*
* Lo que haré será que el Token IID SOLO SE METERA UNA SOLA VEZ cuando aceptes el permiso de generar notificaciones
* push. No quiero que se esté generando permanentemente. Pondré alguna condición como que la combinación de nombre de
* usuario y de token debe ser Unique. No pueden meterse más de un token que tenga el mismo token y el mismo usuario a
* la vez. Para asegurarme de que la instancia del usuario logueado (esto se agarra con el JWT token) y el Token se
* metan una sola vez en la base de datos y se envien una sola vez mediante axios, puedo preguntarle a Copilot.
*
* */
export const DashboardNavbar = (props) => {
  const { onOpenSidebar, ...other } = props;

    /* Esto le pedirá al usuario permiso para enviarle notificaciones push en su navegador. Si el usuario las acepta,
  * entonces se le asignará un token único para su dispositivo, el cual se puede usar para enviarle notificaciones push.
  * Además, Aquí también generaré la Notificacion push que se generará en el ordenador / dispositivo móvil del usuario.
  *
  * I will create an "if" statement that says that, if requestNotificationPermission() returns "true", print a console
  * message saying "The admin has given you permission to send push notifications"; otherwise, print "Sorry: the admin
  * has rejected Push Notifications". To do this, I need to modify firebase.js to modify the
  * requestNotificationPermission() function so that it can return either "true" or "false" values.
  *
  * Si la función requestNotificationPermission() devuelve "true", entonces enviaré a la web app de Django mediante
  * Axios el ID del Administrador Autenticado, y su respectivo Token IID. Así, se le podrá enviar al Administrador
  * su correspondiente notificación push. De lo contrario, no haré esa llamada de Axios ni enviaré esos datos a la
  * web app de Django, por motivos de eficiencia.
  *
  * Add an if statement in the useEffect hook to handle the returned value and print the appropriate console message.
  * Add if statement in useEffect hook.
  *
  * Lo ideal sería devolver el token en lugar de “true” desde firebase.js, para que así pueda tener el Token IID en el
  * dashboard. E igual, la unica forma de que se genere el IID token es si el usuario de su permiso para recibir
  * notificaciones (cuando sea “return = true”). Entonces, puedo devolver 2 opciones: o el token IID, o
  * “false”. Uno es un booleano, y el otro es un charfield. En fin, pondré que me tiene que devolver el token, o false.
  * Pues, pondré que si no me devuelve false, que me imprima lo que me haya devuelto el requestNotificationPermission(),
  * es decir, que me devuelva y imprima el token IID.
  *
  * ya estoy enviando con el POST request mediante Axios el ID del Administrador y el Token IID, y ya la API de de
  * store firebase token de Django agarra el token IID, y lo mete en la base de Datos.
  *
  * */
  useEffect(() => {

    // // Esto le pide permiso al usuario para mandarle notificaciones push en su navegador, y genera el token IID
    // requestNotificationPermission();

    // Esto le pide permiso al usuario para mandarle notificaciones push en su navegador, y genera el token IID
    const checkNotificationPermission = async () => {
        // const permissionGranted = await requestNotificationPermission();

        const token = await requestNotificationPermission();

        // Si el usuario te da permiso para recibir notificaciones push
        // if (permissionGranted) {
        if (token) {

          // // DEBUGGEO. BORRAR. Esto me indica que el admin ha dado permiso para enviar notificaciones push.
          // console.log('The client has given you permission to send push notifications');

          /* Esto le envía a la web app de Django el ID del Administrador Autenticado, y su respectivo Token IID, si es
          * que tiene uno.
          *
          * Para ello, primero debo coger los datos del Administrador Autenticado usando una llamada a la API de Django
          * de /auth/ usando Axios
          *
          * Luego, debo coger el Token IID del Administrador Autenticado, el cual necesito para poder enviarle sus
          * notificaciones push.
          * */
          // useEffect(() => {
          //   const fetchData = async () => {
          try {

              // Esto agarra la cookie que almacena la información del usuario autenticado
              const accessToken = localStorage.getItem('accessToken');

              // API que coge algunos de los datos del Administrador autenticado usando el JWT Token
              const responseUser = await axios.get(
                `${process.env.NEXT_PUBLIC_API_ROOT}/auth/users/me/`,
                { headers: { Authorization: `JWT ${accessToken}` } }
              );

              // Esto coge el ID del Administrador autenticado.
              const userId = responseUser.data.id;

              // // DEBUGGEO. BORRAR. Esto imprime el ID del usuario Autenticado.
              // console.log('ID del Cliente Autenticado:', userId);

              // // DEBUGGEO. BORRAR. Esto imprime el Token IID del usuario Autenticado.
              // console.log('Token IID del Cliente Autenticado:', token);

              // ACTIVAR Y MODIFICAR DESPUES
              // API que envía el ID del Administrador Autenticado y su respectivo Token IID a la web app de Django
              const responseNotifications = await axios.post(
                  `${process.env.NEXT_PUBLIC_API_ROOT}/api/store-firebase-token/`,
                {


                    'user_id': userId, // Esto envía el ID del Administrador Autenticado
                    'token': token // Esto envía el Token IID del Administrador Autenticado



                }
              );

              // // // DEBUGGEO. BORRAR DESPUES. Esto me imprime las Notificaciones cogidas. BORRAR DESPUES.
              // console.log("Fetched data:", responseNotifications.data); // This line prints the fetched data to the console

              // setData(responseNotifications.data);

          // Esto imprime un mensaje de error si hay un error al coger los datos del usuario autenticado o el Token IID
          } catch (error) {
              console.error("Error fetching data", error);
          } // Fin del try-catch que agarra el ID del Administrador Autenticado y su Token IID

          // };

          // fetchData();

          // }, []);   // Fin del snippet que envia el Token IID y el ID del usuario a la web app de Django

        // Si el usuario rechaza las notificaciones push
        } else {

          // // DEBUGGEO. BORRAR. Esto me indica que el admin ha rechazado las notificaciones push.
          // console.log('Sorry: the client has rejected Push Notifications');
        }
    };  // Fin de la función que verifica si el usuario ha dado permiso para recibir notificaciones push

    // Esto llama a la función que pide permiso para las Notificaciones Push Y genera el Token IID
    checkNotificationPermission();




    // Esto le muestra la Notificación Push al navegador del usuario
    if (messaging) {

      // // DEBUGGEO. Esto es para detectar que "messaging" NO es undefined.
      // console.log('messaging NO es undefined. messaging:', messaging);

      // Esto le muestra la Notificación Push al navegador del usuario en el 1er plano (cuando abre el navegador)
      onMessage(messaging, (payload) => {
        // DEBUGGEO. BORRAR. Esto imprime la notificación push en el inspector del navegador.
        console.log('Message received. ', payload);
      });




    } else {
      console.warn('Firebase messaging is not supported in this environment.');
    }

    // // Esto le muestra la Notificación Push al navegador del usuario
    // onMessage(messaging, (payload) => {
    //
    //   // DEBUGGEO. BORRAR. Esto imprime la notificación push en el inspector del navegador.
    //   console.log('Message received. ', payload);
    //
    // });

  }, []); // Fin del snippet que pide permiso para las Notificaciones Push Y genera el Token IID

  return (
    <>
      <DashboardNavbarRoot
        sx={{
          left: {
            lg: 280
          },
          width: {
            lg: 'calc(100% - 280px)'
          }
        }}
        {...other}>
        <Toolbar
          disableGutters
          sx={{
            minHeight: 64,
            left: 0,
            px: 2
          }}
        >
          <IconButton
            onClick={onOpenSidebar}
            sx={{
              display: {
                xs: 'inline-flex',
                lg: 'none'
              }
            }}
          >
            <MenuIcon fontSize="small" />
          </IconButton>
          <Box sx={{ flexGrow: 1 }} />
          {/*<LanguageButton />*/}
          <ContentSearchButton />
          {/*<ContactsButton />*/}
          <NotificationsButton />
          <AccountButton />
        </Toolbar>
      </DashboardNavbarRoot>
    </>
  );
};

DashboardNavbar.propTypes = {
  onOpenSidebar: PropTypes.func
};
