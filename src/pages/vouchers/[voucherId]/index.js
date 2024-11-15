import { useCallback, useEffect, useState } from 'react';
import {useRouter} from 'next/router'
import NextLink from 'next/link';
import Head from 'next/head';
import { Avatar, Box, Chip, Container, Link, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { voucherApi } from '../../../api/voucher-api';
import { DashboardLayout } from '../../../components/dashboard/dashboard-layout';
import { VoucherEditForm } from '../../../components/vouchers/voucher-edit-form';
import { useMounted } from '../../../hooks/use-mounted';
import { gtm } from '../../../lib/gtm';
import { getInitials } from '../../../utils/get-initials';
const Voucher = (props) => {
  const isMounted = useMounted();
  const [voucher, setVoucher] = useState(null);
  const {voucherId} = props
  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);


  const getVoucher = useCallback(async () => {
    try {
      const data = await voucherApi.getVoucher(voucherId);
      
      if (isMounted()) {
        setVoucher(data);
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMounted, voucherId]);

  useEffect(() => {
      getVoucher(voucherId);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []);

  if (!voucher) {
    return null;
  }

  return (
    <>
      <Head>
        <title>
          Dashboard: Vouchers | Modificar
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
              href="/vouchers"
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
                  Vouchers
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
                {voucher.name}
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
                  label={voucher.id}
                  size="small"
                  sx={{ ml: 1 }}
                />
              </Box>
            </div>
          </Box>
          <Box mt={3}>
            <VoucherEditForm voucher={voucher} />
          </Box>
        </Container>
      </Box>
    </>
  );
};

Voucher.getLayout = (page) => (
    <DashboardLayout>
      {page}
    </DashboardLayout>
);

export default Voucher;

export async function getServerSideProps(ctx) {
  const { voucherId } = ctx.query;
  return {
    props: {
      voucherId,
    },
  };
}