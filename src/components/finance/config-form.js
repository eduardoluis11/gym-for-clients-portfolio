import NextLink from "next/link";
import toast from 'react-hot-toast';
import * as Yup from 'yup';
import { useFormik } from 'formik';
// Agregué "Select" y "MenuItem" para poder crear un menú desplegable y sus opciones en el formulario.
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid, MenuItem, Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
  IconButton
} from '@mui/material';
// import { gymApi } from "../../api/gym-api";

// Esto importa la API que agarra que me permite Editar la Configuración de Finanzas del Gimnasio.
import { gymApi } from "../../api/gym-api-para-configuracion-finanzas";

import { taxApi} from "../../api/tax-api"
import { useEffect,useState,useCallback } from "react";
import { Scrollbar } from "../scrollbar";
import { ArrowRight as ArrowRightIcon } from "../../icons/arrow-right";
import { ModalNewTax } from "./new-tax-modal";
import { useMounted } from '../../hooks/use-mounted';
import DoneIcon from '@mui/icons-material/Done';
import ErrorIcon from '@mui/icons-material/Error';
import DeleteIcon from '@mui/icons-material/Delete';


/* Aquí es donde se agarran todos los datos del Gimnasio seleccionado del Modelo de Gym de la API de
* gym-api.js, y se meten en una variable.
*
* Le cambiaré el nombre a la variable de "gym_api_key" a "gym_data" o "gym" para evitar confusiones. TENGO
* QUE TAMBIEN CAMBIAR EL NOMBRE DE ESTA VARIABLE en el archivo config.js de src/pages/finances.
*
* Aquí debo declarar también cada uno de los campos que voy a agarrar de los datos del Gimnasio seleccionado usando
* "const" y "useState()".
*
* Voy a crear otra variable para coger el Método de Pago llamado "selectedPaymentMethod", el cual cogerá el Método de
* Pago (Stripe o Redsys) que ya estaba almacenado en la base de datos del Gimnasio seleccionado. Esto lo usaré
* después para imprimir en el Formulario de Formik de manera predeterminada el Método de Pago que ya estaba guardado
* en la base de datos. Tengo que usar esto después en el useEffect().
* */
export const ConfigForm = (props) => {
  // const { gym_api_key, ...other} = props;
  const { gym_data, ...other} = props;    // Esto crea la variable con todos los datos del Gimnasio.
  const [stripeApiKey, setStripeApiKey] = useState('')

  const [paymentMethod, setPaymentMethod] = useState('')  // Si usa Stripe o Redsys.

  // Esto agarrara Si el Gimnasio usa Stripe o Redsys de la base de datos, y lo pre-selcciona en el menu desplegable
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('')

  const [redsysKey, setRedsysKey] = useState('')  // Clave de Redsys.
  const [redsysMerchantCode, setRedsysMerchantCode] = useState('') // Código de Comercio de Redsys.


  const [open, setOpen] = useState(false);
  const [impuestos,setImpuestos] = useState([]);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const isMounted = useMounted();

  const getTaxes = useCallback(async () => {
    try {
      const data = await taxApi.getTaxes();
      if (isMounted()) {
        setImpuestos(data);
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMounted]);

  const handleChange = (e)=>{
      setStripeApiKey(e.target.value)
  }

  /* Esto agarra los datos del Gimnasio seleccionado del modelo de Gym de la base de datos de la API que fue llamada
  * desde gym-api.js, para luego mostrarlos en el Formulario Formik de este archivo.
  *
  * Por alguna razón, para agarrar los datos del gimnasio, tengo que agarrarlos desde una variable llamada "gym_api_key",
  * cuando debería ser algo como "gym_data". Lo cambié a "gym_data" para evitar confusiones.
  *
  * The issue you're facing is likely due to the fact that the value prop of the TextField component is being assigned an
  * object instead of a string. The stripeApiKey state variable is expected to be a string, but it seems that it's being
  * set to an object, which is why you're seeing "[object Object]" in the form field.
  *
  * Here's how you can fix it:  In your ConfigForm component, you're initializing stripeApiKey state variable with an
  * empty string and then updating it with gym_api_key prop in a useEffect hook. If gym_api_key is an object, you'll need
  * to extract the stripe_api_key from it before setting the state.
  *
  * You can modify the useEffect hook to also extract the paymentMethod, redsysKey, and redsysMerchantCode fields from the
  * gym_data object. You would need to define additional state variables to store these values. I've added new state
  * variables paymentMethod, redsysKey, and redsysMerchantCode and set their values inside the useEffect hook using the
  * corresponding properties from the gym_data object.
  *
  *
  * */
  useEffect(()=>{

    // setStripeApiKey(gym_api_key.stripeApiKey)
    setStripeApiKey(gym_data.stripeApiKey)  // Esto agarra la Clave de Stripe del Gimnasio seleccionado.

    setPaymentMethod(gym_data.paymentMethod)    // Esto agarra el Método de Pago (Stripe o Redsys).
    setRedsysKey(gym_data.redsysKey)   // Esto agarra la Clave de Redsys del Gimnasio seleccionado.
    setRedsysMerchantCode(gym_data.redsysMerchantCode)  // Esto agarra el Código de Comercio de Redsys.

  },[gym_data])   // Esto exporta TODOS los datos del Gimnasio Seleccionado.

  // useEffect(()=>{
  //     setStripeApiKey(gym_api_key)
  // },[gym_api_key])

  /* Creé este useEffect() para que el Método de Pago (Stripe o Redsys) que ya estaba guardado en la base de datos del
  * Gimnasio seleccionado se imprima en el Formulario de Formik de manera predeterminada.
  *
  * */
  useEffect(()=>{
      setSelectedPaymentMethod(paymentMethod)
  },[paymentMethod])


  /* Esta función se ejecuta cuando el usuario cambia el Método de Pago (Stripe o Redsys) en el Menú Desplegable.
  *
  * Esto hará que, cuando abras el menú desplegable y selecciones otro método de pago, se imprima correctamente ese
  * método de pago en el Menú Desplegable del Formulario de Formik.
  * */
  const handlePaymentMethodChange = (event) => {
      setSelectedPaymentMethod(event.target.value);
  };


  /* Esta función se ejecuta cuando envías el Formulario.
  *
  * Esto envía los datos rellenados por el usuario en el Formulario a la API de gym-api.js para que se actualicen en la
  * base de datos.
  *
  * Para meter los datos del Formulario en la base de datos, tengo que meter la Clave de Stripe, el Método de Pago,
  * la Clave de Redsys, y el Código de Comercio de Redsys en la API llamada updateGymApiKey(). Aquí, en el "response",
  * en lugar de solo meter la Clave de Stripe, meteré todos los datos del Formulario de este archivo.
  * */
  const handleSubmit = async(e)=>{
      e.preventDefault()
      try{
          // let response = await gymApi.updateGymApiKey(1,stripeApiKey)

          // Esto envía los datos del Formulario a la API de gym-api.js para que se actualicen en la base de datos.
          let response = await gymApi.updateGymApiKey(1, {
              stripeApiKey: stripeApiKey,
              paymentMethod: selectedPaymentMethod,
              redsysKey: redsysKey,
              redsysMerchantCode: redsysMerchantCode
          })

          //console.log(response)
          toast.success('Stripe Api Key actualizada correctamente')
      }catch(e){
          console.log(e)
      }
  }
  const updateImpuestos = (impuestos) => {
    setImpuestos(impuestos);
  };
  const handleDelete = async(id)=>{
    try {
      await taxApi.deleteTax(id)
      toast.success('Impuesto borrado con éxito!');
      getTaxes()
    } catch (err) {
      console.error(err);
      toast.error('Error en la actualización, los datos no se han modificado');
    }
  }

  useEffect(() => {
    getTaxes();
  },[]);

  /* Este es el Formulario de Formik que se muestra en la página de Configuración del apartado de "Finanzas".
  *
  * Debo agregar unos campos adicionales: uno para seleccionar el Método de Pago ("Stripe" o "Redsys"), la Clave de
  * Redsys, y otro para el Código de Comercio de Redsys.
  *
  * En lugar de poner individualmente como menu items las opciones "Stripe" y "Redsys", creé un array con las opciones
  * "Redsys" y "Stripe", e iteré / escaneé ese array usando un map() para así crear los menú items con esas opciones.
  *
  * En la base de datos en el modelo de Gym, “Stripe” y “Redsys” se guardan en minúscula (“stripe” y “redsys”). Mientras
  * tanto, en mi formulario, yo los trataba de agarrar con la primera letra en mayúscula (“Stripe” y “Redsys”). Pues,
  * como el valor del atributo “value” del <select> era diferente a lo que estaba en la base de datos (debido a que en
  * el “value” se metía en mayúscula, mientras que en la base de datos estaba en minúscula), no se me imprimía nada en
  * el formulario. Entonces, forzando que el atributo “value” del formulario se haga todo en minúscula usando
  * toLowerCase(), garantizo que el “value” y el campo con el método de pago de la base de datos sean el mismo. Y así,
  * garantizo que siempre se renderice en el campo del Formulario el método de pago (“Stripe” o “Redsys”).
  * */
  return (
    <>
    <form
      onSubmit={handleSubmit}
      {...props}>
      <Card sx={{ mt: 3 }}>
        <CardContent>

          {/* Contenedor que contiene TODO el Formulario */}
          <Grid
            container
            spacing={3}
          >

            {/* Div / Contenedor que muestra el Método de pago (Stripe o Redsys) */}
            <Grid
              item
              md={4}
              xs={12}
            >
              <Typography variant="h6">
                Método de Pago
              </Typography>
            </Grid>
            <Grid
              item
              md={8}
              xs={12}
            >
              {/* Menú Desplegable para seleccionar Método de Pago (Stripe o Redsys). */}
              {/*  ESTO SE DEBERIA TOMAR DE LA BASE DE DATOS. NO DEBE ESTAR HARD-CODED aquí. */}
              {/*  ADEMÁS, ESTO SE DEBE METER EN LA BASE DE DATOS al clicar en "Update".*/}
              <Box sx={{ mt: 2 }}>
                <Select
                  label="Método de Pago"
                  name="paymentMethod"
                  onChange={handlePaymentMethodChange}  // Esto imprime método de pago cuando seleccionas uno diferente
                  // onChange={handlePaymentMethodChange}
                  // value={paymentMethod}
                  value={selectedPaymentMethod} // Método de Pago que ya estaba guardado en la base de datos.
                  fullWidth
                >
                    {/* Esto crea el menú desplegable con las opciones "Redsys" y "Stripe" */}
                    {['Stripe', 'Redsys'].map((method) => (
                      <MenuItem key={method} value={method.toLowerCase()}>
                        {method}
                      </MenuItem>
                    ))}

                  {/*<MenuItem value="Stripe">Stripe</MenuItem>*/}
                  {/*<MenuItem value="Redsys">Redsys</MenuItem>*/}
                </Select>
              </Box>
              {/* Fin del Menú Desplegable para seleccionar Método de Pago (Stripe o Redsys). */}
            </Grid> {/* Fin del Contenedor que muestra el Método de pago (Stripe o Redsys). */}

            {/* Contenedor que muestra El título de la Clave de Stripe a la izquierda de la casilla. */}
            {/* Solo renderiza la Clave de Stripe si seleccionas "Stripe" como método de pago. */}
            {selectedPaymentMethod === 'stripe' && (
                // Esto me corrige un bug que no me permitía meter todo este código en esta condición de JS
                <>
                  <Grid
                    item
                    md={4}
                    xs={12}
                  >
                    <Typography variant="h6">
                      Clave de Stripe
                    </Typography>
                  </Grid>

                  {/* Contenedor que muestra la Clave de Stripe */}
                  <Grid
                    item
                    md={8}
                    xs={12}
                  >
                    {/* Campo de la Clave de la API de Stripe */}
                    <Box sx={{ mt: 2 }}>
                      <TextField
                        label="Clave de Stripe"
                        name="stripeApiKey"
                        onChange={handleChange}
                        // Esto agarra la Clave de Stripe de la Base de Datos
                        value={stripeApiKey}
                        fullWidth
                      />
                    </Box>
                  </Grid>
                </> // Esto me corrige un bug que no me permitía meter todo este código en esta condición de JS
            )}
            {/* Fin del Contenedor que muestra la Clave de Stripe */}

            {/* Contenedor que muestra el título de la Clave de Redsys a la izquierda de la casilla */}
            {/* Solo renderiza las claves de Redsys si seleccionas "Redsys" como el método de pago. */}
            {selectedPaymentMethod === 'redsys' && (
                // Esto me corrige un bug que no me permitía meter todo este código en esta condición de JS
                <>
                    <Grid
                      item
                      md={4}
                      xs={12}
                    >
                      <Typography variant="h6">
                        Clave de Redsys
                      </Typography>
                    </Grid> {/* Fin del Contenedor que muestra el título de la Clave de Redsys a la izquierda de la casilla */}

                    {/* Contenedor que muestra la Clave de Redsys */}
                    <Grid
                      item
                      md={8}
                      xs={12}
                    >
                      {/* Campo de la Clave de Redsys */}
                      <Box sx={{ mt: 2 }}>
                      <TextField
                        label="Clave de Redsys"
                        name="redsysKey"
                        onChange={(e) => setRedsysKey(e.target.value)}
                        value={redsysKey}
                        fullWidth
                      />
                      </Box>
                    </Grid> {/* Fin del Contenedor que muestra la Clave de Redsys */}


                    {/* Contenedor que muestra el título de la Clave de Redsys a la izquierda de la casilla */}
                    <Grid
                      item
                      md={4}
                      xs={12}
                    >
                      <Typography variant="h6">
                        Código de comercio de Redsys
                      </Typography>
                    </Grid> {/* Fin del Contenedor que muestra el título de la Clave de Redsys a la izquierda de la casilla */}

                    {/* Contenedor que muestra el Código de Comercio de Redsys */}
                    <Grid
                      item
                      md={8}
                      xs={12}
                    >
                      {/* Campo del Código de Comercio de Redsys */}
                      <Box sx={{ mt: 2 }}>
                      <TextField
                        label="Código de comercio de Redsys"
                        name="redsysMerchantCode"
                        onChange={(e) => setRedsysMerchantCode(e.target.value)}
                        value={redsysMerchantCode}
                        fullWidth
                      />
                      </Box>
                    </Grid> {/* Fin del Contenedor que muestra el Código de Comercio de Redsys */}
                </> // Esto me corrige un bug que no me permitía meter todo este código en esta condición de JS
            )}


            {/* Contenedor de la Clave de Stripe REPETIDA. DESACTIVAR. */}
            {/*<Grid*/}
            {/*  item*/}
            {/*  md={3}*/}
            {/*  xs={12}*/}
            {/*>*/}
            {/*  <Typography variant="h6">*/}
            {/*    Clave Stripe*/}
            {/*  </Typography>*/}
            {/*</Grid>*/}
            {/*<Grid*/}
            {/*  item*/}
            {/*  md={7}*/}
            {/*  xs={12}*/}
            {/*>*/}
            {/*  <Box sx={{ mt: 2 }}>*/}
            {/*  <TextField*/}
            {/*    label="Secret API KEY"*/}
            {/*    name="stripeApiKey"*/}
            {/*    onChange={handleChange}*/}
            {/*    value={stripeApiKey}*/}
            {/*    fullWidth*/}
            {/*  />*/}
            {/*  </Box>*/}

            {/*</Grid>*/}
            {/* Fin del Contenedor que muestra la Clave de Stripe REPETIDA */}

            <Grid
              item
              md={2}
              xs={12}
            >
              <Button
                sx={{ mx: 1,mt:3 }}
                type="submit"
                variant="contained"
              >
                Update
              </Button>
            </Grid>
          </Grid> {/* Fin del Contenedor que contiene TODO el formulario */}
        </CardContent>
      </Card>
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
              <Typography variant="h6" sx={{mb:2}}>
                Impuestos
              </Typography>
            </Grid>
          </Grid>
          <Scrollbar>
            <Table sx={{ minWidth: 700 }}>
              <TableHead >
                <TableRow>
                  <TableCell>Nombre</TableCell>
                  <TableCell>%</TableCell>
                  <TableCell>Activo</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {impuestos?.map((impuesto) => {


                  return (
                    <TableRow hover
                    key={impuesto.id} >
                      <TableCell>
                        <Box
                          sx={{
                            alignItems: "center",
                            display: "flex",
                          }}
                        >
                          <Box sx={{ ml: 1 }}>
                            {impuesto.name}
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography color="success.main"
                        variant="subtitle2">
                          {`${impuesto.percentage}`}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Typography color={impuesto.is_active ? "success.main" : "error.main"}
                        variant="subtitle2">
                          {impuesto.is_active && <DoneIcon></DoneIcon>}
                          {!impuesto.is_active && <ErrorIcon></ErrorIcon>}
                        </Typography>
                      </TableCell>

                      <TableCell align="right">
                          <IconButton component="a" onClick={()=>handleDelete(impuesto.id)}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>

                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Scrollbar>
          <br></br>
          <Box sx={{ textAlign:'right'}}>
            <Button
              sx={{ m: 1 }}
              variant="outlined"
              onClick={handleOpen}
            >
              Crear nuevo
            </Button>
          </Box>

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
        <NextLink href='/finances'>
        <Button
          sx={{ m: 1 }}
          variant="outlined"
        >
          Cancel
        </Button>
        </NextLink>
      </Box>
    </form>
    <ModalNewTax open={open} handleClose={handleClose} updateImpuestos={updateImpuestos}/>
    </>
  );
};

// import NextLink from "next/link";
// import toast from 'react-hot-toast';
// import * as Yup from 'yup';
// import { useFormik } from 'formik';
// // Agregué "Select" y "MenuItem" para poder crear un menú desplegable y sus opciones en el formulario.
// import {
//   Box,
//   Button,
//   Card,
//   CardContent,
//   Grid, MenuItem, Select,
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TablePagination,
//   TableRow,
//   TextField,
//   Typography,
//   IconButton
// } from '@mui/material';
// import { gymApi } from "../../api/gym-api";
// import { taxApi} from "../../api/tax-api"
// import { useEffect,useState,useCallback } from "react";
// import { Scrollbar } from "../scrollbar";
// import { ArrowRight as ArrowRightIcon } from "../../icons/arrow-right";
// import { ModalNewTax } from "./new-tax-modal";
// import { useMounted } from '../../hooks/use-mounted';
// import DoneIcon from '@mui/icons-material/Done';
// import ErrorIcon from '@mui/icons-material/Error';
// import DeleteIcon from '@mui/icons-material/Delete';
//
// /* Aquí es donde se agarran todos los datos del Gimnasio seleccionado del Modelo de Gym de la API de
// * gym-api.js, y se meten en una variable.
// *
// * Le cambiaré el nombre a la variable de "gym_api_key" a "gym_data" o "gym" para evitar confusiones. TENGO
// * QUE TAMBIÉN CAMBIAR EL NOMBRE DE ESTA VARIABLE en el archivo config.js de src/pages/finances.
// *
// * Aquí debo declarar también cada uno de los campos que voy a agarrar de los datos del Gimnasio seleccionado usando
// * "const" y "useState()".
// *
// * Voy a crear otra variable para coger el Método de Pago llamado "selectedPaymentMethod", el cual cogerá el Método de
// * Pago (Stripe o Redsys) que ya estaba almacenado en la base de datos del Gimnasio seleccionado. Esto lo usaré
// * después para imprimir en el Formulario de Formik de manera predeterminada el Método de Pago que ya estaba guardado
// * en la base de datos. Tengo que usar esto después en el useEffect().
// * */
// export const ConfigForm = (props) => {
//   const { gym_api_key, ...other} = props;
//   const [stripeApiKey, setStripeApiKey] = useState('')
//   const [open, setOpen] = useState(false);
//   const [impuestos,setImpuestos] = useState([]);
//   const handleOpen = () => setOpen(true);
//   const handleClose = () => setOpen(false);
//
//   const isMounted = useMounted();
//
//   const getTaxes = useCallback(async () => {
//     try {
//       const data = await taxApi.getTaxes();
//       if (isMounted()) {
//         setImpuestos(data);
//       }
//     } catch (err) {
//       console.error(err);
//     }
//   }, [isMounted]);
//
//   const handleChange = (e)=>{
//       setStripeApiKey(e.target.value)
//   }
//   useEffect(()=>{
//       setStripeApiKey(gym_api_key)
//   },[gym_api_key])
//
//   const handleSubmit = async(e)=>{
//       e.preventDefault()
//       try{
//           let response = await gymApi.updateGymApiKey(1,stripeApiKey)
//           //console.log(response)
//           toast.success('Stripe Api Key actualizada correctamente')
//       }catch(e){
//           console.log(e)
//       }
//   }
//   const updateImpuestos = (impuestos) => {
//     setImpuestos(impuestos);
//   };
//   const handleDelete = async(id)=>{
//     try {
//       await taxApi.deleteTax(id)
//       toast.success('Impuesto borrado con éxito!');
//       getTaxes()
//     } catch (err) {
//       console.error(err);
//       toast.error('Error en la actualización, los datos no se han modificado');
//     }
//   }
//
//   useEffect(() => {
//     getTaxes();
//   },[]);
//
//   return (
//     <>
//     <form
//       onSubmit={handleSubmit}
//       {...props}>
//       <Card sx={{ mt: 3 }}>
//         <CardContent>
//           <Grid
//             container
//             spacing={3}
//           >
//             <Grid
//               item
//               md={3}
//               xs={12}
//             >
//               <Typography variant="h6">
//                 Clave Stripe
//               </Typography>
//             </Grid>
//             <Grid
//               item
//               md={7}
//               xs={12}
//             >
//               <Box sx={{ mt: 2 }}>
//               <TextField
//                 label="Secret API KEY"
//                 name="stripeApiKey"
//                 onChange={handleChange}
//                 value={stripeApiKey}
//                 fullWidth
//               />
//               </Box>
//
//             </Grid>
//             <Grid
//               item
//               md={2}
//               xs={12}
//             >
//               <Button
//                 sx={{ mx: 1,mt:3 }}
//                 type="submit"
//                 variant="contained"
//               >
//                 Update
//               </Button>
//             </Grid>
//           </Grid>
//         </CardContent>
//       </Card>
//       <Card sx={{ mt: 3 }}>
//         <CardContent>
//           <Grid
//             container
//             spacing={3}
//           >
//             <Grid
//               item
//               md={4}
//               xs={12}
//             >
//               <Typography variant="h6" sx={{mb:2}}>
//                 Impuestos
//               </Typography>
//             </Grid>
//           </Grid>
//           <Scrollbar>
//             <Table sx={{ minWidth: 700 }}>
//               <TableHead >
//                 <TableRow>
//                   <TableCell>Nombre</TableCell>
//                   <TableCell>%</TableCell>
//                   <TableCell>Activo</TableCell>
//                   <TableCell align="right">Actions</TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {impuestos?.map((impuesto) => {
//
//
//                   return (
//                     <TableRow hover
//                     key={impuesto.id} >
//                       <TableCell>
//                         <Box
//                           sx={{
//                             alignItems: "center",
//                             display: "flex",
//                           }}
//                         >
//                           <Box sx={{ ml: 1 }}>
//                             {impuesto.name}
//                           </Box>
//                         </Box>
//                       </TableCell>
//                       <TableCell>
//                         <Typography color="success.main"
//                         variant="subtitle2">
//                           {`${impuesto.percentage}`}
//                         </Typography>
//                       </TableCell>
//
//                       <TableCell>
//                         <Typography color={impuesto.is_active ? "success.main" : "error.main"}
//                         variant="subtitle2">
//                           {impuesto.is_active && <DoneIcon></DoneIcon>}
//                           {!impuesto.is_active && <ErrorIcon></ErrorIcon>}
//                         </Typography>
//                       </TableCell>
//
//                       <TableCell align="right">
//                           <IconButton component="a" onClick={()=>handleDelete(impuesto.id)}>
//                             <DeleteIcon fontSize="small" />
//                           </IconButton>
//
//                       </TableCell>
//                     </TableRow>
//                   );
//                 })}
//               </TableBody>
//             </Table>
//           </Scrollbar>
//           <br></br>
//           <Box sx={{ textAlign:'right'}}>
//             <Button
//               sx={{ m: 1 }}
//               variant="outlined"
//               onClick={handleOpen}
//             >
//               Crear nuevo
//             </Button>
//           </Box>
//
//         </CardContent>
//       </Card>
//       <Box
//         sx={{
//           display: 'flex',
//           flexWrap: 'wrap',
//           justifyContent: 'center',
//           mx: -1,
//           mb: -1,
//           mt: 3
//         }}
//       >
//         <NextLink href='/finances'>
//         <Button
//           sx={{ m: 1 }}
//           variant="outlined"
//         >
//           Cancel
//         </Button>
//         </NextLink>
//       </Box>
//     </form>
//     <ModalNewTax open={open} handleClose={handleClose} updateImpuestos={updateImpuestos}/>
//     </>
//   );
// };