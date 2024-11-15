import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import { clientApi } from "../../../../api/client-api"; // Import the client-api.js file, which fetches client data

// Esto importa el archivo con la API que me deja agarrar TODOS los datos del Gimnasio seleccionado
import { gymApiAllData } from "../../../../api/gym-api-all-data";

import axios from 'axios';

// Esto importa los Formularios de Formik
import { useFormik } from 'formik';

// Esto me mostrará mensajes de error si el usuario no llena los campos del formulario
import * as Yup from 'yup';

// Esto me deja crear Formularios con los Estilos de Material-UI para los formularios Formik
import {Card, CardContent, Grid, Typography, TextField, Button, Divider, Box, Container,} from '@mui/material';
import NextLink from "next/link";

// Esto me agrega la Disposición con el Navbar (tanto el de arriba como el de la izquierda)
import { DashboardLayout } from '../../../../components/dashboard/dashboard-layout';

// Esto creo que es para evitar que alguien entre aquí sin haberse autenticado / logueado
import { AuthGuard } from '../../../../components/authentication/auth-guard';
import Head from "next/head";

// Esto me dejará imprimir mensajes flash de confirmación y de error como se hacen en el resto de la web app de React
import toast from 'react-hot-toast';

import Axios from 'axios';

// Esto me deja crear Tablas con los Estilos de Material-UI
import { Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';

/* Página para ver la Lista de Archivos de un Tipo de Documento Sin Firmar Seleccionado del Cliente Autenticado. Puedes
entrar a esta página desde esta URL: /documents/unsigned-documents/[documentTypeID].
*
* */

/* First, let's modify the React component to extract the Document Type ID from the URL and send it to the Django
backend. Then, we'll create a new Django view to handle this request, fetch the corresponding IndividualFile records,
and return them as JSON.

## Step 1: Modify the React Component

Extract the Document Type ID from the URL using useRouter from next/router, and then modify the useEffect hook to send
this ID to the Django backend.

*
* */
const Index = () => {
  const router = useRouter();

  const { documentTypeID } = router.query; // Extracting Document Type ID from the URL

  // DEBUGGEO. BORRAR. Esto imprime en la consola el ID del Tipo de Documento seleccionado.
  console.log("ID del Tipo de Documento seleccionado: ", documentTypeID);

  // const { id } = router.query; // This is the client ID from the URL

  // const { clientId } = router.query; // This gets the client ID from the URL

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
  const [documentFiles, setDocumentFiles] = useState([]);

  /* API para los Archivos del Tipo de Documento Seleccionado.
  *
  * */
  useEffect(() => {
      const fetchData = async () => {
        try {

          // // API que coge algunos de los datos del Usuario autenticado usando el JWT Token,
          // const accessToken = localStorage.getItem('accessToken');
          // const responseUser = await axios.get(
          //   `${process.env.NEXT_PUBLIC_API_ROOT}/auth/users/me/`,
          //   { headers: { Authorization: `JWT ${accessToken}` } }
          // );
          //
          // // Esto coge el ID del Usuario autenticado.
          // const userId = responseUser.data.id;
          //
          // // DEBUGGEO. BORRAR. Esto imprime en la consola el ID del Usuario autenticado.
          // console.log("ID del Cliente logueado: ", userId);

          // Esto va a enviar el ID del Tipo de Documento a Django para que me devuelva los Archivos del Documento
          axios.post(`${process.env.NEXT_PUBLIC_API_ROOT}/api/files-for-selected-document-type/`, { documentTypeID: documentTypeID })
            .then(response => {

              // Update the state variable ("permanent variable") with the fetched documents
              // Esto mete en la variable "state" / permanente los Archivos del Tipo de Documento Seleccionado
              setDocumentFiles(response.data);


              // DEBUGGEO. BORRAR. Handle the response containing the documents
              console.log("Files for the selected Document Type: ", response.data);
            })


        } catch (error) {
          console.error("Error fetching data", error);
        }
      };

      fetchData();
  }, []);   // Fin de la API que busca los Documentos del Cliente autenticado

  /* Función para abrir un Archivo en formato Base64 en una nueva ventana del navegador.
  *
  * Como los Archivos están en formato Base64, necesito decodificarlos y convertirlos en un Blob para poder abrirlos
  * en el navegador, para que así los clientes puedan ver los archivos al clicar en el enlace de "Ver Archivo".
  *
  * To display a `.txt` file encoded in Base64 in the browser when a link is clicked, you can use the `data:` URI
  * scheme with the appropriate MIME type for text files (`text/plain`). However, browsers do not directly support
  * downloading or displaying `.txt` files in a new tab through Base64 encoded links due to security reasons. A common
  * workaround is to use JavaScript to decode the Base64 content and then display it in a new window or an element on
  * the page.
  *
  * Here's a JavaScript snippet that creates a function to decode the Base64 content and open it in a new window. This
  * function can be called upon clicking a link.
  *
  * To use this function with your link, you would modify the `href` to call `openBase64File` with the Base64 content of
  * your file. Assuming `file.base64` contains the Base64 encoded content of your `.txt` file, you would update your
  * link as follows.
  *
  * This approach decodes the Base64 content, creates a Blob from it, generates a URL for the Blob, and then opens this
  * URL in a new tab. This effectively "decrypts" the Base64 encoded text file and displays its content in the browser.
  *
  * TENGO QUE EDITAR ESTO PARA QUE ACEPTE ARCHIVOS PDF DESPUES! AHORITA SOLO ACEPTA ARCHIVOS .txt.
  *
  * Y ESTO TIENE UNA VULNERABILIDAD DE SEGURIDAD. La vulnerabilidad se llama "client-side-unvalidated-url-redirection.
  * Allowing unvalidated redirection based on user-specified URLS" según Pycharm.
  *
  * To address the vulnerability "client-side-unvalidated-url-redirection" in the `openBase64File()` function, you can
  * ensure that the Base64 content being decoded and displayed is strictly validated and comes from a trusted source.
  * Since the primary concern is about redirecting to a URL based on user-specified content, the key is to avoid using
  * any user-controlled input directly in sensitive operations without validation.
  *
  * However, in the context of your function, the vulnerability might be slightly misidentified, as the function decodes
  * Base64 content into a blob and opens it in a new window, rather than redirecting based on a URL parameter. The
  * security concern might rather be about ensuring that the Base64 content is safe to decode and display.
  *
  * To mitigate potential risks, ensure that:
  *
  * 1. The Base64 content is generated and controlled by your server or a trusted source.
  *
  * 2. Any user input leading to the generation of this Base64 content is properly sanitized and validated server-side.
  *
  * If you're displaying content that includes or is derived from user input, consider implementing additional layers of
  * security, such as Content Security Policy (CSP) headers, to protect against XSS attacks.
  *
  * Remember, the key to security is not just in how you handle the content on the client side but also ensuring that
  * any content generated or passed to the client side is from a trusted and validated source.
  * */
  function openBase64File(base64Content) {

    // Ensure base64Content is from a trusted source to mitigate security risks

    // Decode the Base64 string
    const decodedContent = atob(base64Content);

    // Determine the MIME type based on the fileType parameter
    // let mimeType = 'text/plain'; // Default MIME type for .txt files

    // if (fileType === 'pdf') {
    //   mimeType = 'application/pdf';
    // }

    // Create a Blob with the text content and the correct MIME type.
    // Solo va a detectar archivos PDF. Si le meto otro tipo de Archivos, no los va a detectar.
    // BUG: Esto me muestra paginas en blanco en lugar de PDFs.
    // const blob = new Blob([decodedContent], { type: 'application/pdf' });

    // // ESTO ES PARA VER ARCHIVOS .txt! CAMBIAR para ver archivos PDF DESPUES!
    // const blob = new Blob([decodedContent], { type: 'text/plain' });

    // This is for viewing PDF files. The MIME type is set to 'application/pdf'.
    const blob = new Blob([decodedContent], { type: 'application/pdf' });

    // Create a URL for the Blob
    const fileURL = URL.createObjectURL(blob);

    // // Open the URL in a new window
    // window.open(fileURL, '_blank');

    // Create a temporary anchor element and trigger the download
    const a = document.createElement('a');
    a.href = fileURL;
    // a.download = fileName; // Set the file name for the download
    document.body.appendChild(a); // Append the anchor to the body
    a.click(); // Trigger the download

    // Clean up by removing the temporary anchor element
    document.body.removeChild(a);

    // Release the allocated URL
    URL.revokeObjectURL(fileURL);

  } // Fin de la función para abrir archivos en Formato Base64


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
  * */
  // const handleSubmit = async (event) => {
  //   event.preventDefault();
  //
  //   // Si se Suben los Documentos correctamente
  //   try {
  //
  //     // Prepare the form data
  //     const formData = new FormData();
  //
  //     // Replace 'documentTypeName' with the actual document type name
  //     formData.append('document_type_name', documentTypeName);
  //
  //     // Meteré la ID del Gimnasio de manera hard-coded como "1" por los momentos.
  //     // CORREGIR DESPUES con la verdadera ID del Gimnasio seleccionado.
  //     formData.append('gym_id', "1");
  //
  //
  //
  //     // Esto mete los archivos del Formset en el FormData.
  //     // ACTIVAR DESPUES
  //     // Append each file under the 'documents' key
  //     for (let i = 0; i < files.length; i++) {
  //       formData.append('documents', files[i]);
  //     }
  //
  //     // for (let i = 0; i < files.length; i++) {
  //     //   formData.append(`file${i + 1}`, files[i]);
  //     // }
  //
  //     // // Esto imprime en la consola los datos del formulario. DEBUGGEO. BORRAR DESPUES.
  //     // console.log('Form data:', formData);
  //
  //     // Make the POST request to the Django API
  //     const response = await axios.post(`${process.env.NEXT_PUBLIC_API_ROOT}/api/upload_documents/`, formData, {
  //       headers: {
  //         'Content-Type': 'multipart/form-data'
  //       }
  //     });
  //
  //
  //     // Quiero mostrarle un mensaje flash de confirmación al usuario de que el email se envió correctamente.
  //     // Display a success toast message
  //     toast.success('Se han registrado correctamente los documentos.');
  //
  //
  //     // Voy a redirigir al usuario a la lista de clientes después de que se suban los documentos.
  //     // CORREGIR para redirigir al usuario a la página de "Documentos Subidos" después de que se suban los documentos.
  //     router.push('/dashboard');
  //
  //
  //   // Esto imprime un mensaje de error si no se pudo enviar el email
  //   } catch (error) {
  //
  //     // Display an error toast message
  //     toast.error('Error: No se pudieron enviar los documentos.');
  //
  //     // Dejaré el mensaje de error de debuggeo en el inspector para saber cual fue el error
  //     console.error('Error. No se pudieron registrar los documentos:', error);
  //   }
  // };  // Fin de la función handleSubmit que llama a la API para Subir los Documentos

  return (
      /* HTML del Formulario para Lista de Documentos.
      *
      * Para imprimir cada archivo individual en la tabla, usaré código muy similar al que usé para imprimir los
      * Tipos de Documentos en la página de "Lista de Documentos Sin Firmar" es decir, el de la URL de
      * /documents/unsigned-documents.
      *
      * Todos los datos de todos los archivos del documento seleccionado los metí en una variable "state" o permanente
      * llamada "documentFiles". Pues, mapeé, es decir, metí los archivos metidos en la variable / array de
      * documentFiles a la tabla usando la función map().
      *
      * Dado a que los archivos están "encriptados" en Base64, tengo que decodificarlos para poder verlos. Pues, para
      * poder verlos, creé una función arriba llamada "openBase64File" que decodifica los archivos en Base64 y los
      * abre en una nueva ventana del navegador. Así, cuando el usuario clickea en el enlace de "Ver Archivo", el
      * archivo se abre en una nueva ventana del navegador. PERO ESA FUNCION TIENE UNA VULNERABILIDAD DE SEGURIDAD.
      * ARREGLAR DESPUÉS.
      *
      * The selected snippet creates an anchor (`<a>`) element dynamically in the HTML document with its `href`
      * attribute set to a Base64 encoded PNG image. This image is the content of a QR code stored in the
      * `client.qr_code` variable. When a user clicks on this link, it opens the image in a new tab due to the
      * `target="_blank"` attribute. The `rel="noopener noreferrer"` attribute is used to enhance security and
      * performance when opening a link in a new tab.
      *
      * To modify this snippet to download a PDF file instead, you would change the MIME type in the `href` attribute
      * from `data:image/png;base64,` to `data:application/pdf;base64,` and ensure that `client.qr_code` contains the
      * Base64 encoded content of a PDF file. Additionally, you would set the `download` attribute on the anchor tag to
      * suggest a filename for the downloaded file.
      *
      * This modification prompts the browser to download the PDF file when the link is clicked, rather than opening it
      * in a new tab. The `download` attribute specifies the filename that the user's browser will use when saving the
      * file. Replace `"your_filename.pdf"` with the desired filename for the PDF.
      *
      * El archivo en sí, lo que neceita descargar el cliente, se alamcena en un campo llamado "base64", ya que
      * ahí está guardado el archivo "encriptado" en Base64. Entonces, si quiero acceder al archivo, debo usar la
      * notación "file.base64".
      *
      * Puse notacion {} y usé "file.name" al ponerle el nombre del archivo al ser descargado para que se pueda
      * poner el nombre de ese archivo en el PDF descargado (es decir, que diga "nombre_del_archivo.pdf" en lugar de
      * download.pdf).
      *
      * Después de pensármelo mejor, no quiero que el usuario descargue el PDF, sino que lo vea en el navegador
      * directamente. Así, el usuario podrá leer mucho más rápido cada unos de los archivos del documento.
      *
      * To ensure that the horizontal lines in the "Ver Archivo" column are at the same height as the rest of the fields
      * within the same row, you should place the "Ver Archivo" link inside a TableCell component. This will ensure
      * consistent styling and alignment across all cells in the row.
      * */
      <>
        {/* Título que saldrá en la Pestaña del Navegador */}
        <Head>
          <title>
            Lista de Archivos del Documento Seleccionado
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
                {/* Título de la Página. */}
                <Grid item>
                  <Typography variant="h4">
                    Lista de Archivos del Documento Seleccionado
                  </Typography>
                </Grid>

                {/*/!* Botón para ir a la página de "Subir Documentos" *!/*/}
                {/*<Grid item>*/}
                {/*  <NextLink href="/documents/upload-documents" passHref>*/}
                {/*    <Button component="a" variant="contained" color="primary">*/}
                {/*      Subir Documentos*/}
                {/*    </Button>*/}
                {/*  </NextLink>*/}
                {/*</Grid>*/}

              </Grid>
            </Box> {/* Fin del contenedor del título */}

            {/* Tabla con la Lista de Documentos */}
            <Table>
              {/* Títulos o Table Headers de la Tabla */}
              <TableHead>
                <TableRow>
                  <TableCell style={{ color: 'white' }}>ID</TableCell>
                  <TableCell style={{ color: 'white' }}>Nombre del Archivo</TableCell>

                  {/* Columna con enlace para Ver o Descargar el Documento */}
                  <TableCell style={{ color: 'white' }}>Ver Archivo</TableCell>

                  {/*/!* Columna con enlace para Firmar el Documento *!/*/}
                  {/*<TableCell style={{ color: 'white' }}>Firmar</TableCell>*/}
                </TableRow>
              </TableHead>

              {/* El "map" mete los datos de los Documentos cogidos, y los mete en la tabla */}
              {/* Cuerpo o "Table Descriptors" de la Tabla (Contenido de la Tabla en sí) */}
              <TableBody>
                {/*{documentTypes.map((docType) => (*/}
                {/*  <TableRow key={docType.id}>*/}
                {/*    <TableCell style={{ color: 'white' }}>{docType.id}</TableCell>*/}
                {/*    <TableCell style={{ color: 'white' }}>{docType.name}</TableCell>*/}

                {/*{memberDocuments.map((document) => (*/}
                {documentFiles.map((file) => (
                    <TableRow key={file.id}>

                      {/* ID del documento */}
                      <TableCell style={{color: 'white'}}>{file.id}</TableCell>

                      {/* Nombre del Documento */}
                      <TableCell style={{color: 'white'}}>{file.name}</TableCell>

                      {/* Enlace para Ver o Descargar el Archivo Individual. Recuerda poner el Table Cell para que toda
                      la línea horizontal esté a la misma altura que el resto de los campos en esta fila. */}
                      <TableCell style={{ color: 'white' }}>
                        <a href={`data:application/pdf;base64,${file.base64}`} target="_blank"
                           rel="noopener noreferrer">
                          Ver Archivo
                        </a>
                      </TableCell>

                      {/*<a href={`data:application/pdf;base64,${file.base64}`} download={`${file.name}`}*/}
                      {/*   rel="noopener noreferrer">*/}
                      {/*  Ver Archivo*/}
                      {/*</a>*/}


                      {/*<a href="#" onClick={() => openBase64File(file.base64)} rel="noopener noreferrer">*/}
                      {/*  Ver Archivo*/}
                      {/*</a>*/}

                      {/*<TableCell style={{ color: 'white' }}>Ver Archivo</TableCell>*/}

                      {/*<TableCell style={{ color: 'white' }}>*/}
                      {/*  <a href={file.base64} target="_blank" rel="noopener noreferrer">*/}
                      {/*    Ver Archivo*/}
                      {/*  </a>*/}
                      {/*</TableCell>*/}

                      {/*<TableCell style={{ color: 'white' }}>*/}
                      {/*  <a href={file.document_file} target="_blank" rel="noopener noreferrer">*/}
                      {/*    Ver Archivo*/}
                      {/*  </a>*/}
                      {/*</TableCell>*/}


                      {/*/!* Botón para enviar el documento seleccionado a un cliente *!/*/}
                      {/*<TableCell style={{ color: 'white' }}>*/}
                      {/*  /!*<NextLink href={`/documents/send-to-client/${docType.id}`} passHref>*!/*/}
                      {/*    <Button variant="contained" color="primary">*/}
                      {/*      Firmar*/}
                      {/*    </Button>*/}
                      {/*  /!*</NextLink>*!/*/}
                      {/*</TableCell>*/}
                    </TableRow>
                ))}
              </TableBody>
            </Table>


          </Container> {/* Fin del contenedor tipo "Container" */}
        </Box> {/* Fin del contenedor tipo "Card" */}
      </>


  );
};

/* Esto me agrega la Disposición con el Navbar (tanto el de arriba como el de la izquierda) a esta página.
*
* Y, al parecer, solo puedes verlo si estás autenticado / logueado.
*
* */
Index.getLayout = (page) => (
  <AuthGuard>
    <DashboardLayout>
      {page}
    </DashboardLayout>
  </AuthGuard>
);

export default Index; // Esto termina de renderizar esta página usando React