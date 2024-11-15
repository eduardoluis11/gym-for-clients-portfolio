import NextLink from "next/link";
import toast from 'react-hot-toast';
import { useSelector, useDispatch } from 'react-redux';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { MobileDatePicker } from '@mui/x-date-pickers';
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  FormHelperText,
  Grid,
  MenuItem,
  Select,
  Switch,
  Divider,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useState,useCallback } from "react";
import { useMounted } from '../../hooks/use-mounted';
import { subscriptionApi } from "../../api/subscription-api";
import { groupApi } from "../../api/group-api";
import Router from "next/router";

// Step 1: Import the redsysApi
import { redsysApi } from '../../api/redsys-api';

// REFACTOR: llamamos trainer y teachers a lo mismo, refactorizar para que sea coherente

export const SubscriptionCreateForm = (props) => {

  const isMounted = useMounted();
  const [groups, setGroups] = useState([]);
  const getGroups = useCallback(async () => {
    try {
      const data = await groupApi.getGroups();

      if (isMounted()) {
        setGroups(data);
        //console.log(data)
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMounted]);

  // Step 2: Create a new function that will be called when the "Test Redsys" button is clicked
  const testRedsys = async () => {
    try {
      // Call a method from the redsysApi to test the Redsys connection
      // Replace 'testMethod' with the actual method you want to call
      const response = await redsysApi.testMethod();
      console.log(response);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
      getGroups();
    },
    []);

  const formik = useFormik({
    initialValues: {
      name: '',
      groups: [],
      price: 0,
      is_active: true,
      first_rate_defferal: true,
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
        let response = await subscriptionApi.createSubscription({name:values.name,price:values.price,is_active:values.is_active,first_rate_defferal:values.first_rate_defferal,gym:1,groups:values.groups.map(e=>e.id)})
        //console.log(response)
        toast.success(`Nueva cuota "${response.name}" creada`);
        Router.push('/subscriptions');
      } catch (err) {
        console.error(err);
        toast.error('No se ha podido crear la cuota');
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.message });
        helpers.setSubmitting(false);
      }
    }
  });


  return (
    <form
      onSubmit={formik.handleSubmit}
      {...props}>
      <Card sx={{ mt: 3 }}>
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
              <Box sx={{ mt: 4 }}>
              <TextField
                error={Boolean(formik.touched.name && formik.errors.name)}
                fullWidth
                label="Nombre"
                name="name"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.name}
              />
              </Box>
              {Boolean(formik.touched.name && formik.errors.name) && (
                <Box sx={{ mt: 2 }}>
                  <FormHelperText error>
                    {formik.errors.name}
                  </FormHelperText>
                </Box>
              )}
              {/*<Box sx={{ mt: 4 }}>
              <Autocomplete
                id="activities"
                options={activities}
                getOptionLabel= {(option) => option.name}
                fullWidth
                label="Actividades"
                name="activities"
                onBlur={formik.handleBlur}
                onChange={(e, value) =>{
                  formik.setFieldValue("activities", value)
                }}
                multiple
                value={formik.values.activities}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="standard"
                    error={Boolean(formik.touched.activities && formik.errors.activities)}
                    label="Actividades"
                    placeholder="Añadir"
                  />
                  )}
              >
              </Autocomplete>
                </Box>*/}
              <Box sx={{ mt: 4 }}>
              <Autocomplete
                id="groups"
                options={groups}
                getOptionLabel= {(option) => option.name}
                fullWidth
                label="Grupo de Actividades"
                name="groups"
                onBlur={formik.handleBlur}
                onChange={(e, value) =>{
                  formik.setFieldValue("groups", value)
                }}
                multiple
                value={formik.values.groups}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="standard"
                    error={Boolean(formik.touched.groups && formik.errors.groups)}
                    label="Grupo de Actividades"
                    placeholder="Añadir"
                  />
                  )}
              >
              </Autocomplete>
              </Box>
              <Box sx={{ mt: 2 }}>
              <TextField
                error={Boolean(formik.touched.price && formik.errors.price)}
                fullWidth
                helperText={formik.touched.price && formik.errors.price}
                label="Importe de la cuota"
                name="price"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.price}
              />
              </Box>

        <Divider sx={{ my: 3 }} />
          <Box
            sx={{
              alignItems: 'center',
              display: 'flex',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <Typography
                gutterBottom
                variant="subtitle1"
              >
                {formik.values.is_active && "La cuota está activa."}
                {!formik.values.is_active && "La cuota no está activa."}
              </Typography>
              <Typography
                color="textSecondary"
                variant="body2"
                sx={{ mt: 1 }}
              >
                {formik.values.is_active && "Desmarca esta opción para desactivar la cuota. El cliente no podrá usar los servicios del gimnasio hasta que la cuota esté activa."}
                {!formik.values.is_active && "Marca esta opción para activar la cuota. El cliente podrá disfrutar del plan que ha contratado."}
              </Typography>
            </div>
            <Switch
              checked={formik.values.is_active}
              color="primary"
              edge="start"
              name="is_active"
              onChange={formik.handleChange}
              value={formik.values.is_active}
            />
          </Box>
        <Divider sx={{ my: 3 }} />
          <Box
            sx={{
              alignItems: 'center',
              display: 'flex',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <Typography
                gutterBottom
                variant="subtitle1"
              >
                {formik.values.first_rate_defferal && "Primera cuota reducida."}
                {!formik.values.first_rate_defferal && "Primera cuota entera."}
              </Typography>
              <Typography
                color="textSecondary"
                variant="body2"
                sx={{ mt: 1 }}
              >
                {formik.values.first_rate_defferal && "Desmarca esta opción para que la primera cuota sea entera."}
                {!formik.values.first_rate_defferal && "Marca esta opción para calcular la primera cuota en base al número proporcionales de días que quedan en el mes."}
              </Typography>
            </div>
            <Switch
              checked={formik.values.first_rate_defferal}
              color="primary"
              edge="start"
              name="first_rate_defferal"
              onChange={formik.handleChange}
              value={formik.values.first_rate_defferal}
            />
          </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          mx: -1,
          mb: -1,
          mt: 3
        }}
      >
        <NextLink href='/subscriptions'>
        <Button
          sx={{ m: 1 }}
          variant="outlined"
        >
          Cancel
        </Button>
        </NextLink>
        <Button
          sx={{ m: 1 }}
          type="submit"
          variant="contained"
        >
          Create
        </Button>

        {/* Boton para Probar la conexion a Redsys */}
      {/*  <Button*/}
      {/*    onClick={testRedsys}*/}
      {/*    variant="contained"*/}
      {/*  >*/}
      {/*    Test Redsys*/}
      {/*</Button>*/}
      </Box>
    </form>
  );





// // Step 3: Add a new form with a "Test Redsys" button
// return (
//   <form
//     onSubmit={formik.handleSubmit}
//     {...props}>
//     {/* ...existing form code... */}
//     <form onSubmit={testRedsys}>
//       <Button
//         type="submit"
//         variant="contained"
//       >
//         Test Redsys
//       </Button>
//     </form>
//   </form>
// );
};