import { useCallback, useEffect, useState } from 'react';
import {useRouter} from 'next/router'
import NextLink from 'next/link';
import Head from 'next/head';
import { Avatar, Box, Chip, Container, Link, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { saleApi } from '../../../api/sale-api';
import { DashboardLayout } from '../../../components/dashboard/dashboard-layout';
import { ProfitEditForm } from '../../../components/profit/profit-edit-form';
import { useMounted } from '../../../hooks/use-mounted';
import { gtm } from '../../../lib/gtm';
import { getInitials } from '../../../utils/get-initials';
import { AuthGuard } from '../../../components/authentication/auth-guard';

const Profit = (props) => {
  const isMounted = useMounted();
  const [sale, setSale] = useState(null);
  const {profitId} = props
  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);


  const getSale = useCallback(async () => {
    try {
      const data = await saleApi.getSale(profitId);
      
      if (isMounted()) {
        setSale(data);
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMounted, profitId]);

  useEffect(() => {
      getSale(profitId);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []);

  if (!sale) {
    return null;
  }

  return (
    <>
      <Head>
        <title>
          Dashboard: Ingreso | Ver
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
              href="/profits"
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
                  Ingresos
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
                {sale.id}
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
                  label={sale.id}
                  size="small"
                  sx={{ ml: 1 }}
                />
              </Box>
            </div>
          </Box>
          <Box mt={3}>
            <ProfitEditForm sale={sale} />
          </Box>
        </Container>
      </Box>
    </>
  );
};

Profit.getLayout = (page) => (
  <AuthGuard>
    <DashboardLayout>
      {page}
    </DashboardLayout>
  </AuthGuard>
);

export default Profit;

export async function getServerSideProps(ctx) {
  const { profitId } = ctx.query;
  return {
    props: {
      profitId,
    },
  };
}