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
  FormHelperText,
  TextField,
  Typography,
  Divider
} from '@mui/material';
import { getPaymentMethods } from "../../slices/gym";
import { useEffect,useState, useCallback } from "react";
import { clientApi } from "../../api/client-api";
import { stripeApi } from '../../api/stripe-api';
import Cards from 'react-credit-cards';
import 'react-credit-cards/es/styles-compiled.css';
import { display } from '@mui/system';
import { ModalCreditCard } from './client-add-credit-card';
import { useMounted } from '../../hooks/use-mounted';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import { subscriptionApi } from '../../api/subscription-api';
import { ClientSubscriptionsListTable } from './client-subscriptions';
import { ClientProductsListTable } from './client-products';
import { ClientServicesListTable } from './client-services';
import { ClientVouchersListTable } from './client-vouchers';

/* Esto me dejará generar códigos UUID, los cuales usaré como Tokens para los QRs */
import { v4 as uuidv4 } from 'uuid';

/* Este archivo te muestra el Formulario para Editar a un Cliente Existente en el Dashboard del front-end.
* */

export const ClientProfile = (props) => {

  const isMounted = useMounted();
  const { client, ...other } = props;

  const [paymentMethods, setPaymentMethods] = useState([]);
  const getPaymentMethods = useCallback(async () => {
    try {
      const data = await stripeApi.getPaymentMethods(client.stripe_customer_id);
      if (isMounted()) {
        setPaymentMethods(data.data);
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMounted]);
  const [subscriptions, setSubscriptions] = useState([]);
  const getSubscriptions = useCallback(async () => {
    try {
      const data = await subscriptionApi.getSubscriptionsCustomer(client.id);
      //console.log(data)
      if (isMounted()) {
        setSubscriptions(data);
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMounted]);

  useEffect(() => {
    getPaymentMethods();
    getSubscriptions();
  },[]);
  const updatePaymentMethods = (updatedMethods) => {
    setPaymentMethods(updatedMethods);
  };

  const updateSubscriptions = (subs) => {
    setSubscriptions(subs);
  };

  /* Formulario usando la función Formik().

  Esto es para tomar los datos del Formulario de "Datos Generales" del Cliente, y luego enviárselos a la web app de
  Django usando una API.


  Aquí meteré un nuevo campo: "Token para el Código QR". Lo meteré con el nombre "token_for_qr_code", ya que ese
  es el nombre del campo para el Token del QR en el modelo de Account en la web app de Django. Tengo que meter esta
  nueva variable tanto en initialValues como en el try / catch de la función onSubmit.

  Debo declarar la variable con el Token para el Codigo del QR aquí ANTES de poder meter la variable con el Token del QR
  en la etiqueta <Box> del Formulario para Crear y Editar a los Clientes.

  DEBO MODIFICAR ESTO, ya que me está metiendo que el Género por defecto siempre es femenino, incluso aunque esté
  editando a un usuario existente, y su género NO sea femenino. AH YA: esta agarrando o el género del cliente que YA
  está metido en la base de datos, o si no hay género, lo pone por defecto como Femenino.

  Debo redirigir a los clientes a “/user” en lugar de “/clients” cuando ellos terminen de editar su propia información
  de su perfil.
  */
  const formik = useFormik({
    initialValues: {
      first_name: client.first_name || '',
      last_name: client.last_name || "",
      submit: null,
      phone: client.phone || '',
      email: client.email || '',
      username: client.username || '',
      postal_code: client.postal_code ||'', // Código Postal
      genre: client.genre ||'F',  // Género. Por defecto, es Femenino.
      token_for_qr_code: client.token_for_qr_code || '',  // Aquí meto la variable con el Token para el Código del QR
    },
    validationSchema: Yup.object({
      first_name: Yup.string().min(5).required(),
      last_name: Yup.string().min(5).required(),
      username: Yup.string().min(5).required()
    }),
    onSubmit: async (values, helpers) => {
      try {
        // NOTE: Make API request. Aquí también tuve que meter el Token para el Código del QR.
        await clientApi.updateClient(client.id, {first_name: values.first_name, email: values.email,
          phone: values.phone, last_name: values.last_name,username: values.username, password:client.password,
          genre:values.genre,postal_code:values.postal_code, token_for_qr_code: values.token_for_qr_code })
        helpers.setStatus({ success: true });
        helpers.setSubmitting(false);
        toast.success('¡Tus datos han sido modificados!');
        Router.push('/user').catch(console.error); // Esto te redirige a la página del Perfil del Cliente
      } catch (err) {
        console.error(err);
        toast.error('Error en la actualización, los datos no se han modificado');
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.message });
        helpers.setSubmitting(false);
      }
    }
  });



  const handleDeletePM = async (id) => {
    try {
      await stripeApi.deletePaymentMethod(id)
      toast.success('Método de pago borrado con éxito!');
      getPaymentMethods()
    } catch (err) {
      console.error(err);
      toast.error('Error en la actualización, los datos no se han modificado');
    }
}
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const GENRES_OPTIONS = [
    {value:'M',label:'Masculino'},
    {value:'F',label:'Femenino'},
    {value:'X',label:'Otro'}
  ];


  const handleCongelar = async(subscription)=>{
    if(confirm('congelar')){
      if(paymentMethods.length){
        let id = subscription.id
        subscription.status=2
        subscription.subscription= subscription.subscription.id
        const data = await stripeApi.freezeSubscription(subscription)
        if(data){
          toast.success('Suscripcion congelada con éxito')
          //getSubscriptions()
          //location.reload()
        }
      }else{
        toast.error('cree un payment method antes')
      }

      // getSubscriptions()
    }
  }
  const handleDescongelar = async(subscription)=>{
    if(confirm('descongelar')){
      let id = subscription.id
      let price_id_stripe = subscription.subscription.price_id_stripe
      subscription.status=1
      subscription.subscription= subscription.subscription.id
      const data = await stripeApi.reactivateSubscription(subscription,paymentMethods[0].id,client.stripe_customer_id,price_id_stripe)
      if(data){
        toast.success('Suscripcion descongelada con éxito')
        //getSubscriptions()
        //location.reload()
      }

    }
  }

  /* Formulario para Editar a un Cliente Existente en el Dashboard de la web app.

  Aquí está SOLO el formulario de "Datos Generales".

  Esto es lo que se envía a la API de la web app de Django para crear o editar un cliente en la base de datos de la
  web app de Django al Crear o Editar un cliente.

  Aquí es donde tengo que Generar el Token para el Código QR, y generar la imagen con el Código QR en sí.

  I will modify this snippet from this Formik form so that, isntead of being a charField field (a text field from a
  form), it's instead a button which, if you click, it will automatically generate a UUID. If you want, you can just
  leave this field and automatically fill it in with the UUID generated by the button that I mentioned to you. But I
  don't want the user to type anything in here: I want this field to be automatically filed by a UUID when they click a
  button.

  To achieve this, I will create a button that, when clicked, generates a UUID and sets it as the value of the
  token_for_qr_code field. You can use the uuid library in JavaScript to generate a UUID.

  The TextField component is made read-only by adding readOnly: true to its InputProps. This prevents the user from
  manually entering a value. The Button component's onClick handler generates a new UUID using uuidv4() and sets it as
  the value of the token_for_qr_code field using Formik's setFieldValue function.  Please note that you need to install
  the uuid library. You can do this by running npm install uuid in your terminal.

  THIS FORM IS FOR UPDATING AN EXISTING CLIENT. I need to create a new form just for Creating a client.

  Datos que necesito para el formulario de Crear un Cliente (formikCreate):
    username='testuser',  X
    first_name='Test',  X
    last_name='User', X
    email='testuser@example.com', X
    phone='1234567890', X
    birth_date='2000-01-01', NO LA NECESITO POR LOS MOMENTOS
    notes='Descripción',  X
    picture=None, NO LA NECESITO POR LOS MOMENTOS
    type='CUSTOMER', SIEMPRE VA A SER "Customer", Y ES OBLIGATORIO  X
    token_for_qr_code,  X
    password, X
  */
  return (
    <>

    <form
      onSubmit={formik.handleSubmit}
      {...other}>
      <Card sx={{ mt: 3 }}>
        <CardContent>

          {/* Grid de 1x3 (1 fila y 3 columnas) para mostrar el Formulario con los Datos del Cliente. */}
          <Grid
            container
            spacing={3}
          >
            {/* Columna 1 */}
            <Grid
              item
              md={4}
              xs={12}
            >
              <Typography variant="h6">
                Datos generales
              </Typography>
            </Grid>

            {/* Columna 2 */}
            <Grid
              item
              md={8}
              xs={12}
            >
              <Box sx={{ mt: 4 }}>
                <TextField
                  error={Boolean(formik.touched.first_name && formik.errors.first_name)}
                  fullWidth
                  helperText={formik.touched.first_name && formik.errors.first_name}
                  label="Nombre"
                  name="first_name"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.first_name}
                />
              </Box>
              {Boolean(formik.touched.first_name && formik.errors.first_name) && (
                <Box sx={{ mt: 2 }}>
                  <FormHelperText error>
                    {formik.errors.first_name}
                  </FormHelperText>
                </Box>
              )}
              <Box sx={{ mt: 4 }}>
                <TextField
                  error={Boolean(formik.touched.last_name && formik.errors.last_name)}
                  fullWidth
                  helperText={formik.touched.last_name && formik.errors.last_name}
                  label="Apellido"
                  name="last_name"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.last_name}
                />
              </Box>
              <Box sx={{ mt: 4 }}>
               <TextField
                  error={Boolean(formik.touched.username && formik.errors.username)}
                  fullWidth
                  helperText={formik.touched.username && formik.errors.username}
                  label="Username"
                  name="username"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.username}
                />
              </Box>
              <Box sx={{ mt: 2 }}>
                <TextField
                  error={Boolean(formik.touched.email && formik.errors.email)}
                  fullWidth
                  helperText={formik.touched.email && formik.errors.email}
                  label="Correo electrónico"
                  name="email"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.email}
                />
              </Box>

              {/* Campo de "Teléfono" */}
              <Box sx={{ mt: 4 }}>
                <TextField
                  error={Boolean(formik.touched.phone && formik.errors.phone)}
                  fullWidth
                  helperText={formik.touched.phone && formik.errors.phone}
                  label="Teléfono"
                  name="phone"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.phone}
                />
              </Box>

              {/* Campo de "Código Postal" */}
              <Box sx={{ mt: 4 }}>
                <TextField
                  error={Boolean(formik.touched.postal_code && formik.errors.postal_code)}
                  fullWidth
                  helperText={formik.touched.postal_code && formik.errors.postal_code}
                  label="Código Postal"
                  name="postal_code"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.postal_code}
                />
              </Box>

              {/* Campo de "Género" */}
              <Box sx={{ mt: 4 }}>
              <TextField
                label="Género"
                name="genre"
                select
                SelectProps={{ native: true }}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.genre}
              >
                {GENRES_OPTIONS.map((option) => (
                  <option
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </option>
                ))}
              </TextField>
              </Box>

              {/* Campo de "Token para el Código QR". */}
              {/* ESTO SE DEBE GENERAR AUTOMÁTICAMENTE. EL USUARIO NO DEBE PODER ESCRIBIR ESTO MANUALMENTE. */}
              {/* Puedo dejar que este campo sea de solo lectura únicamente para ver el Token que se enviará a la  */}
              {/* web app de Django para insertarlo en el QR. */}
              <Box sx={{mt: 4}}>
                <TextField
                    error={Boolean(formik.touched.token_for_qr_code && formik.errors.token_for_qr_code)}
                    fullWidth
                    helperText={formik.touched.token_for_qr_code && formik.errors.token_for_qr_code}
                    label="Token para el Código QR"
                    name="token_for_qr_code"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.token_for_qr_code}
                    InputProps={{
                      readOnly: true, // Esto hace que el campo sea de solo lectura.
                    }}
                />
              </Box>

              {/* Botón para Generar el Token para el Código QR */}
              {/* Lo pongo en un <Box> por separado para que haya espacio entre el campo que te muestra el Token */}
              {/* generado, y este botón. */}
              <Box sx={{mt: 4}}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      formik.setFieldValue('token_for_qr_code', uuidv4());
                    }}
                >
                  Generar Token QR
                </Button>
              </Box>

              {/* Línea divisoria estilo "hr" */}
              <Divider sx={{ my: 3 }} />

              {/* Botones de Update y Cancel. */}
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'right',
                  mx: -1,
                  mb: -1,
                  mt: 3
                }}
              >
                <NextLink href='/clients'>

                {/* Botón de "Cancel" / "Cancelar" */}
                <Button
                  sx={{ m: 1 }}
                  variant="outlined"
                >
                  Cancel
                </Button>
                </NextLink>

                {/* Botón de "Update" para Editar al Cliente Seleccionado. */}
                {/* ESTE BOTON SOLO DEBE SER VISIBLE EN /clients/id_del_cliente . */}
                <Button
                  sx={{ m: 1 }}
                  type="submit"
                  variant="contained"
                >
                  Update
                </Button>
              </Box>
              {/* Fin de los Botones de Update y Cancel. */}

            </Grid> {/* Fin de la Columna 2 */}
          </Grid>
        </CardContent>
      </Card>
    </form>
    <br></br>
    <Card>
      <CardContent>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6">
                Tarjetas vinculadas
              </Typography>
        </Box>
        <Box component="div" sx={{ height:'200px', display:'flex', flexWrap:'wrap', width:'max-content'}}>
        {Array.isArray(paymentMethods) && paymentMethods.map(pm => (
          <Box key={pm.id}>
            <Cards
            key={pm.id}
            cvc={"123"}
            expiry={pm.card.exp_month+' '+pm.card.exp_year}
            focused={"hola"}
            name={pm.billing_details.name? pm.billing_details.name: ''}
            number={'************'+pm.card.last4.toString()}
            sx={{ flex: '0 0 auto' }}
            preview={true}

          /><br />
          <IconButton aria-label="delete" onClick={()=>handleDeletePM(pm.id)}  sx={{ float: 'right', marginTop:'-15px' }}>
            <DeleteIcon />
          </IconButton>
          </Box>

        ))}

        </Box>
      </CardContent>

      {/* Contenedor con el botón de "Agregar Nueva" para Agregar Tarjeta de Debito */}
      <CardActions
        sx={{
          flexWrap: 'wrap',justifyContent: 'right',
          m: -1
        }}
      >

        <Button
          type="submit"
          sx={{ m: 1 }}
          variant="contained"
          className='pull-right'
          onClick={handleOpen}
        >
          Agregar nueva
        </Button>

      </CardActions>
    </Card>
    <br></br>



    {/* Este es el Card que muestra las Suscripciones del Cliente. */}

    {/* Ya se corrigió el bug en el que antes no se mostraban las suscripciones del cliente siendo editado. */}
    <Card>
      <CardContent>
        <Typography variant="h6">Suscripciones</Typography>

        <ClientSubscriptionsListTable
          client={client}
          subscriptions={subscriptions}
          subscriptionsCount={subscriptions.length}
          updateSubscriptions={updateSubscriptions}
          handleCongelar={handleCongelar}
          handleDescongelar={handleDescongelar}
        />
      </CardContent>
    </Card>
    <br></br>
    <Card>
      <CardContent>
        <Typography variant="h6">Productos</Typography>

        <ClientProductsListTable
          client={client}
          products={client?.products_sales ? client.products_sales: []}
          productsCount={client.products_sales?.length}
        />
      </CardContent>
    </Card>
    <br></br>
    <Card>
      <CardContent>
        <Typography variant="h6">Servicios</Typography>

        <ClientServicesListTable
          client={client}
          services={client?.services_sales ? client.services_sales: []}
          servicesCount={client.services_sales?.length}
        />
      </CardContent>
    </Card>
    <br></br>
    <Card>
      <CardContent>
        <Typography variant="h6">Bonos</Typography>

        <ClientVouchersListTable
          client={client}
          vouchers={client.vouchers_sales ? client.vouchers_sales: []}
          vouchersCount={client.vouchers_sales? client.vouchers_sales.length: 0}
        />
      </CardContent>
    </Card>
    <ModalCreditCard client={client} open={open} handleClose={handleClose}
        updatePaymentMethods={updatePaymentMethods}/>
    </>
  );
};

ClientProfile.propTypes = {
  client: PropTypes.object.isRequired
};

// import NextLink from 'next/link';
// import PropTypes from 'prop-types';
// import toast from 'react-hot-toast';
// import Router from "next/router";
// import * as Yup from 'yup';
// import { useFormik } from 'formik';
// import { useSelector, useDispatch } from 'react-redux';
// import {
//   Autocomplete,
//   Box,
//   Button,
//   Card,
//   CardActions,
//   CardContent,
//   Grid,
//   FormHelperText,
//   TextField,
//   Typography,
//   Divider
// } from '@mui/material';
// import { getPaymentMethods } from "../../slices/gym";
// import { useEffect,useState, useCallback } from "react";
// import { clientApi } from "../../api/client-api";
// import { stripeApi } from '../../api/stripe-api';
// import Cards from 'react-credit-cards';
// import 'react-credit-cards/es/styles-compiled.css';
// import { display } from '@mui/system';
// import { ModalCreditCard } from './client-add-credit-card';
// import { useMounted } from '../../hooks/use-mounted';
// import DeleteIcon from '@mui/icons-material/Delete';
// import IconButton from '@mui/material/IconButton';
// import { subscriptionApi } from '../../api/subscription-api';
// import { ClientSubscriptionsListTable } from './client-subscriptions';
// import { ClientProductsListTable } from './client-products';
// import { ClientServicesListTable } from './client-services';
// import { ClientVouchersListTable } from './client-vouchers';
//
// export const ClientProfile = (props) => {
//
//   const isMounted = useMounted();
//   const { client, ...other } = props;
//
//   const [paymentMethods, setPaymentMethods] = useState([]);
//   const getPaymentMethods = useCallback(async () => {
//     try {
//       const data = await stripeApi.getPaymentMethods(client.stripe_customer_id);
//       if (isMounted()) {
//         setPaymentMethods(data.data);
//       }
//     } catch (err) {
//       console.error(err);
//     }
//   }, [isMounted]);
//   const [subscriptions, setSubscriptions] = useState([]);
//   const getSubscriptions = useCallback(async () => {
//     try {
//       const data = await subscriptionApi.getSubscriptionsCustomer(client.id);
//       //console.log(data)
//       if (isMounted()) {
//         setSubscriptions(data);
//       }
//     } catch (err) {
//       console.error(err);
//     }
//   }, [isMounted]);
//
//   useEffect(() => {
//     getPaymentMethods();
//     getSubscriptions();
//   },[]);
//   const updatePaymentMethods = (updatedMethods) => {
//     setPaymentMethods(updatedMethods);
//   };
//
//   const updateSubscriptions = (subs) => {
//     setSubscriptions(subs);
//   };
//
//
//   const formik = useFormik({
//     initialValues: {
//       first_name: client.first_name || '',
//       last_name: client.last_name || "",
//       submit: null,
//       phone: client.phone || '',
//       email: client.email || '',
//       username: client.username || '',
//       postal_code: client.postal_code ||'',
//       genre: client.genre ||'F'
//     },
//     validationSchema: Yup.object({
//       first_name: Yup.string().min(5).required(),
//       last_name: Yup.string().min(5).required(),
//       username: Yup.string().min(5).required()
//     }),
//     onSubmit: async (values, helpers) => {
//       try {
//         // NOTE: Make API request
//         await clientApi.updateClient(client.id, {first_name: values.first_name, email: values.email, phone: values.phone, last_name: values.last_name,username: values.username, password:client.password, genre:values.genre,postal_code:values.postal_code })
//         helpers.setStatus({ success: true });
//         helpers.setSubmitting(false);
//         toast.success('Cliente modificado!');
//         Router.push('/clients').catch(console.error);
//       } catch (err) {
//         console.error(err);
//         toast.error('Error en la actualización, los datos no se han modificado');
//         helpers.setStatus({ success: false });
//         helpers.setErrors({ submit: err.message });
//         helpers.setSubmitting(false);
//       }
//     }
//   });
//
//
//   const handleDeletePM = async (id) => {
//     try {
//       await stripeApi.deletePaymentMethod(id)
//       toast.success('Método de pago borrado con éxito!');
//       getPaymentMethods()
//     } catch (err) {
//       console.error(err);
//       toast.error('Error en la actualización, los datos no se han modificado');
//     }
// }
//   const [open, setOpen] = useState(false);
//   const handleOpen = () => setOpen(true);
//   const handleClose = () => setOpen(false);
//
//   const GENRES_OPTIONS = [
//     {value:'M',label:'Masculino'},
//     {value:'F',label:'Femenino'},
//     {value:'X',label:'Otro'}
//   ];
//
//
//   const handleCongelar = async(subscription)=>{
//     if(confirm('congelar')){
//       if(paymentMethods.length){
//         let id = subscription.id
//         subscription.status=2
//         subscription.subscription= subscription.subscription.id
//         const data = await stripeApi.freezeSubscription(subscription)
//         if(data){
//           toast.success('Suscripcion congelada con éxito')
//           //getSubscriptions()
//           //location.reload()
//         }
//       }else{
//         toast.error('cree un payment method antes')
//       }
//
//       // getSubscriptions()
//     }
//   }
//   const handleDescongelar = async(subscription)=>{
//     if(confirm('descongelar')){
//       let id = subscription.id
//       let price_id_stripe = subscription.subscription.price_id_stripe
//       subscription.status=1
//       subscription.subscription= subscription.subscription.id
//       const data = await stripeApi.reactivateSubscription(subscription,paymentMethods[0].id,client.stripe_customer_id,price_id_stripe)
//       if(data){
//         toast.success('Suscripcion descongelada con éxito')
//         //getSubscriptions()
//         //location.reload()
//       }
//
//     }
//   }
//
//   return (
//     <>
//
//     <form
//       onSubmit={formik.handleSubmit}
//       {...other}>
//       <Card sx={{ mt: 3 }}>
//         <CardContent>
//           <Grid
//             container
//             spacing={3}
//           >
//             <Grid
//               item
//               md={4}
//               xs={12}
//             >
//               <Typography variant="h6">
//                 Datos generales
//               </Typography>
//             </Grid>
//             <Grid
//               item
//               md={8}
//               xs={12}
//             >
//               <Box sx={{ mt: 4 }}>
//                 <TextField
//                   error={Boolean(formik.touched.first_name && formik.errors.first_name)}
//                   fullWidth
//                   helperText={formik.touched.first_name && formik.errors.first_name}
//                   label="Nombre"
//                   name="first_name"
//                   onBlur={formik.handleBlur}
//                   onChange={formik.handleChange}
//                   value={formik.values.first_name}
//                 />
//               </Box>
//               {Boolean(formik.touched.first_name && formik.errors.first_name) && (
//                 <Box sx={{ mt: 2 }}>
//                   <FormHelperText error>
//                     {formik.errors.first_name}
//                   </FormHelperText>
//                 </Box>
//               )}
//               <Box sx={{ mt: 4 }}>
//                 <TextField
//                   error={Boolean(formik.touched.last_name && formik.errors.last_name)}
//                   fullWidth
//                   helperText={formik.touched.last_name && formik.errors.last_name}
//                   label="Apellido"
//                   name="last_name"
//                   onBlur={formik.handleBlur}
//                   onChange={formik.handleChange}
//                   value={formik.values.last_name}
//                 />
//               </Box>
//               <Box sx={{ mt: 4 }}>
//                <TextField
//                   error={Boolean(formik.touched.username && formik.errors.username)}
//                   fullWidth
//                   helperText={formik.touched.username && formik.errors.username}
//                   label="Username"
//                   name="username"
//                   onBlur={formik.handleBlur}
//                   onChange={formik.handleChange}
//                   value={formik.values.username}
//                 />
//               </Box>
//               <Box sx={{ mt: 2 }}>
//                 <TextField
//                   error={Boolean(formik.touched.email && formik.errors.email)}
//                   fullWidth
//                   helperText={formik.touched.email && formik.errors.email}
//                   label="Correo electrónico"
//                   name="email"
//                   onBlur={formik.handleBlur}
//                   onChange={formik.handleChange}
//                   value={formik.values.email}
//                 />
//               </Box>
//               <Box sx={{ mt: 4 }}>
//                 <TextField
//                   error={Boolean(formik.touched.phone && formik.errors.phone)}
//                   fullWidth
//                   helperText={formik.touched.phone && formik.errors.phone}
//                   label="Teléfono"
//                   name="phone"
//                   onBlur={formik.handleBlur}
//                   onChange={formik.handleChange}
//                   value={formik.values.phone}
//                 />
//               </Box>
//               <Box sx={{ mt: 4 }}>
//                 <TextField
//                   error={Boolean(formik.touched.postal_code && formik.errors.postal_code)}
//                   fullWidth
//                   helperText={formik.touched.postal_code && formik.errors.postal_code}
//                   label="Código Postal"
//                   name="postal_code"
//                   onBlur={formik.handleBlur}
//                   onChange={formik.handleChange}
//                   value={formik.values.postal_code}
//                 />
//               </Box>
//               <Box sx={{ mt: 4 }}>
//               <TextField
//                 label="Género"
//                 name="genre"
//                 select
//                 SelectProps={{ native: true }}
//                 onBlur={formik.handleBlur}
//                 onChange={formik.handleChange}
//                 value={formik.values.genre}
//               >
//                 {GENRES_OPTIONS.map((option) => (
//                   <option
//                     key={option.value}
//                     value={option.value}
//                   >
//                     {option.label}
//                   </option>
//                 ))}
//               </TextField>
//               </Box>
//               <Divider sx={{ my: 3 }} />
//               <Box
//                 sx={{
//                   display: 'flex',
//                   flexWrap: 'wrap',
//                   justifyContent: 'right',
//                   mx: -1,
//                   mb: -1,
//                   mt: 3
//                 }}
//               >
//                 <NextLink href='/clients'>
//                 <Button
//                   sx={{ m: 1 }}
//                   variant="outlined"
//                 >
//                   Cancel
//                 </Button>
//                 </NextLink>
//                 <Button
//                   sx={{ m: 1 }}
//                   type="submit"
//                   variant="contained"
//                 >
//                   Update
//                 </Button>
//               </Box>
//
//             </Grid>
//           </Grid>
//         </CardContent>
//       </Card>
//     </form>
//     <br></br>
//     <Card>
//       <CardContent>
//         <Box sx={{ mb: 4 }}>
//           <Typography variant="h6">
//                 Tarjetas vinculadas
//               </Typography>
//         </Box>
//         <Box component="div" sx={{ height:'200px', display:'flex', flexWrap:'wrap', width:'max-content'}}>
//         {Array.isArray(paymentMethods) && paymentMethods.map(pm => (
//           <Box key={pm.id}>
//             <Cards
//             key={pm.id}
//             cvc={"123"}
//             expiry={pm.card.exp_month+' '+pm.card.exp_year}
//             focused={"hola"}
//             name={pm.billing_details.name? pm.billing_details.name: ''}
//             number={'************'+pm.card.last4.toString()}
//             sx={{ flex: '0 0 auto' }}
//             preview={true}
//
//           /><br />
//           <IconButton aria-label="delete" onClick={()=>handleDeletePM(pm.id)}  sx={{ float: 'right', marginTop:'-15px' }}>
//             <DeleteIcon />
//           </IconButton>
//           </Box>
//
//         ))}
//
//         </Box>
//       </CardContent>
//       <CardActions
//         sx={{
//           flexWrap: 'wrap',justifyContent: 'right',
//           m: -1
//         }}
//       >
//
//         <Button
//           type="submit"
//           sx={{ m: 1 }}
//           variant="contained"
//           className='pull-right'
//           onClick={handleOpen}
//         >
//           Agregar nueva
//         </Button>
//
//       </CardActions>
//     </Card>
//     <br></br>
//     <Card>
//       <CardContent>
//         <Typography variant="h6">Suscripciones</Typography>
//
//         <ClientSubscriptionsListTable
//           client={client}
//           subscriptions={subscriptions}
//           subscriptionsCount={subscriptions.length}
//           updateSubscriptions={updateSubscriptions}
//           handleCongelar={handleCongelar}
//           handleDescongelar={handleDescongelar}
//         />
//       </CardContent>
//     </Card>
//     <br></br>
//     <Card>
//       <CardContent>
//         <Typography variant="h6">Productos</Typography>
//
//         <ClientProductsListTable
//           client={client}
//           products={client?.products_sales ? client.products_sales: []}
//           productsCount={client.products_sales?.length}
//         />
//       </CardContent>
//     </Card>
//     <br></br>
//     <Card>
//       <CardContent>
//         <Typography variant="h6">Servicios</Typography>
//
//         <ClientServicesListTable
//           client={client}
//           services={client?.services_sales ? client.services_sales: []}
//           servicesCount={client.services_sales?.length}
//         />
//       </CardContent>
//     </Card>
//     <br></br>
//     <Card>
//       <CardContent>
//         <Typography variant="h6">Bonos</Typography>
//
//         <ClientVouchersListTable
//           client={client}
//           vouchers={client.vouchers_sales ? client.vouchers_sales: []}
//           vouchersCount={client.vouchers_sales? client.vouchers_sales.length: 0}
//         />
//       </CardContent>
//     </Card>
//     <ModalCreditCard client={client} open={open} handleClose={handleClose}
//         updatePaymentMethods={updatePaymentMethods}/>
//     </>
//   );
// };
//
// ClientProfile.propTypes = {
//   client: PropTypes.object.isRequired
// };