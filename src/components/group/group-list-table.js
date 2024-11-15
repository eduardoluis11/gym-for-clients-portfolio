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

/* Tabla que muestra la Lista de Grupos de Actividades en la página de Actividades en /groups.
*
*
* */

// TODO Quitar toda referencia al customer y sustituir por las actividades
/* Edité la Tabla para que no puedas ni editar ni borrar los Grupos de Actividades. No podrás seleccionar ninguna
actividad, ni podrás marcar ninguna casilla. Solo podrás ver la lista de Actividades disponibles.
*
* To remove the checkboxes, "edit" and "delete" buttons, you need to make changes in the ActivityListTable component in
* the activity-list-table.js file.  Here's how you can modify your code:
*
* 1) Remove the state variable selectedCustomers and its related functions handleSelectAllCustomers and
* handleSelectOneCustomer. These are used to manage the selected rows in the table.
*
* 2)Remove the Checkbox component from the TableHead and TableBody components. This will remove the checkboxes from the
* table.
*
* 3) Remove the Button components for "Delete" and "Edit" actions. This will remove the "Delete" and "Edit" buttons from
* the table.
*
* This updated code will remove the checkboxes, "Delete" and "Edit" buttons from the table, and the table will only
* display the activities without any option to edit or delete them.
*
* */
export const GroupListTable = (props) => {
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

  // // Reset selected customers when customers change
  // useEffect(
  //   () => {
  //     if (selectedCustomers.length) {
  //       setSelectedCustomers([]);
  //     }
  //   },
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  //   [customers]
  // );

  // const handleSelectAllCustomers = (event) => {
  //   setSelectedCustomers(
  //     event.target.checked ? customers.map((customer) => customer.id) : []
  //   );
  // };

  // const handleSelectOneCustomer = (event, customerId) => {
  //   if (!selectedCustomers.includes(customerId)) {
  //     setSelectedCustomers((prevSelected) => [...prevSelected, customerId]);
  //   } else {
  //     setSelectedCustomers((prevSelected) =>
  //       prevSelected.filter((id) => id !== customerId)
  //     );
  //   }
  // };

  // const enableBulkActions = selectedCustomers.length > 0;
  // const selectedSomeCustomers =
  //   selectedCustomers.length > 0 && selectedCustomers.length < customers.length;
  // const selectedAllCustomers = selectedCustomers.length === customers.length;

  return (
    <div {...other}>
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
      <Scrollbar>
        <Table sx={{ minWidth: 700 }}>
          <TableHead
            // sx={{ visibility: enableBulkActions ? "collapse" : "visible" }}
          >
            <TableRow>
              {/*<TableCell padding="checkbox">*/}
              {/*  <Checkbox*/}
              {/*    checked={selectedAllCustomers}*/}
              {/*    indeterminate={selectedSomeCustomers}*/}
              {/*    onChange={handleSelectAllCustomers}*/}
              {/*  />*/}
              {/*</TableCell>*/}
              <TableCell>Nombre del Grupo de actividad</TableCell>
              <TableCell>Actividades incluidas</TableCell>
              {/*<TableCell align="right">Acciones</TableCell>*/}
            </TableRow>
          </TableHead>
          <TableBody>
            {customers.map((customer) => {
              // const isCustomerSelected = selectedCustomers.includes(
              //   customer.id
              // );

              return (
                <TableRow hover 
                key={customer.id} 
                // selected={isCustomerSelected}
                >
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
                        {/*<NextLink href={`/groups/${customer.id}`} */}
                        {/*passHref>*/}
                          <Link 
                          color="inherit" 
                          variant="subtitle2">
                            {customer.name}
                          </Link>
                        {/*</NextLink>*/}
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    {customer.activities.map((activity) => {
                      return (
                        <SeverityPill 
                        key={activity.id} 
                        color="success"
                        >
                          {activity.name}{" "}
                        </SeverityPill>
                      );
                    })}
                  </TableCell>


                  {/*<TableCell align="right">*/}
                  {/*  <NextLink href={`/groups/${customer.id}`} */}
                  {/*  passHref>*/}
                  {/*    <IconButton component="a">*/}
                  {/*      <PencilAltIcon fontSize="small" />*/}
                  {/*    </IconButton>*/}
                  {/*  </NextLink>*/}
                  {/*  <NextLink href={`/groups/${customer.id}` }*/}
                  {/*  passHref>*/}
                  {/*    <IconButton component="a">*/}
                  {/*      <ArrowRightIcon fontSize="small" />*/}
                  {/*    </IconButton>*/}
                  {/*  </NextLink>*/}
                  {/*</TableCell>*/}


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

GroupListTable.propTypes = {
  customers: PropTypes.array.isRequired,
  customersCount: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  onRowsPerPageChange: PropTypes.func,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};
