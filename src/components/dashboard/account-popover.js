import NextLink from 'next/link';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import toast from 'react-hot-toast';
import {
  Avatar,
  Box,
  Divider,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Popover,
  Typography
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '../../hooks/use-auth';
import { Cog as CogIcon } from '../../icons/cog';
import { UserCircle as UserCircleIcon } from '../../icons/user-circle';
import { SwitchHorizontalOutlined as SwitchHorizontalOutlinedIcon } from '../../icons/switch-horizontal-outlined';

// Estas bibliotecas / módules me permitirán tomar los Datos del Usuario logueado desde la Base de Datos de Django.
import { useEffect, useState } from 'react';
import axios from 'axios';
import clientApi from '../../api/client-api'; // Replace with your actual clientApi path


/* Este es el componente de React con todo el texto que aparece cuando clcias en la Foto de Perfil que se muestra en el
* menú de la barra de navegación superior.
*
* Es decir, aquí se almacena la foto de perfil del usuario, el nombre del usuario, y el botón para cerrar sesión.
*
* Voy a editar este archivo para quitar el nombre de la Comañía del usuario, y agarraré el nombre y apellido del usuario
* de la base de datos de Django.
*
* Agregué una imágen libre de copyright genérica dentro del menú que aparece cuando clicas la Foto de Perfil del
* Usuario.
*
* Para ahorrarme tiempo, ¿porque no mejor solo imprimo el nombre de usuario del usuario logueado en la foto de perfil?
* Así, solo necesitaré usar la API de “auth/me” en account-popover.js, el cual ya funciona, y ya me agarra el nombre de
* usuario.
* */

export const AccountPopover = (props) => {
  const { anchorEl, onClose, open, ...other } = props;
  const router = useRouter();

  // Esto le permite cerrar sesión al usuario
  const { logout } = useAuth();
  // To get the user from the authContext, you can use
  // `const { user } = useAuth();`

  // Variable con la Foto de Perfil y el Nombre de Usuario que se mostrarán en el menú.
  // Variable con la Foto de perfil
  const userAvatar = {
    avatar: '/static/mock-images/avatars/avatar-generico.png',     // Foto de Perfil del Usuario dentro del menú.
  };

  // const user = {
  //   avatar: '/static/mock-images/avatars/avatar-generico.png',     // Foto de Perfil del Usuario dentro del menú.
  //   name: 'Anika Visser Hola Mundo'
  // };
  // Variable que almacenará después todos los Datos del Usuario Logueado
  const [user, setUser] = useState(null);


  /* API para agarrar los Datos del Usuario Logueado desde la Base de Datos de Django.
  *
  * Solo agarra los datos básicos del usuario, como su nombre de usuario, el cual puedo lograr con la API de "/auth/me".
  *
  * Luego, meteré esos datos en la variable "user", para así imprimir en nombre de usuario en el menú.
  *
  * Y, para ahorrarme problemas, crearé una variable para única y exclusivamente meter el avatar del usuario. Luego,
  * para mostrar esa imagen, usaré esa nueva variable (la variable "userAvatar").
  * */
  useEffect(() => {
    const fetchUserDetails = async () => {
      const accessToken = localStorage.getItem('accessToken');

      if (accessToken) {
        try {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_ROOT}/auth/users/me/`,
            { headers: { Authorization: `JWT ${accessToken}` } }
          );

          // const userId = response.data.id;

          // Esto me agarra los datos básicos del usuario loguedo, como su nombre de usuario e email.
          const clientData = response.data;

          // // DEBUGGEO: Esto imprime el ID del Usuario Logueado.
          // console.log(userId);  // ESTO FUNCIONA

          // // ESTO NO FUNCIONA. Al parecer, tiene problemas agarrarndo las Suscripciones.
          // const clientData = await clientApi.getClient(userId);
          //
          // // DEBUGGEO: Esto imprime los datos del Usuario Logueado después de llamar a getClient()
          // console.log(clientData); // Esto NO FUNCIONA.

          // Set the user data to the user state variable
          // Meto los todos datos del Cliente del JSON de la llamada de getClient() en la variable "client".
          // setClient(userData);
          setUser(clientData);

          // setUser({
          //   name: `${clientData.first_name} ${clientData.last_name}` // Replace with the actual name properties
          // });
        } catch (error) {
          console.error('Error fetching user details:', error);
        }
      }
    };

    fetchUserDetails();
  }, []);

  const handleLogout = async () => {
    try {
      onClose?.();
      await logout();
      router.push('/').catch(console.error);
    } catch (err) {
      console.error(err);
      toast.error('Unable to logout.');
    }
  };

  // Si no hay datos del Usuario, no muestro nada.
  if (!user) {
    return null;
  }

  // Si el usuario Existe, muestro el menú con la Foto de Perfil y el Nombre del Usuario.
  return (
    <Popover
      anchorEl={anchorEl}
      anchorOrigin={{
        horizontal: 'center',
        vertical: 'bottom'
      }}
      keepMounted
      onClose={onClose}
      open={!!open}
      PaperProps={{ sx: { width: 300 } }}
      transitionDuration={0}
      {...other}>
      <Box
        sx={{
          alignItems: 'center',
          p: 2,
          display: 'flex'
        }}
      >
        {/* Foto de Perfil que se mostará dentro del menú */}
        <Avatar
          src={userAvatar.avatar}
          sx={{
            height: 40,
            width: 40
          }}
        >
          <UserCircleIcon fontSize="small" />
        </Avatar>
        <Box
          sx={{
            ml: 1
          }}
        >
          {/* Nombre y Apellido del Usuario Logueado */}
          {/*  EDITAR para que salga el nombre el usuario logueado */}
          <Typography variant="body1">
            {user.username}
          </Typography>

          {/* Nombre de la Compañía del Usuario Logueado. ELIMINAR. */}
          {/*<Typography*/}
          {/*  color="textSecondary"*/}
          {/*  variant="body2"*/}
          {/*>*/}
          {/*  Acme Inc*/}
          {/*</Typography>*/}
        </Box>
      </Box>
      <Divider />
      <Box sx={{ my: 1 }}>
        <NextLink
          href="/dashboard/social/profile"
          passHref
        >
          <MenuItem component="a">
            <ListItemIcon>
              <UserCircleIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary={(
                <Typography variant="body1">
                  Profile
                </Typography>
              )}
            />
          </MenuItem>
        </NextLink>
        <NextLink
          href="/dashboard/account"
          passHref
        >
          <MenuItem component="a">
            <ListItemIcon>
              <CogIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary={(
                <Typography variant="body1">
                  Settings
                </Typography>
              )}
            />
          </MenuItem>
        </NextLink>
        <NextLink
          href="/dashboard"
          passHref
        >
          <MenuItem component="a">
            <ListItemIcon>
              <SwitchHorizontalOutlinedIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary={(
                <Typography variant="body1">
                  Change organization
                </Typography>
              )}
            />
          </MenuItem>
        </NextLink>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary={(
              <Typography variant="body1">
                Logout
              </Typography>
            )}
          />
        </MenuItem>
      </Box>
    </Popover>
  );
};

AccountPopover.propTypes = {
  anchorEl: PropTypes.any,
  onClose: PropTypes.func,
  open: PropTypes.bool
};
