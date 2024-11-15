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
  FormControlLabel,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  Link,
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions 
} from '@mui/material';
import { useEffect,useState, useCallback } from "react";
import { useMounted } from '../../hooks/use-mounted';
import { taxApi } from '../../api/tax-api';
import { productApi } from '../../api/product-api';
import { supplierApi } from '../../api/supplier-api';
import { Scrollbar } from '../scrollbar';
import { saleApi } from '../../api/sale-api';
import { clientApi } from '../../api/client-api';

/* Página para Ver los Detalles de un Producto.
*
* Modifiqué ESTA PÁGINA para que Solo me Muestre los Detalles de un Producto, Y NO ME DEJE EDITAR NADA DEL
* PRODUCTO.
*
* */

let items=[]

export const ProductEditForm = (props) => {
  const { product, ...other } = props;
  const [taxes, setTaxes] = useState([])
  const [suppliers, setSuppliers] = useState([])
  const isMounted = useMounted();
  const [selectedRadio, setSelectedRadio ] = useState(1)
  const [precioConIva, setPrecioConIva] = useState(0)
  const [precioSinIva, setPrecioSinIva] = useState(0)
  const [stockMovs, setStockMovs] = useState([])
  const [sales, setSales] = useState([])
  const [stock, setStock] = useState(0)
  const [openModal, setOpenModal] = useState(false);
  const [quantity, setQuantity] = useState(0);
  const [addStock,setAddStock] = useState(false)

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
  const getSuppliers = useCallback(async () => {
    try {
      const data = await supplierApi.getSuppliers();
      if (isMounted()) {
        setSuppliers(data);
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMounted]);
  const getStockMovs = useCallback(async () => {
    try {
      const data = await productApi.getProductStock(product.id);
      const data_vendedores = await saleApi.getSellers();
      const new_movs = [];
  
      for (const s of data) {
        let vendedor = '';
        for (const v of data_vendedores) {
          if (v.id === s.employee) {
            vendedor = v;
            break;
          }
        }
        s.vendedor = vendedor.username;
        new_movs.push(s)
      }
      if (isMounted()) {
        setStockMovs(new_movs);
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMounted]);
  const getSales = useCallback(async () => {
    try {
      const data = await productApi.getProductSales(product.id);
      const new_sales = [];
  
      for (const s of data) {
        const data_cliente = await clientApi.getClient(s.buyer);
        s.comprador = data_cliente.first_name +" " + data_cliente.last_name;
        new_sales.push(s)
      }
      if (isMounted()) {
        setSales(new_sales);
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMounted]);
  const getStock = useCallback(async () => {
    try {
      let s =0;
      for (const m of stockMovs) {
       s+=parseInt(m.amount)
      }
      for (const v of sales) {
        s--;
       }
      if (isMounted()) {
        setStock(s);
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMounted,stockMovs,sales]);
  
  useEffect(()=>{
      getTaxes()
      getSuppliers()
      getStockMovs()
      getSales()
  },[])
  useEffect(()=>{
    getStock()
  },[stockMovs,sales,product])

  const formik = useFormik({
    initialValues: {
      gym:1,
      name: product.name || '',
      category: product.category || '',
      price: product.price || '',
      brand: product.brand || '',
      color: product.color || '',
      dimensions: product.dimensions || '',
      supplier: product.supplier || '',
      tax: product.tax || '',
      submit: null,
      is_active: product.is_active
    },
    validationSchema: Yup.object({
      name: Yup.string().required(),
      price: Yup.number().min(0).required(),
    }),
    onSubmit: async (values, helpers) => {
      try {
        if(selectedRadio==2) values.price = precioSinIva.toFixed(2)
        await productApi.updateProduct(product.id,values)
        toast.success(`Producto "${values.name}" modificado`);
        location.href='/products'
      } catch (err) {
        console.error(err);
        toast.error('No se ha podido modificar el producto');
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.message });
        helpers.setSubmitting(false);
      }
    }
  });

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

  const handleOpenModal = (type) => {
    setOpenModal(true);
    if(type=='add') setAddStock(true)
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setAddStock(false)
  };

  const handleQuantityChange = (event) => {
    setQuantity(event.target.value);
  };

  const handleAdd =async () => {
    try{
      const emp = await saleApi.getSellerByEmail(localStorage.getItem('user_email'))
      if(emp.type=="EMPLOYEE") await productApi.createProductStock({amount:quantity,employee:emp.id,product:product.id})
      else await productApi.createProductStock({amount:quantity,employee:2,product:product.id})
      getStockMovs()
      getStock()
      setQuantity(0)
    }catch(e){
      console.log(e)
    }
    
    handleCloseModal();
  };

  const handleSubtract = async() => {
    try{
      const emp = await saleApi.getSellerByEmail(localStorage.getItem('user_email'))
      if(emp.type=="EMPLOYEE") await productApi.createProductStock({amount:-quantity,employee:emp.id,product:product.id})
      else await productApi.createProductStock({amount:-quantity,employee:2,product:product.id})
      getStockMovs()
      getStock()
      setQuantity(0)
    }catch(e){
      console.log(e)
    }
    
    handleCloseModal();
  };

  /* Datos del Producto seleccionado.
  *
  * Yo ya no quiero que esto sea un formulario, ya que no se enviará ningún dato a la API. Solo quiero mostrar los
  * detalles del Producto.
  *
  * Entonces, tengo que modificar todo este snippet.
  *
  * Para el precio del producto, mostraré los siguientes campos en el siguiente orden: el precio sin IVA, el IVA (14%),
  * y el Precio final con el IVA incluido.
  *
  * Hice que el Importe final del producto fuera más grande que el resto del texto de los Datos del Producto, ya que es
  * lo más importante. Para ello, usé la propiedad "sx" de Material-UI.
  * */
  return (


    // Formulario para Editar los Productos. ELIMINAR ESTO.
    // <form
    //   onSubmit={formik.handleSubmit}
    //   {...props}>

    // Esto me permite añadir las etiquetas de React / Next
    <>

      {/* Esto me mostrará los datos del producto SIN usar un Formulario */}
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
                <Typography variant="body1" fontWeight="bold">Nombre del Producto:</Typography>
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
                <Typography variant="body1" color="textSecondary">{taxes.find(tax => tax.id === formik.values.tax)?.name} %{taxes.find(tax => tax.id === formik.values.tax)?.percentage}</Typography>
              </Box>

              {/* Precio Final con el IVA Incluido */}
              <Box sx={{ mt: 4 }}>
                <Typography variant="body1" fontWeight="bold" sx={{ fontSize: '1.2rem' }}>
                  Importe Total del Producto:
                </Typography>
                <Typography variant="body1" color="textSecondary" sx={{ fontSize: '2rem' }}>
                  {parseFloat(precioConIva).toFixed(2)} &euro;
                </Typography>
              </Box>

              {/*<Box sx={{ mt: 4 }}>*/}
              {/*  <Typography variant="body1">Importe del producto: {formik.values.price}</Typography>*/}
              {/*</Box>*/}
              {/* Fin del Precio del Producto */}

              {/* Marca del Producto */}
              <Box sx={{ mt: 4 }}>
                <Typography variant="body1" fontWeight="bold">Marca:</Typography>
                <Typography variant="body1" color="textSecondary">{formik.values.brand}</Typography>
              </Box>

              {/* Color */}
              <Box sx={{ mt: 4 }}>
                <Typography variant="body1" fontWeight="bold">Color:</Typography>
                <Typography variant="body1" color="textSecondary">{formik.values.color}</Typography>
              </Box>

              {/* Dimensiones */}
              <Box sx={{ mt: 4 }}>
                <Typography variant="body1" fontWeight="bold">Dimensiones:</Typography>
                <Typography variant="body1" color="textSecondary">{formik.values.dimensions}</Typography>
              </Box>

              {/* Stock */}
              <Box sx={{ mt: 4 }}>
                <Typography variant="body1" fontWeight="bold">Stock:</Typography>
                <Typography variant="body1" color="textSecondary">{stock}</Typography>
              </Box>
            </Grid>
            {/* Fin de los Datos del Producto */}

          </Grid>
        </CardContent>
      </Card>
      {/* Esto me termina de mostrar los datos del Producto SIN usar un formulario */}


    </>

  );
};

ProductEditForm.propTypes = {
  product: PropTypes.object.isRequired
};
