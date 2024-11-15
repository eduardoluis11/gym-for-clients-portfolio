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
import { expenseApi } from "../../api/expense-api";
// TODO: estos valores deberían estar en el store(Copiar la lógica de create form)

export const ExpenseEditForm = (props) => {

  const dispatch = useDispatch()
  const {trainers} = useSelector((state) => state.gym);
  useEffect(() => {
     console.log(expense)
  },[])

  const { expense, ...other } = props;
  const formik = useFormik({
    initialValues: {
      price: expense.price || 0,
      name: expense.name || "",
      submit: null,
      type: expense.type || ''
    },
    validationSchema: Yup.object({
      name: Yup.string().min(5).required(),
      price: Yup.number().min(0).required(),
    }),
    onSubmit: async (values, helpers) => {
      try {
        // NOTE: Make API request
        await expenseApi.updateExpense(expense.id, {gym: values.gym, name: values.name, price: values.price, type: values.type, gym: expense.gym, user:expense.user})
        helpers.setStatus({ success: true });
        helpers.setSubmitting(false);
        console.log(values)
        toast.success('Gasto modificado!');
        Router.push('/expenses').catch(console.error);
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
      await expenseApi.deleteExpense(expense.id)
      toast.success('Gasto borrado con éxito!');
      Router.push('/expenses').catch(console.error);
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
            href={`/expenses/${expense.id}`}
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
            Borrar gasto
          </Button>
        </CardActions>
      </Card>
    </form>
  );
};

ExpenseEditForm.propTypes = {
  expense: PropTypes.object.isRequired
};
