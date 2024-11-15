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
// TODO Quitar toda referencia al expense y sustituir por las actividades
export const ExpenseListTable = (props) => {
  const {
    expenses,
    expensesCount,
    onPageChange,
    onRowsPerPageChange,
    page,
    rowsPerPage,
    ...other
  } = props;
  const [selectedExpenses, setSelectedExpenses] = useState([]);

  // Reset selected expenses when expenses change
  useEffect(
    () => {
      if (selectedExpenses.length) {
        setSelectedExpenses([]);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [expenses]
  );

  const handleSelectAllExpenses = (event) => {
    setSelectedExpenses(
      event.target.checked ? expenses.map((expense) => expense.id) : []
    );
  };

  const handleSelectOneExpense = (event, expenseId) => {
    if (!selectedExpenses.includes(expenseId)) {
      setSelectedExpenses((prevSelected) => [...prevSelected, expenseId]);
    } else {
      setSelectedExpenses((prevSelected) =>
        prevSelected.filter((id) => id !== expenseId)
      );
    }
  };


  // TODO: Entender como se pueden realizar las modificaciones / borrado masivo con los BulkActions
  const enableBulkActions = selectedExpenses.length > 0;
  const selectedSomeExpenses =
    selectedExpenses.length > 0 && selectedExpenses.length < expenses.length;
  const selectedAllExpenses = selectedExpenses.length === expenses.length;

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
          checked={selectedAllExpenses}
          indeterminate={selectedSomeExpenses}
          onChange={handleSelectAllExpenses}
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
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={selectedAllExpenses}
                  indeterminate={selectedSomeExpenses}
                  onChange={handleSelectAllExpenses}
                />
              </TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Gasto registrado</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Importe</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {expenses.map((expense) => {
              const isExpenseSelected = selectedExpenses.includes(
                expense.id
              );

              return (
                <TableRow hover 
                key={expense.id} 
                selected={isExpenseSelected}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={isExpenseSelected}
                      onChange={(event) =>
                        handleSelectOneExpense(event, expense.id)
                      }
                      value={isExpenseSelected}
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
                          <Link 
                          color="inherit" 
                          variant="subtitle2">
                            {new Date(expense.created_at).toLocaleDateString('es-ES').split('/').reverse().join('/')}
                          </Link>
                      </Box>
                    </Box>
            
                  </TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        alignItems: "center",
                        display: "flex",
                      }}
                    >
                      <Box sx={{ ml: 1 }}>
                        <NextLink href={`/expenses/${expense.id}`} 
                        passHref>
                          <Link 
                          color="inherit" 
                          variant="subtitle2">
                            {expense.name}
                          </Link>
                        </NextLink>
                      </Box>
                    </Box>
            
                  </TableCell>
                  <TableCell>
                    <Typography color="success.main" 
                    variant="subtitle2">
                      {`${expense.type}`}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    ${`${expense.price}`}
                  </TableCell>
                  
                  <TableCell align="right">
                    <NextLink href={`/expenses/${expense.id}`} 
                    passHref>
                      <IconButton component="a">
                        <PencilAltIcon fontSize="small" />
                      </IconButton>
                    </NextLink>
                    <NextLink href="/dashboard/expenses/1" 
                    passHref>
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
        count={expensesCount}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </div>
  );
};

ExpenseListTable.propTypes = {
  expenses: PropTypes.array.isRequired,
  expensesCount: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  onRowsPerPageChange: PropTypes.func,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};
