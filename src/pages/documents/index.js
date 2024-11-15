import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import { clientApi } from "../../api/client-api"; // Import the client-api.js file, which fetches client data

// Esto importa el archivo con la API que me deja agarrar TODOS los datos del Gimnasio seleccionado
import { gymApiAllData } from "../../api/gym-api-all-data";

import axios from 'axios';

// Esto importa los Formularios de Formik
import { useFormik } from 'formik';

// Esto me mostrará mensajes de error si el usuario no llena los campos del formulario
import * as Yup from 'yup';

// Esto me deja crear Formularios con los Estilos de Material-UI para los formularios Formik
import {Card, CardContent, Grid, Typography, TextField, Button, Divider, Box, Container,} from '@mui/material';
import NextLink from "next/link";

// Esto me agrega la Disposición con el Navbar (tanto el de arriba como el de la izquierda)
import { DashboardLayout } from '../../components/dashboard/dashboard-layout';

// Esto creo que es para evitar que alguien entre aquí sin haberse autenticado / logueado
import { AuthGuard } from '../../components/authentication/auth-guard';
import Head from "next/head";

// Esto me dejará imprimir mensajes flash de confirmación y de error como se hacen en el resto de la web app de React
import toast from 'react-hot-toast';

import Axios from 'axios';

// Esto me deja crear Tablas con los Estilos de Material-UI
import { Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
import {ArrowRight} from "../../icons/arrow-right";

/* Página para que el Cliente pueda seleccionar si quiere ver sus Documentos Sin Firmar, o sus Documentos Firmados.
* Puedes entrar a esta página desde esta URL: /documents.
*
* */

/*
*
* */
const Index = () => {
  const router = useRouter();
  // const { id } = router.query; // This is the client ID from the URL

  const { clientId } = router.query; // This gets the client ID from the URL

  // Array que me permitirá crear Formset para Subir múltiples documentos
  const [fileInputs, setFileInputs] = useState([0]);

  // Función que, al clicar el botón del "+", agregará una Casilla adicional al Formset para subir archivos
  const addFileInput = () => {
    setFileInputs([...fileInputs, fileInputs.length]);
  };

  // Initialize state variables for document type name and files

  // Esta variable almacenará el nombre del Tipo de Documento que haya escrito el usuario en el Formulario
  const [documentTypeName, setDocumentTypeName] = useState('');

  // Esta variable almacenará cada uno de los archivos subidos en el formset del Formulario
  const [files, setFiles] = useState([]);

  // Update state variables when form fields change
  const handleDocumentTypeNameChange = (e) => {
    setDocumentTypeName(e.target.value);
  };

  // NO USAR, ya que esto coje los tipos de Documentos, cuando en realidad, necesito los Documentos de los Clientes
  const [documentTypes, setDocumentTypes] = useState([]);

  // Variable "state" en donde se van a almacenar los Documentos del Cliente autenticado
  const [memberDocuments, setMemberDocuments] = useState([]);

  /* API para los Documentos del Cliente Autenticado.
  *
  * Voy a agarrar la JWT Token del Cliente logueado, y se la enviaaré a una función de un paquete / módulo de Django
  * para que me de el ID del Cliente Autenticado; luego, enviaré esa ID a la API de Django para que me
  * dé todos los Documentos del Cliente Autenticado del modelo de Documento para los Clientes.
  *
  * Dado que debes llamar a la API de /auth/users/me/ de Django, la cual es una API pre-hecha y que es muy difícil de
  * modificar, y dado que normalmente solo me deja usar un GET request para cogerle la ID del usuario autenticado, lo
  * dejaré con el GET request por los momentos.
  *
  * Simple y llanamente copiaré y pegaré el mismo snippet con la llamada de Axios() para agarrar la ID del Cliente
  * autenticado que usé para agarrar las notificaciones del cliente autenticado.
  *
  * Now, this snippet correctly gets the User ID of the logged user. Well, now, right below this axios() call, create
  * an axios() call with a POST request to a django view which will do this things from this algorithm in spanish:
  * "Ahora, puedo usar un POST request para enviar esa ID de ese cliente para la web app de Django. Y tendré que crear
  * un nuevo view de django para que acepte el POST request con la ID del cliente, y luego, con esa ID, buscar todos
  * los registros de Documentos para clientes que tengan a ese cliente como FK." You need to create that django view,
  * since I haven't created it. This is to create a functionality that fetches the documents for the currently logged
  * user, so that the logged user can see their own documents.
  *
  * First, let's outline the steps in pseudocode for the Axios POST request and the Django view creation:
  *
  * ### Axios POST Request Pseudocode
  * 1. After successfully retrieving the user ID from the first Axios call, make a second Axios POST request.
  * 2. This POST request will send the user ID to a specific Django endpoint.
  * 3. The endpoint URL will be something like `${process.env.NEXT_PUBLIC_API_ROOT}/api/user_documents/`.
  * 4. Include the user ID in the body of the request.
  *
  * ### Django View Pseudocode
  * 1. Create a new Django view named `user_documents`.
  * 2. This view will accept POST requests containing a user ID.
  * 3. Use the user ID from the request to query the database for documents related to this user.
  * 4. The documents are assumed to be stored in a model that has a ForeignKey relationship to the user model.
  * 5. Return the documents as a JSON response.
  *
  * This setup allows the React application to fetch documents related to the logged-in user by sending the user's ID
  * to the Django backend, which then queries and returns the relevant documents.
  * */
  useEffect(() => {
      const fetchData = async () => {
        try {

          // API que coge algunos de los datos del Usuario autenticado usando el JWT Token,
          const accessToken = localStorage.getItem('accessToken');
          const responseUser = await axios.get(
            `${process.env.NEXT_PUBLIC_API_ROOT}/auth/users/me/`,
            { headers: { Authorization: `JWT ${accessToken}` } }
          );

          // Esto coge el ID del Usuario autenticado.
          const userId = responseUser.data.id;

          // // DEBUGGEO. BORRAR. Esto imprime en la consola el ID del Usuario autenticado.
          // console.log("ID del Cliente logueado: ", userId);

          // Continuing from the previous useEffect. I'll use a POST request for security purposes.
          axios.post(`${process.env.NEXT_PUBLIC_API_ROOT}/api/member-unsigned-documents/`, { userId: userId })
            .then(response => {

              // Update the state variable ("permanent variable") with the fetched documents
              // Esto mete en la variable "state" / permanente los Documentos del Cliente Autenticado de la API
              setMemberDocuments(response.data);


              // // DEBUGGEO. BORRAR. Handle the response containing the documents
              // console.log("Documents for the logged user: ", response.data);
            })

          // // API que coge las Notificaciones tipo "Cliente" del Usuario autenticado, y envía el ID del usuario
          // const responseNotifications = await axios.post(
          //     `${process.env.NEXT_PUBLIC_API_ROOT}/api/client-notifications/`,
          //   {
          //     // params: {
          //
          //       // for_admin_or_client: 2, // Esto agarra las Notificaciones para Clientes (tipo "Cliente")
          //       'client.id': userId // Esto agarra las Notificaciones del Usuario autenticado
          //     // }
          //   }
          // );
          //
          // // // // DEBUGGEO. BORRAR DESPUES. Esto me imprime las Notificaciones cogidas. BORRAR DESPUES.
          // // console.log("Fetched data:", responseNotifications.data); // This line prints the fetched data to the console
          //
          // setData(responseNotifications.data);
        } catch (error) {
          console.error("Error fetching data", error);
        }
      };

      fetchData();
  }, []);   // Fin de la API que busca los Documentos del Cliente autenticado




  // useEffect(() => {
  //
  //
  //
  //
  //
  //   Axios.get(`${process.env.NEXT_PUBLIC_API_ROOT}/api/document_types/`)
  //     .then(response => {
  //       setDocumentTypes(response.data);
  //
  //       // DEBUGGEO. BORRAR DESPUES. Esto imprime en la consola los Tipos de Documentos que se agarraron de la API.
  //       console.log(response.data);
  //
  //     })
  //     .catch(error => console.error('There was an error fetching the documents:', error));
  // }, []);

  // /* Función que mete cada archivo subido en el formset del formulario en una variable permanente.
  //
  // * */
  // const handleFileChange = (e) => {
  //
  //   // If allowing multiple files, concatenate the new files with any existing ones
  //   const uploadedFiles = event.target.files;
  //   setFiles(currentFiles => [...currentFiles, ...uploadedFiles]);
  //
  //   // If only a single file is allowed, just set the state to the first file
  //   // setFiles(event.target.files[0]);
  //
  //
  //   // setFiles(e.target.files);
  // };

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
  //       // console.log(client.email); // Log the client's email to the console
  //     } catch (error) {
  //       console.error('Error fetching client data:', error);
  //     }
  //   };
  //
  //   fetchClientData();
  // }, [clientId]); // Re-run this effect if clientId changes

  // Esto mete el cuerpo del email en una variable permanente despues de agarrarlo de la llamada a la API del Cliente.
  // Necesito crear esto, o el Formulario del Email NO se renderizará.
  const [emailBody, setEmailBody] = useState('');

  // Esto mete el Título del email en una variable permanente.
  // Necesito crear esto, o el Formulario del Email NO se renderizará.
  const [emailTitle, setEmailTitle] = useState('');

  /* Funcion que agarra los datos del Gimnasio seleccionado. Por los momentos, voy a poner "hard-coded" que el gimnasio
  * seleccionado sea el Gimnasio con ID 1.
  *
  * Cuando sepa como meter varios gimnasios, quitaré el "1" de la ID del Gimnasio que ahorita está hard-coded, y
  * veré como coger la ID del Gimnasio seleccionado sin usar una ID hard-coded.
  * */
  React.useEffect(() => {
    const fetchGymData = async () => {
      try {

        // Esto llama a la API para agarrar el Gimnasio, y me da la clae de Stripe del Gimnasio seleccionado.
        // YO NO QUIERO ESO. Yo quiero todos los datos del Gimnasio seleccionado.

        const gym = await gymApiAllData.getGym("1"); // Meteré la ID del gimnasio hard-coded por los momentos

        // setGymEmail(gym.email); // Esto mete en la variable gymEmail el email del Gimnasio del JSON para usarlo después
        // setGymName(gym.name); // Esto mete en la variable gymName el nombre del Gimnasio del JSON para usarlo después

        // console.log(gym.email); // DEBUGGEO. BORRAR. Log the gym's email to the console

        // // DEBUGGEO. BORRAR. Esto imprime todos los datos del Gimnasio seleccionado en la consola.
        // // BUG: esto solo me está agarrando la Clave de Stripe. No agarra nada más
        // console.log(gym);
      } catch (error) {
        console.error('Error fetching gym data:', error);
      }
    };

    // fetchGymData();
  }, []); // Emopty dependency array as gym ID is hard-coded

  // console.log(clientId); // DEBUG: This correctly logs the client ID to the console

  // console.log(id); // Log the client ID to the console. It's printing "undefined".


  // const handleSubmit = (event) => {
  //   event.preventDefault();
  //   console.log(emailBody);
  //   // Here you would send the email
  // };

  /* API para Subir los Documentos a la API de Django cuando el usuario clica en el botón de "Registrar."
  *
  * Tengo que coger la ID del gimnasio aquí, porque necesito meter una instancia de alguno de los gimnasios en el
  * modelo de "Tipo de Documento". Sino, me saldrá un mensaje de error.
  *
  * COMO POR LOS MOMENTOS SOLO ESTOY TRABAJANDO CON UN GIMNASIO, VOY A PONER LA ID DEL GIMNASIO HARD-CODED. ESTO
  * LO DEBO CAMBIAR DESPUÉS.
  *
  * Necesito agarrar el Nombre del Tipo de Documento y los Archivos que se subirán del Formulario de esta página, y
  * luego, pasaré esos datos a la llamada de la API usando Axios para mandar esos datos como un POST request a la API
  * de Django. Creo que, al enviar datos usando un POST request, NO SE ENVÍAN los datos usando JSON.
  *
  * Lo que haré será que, al clicar en el botón “Registrar”, llamaré a una función JS aunque llama a una API. Esa API
  * tiene que llamar a un view de Django. Ese view será una API que aceptará codigo JSON que aceptará código de la web
  * app de React. Tendré que usar axios desde la web app de React.
  *
  * Pues, también tengo que crear una API en mi web app de Django, la cual tomará codigo JSON, y me dará una
  * respuesta JSON. Lo que debe hacer este view de Django es primero meter el nombre del Tipo de Documento en el
  * modelo de Tipo de Documentos, y luego meter el/los archivos subidos por el formset al modelo de Archivos
  * Individuales.
  *
  * Luego, cuando se haga todo esto, se debe dar una respuesta de JSON que diga algo como “HTTP 200: success” a la
  * web app de React de Administradores. Cuando esto ocurra, debo redirigir al usuario con un Toast message de
  * Confirmación a otra página. Idealmente, esta página debería ser la Lista de Documentos subidos. Pero, como no he
  * creado esa página, voy a redirigir al usuario al Home Page de la web app de React de Administradores.
  *
  * PERO, si sale un error (por ejemplo, el usuario subio tipos de archivos que no debió o algo parecido), debo mostrar
  * un mensaje de error con un mensaje Toast, y debo mantener al usuario en la página de subir archivos.
  *
  * Based on your code, it seems like you're missing the state variables for `documentTypeName` and `files`. You need
  * to define these state variables and update them when the form fields change.
  *
  * In this code, I've added state variables `documentTypeName` and `files` to hold the values of the document type
  * name field and the file input field, respectively. I've also added change handlers `handleDocumentTypeNameChange`
  * and `handleFileChange` to update these state variables when the form fields change. These state variables and
  * change handlers are used in the form fields and the `handleSubmit` function.
  *
  * El campo con el nombre del Documento se almacena en una casilla llamada "document_type__name". El "__" del nombre
  * se debe a que estoy tomando ese campo como una sub-consulta. Dado a que el nombre del Documento NO se encuentra
  * en el modelo de Document For Member, sino en el modelo de Document Type, tengo que hacer una sub-consulta para
  * agarrar el nombre del Documento.
  * */
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Si se Suben los Documentos correctamente
    try {

      // Prepare the form data
      const formData = new FormData();

      // Replace 'documentTypeName' with the actual document type name
      formData.append('document_type_name', documentTypeName);

      // Meteré la ID del Gimnasio de manera hard-coded como "1" por los momentos.
      // CORREGIR DESPUES con la verdadera ID del Gimnasio seleccionado.
      formData.append('gym_id', "1");

      // Append the files to the form data
      // files.forEach((file, index) => {
      //   formData.append(`file${index + 1}`, file); // Replace 'file' with the actual file object
      // });

      // Esto mete los archivos del Formset en el FormData.
      // ACTIVAR DESPUES
      // Append each file under the 'documents' key
      for (let i = 0; i < files.length; i++) {
        formData.append('documents', files[i]);
      }

      // for (let i = 0; i < files.length; i++) {
      //   formData.append(`file${i + 1}`, files[i]);
      // }

      // // Esto imprime en la consola los datos del formulario. DEBUGGEO. BORRAR DESPUES.
      // console.log('Form data:', formData);

      // Make the POST request to the Django API
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_ROOT}/api/upload_documents/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      // const response = await axios.post(`${process.env.NEXT_PUBLIC_API_ROOT}/api/mailrelay-email/`);

      // const response = await axios.post(`${process.env.NEXT_PUBLIC_API_ROOT}/api/mailrelay-email/`, {
      //   emailBody: emailBody, // Esto envía el cuerpo del email a la API de Django
      //   emailTitle: emailTitle, // Esto envía el título del email a la API de Django
      //   clientEmail: clientEmail, // Dirección de email del cliente, el cual fue tomado anteriormente
      //   gymEmail: gymEmail, // Dirección de email del Gimnasio, el cual fue tomado anteriormente
      //   gymName: gymName, // Nombre del Gimnasio
      //   clientName: clientName, // Nombre Completo del Cliente
      //   // Include any other data you want to send here
      // });

      // // DEBUGGEO. BORRAR DESPUES.
      // console.log('Email sent successfully:', response.data);

      // Quiero mostrarle un mensaje flash de confirmación al usuario de que el email se envió correctamente.
      // Display a success toast message
      toast.success('Se han registrado correctamente los documentos.');


      // Voy a redirigir al usuario a la lista de clientes después de que se suban los documentos.
      // CORREGIR para redirigir al usuario a la página de "Documentos Subidos" después de que se suban los documentos.
      router.push('/dashboard');


    // Esto imprime un mensaje de error si no se pudo enviar el email
    } catch (error) {

      // Display an error toast message
      toast.error('Error: No se pudieron enviar los documentos.');

      // Dejaré el mensaje de error de debuggeo en el inspector para saber cual fue el error
      console.error('Error. No se pudieron registrar los documentos:', error);
    }
  };  // Fin de la función handleSubmit que llama a la API para Subir los Documentos

  return (
      /* HTML del Formulario para Lista de Documentos.
      *
      * */
      <>
        {/* Título que saldrá en la Pestaña del Navegador */}
        <Head>
          <title>
            Documentos y Consentimientos
          </title>
        </Head>

        {/* Esto va a encerrar toda la Página en un contenedor tipo "Card" */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            py: 8
          }}
        >
          {/* Otro tipo de Contenedor para hacer que la página se vea bonita */}
          <Container maxWidth="xl">

            {/* Contenedor que es probablemente solo para el título */}
            <Box sx={{ mb: 4 }}>

              {/* Grid de 1x3 (1 fila y 3 columnas) para poner el Título de la página */}
              <Grid
                container
                justifyContent="space-between"
                spacing={3}
              >
                {/* Título de la Página. */}
                <Grid item>
                  <Typography variant="h4">
                    Documentos y Consentimientos
                  </Typography>
                </Grid>


              </Grid>
            </Box> {/* Fin del contenedor del título */}

            {/* Contenedor con los enlaces a las páginas de "Pendientes de Firmar" y "Firmados" */}
            <Box sx={{ mb: 4 }}>
              <Grid container spacing={3}>

                {/* Botón de "Pendientes de Firmar" para que el Cliente vea sus Documentos Sin Firmar */}
                <Grid container item xs = {12} justifyContent="space-between">
                  <Typography variant="h4">Pendientes de Firmar</Typography>
                  <NextLink href="/documents/unsigned-documents">
                  <Button
                    startIcon={<ArrowRight fontSize="small" />}
                    variant="contained">
                  </Button>
                  </NextLink>
                </Grid>

                {/* Botón de "Firmados" que te permite ver tus Documentos Firmados */}
                <Grid container item xs = {12} justifyContent="space-between">
                  <Typography variant="h4">Firmados</Typography>
                  {/* <NextLink href={`/user/${clients.id}`}> */}
                  <NextLink href={`/documents/signed-documents`}>
                  <Button
                    startIcon={<ArrowRight fontSize="small" />}
                    variant="contained">

                  </Button>
                  </NextLink>
                </Grid>

              </Grid>
            </Box>

            {/*/!* Tabla con la Lista de Documentos *!/*/}
            {/*<Table>*/}
            {/*  /!* Títulos o Table Headers de la Tabla *!/*/}
            {/*  <TableHead>*/}
            {/*    <TableRow>*/}
            {/*      <TableCell style={{ color: 'white' }}>ID</TableCell>*/}
            {/*      <TableCell style={{ color: 'white' }}>Documento</TableCell>*/}

            {/*      /!* Columna con enlace para Ver o Descargar el Documento *!/*/}
            {/*      <TableCell style={{ color: 'white' }}>Ver Documento</TableCell>*/}

            {/*      /!* Columna con enlace para Firmar el Documento *!/*/}
            {/*      <TableCell style={{ color: 'white' }}>Firmar</TableCell>*/}
            {/*    </TableRow>*/}
            {/*  </TableHead>*/}

            {/*  /!* El "map" mete los datos de los Documentos cogidos, y los mete en la tabla *!/*/}
            {/*  /!* Cuerpo o "Table Descriptors" de la Tabla (Contenido de la Tabla en sí) *!/*/}
            {/*  <TableBody>*/}
            {/*    /!*  <TableRow key={docType.id}>*!/*/}


            {/*    {memberDocuments.map((document) => (*/}
            {/*    <TableRow key={document.id}>*/}
            {/*      <TableCell style={{ color: 'white' }}>{document.id}</TableCell>*/}

            {/*      /!* Nombre del Documento *!/*/}
            {/*      <TableCell style={{ color: 'white' }}>{document.document_type__name}</TableCell>*/}

            {/*        /!* Enlace para Ver o Descargar el Documento para cada Documento *!/*/}
            {/*        <TableCell style={{ color: 'white' }}>Ver Documento</TableCell>*/}


            {/*        /!* Botón para enviar el documento seleccionado a un cliente *!/*/}
            {/*        <TableCell style={{ color: 'white' }}>*/}
            {/*          /!*<NextLink href={`/documents/send-to-client/${docType.id}`} passHref>*!/*/}
            {/*            <Button variant="contained" color="primary">*/}
            {/*              Firmar*/}
            {/*            </Button>*/}
            {/*          /!*</NextLink>*!/*/}
            {/*        </TableCell>*/}
            {/*      </TableRow>*/}
            {/*    ))}*/}
            {/*  </TableBody>*/}
            {/*</Table>*/}


            </Container> {/* Fin del contenedor tipo "Container" */}
        </Box>  {/* Fin del contenedor tipo "Card" */}
      </>


  );
};

/* Esto me agrega la Disposición con el Navbar (tanto el de arriba como el de la izquierda) a esta página.
*
* Y, al parecer, solo puedes verlo si estás autenticado, logueado.
*
* */
Index.getLayout = (page) => (
  <AuthGuard>
    <DashboardLayout>
      {page}
    </DashboardLayout>
  </AuthGuard>
);

// Esto me deja renderizar la página usando React
export default Index;
