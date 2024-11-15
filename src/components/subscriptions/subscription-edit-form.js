import NextLink from 'next/link';
import PropTypes from 'prop-types';
import toast from 'react-hot-toast';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useSelector, useDispatch } from 'react-redux';
import { MobileDatePicker } from '@mui/x-date-pickers';
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
  MenuItem,
  Select,
  Switch,
  TextField,
  Typography,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { wait } from '../../utils/wait';
import { getActivitys} from "../../slices/gym";
import { useEffect,useCallback,useState } from "react";
import { useMounted } from '../../hooks/use-mounted';
import { groupApi } from '../../api/group-api';
import { subscriptionApi } from '../../api/subscription-api';

// Esto me deja redirigir al usuario a la lista de Suscripciones al terminar de editar una suscripción.
import Router from "next/router";
import {format} from "date-fns";



/* Formulario para Editar el Precio de Una Suscripción / Importe de una Cuota.
*
* AQUI TENGO QUE ARREGLAR UN BUG en el que, si edito el precio de la cuota, no se edita el precio de la suscripción
* para los clientes que ya estaban suscritos a ella.
*
* Es más, ni siquiera se puede modificar el Precio de la Suscripción.
* */


export const SubscriptionEditForm = (props) => {

  const isMounted = useMounted();
  const [groups, setGroups] = useState([]);
  const getGroups = useCallback(async () => {
    try {
      const data = await groupApi.getGroups();

      if (isMounted()) {
        setGroups(data);

      }
    } catch (err) {
      console.error(err);
    }
  }, [isMounted]);

  useEffect(() => {
      getGroups();
    },
    []);

  const { subscription, ...other } = props;

  const formik = useFormik({
    initialValues: {
      name: subscription.name || '',
      groups: subscription.formikGroups || [],
      price: subscription.price || 0,
      is_active: subscription.is_active || false,
      first_rate_defferal: subscription.first_rate_defferal || false,
      submit: null,
      gym:1
    },
    validationSchema: Yup.object({
      name: Yup.string().required(),
      price: Yup.number().min(0).required(),
    }),
    onSubmit: async (values, helpers) => {
      try {
        // NOTE: Make API request
        let response = subscriptionApi.updateSubscription(subscription.id,{
          name: values.name,
          groups: values.groups.map(group => group.id),
          price:values.price,
          is_active:values.is_active,
          first_rate_defferal: values.first_rate_defferal,
          gym:1,
          price_id_stripe:subscription.price_id_stripe
        })
        //console.log(response)
        toast.success(`Cuota "${values.name}" modificada`);

        // Esto te redirige a la lista de Suscripciones al terminar de editar una suscripción.
        Router.push('/subscriptions').catch(console.error);
        // router.push('/dashboard/products').catch(console.error);
      } catch (err) {
        console.error(err);
        toast.error('No se ha podido modificar la cuota');
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.message });
        helpers.setSubmitting(false);
      }
    }
  });

  /* Datos de la Cuota seleccionada.
  *
  * Yo ya no quiero que esto sea un formulario, ya que no se enviará ningún dato a la API. Solo quiero mostrar los
  * detalles de la Cuota.
  *
  * Entonces, tengo que modificar todo este snippet.
  *
  * Para el precio de la Cuota, mostraré los siguientes campos en el siguiente orden: el precio sin IVA, el IVA (14%),
  * y el Precio final con el IVA incluido.
  *
  * Hice que el Importe final del servicio fuera más grande que el resto del texto de los Datos de la Cuota, ya que es
  * lo más importante. Para ello, usé la propiedad "sx" de Material-UI.
  *
  * To display the list of activities without allowing the user to edit them, you can use the Typography component to
  * render each activity. The Typography component is used to display the label "Grupo de Actividades" in bold. The
  * list of activities is rendered using the map function, with each activity displayed as a Typography component with
  * color="textSecondary".
  *
  * To fix the formatting for each activity being printed in group.name, you can use the List and ListItem components
  * from Material UI.
  *
  * I’ve added sx={{ listStyleType: 'disc', pl: 4 }} to the List component to ensure each ListItem appears with a
  * bullet point.
  *
  * To remove the switch button and display the status ("Activa" or "No está activa") of the subscription as text, you
  * can modify the snippet to use the Typography component.
  *
  * Puedo hacer algo similar a lo del párrafo anterior, pero para imprimir si la primera cuota es reducida o entera.
  * */
  return (

    // Etiqueta que me deja usar las Etiquetas de React
    <>
      {/*<form*/}
      {/*  onSubmit={formik.handleSubmit}*/}
      {/*  {...props}>*/}

      {/* Eliminar la etiqueta de <form> de arriba después ya que no se enviarán datos a la API. */}

      {/* Esto me mostrará los datos del Bono SIN usar un Formulario */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item md={4} xs={12}>
              <Typography variant="h6">Datos generales</Typography>
            </Grid>

            {/* Todos los datos del Producto */}
            <Grid item md={8} xs={12}>

              {/* Nombre del Producto */}
              <Box sx={{ mt: 4 }}>
                <Typography variant="body1" fontWeight="bold">Nombre de la Cuota:</Typography>
                <Typography variant="body1" color="textSecondary">{formik.values.name}</Typography>
              </Box>

              {/* Categoría del Producto */}
              {/*<Box sx={{ mt: 4 }}>*/}
              {/*  <Typography variant="body1" fontWeight="bold">Categoría:</Typography>*/}
              {/*  <Typography variant="body1" color="textSecondary">{formik.values.category}</Typography>*/}
              {/*</Box>*/}

            {/* Grupo de Actividades */}
            <Box sx={{ mt: 4 }}>
              <Typography variant="body1" fontWeight="bold">Grupo de Actividades:</Typography>

              {/* Le modifiqué los estilos a cada actividad para que le imprima un "bullet point" a cada una. */}
              <List sx={{ listStyleType: 'disc', pl: 4 }}>
                {formik.values.groups.map((group, index) => (
                <ListItem key={index} sx={{ display: 'list-item', pl: 2 }}>

                  <Typography variant="body1" color="textSecondary">
                    {group.name}
                  </Typography>
                </ListItem>
                ))}
              </List>
            </Box>

            {/* Precio del Producto Sin Impuestos. Pondré esto como el precio total */}
            <Box sx={{ mt: 4 }}>
              <Typography variant="body1" fontWeight="bold" sx={{ fontSize: '1.2rem' }}>
                Importe de la Cuota:
              </Typography>
              <Typography variant="body1" color="textSecondary" sx={{ fontSize: '2rem' }}>
                {parseFloat(formik.values.price).toFixed(2)} &euro;
              </Typography>
            </Box>

            {/* Campo que me dice si la cuota está activa o no */}
            <Box sx={{ mt: 4 }}>
              <Typography variant="body1" fontWeight="bold">Estado de la Cuota:</Typography>
              <Typography variant="body1" color="textSecondary">
                {formik.values.is_active ? "La cuota está activa." : "La cuota no está activa."}
              </Typography>
            </Box>

            {/* Campo que me dice si la cuota es Reducida o Entera */}
            <Box sx={{ mt: 4 }}>
              <Typography variant="body1" fontWeight="bold">Cuota Entera o Reducida:</Typography>
              <Typography variant="body1" color="textSecondary">
                {formik.values.first_rate_defferal ? "Primera cuota reducida." : "Primera cuota entera."}
              </Typography>
            </Box>

            {/* Fin del Precio de la Cuota */}

              {/* Días totales del Bono */}
              {/*<Box sx={{ mt: 4 }}>*/}
              {/*  <Typography variant="body1" fontWeight="bold">Días totales del Bono:</Typography>*/}
              {/*  <Typography variant="body1" color="textSecondary">{formik.values.valid_for}</Typography>*/}
              {/*</Box>*/}

              {/* Fecha de inicio de la validez */}
              {/*<Box sx={{ mt: 4 }}>*/}
              {/*  <Typography variant="body1" fontWeight="bold">Fecha de inicio de la validez:</Typography>*/}

                {/* Para mostrar la fecha en el formato "dd/mm/yyyy", usaré la función "format" de "date-fns". */}
                {/*<Typography variant="body1" color="textSecondary">*/}
                {/*  {format(new Date(formik.values.valid_from), 'dd/MM/yyyy')}*/}
                {/*</Typography>*/}

                {/*<Typography variant="body1" color="textSecondary">{formik.values.valid_from}</Typography>*/}
              {/*</Box>*/}


            </Grid>
            {/* Fin de los Datos del Producto */}

          </Grid>
        </CardContent>
      </Card>
      {/* Fin de los datos del Bono SIN usar un formulario */}



      {/*Formulario para Editar el Precio de Una Suscripción / Importe de una Cuota. BORRAR.*/}
      {/*<Card sx={{ mt: 3 }}>*/}
      {/*  <CardContent>*/}
      {/*    <Grid*/}
      {/*      container*/}
      {/*      spacing={3}*/}
      {/*    >*/}
      {/*      <Grid*/}
      {/*        item*/}
      {/*        md={4}*/}
      {/*        xs={12}*/}
      {/*      >*/}
      {/*        <Typography variant="h6">*/}
      {/*          Datos generales*/}
      {/*        </Typography>*/}
      {/*      </Grid>*/}
      {/*      <Grid*/}
      {/*        item*/}
      {/*        md={8}*/}
      {/*        xs={12}*/}
      {/*      >*/}
      {/*        <Box sx={{ mt: 4 }}>*/}
      {/*        <TextField*/}
      {/*          error={Boolean(formik.touched.name && formik.errors.name)}*/}
      {/*          fullWidth*/}
      {/*          label="Nombre"*/}
      {/*          name="name"*/}
      {/*          onBlur={formik.handleBlur}*/}
      {/*          onChange={formik.handleChange}*/}
      {/*          value={formik.values.name}*/}
      {/*        >*/}
      {/*        </TextField>*/}
      {/*        </Box>*/}
      {/*        {Boolean(formik.touched.name && formik.errors.name) && (*/}
      {/*          <Box sx={{ mt: 2 }}>*/}
      {/*            <FormHelperText error>*/}
      {/*              {formik.errors.name}*/}
      {/*            </FormHelperText>*/}
      {/*          </Box>*/}
      {/*        )}*/}

              {/* Grupo de Actividades */}
              {/*<Box sx={{ mt: 4 }}>*/}
              {/*  <Autocomplete*/}
              {/*    id="groups"*/}
              {/*    options={groups}*/}
              {/*    getOptionLabel= {(option) => option.name}*/}
              {/*    fullWidth*/}
              {/*    label="Grupo de Actividades"*/}
              {/*    name="groups"*/}
              {/*    onBlur={formik.handleBlur}*/}
              {/*    onChange={(e, value) =>{*/}
              {/*      formik.setFieldValue("groups", value)*/}
              {/*    }}*/}
              {/*    multiple*/}
              {/*    value={formik.values.groups}*/}
              {/*    isOptionEqualToValue={(option, value) => {option.id === value.id}}*/}
              {/*    renderInput={(params) => (*/}
              {/*      <TextField*/}
              {/*        {...params}*/}
              {/*        variant="standard"*/}
              {/*        error={Boolean(formik.touched.groups && formik.errors.groups)}*/}
              {/*        label="Grupo de Actividades"*/}
              {/*        placeholder="Añadir"*/}
              {/*      />*/}
              {/*      )}*/}
              {/*  >*/}
              {/*  </Autocomplete>*/}
              {/*</Box>*/}

              {/* Precio de la Suscripción / Importe de la Cuota */}
              {/*ESTO TIENE UN BUG: NO SE PUEDE MODIFICAR EL PRECIO DE LA CUOTA.*/}
              {/* Y, al parecer, aunque lo modifique, no se edita el precio de la suscripción para los * /}
              {/* clientes que ya estaban suscritos a ella. */}
        {/*      <Box sx={{ mt: 2 }}>*/}
        {/*      <TextField*/}
        {/*        error={Boolean(formik.touched.price && formik.errors.price)}*/}
        {/*        fullWidth*/}
        {/*        helperText={formik.touched.price && formik.errors.price}*/}
        {/*        label="Importe de la cuota"*/}
        {/*        name="price"*/}
        {/*        // value={subscription.price}*/}
        {/*        value={formik.values.price} // Esto me permite modificar el precio de la suscripción*/}
        {/*        onChange={formik.handleChange}  // Esto también me permite modificar el precio de la suscripción*/}
        {/*        // readOnly={true} // DEBO ELIMINAR ESTO ya que no me deja editar el precio de una suscripción*/}
        {/*      />*/}
        {/*      </Box>*/}

        {/*<Divider sx={{ my: 3 }} />*/}

          {/* Campo que dice si la Cuota está Activa o No. */}
          {/*<Box*/}
          {/*  sx={{*/}
          {/*    alignItems: 'center',*/}
          {/*    display: 'flex',*/}
          {/*    justifyContent: 'space-between'*/}
          {/*  }}*/}
          {/*>*/}
          {/*  <div>*/}
          {/*    <Typography*/}
          {/*      gutterBottom*/}
          {/*      variant="subtitle1"*/}
          {/*    >*/}
          {/*      {formik.values.is_active && "La cuota está activa."}*/}
          {/*      {!formik.values.is_active && "La cuota no está activa."}*/}
          {/*    </Typography>*/}
          {/*    <Typography*/}
          {/*      color="textSecondary"*/}
          {/*      variant="body2"*/}
          {/*      sx={{ mt: 1 }}*/}
          {/*    >*/}
          {/*      {formik.values.is_active && "Desmarca esta opción para desactivar la cuota. El cliente no podrá usar los servicios del gimnasio hasta que la cuota esté activa."}*/}
          {/*      {!formik.values.is_active && "Marca esta opción para activar la cuota. El cliente podrá disfrutar del plan que ha contratado."}*/}
          {/*    </Typography>*/}
          {/*  </div>*/}
          {/*  <Switch*/}
          {/*    checked={formik.values.is_active}*/}
          {/*    color="primary"*/}
          {/*    edge="start"*/}
          {/*    name="is_active"*/}
          {/*    onChange={formik.handleChange}*/}
          {/*    value={formik.values.is_active}*/}
          {/*  />*/}
          {/*</Box>*/}
          {/* Fin del Campo que dice si la Cuota está Activa o No. */}


      {/*  <Divider sx={{ my: 3 }} />*/}

      {/*    /!* Campo que me dice si la Primera Cuota es reducida o entera *!/*/}
      {/*    <Box*/}
      {/*      sx={{*/}
      {/*        alignItems: 'center',*/}
      {/*        display: 'flex',*/}
      {/*        justifyContent: 'space-between'*/}
      {/*      }}*/}
      {/*    >*/}
      {/*      <div>*/}
      {/*        <Typography*/}
      {/*          gutterBottom*/}
      {/*          variant="subtitle1"*/}
      {/*        >*/}
      {/*          {formik.values.first_rate_defferal && "Primera cuota reducida."}*/}
      {/*          {!formik.values.first_rate_defferal && "Primera cuota entera."}*/}
      {/*        </Typography>*/}
      {/*        <Typography*/}
      {/*          color="textSecondary"*/}
      {/*          variant="body2"*/}
      {/*          sx={{ mt: 1 }}*/}
      {/*        >*/}
      {/*          {formik.values.first_rate_defferal && "Desmarca esta opción para que la primera cuota sea entera."}*/}
      {/*          {!formik.values.first_rate_defferal && "Marca esta opción para calcular la primera cuota en base al número proporcionales de días que quedan en el mes."}*/}
      {/*        </Typography>*/}
      {/*      </div>*/}
      {/*      <Switch*/}
      {/*        checked={formik.values.first_rate_defferal}*/}
      {/*        color="primary"*/}
      {/*        edge="start"*/}
      {/*        name="first_rate_defferal"*/}
      {/*        onChange={formik.handleChange}*/}
      {/*        value={formik.values.first_rate_defferal}*/}
      {/*      />*/}
      {/*    </Box>*/}


      {/*      </Grid>*/}
      {/*    </Grid>*/}
      {/*  </CardContent>*/}
      {/*</Card>*/}
      {/*<Box*/}
      {/*  sx={{*/}
      {/*    display: 'flex',*/}
      {/*    flexWrap: 'wrap',*/}
      {/*    justifyContent: 'center',*/}
      {/*    mx: -1,*/}
      {/*    mb: -1,*/}
      {/*    mt: 3*/}
      {/*  }}*/}
      {/*>*/}
      {/*  <NextLink href='/subscriptions'>*/}
      {/*  <Button*/}
      {/*    sx={{ m: 1 }}*/}
      {/*    variant="outlined"*/}
      {/*  >*/}
      {/*    Cancelar*/}
      {/*  </Button>*/}
      {/*  </NextLink>*/}
      {/*  <Button*/}
      {/*    sx={{ m: 1 }}*/}
      {/*    type="submit"*/}
      {/*    variant="contained"*/}
      {/*  >*/}
      {/*    Actualizar*/}
      {/*  </Button>*/}
      {/*</Box>*/}
      {/*</form>*/}

      {/* Fin de la etiqueta que me deja usar las Etiquetas de React */}
    </>
  );
};

SubscriptionEditForm.propTypes = {
  subscription: PropTypes.object.isRequired
};