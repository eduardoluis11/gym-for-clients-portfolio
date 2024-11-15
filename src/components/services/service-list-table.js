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
import DoneIcon from '@mui/icons-material/Done';
import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';  // Icono de la "i" de Información.
import { ArrowRight as ArrowRightIcon } from "../../icons/arrow-right";
import { PencilAlt as PencilAltIcon } from "../../icons/pencil-alt";
import { getInitials } from "../../utils/get-initials";
import { Scrollbar } from "../scrollbar";
import { SeverityPill } from "../severity-pill";
import DeleteIcon from '@mui/icons-material/Delete';
import { serviceApi } from "../../api/service-api";
import toast from "react-hot-toast";

/* Tabla con la Lista de Servicios, el cual se usa en la página de /services.
*
* Esta es la tabla con el apartado "Actions", los botones de Editar y Borrar un Servicio.
*
* Debo EDITAR esto para que un Cliente NO pueda Borrar, ni Crear Servicios.
*/

export const ServiceListTable = (props) => {
  const {
    customers,
    customersCount,
    onPageChange,
    onRowsPerPageChange,
    page,
    rowsPerPage,
    handleDelete,
    ...other
  } = props;
  const [selectedCustomers, setSelectedCustomers] = useState([]);

  // Reset selected customers when customers change
  useEffect(
    () => {
      if (selectedCustomers.length) {
        setSelectedCustomers([]);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [customers]
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

  const enableBulkActions = selectedCustomers.length > 0;
  const selectedSomeCustomers =
    selectedCustomers.length > 0 && selectedCustomers.length < customers.length;
  const selectedAllCustomers = selectedCustomers.length === customers.length;

  return (
    <div {...other}>


      {/* Barra superior en el que aparecen los botones de "Edit" y "Delete" si marcas las casillas para seleccionar
      uno o varios servicios.

      BORRAR.
      */}
      {/*<Box*/}
      {/*  sx={{*/}
      {/*    backgroundColor: (theme) =>*/}
      {/*      theme.palette.mode === "dark" ? "neutral.800" : "neutral.100",*/}
      {/*    display: enableBulkActions ? "block" : "none",*/}
      {/*    px: 2,*/}
      {/*    py: 0.5,*/}
      {/*  }}*/}
      {/*>*/}
      {/*  <Checkbox*/}
      {/*    checked={selectedAllCustomers}*/}
      {/*    indeterminate={selectedSomeCustomers}*/}
      {/*    onChange={handleSelectAllCustomers}*/}
      {/*  />*/}
      {/*  <Button size="small" */}
      {/*  sx={{ ml: 2 }}>*/}
      {/*    Delete*/}
      {/*  </Button>*/}
      {/*  <Button size="small" */}
      {/*  sx={{ ml: 2 }}>*/}
      {/*    Edit*/}
      {/*  </Button>*/}
      {/*</Box>*/}
      {/* Fin de la Barra superior en el que aparecen los botones de "Edit" y "Delete" */}


      <Scrollbar>
        <Table sx={{ minWidth: 700 }}>

          {/* Cabecera con los Títulos de la Tabla de Servicios. */}
          <TableHead
            sx={{ visibility: enableBulkActions ? "collapse" : "visible" }}
          >
            <TableRow>

              {/* Casilla para Seleccionar Todos los Servicios. BORRAR. */}
              {/*<TableCell padding="checkbox">*/}
              {/*  <Checkbox*/}
              {/*    checked={selectedAllCustomers}*/}
              {/*    indeterminate={selectedSomeCustomers}*/}
              {/*    onChange={handleSelectAllCustomers}*/}
              {/*  />*/}
              {/*</TableCell>*/}

              <TableCell>Nombre</TableCell>
              <TableCell>Importe del servicio</TableCell>
              <TableCell>Categoría</TableCell>
              <TableCell>Tiempo estimado</TableCell>
              <TableCell>Es activo</TableCell>

              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {customers.map((customer) => {
              const isCustomerSelected = selectedCustomers.includes(
                customer.id
              );

              /* Cuerpo de la Tabla con los Datos de los Servicios.
              *
              * Tengo que editar esto para que NO salgan las casillas para seleccionar uno o varios servicios.
              * */
              return (


                <TableRow hover 
                key={customer.id} 
                selected={isCustomerSelected}>

                  {/* Columna con las Casillas para Seleccionar uno o varios Servicios. BORRAR. */}
                  {/*<TableCell padding="checkbox">*/}
                  {/*  <Checkbox*/}
                  {/*    checked={isCustomerSelected}*/}
                  {/*    onChange={(event) =>*/}
                  {/*      handleSelectOneCustomer(event, customer.id)*/}
                  {/*    }*/}
                  {/*    value={isCustomerSelected}*/}
                  {/*  />*/}
                  {/*</TableCell>*/}
                  <TableCell>
                    <Box
                      sx={{
                        alignItems: "center",
                        display: "flex",
                      }}
                    >
                      <Box sx={{ ml: 1 }}>
                        <NextLink href={`/services/${customer.id}`}
                        passHref>
                          <Link 
                          color="inherit" 
                          variant="subtitle2">
                            {customer.name}
                          </Link>
                        </NextLink>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography  
                    variant="subtitle2">
                      {`${customer.price} €`}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography  
                    variant="subtitle2">
                      {`${customer.category}`}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography color="success.main" 
                    variant="subtitle2">
                      {`${customer.estimated_time}`}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography color={customer.is_active ? "success.main" : "error.main"} 
                    variant="subtitle2">
                      {customer.is_active && <DoneIcon></DoneIcon>}
                      {!customer.is_active && <ErrorIcon></ErrorIcon>}
                    </Typography>
                  </TableCell>{/* TODO: los colores deberían ser en función de si quedan días o no */}
                  
                  <TableCell align="right">

                    {/* Icono con el Enlace para Ver Más Detalles de un Servicio. */}
                    <NextLink href={`/services/${customer.id}`} 
                    passHref>
                      <IconButton component="a">

                        {/* Icono de la "i" de Información. */}
                        <InfoIcon fontSize="small" />

                        {/*<PencilAltIcon fontSize="small" />*/}
                      </IconButton>
                    </NextLink>

                    {/* Icono con el Enlace para Borrar un Servicio. BORRAR. */}
                    {/*<IconButton component="a" onClick={()=>handleDelete(customer.id)}>*/}
                    {/*  <DeleteIcon fontSize="small" />*/}
                    {/*</IconButton>*/}
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

ServiceListTable.propTypes = {
  customers: PropTypes.array.isRequired,
  customersCount: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  onRowsPerPageChange: PropTypes.func,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};
