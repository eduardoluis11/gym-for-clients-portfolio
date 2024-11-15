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
import { productApi } from '../../api/product-api';
import { DashboardLayout } from '../../components/dashboard/dashboard-layout';
import { ProductListTable } from '../../components/products/product-list-table';
import { useMounted } from '../../hooks/use-mounted';
import { Download as DownloadIcon } from '../../icons/download';
import { Plus as PlusIcon } from '../../icons/plus';
import { Search as SearchIcon } from '../../icons/search';
import { Upload as UploadIcon } from '../../icons/upload';
import { gtm } from '../../lib/gtm';
import toast from 'react-hot-toast';
// TODO: Añadir los filtros con el componente y la lógica de product-list-filters para filtrar por actividades
const tabs = [
  {
    label: 'All',
    value: 'all'
  }
];

const sortOptions = [
  {
    label: 'Last update (newest)',
    value: 'updatedAt|desc'
  },
];

const applyFilters = (customers, filters) => customers.filter((customer) => {
  if (filters.query) {
    let queryMatched = false;
    const properties = ['buyer'];

    properties.forEach((property) => {
      if ((customer[property]).toLowerCase().includes(filters.query.toLowerCase())) {
        queryMatched = true;
      }
    });

    if (!queryMatched) {
      return false;
    }
  }

  if (filters.hasAcceptedMarketing && !customer.hasAcceptedMarketing) {
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

const ProductList = () => {
  const isMounted = useMounted();
  const queryRef = useRef(null);
  const [products, setProducts] = useState([]);
  const [currentTab, setCurrentTab] = useState('all');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sort, setSort] = useState(sortOptions[0].value);
  const [filters, setFilters] = useState({
    query: '',
    hasAcceptedMarketing: undefined,
    isProspect: undefined,
    isReturning: undefined
  });

  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  const getProducts = useCallback(async () => {
    try {
      const data = await productApi.getProducts();

      if (isMounted()) {
        setProducts(data);
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMounted]);

  useEffect(() => {
      getProducts();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []);

  const handleTabsChange = (event, value) => {
    const updatedFilters = {
      ...filters,
      hasAcceptedMarketing: undefined,
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
      query: queryRef.current?.value
    }));
  };

  const handleSortChange = (event) => {
    setSort(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  // Usually query is done on backend with indexing solutions
  const filteredCustomers = applyFilters(products, filters);
  const sortedCustomers = applySort(filteredCustomers, sort);
  const paginatedCustomers = applyPagination(sortedCustomers, page, rowsPerPage);

  const handleDelete = async (id) => {
    try {
      await productApi.deleteProduct(id)
      toast.success('Producto borrado con éxito!');
      getProducts()
    } catch (err) {
      console.error(err);
      toast.error('Error en la actualización, los datos no se han modificado');
    }
  }

  return (
    <>
      <Head>
        <title>
          Dashboard: Listado de products
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
                  Productos
                </Typography>
              </Grid>

              {/*Boton para crear un nuevo producto. ELIMINAR ESTO*/}
              {/*<Grid item>*/}
              {/*  <NextLink href="/products/new">*/}
              {/*  <Button*/}
              {/*    startIcon={<PlusIcon fontSize="small" />}*/}
              {/*    variant="contained"*/}
              {/*  >*/}
              {/*    Añadir*/}
              {/*  </Button>*/}
              {/*</NextLink>*/}
              {/*</Grid>*/}

            </Grid>

            {/*Esto me pone los enlaces de importar y exportar. ELIMINAR, PORQUE NO SE VA A USAR*/}
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

            {/*Barra de Bésqueda y Filtros.*/}
            {/*ELIMINAR porque, pro los momentos, NO SIRVE.*/}
            {/*<Box*/}
            {/*  sx={{*/}
            {/*    alignItems: 'center',*/}
            {/*    display: 'flex',*/}
            {/*    flexWrap: 'wrap',*/}
            {/*    m: -1.5,*/}
            {/*    p: 3*/}
            {/*  }}*/}
            {/*> */}
              {/*Buscador para buscar un Producto de la Lista de Productos*/}
            {/*  <Box*/}
            {/*    component="form"*/}
            {/*    onSubmit={handleQueryChange}*/}
            {/*    sx={{*/}
            {/*      flexGrow: 1,*/}
            {/*      m: 1.5*/}
            {/*    }}*/}
            {/*  >*/}
            {/*    <TextField*/}
            {/*      defaultValue=""*/}
            {/*      fullWidth*/}
            {/*      inputProps={{ ref: queryRef }}*/}
            {/*      InputProps={{*/}
            {/*        startAdornment: (*/}
            {/*          <InputAdornment position="start">*/}
            {/*            <SearchIcon fontSize="small" />*/}
            {/*          </InputAdornment>*/}
            {/*        )*/}
            {/*      }}*/}
            {/*      placeholder="Buscar producto"*/}
            {/*    />*/}
            {/*  </Box>*/}
            {/*  <TextField*/}
            {/*    label="Sort By"*/}
            {/*    name="sort"*/}
            {/*    onChange={handleSortChange}*/}
            {/*    select*/}
            {/*    SelectProps={{ native: true }}*/}
            {/*    sx={{ m: 1.5 }}*/}
            {/*    value={sort}*/}
            {/*  >*/}
            {/*    {sortOptions.map((option) => (*/}
            {/*      <option*/}
            {/*        key={option.value}*/}
            {/*        value={option.value}*/}
            {/*      >*/}
            {/*        {option.label}*/}
            {/*      </option>*/}
            {/*    ))}*/}
            {/*  </TextField>*/}
            {/*</Box>*/}

            <ProductListTable
              customers={paginatedCustomers}
              customersCount={filteredCustomers.length}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              rowsPerPage={rowsPerPage}
              page={page}
              handleDelete={handleDelete}
            />
          </Card>
        </Container>
      </Box>
    </>
  );
};

ProductList.getLayout = (page) => (
    <DashboardLayout>
      {page}
    </DashboardLayout>
);

export default ProductList;
