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
import { subscriptionApi } from "../../api/subscription-api";
import { useMounted } from "../../hooks/use-mounted";
import Router  from "next/router";
import DoneIcon from '@mui/icons-material/Done';
import ErrorIcon from '@mui/icons-material/Error';

export const ClientSubscriptionsListTable = (props) => {
const isMounted = useMounted();
  const {subscriptions, subscriptionsCount, client, handleCongelar, handleDescongelar,updateSubscriptions, ...other} = props;
  const [selectedSubscriptions, setSelectedSubscriptions] = useState([]);
  
 useEffect(
    () => {
      if (selectedSubscriptions.length) {
        setSelectedSubscriptions([]);
      }
    },
    [subscriptions]
  );


  const handleSelectAllSubscriptions = (event) => {
    setSelectedSubscriptions(
      event.target.checked ? subscriptions?.map((subscription) => subscription.id) : []
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
  // TODO: Entender como se pueden realizar las modificaciones / borrado masivo con los BulkActions
  const enableBulkActions = selectedSubscriptions.length > 0;
  const selectedSomeSubscriptions =
    selectedSubscriptions.length > 0 && selectedSubscriptions.length < subscriptions.length;
  const selectedAllSubscriptions = selectedSubscriptions.length === subscriptions.length;

  const handleDelete =  async (subscription)=>{
    if(confirm('Estás seguro?')){
        let response = await stripeApi.deleteSubscription(subscription.sub_id_stripe);
        let response2 = await subscriptionApi.deleteSubscriptionCustomer(subscription); // solo cambiar is_active
        if(response.status="succeded" && response2){
            toast.success('Borrado con éxito')
            location.reload()
        }else{
            toast.error('Error al procesar borrado.');
            console.log(response2)
        }
    }

  }

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
          checked={selectedAllSubscriptions}
          indeterminate={selectedSomeSubscriptions}
          onChange={handleSelectAllSubscriptions}
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
                  checked={selectedAllSubscriptions}
                  indeterminate={selectedSomeSubscriptions}
                  onChange={handleSelectAllSubscriptions}
                />
              </TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Fecha desde</TableCell>
              <TableCell>Costo mensual</TableCell>
              <TableCell>Activa</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {subscriptions?.map((subscription) => {
              const isSubscriptionSelected = selectedSubscriptions.includes(
                subscription.id
              );

              return (
                <TableRow hover 
                key={subscription.id} 
                selected={isSubscriptionSelected}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={isSubscriptionSelected}
                      onChange={(event) =>
                        handleSelectOneSubscription(event, subscription.id)
                      }
                      value={isSubscriptionSelected}
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
                        <NextLink href={`${client.id}/subscriptions/${subscription.id}`} 
                        passHref>
                          <Link 
                          color="inherit" 
                          variant="subtitle2">
                            {subscription.subscription.name}
                          </Link>
                        </NextLink>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography color="success.main" 
                    variant="subtitle2">
                      {`${new Date(subscription.valid_from).toISOString().split('T')[0].split('-').reverse().join('/')}`}
                    </Typography>
                  </TableCell>
                
                  <TableCell>
                    <Typography color="success.main" 
                      variant="subtitle2">
                        ${`${subscription.subscription.price}`}
                      </Typography>
                  </TableCell>
                  <TableCell>
                      <Typography color={subscription.status==1 ? "success.main" : subscription.status==2 ? "warning.main" :"error.main"} 
                      variant="subtitle2">
                        {subscription.status==1 && <DoneIcon></DoneIcon>}
                        {subscription.status==0 && <ErrorIcon></ErrorIcon>}
                        {subscription.status==2  && <Typography variant='h6'>❄</Typography>}
                      </Typography>
                  </TableCell>
                  <TableCell align="right">
                      {subscription.status==1 ? (
                        <>
                        <IconButton component="a" onClick={()=> handleDelete(subscription)}>
                            <DeleteIcon fontSize="small" />
                        </IconButton>
                        <Button variant="outlined" color="warning" sx={{p:1}} onClick={()=>handleCongelar(subscription)}>Congelar</Button>
                        </>
                      ):<></>}
                      {subscription.status==2 ? (
                        <>
                        <Button variant="outlined" color="success" sx={{p:1}} onClick={()=>handleDescongelar(subscription)}>Reactivar</Button>
                        </>
                      ):<></>}
                      {subscription.status==0 ? (
                        <>
                        -
                        </>
                      ):<></>}
                   
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

ClientSubscriptionsListTable.propTypes = {
  subscriptions: PropTypes.array.isRequired,
  subscriptionsCount: PropTypes.number.isRequired
};
