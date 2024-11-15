import { useEffect, useMemo, useRef, useState } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Box, Button, Chip, Divider, Drawer, Typography, useMediaQuery } from '@mui/material';
import { Calendar as CalendarIcon } from '../../icons/calendar';
import { Cash as CashIcon } from '../../icons/cash';
import { ChartBar as ChartBarIcon } from '../../icons/chart-bar';
import { ChartPie as ChartPieIcon } from '../../icons/chart-pie';
import { ChatAlt2 as ChatAlt2Icon } from '../../icons/chat-alt2';
import { ClipboardList as ClipboardListIcon } from '../../icons/clipboard-list';
import { CreditCard as CreditCardIcon } from '../../icons/credit-card';
import { Home as HomeIcon } from '../../icons/home';
import { LockClosed as LockClosedIcon } from '../../icons/lock-closed';
import { Mail as MailIcon } from '../../icons/mail';
import { MailOpen as MailOpenIcon } from '../../icons/mail-open';
import { Newspaper as NewspaperIcon } from '../../icons/newspaper';
import { OfficeBuilding as OfficeBuildingIcon } from '../../icons/office-building';
import { ReceiptTax as ReceiptTaxIcon } from '../../icons/receipt-tax';
import { Selector as SelectorIcon } from '../../icons/selector';
import { Share as ShareIcon } from '../../icons/share';
import { ShoppingBag as ShoppingBagIcon } from '../../icons/shopping-bag';
import { ShoppingCart as ShoppingCartIcon } from '../../icons/shopping-cart';
import {PaperAirplane as PaperAirplaneIcon} from '../../icons/paper-airplane';
import { Truck as TruckIcon } from '../../icons/truck';
import { UserCircle as UserCircleIcon } from '../../icons/user-circle';
import { Users as UsersIcon } from '../../icons/users';
import { XCircle as XCircleIcon } from '../../icons/x-circle';
import { Logo } from '../logo';
import { Scrollbar } from '../scrollbar';
import { DashboardSidebarSection } from './dashboard-sidebar-section';
import { OrganizationPopover } from './organization-popover';
import SettingsIcon from '@mui/icons-material/Settings';

// Esto me dejará llamar APIs usando Axios.
import axios from 'axios';

/* Esto es el Navbar Lateral que aparece a la izquierda de la Pantalla con los enlaces a las distintas funciones.
*
* */

/* Aquí están todos los enlaces a las distintas secciones de la página, junto con sus respectivos iconos.
*
* Agregué un enlace a la funcionalidad de enviar Campañas de Email de Marketing a través de Mailrelay. Además, le
* agregué un icono de un sobre / carta a esta función.
* */
const getSections = (t) => [
  {

    // Esta es la sección con las Actividades y Grupos de Actividades.
    title: t('Actividades del Gimnasio'),
    items: [

      // // Página para crear Nuevos Espacios y Salas. Los clientes NO deben ver esto.
      // {
      //   title: t('Creación de espacios y salas'),
      //   path: '/rooms',
      //   icon: <ChartBarIcon fontSize="small" />
      // },
      {
        title: t('Actividades'),
        path: '/activities',
        icon: <HomeIcon fontSize="small" />
      },
      {
        title: t('Grupos de actividades'),
        path: '/groups',
        icon: <ChartPieIcon fontSize="small" />
      },
    ]
  },
  {
    title: t('Clientes'),
    items: [
      // {
      //   title: t('General'),
      //   path: '/clients',
      //   icon: <UsersIcon fontSize="small" />
      // },
      {
        title: t('Cuotas'),
        path: '/subscriptions',
        icon: <HomeIcon fontSize="small" />
      },
      {
        title: t('Bonos'),
        path: '/vouchers',
        icon: <ChartBarIcon fontSize="small" />
      },
      {
        title: t('Productos'),
        path: '/products/',
        icon: <ChartPieIcon fontSize="small" />
      },
      {
        title: t('Servicios'),
        path: '/services/',
        icon: <PaperAirplaneIcon fontSize="small" />
      },

      // Enlace a la página de Documentos y Consentimientos del Cliente.
      {
        title: t('Documentos'),
        path: '/documents/',
        icon: <PaperAirplaneIcon fontSize="small" />
      },
      //   // Esto es un enlace a la funcionalidad de enviar Campañas de Email de Marketing a través de Mailrelay.
      // {
      //   title: t('Campañas de Email'),
      //   path: '/email-campaigns/',
      //   icon: <MailIcon fontSize="small" />
      // },
    ]
  },
  // {
  //   title: t('Finanzas'),
  //   items: [
  //     {
  //       title: t('General'),
  //       path: '/finances',
  //       icon: <ChartPieIcon fontSize="small" />
  //     },
  //     {
  //       title: t('Gastos'),
  //       path: '/expenses',
  //       icon: <CashIcon fontSize="small" />
  //     },
  //     {
  //       title: t('Ingresos'),
  //       path:'/profits',
  //       icon: <ReceiptTaxIcon fontSize="small" />,
  //     },
  //     {
  //       title: t('Proveedores'),
  //       path: '/suppliers/',
  //       icon: <TruckIcon fontSize="small" />,
  //     },
  //     {
  //       title: t('Configuracion'),
  //       path: '/finances/config',
  //       icon: <SettingsIcon fontSize="small" />
  //     }
  //   ]
  // },
  {
    title: t('General'),
    items: [

      // Página de "Overview".
      {
        title: t('Overview'),
        path: '/dashboard',
        icon: <HomeIcon fontSize="small" />
      },
      // // Página de Analytics. NO LO DEE VER EL CLIENTE.
      // {
      //   title: t('Analytics'),
      //   path: '/dashboard/analytics',
      //   icon: <ChartBarIcon fontSize="small" />
      // },

      // // Este es el enlace a "Finance", el cual es solo otro enlace a "Dashboard". Entonces, lo voya a quitar.
      // {
      //   title: t('Finance'),
      //   path: '/dashboard/',
      //   icon: <ChartPieIcon fontSize="small" />
      // },
      // // Página de Logistics. No entiendo porque el Cliente debería ver esto, por lo que lo voy a quitar.
      // {
      //   title: t('Logistics'),
      //   path: '/dashboard/logistics',
      //   icon: <TruckIcon fontSize="small" />,
      //   chip: <Chip
      //     color="secondary"
      //     label={(
      //       <Typography
      //         sx={{
      //           fontSize: '10px',
      //           fontWeight: '600'
      //         }}
      //       >
      //         NEW
      //       </Typography>
      //     )}
      //     size="small"
      //   />
      // },

      // Página de "Cuenta". Aquí pondré en enlace a la URL de "/user", el cual me deja ver lso datos del usuario
      // logueado.
      {
        title: t('Cuenta'),
        path: '/user',
        icon: <UserCircleIcon fontSize="small" />
      },

      // Enlace a la página del Código QR del Cliente
      {
        title: t('Código QR'),
        path: '/user/qr-code',
        icon: <UserCircleIcon fontSize="small" />
      },

      // Página de "Account". Esto no lo debe ver el cliente, pero puedo usar lso estilos de esta página.
      // {
      //   title: t('Account'),
      //   path: '/dashboard/account',
      //   icon: <UserCircleIcon fontSize="small" />
      // }
    ]
  },
  {
    title: t('Management'),
    items: [

      // // Páginas de "Customers". Esto no lo debe ver el cliente.
      // {
      //   title: t('Customers'),
      //   path: '/dashboard/customers',
      //   icon: <UsersIcon fontSize="small" />,
      //   children: [
      //     {
      //       title: t('List'),
      //       path: '/dashboard/customers'
      //     },
      //     {
      //       title: t('Details'),
      //       path: '/dashboard/customers/1'
      //     },
      //     {
      //       title: t('Edit'),
      //       path: '/dashboard/customers/1/edit'
      //     }
      //   ]
      // },
      {
        title: t('Orders'),
        icon: <ShoppingCartIcon fontSize="small" />,
        path: '/dashboard/orders',
        children: [
          {
            title: t('List'),
            path: '/dashboard/orders'
          },
          {
            title: t('Details'),
            path: '/dashboard/orders/1'
          }
        ]
      },
      {
        title: t('Invoices'),
        path: '/dashboard/invoices',
        icon: <ReceiptTaxIcon fontSize="small" />,
        children: [
          {
            title: t('List'),
            path: '/dashboard/invoices'
          },
          {
            title: t('Details'),
            path: '/dashboard/invoices/1'
          }
        ]
      }
    ]
  },
  {
    title: t('Platforms'),
    items: [

      // // Páginas de "Job Listings". Esto no lo debe ver el cliente.
      // {
      //   title: t('Job Listings'),
      //   path: '/dashboard/jobs',
      //   icon: <OfficeBuildingIcon fontSize="small" />,
      //   children: [
      //     {
      //       title: t('Browse'),
      //       path: '/dashboard/jobs'
      //     },
      //     {
      //       title: t('Details'),
      //       path: '/dashboard/jobs/companies/1'
      //     },
      //     {
      //       title: t('Create'),
      //       path: '/dashboard/jobs/new'
      //     }
      //   ]
      // },
      {
        title: t('Social Media'),
        path: '/dashboard/social',
        icon: <ShareIcon fontSize="small" />,
        children: [
          {
            title: t('Profile'),
            path: '/dashboard/social/profile'
          },
          {
            title: t('Feed'),
            path: '/dashboard/social/feed'
          }
        ]
      },

      // // Blog. Esto no lo debe ver el cliente.
      // {
      //   title: t('Blog'),
      //   path: '/blog',
      //   icon: <NewspaperIcon fontSize="small" />,
      //   children: [
      //     {
      //       title: t('Post List'),
      //       path: '/blog'
      //     },
      //     {
      //       title: t('Post Details'),
      //       path: '/blog/1'
      //     },
      //     {
      //       title: t('Post Create'),
      //       path: '/blog/new'
      //     }
      //   ]
      // }
    ]
  },
  {
    title: t('Apps'),
    items: [

      // // Página de "Kanban". Esto no lo debe ver el cliente.
      // {
      //   title: t('Kanban'),
      //   path: '/dashboard/kanban',
      //   icon: <ClipboardListIcon fontSize="small" />
      // },

      // // Página de "Mail". Por los momentos, lo quitaré.
      // {
      //   title: t('Mail'),
      //   path: '/dashboard/mail',
      //   icon: <MailIcon fontSize="small" />
      // },

      // // Página de "Chat". Por los momentos, lo quitaré.
      // {
      //   title: t('Chat'),
      //   path: '/dashboard/chat',
      //   icon: <ChatAlt2Icon fontSize="small" />
      // },

      // Calendario. Quiero que el Cliente vea su propio calendario, por lo que pondré /customercalendaar
      {
        title: t('Calendar'),
        path: '/dashboard/customercalendar',
        icon: <CalendarIcon fontSize="small" />
      }
    ]
  },

  // {
  //   title: t('Pages'),
  //   items: [
  //
  //     // // Esto te permite registrarte y loguearte. Ahora, esto me es inútil, ya que esto solo lo puede ver alguien
  //     // // logueado.
  //     // {
  //     //   title: t('Auth'),
  //     //   path: '/authentication',
  //     //   icon: <LockClosedIcon fontSize="small" />,
  //     //   children: [
  //     //     {
  //     //       title: t('Register'),
  //     //       path: '/authentication/register?disableGuard=true'
  //     //     },
  //     //     {
  //     //       title: t('Login'),
  //     //       path: '/authentication/login?disableGuard=true'
  //     //     }
  //     //   ]
  //     // },
  //     // {
  //     //   title: t('Pricing'),
  //     //   path: '/dashboard/pricing',
  //     //   icon: <CreditCardIcon fontSize="small" />
  //     // },
  //
  //     // // Página de Pago. Ahorita, esto no sirve, por lo que voy a desactivarlo.
  //     // {
  //     //   title: t('Checkout'),
  //     //   path: '/checkout',
  //     //   icon: <CashIcon fontSize="small" />
  //     // },
  //
  //     // // Página de Contacto. Ahorita, esto no sirve, por lo que voy a desactivarlo.
  //     // {
  //     //   title: t('Contact'),
  //     //   path: '/contact',
  //     //   icon: <MailOpenIcon fontSize="small" />
  //     // },
  //
  //     // // Enlaces a páginas de errores. Esto no tiene que verlo el cliente.
  //     // {
  //     //   title: t('Error'),
  //     //   path: '/error',
  //     //   icon: <XCircleIcon fontSize="small" />,
  //     //   children: [
  //     //     {
  //     //       title: '401',
  //     //       path: '/401'
  //     //     },
  //     //     {
  //     //       title: '404',
  //     //       path: '/404'
  //     //     },
  //     //     {
  //     //       title: '500',
  //     //       path: '/500'
  //     //     }
  //     //   ]
  //     // }
  //   ]
  // }
];

export const DashboardSidebar = (props) => {
  const { onClose, open } = props;
  const router = useRouter();
  const { t } = useTranslation();
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'), {
    noSsr: true
  });
  const sections = useMemo(() => getSections(t), [t]);
  const organizationsRef = useRef(null);
  const [openOrganizationsPopover, setOpenOrganizationsPopover] = useState(false);

  // State for user data
  const [user, setUser] = useState(null);

  /* Este useEffect() contiene la API para obtener los detalles del usuario autenticado del JWT Token.
  *
  * Usaré esto para agarrar los datos del Cliente Autenticado para así poder imprimir su nombre en la Barra de
  * Navegación lateral.
  *
  * Esto es porque quiero que se imprima el mensaje "¡Bienvenido Nombre_de_Cliente!" en la barra de navegación lateral.
  *
  * You can add the API call in the DashboardSidebar component. You can place the useEffect hook at the beginning of the
  * component, right after the state declarations. This code will fetch the user details when the DashboardSidebar
  * component is mounted and store the user data in the user state variable.
  * */
  useEffect(() => {
    const fetchUserDetails = async () => {
      const accessToken = localStorage.getItem('accessToken');

      if (accessToken) {
        try {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_ROOT}/auth/users/me/`,
            {headers: { Authorization: `JWT ${accessToken}`}}
          );
          const userData = response.data;

          // Set the user data to the user state variable
          setUser(userData);

          // // Print the user's username to the console. DEBUGGEO. BORRAR DESPUÉS.
          // console.log(`User Name: ${userData.username}`);
        } catch (error) {
          console.error('Error fetching user details:', error);
        }
      }
    };

    fetchUserDetails();
  }, []);


  const handlePathChange = () => {
    if (!router.isReady) {
      return;
    }

    if (open) {
      onClose?.();
    }
  };

  useEffect(handlePathChange,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [router.isReady, router.asPath]);

  const handleOpenOrganizationsPopover = () => {
    setOpenOrganizationsPopover(true);
  };

  const handleCloseOrganizationsPopover = () => {
    setOpenOrganizationsPopover(false);
  };

  /* Esto imprime el HTML de la Barra de Navegación Lateral.
  *
  * You can replace the hardcoded string 'Administrador' with the username from the API call. You have already stored
  * the user data in the user state variable. You can access the username with user.username. In this updated code, if
  * the user state variable is not null, it will display "¡Bienvenido, [username]!". If the user state variable is null
  * (which means the user data is still being fetched), it will display "Loading...".
  *
  * Voy a imprimir el nombre del Cliente en el mensaje "¡Bienvenido!" que sale en la barra de navegación lateral.
  * */
  const content = (
    <>
      <Scrollbar
        sx={{
          height: '100%',
          '& .simplebar-content': {
            height: '100%'
          }
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%'
          }}
        >
          <div>
            <Box sx={{ p: 3 }}>
              <NextLink
                href="/"
                passHref
              >
                <a>
                  <Logo
                    sx={{
                      height: 42,
                      width: 42
                    }}
                  />
                </a>
              </NextLink>
            </Box>
            <Box sx={{ px: 2 }}>
              <Box
                onClick={handleOpenOrganizationsPopover}
                ref={organizationsRef}
                sx={{
                  alignItems: 'center',
                  backgroundColor: 'rgba(255, 255, 255, 0.04)',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  px: 3,
                  py: '11px',
                  borderRadius: 1
                }}
              >
                <div>

                  {/* This will print the name of the Gym. I WILL CHANGE IT LATER. */}
                  <Typography
                    color="inherit"
                    variant="subtitle1"
                  >
                    Eduardo's Gym
                  </Typography>

                  {/* Esto imprime el mensaje "Bienvenido, Cliente" en la parte superior del Navbar Lateral. */}

                  <Typography
                    color="neutral.400"
                    variant="body2"
                  >
                    {/*{t('¡Bienvenido, Administrador!')}*/}
                    {user ? `¡Bienvenido, ${user.username}!` : 'Loading...'}
                  </Typography>
                </div>
                <SelectorIcon
                  sx={{
                    color: 'neutral.500',
                    width: 14,
                    height: 14
                  }}
                />
              </Box>
            </Box>
          </div>
          <Divider
            sx={{
              borderColor: '#2D3748',
              my: 3
            }}
          />
          <Box sx={{ flexGrow: 1 }}>
            {sections.map((section) => (
              <DashboardSidebarSection
                key={section.title}
                path={router.asPath}
                sx={{
                  mt: 2,
                  '& + &': {
                    mt: 2
                  }
                }}
                {...section} />
            ))}
          </Box>
          <Divider
            sx={{
              borderColor: '#2D3748'  // dark divider
            }}
          />

          {/* Enlace a la documentación de Material UI. Esto NO lo debe ver el cliente. */}
          {/*<Box sx={{ p: 2 }}>*/}
          {/*  <Typography*/}
          {/*    color="neutral.100"*/}
          {/*    variant="subtitle2"*/}
          {/*  >*/}
          {/*    {t('Need Help?')}*/}
          {/*  </Typography>*/}
          {/*  <Typography*/}
          {/*    color="neutral.500"*/}
          {/*    variant="body2"*/}
          {/*  >*/}
          {/*    {t('Check our docs')}*/}
          {/*  </Typography>*/}
          {/*  <NextLink*/}
          {/*    href="/docs/welcome"*/}
          {/*    passHref*/}
          {/*  >*/}
          {/*    <Button*/}
          {/*      color="secondary"*/}
          {/*      component="a"*/}
          {/*      fullWidth*/}
          {/*      sx={{ mt: 2 }}*/}
          {/*      variant="contained"*/}
          {/*    >*/}
          {/*      {t('Documentation')}*/}
          {/*    </Button>*/}
          {/*  </NextLink>*/}
          {/*</Box>*/}
          {/*Fin del Enlace a la Documentación de Material UI. Esto NO lo debe ver el cliente.*/}
        </Box>
      </Scrollbar>
      <OrganizationPopover
        anchorEl={organizationsRef.current}
        onClose={handleCloseOrganizationsPopover}
        open={openOrganizationsPopover}
      />
    </>
  );

  if (lgUp) {
    return (
      <Drawer
        anchor="left"
        open
        PaperProps={{
          sx: {
            backgroundColor: 'neutral.900',
            borderRightColor: 'divider',
            borderRightStyle: 'solid',
            borderRightWidth: (theme) => theme.palette.mode === 'dark' ? 1 : 0,
            color: '#FFFFFF',
            width: 280
          }
        }}
        variant="permanent"
      >
        {content}
      </Drawer>
    );
  }

  return (
    <Drawer
      anchor="left"
      onClose={onClose}
      open={open}
      PaperProps={{
        sx: {
          backgroundColor: 'neutral.900',
          color: '#FFFFFF',
          width: 280
        }
      }}
      sx={{ zIndex: (theme) => theme.zIndex.appBar + 100 }}
      variant="temporary"
    >
      {content}
    </Drawer>
  );
};

DashboardSidebar.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool
};
