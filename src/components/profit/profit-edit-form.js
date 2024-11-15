import NextLink from 'next/link';
import PropTypes from 'prop-types';
import toast from 'react-hot-toast';
import Router from "next/router";
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useSelector, useDispatch } from 'react-redux';
import { useCallback, useEffect, useState } from 'react';
import { useMounted } from '../../hooks/use-mounted';
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Chip,
  Divider,
  Grid,
  FormHelperText,
  Link,
  MenuItem,
  Select,
  Switch,
  TextField,
  Table,
  Typography,
  TableHead,
  TableCell,
  TablePagination,
  TableBody,
  TableRow,
} from '@mui/material';
import { saleApi } from "../../api/sale-api";
import { Scrollbar } from '../scrollbar';
import { clientApi } from '../../api/client-api';
import { productApi } from '../../api/product-api';
import { voucherApi } from '../../api/voucher-api';
import { serviceApi } from '../../api/service-api';
import { subscriptionApi } from '../../api/subscription-api';
// TODO: estos valores deberían estar en el store(Copiar la lógica de create form)

export const ProfitEditForm = (props) => {
    const { sale, ...other } = props;
    const [client, setClient] = useState('')
    const [seller, setSeller] = useState('')
    const [products,setProducts] = useState([])
    const [vouchers,setVouchers] = useState([])
    const [services,setServices] = useState([])
    const [items,setItems] = useState([])
    const [sub, setSub] = useState()
    const isMounted = useMounted();

    const getClient = useCallback(async () => {
    try {
        const data = await clientApi.getClient(sale?.buyer);
        
        if (isMounted()) {
        setClient(data);
        }
    } catch (err) {
        console.error(err);
    }
    }, [isMounted,sale]);
    const getSeller= useCallback(async () => {
        try {
          const data = await saleApi.getSellers();
          let vendedor='';
          data.map(s=>{
            if(s.id==sale.seller) vendedor=s
          })
          if (isMounted()) {
            setSeller(vendedor);
          }
        } catch (err) {
          console.error(err);
        }
      }, [isMounted]);
      const getProducts= useCallback(async () => {
        try {
          const data = await productApi.getProducts();
          
          if (isMounted()) {
            setProducts(data);
          }
        } catch (err) {
          console.error(err);
        }
      }, [isMounted]);
      const getVouchers= useCallback(async () => {
        try {
          const data = await voucherApi.getVouchers();
          
          if (isMounted()) {
            setVouchers(data);
          }
        } catch (err) {
          console.error(err);
        }
      }, [isMounted]);
      const getServices= useCallback(async () => {
        try {
          const data = await serviceApi.getServices();
          
          if (isMounted()) {
            setServices(data);
          }
        } catch (err) {
          console.error(err);
        }
      }, [isMounted]);
      const getItems = ()=>{
        products.map((p)=>{
            if(!items.some(item=> item.id==p.id && item.type=='product') && sale.products.includes(p.id)){
                setItems(prevItems=>[...prevItems,{
                    id:p.id,name:p.name,price:p.price,tax:p.tax,type:'product'
                }])
            }
        })
        vouchers.map((p)=>{
            if(!items.some(item=> item.id==p.id && item.type=='voucher')&& sale.vouchers.includes(p.id)){
                setItems(prevItems=>[...prevItems,{
                    id:p.id,name:p.name,price:p.price,tax:p.tax,type:'voucher'
                }])
            }
        })
        services.map((p)=>{
            if(!items.some(item=> item.id==p.id && item.type=='service') && sale.services.includes(p.id)){
                setItems(prevItems=>[...prevItems,{
                    id:p.id,name:p.name,price:p.price,tax:p.tax,type:'service'
                }])
            }
        })
      }
    const getSub = useCallback(async () => {
      try {
        if(sale.sc){
           const data = await subscriptionApi.getSubscriptionBySc(sale?.sc);
           console.log(data)
          
          if (isMounted()) {
          setSub(data);
          }
        }
         
      } catch (err) {
          console.error(err);
      }
      }, [isMounted,sale]);
    
    useEffect(() => {
        getClient()
        getSeller()
        getProducts()
        getServices()
        getVouchers()
        getSub()
    },[])
    useEffect(()=>{
        getItems()
    },[products,vouchers,services])




  return (
    <form
      {...other}>
      <Card>
        <CardContent>
          <Grid
            container
            spacing={3}
          >
            <Grid
              item
              md={4}
              xs={12}
            >
              <Typography variant="h6">
                Datos generales
              </Typography>
            </Grid>
            <Grid
              item
              md={8}
              xs={12}
            >
              <Box sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="Total"
                name="amount"
                value={"$"+sale.amount}
              />
              </Box>
              <Box sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="Fecha y hora"
                name="date"
                type="text"
                value={new Date(sale.created_at).toLocaleDateString('es-ES')+" "+new Date(sale.created_at).getHours()+":"+new Date(sale.created_at).getMinutes().toString().padStart(2, '0')}
              />
              </Box>
              <Box sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="Cliente"
                name="client"
                value={client.first_name+" "+ client.last_name}
              />
              </Box>
              <Box sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="Empleado"
                name="seller"
                value={seller.username+" "}
              />
              </Box>
            </Grid>
            {!sale.sc ?
            <>
            <Grid
              item
              md={4}
              xs={12}
            >
              <Typography variant="h6">
                Items comprados
              </Typography>
            </Grid>
            <Grid
              item
              md={8}
              xs={12}
            >
              <Box sx={{ mt: 2 }}>
              <Scrollbar>
                <Table sx={{ minWidth: 700 }}>
                    <TableHead>
                        <TableRow>
                        <TableCell>Id</TableCell>
                        <TableCell>Tipo</TableCell>
                        <TableCell>Nombre</TableCell>
                        <TableCell>Precio</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {items.map((item) => {

                        return (
                            <TableRow hover 
                                key={item.id} >
                            
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
                                        {item.id}
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
                                    <NextLink href={`/${item.type}s/${item.id}`} 
                                    passHref>
                                    <Link 
                                    color="inherit" 
                                    variant="subtitle2">
                                        {item.type}
                                    </Link>
                                    </NextLink>
                                </Box>
                                </Box>
                        
                            </TableCell>
                            <TableCell>
                                <Typography color="success.main" 
                                variant="subtitle2">
                                {`${item.name}`}
                                </Typography>
                            </TableCell>
                            <TableCell>
                                ${`${item.price}`}
                            </TableCell>
                            
                            </TableRow>
                        );
                        })}
                    </TableBody>
                    </Table>
                </Scrollbar>
              </Box>
            </Grid>
            </>
            :
            <>
            <Grid
              item
              md={4}
              xs={12}
            >
              <Typography variant="h6">
                Subscripción:
              </Typography>
            </Grid>
            <Grid
              item
              md={8}
              xs={12}
            >
              <Box sx={{ mt: 2 }}>
                  <NextLink href={"/subscriptions"} passHref>
                    <a>
                      {sub?.name}
                    </a>
                      
                  </NextLink>
              </Box>
            </Grid>
            </>
            }
            
          </Grid>
        </CardContent>
        <CardActions
          sx={{
            flexWrap: 'wrap',
            m: -1
          }}
        >
          
          <NextLink
            href={`/profits/`}
            passHref
          >
            <Button
              component="a"
              sx={{
                m: 1,
                mr: 'auto'
              }}
              variant="outlined"
            >
              Volver
            </Button>
          </NextLink>
        </CardActions>
      </Card>
    </form>
  );
};

ProfitEditForm.propTypes = {
  sale: PropTypes.object.isRequired
};
