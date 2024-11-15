import NextLink from 'next/link';
import Router from "next/router";
import PropTypes from 'prop-types';
import toast from 'react-hot-toast';
import * as Yup from 'yup';
import { useFormik } from 'formik';
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
import { wait } from '../../utils/wait';
import { roomApi } from '../../api/room-api';
// TODO: estos valores deberían estar en el store(Copiar la lógica de create form)

export const RoomEditForm = (props) => {
  const { room, ...other } = props;
  const formik = useFormik({
    initialValues: {
      name: room.name || "",
      submit: null,
    },
    validationSchema: Yup.object({
      name: Yup.string().min(5).required(),
    }),
    onSubmit: async (values, helpers) => {
      try {
        // NOTE: Make API request
        await roomApi.updateRoom(room.id, {gym: room.gym, name: values.name})
        helpers.setStatus({ success: true });
        helpers.setSubmitting(false);
        toast.success('Sala modificada!');
        Router.push('/rooms').catch(console.error);
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
        await roomApi.deleteRoom(room.id)
        toast.success('Sala borrada con éxito!');
        Router.push('/rooms').catch(console.error);
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
                label="Nombre de la sala"
                name="name"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.name}
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
            href={`/rooms/${room.id}`}
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
            onClick={handleDelete}
          >
            Borrar sala
          </Button>
        </CardActions>
      </Card>
    </form>
  );
};

RoomEditForm.propTypes = {
  room: PropTypes.object.isRequired
};
