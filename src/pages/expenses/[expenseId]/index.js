import { useCallback, useEffect, useState } from 'react';
import {useRouter} from 'next/router'
import NextLink from 'next/link';
import Head from 'next/head';
import { Avatar, Box, Chip, Container, Link, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { expenseApi } from '../../../api/expense-api';
import { DashboardLayout } from '../../../components/dashboard/dashboard-layout';
import { ExpenseEditForm } from '../../../components/expense/expense-edit-form';
import { useMounted } from '../../../hooks/use-mounted';
import { gtm } from '../../../lib/gtm';
import { getInitials } from '../../../utils/get-initials';
import { AuthGuard } from '../../../components/authentication/auth-guard';

const Expense = (props) => {
  const isMounted = useMounted();
  const [expense, setExpense] = useState(null);
  const {expenseId} = props
  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);


  const getExpense = useCallback(async () => {
    try {
      const data = await expenseApi.getExpense(expenseId);
      // call API to set the requested expense
      
      if (isMounted()) {
        setExpense(data);
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMounted, expenseId]);

  useEffect(() => {
      getExpense(expenseId);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []);

  if (!expense) {
    return null;
  }

  return (
    <>
      <Head>
        <title>
          Dashboard: Actividad | Modificar
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
              href="/expenses"
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
                  Actividades
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
                {expense.name}
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
                  label={expense.id}
                  size="small"
                  sx={{ ml: 1 }}
                />
              </Box>
            </div>
          </Box>
          <Box mt={3}>
            <ExpenseEditForm expense={expense} />
          </Box>
        </Container>
      </Box>
    </>
  );
};

Expense.getLayout = (page) => (
  <AuthGuard>
    <DashboardLayout>
      {page}
    </DashboardLayout>
  </AuthGuard>
);

export default Expense;

export async function getServerSideProps(ctx) {
  const { expenseId } = ctx.query;
  return {
    props: {
      expenseId,
    },
  };
}