import { useCallback, useEffect, useState } from 'react';
import {useRouter} from 'next/router'
import NextLink from 'next/link';
import Head from 'next/head';
import { Avatar, Box, Chip, Container, Link, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { serviceApi } from '../../../api/service-api';
import { DashboardLayout } from '../../../components/dashboard/dashboard-layout';
import { ServiceEditForm } from '../../../components/services/service-edit-form';
import { useMounted } from '../../../hooks/use-mounted';
import { gtm } from '../../../lib/gtm';
import { getInitials } from '../../../utils/get-initials';
const Service = (props) => {
  const isMounted = useMounted();
  const [service, setService] = useState(null);
  const {serviceId} = props
  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);


  const getService = useCallback(async () => {
    try {
      const data = await serviceApi.getService(serviceId);
      
      if (isMounted()) {
        setService(data);
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMounted, serviceId]);

  useEffect(() => {
      getService(serviceId);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []);

  if (!service) {
    return null;
  }

  return (
    <>
      <Head>
        <title>
          Dashboard: Services | Modificar
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
              href="/services"
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
                  Services
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
                {service.name}
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
                  label={service.id}
                  size="small"
                  sx={{ ml: 1 }}
                />
              </Box>
            </div>
          </Box>
          <Box mt={3}>
            <ServiceEditForm service={service} />
          </Box>
        </Container>
      </Box>
    </>
  );
};

Service.getLayout = (page) => (
    <DashboardLayout>
      {page}
    </DashboardLayout>
);

export default Service;

export async function getServerSideProps(ctx) {
  const { serviceId } = ctx.query;
  return {
    props: {
      serviceId,
    },
  };
}