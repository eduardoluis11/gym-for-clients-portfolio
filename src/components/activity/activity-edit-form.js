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
  CardHeader,
  Chip,
  Divider,
  Grid,
  FormHelperText,
  MenuItem,
  Select,
  Switch,
  TextField,
  Typography
} from '@mui/material';
import { getTrainers } from "../../slices/gym";
import { useEffect } from "react";
import { activityApi } from "../../api/activity-api";
// TODO: estos valores deberían estar en el store(Copiar la lógica de create form)

export const ActivityEditForm = (props) => {

  const dispatch = useDispatch()
  const {trainers} = useSelector((state) => state.gym);
  useEffect(() => {
    dispatch(getTrainers())
  },[dispatch])

  const { activity, ...other } = props;
  const formik = useFormik({
    initialValues: {
      capacity: activity.capacity || 0,
      name: activity.name || "",
      submit: null,
      teachers: activity.teacher || []
    },
    validationSchema: Yup.object({
      name: Yup.string().min(5).required(),
      capacity: Yup.number().min(0).required(),
    }),
    onSubmit: async (values, helpers) => {
      try {
        // NOTE: Make API request
        await activityApi.updateActivity(activity.id, {gym: values.gym, name: values.name, capacity: values.capacity, teacher: values.teachers})
        helpers.setStatus({ success: true });
        helpers.setSubmitting(false);
        console.log(values)
        toast.success('Actividad modificada!');
        Router.push('/activities').catch(console.error);
      } catch (err) {
        console.error(err);
        toast.error('Error en la actualización, los datos no se han modificado');
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.message });
        helpers.setSubmitting(false);
      }
    }
  });

  const handleDelete = async () => {
    try {
      await activityApi.deleteActivity(activity.id)
      toast.success('Actividad borrada con éxito!');
      Router.push('/activities').catch(console.error);
    } catch (err) {
      console.error(err);
      toast.error('Error en la actualización, los datos no se han modificado');
    }
}

  return (
    <form
      onSubmit={formik.handleSubmit}
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
                error={Boolean(formik.touched.name && formik.errors.name)}
                fullWidth
                helperText={formik.touched.name && formik.errors.name}
                label="Nombre de la actividad"
                name="name"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.name}
              />
              </Box>
              <Box sx={{ mt: 2 }}>
              <TextField
                error={Boolean(formik.touched.capacity && formik.errors.capacity)}
                fullWidth
                label="Aforo máximo permitido"
                name="capacity"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                type="number"
                value={formik.values.capacity}
              />
              </Box>
              <Box sx={{ mt: 4 }}>
              <Autocomplete
                id="teachers"
                options={trainers}
                getOptionLabel= {(option) => option.first_name}
                fullWidth
                label="Entrenadores" 
                name="teachers"
                onBlur={formik.handleBlur}
                // onChange={formik.handleChange}
                onChange={(e, value) =>{
                  formik.setFieldValue("teachers", value)
                }}
                multiple
                value={formik.values.teachers}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="standard"
                    error={Boolean(formik.touched.teachers && formik.errors.teachers)}
                    // onChange={formik.handleChange}
                    label="Entrenadores"
                    placeholder="Añadir"
                  />
                  )} 
              >
              </Autocomplete>
              </Box>
              {Boolean(formik.touched.description && formik.errors.description) && (
                <Box sx={{ mt: 2 }}>
                  <FormHelperText error>
                    {formik.errors.description}
                  </FormHelperText>
                </Box>
              )}
            </Grid>
          </Grid>
        </CardContent>
        <CardActions
          sx={{
            flexWrap: 'wrap',
            m: -1
          }}
        >
          <Button
            disabled={formik.isSubmitting}
            type="submit"
            sx={{ m: 1 }}
            variant="contained"
          >
            Update
          </Button>
          <NextLink
            href={`/activities/${activity.id}`}
            passHref
          >
            <Button
              component="a"
              disabled={formik.isSubmitting}
              sx={{
                m: 1,
                mr: 'auto'
              }}
              variant="outlined"
            >
              Cancel
            </Button>
          </NextLink>
          <Button
            color="error"
            disabled={formik.isSubmitting}
            onClick= {handleDelete}
          >
            Borrar actividad
          </Button>
        </CardActions>
      </Card>
    </form>
  );
};

ActivityEditForm.propTypes = {
  activity: PropTypes.object.isRequired
};
