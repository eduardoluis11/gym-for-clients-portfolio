import NextLink from 'next/link';
import PropTypes from 'prop-types';
import toast from 'react-hot-toast';
import Router from "next/router";
import { useSelector, useDispatch } from 'react-redux';
import * as Yup from 'yup';
import { useFormik } from 'formik';
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
import { getActivitys} from "../../slices/gym";
import { useEffect } from "react";
import { groupApi } from "../../api/group-api";

export const GroupEditForm = (props) => {
  const dispatch = useDispatch()
  const {activities} = useSelector((state) => state.gym);
   
  useEffect(() => {
    dispatch(getActivitys())
  },[dispatch])
  const { group, ...other } = props;
  const formik = useFormik({
    initialValues: {
      name: group.name || "",
      submit: null,
      activities: group.activities || []
    },
    validationSchema: Yup.object({
      name: Yup.string().min(5).required(),
    }),
    onSubmit: async (values, helpers) => {
      try {
        // NOTE: Make API request
        await groupApi.updateGroup(group.id, {name: values.name, activities: values.activities})
        helpers.setStatus({ success: true });
        helpers.setSubmitting(false);
        console.log(values)
        toast.success('Grupo de actividades modificado!');
        Router.push('/groups').catch(console.error);
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
      await groupApi.deleteGroup(group.id)
      toast.success('Grupo borrado con éxito!');
      Router.push('/groups').catch(console.error);
    } catch (err) {
      console.error(err);
      toast.error('Error en la actualización, los datos no se han modificado');
    }
}

  return (
    <form
      onSubmit={formik.handleSubmit}
      {...other}>
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
              <Box sx={{ mt: 2 }}>
              <TextField
                error={Boolean(formik.touched.name && formik.errors.name)}
                fullWidth
                helperText={formik.touched.name && formik.errors.name}
                label="Nombre del Grupo de actividades"
                name="name"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.name}
              />
              </Box>
              <Box sx={{ mt: 4 }}>
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
            href={`/groups/${group.id}`}
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
            Borrar grupo
          </Button>
        </CardActions>
      </Card>
    </form>
  );
};

GroupEditForm.propTypes = {
  group: PropTypes.object.isRequired
};
