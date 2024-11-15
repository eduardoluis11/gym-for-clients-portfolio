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

export const ClientServicesListTable = (props) => {
const isMounted = useMounted();
  const {services, servicesCount, client, ...other} = props;
  const [selectedServices, setSelectedServices] = useState([]);
  
 useEffect(
    () => {
      if (selectedServices.length) {
        setSelectedServices([]);
      }
    },
    [services]
  );


  const handleSelectAllServices = (event) => {
    setSelectedServices(
      event.target.checked ? services?.map((service) => service.service_id) : []
    );
  };

  const handleSelectOneService = (event, serviceId) => {
    if (!selectedServices.includes(serviceId)) {
      setSelectedServices((prevSelected) => [...prevSelected, serviceId]);
    } else {
      setSelectedServices((prevSelected) =>
        prevSelected.filter((id) => id !== serviceId)
      );
    }
  };
  // TODO: Entender como se pueden realizar las modificaciones / borrado masivo con los BulkActions
  const enableBulkActions = selectedServices.length > 0;
  const selectedSomeServices =
    selectedServices.length > 0 && selectedServices.length < services.length;
  const selectedAllServices = selectedServices.length === services.length;


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
          checked={selectedAllServices}
          indeterminate={selectedSomeServices}
          onChange={handleSelectAllServices}
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
                  checked={selectedAllServices}
                  indeterminate={selectedSomeServices}
                  onChange={handleSelectAllServices}
                />
              </TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Precio</TableCell>
              <TableCell>Fecha compra</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {services?.map((service) => {
              const isServiceSelected = selectedServices.includes(
                service.service_id
              );

              return (
                <TableRow hover 
                key={service.service_id} 
                selected={isServiceSelected}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={isServiceSelected}
                      onChange={(event) =>
                        handleSelectOneService(event, service.service_id)
                      }
                      value={isServiceSelected}
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
                        <NextLink href={`${client.id}/services/${service.service_id}`} 
                        passHref>
                          <Link 
                          color="inherit" 
                          variant="subtitle2">
                            {service.service_name}
                          </Link>
                        </NextLink>
                      </Box>
                    </Box>
                  </TableCell>
                
                  <TableCell>
                    <Typography color="success.main" 
                      variant="subtitle2">
                        ${`${service.service_price}`}
                      </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography color="success.main" 
                    variant="subtitle2">
                      {`${new Date(service.sale_date).toISOString().split('T')[0].split('-').reverse().join('/')}`}
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

ClientServicesListTable.propTypes = {
  services: PropTypes.array.isRequired,
  servicesCount: PropTypes.number.isRequired
};
