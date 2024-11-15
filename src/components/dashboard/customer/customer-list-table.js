import { useEffect, useState } from 'react';
import NextLink from 'next/link';
import numeral from 'numeral';
import PropTypes from 'prop-types';
import toast from 'react-hot-toast';
import {
  Avatar,
  Box,
  Button,
  Checkbox,
  IconButton,
  Link,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography
} from '@mui/material';
import { ArrowRight as ArrowRightIcon } from '../../../icons/arrow-right';
import { PencilAlt as PencilAltIcon } from '../../../icons/pencil-alt';
import { getInitials } from '../../../utils/get-initials';
import { Scrollbar } from '../../scrollbar';

export const CustomerListTable = (props) => {
  const {
    customers,
    customersCount,
    onPageChange,
    onRowsPerPageChange,
    page,
    rowsPerPage,
    onSelectedCustomersChange,
    onSignup,
    onSignout,
    onCustomerAssist,
    onCustomerLateCancel,
    selCustomers,
    currentEvent,
    currentTab,
    ...other
  } = props;
  const [selectedCustomers, setSelectedCustomers] = useState([]);

  // Reset selected customers when customers change
  useEffect(() => {
      if (selectedCustomers.length) {
        setSelectedCustomers([]);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [customers]);
  
  useEffect(() => {
      setSelectedCustomers(selCustomers);
    }, [selCustomers]);

    const handleSelectAllCustomers = (event) => {
      const updatedSelectedCustomers = event.target.checked
        ? customers.map((customer) => customer.id)
        : [];
  
      setSelectedCustomers(updatedSelectedCustomers);
      onSelectedCustomersChange(updatedSelectedCustomers);
      props.onCurrentEventChange(currentEvent);
    };
  
    const handleSelectOneCustomer = (event, customerId) => {
      const isSelected = selectedCustomers.includes(customerId);
      let updatedSelectedCustomers;
    
      if (isSelected) {
        updatedSelectedCustomers = selectedCustomers.filter((id) => id !== customerId);
      } else {
        updatedSelectedCustomers = [...selectedCustomers, customerId];
      }
      setSelectedCustomers(updatedSelectedCustomers);
      onSelectedCustomersChange(updatedSelectedCustomers);
      props.onCurrentEventChange(currentEvent);
    };

    const handleLateCancel = () => {
      onCustomerLateCancel(selectedCustomers)
      toast.success('Clientes añadidos alla lista Late Cancel');
      setSelectedCustomers([])
      props.onCurrentEventChange(currentEvent);
    }
    const handleCustomerAssist = () => {
      onCustomerAssist(selectedCustomers)
      toast.success('Clientes añadidos alla lista de asistentes');
      setSelectedCustomers([])
      props.onCurrentEventChange(currentEvent);
    }
    const handleSignup = () => {
      onSignup(selectedCustomers)
      toast.success('Clientes añadidos a la clase');
      setSelectedCustomers([])
      props.onCurrentEventChange(currentEvent);
    }
    const handleSignout = () => {
      onSignout(selectedCustomers)
      toast.success('Clientes quitados de la clase');
      setSelectedCustomers([])
      props.onCurrentEventChange(currentEvent);
    }

  const enableBulkActions = selectedCustomers.length > 0;
  const selectedSomeCustomers = selectedCustomers.length > 0
    && selectedCustomers.length < customers.length;
  const selectedAllCustomers = selectedCustomers.length === customers.length;

  return (
    <div {...other}>
      <Box
        sx={{
          backgroundColor: (theme) => theme.palette.mode === 'dark'
            ? 'neutral.800'
            : 'neutral.100',
          display: enableBulkActions ? 'block' : 'none',
          px: 2,
          py: 0.5
        }}
      >
        <Checkbox
          checked={selectedAllCustomers}
          indeterminate={selectedSomeCustomers}
          onChange={handleSelectAllCustomers}
        />
{ currentTab == "all" && (
        <Button
          size="small"
          sx={{ ml: 2 }}
          onClick={handleSignup}
        >
          Apuntar
        </Button>)}
  { currentTab == "hasAcceptedMarketing" && (
        <Button
          size="small"
          sx={{ ml: 2 }}
          onClick={handleLateCancel}
        >
          Cancelaron tarde
        </Button>)}
  { currentTab == "hasAcceptedMarketing" && (
        <Button
          size="small"
          sx={{ ml: 2 }}
          onClick={handleCustomerAssist}
        >
          Asistieron
        </Button>)}
  { currentTab == "hasAcceptedMarketing" && (
        <Button
          size="small"
          sx={{ ml: 2 }}
          onClick={handleSignout}
        >
          Desapuntar
        </Button>)}
      </Box>
      <Scrollbar>
        <Table sx={{ minWidth: 700 }}>
          <TableHead sx={{ visibility: enableBulkActions ? 'collapse' : 'visible' }}>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={selectedAllCustomers}
                  indeterminate={selectedSomeCustomers}
                  onChange={handleSelectAllCustomers}
                />
              </TableCell>
              <TableCell>
                Nombre
              </TableCell>
              <TableCell>
                Ciudad
              </TableCell>
              <TableCell>
                Bonos restantes
              </TableCell>
              <TableCell>
                Importe bono
              </TableCell>
              <TableCell align="right">
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {customers.map((customer) => {
              const isCustomerSelected = selectedCustomers.includes(customer.id);

              return (
                <TableRow
                  hover
                  key={customer.id}
                  selected={isCustomerSelected}
                >
                  <TableCell padding="checkbox">
                  {(!currentEvent.customers.includes(customer.id) || currentTab != "all") &&
                    <Checkbox
                      checked={isCustomerSelected}
                      onChange={(event) => handleSelectOneCustomer(event, customer.id)}
                      value={isCustomerSelected}
                    />}
                  </TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        alignItems: 'center',
                        display: 'flex'
                      }}
                    >
                      <Avatar
                        src={customer.avatar}
                        sx={{
                          height: 42,
                          width: 42
                        }}
                      >
                        {getInitials(customer.name)}
                      </Avatar>
                      <Box sx={{ ml: 1 }}>
                        <NextLink
                          href="/dashboard/customers/1"
                          passHref
                        >
                          <Link
                          color={
                            currentEvent && currentEvent.customers_ok.includes(customer.id)
                              ? 'success.main'
                              : currentEvent && currentEvent.customers_late.includes(customer.id)
                              ? 'error.main'
                              : 'textSecondary'
                          }
                            variant="subtitle2"
                          >
                            {customer.name}
                          </Link>
                        </NextLink>
                        <Typography
                          color={
                            currentEvent && currentEvent.customers_ok.includes(customer.id)
                              ? 'success.main'
                              : currentEvent && currentEvent.customers_late.includes(customer.id)
                              ? 'error.main'
                              : 'textSecondary'
                          }
                          variant="body2"
                        >
                          {customer.email}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                  <Typography
                          color={
                            currentEvent && currentEvent.customers_ok.includes(customer.id)
                              ? 'success.main'
                              : currentEvent && currentEvent.customers_late.includes(customer.id)
                              ? 'error.main'
                              : 'textSecondary'
                          }
                        >
                    {`${customer.city}, ${customer.state}, ${customer.country}`}
                    </Typography>
                  </TableCell>
                  <TableCell>
                  <Typography
                          color={
                            currentEvent && currentEvent.customers_ok.includes(customer.id)
                              ? 'success.main'
                              : currentEvent && currentEvent.customers_late.includes(customer.id)
                              ? 'error.main'
                              : 'textSecondary'
                          }
                        >
                    </Typography>
                    {customer.totalOrders}
                  </TableCell>
                  <TableCell>
                    <Typography
                          color={
                            currentEvent && currentEvent.customers_ok.includes(customer.id)
                              ? 'success.main'
                              : currentEvent && currentEvent.customers_late.includes(customer.id)
                              ? 'error.main'
                              : 'textSecondary'
                          }
                      variant="subtitle2"
                    >
                      {numeral(customer.totalAmountSpent).format(`${customer.currency}0,0.00`)}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <NextLink
                      href="/dashboard/customers/1/edit"
                      passHref
                    >
                      <IconButton component="a">
                        <PencilAltIcon fontSize="small" />
                      </IconButton>
                    </NextLink>
                    <NextLink
                      href="/dashboard/customers/1"
                      passHref
                    >
                      <IconButton component="a">
                        <ArrowRightIcon fontSize="small" />
                      </IconButton>
                    </NextLink>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Scrollbar>
      <TablePagination
        component="div"
        count={customersCount}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </div>
  );
};

CustomerListTable.propTypes = {
  customers: PropTypes.array.isRequired,
  customersCount: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  onRowsPerPageChange: PropTypes.func,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired
};
