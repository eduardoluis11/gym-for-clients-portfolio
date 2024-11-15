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
import { expenseApi } from "../../api/expense-api";

// REFACTOR: llamamos trainer y teachers a lo mismo, refactorizar para que sea coherente

export const ExpenseCreateForm = (props) => {
  
  const dispatch = useDispatch()
  const {trainers} = useSelector((state) => state.gym);
  useEffect(() => {
    dispatch(getTrainers())
  },[dispatch])

  const formik = useFormik({
    initialValues: {
      price: 10,
      name: '',
      submit: null,
      type: ''
    },
    validationSchema: Yup.object({
      name: Yup.string().min(5).required(),
      price: Yup.number().min(0).required(),
    }),
    onSubmit: async (values, helpers) => {
      try {
        // NOTE: Make API request
        await expenseApi.createExpense({gym: 1, name: values.name, price: values.price, type: values.type, user: 1})
        toast.success(`Nuevo gasto "${values.name}" creado`);
        console.log(values)
        Router.push('/expenses').catch(console.error);
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
                label="Nombre del gasto"
                name="name"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.name}
              />
              </Box>
              <Box sx={{ mt: 2 }}>
              <TextField
                error={Boolean(formik.touched.type && formik.errors.type)}
                fullWidth
                label="Tipo"
                name="type"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                type="text"
                value={formik.values.type}
              />
              </Box>
              <Box sx={{ mt: 4 }}>
              <TextField
                error={Boolean(formik.touched.price && formik.errors.price)}
                fullWidth
                label="Importe"
                name="price"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                type="number"
                value={formik.values.price}
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
        <NextLink href='/expenses'>
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
