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
import { getPaymentMethods } from "../../slices/gym";
import { useEffect, useState,useCallback } from "react";
import { clientApi } from "../../api/client-api";
import { stripeApi } from '../../api/stripe-api';
import Cards from 'react-credit-cards';
import 'react-credit-cards/es/styles-compiled.css';
import { display, textAlign } from '@mui/system';
import Modal from '@mui/material/Modal';
import { useMounted } from '../../hooks/use-mounted';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };



export const ModalCreditCard = (props) => {

  
  const isMounted = useMounted();

  const { client, open, handleClose,updatePaymentMethods,...other } = props;

  const getPaymentMethods = useCallback(async () => {
    try {
      const data = await stripeApi.getPaymentMethods(client.stripe_customer_id);
      console.log(data.data)
      if (isMounted()) {
        updatePaymentMethods(data.data);
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
        cvc: '',
        expiry_month: '',
        expiry_year: '',
        focus: '',
        name: '',
        number: ''
    },
    validationSchema: Yup.object({
      name: Yup.string().min(5).required(),
      expiry_month: Yup.number().min(1).max(12).required(),
      expiry_year: Yup.number().min(24).max(44).required(),
      number: Yup.number().required(),
      cvc: Yup.number().max(999).required()
    }),
    onSubmit: async (values, helpers) => {
      try {
        if(!client.stripe_customer_id || client.stripe_customer_id==undefined){
            await stripeApi.createCustomer(client.id,client)
          }
        let data = {
            type: "card",
            card: {
                number: values.number,
                exp_month: values.expiry_month,
                exp_year: values.expiry_year,
                cvc: values.cvc
            },
            billing_details:{
                name: values.name
            }
        }
          // chequear si se actualiza el client
        let resp = await stripeApi.createPaymentMethod(client.stripe_customer_id,data)
        console.log(resp)
        toast.success('Método de pago guardado correctamente');
        helpers.setStatus({ success: true });
        helpers.setErrors({ });
        helpers.setSubmitting(false);
        getPaymentMethods()
        helpers.resetForm()
        handleClose()
      } catch (err) {
        toast.error('Error en el guardado de la tarjeta. Chequee los datos ingresados.');
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
        <div id="PaymentForm" style={{display: 'flex', justifyContent: 'center', alignItems: 'center',height: '100vh'}}>
        <Card sx={{ mt: 3, width:'500px' }}>
            <CardContent>
                <Cards
                    cvc={formik.values.cvc}
                    expiry={formik.values.expiry_month.toString() + formik.values.expiry_year.toString()}
                    focused={formik.values.focus}
                    name={formik.values.name}
                    number={formik.values.number}
                />
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
                                error={Boolean(formik.touched.number && formik.errors.number)}
                                fullWidth
                                helperText={formik.touched.number && formik.errors.number}
                                label="Número"
                                name="number"
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                onFocus={handleFocus}
                                value={formik.values.number}
                            />
                        </Box>
                        <Box sx={{ mt: 4 }}>
                            <TextField
                                error={Boolean(formik.touched.expiry_month && formik.errors.expiry_month)}
                                fullWidth
                                helperText={formik.touched.expiry_month && formik.errors.expiry_month}
                                label="EXP. Month"
                                name="expiry_month"
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                onFocus={handleFocus}
                                value={formik.values.expiry_month}
                                inputProps={{
                                  min: 1,
                                  max: 12,
                                  step: 1,
                                }}
                                type="number"
                            />
                        </Box>
                        <Box sx={{ mt: 4 }}>
                            <TextField
                                error={Boolean(formik.touched.expiry_year && formik.errors.expiry_year)}
                                fullWidth
                                helperText={formik.touched.expiry_year && formik.errors.expiry_year}
                                label="EXP. Year"
                                name="expiry_year"
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                onFocus={handleFocus}
                                value={formik.values.expiry_year}
                                inputProps={{
                                  min: 24,
                                  max: 44,
                                  step: 1,
                                }}
                                type="number"
                            />
                        </Box>
                        <Box sx={{ mt: 4 }}>
                            <TextField
                                error={Boolean(formik.touched.cvc && formik.errors.cvc)}
                                fullWidth
                                helperText={formik.touched.cvc && formik.errors.cvc}
                                label="CVC"
                                name="cvc"
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                onFocus={handleFocus}
                                value={formik.values.cvc}
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

ModalCreditCard.propTypes = {
  client: PropTypes.object.isRequired
};
