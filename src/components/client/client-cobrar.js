import NextLink from 'next/link';
import PropTypes from 'prop-types';
import toast from 'react-hot-toast';
import Router from "next/router";
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useSelector, useDispatch } from 'react-redux';
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  TextField,
  Typography,
  Select,
  Divider,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  DialogContentText
} from '@mui/material';

import { MobileDatePicker } from '@mui/x-date-pickers';
import { useEffect, useState, useCallback } from "react";
import { clientApi } from "../../api/client-api";
import { stripeApi } from '../../api/stripe-api';
import { height } from '@mui/system';
import AddIcon from '@mui/icons-material/Add';
import Popover from '@mui/material/Popover';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useMounted } from '../../hooks/use-mounted';
import { saleApi } from '../../api/sale-api';
import { productApi } from '../../api/product-api';
import { subscriptionApi } from '../../api/subscription-api';
import { voucherApi } from '../../api/voucher-api';
import { taxApi } from '../../api/tax-api';
import { serviceApi } from '../../api/service-api';

/* Componente que me Permite Comprar Productos y Servicios.
*
* Necesitas tener una Tarjeta de Credito registrada para poder hacer cualquier compra.
*
* Aquí es donde se le suman los impuestos al precio sin impuestos del producto o servicio. El cálculo de los impuestos
* se hace aquí desde el front-end, NO desde el back-end de Django.
* */

function stringify(data) {
  return Object.keys(data)
    .map(key => {
      if (typeof data[key] === 'object') {
        // Si el valor es un objeto, iteramos sobre sus claves y valores
        return Object.keys(data[key])
          .map(subKey => {
            return encodeURIComponent(`${key}[${subKey}]`) + '=' + encodeURIComponent(data[key][subKey]);
          })
          .join('&');
      } else {
        // Si el valor no es un objeto, lo codificamos y lo concatenamos con su clave
        return encodeURIComponent(key) + '=' + encodeURIComponent(data[key]);
      }
    })
    .join('&');
}

// TODO: estos valores deberían estar en el store(Copiar la lógica de create form)

export const ClientCobrar = (props) => {
  const isMounted = useMounted();

  const { client, ...other } = props;
  const [show, setShow] = useState(false);
  const [showTypes, setShowTypes] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [items, setItems] = useState([]);
  const [total,setTotal] = useState(0);
  const [anchorEl2, setAnchorEl2] = useState(null);
  const [sellers, setSellers] = useState([]);
  const [type,setType] =useState([])
  const [products,setProducts ] = useState([])
  const [services,setServices ] = useState([])
  const [vouchers,setVouchers ] = useState([])
  const [subscriptions,setSubscriptions ] = useState([])
  const [seller, setSeller] = useState('');
  const [confirming,setConfirming] = useState(false)
  const [selectedDate, setSelectedDate] = useState(null);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleSellerChange = (event) => {
    setSeller(event.target.value);
  };

  const getSellers= useCallback(async () => {
    try {
      const data = await saleApi.getSellers();
      //console.log(data)
      if (isMounted()) {
        setSellers(data);
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMounted]);
  const getProducts = useCallback(async () => {
    try {
      const data = await productApi.getProducts();
      if (isMounted()) {
        setProducts(data.filter(producto => producto.is_active));
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMounted]);
  const getSubscriptions= useCallback(async () => {
    try {
      const data = await subscriptionApi.getSubscriptions();
      if (isMounted()) {
        setSubscriptions(data.filter(e=>e.price_id_stripe!==null && e.is_active));
        //console.log(data.filter(e=>e.price_id_stripe!==null))
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMounted]);
  const getVouchers= useCallback(async () => {
    try {
      const data = await voucherApi.getVouchers();
      if (isMounted()) {
        setVouchers(data.filter(voucher => voucher.is_active));
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMounted]);
  const getServices = useCallback(async () => {
    try {
      const data = await serviceApi.getServices();
      if (isMounted()) {
        setServices(data.filter(service => service.is_active));
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMounted]);
  useEffect(() => {
    getSellers();
    getProducts();
    getSubscriptions();
    getVouchers()
    getServices()
  },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  []);


  
  const handleShowCobrar = async ()=>{
    setShow(true)
  }
  const handleHideCobrar = async ()=>{
    setShow(false)
    setSelectedItem(null)
    setType(null)
    setItems([])
    setTotal(0)
    setConfirming(false)
    setSeller(null)
  }
  const handleShowTypes = async (event)=>{
    setShowTypes(true)
    setAnchorEl(event.currentTarget);
  }
  const handleHideTypes = async ()=>{
    setShowTypes(false)
    setAnchorEl(null);
    setSelectedItem(null);
    setAnchorEl2(null)
  }
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const handleItemSelect = (item) => {
    setSelectedItem(item);
    //setAnchorEl(null);
  };

  /* Aquí es donde se calculan los impuestos y se suman al precio del producto o servicio.
  *
  * */
  const addItem = async(item)=>{
    handleHideTypes();
    if(item.tax_id){
      const data = await taxApi.getTax(item.tax_id)
      item.tax=data;
      setTotal(parseFloat(parseFloat(total) + (parseFloat(item.tax.percentage) / 100 + 1) * item.price).toFixed(2))
    }else{
      setTotal(parseFloat(parseFloat(total) +item.price))
    }
    setItems(prevItems => [...prevItems, item]);
    setType(selectedItem)
  }
  const removeItem = async () => {
    const updatedItems = items.filter(i => i.id !== selectedItem.id)
    setItems(updatedItems);
    let newTotal = updatedItems.reduce((accumulator, item) => accumulator + item.price, 0);
    setTotal(parseFloat(newTotal));
    setAnchorEl2(null)
    if(!updatedItems.length){
      setType(null)
      setSelectedItem(null)
      setConfirming(false)
    }
  }

  const handleShowProductOptions=async(event,item)=>{
    setAnchorEl2(event.currentTarget)
    setSelectedItem(item)
  }

  const handleHideProductOptions = async()=>{
    setAnchorEl2(null)
  }
  const open2 = Boolean(anchorEl2);
  
  const [modalOpen, setModalOpen] = useState(false);

  const handleOpenModal = () => {
    if(!seller || seller=='') toast.error('Seleccione un vendedor')  
    else setModalOpen(true);
  };

  const handleCloseModal = () => {
    setConfirming(false)
    setModalOpen(false);
  };

  const handleConfirmModal = async() => {
    setConfirming(true)
    // chequear que tenga payment methods y seleccionar payment method 
    if(client.stripe_customer_id){
      let pms = await stripeApi.getPaymentMethods(client.stripe_customer_id);
      if(pms.data.length){
        let pm = pms.data[0];
        if(type=='suscripcion'){
          if(!selectedDate){
            toast.error("Seleccione una fecha")
            setConfirming(false)
          }else{
            let fecha = selectedDate;
            let response = await stripeApi.createSubscription(items[0],pm,fecha);
            if(response.status="succeded"){
              await saleApi.createSale({
                amount:total,
                buyer:client.id,
                seller:seller,
                gym:1,
                products:[],
                services:[],
                vouchers:[],
                created_at: new Date(selectedDate),
                sc: response.sc
              }
              )
              console.log(response)
              toast.success('Suscripción creada con éxito!');
              location.reload()
              handleHideCobrar()
              
            }else{
              toast.error('Error al procesar pago.');
              console.log(response)
            }
          }
          
          
        }else{
          let data={
            amount:Math.round(parseFloat(total).toFixed(2)*100),
            currency:'usd',
            payment_method:pm.id,
            customer:client.stripe_customer_id,
            confirm:true
          }
          let sale_products =[];
          items.map(item=> {
            if(item.type=='product'){
              sale_products.push(item.id)
            } 
          })
          let sale_vouchers =[];
          items.map(item=> {
            if(item.type=='voucher'){
              sale_vouchers.push(item.id)
            } 
          })
          let sale_services =[];
          items.map(item=> {
            if(item.type=='service'){
              sale_services.push(item.id)
            } 
          })
          let response2 = await saleApi.createSale({amount:total,buyer:client.id,seller:seller,gym:1,products:sale_products,services:sale_services,vouchers:sale_vouchers})
          //console.log(response2)
          if(response2){
            let response = await stripeApi.createPayment(data);
            if(response.status="succeded"){
              toast.success('Pago realizado con éxito!');
              handleHideCobrar()
              location.reload()
            }else{
            toast.error('Error al procesar pago.');
            console.log(response)
          }
          }else{
            toast.error('Error al procesar pago.');
            console.log(response2)
          }

        }
        
      }else{
        toast.error('Error: es necesario vincular un método de pago.');
      }
    }else{
      toast.error('Error: es necesario vincular un método de pago.');
    }
    setConfirming(false)
    handleCloseModal();
  };
  
  const handleDiscount = () => {
    const discount = prompt("Ingrese el descuento (en USD):"); 
    if (discount !== null) {
      const discountedPrice = (selectedItem.price - parseFloat(discount)).toFixed(2);
      const newItem = { ...selectedItem, price: discountedPrice }; 
      const updatedItems = items.map((i) => (i.id === selectedItem.id ? newItem : i)); 
      setItems(updatedItems); 
      setTotal(parseFloat(total - parseFloat(discount))); 
    }
  };

  return (
    <>
    {!show && <Button
        onClick={handleShowCobrar}
        type="button"
        sx={{ my: 3 }}
        variant="contained"
    >
    Cobrar
    </Button>
    }
    {show && 
    <>
    <Card sx={{ mt: 3,mb:3}}>
      <CardContent sx={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Grid container spacing={2} >
         
          <Grid item md={8} sx={{display: 'flex',justifyContent: 'flex-start',height:'200px'}}>
          {items && items.map((item) => (
            <div key={item.id}>
              <Button
                sx={{ backgroundColor: '#f2f2f2', margin: '25px', padding: '20px', width: '150px', borderRadius: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                onClick={(e) => handleShowProductOptions(e, item)}
              >
                {!item.tax ? (
                  <ListItemText primary={item.name + ' $' + item.price} />
                ) : (
                  <div>
                    <ListItemText primary={item.name + ' $' + item.price + " + " + item.tax.name + " %" + item.tax.percentage} />
                    <p>{"Total: $" + ((parseFloat(item.tax.percentage) / 100 + 1) * item.price).toFixed(2)}</p>
                  </div>
                )}
              </Button>
              <Popover
                open={open2}
                anchorEl={anchorEl2}
                onClose={handleHideProductOptions}
                anchorOrigin={{
                  vertical: 'center',
                  horizontal: 'center',
                }}
                transformOrigin={{
                  vertical: 'center',
                  horizontal: 'center',
                }}
              >
                <List>
                  {type === 'suscripcion' ? null : (
                    <ListItem>
                      <Button sx={{ width: '100%' }} onClick={handleDiscount}>Aplicar descuento</Button>
                    </ListItem>
                  )}
                  <ListItem>
                    <Button onClick={removeItem} sx={{ width: '100%' }}>Borrar</Button>
                  </ListItem>
                </List>
              </Popover>
            </div>
          ))}
           {type=='suscripcion'?
            <></>:
          <Button sx={{ backgroundColor: '#f2f2f2', margin: '25px', padding: '20px' }} onClick={handleShowTypes}>
            <AddIcon sx={{ fontSize: 48, color: '#fff' }} />
          </Button>
          }
          
          
          <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleHideTypes}
            anchorOrigin={{
              vertical: 'center',
              horizontal: 'center',
            }}
            transformOrigin={{
              vertical: 'center',
              horizontal: 'center',
            }}
          >
            {selectedItem ? (
              <>
                <Button onClick={() => handleItemSelect(null)}>
                  <ArrowBackIcon sx={{ color: '#000' }}/>
                </Button>
                <List>
                  {selectedItem=='producto' && products.map((e)=>(
                    <ListItem button onClick={()=>addItem({id:e.id,name:e.name,price:e.price,type:'product',tax_id:e.tax})}>
                      <Typography variant="body1">{e.name} ${e.price}</Typography>
                    </ListItem>
                    ))

                  }
                  {selectedItem=='bono' && vouchers.map((e)=>(
                    <ListItem button onClick={()=>addItem({id:e.id,name:e.name,price:e.price,type:'voucher',tax_id:e.tax})}>
                      <Typography variant="body1">{e.name} ${e.price}</Typography>
                    </ListItem>
                    ))
                  }
                  {selectedItem=='servicio' && services.map((e)=>(
                    <ListItem button onClick={()=>addItem({id:e.id,name:e.name,price:e.price,type:'service',tax_id:e.tax})}>
                      <Typography variant="body1">{e.name} ${e.price}</Typography>
                    </ListItem>
                    ))

                  }
                  {selectedItem=='suscripcion' && subscriptions.map((e)=>(
                    <ListItem button onClick={()=>addItem({id:e.id,name:e.name,price:e.price,type:'subscription',client:client,stripe_customer_id:client.stripe_customer_id,price_id:e.price_id_stripe})}>
                      <Typography variant="body1">{e.name} ${e.price}</Typography>
                    </ListItem>
                    ))

                  }
                </List>
              </>
              
            ) : (
              <List>
                {type !='suscripcion' && <ListItem button onClick={() => handleItemSelect('producto')}>
                  <ListItemText primary="Añadir producto" />
                </ListItem>
                }
                {type !='suscripcion' && <ListItem button onClick={() => handleItemSelect('bono')}>
                  <ListItemText primary="Añadir bono" />
                </ListItem>
                }
                {type !='servicio' && <ListItem button onClick={() => handleItemSelect('servicio')}>
                  <ListItemText primary="Añadir servicio" />
                </ListItem>
                }
                {type !='producto' && type !='bono' && type !='servicio' && <ListItem button onClick={() => handleItemSelect('suscripcion')}>
                  <ListItemText primary="Añadir suscripción" />
                </ListItem>
                }
              </List>
            )}
          </Popover>
          </Grid>
          <Grid item md={4}>
            {total>0 && 
            <>
            Resumen
            <List>
              {items && items.map((item) => (
                <>
                  <ListItem key={item.id}>
                    <Grid container justifyContent="space-between">
                      <Grid md={6} item>
                        <Typography variant="body1" sx={{fontSize:'0.7rem',lineHeight:'1'}}>{item.name}</Typography>
                      </Grid>
                      <Grid md={6} item>
                        <Typography variant="body1" sx={{ textAlign: 'right',fontSize:'0.7rem',lineHeight:'1' }}>${item.price}</Typography>
                      </Grid>
                      <Grid md={6} item>
                        </Grid>
                      {item.type!='subscription' && 
                      <Grid md={6} item>
                        <Typography variant="body1" sx={{ textAlign: 'right',fontSize:'0.7rem',lineHeight:'1' }}>{item.tax.name} %{item.tax.percentage} ${((parseFloat(item.tax.percentage) / 100) * item.price).toFixed(2)}</Typography>
                      </Grid>
                      }
                    </Grid>
                  </ListItem>
                </>
              ))}
            </List>
            <Divider />
            <Grid container justifyContent="space-between">
              <Grid item>
                <Typography variant="body1">Total</Typography>
              </Grid>
              <Grid item>
                <Typography variant="body1" sx={{ textAlign: 'right',fontSize:'0.7rem',lineHeight:'1' }}>${total}</Typography>
              </Grid>
            </Grid>
            <Button type="button"
              sx={{ m: 1,width:'100%' }}
                variant="contained"
                onClick={handleOpenModal}
                >Pagar</Button>
            </>
            }
          </Grid>
        
          
        </Grid>
        
      </CardContent>
      
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', ml: 5, mb: 3 }}>
        <FormControl sx={{ width: '180px' }}>
          <InputLabel sx={{ pl: 2 }}>Vendedor</InputLabel>
          <Select
            labelId="select-label"
            id="select"
            onChange={handleSellerChange}
          >
            {sellers && sellers.map((e) => (
              <MenuItem key={e.id} value={e.id}>{e.username}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          onClick={handleHideCobrar}
          type="button"
          sx={{mr:2}}
          variant="outlined"
        >
          Cancel
        </Button>
      </Box>
      
    </Card>
    </>
    }

    <Dialog
      open={modalOpen}
      onClose={handleCloseModal}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">Confirmación pago</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          ¿Estás seguro de cobrar ${total}?
        </DialogContentText>
       
        {type=='suscripcion'? (
           <Box
           sx={{
             alignItems: 'center',
             display: 'flex',
             mt: 3
           }}
         >
           <MobileDatePicker
             label="Fecha inicio"
             inputFormat="dd/MM/yyyy"
             value={selectedDate}
             name="valid_from"
             onChange={handleDateChange}
             renderInput={(inputProps) => <TextField {...inputProps} />}
           />
         </Box>
        ):<></>}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseModal} disabled={confirming}>Cancelar</Button>
        <Button onClick={handleConfirmModal} autoFocus disabled={confirming}>
          Confirmar
        </Button>
      </DialogActions>
    </Dialog>
    
    </>
  );
};

ClientCobrar.propTypes = {
  client: PropTypes.object.isRequired
};
