import { useCallback, useEffect, useState } from 'react';
import {useRouter} from 'next/router'
import NextLink from 'next/link';
import Head from 'next/head';
import { Avatar, Box, Chip, Container, Link, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { supplierApi } from '../../../api/supplier-api';
import { DashboardLayout } from '../../../components/dashboard/dashboard-layout';
import { SupplierEditForm } from '../../../components/suppliers/supplier-edit-form';
import { useMounted } from '../../../hooks/use-mounted';
import { gtm } from '../../../lib/gtm';
import { getInitials } from '../../../utils/get-initials';
const Supplier = (props) => {
  const isMounted = useMounted();
  const [supplier, setSupplier] = useState(null);
  const {supplierId} = props
  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);


  const getSupplier = useCallback(async () => {
    try {
      const data = await supplierApi.getSupplier(supplierId);
      
      if (isMounted()) {
        setSupplier(data);
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMounted, supplierId]);

  useEffect(() => {
      getSupplier(supplierId);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []);

  if (!supplier) {
    return null;
  }

  return (
    <>
      <Head>
        <title>
          Dashboard: Suppliers | Modificar
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
              href="/suppliers"
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
                  Suppliers
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
                {supplier.name}
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
                  label={supplier.id}
                  size="small"
                  sx={{ ml: 1 }}
                />
              </Box>
            </div>
          </Box>
          <Box mt={3}>
            <SupplierEditForm supplier={supplier} />
          </Box>
        </Container>
      </Box>
    </>
  );
};

Supplier.getLayout = (page) => (
    <DashboardLayout>
      {page}
    </DashboardLayout>
);

export default Supplier;

export async function getServerSideProps(ctx) {
  const { supplierId } = ctx.query;
  return {
    props: {
      supplierId,
    },
  };
}