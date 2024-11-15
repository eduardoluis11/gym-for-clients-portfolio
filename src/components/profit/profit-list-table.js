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

export const ProfitsListTable = (props) => {
  const {
    sales,
    salesCount,
    onPageChange,
    onRowsPerPageChange,
    page,
    rowsPerPage,
    ...other
  } = props;
  const [selectedSales, setSelectedSales] = useState([]);

  useEffect(
    () => {
      if (selectedSales.length) {
        setSelectedSales([]);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [sales]
  );

  const handleSelectAllSales = (event) => {
    setSelectedSales(
      event.target.checked ? sales.map((sale) => sale.id) : []
    );
  };

  const handleSelectOneSale = (event, saleId) => {
    if (!selectedSales.includes(saleId)) {
      setSelectedSales((prevSelected) => [...prevSelected, saleId]);
    } else {
      setSelectedSales((prevSelected) =>
        prevSelected.filter((id) => id !== saleId)
      );
    }
  };


  // TODO: Entender como se pueden realizar las modificaciones / borrado masivo con los BulkActions
  const enableBulkActions = selectedSales.length > 0;
  const selectedSomeSales =
    selectedSales.length > 0 && selectedSales.length < sales.length;
  const selectedAllSales = selectedSales.length === sales.length;

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
          checked={selectedAllSales}
          indeterminate={selectedSomeSales}
          onChange={handleSelectAllSales}
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
                  checked={selectedAllSales}
                  indeterminate={selectedSomeSales}
                  onChange={handleSelectAllSales}
                />
              </TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Importe</TableCell>
              <TableCell>Cliente</TableCell>
              <TableCell>Vendedor</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sales.map((sale) => {
              const isSaleSelected = selectedSales.includes(
                sale.id
              );

              return (
                <TableRow hover 
                key={sale.id} 
                selected={isSaleSelected}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={isSaleSelected}
                      onChange={(event) =>
                        handleSelectOneSale(event, sale.id)
                      }
                      value={isSaleSelected}
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
                            {new Date(sale.created_at).toLocaleDateString('es-ES').split('/').reverse().join('/')}
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
                        <NextLink href={`/profits/${sale.id}`} 
                        passHref>
                          <Link 
                          color="inherit" 
                          variant="subtitle2">
                            ${sale.amount}
                          </Link>
                        </NextLink>
                      </Box>
                    </Box>
            
                  </TableCell>
                  <TableCell>
                    <Typography color="success.main" 
                    variant="subtitle2">
                      {`${sale.comprador}`}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {`${sale.vendedor}`}
                  </TableCell>
                  <TableCell>
                    {sale.sc && "CUOTA"}
                    {!sale.sc && "COMPRA"}
                  </TableCell>
                  
                  <TableCell align="right">
                    <NextLink href={`/profits/${sale.id}`} 
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
        count={salesCount}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </div>
  );
};

ProfitsListTable.propTypes = {
  sales: PropTypes.array.isRequired,
  salesCount: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  onRowsPerPageChange: PropTypes.func,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};
