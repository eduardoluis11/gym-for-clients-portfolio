import { useCallback, useEffect, useState } from 'react';
import {useRouter} from 'next/router'
import NextLink from 'next/link';
import Head from 'next/head';
import { Avatar, Box, Chip, Container, Link, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { subscriptionApi } from '../../../api/subscription-api';
import { groupApi } from '../../../api/group-api';
import { DashboardLayout } from '../../../components/dashboard/dashboard-layout';
import { SubscriptionEditForm } from '../../../components/subscriptions/subscription-edit-form';
import { useMounted } from '../../../hooks/use-mounted';
import { gtm } from '../../../lib/gtm';
import { getInitials } from '../../../utils/get-initials';
const Subscription = (props) => {
  const isMounted = useMounted();
  const [subscription, setSubscription] = useState(null);
  const [groups, setGroups] =useState([])
  const {subscriptionId} = props
  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  /* Página que Renderiza el Formulario para Editar una Suscripción, el cual se encuentra en la URL
  * /subscriptions/id_de_la_suscripcion .
  *
  * El Formulario para Modificar una Suscripción se encuentra en el componente SubscriptionEditForm, el cual llama
  * al archivo subscription-edit-form.js. Este archivo se encuentra en la carpeta src/components/subscriptions.
  *
  * */


  const getSubscription = useCallback(async () => {
    try {
      const data = await subscriptionApi.getSubscription(subscriptionId);
      const data2 = await groupApi.getGroups();


      // BUGFIX: Esto no me dejaba agarrar el first rate referral porque estaba escrito como "first DATE deferral"
      if (isMounted()) {
        setSubscription({created_at:data.created_at,
          first_rate_defferal:data.first_rate_defferal,
          groups:data.groups,
          gym:data.gym,
          id:data.id,
          is_active:data.is_active,
          name:data.name,
          price:data.price,
          price_id_stripe:data.price_id_stripe,
          updated_at:data.updated_at,
          formikGroups: data2.filter(group => data.groups.includes(group.id))})

      }
    } catch (err) {
      console.error(err);
    }
  }, [isMounted, subscriptionId]);

  useEffect(() => {
      getSubscription(subscriptionId);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []);


  if (!subscription) {
    return null;
  }

  return (
    <>
      <Head>
        <title>
          Dashboard: Subscriptions | Modificar
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
              href="/subscriptions"
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
                  Subscriptions
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
            <div>
              <Typography
                noWrap
                variant="h4"
              >
                {subscription.name}
              </Typography>
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
                  label={subscription.id}
                  size="small"
                  sx={{ ml: 1 }}
                />
              </Box>
            </div>
          </Box>
          <Box mt={3}>
            <SubscriptionEditForm subscription={subscription} />
          </Box>
        </Container>
      </Box>
    </>
  );
};

Subscription.getLayout = (page) => (
    <DashboardLayout>
      {page}
    </DashboardLayout>
);

export default Subscription;

export async function getServerSideProps(ctx) {
  const { subscriptionId } = ctx.query;
  return {
    props: {
      subscriptionId,
    },
  };
}