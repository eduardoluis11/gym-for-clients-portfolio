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
  Radio,
  RadioGroup,
  FormControlLabel
} from '@mui/material';
import { useEffect,useState, useCallback } from "react";
import { useMounted } from '../../hooks/use-mounted';
import { taxApi } from '../../api/tax-api';
import { voucherApi } from '../../api/voucher-api';

import { format } from 'date-fns';  // Esto me dejará mejorar el formato de la fecha de inicio de la validez del Bono.

/* Página para Ver los Detalles de un Bono.
*
* Modifiqué ESTA PÁGINA para que Solo me Muestre los Detalles del Bono Seleccionado, Y NO ME DEJE EDITAR NADA DEL
* BONO SELECCIONADO.
*
* */

// TODO: estos valores deberían estar en el store(Copiar la lógica de create form)

export const VoucherEditForm = (props) => {
  const { voucher, ...other } = props;
  const [taxes, setTaxes] = useState([])
  const isMounted = useMounted();
  const [selectedRadio, setSelectedRadio ] = useState(1)
  const [precioConIva, setPrecioConIva] = useState(0)
  const [precioSinIva, setPrecioSinIva] = useState(0)

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
      gym:1,
      name: voucher.name || '',
      category: voucher.category || '',
      price: voucher.price || 0,
      tax: voucher.tax || '',
      description:voucher.description || '',
      valid_for: voucher.valid_for || 0,
      valid_from: voucher.valid_from || new Date(),
      submit: null,
      is_active: voucher.is_active
    },
    validationSchema: Yup.object({
      name: Yup.string().required(),
      price: Yup.number().min(0).required(),
    }),
    onSubmit: async (values, helpers) => {
      try {
        if(selectedRadio==2) values.price = precioSinIva.toFixed(2)
        await voucherApi.updateVoucher(voucher.id,values)
        toast.success(`Bono "${values.name}" modificado`);
        location.href='/vouchers'
      } catch (err) {
        console.error(err);
        toast.error('No se ha podido modificar el bono');
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.message });
        helpers.setSubmitting(false);
      }
    }
  });

  const handleStartDateChange = (newValue) => {
    formik.setFieldValue("valid_from", newValue);
  };

  const handleChangeRadio = (event) => {
    setSelectedRadio(event.target.value)
  };
  useEffect(() => {
    if (selectedRadio == 1) {
      if (formik.values.price) {
        setPrecioSinIva(formik.values.price);
        if(formik.values.tax){
          let pg =100;
          taxes?.map((e)=> {
            if(e.id==formik.values.tax) pg=e.percentage
          })
          setPrecioConIva(parseFloat(formik.values.price) * (pg/100) + parseFloat(formik.values.price));
        }else{
          setPrecioConIva(formik.values.price)
        }
        
      } else {
        setPrecioSinIva(0);
        setPrecioConIva(0);
      }
    }
    if (selectedRadio == 2) {
      if (formik.values.price) {
        setPrecioConIva(formik.values.price);
        if(formik.values.tax){
          let pg =100;
          taxes?.map((e)=> {
            if(e.id==formik.values.tax) pg=e.percentage
          })
          setPrecioSinIva(parseFloat(formik.values.price) - parseFloat(formik.values.price) * (pg/100));
        }else{
          setPrecioSinIva(formik.values.price)
        }
      } else {
        setPrecioConIva(0);
        setPrecioSinIva(0);
      }
    }
  }, [formik.values.price, selectedRadio, formik.values.tax, taxes]);



  /* Datos del Bono seleccionado.
  *
  * Yo ya no quiero que esto sea un formulario, ya que no se enviará ningún dato a la API. Solo quiero mostrar los
  * detalles del Bono.
  *
  * Entonces, tengo que modificar todo este snippet.
  *
  * Para el precio del Bono, mostraré los siguientes campos en el siguiente orden: el precio sin IVA, el IVA (14%),
  * y el Precio final con el IVA incluido.
  *
  * Hice que el Importe final del servicio fuera más grande que el resto del texto de los Datos del Bono, ya que es
  * lo más importante. Para ello, usé la propiedad "sx" de Material-UI.
  *
  * To display the date in the "dd/mm/yyyy" format, you can use the format function from the date-fns library. First,
  * ensure you have the date-fns library installed. Then, import the format function and use it to format the date.
  * */
  return (

    // Inicio del snippet que renderiza las etiquetas de React
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
                <Typography variant="body1" fontWeight="bold">Nombre del Bono:</Typography>
                <Typography variant="body1" color="textSecondary">{formik.values.name}</Typography>
              </Box>

              {/* Categoría del Producto */}
              <Box sx={{ mt: 4 }}>
                <Typography variant="body1" fontWeight="bold">Categoría:</Typography>
                <Typography variant="body1" color="textSecondary">{formik.values.category}</Typography>
              </Box>

              {/* Precio del Producto Sin Impuestos */}
              <Box sx={{ mt: 4 }}>
                <Typography variant="body1" fontWeight="bold">Precio sin IVA:</Typography>
                <Typography variant="body1" color="textSecondary">{parseFloat(precioSinIva).toFixed(2)} &euro;</Typography>
              </Box>

              {/* Porcentaje del Impuesto*/}
              <Box sx={{ mt: 4 }}>
                <Typography variant="body1" fontWeight="bold">Impuesto:</Typography>
                <Typography variant="body1" color="textSecondary">
                  {taxes.find(tax => tax.id === formik.values.tax)?.name} %{taxes.find(tax => tax.id === formik.values.tax)?.percentage}
                </Typography>
              </Box>

              {/* Precio Final con el IVA Incluido */}
              <Box sx={{ mt: 4 }}>
                <Typography variant="body1" fontWeight="bold" sx={{ fontSize: '1.2rem' }}>
                  Importe Total del Bono:
                </Typography>
                <Typography variant="body1" color="textSecondary" sx={{ fontSize: '2rem' }}>
                  {parseFloat(precioConIva).toFixed(2)} &euro;
                </Typography>
              </Box>

              {/* Fin del Precio del Bono */}


              {/* Descripción */}
              <Box sx={{ mt: 4 }}>
                <Typography variant="body1" fontWeight="bold">Descripción:</Typography>
                <Typography variant="body1" color="textSecondary">{formik.values.description}</Typography>
              </Box>

              {/* Días totales del Bono */}
              <Box sx={{ mt: 4 }}>
                <Typography variant="body1" fontWeight="bold">Días totales del Bono:</Typography>
                <Typography variant="body1" color="textSecondary">{formik.values.valid_for}</Typography>
              </Box>

              {/* Fecha de inicio de la validez */}
              <Box sx={{ mt: 4 }}>
                <Typography variant="body1" fontWeight="bold">Fecha de inicio de la validez:</Typography>

                {/* Para mostrar la fecha en el formato "dd/mm/yyyy", usaré la función "format" de "date-fns". */}
                <Typography variant="body1" color="textSecondary">
                  {format(new Date(formik.values.valid_from), 'dd/MM/yyyy')}
                </Typography>

                {/*<Typography variant="body1" color="textSecondary">{formik.values.valid_from}</Typography>*/}
              </Box>


            </Grid>
            {/* Fin de los Datos del Producto */}

          </Grid>
        </CardContent>
      </Card>
      {/* Fin de los datos del Bono SIN usar un formulario */}







      {/*Datos del Formulario. BORRAR, YA QUE YA NO SE NECESITA.*/}
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
      {/*        <Box sx={{ mt: 4 }}>*/}
      {/*        <TextField*/}
      {/*          error={Boolean(formik.touched.category && formik.errors.category)}*/}
      {/*          fullWidth*/}
      {/*          helperText={formik.touched.category && formik.errors.category}*/}
      {/*          label="Categoría"*/}
      {/*          name="category"*/}
      {/*          onBlur={formik.handleBlur}*/}
      {/*          onChange={formik.handleChange}*/}
      {/*          value={formik.values.category}*/}
      {/*        />*/}
      {/*        </Box>*/}
      {/*        */}
      {/*        <Box sx={{ mt: 4 }}>*/}
      {/*        <TextField*/}
      {/*          error={Boolean(formik.touched.tax && formik.errors.tax)}*/}
      {/*          fullWidth*/}
      {/*          label="Impuesto"*/}
      {/*          name="tax"*/}
      {/*          onBlur={formik.handleBlur}*/}
      {/*          onChange={formik.handleChange}*/}
      {/*          select*/}
      {/*          value={formik.values.tax}*/}
      {/*        >*/}
      {/*          {taxes.map((option) => (*/}
      {/*            <MenuItem*/}
      {/*              key={option.id}*/}
      {/*              value={option.id}*/}
      {/*            >*/}
      {/*              {option.name} %{option.percentage}*/}
      {/*            </MenuItem>*/}
      {/*          ))}*/}
      {/*        </TextField>*/}
      {/*        </Box>*/}
      {/*        <Box sx={{ mt: 2 }}>*/}
      {/*        <Grid container spacing={3}>*/}
      {/*          <Grid item xs={12} sm={6}>*/}
      {/*            <TextField*/}
      {/*              error={Boolean(formik.touched.price && formik.errors.price)}*/}
      {/*              fullWidth*/}
      {/*              helperText={formik.touched.price && formik.errors.price}*/}
      {/*              label="Importe del bono"*/}
      {/*              name="price"*/}
      {/*              onBlur={formik.handleBlur}*/}
      {/*              onChange={formik.handleChange}*/}
      {/*              value={formik.values.price}*/}
      {/*              type='number'*/}
      {/*            />*/}
      {/*          </Grid>*/}
      {/*          <Grid item xs={12} sm={6} sx={{ display: 'flex', alignItems: 'center' }}>*/}
      {/*            <RadioGroup*/}
      {/*              aria-label="options"*/}
      {/*              name="options"*/}
      {/*              value={selectedRadio}*/}
      {/*              onChange={handleChangeRadio}*/}
      {/*              sx={{ display: 'flex', flexDirection: 'row' }}*/}
      {/*            >*/}
      {/*              <FormControlLabel value="1" control={<Radio />} label="Sin IVA" />*/}
      {/*              <FormControlLabel value="2" control={<Radio />} label="Con IVA" disabled={!formik.values.tax}/>*/}
      {/*            </RadioGroup>*/}
      {/*          </Grid>*/}
      {/*        </Grid>*/}

      {/*        <p>El precio sin IVA será {parseFloat(precioSinIva).toFixed(2)} &euro;</p>*/}
      {/*        <p>El precio con IVA será {parseFloat(precioConIva).toFixed(2)} &euro;</p>*/}
      {/*        </Box>*/}
      {/*        <Box sx={{ mt: 4 }}>*/}
      {/*        <TextField*/}
      {/*          error={Boolean(formik.touched.description && formik.errors.description)}*/}
      {/*          fullWidth*/}
      {/*          helperText={formik.touched.description && formik.errors.description}*/}
      {/*          label="Descripción"*/}
      {/*          name="description"*/}
      {/*          onBlur={formik.handleBlur}*/}
      {/*          onChange={formik.handleChange}*/}
      {/*          value={formik.values.description}*/}
      {/*        />*/}
      {/*        </Box>*/}
      {/*        */}
      {/*        <Box sx={{ mt: 2 }}>*/}
      {/*        <TextField*/}
      {/*          error={Boolean(formik.touched.valid_for && formik.errors.valid_for)}*/}
      {/*          fullWidth*/}
      {/*          helperText={formik.touched.valid_for && formik.errors.valid_for}*/}
      {/*          label="Días totales del bono"*/}
      {/*          name="valid_for"*/}
      {/*          onBlur={formik.handleBlur}*/}
      {/*          onChange={formik.handleChange}*/}
      {/*          value={formik.values.valid_for}*/}
      {/*        />*/}
      {/*        </Box>*/}
      {/*        <Box*/}
      {/*          sx={{*/}
      {/*            alignItems: 'center',*/}
      {/*            display: 'flex',*/}
      {/*            mt: 3*/}
      {/*          }}*/}
      {/*        >*/}
      {/*          <MobileDatePicker*/}
      {/*            error={Boolean(formik.touched.valid_from && formik.errors.valid_from)}*/}
      {/*            label="Fecha inicio validez"*/}
      {/*            inputFormat="dd/MM/yyyy"*/}
      {/*            value={formik.values.valid_from}*/}
      {/*            name="valid_from"*/}
      {/*            onChange={handleStartDateChange}*/}
      {/*            onBlur={formik.handleBlur}*/}
      {/*            renderInput={(inputProps) => <TextField {...inputProps} />}*/}
      {/*          />*/}

                {/* Campo de "Estado". BORRAR. */}
                {/*<TextField*/}
                {/*  fullWidth*/}
                {/*  label="Estado"*/}
                {/*  name="is_active"*/}
                {/*  onBlur={formik.handleBlur}*/}
                {/*  onChange={formik.handleChange}*/}
                {/*  select*/}
                {/*  value={formik.values.is_active}*/}
                {/*  sx={{pl:3}}*/}
                {/*>*/}
                {/*  <MenuItem key={1} value={true}> Activo </MenuItem>*/}
                {/*  <MenuItem key={2} value={false}> Inactivo </MenuItem>*/}
                {/*</TextField>*/}


      {/*        </Box>*/}
      {/*      </Grid>*/}
      {/*    </Grid>*/}
      {/*  </CardContent>*/}
      {/*</Card>*/}

      {/* Botones "Update" y "Cancel". BORRAR. */}
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
      {/*  <NextLink href='/vouchers'>*/}
      {/*  <Button*/}
      {/*    sx={{ m: 1 }}*/}
      {/*    variant="outlined"*/}
      {/*  >*/}
      {/*    Cancel*/}
      {/*  </Button>*/}
      {/*  </NextLink>*/}
      {/*  <Button*/}
      {/*    sx={{ m: 1 }}*/}
      {/*    type="submit"*/}
      {/*    variant="contained"*/}
      {/*  >*/}
      {/*    Update*/}
      {/*  </Button>*/}
      {/*</Box>*/}
      {/* Fin de los Botones "Update" y "Cancel" */}


      {/*</form>*/}

      {/*Fin del snippet que renderiza las etiquetas de React*/}
    </>
  );
};

VoucherEditForm.propTypes = {
  voucher: PropTypes.object.isRequired
};
