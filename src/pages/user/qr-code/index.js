import React, {useEffect, useState} from 'react';
import { useRouter } from 'next/router';
// import { Form, FormGroup, Label, Input, Button } from 'reactstrap';

import { clientApi } from "../../../api/client-api"; // Import the client-api.js file, which fetches client data

import axios from 'axios';

// Esto importa los Formularios de Formik
import { useFormik } from 'formik';

// Esto me deja crear Formularios con los Estilos de Material-UI para los formularios Formik
import {Card, CardContent, Grid, Typography, TextField, Button, Divider, Box, Container,} from '@mui/material';
import NextLink from "next/link";

// Esto me agrega la Disposición con el Navbar (tanto el de arriba como el de la izquierda)
import { DashboardLayout } from '../../../components/dashboard/dashboard-layout';

// Esto creo que es para evitar que alguien entre aquí sin haberse autenticado / logueado
import { AuthGuard } from '../../../components/authentication/auth-guard';
import Head from "next/head";
import {useMounted} from "../../../hooks/use-mounted";

// Esto me permitirá agregar Media Queries al CSS de la página. Esto tengo que instalarlo usando
// "npm install @mui/styles" --legacy-peer-deps"
import { makeStyles } from '@mui/styles';

/* Página para que el Cliente pueda ver su propio Código QR.

* */

const Index = () => {

  const isMounted = useMounted();

  // Variable en donde voy a meter los datos del usuario logueado.
  const [client, setClient] = useState(null);

  // Esto me permitirá agregar Media Queries al CSS de la página
  const useStyles = makeStyles({
    responsiveQr: {
      '@media (max-width:1080px)': {
        width: '100%',
        height: 'auto',
      },
    },
  });

  // Esto me dejará usar los Media Queries al CSS de la página
  const classes = useStyles();

  /* Función useEffect con las APIS para coger los datos del Cliente Logueado usando el JWT Token, y para coger el
  * Código QR del Cliente.
  *
  * Quiero coger el código QR del Cliente usando un POST request en lugar de un GET request para proteger la
  * privacidad de la ID del Cliente logueado.
  *
  * Creé una API para coger única y exclusivamente el Código QR del Cliente. Está protegida para que un cliente NO
  * pueda ver el codigo QR de otros clientes. Para ello, voy a agarrar la versión "encriptada" en Base64 el Código QR
  * del Cliente, y la voy a almacenar en una variable.
  *
  * Pero, para poder agarrar el QR del Cliente con la API que lo agarra encriptado en Base64, tengo que primero
  * agarrar el ID del Cliente autenticado usando el JWT Token. Luego, con ese ID del Cliente, voy a llamar a la API
  * que agarra el Código QR del Cliente. Así podré mostrarle al cliente su respectivo Código QR.
  *
   */
  useEffect(() => {
    const fetchUserDetails = async () => {
      const accessToken = localStorage.getItem('accessToken');

      // Si se detecta el JWT Token
      if (accessToken) {
        try {

          // API que agarra los datos del Usuario logueado del JWT Token.
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_ROOT}/auth/users/me/`,
            { headers: { Authorization: `JWT ${accessToken}` } }
          );


          // // JSON con los datos del Usuario logueado.
          // const userData = response.data;

          // JSON con el ID del Usuario logueado obtenido por el JWT Token.
          const userId = response.data.id;

          // // DEBUGGEO: Imprimo el ID del Usuario logueado.
          // console.log('User ID:', userId);

          // // Esto agarra todos los datos del Cliente del modelo de Account que tiene la ID del Usuario Logueado.
          // const clientData = await clientApi.getClient(userId);

          // Esto llama a la API de Prueba para coger el Código QR "encriptado" en Base64 del Cliente.
          const responseQRBase64 = await axios.post(
            // `${process.env.NEXT_PUBLIC_API_ROOT}/api/qr-code-test/`,

        `${process.env.NEXT_PUBLIC_API_ROOT}/api/client-qr-code/`,
            { // This is where you'd normally pass the data for the POST request
              'client.id': userId // Esto envía el ID del Cliente al Back-end para coger el Código QR del Cliente
            },
            { headers: { Authorization: `JWT ${accessToken}` } }
          );

          // // DEBUGGEO. ARREGLAR DESPUES. Esto imprime el Código QR "encriptado" en Base64.
          // console.log('Codigo QR en Base64:', responseQRBase64.data); // FUNCIONA.

          // Esto mete la imagen "encriptada" en Base64 del Código QR en una variable.
          const b64ImgData = responseQRBase64.data;

          // // DEBUGGEO: Esto debe imprimir el enlace a la imagen del Código QR del Cliente. BORRAR DESPUES.
          // console.log(clientData.qr_code);  // FUNCIONA.

          if (isMounted()) {

            // Meto los todos datos del Cliente del JSON de la llamada de getClient() en la variable "client".
            // setClient(userData);

            // setClient(clientData);
            setClient(b64ImgData);
          }
        } catch (error) {
          console.error('Error fetching user details:', error);
        }
      }
    };

    fetchUserDetails();
  }, [isMounted]);
  // const router = useRouter();
  // // const { id } = router.query; // This is the client ID from the URL
  //
  // const { clientId } = router.query; // This gets the client ID from the URL
  //
  // // Esta es la variable en donde se meterá el email del cliente. Inicialmente es nula.
  // const [clientEmail, setClientEmail] = useState(null);
  //
  // // Aquí meteré el email del Gimnasio del model ode Gimnasio a la API de Django para enviar emails por Mailrelay
  // const [gymEmail, setGymEmail] = useState(null);
  //
  // // Esto coge el nombre del Gimnasio del modelo de Gimnasio
  // const [gymName, setGymName] = useState(null);
  //
  // // Esto coge el nombre del Cliente del modelo de Account (del Usuario)
  // const [clientName, setClientName] = useState(null);
  //
  // // Esto coge el nombre de usuario del Cliente del modelo de Account (del Usuario)
  // const [clientUsername, setClientUsername] = useState(null);
  //
  // /* This fetches the Client data when the component mounts.
  // *
  // * I will concatenate the name and last_name fields with a space in between and assign the result to the
  // * clientName state variable.
  // */
  // React.useEffect(() => {
  //   const fetchClientData = async () => {
  //     if (!clientId) {
  //       return; // Si el ID del cliente es nula /undefined, no hagas nada para evitar mensajes de error en la consola
  //     }
  //
  //     // Si el ID del cliente no es nula, entonces llama a la API de Django para obtener los datos del cliente
  //     try {
  //       const client = await clientApi.getClient(clientId);
  //
  //       setClientEmail(client.email); // Esto mete en la variable clientEmail el email del cliente para usarla después
  //
  //       // Esto me coge el nombre completo del cliente concatenando el nombre y apellido
  //       setClientName(client.first_name + " " + client.last_name);
  //
  //       // Esto me coge el nombre de usuario del cliente
  //       setClientUsername(client.username);
  //
  //       // // DEBUGGEO. BORRAR. Esto imprime el nombre del Cliente seleccionado en la consola.
  //       // console.log(client.first_name + " " + client.last_name);
  //
  //       // console.log(client.email); // Log the client's email to the console
  //     } catch (error) {
  //       console.error('Error fetching client data:', error);
  //     }
  //   };
  //
  //   fetchClientData();
  // }, [clientId]); // Re-run this effect if clientId changes
  //
  // // Esto mete el cuerpo del email en una variable permanente despues de agarrarlo de la llamada a la API del Cliente.
  // // Necesito crear esto, o el Formulario del Email NO se renderizará.
  // const [emailBody, setEmailBody] = useState('');
  //
  // // Esto mete el Título del email en una variable permanente.
  // // Necesito crear esto, o el Formulario del Email NO se renderizará.
  // const [emailTitle, setEmailTitle] = useState('');
  //
  // /* Funcion que agarra los datos del Gimnasio seleccionado. Por los momentos, voy a poner "hard-coded" que el gimnasio
  // * seleccionado sea el Gimnasio con ID 1.
  // *
  // * Cuando sepa como meter varios gimnasios, quitaré el "1" de la ID del Gimnasio que ahorita está hard-coded, y
  // * veré como coger la ID del Gimnasio seleccionado sin usar una ID hard-coded.
  // * */
  // React.useEffect(() => {
  //   const fetchGymData = async () => {
  //     try {
  //
  //       // Esto llama a la API para agarrar el Gimnasio, y me da la clae de Stripe del Gimnasio seleccionado.
  //       // YO NO QUIERO ESO. Yo quiero todos los datos del Gimnasio seleccionado.
  //
  //       const gym = await gymApiAllData.getGym("1"); // Meteré la ID del gimnasio hard-coded por los momentos
  //
  //       setGymEmail(gym.email); // Esto mete en la variable gymEmail el email del Gimnasio del JSON para usarlo después
  //       setGymName(gym.name); // Esto mete en la variable gymName el nombre del Gimnasio del JSON para usarlo después
  //
  //       // console.log(gym.email); // DEBUGGEO. BORRAR. Log the gym's email to the console
  //
  //       // // DEBUGGEO. BORRAR. Esto imprime todos los datos del Gimnasio seleccionado en la consola.
  //       // // BUG: esto solo me está agarrando la Clave de Stripe. No agarra nada más
  //       // console.log(gym);
  //     } catch (error) {
  //       console.error('Error fetching gym data:', error);
  //     }
  //   };
  //
  //   fetchGymData();
  // }, []); // Empty dependency array as gym ID is hard-coded

  // console.log(clientId); // DEBUG: This correctly logs the client ID to the console

  // console.log(id); // Log the client ID to the console. It's printing "undefined".




  // /* Esto llama la API de Mailrelay de la web app de Django para enviar el email al cliente seleccionado.
  // *
  // * In this code, I've replaced the console.log(emailBody) line with an axios.post call to send the email body to your
  // * API. The URL of the API is ${process.env.NEXT_PUBLIC_API_ROOT}/api/mailrelay-email/, as you specified. The data
  // * sent to the API is an object with emailBody as a property. If the API call is successful, a confirmation message is
  // * printed to the console with the response data from the API. If there's an error, it's printed to the console with
  // * console.error.
  // *
  // * To include the client's email address in the API call, you can modify the handleSubmit function to include a new
  // * property in the data object that's sent to the API. You can fetch the client's email address in the useEffect hook
  // * where you're already fetching the client data, and store it in a state variable. Then, you can use this state
  // * variable in the handleSubmit function. In this code, I've added a new state variable clientEmail to store the
  // * client's email address. This email address is fetched in the useEffect hook where the client data is fetched, and
  // * it's set with setClientEmail(client.email). Then, in the handleSubmit function, clientEmail is included in the data
  // * object that's sent to the API.
  // *
  // * También voy a meter el Email del Gimnasio del modelo de Gimnasio aquí para enviar emails por Mailrelay. El email
  // * desde el que se va enviar el correo NO se va a tomar del .env, sino que se tomará del email que esté guardado en el
  // * gimnasio del modelo de Gimnasio.
  // *
  // * Cogeré también el nombre del Cliente, y lo pondré en el Email enviado por Mailrelay.
  // *
  // * */
  // const handleSubmit = async (event) => {
  //   event.preventDefault();
  //
  //   try {
  //     // const response = await axios.post(`${process.env.NEXT_PUBLIC_API_ROOT}/api/mailrelay-email/`);
  //
  //     const response = await axios.post(`${process.env.NEXT_PUBLIC_API_ROOT}/api/mailrelay-email/`, {
  //       emailBody: emailBody, // Esto envía el cuerpo del email a la API de Django
  //       emailTitle: emailTitle, // Esto envía el título del email a la API de Django
  //       clientEmail: clientEmail, // Dirección de email del cliente, el cual fue tomado anteriormente
  //       gymEmail: gymEmail, // Dirección de email del Gimnasio, el cual fue tomado anteriormente
  //       gymName: gymName, // Nombre del Gimnasio
  //       clientName: clientName, // Nombre Completo del Cliente
  //       // Include any other data you want to send here
  //     });
  //
  //
  //   } catch (error) {
  //     console.error('Error sending email:', error);
  //   }
  // };  // Fin de la función handleSubmit que llama a la API de Mailrelay

  return (
      /* HTML de la Página con la Imagen del Código QR del Cliente.
      *
      * To print the QR code from the clientData variable in the HTML of the page, you can use an img tag and set its
      * src attribute to clientData.qr_code. In this updated code, a conditional rendering is used to check if client
      * and client.qr_code are not null or undefined. If they are not, an img tag is rendered with its src attribute set
      * to client.qr_code. This will display the QR code on the page.
      *
      * La imagen del Código QR se muestra en la página si el cliente y el código QR existen. Si no existen, no se
      * muestra nada. Esto se hace con un condicional que verifica si client y client.qr_code no son nulos ni
      * indefinidos. Si no lo son, se renderiza una etiqueta img con su atributo src establecido en client.qr_code. Esto
      * mostrará el código QR en la página.
      *
      * La imagen del Código QR está "encriptada" en Base64 por motivos de seguridad. Entonces, para mostrar la imagen
      * en la página, se debe usar el prefijo data:image/png;base64, seguido de la cadena Base64 del código QR. Esto se
      * hace en el src del elemento img para que se pueda "desencriptar" la imagen de Base64, y se pueda mostrar
      * en la página.
      *
      * To make the image clickable and open in a new tab in full screen, you can wrap the img tag with an a tag. The
      * href attribute of the a tag should be the same as the src attribute of the img tag. This will create a link to
      * the image itself. When the image is clicked, it will open in a new tab in full screen.
      *
      * The @media snippet is a CSS rule, so it should be placed in a CSS file that is linked to your HTML or JavaScript
      * file. However, since you're using a JavaScript file with React and Material-UI, you can use the makeStyles hook
      * from Material-UI to create a CSS-in-JS solution. First, import makeStyles from @mui/styles. Then, you can apply
      * this class to your image. In this updated code, the responsive-qr class is applied to the img tag. This class
      * includes the styles for making the image responsive, but these styles will only be applied if the width of the
      * screen is less than 1080px.
      *
      * Hice que el Código QR sea responsive para que se pueda ver en el móvil. Solo estoy modificando el tamaño en
      * pantallas para móvil, NO en pantallas para ordenador.
      *
      * Le dejaré el "target="_blank" por motivos de usabilidad / UX. Sí, hay problemas de ciberseguridad con esto,
      * pero no creo que los clientes que vayan a ver su codigo QR en su movil vayan a querer volverse para atrás
      * (ir a la página anterior), ya que sería un poco tedioso para ellos. No hay un botón de "volver" en la
      * página con el código QR. Por lo tanto, es más fácil para los clientes el abrirlo en otra pestaña, y luego
      * devolverse para la pestaña anterior.
      * */
      <>
        {/* Texto que saldrá en la Pestaña del Navegador */}
        <Head>
          <title>
            Código QR
          </title>
        </Head>

        {/* Esto va a encerrar todo el Formulario en un contenedor tipo "Card" */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            py: 8
          }}
        >
          {/* Otro tipo de Contenedor para hacer que el Formulario se vea bonito */}
          <Container maxWidth="xl">

            {/* Contenedor que es probablemente solo para el título */}
            <Box sx={{ mb: 4 }}>

              {/* Grid de 1x3 (1 fila y 3 columnas) para poner el Título de la página */}
              <Grid
                container
                justifyContent="space-between"
                spacing={3}
              >
                {/* Título de la Página. Incluiré el nombre de Usuario del Cliente. */}
                <Grid item>
                  <Typography variant="h4">
                    Código QR
                  </Typography>
                </Grid>
              </Grid>
            </Box> {/* Fin del contenedor probablemente solo para el título */}
            {/*<form onSubmit={handleSubmit}>*/}
            <form>
              <Card sx={{mt: 3}}>
                <CardContent>

                  {/* Título del Formulario. Mostraré el email del cliente */}
                  <Typography variant="h6">
                    Código QR
                  </Typography>

                  {/* Grid de 1x3 para el Formulario en sí. Esto hará más angosto los campos de Título y Mensaje. */}
                  <Grid container spacing={3}>

                    {/* Columna 1: Espacio vacío a la izquierda de la página */}
                    <Grid item md={4} xs={12}>
                        {/* Espacio vacío a la izquierda de la página */}
                    </Grid>

                    {/* Columna 2: Código QR del Cliente */}
                    <Grid item md={8} xs={12}>

                        {/* Si el Cliente y el Codigo QR existen, esto muestra la Imagen con el QR */}
                        {/* DEBO HACERLO RESPONSIVE para que siempre se pueda ver en el móvil. */}
                        {client && client.qr_code && (
                            <div>
                              {/* Le agregué un enlace para que puedas ver la imagen en tamaño completo al clicarla */}
                              <a href={`data:image/png;base64,${client.qr_code}`} target="_blank"
                                 rel="noopener noreferrer">
                                  {/*<img src={client.qr_code} alt="QR Code" />*/}

                                  {/* Esto muestra la imagen del Código QR "desencriptado" de Base64 */}
                                  <img src={`data:image/png;base64,${client.qr_code}`} alt="QR Code"
                                    className={classes.responsiveQr}  // Esto hace que el Código QR sea responsive
                                    //   style={{
                                    //   width: '100%',
                                    //   height: 'auto'
                                    // }}
                                  />
                              </a>
                            </div>
                          )}

                      {/*/!* El <Box> me permitirá agregar padding vertical entre el Campo "Titulo" y "Mensaje" *!/*/}
                      {/*/!* Título del Email *!/*/}
                      {/*<Box sx={{ mt: 4 }}>*/}
                      {/*    <TextField*/}
                      {/*        id="emailTitle"*/}
                      {/*        label="Título del Mensaje"*/}
                      {/*        value={emailTitle}*/}
                      {/*        onChange={(e) => setEmailTitle(e.target.value)}*/}
                      {/*        fullWidth*/}
                      {/*    />*/}
                      {/*</Box>*/}

                      {/*/!* Mensaje o Cuerpo del Email. Es un <textarea>. *!/*/}
                      {/*/!* El <Box> me permitirá agregar padding vertical entre el Campo "Titulo" y "Mensaje" *!/*/}
                      {/*<Box sx={{ mt: 4 }}>*/}
                      {/*  <TextField*/}
                      {/*      id="emailBody"*/}
                      {/*      label="Mensaje"*/}
                      {/*      value={emailBody}*/}
                      {/*      onChange={(e) => setEmailBody(e.target.value)}*/}
                      {/*      fullWidth*/}
                      {/*      multiline*/}
                      {/*      rows={10} // Modificar esto para hacer que este campo sea más alto*/}
                      {/*  />*/}
                      {/*</Box>*/}
                    </Grid> {/* Fin de la Columna 2: Título y Mensaje del Email */}
                  </Grid> {/* Fin del Grid de 1x3 para el Formulario en sí. */}
                </CardContent>
              </Card> {/* Fin del contenedor tipo "Card" con el color Azul Marino */}

              {/*Botón viejo para Enviar el Formulario. NO USAR*/}
              {/*<Button type="submit">Enviar Email</Button>*/}

              {/* Línea divisoria estilo "hr" */}
              {/*<Divider sx={{ my: 3 }} />*/}

              {/*/!* Botones de Update y Cancel. *!/*/}
              {/*<Box*/}
              {/*  sx={{*/}
              {/*    display: 'flex',*/}
              {/*    flexWrap: 'wrap',*/}
              {/*    // justifyContent: 'right',*/}
              {/*    justifyContent: 'center', // Changed from 'right' to 'center'*/}
              {/*    mx: -1,*/}
              {/*    mb: -1,*/}
              {/*    mt: 3*/}
              {/*  }}*/}
              {/*>*/}
              {/*   /!* Botón de "Cancel" / "Cancelar". Esto de devuelve a la lista de Clientes *!/*/}
              {/*  <NextLink href='/clients'>*/}
              {/*  <Button*/}
              {/*    sx={{ m: 1 }}*/}
              {/*    variant="outlined"*/}
              {/*  >*/}
              {/*    Cancelar*/}
              {/*  </Button>*/}
              {/*  </NextLink>*/}

              {/*  /!* Botón para Enviar el Email *!/*/}
              {/*  <Button*/}
              {/*    sx={{ m: 1 }}*/}
              {/*    type="submit"*/}
              {/*    variant="contained"*/}
              {/*  >*/}
              {/*    Enviar Email*/}
              {/*  </Button>*/}
              {/*</Box>*/}
              {/* Fin de los Botones de Update y Cancel. */}
            </form>
            </Container> {/* Fin del contenedor tipo "Container" */}
        </Box>  {/* Fin del contenedor tipo "Card" */}
      </>



      // <Form onSubmit={handleSubmit}>
      //
      //   {/* Título del Email */}
      //   <FormGroup>
      //     <Label for="emailTitle">Título del Mensaje</Label>
      //     <Input
      //       type="text"
      //       name="emailTitle"
      //       id="emailTitle"
      //       value={emailTitle}
      //       onChange={(e) => setEmailTitle(e.target.value)}
      //     />
      //   </FormGroup>
      //
      //   {/* Mensaje o Cuerpo del Email */}
      //   <FormGroup>
      //     <Label for="emailBody">Mensaje</Label>
      //     <Input
      //       type="textarea"
      //       name="emailBody"
      //       id="emailBody"
      //       value={emailBody}
      //       onChange={(e) => setEmailBody(e.target.value)}
      //     />
      //   </FormGroup>
      //   <Button type="submit">Enviar Email</Button>
      // </Form>
  );
};

/* Esto me agrega la Disposición con el Navbar (tanto el de arriba como el de la izquierda) a la página de Enviar
* Emails.
*
* Y, al parecer, solo puedes verlo si estás autenticado, logueado.
*
* To add the side navbar to the send-email\index.js file, you need to wrap the main content of the page with the
* DashboardLayout component, similar to how it's done in the clients/index.js file. In this code, the DashboardLayout
* and AuthGuard components are imported at the top of the file. Then, a getLayout function is added to the Index
* component. This function takes the page (which is the Index component itself) as an argument and returns a new
* component with the page wrapped inside the DashboardLayout and AuthGuard components. This will add the side navbar to
* the send-email\index.js page.
* */
Index.getLayout = (page) => (
  <AuthGuard>
    <DashboardLayout>
      {page}
    </DashboardLayout>
  </AuthGuard>
);

export default Index;