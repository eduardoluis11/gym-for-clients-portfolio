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

/* Esto me dejará generar códigos UUID, los cuales usaré como Tokens para los QRs */
import { v4 as uuidv4 } from 'uuid';

/* Este Archivo tiene el Formulario Formik para Crear a un Nuevo Cliente en el Dashboard del front-end de la web app.

El archivo new.js en la carpeta pages/clients, accede a este archivo para poder crear a un nuevo cliente.

* */

/* Esto tiene que llamarse "CreateNewClient" para que pueda ser detectado como "CreateNewClient" en new.js */
export const CreateNewClient = (props) => {

  const isMounted = useMounted();
  const { client, ...other } = props;

  const [paymentMethods, setPaymentMethods] = useState([]);
  const getPaymentMethods = useCallback(async () => {
    try {
      const data = await stripeApi.getPaymentMethods(client.stripe_customer_id);
      console.log(data.data)
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

  // /* Formulario usando la función Formik().
  //
  // Esto es para tomar los datos del Formulario de "Datos Generales" del Cliente, y luego enviárselos a la web app de
  // Django usando una API.
  //
  //
  // Aquí meteré un nuevo campo: "Token para el Código QR". Lo meteré con el nombre "token_for_qr_code", ya que ese
  // es el nombre del campo para el Token del QR en el modelo de Account en la web app de Django. Tengo que meter esta
  // nueva variable tanto en initialValues como en el try / catch de la función onSubmit.
  //
  // Debo declarar la variable con el Token para el Codigo del QR aquí ANTES de poder meter la variable con el Token del QR
  // en la etiqueta <Box> del Formulario para Crear y Editar a los Clientes.
  // */
  // const formik = useFormik({
  //   initialValues: {
  //     first_name: client.first_name || '',
  //     last_name: client.last_name || "",
  //     submit: null,
  //     phone: client.phone || '',
  //     email: client.email || '',
  //     username: client.username || '',
  //     token_for_qr_code: client.token_for_qr_code || '',
  //   },
  //   validationSchema: Yup.object({
  //     first_name: Yup.string().min(5).required(),
  //     last_name: Yup.string().min(5).required(),
  //     username: Yup.string().min(5).required()
  //   }),
  //   onSubmit: async (values, helpers) => {
  //     try {
  //       // NOTE: Make API request
  //       await clientApi.updateClient(client.id, {first_name: values.first_name, email: values.email,
  //         phone: values.phone, last_name: values.last_name,username: values.username, password:client.password,
  //         token_for_qr_code: values.token_for_qr_code })
  //       helpers.setStatus({ success: true });
  //       helpers.setSubmitting(false);
  //       console.log(values)
  //       toast.success('Cliente modificado!');
  //       Router.push('/clients').catch(console.error);
  //     } catch (err) {
  //       console.error(err);
  //       toast.error('Error en la actualización, los datos no se han modificado');
  //       helpers.setStatus({ success: false });
  //       helpers.setErrors({ submit: err.message });
  //       helpers.setSubmitting(false);
  //     }
  //   }
  // });

  /* Formulario para Crear a un Nuevo Cliente en el Dashboard de la web app.
  *
  * This will be similar to the existing Formik instance, but it will call the createClient() function instead of
  * updateClient().
  *
  * Aquí también tengo que meter todos los campos para crear a un nuevo cliente en la web app de Django.
  *
  * Campos que necesito meter:
  *   username,
      first_name, X
      last_name,  X
      email,  X
      phone,  X
      birth_date='2000-01-01',  X
      notes,  NO USAR.
      picture,  X
      type='CUSTOMER', (SIEMPRE DEBE SER CUSTOMER)  X
      token_for_qr_code,  X
      password, X
  *
  * "Validation schema" es para decir cuales campos son obligatorios, para forzar al usuario que ponga esos campos.
  *
  * Quiero agregar un campo que se llame "Confirmar Contraseña" para que el usuario tenga que escribir 2 veces la
  * contraseña. Esto es para que el usuario tenga que escribir la misma contraseña 2 veces, y así no se le olvide la
  * contraseña. Si escribe mal la contraseña la 2da vez, no se creará al cliente, y le saldrá un mensaje de error.
  *
  * Eliminé el campo de "notes" / "Descripción" porque no lo necesito.
  *
  * Voy a incluir los campos del Código Postal y el del Género. Ver client-profile.js como referencia.
  * */
  const formikCreate = useFormik({
    initialValues: {
      first_name: '',
      last_name: '',
      phone: '',
      email: '',
      username: '',
      password: '',
      confirmPassword: '',
      type: 'CUSTOMER',
      picture: null,
      // notes: '',
      birth_date: '2000-01-01',
      postal_code: '' ||'', // Código Postal. Está inicialmente vacío.
      genre: '' ||'F',  // Género. Por defecto, es Femenino. Está inicialmente vacío.
      token_for_qr_code: '',
    },
    validationSchema: Yup.object({
      first_name: Yup.string().min(5).required(),
      last_name: Yup.string().min(5).required(),
      username: Yup.string().min(5).required(),
      password: Yup.string().min(5).required(),
      email: Yup.string().min(5).required(),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Las contraseñas NO coinciden.')
        .required('Debe rellenar el campo de Confirmar Contraseña.'),
    }),
    onSubmit: async (values, helpers) => {
      try {
        // NOTE: Make API request
        await clientApi.createClient({
          first_name: values.first_name,
          email: values.email,
          phone: values.phone,
          last_name: values.last_name,
          username: values.username,
          password: values.password,
          token_for_qr_code: values.token_for_qr_code,
          // notes: values.notes,
          birth_date: values.birth_date,
          genre:values.genre,
          postal_code:values.postal_code,
        })
        helpers.setStatus({ success: true });
        helpers.setSubmitting(false);
        toast.success('Cliente creado!');
        Router.push('/clients').catch(console.error);
      } catch (err) {
        console.error(err);
        toast.error('Error en la creación, el cliente no se ha creado');
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

  /* Opciones para el campo de "Género" en el formulario de Crear un Cliente, el cual es un Menú Desplegable.
  * */
  const GENRES_OPTIONS = [
    {value:'M',label:'Masculino'},
    {value:'F',label:'Femenino'},
    {value:'X',label:'Otro'}
  ];


  /* Formulario para Crear a un Nuevo Cliente y para Editar a uno Existente en el Dashboard de la web app.

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

    A new TextField is added for the Date of Birth. The type prop is set to "date" to provide a date picker. The
    InputLabelProps prop with shrink: true is used to ensure that the label does not overlap with the date picker.
  */
  return (
      <>

        {/*<form*/}
        {/*    onSubmit={formik.handleSubmit}*/}
        {/*    {...other}>*/}
        {/*  <Card sx={{mt: 3}}>*/}
        {/*    <CardContent>*/}
        {/*      <Grid*/}
        {/*          container*/}
        {/*          spacing={3}*/}
        {/*      >*/}
        {/*        <Grid*/}
        {/*            item*/}
        {/*            md={4}*/}
        {/*            xs={12}*/}
        {/*        >*/}
        {/*          <Typography variant="h6">*/}
        {/*            Datos generales*/}
        {/*          </Typography>*/}
        {/*        </Grid>*/}
        {/*        <Grid*/}
        {/*            item*/}
        {/*            md={8}*/}
        {/*            xs={12}*/}
        {/*        >*/}
        {/*          <Box sx={{mt: 4}}>*/}
        {/*            <TextField*/}
        {/*                error={Boolean(formik.touched.first_name && formik.errors.first_name)}*/}
        {/*                fullWidth*/}
        {/*                helperText={formik.touched.first_name && formik.errors.first_name}*/}
        {/*                label="Nombre"*/}
        {/*                name="first_name"*/}
        {/*                onBlur={formik.handleBlur}*/}
        {/*                onChange={formik.handleChange}*/}
        {/*                value={formik.values.first_name}*/}
        {/*            />*/}
        {/*          </Box>*/}
        {/*          {Boolean(formik.touched.first_name && formik.errors.first_name) && (*/}
        {/*              <Box sx={{mt: 2}}>*/}
        {/*                <FormHelperText error>*/}
        {/*                  {formik.errors.first_name}*/}
        {/*                </FormHelperText>*/}
        {/*              </Box>*/}
        {/*          )}*/}
        {/*          <Box sx={{mt: 4}}>*/}
        {/*            <TextField*/}
        {/*                error={Boolean(formik.touched.last_name && formik.errors.last_name)}*/}
        {/*                fullWidth*/}
        {/*                helperText={formik.touched.last_name && formik.errors.last_name}*/}
        {/*                label="Apellido"*/}
        {/*                name="last_name"*/}
        {/*                onBlur={formik.handleBlur}*/}
        {/*                onChange={formik.handleChange}*/}
        {/*                value={formik.values.last_name}*/}
        {/*            />*/}
        {/*          </Box>*/}
        {/*          <Box sx={{mt: 4}}>*/}
        {/*            <TextField*/}
        {/*                error={Boolean(formik.touched.username && formik.errors.username)}*/}
        {/*                fullWidth*/}
        {/*                helperText={formik.touched.username && formik.errors.username}*/}
        {/*                label="Username"*/}
        {/*                name="username"*/}
        {/*                onBlur={formik.handleBlur}*/}
        {/*                onChange={formik.handleChange}*/}
        {/*                value={formik.values.username}*/}
        {/*            />*/}
        {/*          </Box>*/}
        {/*          <Box sx={{mt: 2}}>*/}
        {/*            <TextField*/}
        {/*                error={Boolean(formik.touched.email && formik.errors.email)}*/}
        {/*                fullWidth*/}
        {/*                helperText={formik.touched.email && formik.errors.email}*/}
        {/*                label="Correo electrónico"*/}
        {/*                name="email"*/}
        {/*                onBlur={formik.handleBlur}*/}
        {/*                onChange={formik.handleChange}*/}
        {/*                value={formik.values.email}*/}
        {/*            />*/}
        {/*          </Box>*/}

        {/*          /!* Campo de "Teléfono" *!/*/}
        {/*          <Box sx={{mt: 4}}>*/}
        {/*            <TextField*/}
        {/*                error={Boolean(formik.touched.phone && formik.errors.phone)}*/}
        {/*                fullWidth*/}
        {/*                helperText={formik.touched.phone && formik.errors.phone}*/}
        {/*                label="Teléfono"*/}
        {/*                name="phone"*/}
        {/*                onBlur={formik.handleBlur}*/}
        {/*                onChange={formik.handleChange}*/}
        {/*                value={formik.values.phone}*/}
        {/*            />*/}
        {/*          </Box>*/}

        {/*          /!* Campo de "Token para el Código QR". *!/*/}
        {/*          /!* ESTO SE DEBE GENERAR AUTOMÁTICAMENTE. EL USUARIO NO DEBE PODER ESCRIBIR ESTO MANUALMENTE. *!/*/}
        {/*          /!* Puedo dejar que este campo sea de solo lectura únicamente para ver el Token que se enviará a la web *!/*/}
        {/*          /!* app de Django para insertarlo en el QR. *!/*/}
        {/*          <Box sx={{mt: 4}}>*/}
        {/*            <TextField*/}
        {/*                error={Boolean(formik.touched.token_for_qr_code && formik.errors.token_for_qr_code)}*/}
        {/*                fullWidth*/}
        {/*                helperText={formik.touched.token_for_qr_code && formik.errors.token_for_qr_code}*/}
        {/*                label="Token para el Código QR"*/}
        {/*                name="token_for_qr_code"*/}
        {/*                onBlur={formik.handleBlur}*/}
        {/*                onChange={formik.handleChange}*/}
        {/*                value={formik.values.token_for_qr_code}*/}
        {/*                InputProps={{*/}
        {/*                  readOnly: true, // Esto hace que el campo sea de solo lectura.*/}
        {/*                }}*/}
        {/*            />*/}

        {/*          </Box>*/}

        {/*          /!* Botón para Generar el Token para el Código QR *!/*/}
        {/*          /!* Lo pongo en un <Box> por separado para que haya espacio entre el campo que te muestra el Token *!/*/}
        {/*          /!* generado, y este botón. *!/*/}
        {/*          <Box sx={{mt: 4}}>*/}
        {/*            <Button*/}
        {/*                variant="contained"*/}
        {/*                color="primary"*/}
        {/*                onClick={() => {*/}
        {/*                  formik.setFieldValue('token_for_qr_code', uuidv4());*/}
        {/*                }}*/}
        {/*            >*/}
        {/*              Generate QR Token*/}
        {/*            </Button>*/}
        {/*          </Box>*/}
        {/*          <Divider sx={{my: 3}}/>*/}
        {/*          <Box*/}
        {/*              sx={{*/}
        {/*                display: 'flex',*/}
        {/*                flexWrap: 'wrap',*/}
        {/*                justifyContent: 'right',*/}
        {/*                mx: -1,*/}
        {/*                mb: -1,*/}
        {/*                mt: 3*/}
        {/*              }}*/}
        {/*          >*/}
        {/*            <NextLink href='/clients'>*/}

        {/*              /!* Botón de "Cancel" / "Cancelar" *!/*/}
        {/*              <Button*/}
        {/*                  sx={{m: 1}}*/}
        {/*                  variant="outlined"*/}
        {/*              >*/}
        {/*                Cancel*/}
        {/*              </Button>*/}
        {/*            </NextLink>*/}

        {/*            /!* Botón de "Update" para Editar al Cliente Seleccionado. *!/*/}
        {/*            /!* ESTE BOTON SOLO DEBE SER VISIBLE EN /clients/id_del_cliente . *!/*/}
        {/*            <Button*/}
        {/*                sx={{m: 1}}*/}
        {/*                type="submit"*/}
        {/*                variant="contained"*/}
        {/*            >*/}
        {/*              Update*/}
        {/*            </Button>*/}
        {/*          </Box>*/}

        {/*          Botón de "Create" para Crear a un Cliente.  /*/}
        {/*           ESTE BOTON SOLO DEBE SER VISIBLE EN /clients/new . /*/}
        {/*          /!*<Box sx={{mt: 4}}>*!/*/}
        {/*          /!*  <Button*!/*/}
        {/*          /!*      variant="contained"*!/*/}
        {/*          /!*      color="primary"*!/*/}
        {/*          /!*      type="submit"*!/*/}
        {/*          /!*      onClick={formikCreate.handleSubmit}*!/*/}
        {/*          /!*  >*!/*/}
        {/*          /!*    Create Client*!/*/}
        {/*          /!*  </Button>*!/*/}
        {/*          /!*</Box>*!/*/}

        {/*        </Grid>*/}
        {/*      </Grid>*/}
        {/*    </CardContent>*/}
        {/*  </Card>*/}
        {/*</form>*/}

        {/* Formulario de Formik para Crear a un Nuevo Cliente en el Dashboard de la web app. */}
        <form
            onSubmit={formikCreate.handleSubmit}
            {...other}>
          <Card sx={{mt: 3}}>
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
                  <Box sx={{mt: 4}}>
                    <TextField
                        error={Boolean(formikCreate.touched.first_name && formikCreate.errors.first_name)}
                        fullWidth
                        helperText={formikCreate.touched.first_name && formikCreate.errors.first_name}
                        label="Nombre"
                        name="first_name"
                        onBlur={formikCreate.handleBlur}
                        onChange={formikCreate.handleChange}
                        value={formikCreate.values.first_name}
                    />
                  </Box>
                  {Boolean(formikCreate.touched.first_name && formikCreate.errors.first_name) && (
                      <Box sx={{mt: 2}}>
                        <FormHelperText error>
                          {formikCreate.errors.first_name}
                        </FormHelperText>
                      </Box>
                  )}
                  <Box sx={{mt: 4}}>
                    <TextField
                        error={Boolean(formikCreate.touched.last_name && formikCreate.errors.last_name)}
                        fullWidth
                        helperText={formikCreate.touched.last_name && formikCreate.errors.last_name}
                        label="Apellido"
                        name="last_name"
                        onBlur={formikCreate.handleBlur}
                        onChange={formikCreate.handleChange}
                        value={formikCreate.values.last_name}
                    />
                  </Box>

                  {/* Nombre de Usuario */}
                  <Box sx={{mt: 4}}>
                    <TextField
                        error={Boolean(formikCreate.touched.username && formikCreate.errors.username)}
                        fullWidth
                        helperText={formikCreate.touched.username && formikCreate.errors.username}
                        label="Username"
                        name="username"
                        onBlur={formikCreate.handleBlur}
                        onChange={formikCreate.handleChange}
                        value={formikCreate.values.username}
                    />
                  </Box>

                  {/* Contraseña */}
                  <Box sx={{mt: 4}}>
                    <TextField
                        error={Boolean(formikCreate.touched.username && formikCreate.errors.username)}
                        fullWidth
                        helperText={formikCreate.touched.password && formikCreate.errors.password}
                        label="Contraseña"
                        name="password"
                        onBlur={formikCreate.handleBlur}
                        onChange={formikCreate.handleChange}
                        value={formikCreate.values.password}
                        type="password" // Esto va a ocultar la contraseña cuando la escribas
                    />
                  </Box>

                  {/* Campo para Confirmar la Contraseña. LAS 2 CONTRASEÑAS DEBEN COINCIDIR. */}
                  <Box sx={{mt: 4}}>
                    <TextField
                      error={Boolean(formikCreate.touched.confirmPassword && formikCreate.errors.confirmPassword)}
                      fullWidth
                      helperText={formikCreate.touched.confirmPassword && formikCreate.errors.confirmPassword}
                      label="Confirmar Contraseña"
                      name="confirmPassword"
                      onBlur={formikCreate.handleBlur}
                      onChange={formikCreate.handleChange}
                      value={formikCreate.values.confirmPassword}
                      type="password"
                    />
                  </Box>

                  {/* Email */}
                  <Box sx={{mt: 2}}>
                    <TextField
                        error={Boolean(formikCreate.touched.email && formikCreate.errors.email)}
                        fullWidth
                        helperText={formikCreate.touched.email && formikCreate.errors.email}
                        label="Correo electrónico"
                        name="email"
                        onBlur={formikCreate.handleBlur}
                        onChange={formikCreate.handleChange}
                        value={formikCreate.values.email}
                    />
                  </Box>

                  {/* Campo de "Teléfono" */}
                  <Box sx={{mt: 4}}>
                    <TextField
                        error={Boolean(formikCreate.touched.phone && formikCreate.errors.phone)}
                        fullWidth
                        helperText={formikCreate.touched.phone && formikCreate.errors.phone}
                        label="Teléfono"
                        name="phone"
                        onBlur={formikCreate.handleBlur}
                        onChange={formikCreate.handleChange}
                        value={formikCreate.values.phone}
                    />
                  </Box>

                  {/*/!*Campo de "Descripción"*!/*/}
                  {/*<Box sx={{mt: 4}}>*/}
                  {/*    <TextField*/}
                  {/*        error={Boolean(formikCreate.touched.notes && formikCreate.errors.notes)}*/}
                  {/*        fullWidth*/}
                  {/*        helperText={formikCreate.touched.notes && formikCreate.errors.notes}*/}
                  {/*        label="Descripción"*/}
                  {/*        name="notes"*/}
                  {/*        onBlur={formikCreate.handleBlur}*/}
                  {/*        onChange={formikCreate.handleChange}*/}
                  {/*        value={formikCreate.values.notes}*/}
                  {/*        multiline // Esto convierte este campo en un <textarea>, y así sea un TextField en Django.*/}
                  {/*        rows={4} // Esto te muestra el número de líneas que se mostrarán en esta casilla de texto.*/}
                  {/*    />*/}
                  {/*</Box>*/}

                  {/* Campo de "Fecha de Nacimiento" */}
                  <Box sx={{mt: 4}}>
                    <TextField
                      error={Boolean(formikCreate.touched.birth_date && formikCreate.errors.birth_date)}
                      fullWidth
                      helperText={formikCreate.touched.birth_date && formikCreate.errors.birth_date}
                      label="Fecha de Nacimiento"
                      name="birth_date"
                      onBlur={formikCreate.handleBlur}
                      onChange={formikCreate.handleChange}
                      value={formikCreate.values.birth_date}
                      type="date" // Esto agrega un calendario para seleccionar la fecha, y lo hace tipo "date"
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Box>

                  {/* Campo de "Código Postal" */}
                  <Box sx={{ mt: 4 }}>
                    <TextField
                      error={Boolean(formikCreate.touched.postal_code && formikCreate.errors.postal_code)}
                      fullWidth
                      helperText={formikCreate.touched.postal_code && formikCreate.errors.postal_code}
                      label="Código Postal"
                      name="postal_code"
                      onBlur={formikCreate.handleBlur}
                      onChange={formikCreate.handleChange}
                      value={formikCreate.values.postal_code}
                    />
                  </Box>

                  {/* Campo de "Género" */}
                  <Box sx={{ mt: 4 }}>
                  <TextField
                    label="Género"
                    name="genre"
                    select
                    SelectProps={{ native: true }}
                    onBlur={formikCreate.handleBlur}
                    onChange={formikCreate.handleChange}
                    value={formikCreate.values.genre}
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
                  {/* Puedo dejar que este campo sea de solo lectura únicamente para ver el Token que se enviará a la web */}
                  {/* app de Django para insertarlo en el QR. */}
                  <Box sx={{mt: 4}}>
                    <TextField
                        error={Boolean(formikCreate.touched.token_for_qr_code && formikCreate.errors.token_for_qr_code)}
                        fullWidth
                        helperText={formikCreate.touched.token_for_qr_code && formikCreate.errors.token_for_qr_code}
                        label="Token para el Código QR"
                        name="token_for_qr_code"
                        onBlur={formikCreate.handleBlur}
                        onChange={formikCreate.handleChange}
                        value={formikCreate.values.token_for_qr_code}
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
                          formikCreate.setFieldValue('token_for_qr_code', uuidv4());
                        }}
                    >
                      Generate QR Token
                    </Button>
                  </Box>
                  <Divider sx={{my: 3}}/>
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
                          sx={{m: 1}}
                          variant="outlined"
                      >
                        Cancel
                      </Button>
                    </NextLink>

                    {/* Botón de "Update" para Editar al Cliente Seleccionado. */}
                    {/* ESTE BOTON SOLO DEBE SER VISIBLE EN /clients/id_del_cliente . */}
                    <Button
                        sx={{m: 1}}
                        type="submit"
                        variant="contained"
                    >
                      Create
                    </Button>
                  </Box>

                </Grid>
              </Grid>
            </CardContent>
          </Card>
      </form> {/* Fin del formulario para Crear a un nuevo cliente. */}

        <br></br>
        <Card>
          <CardContent>
            <Box sx={{mb: 4}}>
              <Typography variant="h6">
                Tarjetas vinculadas
              </Typography>
            </Box>
            <Box component="div" sx={{height: '200px', display: 'flex', flexWrap: 'wrap', width: 'max-content'}}>
              {Array.isArray(paymentMethods) && paymentMethods.map(pm => (
                  <Box>
                    <Cards
                        key={pm.id}
                        cvc={"123"}
                        expiry={pm.card.exp_month + ' ' + pm.card.exp_year}
                        focused={"hola"}
                        name={pm.billing_details.name ? pm.billing_details.name : ''}
                        number={'************' + pm.card.last4.toString()}
                        sx={{flex: '0 0 auto'}}
                        preview={true}
                    /><br/>
                    <IconButton aria-label="delete" onClick={() => handleDeletePM(pm.id)}
                                sx={{float: 'right', marginTop: '-15px'}}>
                      <DeleteIcon/>
                    </IconButton>
                  </Box>

              ))}

            </Box>
          </CardContent>
          <CardActions
              sx={{
                flexWrap: 'wrap', justifyContent: 'right',
                m: -1
              }}
          >

            <Button
                type="submit"
                sx={{m: 1}}
                variant="contained"
                className='pull-right'
                onClick={handleOpen}
            >
              Agregar nueva
            </Button>

          </CardActions>
        </Card>
        <br></br>
        <Card>
          <CardContent>
            <Typography variant="h6">Suscripciones</Typography>

            <ClientSubscriptionsListTable
                client={client}
                subscriptions={subscriptions}
                subscriptionsCount={subscriptions.length}
                updateSubscriptions={updateSubscriptions}
            />
          </CardContent>
        </Card>


        <ModalCreditCard client={client} open={open} handleClose={handleClose}
                         updatePaymentMethods={updatePaymentMethods}/>
      </>
  );
};

/* Esto tiene que llamarse "CreateNewClient" para que pueda ser detectado como "CreateNewClient" en new.js */
CreateNewClient.propTypes = {
  client: PropTypes.object.isRequired
};

// export class CreateNewClient {
// }