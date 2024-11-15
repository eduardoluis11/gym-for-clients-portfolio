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
import NextLink from "next/link";
import DeleteIcon from '@mui/icons-material/Delete';
import { Scrollbar } from "../scrollbar";
import PropTypes from "prop-types";
import { useState, useEffect,useCallback } from "react";
import toast from "react-hot-toast";
import { stripeApi } from "../../api/stripe-api";
import { useMounted } from "../../hooks/use-mounted";
import Router  from "next/router";
import DoneIcon from '@mui/icons-material/Done';
import ErrorIcon from '@mui/icons-material/Error';

export const ClientProductsListTable = (props) => {
const isMounted = useMounted();
  const {products, productsCount, client, ...other} = props;
  const [selectedProducts, setSelectedProducts] = useState([]);
  
 useEffect(
    () => {
      if (selectedProducts.length) {
        setSelectedProducts([]);
      }
    },
    [products]
  );


  const handleSelectAllProducts = (event) => {
    setSelectedProducts(
      event.target.checked ? products?.map((product) => product.product_id) : []
    );
  };

  const handleSelectOneProduct = (event, productId) => {
    if (!selectedProducts.includes(productId)) {
      setSelectedProducts((prevSelected) => [...prevSelected, productId]);
    } else {
      setSelectedProducts((prevSelected) =>
        prevSelected.filter((id) => id !== productId)
      );
    }
  };
  // TODO: Entender como se pueden realizar las modificaciones / borrado masivo con los BulkActions
  const enableBulkActions = selectedProducts.length > 0;
  const selectedSomeProducts =
    selectedProducts.length > 0 && selectedProducts.length < products.length;
  const selectedAllProducts = selectedProducts.length === products.length;


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
          checked={selectedAllProducts}
          indeterminate={selectedSomeProducts}
          onChange={handleSelectAllProducts}
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
                  checked={selectedAllProducts}
                  indeterminate={selectedSomeProducts}
                  onChange={handleSelectAllProducts}
                />
              </TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Precio</TableCell>
              <TableCell>Fecha compra</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products?.map((product) => {
              const isProductSelected = selectedProducts.includes(
                product.product_id
              );

              return (
                <TableRow hover 
                key={product.product_id} 
                selected={isProductSelected}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={isProductSelected}
                      onChange={(event) =>
                        handleSelectOneProduct(event, product.product_id)
                      }
                      value={isProductSelected}
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
                        <NextLink href={`${client.id}/products/${product.product_id}`} 
                        passHref>
                          <Link 
                          color="inherit" 
                          variant="subtitle2">
                            {product.product_name}
                          </Link>
                        </NextLink>
                      </Box>
                    </Box>
                  </TableCell>
                
                  <TableCell>
                    <Typography color="success.main" 
                      variant="subtitle2">
                        ${`${product.product_price}`}
                      </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography color="success.main" 
                    variant="subtitle2">
                      {`${new Date(product.sale_date).toISOString().split('T')[0].split('-').reverse().join('/')}`}
                    </Typography>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Scrollbar>
      
    </div>
  );
};

ClientProductsListTable.propTypes = {
  products: PropTypes.array.isRequired,
  productsCount: PropTypes.number.isRequired
};
