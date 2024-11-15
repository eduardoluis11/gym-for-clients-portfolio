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
  Typography
} from '@mui/material';
import { useEffect,useState, useCallback } from "react";
import { useMounted } from '../../hooks/use-mounted';
import { taxApi } from '../../api/tax-api';
import { supplierApi } from '../../api/supplier-api';

// TODO: estos valores deberían estar en el store(Copiar la lógica de create form)

export const SupplierEditForm = (props) => {
  const { supplier, ...other } = props;
  const [taxes, setTaxes] = useState([])
  const isMounted = useMounted();

  const getTaxes = useCallback(async () => {
    try {
      const data = await taxApi.getTaxes();
      if (isMounted()) {
        setTaxes(data);
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMounted]);
  
  useEffect(()=>{
      getTaxes()
  },[])

  const formik = useFormik({
    initialValues: {
      name: supplier.name || '',
      email: supplier.email || '',
      phone: supplier.phone || '',
      address: supplier.adderess || '',
      city:supplier.city || '',
      nif: supplier.nif || '',
      contact:supplier.contact || '',
      contact_phone:supplier.contact_phone || '',
      submit: null,
      is_active: supplier.is_active
    },
    validationSchema: Yup.object({
      name: Yup.string().required(),
      phone: Yup.string().required()
    }),
    onSubmit: async (values, helpers) => {
      try {
        await supplierApi.updateSupplier(supplier.id,values)
        toast.success(`Proveedor "${values.name}" modificado`);
        location.href='/suppliers'
      } catch (err) {
        console.error(err);
        toast.error('No se ha podido modificar el proveedor');
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.message });
        helpers.setSubmitting(false);
      }
    }
  });

  const handleStartDateChange = (newValue) => {
    formik.setFieldValue("valid_from", newValue);
  };

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
              >
              </TextField>
              </Box>
              {Boolean(formik.touched.name && formik.errors.name) && (
                <Box sx={{ mt: 2 }}>
                  <FormHelperText error>
                    {formik.errors.name}
                  </FormHelperText>
                </Box>
              )}
              <Box sx={{ mt: 4 }}>
              <TextField
                error={Boolean(formik.touched.email && formik.errors.email)}
                fullWidth
                helperText={formik.touched.email && formik.errors.email}
                label="Email"
                name="email"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.email}
                type="email"
              />
              </Box>
              
              <Box sx={{ mt: 2 }}>
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
              <Box sx={{ mt: 4 }}>
              <TextField
                error={Boolean(formik.touched.address && formik.errors.address)}
                fullWidth
                label="Dirección"
                name="address"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.address}
              >
              </TextField>
              </Box>
              <Box sx={{ mt: 4 }}>
              <TextField
                error={Boolean(formik.touched.city && formik.errors.city)}
                fullWidth
                helperText={formik.touched.city && formik.errors.city}
                label="Ciudad"
                name="city"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.city}
              />
              </Box>
              <Box sx={{ mt: 4 }}>
              <TextField
                error={Boolean(formik.touched.nif && formik.errors.nif)}
                fullWidth
                helperText={formik.touched.nif && formik.errors.nif}
                label="NIF"
                name="nif"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.nif}
              />
              </Box>
              <Box sx={{ mt: 4 }}>
              <TextField
                error={Boolean(formik.touched.contact && formik.errors.contact)}
                fullWidth
                helperText={formik.touched.contact && formik.errors.contact}
                label="Contacto"
                name="contact"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.contact}
              />
              </Box>
              <Box sx={{ mt: 4 }}>
              <TextField
                error={Boolean(formik.touched.contact_phone && formik.errors.contact_phone)}
                fullWidth
                helperText={formik.touched.contact_phone && formik.errors.contact_phone}
                label="Teléfono de contacto"
                name="contact_phone"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.contact_phone}
              />
              </Box>
              <Box
                sx={{
                  alignItems: 'center',
                  display: 'flex',
                  mt: 3
                }}
              >
              
                <TextField
                  fullWidth
                  label="Estado"
                  name="is_active"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  select
                  value={formik.values.is_active}
                >
                  <MenuItem key={1} value={true}> Activo </MenuItem>
                  <MenuItem key={2} value={false}> Inactivo </MenuItem>
                </TextField>
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
        <NextLink href='/suppliers'>
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
          Update
        </Button>
      </Box>
    </form>
  );
};

SupplierEditForm.propTypes = {
  supplier: PropTypes.object.isRequired
};
