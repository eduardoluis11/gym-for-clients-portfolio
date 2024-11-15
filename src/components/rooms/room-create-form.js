import NextLink from "next/link";
import Router from "next/router";
import toast from 'react-hot-toast';
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
import { useEffect } from "react";
import { roomApi } from "../../api/room-api";

// REFACTOR: llamamos trainer y teachers a lo mismo, refactorizar para que sea coherente

export const RoomCreateForm = (props) => {

  const formik = useFormik({
    initialValues: {
      name: '',
      submit: null,
    },
    validationSchema: Yup.object({
      name: Yup.string().min(5).required(),
    }),
    onSubmit: async (values, helpers) => {
      try {
        // NOTE: Make API request
        await roomApi.createRoom({gym: 1, name: values.name})
        toast.success(`Nueva sala "${values.name}" creada`);
        Router.push('/rooms').catch(console.error);
      } catch (err) {
        console.error(err);
        toast.error('No se ha podido crear la sala');
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
                label="Nombre de la sala"
                name="name"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.name}
              />
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
        <NextLink href='/rooms'>
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
