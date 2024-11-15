import NextLink from "next/link";
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
  CardContent,
  FormHelperText,
  Grid,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { getTrainers } from "../../slices/gym";
import { useEffect } from "react";
import { activityApi } from "../../api/activity-api";

// REFACTOR: llamamos trainer y teachers a lo mismo, refactorizar para que sea coherente

export const ProductCreateForm = (props) => {
  
  const dispatch = useDispatch()
  const {trainers} = useSelector((state) => state.gym);
  useEffect(() => {
    dispatch(getTrainers())
  },[dispatch])

  const formik = useFormik({
    initialValues: {
      capacity: 10,
      name: '',
      submit: null,
      teachers: []
    },
    validationSchema: Yup.object({
      name: Yup.string().min(5).required(),
      capacity: Yup.number().min(0).required(),
    }),
    onSubmit: async (values, helpers) => {
      try {
        // NOTE: Make API request
        await activityApi.createActivity({gym: 1, name: values.name, capacity: values.capacity, teacher: values.teachers})
        toast.success(`Nueva actividad "${values.name}" creada`);
        console.log(values)
        Router.push('/activities').catch(console.error);
      } catch (err) {
        console.error(err);
        toast.error('Something went wrong!');
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
        <NextLink href='/activities'>
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
      </Box>
    </form>
  );
};
