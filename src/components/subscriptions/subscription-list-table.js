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

/* Tabla con la Lista de Cuotas.

Aquí es donde se encuentra el apartado "Actions", los botones de Editar y Borrar un Producto.

Pues, dado que un cliente no debe poder Editar, Borrar, ni Crear Cuotas, debo eliminar esas funciones de aquí.

En teoría, aquí también debería estar el buscador y los filtros para buscar una Cuota en la Lista de Cuotas.
* */

export const SubscriptionListTable = (props) => {
  const {
    subscriptions,
    subscriptionsCount,
    onPageChange,
    onRowsPerPageChange,
    page,
    rowsPerPage,
    ...other
  } = props;
  const [selectedSubscriptions, setSelectedSubscriptions] = useState([]);

  // Reset selected subscriptions when subscriptions change
  useEffect(
    () => {
      if (selectedSubscriptions.length) {
        setSelectedSubscriptions([]);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [subscriptions]
  );

  const handleSelectAllSubscriptions = (event) => {
    setSelectedSubscriptions(
      event.target.checked ? subscriptions.map((subscription) => subscription.id) : []
    );
  };

  const handleSelectOneSubscription = (event, subscriptionId) => {
    if (!selectedSubscriptions.includes(subscriptionId)) {
      setSelectedSubscriptions((prevSelected) => [...prevSelected, subscriptionId]);
    } else {
      setSelectedSubscriptions((prevSelected) =>
        prevSelected.filter((id) => id !== subscriptionId)
      );
    }
  };

  const enableBulkActions = selectedSubscriptions.length > 0;
  const selectedSomeSubscriptions =
    selectedSubscriptions.length > 0 && selectedSubscriptions.length < subscriptions.length;
  const selectedAllSubscriptions = selectedSubscriptions.length === subscriptions.length;

  return (
    <div {...other}>

      {/* Barra superior en el que aparecen los botones de "Edit" y "Delete" si marcas las casillas para seleccionar
      una o varias Cuotas.

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
      {/*    checked={selectedAllSubscriptions}*/}
      {/*    indeterminate={selectedSomeSubscriptions}*/}
      {/*    onChange={handleSelectAllSubscriptions}*/}
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


      <Scrollbar>
        <Table sx={{ minWidth: 700 }}>

          {/* Cabecera con los Títulos de la Tabla de Servicios. */}
          <TableHead
            sx={{ visibility: enableBulkActions ? "collapse" : "visible" }}
          >
            <TableRow>

              {/* Checkbox para Seleccionar Todas las Cuotas. BORRAR. */}
              {/*<TableCell padding="checkbox">*/}
              {/*  <Checkbox*/}
              {/*    checked={selectedAllSubscriptions}*/}
              {/*    indeterminate={selectedSomeSubscriptions}*/}
              {/*    onChange={handleSelectAllSubscriptions}*/}
              {/*  />*/}
              {/*</TableCell>*/}

              <TableCell>Nombre</TableCell>
              <TableCell>Importe de la cuota</TableCell>
              <TableCell>Es activo</TableCell>
              <TableCell>Fracciona 1º cuota</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {subscriptions.map((subscription) => {
              const isSubscriptionSelected = selectedSubscriptions.includes(
                subscription.id
              );

              /* Cuerpo de la Tabla con los Datos de las Cuotas.
              *
              * Tengo que editar esto para que NO salgan las casillas para seleccionar una o varias cuotas.
              *
              * To display the date in the "dd/mm/yyyy" format, you can use the format function from the date-fns
              * library. First, ensure you have the date-fns library installed. Then, import the format function and
              * use it to format the date.
              * */
              return (
                <TableRow hover 
                key={subscription.id} 
                selected={isSubscriptionSelected}>

                  {/* Columna con las Casillas para Seleccionar una o varias Cuotas. BORRAR. */}
                  {/*<TableCell padding="checkbox">*/}
                  {/*  <Checkbox*/}
                  {/*    checked={isSubscriptionSelected}*/}
                  {/*    onChange={(event) =>*/}
                  {/*      handleSelectOneSubscription(event, subscription.id)*/}
                  {/*    }*/}
                  {/*    value={isSubscriptionSelected}*/}
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
                        <NextLink href={`/subscriptions/${subscription.id}`}
                        passHref>
                          <Link 
                          color="inherit" 
                          variant="subtitle2">
                            {subscription.name}
                          </Link>
                        </NextLink>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography  
                    variant="subtitle2">
                      {`${subscription.price} €`}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography color={subscription.is_active ? "success.main" : "error.main"} 
                      variant="subtitle2">
                        {subscription.is_active && <DoneIcon></DoneIcon>}
                        {!subscription.is_active && <ErrorIcon></ErrorIcon>}
                      </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography color={subscription.first_rate_defferal ? "success.main" : "error.main"} 
                      variant="subtitle2">
                        {subscription.first_rate_defferal && <DoneIcon></DoneIcon>}
                        {!subscription.first_rate_defferal && <ErrorIcon></ErrorIcon>}
                      </Typography>
                  </TableCell>
                  <TableCell align="right">

                    {/* Icono con el Enlace para Ver Más Detalles de una Cuota. */}
                    <NextLink href={`/subscriptions/${subscription.id}`} 
                    passHref>
                      <IconButton component="a">

                        {/* Icono de la "i" de "Información" */}
                        <InfoIcon fontSize="small" />

                        {/*<PencilAltIcon fontSize="small" />*/}

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
        count={subscriptionsCount}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </div>
  );
};

SubscriptionListTable.propTypes = {
  subscriptions: PropTypes.array.isRequired,
  subscriptionsCount: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  onRowsPerPageChange: PropTypes.func,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};
