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
  Grid,
  FormHelperText,
  TextField,
  Typography,
  Divider
} from '@mui/material';
import { useEffect, useState,useCallback } from "react";
import { taxApi } from '../../api/tax-api';
import Modal from '@mui/material/Modal';
import { useMounted } from '../../hooks/use-mounted';

export const ModalNewTax = (props) => {
  const isMounted = useMounted();
  const { open, handleClose, updateImpuestos, ...other } = props;

  const getImpuestos = useCallback(async () => {
    try {
      const data = await taxApi.getTaxes();
      if (isMounted()) {
        updateImpuestos(data);
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMounted]);

  const handleFocus = (e)=>{
    formik.values.focus=e.target.name
  }
  const formik = useFormik({
    initialValues: {
        name: '',
        percentage: ''
    },
    validationSchema: Yup.object({
      name: Yup.string().min(1).required(),
      percentage: Yup.number().min(1).max(100).required()
    }),
    onSubmit: async (values, helpers) => {
      try {
        let response = await taxApi.createTax({name:values.name,percentage:values.percentage})
        toast.success('Impuesto guardado correctamente');
        helpers.setStatus({ success: true });
        helpers.setErrors({ });
        helpers.setSubmitting(false);
        getImpuestos()
        handleClose()
      } catch (err) {
        toast.error('Error en el guardado del impuesto.');
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err });
        helpers.setSubmitting(false);
      }
    }
  });


  return (
    <>
   
    
    <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
    >
        <div id="TaxForm" style={{display: 'flex', justifyContent: 'center', alignItems: 'center',height: '100vh'}}>
        <Card sx={{ mt: 3, width:'500px' }}>
        <Typography
          color="textPrimary"
          variant="h5"
          sx={{pt:3,pl:3,mb:-2}}
        >
          Crear nuevo impuesto
        </Typography>
            <CardContent>
                <form onSubmit={formik.handleSubmit} 
                    {...other}>
                
                    <Grid container spacing={3} >
                        <Grid item md={12} xs={12}>
                        <Box sx={{ mt: 4 }}>
                            <TextField
                                error={Boolean(formik.touched.name && formik.errors.name)}
                                fullWidth
                                helperText={formik.touched.name && formik.errors.name}
                                label="Nombre"
                                name="name"
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                onFocus={handleFocus}
                                value={formik.values.name}
                            />
                        </Box>
                        <Box sx={{ mt: 4 }}>
                            <TextField
                                error={Boolean(formik.touched.percentage && formik.errors.percentage)}
                                fullWidth
                                helperText={formik.touched.percentage && formik.errors.percentage}
                                label="Porcentaje"
                                name="percentage"
                                type='number'
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                onFocus={handleFocus}
                                value={formik.values.percentage}
                            />
                        </Box>

                        <Divider sx={{ my: 3 }} />
                        <Box
                            sx={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                justifyContent: 'right',
                                mx: -1,
                                mb: -1,
                                mt: 3
                            }}
                        >
                        <Button
                            sx={{ m: 1 }}
                            variant="outlined"
                            onClick={handleClose}
                            disabled={formik.isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button
                            sx={{ m: 1 }}
                            type="submit"
                            variant="contained"
                            disabled={formik.isSubmitting}
                        >
                            Save
                        </Button>
                        </Box>

                        </Grid>
                    </Grid>
                    
            
                </form>
            </CardContent>
        </Card>
      </div>
    </Modal>
    <br></br>
    
    
    
    </>
  );
};

