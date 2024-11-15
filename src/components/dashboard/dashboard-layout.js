import { useState } from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { DashboardNavbar } from './dashboard-navbar';
import { DashboardSidebar } from './dashboard-sidebar';
import { Box } from '@mui/material';
import PushNotificationButton from "../PushNotificationButton";

/* Esta es la disposición o "layout" de TODA la web app de Clientes, NO solo de la página en la URL de /dashboard.
*
* Meteré aquí el componente de PushNotificationButton para que me aparezca en todas las páginas de la web app de
* Clientes la notificación push pidiéndole al Cliente que si acepta el Consentimiento para recibir Notificaciones
* Push.
* */

const DashboardLayoutRoot = styled('div')(({ theme }) => ({
  display: 'flex',
  flex: '1 1 auto',
  maxWidth: '100%',
  paddingTop: 64,
  [theme.breakpoints.up('lg')]: {
    paddingLeft: 280
  }
}));

export const DashboardLayout = (props) => {
  const { children } = props;
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <>
      <DashboardLayoutRoot>
        <Box
          sx={{
            display: 'flex',
            flex: '1 1 auto',
            flexDirection: 'column',
            width: '100%'
          }}
        >

          {/*TAL VEZ LO VAYA A ACTIVAR OTRA VEZ DESPUÉS.*/}
          {/*/!* Esto hará que me aparezca la Notificación Push para pedirle el Consentimiento de Firebase al Cliente *!/*/}
          {/*<PushNotificationButton />*/}


          {children}
        </Box>
      </DashboardLayoutRoot>
      <DashboardNavbar onOpenSidebar={() => setIsSidebarOpen(true)} />
      <DashboardSidebar
        onClose={() => setIsSidebarOpen(false)}
        open={isSidebarOpen}
      />
    </>
  );
};

DashboardLayout.propTypes = {
  children: PropTypes.node
};
