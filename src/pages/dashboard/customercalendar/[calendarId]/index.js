import { useCallback, useEffect, useRef, useState } from 'react';
import Head from 'next/head';
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
import { calendarApi } from '../../../../api/calendar-api';
import { customerApi } from '../../../../api/customer-api';
import { AuthGuard } from '../../../../components/authentication/auth-guard';
import { DashboardLayout } from '../../../../components/dashboard/dashboard-layout';
//import { CustomerListTable } from '../../../../components/dashboard/customercalendar/customer-list-table';
import { useMounted } from '../../../../hooks/use-mounted';
import { Download as DownloadIcon } from '../../../../icons/download';
import { Plus as PlusIcon } from '../../../../icons/plus';
import { Search as SearchIcon } from '../../../../icons/search';
import { Upload as UploadIcon } from '../../../../icons/upload';
import { gtm } from '../../../../lib/gtm';
import { useDispatch, useSelector } from '../../../../store';
import { getEvents, updateEvent } from '../../../../thunks/calendar';
import { useAuth } from '../../../../hooks/use-auth';

const tabs = [
  {
    label: 'All',
    value: 'all'
  },
  {
    label: 'Accepts Marketing',
    value: 'hasAcceptedMarketing'
  },
  {
    label: 'Prospect',
    value: 'isProspect'
  },
  {
    label: 'Returning',
    value: 'isReturning'
  }
];

const sortOptions = [
  {
    label: 'Last update (newest)',
    value: 'updatedAt|desc'
  },
  {
    label: 'Last update (oldest)',
    value: 'updatedAt|asc'
  },
  {
    label: 'Total orders (highest)',
    value: 'totalOrders|desc'
  },
  {
    label: 'Total orders (lowest)',
    value: 'totalOrders|asc'
  }
];



//TODO: NO FUNCIONA LA TAB CUANDO QUIERO VER SOLO LOS CLIENTES FILTRADOS POR EL CURRENTEVENT (PARECE QUE EL CURRENT EVENT QUE SE PASA A LA FUNCION APPLY FILTERS NO CONTIENE LOS CUSTOMERS ACTUALIZADOS)

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

const CustomerList = (props) => {
  const isMounted = useMounted();
  const queryRef = useRef(null);
  const [customers, setCustomers] = useState([]);
  const [currentTab, setCurrentTab] = useState('all');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sort, setSort] = useState(sortOptions[0].value);
  const [selCustomers, setSelCustomers] = useState([]);
  const dispatch = useDispatch();
  const { events } = useSelector((state) => state.calendar);
  const [currentEvent, setCurrentEvent] = useState(null)
  const [paginatedCustomers, setPaginatedCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const auth = useAuth();

  const {calendarId} = props

  const [filters, setFilters] = useState({
    query: '',
    hasAcceptedMarketing: undefined,
    isProspect: undefined,
    isReturning: undefined
  });

  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  const applyFilters = (customers, filters, booked) => customers.filter((customer) => {
    if (filters.query) {
      let queryMatched = false;
      const properties = ['email', 'name'];

      properties.forEach((property) => {
        if ((customer[property]).toLowerCase().includes(filters.query.toLowerCase())) {
          queryMatched = true;
        }
      });

      if (!queryMatched) {
        return false;
      }
    }

    if (filters.hasAcceptedMarketing && !(currentEvent.participants.includes(customer.id))) {
      console.log(booked)
      return false;
    }

    if (filters.isProspect && !currentEvent.assisted_participants.includes(customer.id)) {
      return false;
    }

    if (filters.isReturning && !currentEvent.late_participants.includes(customer.id)) {
      return false;
    }

    return true;
  });


  const getCustomers = useCallback(async () => {
    try {
      const data = await customerApi.getCustomers();

      if (isMounted()) {
        setCustomers(data);
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMounted]);

  useEffect(() => {
      getCustomers();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []);
  useEffect(() => {
      dispatch(getEvents());
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []);

  const getEvent = useCallback(async () => {
    try {
      const data = await calendarApi.getEvent(calendarId);
      setCurrentEvent(data)

      // call API to set the requested activity

    } catch (err) {
      console.error(err);
    }
  }, [calendarId, setCurrentEvent]);

  useEffect(() => {
      getEvent(calendarId);
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


  const handleSelectedCustomersChange = useCallback((selectedCustomers) => {
    setSelCustomers(selectedCustomers);
  }, []);

  const addCustomerHandler = async () => {
    try {
      await dispatch(updateEvent({
        eventId: calendarId,
        update: {
          customers:  [...new Set([...selCustomers])] //TODO: modificar para no borrar los clientes que ya están apuntados
        }
      }));
      const updatedEventData = await calendarApi.getEvent(calendarId);
      setCurrentEvent(updatedEventData);
      console.log(currentEvent.participants)
      const filtered = applyFilters(customers, filters, currentEvent.participants);
      const sorted = applySort(filtered, sort);
      const paginated = applyPagination(sorted, page, rowsPerPage);
      setFilteredCustomers(sorted);
      setPaginatedCustomers(paginated);
    } catch (err) {
      console.error(err);
    }
  };

  // Usually query is done on backend with indexing solutions

// TODO: revisar si es necesario este useEffect incluyendo el apply filters o se puede dejar como estaba
  useEffect(() => {
    if (currentEvent) {
      const filtered = applyFilters(customers, filters, currentEvent.participants);
      const sorted = applySort(filtered, sort);
      const paginated = applyPagination(sorted, page, rowsPerPage);

      setFilteredCustomers(sorted);
      setPaginatedCustomers(paginated);
    }
  }, [currentEvent, customers, filters, sort, page, rowsPerPage]);

  return (
    <>
      <Head>
        <title>
          Dashboard: Customer List | Material Kit Pro
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
                  title
                </Typography>
              </Grid>
              <Grid item>
                <Button
                  startIcon={<PlusIcon fontSize="small" />}
                  variant="contained"
                  onClick={addCustomerHandler}
                >
                  Añadir clientes
                </Button>
              </Grid>
            </Grid>
            <Box
              sx={{
                m: -1,
                mt: 3
              }}
            >
              <Button
                startIcon={<UploadIcon fontSize="small" />}
                sx={{ m: 1 }}
              >
                Import
              </Button>
              <Button
                startIcon={<DownloadIcon fontSize="small" />}
                sx={{ m: 1 }}
              >
                Export
              </Button>
            </Box>
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
                  placeholder="Search customers"
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

            {/*<CustomerListTable
              customers={paginatedCustomers}
              customersCount={filteredCustomers.length}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              rowsPerPage={rowsPerPage}
              page={page}
              onSelectedCustomersChange={handleSelectedCustomersChange} // Pass the function to handle selected customers change
              selCustomers={selCustomers}
              />*/}
          </Card>
        </Container>
      </Box>
    </>
  );
};

CustomerList.getLayout = (page) => (
    <DashboardLayout>
      {page}
    </DashboardLayout>
);

export default CustomerList;

export async function getServerSideProps(ctx) {
  const { calendarId } = ctx.query;
  return {
    props: {
      calendarId,
    },
  };
}

