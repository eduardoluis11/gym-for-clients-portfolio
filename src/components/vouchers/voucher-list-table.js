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
import { voucherApi } from "../../api/voucher-api";
import toast from "react-hot-toast";

import { format } from 'date-fns';  // Esto me dejará mejorar el formato de la fecha de inicio de la validez del Bono.

/* Tabla con la Lista de Bonos.

Aquí es donde se encuentra el apartado "Actions", los botones de Editar y Borrar un Bono.

Pues, dado que un cliente no debe poder Editar, Borrar, ni Crear Bonos, debo eliminar esas funciones de aquí.

En teoría, aquí también debería estar el buscador y los filtros para buscar un Bono en la Lista de Bonos.
* */

export const VoucherListTable = (props) => {
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
              <TableCell>Importe del bono</TableCell>
              <TableCell>Categoría</TableCell>
              <TableCell>Válido desde</TableCell>
              <TableCell>Días totales del bono</TableCell>
              <TableCell>Es activo</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {customers.map((customer) => {
              const isCustomerSelected = selectedCustomers.includes(
                customer.id
              );

              /* Cuerpo de la Tabla con los Datos de los Bonos.
              *
              * Tengo que editar esto para que NO salgan las casillas para seleccionar uno o varios bonos.
              *
              * To display the date in the "dd/mm/yyyy" format, you can use the format function from the date-fns
              * library. First, ensure you have the date-fns library installed. Then, import the format function and
              * use it to format the date.
              * */
              return (
                <TableRow hover 
                key={customer.id} 
                selected={isCustomerSelected}>

                  {/* Columna con las Casillas para Seleccionar uno o varios Bonos. BORRAR. */}
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
                        <NextLink href={`/vouchers/${customer.id}`}
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

                    {/* Fecha de Inicio del Bono ("Válido desde"). Le cambié el formato a "día-mes-año". */}
                    <Typography color="success.main" 
                    variant="subtitle2">

                      {format(new Date(customer.valid_from), 'dd/MM/yyyy')}

                      {/*{`${customer.valid_from}`}*/}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Typography color="success.main" 
                    variant="subtitle2">
                      {`${customer.valid_for}`}
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

                    {/* Icono con el Enlace para Ver Más Detalles de un Bono. */}
                    <NextLink href={`/vouchers/${customer.id}`} 
                    passHref>
                      <IconButton component="a">

                        {/* Icono de la "i" de "Información" */}
                        <InfoIcon fontSize="small" />

                        {/*<PencilAltIcon fontSize="small" />*/}
                      </IconButton>
                    </NextLink>
                    
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

VoucherListTable.propTypes = {
  customers: PropTypes.array.isRequired,
  customersCount: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  onRowsPerPageChange: PropTypes.func,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};
