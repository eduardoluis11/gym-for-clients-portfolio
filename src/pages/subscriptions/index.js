import { useCallback, useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import NextLink from "next/link";
import {
  Box,
  Button,
  Card,
  Container,
  Divider,
  Grid,
  InputAdornment,
  Tab,
  Tabs,
  TextField,
  Typography
} from '@mui/material';
import { subscriptionApi } from '../../api/subscription-api';
import { DashboardLayout } from '../../components/dashboard/dashboard-layout';
import { SubscriptionListTable } from '../../components/subscriptions/subscription-list-table';
import { useMounted } from '../../hooks/use-mounted';
import { Download as DownloadIcon } from '../../icons/download';
import { Plus as PlusIcon } from '../../icons/plus';
import { Search as SearchIcon } from '../../icons/search';
import { Upload as UploadIcon } from '../../icons/upload';
import { gtm } from '../../lib/gtm';

/* Página con la Lista de Cuotas.
*
* EDITÉ esta página para que el Cliente NO pueda crear nuevas cuotas, ni importar ni exportar servicios, ni tampoco
* pueda eliminarlas.
*
* Adicionalmente, EDITÉ esta página para que el Cliente NO pueda buscar ni filtrar cuotas en la barra de búsqueda, ya
* que la barra de búsqueda no funciona, y da un error si intentas hacer una búsqueda.
* */

// TODO: Añadir los filtros con el componente y la lógica de product-list-filters para filtrar por actividades
const tabs = [
  {
    label: 'Todos',
    value: 'all'
  },
  {
    label: 'Solo cuotas activas',
    value: 'is_active'
  },
];

const sortOptions = [
  {
    label: 'Last update (newest)',
    value: 'updated_at|desc'
  },
  {
    label: 'Last update (oldest)',
    value: 'updated_at|asc'
  },
  {
    label: 'Price (highest)',
    value: 'price|desc'
  },
  {
    label: 'Price (lowest)',
    value: 'price|asc'
  },
];

const applyFilters = (customers, filters) => customers.filter((customer) => {
  if (filters.query) {
    let queryMatched = false;
    const properties = ['name'];

    properties.forEach((property) => {
      if ((customer[property]).toLowerCase().includes(filters.query.toLowerCase())) {
        queryMatched = true;
      }
    });

    if (!queryMatched) {
      return false;
    }
  }

  if (filters.is_active && !customer.is_active) {
    return false;
  }

  if (filters.isProspect && !customer.isProspect) {
    return false;
  }

  if (filters.isReturning && !customer.isReturning) {
    return false;
  }

  return true;
});

const descendingComparator = (a, b, sortBy) => {
  // When compared to something undefined, always returns false.
  // This means that if a field does not exist from either element ('a' or 'b') the return will be 0.

  if (b[sortBy] < a[sortBy]) {
    return -1;
  }

  if (b[sortBy] > a[sortBy]) {
    return 1;
  }

  return 0;
};

const getComparator = (sortDir, sortBy) => (sortDir === 'desc'
  ? (a, b) => descendingComparator(a, b, sortBy)
  : (a, b) => -descendingComparator(a, b, sortBy));

const applySort = (customers, sort) => {
  const [sortBy, sortDir] = sort.split('|');
  const comparator = getComparator(sortDir, sortBy);
  const stabilizedThis = customers.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const newOrder = comparator(a[0], b[0]);

    if (newOrder !== 0) {
      return newOrder;
    }

    return a[1] - b[1];
  });

  return stabilizedThis.map((el) => el[0]);
};

const applyPagination = (customers, page, rowsPerPage) => customers.slice(page * rowsPerPage,
  page * rowsPerPage + rowsPerPage);

const SubscriptionList = () => {
  const isMounted = useMounted();
  const queryRef = useRef(null);
  const [subscriptions, setSubscriptions] = useState([]);
  const [currentTab, setCurrentTab] = useState('all');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sort, setSort] = useState(sortOptions[0].value);
  const [filters, setFilters] = useState({
    query: '',
    is_active: undefined,
    isProspect: undefined,
    isReturning: undefined
  });
  const [search, setSearch] = useState('')

  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  const getSubscriptions = useCallback(async () => {
    try {
      const data = await subscriptionApi.getSubscriptions();

      if (isMounted()) {
        setSubscriptions(data);
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMounted]);

  useEffect(() => {
      getSubscriptions();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []);

  const handleTabsChange = (event, value) => {
    const updatedFilters = {
      ...filters,
      is_active: undefined,
      isProspect: undefined,
      isReturning: undefined
    };

    if (value !== 'all') {
      updatedFilters[value] = true;
    }

    setFilters(updatedFilters);
    setCurrentTab(value);
  };

  const handleQueryChange = (event) => {
    event.preventDefault();
    setFilters((prevState) => ({
      ...prevState,
      query: search
    }));
  };

  const handleSortChange = (event) => {
    setSort(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  // Usually query is done on backend with indexing solutions
  const filteredCustomers = applyFilters(subscriptions, filters);
  const sortedCustomers = applySort(filteredCustomers, sort);
  const paginatedCustomers = applyPagination(sortedCustomers, page, rowsPerPage);

  return (
    <>
      <Head>
        <title>
          Dashboard: Listado de subscriptions
        </title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8
        }}
      >
        <Container maxWidth="xl">
          <Box sx={{ mb: 4 }}>
            <Grid
              container
              justifyContent="space-between"
              spacing={3}
            >
              <Grid item>
                <Typography variant="h4">
                  Cuotas
                </Typography>
              </Grid>


              {/* Botón de "Añadir". BORRAR. */}
              {/*<Grid item>*/}
              {/*  <NextLink href="/subscriptions/new">*/}
              {/*    <Button*/}
              {/*      startIcon={<PlusIcon fontSize="small" />}*/}
              {/*      variant="contained"*/}
              {/*    >*/}
              {/*      Añadir*/}
              {/*    </Button>*/}
              {/*  </NextLink>*/}
              {/*</Grid>*/}


            </Grid>

            {/* Botones de "Import" y "Export". BORRAR. */}
            {/*<Box*/}
            {/*  sx={{*/}
            {/*    m: -1,*/}
            {/*    mt: 3*/}
            {/*  }}*/}
            {/*>*/}
            {/*  <Button*/}
            {/*    startIcon={<UploadIcon fontSize="small" />}*/}
            {/*    sx={{ m: 1 }}*/}
            {/*  >*/}
            {/*    Import*/}
            {/*  </Button>*/}
            {/*  <Button*/}
            {/*    startIcon={<DownloadIcon fontSize="small" />}*/}
            {/*    sx={{ m: 1 }}*/}
            {/*  >*/}
            {/*    Export*/}
            {/*  </Button>*/}
            {/*</Box>*/}
            {/* Fin de Botones de "Import" y "Export". BORRAR. */}


          </Box>
          <Card>
            <Tabs
              indicatorColor="primary"
              onChange={handleTabsChange}
              scrollButtons="auto"
              sx={{ px: 3 }}
              textColor="primary"
              value={currentTab}
              variant="scrollable"
            >
              {tabs.map((tab) => (
                <Tab
                  key={tab.value}
                  label={tab.label}
                  value={tab.value}
                />
              ))}
            </Tabs>
            <Divider />

            {/* Búsqueda y Filtros de Cuotas. La dejaré ya que sí funciona. */}
            <Box
              sx={{
                alignItems: 'center',
                display: 'flex',
                flexWrap: 'wrap',
                m: -1.5,
                p: 3
              }}
            >
              <Box
                component="form"
                onSubmit={handleQueryChange}
                sx={{
                  flexGrow: 1,
                  m: 1.5
                }}
              >
                <TextField
                  defaultValue=""
                  fullWidth
                  inputProps={{ ref: queryRef }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon fontSize="small" />
                      </InputAdornment>
                    )
                  }}
                  placeholder="Buscar"
                  onChange={handleSearchChange}
                />
              </Box>
              <TextField
                label="Sort By"
                name="sort"
                onChange={handleSortChange}
                select
                SelectProps={{ native: true }}
                sx={{ m: 1.5 }}
                value={sort}
              >
                {sortOptions.map((option) => (
                  <option
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </option>
                ))}
              </TextField>
            </Box>
            {/* Fin de la Búsqueda y Filtros de Cuotas. */}

            <SubscriptionListTable
              subscriptions={paginatedCustomers}
              subscriptionsCount={filteredCustomers.length}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              rowsPerPage={rowsPerPage}
              page={page}
            />
          </Card>
        </Container>
      </Box>
    </>
  );
};

SubscriptionList.getLayout = (page) => (
    <DashboardLayout>
      {page}
    </DashboardLayout>
);

export default SubscriptionList;
