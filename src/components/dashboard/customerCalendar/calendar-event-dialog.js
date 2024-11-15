import { useMemo } from 'react';
import PropTypes from 'prop-types';
import toast from 'react-hot-toast';
import { addMinutes } from 'date-fns';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  Divider,
  FormControlLabel,
  FormHelperText,
  IconButton,
  Switch,
  TextField,
  Typography
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';
import { Trash as TrashIcon } from '../../../icons/trash';
import { useDispatch } from '../../../store';
import { getCustomerEvents, createEvent, deleteEvent, updateEvent, createRecurrentEvent } from '../../../thunks/calendar';
import { useAuth } from '../../../hooks/use-auth';
import { calendarApi } from '../../../api/calendar-api';

export const CalendarEventDialog = (props) => {
  const { event, onAddComplete, onClose, onDeleteComplete, onEditComplete, open, range } = props;
  const dispatch = useDispatch();
  const auth = useAuth()
  const {user} = auth
  const initialValues = useMemo(() => {
    if (event) {
      return {
        allDay: event.allDay || false,
        recurrent: event.recurrent || false,
        color: event.color || '',
        description: event.description || '',
        end: event.end ? new Date(event.end) : addMinutes(new Date(), 30),
        start: event.start ? new Date(event.start) : new Date(),
        title: event.title || '',
        submit: null
      };
    }

    if (range) {
      return {
        allDay: false,
        recurrent: false,
        color: '',
        description: '',
        end: new Date(range.end),
        start: new Date(range.start),
        title: '',
        submit: null
      };
    }

    return {
      allDay: false,
      recurrent: false,
      color: '',
      description: '',
      end: addMinutes(new Date(), 30),
      start: new Date(),
      title: '',
      submit: null
    };
  }, [event, range]);
  const formik = useFormik({
    enableReinitialize: true,
    initialValues,
    validationSchema: Yup.object({
      allDay: Yup.bool(),
      recurrent: Yup.bool(),
      description: Yup.string().max(5000),
      end: Yup.date(),
      start: Yup.date(),
      title: Yup
        .string()
        .max(255)
        .required('Title is required')
    }),
    onSubmit: async (values, helpers) => {
      try {
        const data = {
          allDay: values.allDay,
          description: values.description,
          days: values.weeklyRecurrence,
          end: values.end.getTime(),
          start: values.start.getTime(),
          title: values.title
        }


        if (event) {

          await calendarApi.addCustomersToEvent({
            eventId: event.id,
            customers: [user.id]
          });
          dispatch(getCustomerEvents())
          toast.success('¡Te has apuntado a la clase!');
        } else { if (values.recurrent) {
          await dispatch(createRecurrentEvent(data))
          dispatch(getCustomerEvents())
          toast.success('Clase periodica creada en la agenda!');
        } else {
          await dispatch(createEvent(data));
          toast.success('Clase creada en la agenda!');
          }
        }

        if (!event && onAddComplete) {
          onAddComplete();
        }

        if (event && onEditComplete) {
          onEditComplete();
        }
      } catch (err) {
        console.error(err);
        toast.error('Something went wrong!');
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.message });
        helpers.setSubmitting(false);
      }
    }
  });

  const handleStartDateChange = (date) => {
    formik.setFieldValue('start', date);

    // Prevent end date to be before start date
    if (formik.values.end && date && date > formik.values.end) {
      formik.setFieldValue('end', date);
    }
  };

  const handleEndDateChange = (date) => {
    formik.setFieldValue('end', date);

    // Prevent start date to be after end date
    if (formik.values.start && date && date < formik.values.start) {
      formik.setFieldValue('start', date);
    }
  };

  const handleDelete = async () => {
    try {
      if (!event) {
        return;
      }
      await calendarApi.removeCustomersFromEvent({
        eventId: event.id,
        customers: [user.id]
      });
      dispatch(getCustomerEvents())
      toast.success('Te has desapuntado correctamente de la clase');
      onDeleteComplete?.();
      dispatch(getCustomerEvents())
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      onClose={onClose}
      open={!!open}
    >
      <form onSubmit={formik.handleSubmit}>
        <Box sx={{ p: 3 }}>
          <Typography
            align="center"
            gutterBottom
            variant="h5"
          >
            {event
              ? event.title
              : 'Add Event'}
          </Typography>
        </Box>
        <Box sx={{ p: 3 }}>
          <TextField
            error={Boolean(formik.touched.title && formik.errors.title)}
            fullWidth
            helperText={formik.touched.title && formik.errors.title}
            label="Title"
            name="title"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.title}
            disabled={true}
          />
          <Box sx={{ mt: 2 }}>
            <TextField
              error={Boolean(formik.touched.description && formik.errors.description)}
              fullWidth
              helperText={formik.touched.description && formik.errors.description}
              label="Description"
              name="description"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.description}
              disabled={true }
            />
          </Box>
          <Box sx={{ mt: 2 }}>
            <FormControlLabel
              control={(
                <Switch
                  checked={formik.values.allDay}
                  name="allDay"
                  onChange={formik.handleChange}
                  disabled={true }
                />
              )}
              label="All day"
            />
          </Box>
          <Box sx={{ mt: 2 }}>
            <FormControlLabel
              control={(
                <Switch
                  checked={formik.values.recurrent}
                  name="recurrent"
                  onChange={formik.handleChange}
                  disabled={true }
                />
              )}
              label="Periodico"
            />
          </Box>
          {formik.values.recurrent && (
            <Box sx={{ mt: 2 }}>
              <FormControlLabel
              control={(
            <Checkbox
              checked={formik.values.weeklyRecurrence?.includes('Lunes')}
              onChange={formik.handleChange}
              name="weeklyRecurrence"
              value={1}
              />
              )}
              label="Lun"
            />
              <FormControlLabel
              control={(
            <Checkbox
              checked={formik.values.weeklyRecurrence?.includes('Martes')}
              onChange={formik.handleChange}
              name="weeklyRecurrence"
              value={2}
              />
              )}
              label="Mar"
            />
              <FormControlLabel
              control={(
            <Checkbox
              checked={formik.values.weeklyRecurrence?.includes('Miercoles')}
              onChange={formik.handleChange}
              name="weeklyRecurrence"
              value="3"
              />
              )}
              label="Mie"
            />
              <FormControlLabel
              control={(
            <Checkbox
              checked={formik.values.weeklyRecurrence?.includes('Jueves')}
              onChange={formik.handleChange}
              name="weeklyRecurrence"
              value="4"
              />
              )}
              label="Jue"
            />
              <FormControlLabel
              control={(
            <Checkbox
              checked={formik.values.weeklyRecurrence?.includes('Viernes')}
              onChange={formik.handleChange}
              name="weeklyRecurrence"
              value="5"
              />
              )}
              label="Vie"
            />
              <FormControlLabel
              control={(
            <Checkbox
              checked={formik.values.weeklyRecurrence?.includes('Sabado')}
              onChange={formik.handleChange}
              name="weeklyRecurrence"
              value="6"
              />
              )}
              label="Sab"
            />
              <FormControlLabel
              control={(
            <Checkbox
              checked={formik.values.weeklyRecurrence?.includes('Domingo')}
              onChange={formik.handleChange}
              name="weeklyRecurrence"
              value="7"
              />
              )}
              label="Dom"
            />
          </Box>
          )}
          <Box sx={{ mt: 2 }}>
            <DateTimePicker
              label="Start date"
              onChange={handleStartDateChange}
              renderInput={(inputProps) => (
                <TextField
                  fullWidth
                  {...inputProps} />
              )}
              value={formik.values.start}
              disabled={true }
            />
          </Box>
          <Box sx={{ mt: 2 }}>
            <DateTimePicker
              label="End date"
              onChange={handleEndDateChange}
              renderInput={(inputProps) => (
                <TextField
                  fullWidth
                  {...inputProps} />
              )}
              value={formik.values.end}
              disabled={true }
            />
          </Box>
          {Boolean(formik.touched.end && formik.errors.end) && (
            <Box sx={{ mt: 2 }}>
              <FormHelperText error>
                {formik.errors.end}
              </FormHelperText>
            </Box>
          )}
        </Box>
        <Divider />
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            p: 2
          }}
        >
          {event?.participants?.includes(user.id) && (
            <Button sx={{ color: 'red' }} onClick={() => handleDelete()}>
            Desapuntarse
          </Button>

          )}
          <Box sx={{ flexGrow: 1 }} />
          <Button onClick={onClose}>
            Cancelar
          </Button>
          {!event?.participants?.includes(user.id) && (
          <Button
            disabled={formik.isSubmitting}
            sx={{ ml: 1 }}
            type="submit"
            variant="contained"
          >
            Apuntarse
          </Button>
        )}
        </Box>
      </form>
    </Dialog>
  );
};

CalendarEventDialog.propTypes = {
  event: PropTypes.object,
  onAddComplete: PropTypes.func,
  onClose: PropTypes.func,
  onDeleteComplete: PropTypes.func,
  onEditComplete: PropTypes.func,
  open: PropTypes.bool,
  range: PropTypes.object
};