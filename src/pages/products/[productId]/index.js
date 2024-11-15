import { useCallback, useEffect, useState } from 'react';
import {useRouter} from 'next/router'
import NextLink from 'next/link';
import Head from 'next/head';
import { Avatar, Box, Chip, Container, Link, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { productApi } from '../../../api/product-api';
import { DashboardLayout } from '../../../components/dashboard/dashboard-layout';
import { ProductEditForm } from '../../../components/products/product-edit-form';
import { useMounted } from '../../../hooks/use-mounted';
import { gtm } from '../../../lib/gtm';
import { getInitials } from '../../../utils/get-initials';

/* Página con la Lista de Productos.
*
* */


const Product = (props) => {
  const isMounted = useMounted();
  const [product, setProduct] = useState(null);
  const {productId} = props
  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);



  const getProduct = useCallback(async () => {
    try {
      const data = await productApi.getProduct(productId);
      
      if (isMounted()) {
        setProduct(data);
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMounted, productId]);

  useEffect(() => {
      getProduct(productId);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []);

  if (!product) {
    return null;
  }

  return (
    <>
      <Head>
        <title>
          Dashboard: Productos | Modificar
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
              href="/products"
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
                  Products
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
                {product.name}
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
                  label={product.id}
                  size="small"
                  sx={{ ml: 1 }}
                />
              </Box>
            </div>
          </Box>
          <Box mt={3}>
            <ProductEditForm product={product} />
          </Box>
        </Container>
      </Box>
    </>
  );
};

Product.getLayout = (page) => (
    <DashboardLayout>
      {page}
    </DashboardLayout>
);

export default Product;

export async function getServerSideProps(ctx) {
  const { productId } = ctx.query;
  return {
    props: {
      productId,
    },
  };
}