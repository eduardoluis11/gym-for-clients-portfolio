import { useEffect, useState } from "react";
import NextLink from "next/link";
import numeral from "numeral";
import PropTypes from "prop-types";
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
  Typography,
} from "@mui/material";
import { ArrowRight as ArrowRightIcon } from "../../icons/arrow-right";
import { PencilAlt as PencilAltIcon } from "../../icons/pencil-alt";
import { getInitials } from "../../utils/get-initials";
import { Scrollbar } from "../scrollbar";
import { SeverityPill } from "../severity-pill";
import { MailOutline as MailOutlineIcon } from '@mui/icons-material';

/* Este es el archivo que renderiza los títulos de la tabla con la lista de clientes (como “Actions” o “teléfono”)
*
* Voy a ver si puedo modificar este archivo para insertar un enlace para enviar un email al cliente seleccionado
* de la Tabla con la Lista de Clientes.
*
* Este archivo es llamado desde el archivo newGymFrontend/src/pages/clients/index.js para renderizar la página
* con la lista de Clientes.
* */


export const ClientListTable = (props) => {
  const {
    customers,
    customersCount,
    onPageChange,
    onRowsPerPageChange,
    page,
    rowsPerPage,
    ...other
  } = props;
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [clients, setClients] = useState([]);

  // Reset selected customers when customers change
  useEffect(() => {
      if (selectedCustomers.length) {
        setSelectedCustomers([]);
      }
    },[]
  );
  useEffect(() => {
    setClients(customers)
    },[customers]
  );

  const handleSelectAllCustomers = (event) => {
    setSelectedCustomers(
      event.target.checked ? customers.map((customer) => customer.id) : []
    );
  };

  const handleSelectOneCustomer = (event, customerId) => {
    if (!selectedCustomers.includes(customerId)) {
      setSelectedCustomers((prevSelected) => [...prevSelected, customerId]);
    } else {
      setSelectedCustomers((prevSelected) =>
        prevSelected.filter((id) => id !== customerId)
      );
    }
  };


  // TODO: Entender como se pueden realizar las modificaciones / borrado masivo con los BulkActions
  const enableBulkActions = selectedCustomers.length > 0;
  const selectedSomeCustomers =
    selectedCustomers.length > 0 && selectedCustomers.length < customers.length;
  const selectedAllCustomers = selectedCustomers.length === customers.length;

  /* Codigo HTML de la página con la lista de clientes, renderizado usando JS.
  *
  * Sure, you can add an envelope icon to your React component. First, you need to import the envelope icon from your
  * icon library. If you're using Material-UI, you can use the MailOutline icon. Then, you can add a new IconButton
  * component with the MailOutline icon inside it. In this code, I've added a new IconButton with the MailOutline icon.
  * The href attribute of the IconButton is set to mailto:${customer.email}, which will open the user's default email
  * client with a new email addressed to the customer's email when clicked.
  * */
  return (
    <div {...other}>
      <Box
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === "dark" ? "neutral.800" : "neutral.100",
          display: enableBulkActions ? "block" : "none",
          px: 2,
          py: 0.5,
        }}
      >
        <Checkbox
          checked={selectedAllCustomers}
          indeterminate={selectedSomeCustomers}
          onChange={handleSelectAllCustomers}
        />
        <Button size="small" 
        sx={{ ml: 2 }}>
          Delete
        </Button>
        <Button size="small" 
        sx={{ ml: 2 }}>
          Edit
        </Button>
      </Box>
      <Scrollbar>
        <Table sx={{ minWidth: 700 }}>
          <TableHead
            sx={{ visibility: enableBulkActions ? "collapse" : "visible" }}
          >

            {/* Estos son los títulos de la cabecera de la tabla con la lista de clientes */}
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={selectedAllCustomers}
                  indeterminate={selectedSomeCustomers}
                  onChange={handleSelectAllCustomers}
                />
              </TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Teléfono</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow> {/* Fin de los títulos de la cabecera de la tabla con la lista de clientes */}
          </TableHead>
          <TableBody>
            {clients?.map((customer) => {
              const isCustomerSelected = selectedCustomers.includes(
                customer.id
              );

              return (
                <TableRow hover 
                key={customer.id} 
                selected={isCustomerSelected}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={isCustomerSelected}
                      onChange={(event) =>
                        handleSelectOneCustomer(event, customer.id)
                      }
                      value={isCustomerSelected}
                    />
                  </TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        alignItems: "center",
                        display: "flex",
                      }}
                    >
                      <Box sx={{ ml: 1 }}>
                        <NextLink href={`/clients/${customer.id}`} 
                        passHref>
                          <Link 
                          color="inherit" 
                          variant="subtitle2">
                            {customer.first_name} {customer.last_name}
                          </Link>
                        </NextLink>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography color="success.main" 
                    variant="subtitle2">
                      {`${customer.email}`}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography color="success.main" 
                      variant="subtitle2">
                        {`${customer.phone}`}
                      </Typography>
                  </TableCell>
                  {/* Esto renderiza la celda los iconos del Lápiz para editar y el de la Flecha de "Actions" */}
                  <TableCell align="right">

                    {/* Icono del Sobre / Carta para enviar Emails. Te redirige al enlace  */}
                    {/* /clients/client_id/send-email */}
                    {/*<IconButton component="a" href={`mailto:${customer.email}`}>*/}
                    <NextLink href={`/clients/${customer.id}/send-email`}
                    passHref>
                      <IconButton component="a" href={`#`}>
                        <MailOutlineIcon fontSize="small" />
                      </IconButton>
                    </NextLink>

                    {/* Icono del Lápiz para Editar a un cliente */}
                    <NextLink href={`/clients/${customer.id}`} 
                    passHref>
                      <IconButton component="a">
                        <PencilAltIcon fontSize="small" />
                      </IconButton>
                    </NextLink>

                    {/* Icono de la Flecha */}
                    <NextLink href="/dashboard/customers/1" 
                    passHref>
                      <IconButton component="a">
                        <ArrowRightIcon fontSize="small" />
                      </IconButton>
                    </NextLink>
                  </TableCell>
                  {/* Fin de la celda los iconos del Lápiz para editar y el de la Flecha de "Actions" */}

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

ClientListTable.propTypes = {
  customers: PropTypes.array.isRequired,
  customersCount: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  onRowsPerPageChange: PropTypes.func,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};
