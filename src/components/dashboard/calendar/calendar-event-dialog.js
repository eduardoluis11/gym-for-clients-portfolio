import { useMemo } from 'react';
import PropTypes from 'prop-types';
import toast from 'react-hot-toast';
import { addMinutes, setHours, setMinutes } from 'date-fns';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  Autocomplete,
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
import { ColorPicker } from 'material-ui-color';
import { DateTimePicker } from '@mui/x-date-pickers';
import { Trash as TrashIcon } from '../../../icons/trash';
import { useDispatch, useSelector } from '../../../store';
import { getTrainers, getActivitys, getRooms } from '../../../slices/gym';
import { useEffect } from "react";
import { getEvents, createEvent, deleteEvent, updateEvent, createRecurrentEvent, updateRecurrentEvent, deleteRecurrentEvent } from '../../../thunks/calendar';

/* Commit del 9/6/2024.
*
* */

export const CalendarEventDialog = (props) => {
  const { event, onAddComplete, onClose, onDeleteComplete, onEditComplete, open, range } = props;
  const dispatch = useDispatch();
  const router = useRouter();

  const {trainers, activities, rooms} = useSelector((state) => state.gym);

  // const {activities} = useSelector((state) => state.gym);

  useEffect(() => {
    dispatch(getActivitys())
  },[dispatch])

  useEffect(() => {
    dispatch(getTrainers())
  },[dispatch])

  useEffect(() => {
    dispatch(getRooms())
  },[dispatch])


  const initialValues = useMemo(() => {
    if (event) {
      return {
        allDay: event.allDay || false,
        recurrent: Boolean(event.recurring_id) || false,
        color: event.color || '',
        description: event.description || '',
        end: event.end ? new Date(event.end) : addMinutes(new Date(), 30),
        start: event.start ? new Date(event.start) : new Date(),
        title: event.title || '',
        room:  event.room.id || null,
        teachers: trainers.find((trainer) => trainer.id == event.trainer || null),
        activity: activities.find((activity) => activity.id == event.activity || null),
        room: rooms.find((room) => room.id == event.room || null),
        submit: null
      };
    }

    if (range) {
      return {
        allDay: false,
        recurrent: false,
        color: '#03a9f4',
        description: '',
        start: setMinutes(setHours(new Date(), 11), 0),
        end: setMinutes(setHours(new Date(), 11), 30),
        title: '',
        teachers: null,
        activity: null,
        room: null,
        submit: null
      };
    }

    return {
      allDay: false,
      recurrent: false,
      color: '#03a9f4',
      description: '',
      start: setMinutes(setHours(new Date(), 11), 0),
      end: setMinutes(setHours(new Date(), 11), 30),
      title: '',
      teachers: null,
      activity: null,
      room: null,
      submit: null,
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
        .required('Se requiere un título'),
      teachers: Yup.object().required('Se requiere un entrenador.'),
      activity: Yup.object().required('Se requiere una actividad.'),
      room: Yup.object().required('Se requiere una sala.')
    }),
    onSubmit: async (values, helpers) => {
      try {

        const isoStartDate = new Date(values.start).toISOString();
        const isoEndDate = new Date(values.end).toISOString();

        const data = {
          color: values.color,
          title: values.title,
          description: values.description,
          start_date: isoStartDate,
          end_date: isoEndDate,
          gym: 1,
          weekdays: values.weeklyRecurrence ? values.weeklyRecurrence.map(num => Number(num)) : [],
          trainer: values.teachers.id,
          activity: values.activity.id,
          room: values.room.id,
          recurring_id: values.recurrent ? event?.recurring_id : false
        };


        if (event) {
          if (event && event.recurring_id && formik.values.recurrent) {
            console.log(data)
            await dispatch(updateRecurrentEvent({
              eventId: event.id,
              update: data
            }));
            dispatch(getEvents())
            toast.success('¡Todas las clase modificadas!');
          } else {
            await dispatch(updateEvent({
              eventId: event.id,
              update: data
            }));
            console.log(event.recurring_id)
            dispatch(getEvents())
            toast.success('¡Clase modificada!');
          }
        } else { if (values.recurrent) {
          await dispatch(createRecurrentEvent(data))
          dispatch(getEvents())
          toast.success('Clase periodica creada en la agenda!');
        } else {
          await dispatch(createEvent(data));
          dispatch(getEvents())
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
        toast.error('El evento no ha podido crearse con éxito');
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
      if (formik.values.recurrent) {
        await dispatch(deleteRecurrentEvent({
          recurring_id: event.recurring_id
        }));
        onDeleteComplete?.();
        dispatch(getEvents())
        toast.success('¡Clases eliminadas con éxito!');
      } else {
      await dispatch(deleteEvent({
        eventId: event.id
      }));
      onDeleteComplete?.();
      dispatch(getEvents())
      toast.success('¡Clase eliminada con éxito!');
    }
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
        <ColorPicker
          id="color"
          defaultValue="#03a9f4"
          onChange={(value) => formik.setFieldValue("color", `#${value.hex}`)}
          value={formik.values.color}
          aria-describedby="color-error-text"
          name="color"
          hideTextfield/>
          <Typography
            align="center"
            gutterBottom
            variant="h5"
          >
            {event
              ? 'Modífica clase'
              : 'Añade clase'}
          </Typography>
        </Box>
        <Box sx={{ p: 3 }}>
          <TextField
            error={Boolean(formik.touched.title && formik.errors.title)}
            fullWidth
            helperText={formik.touched.title && formik.errors.title}
            label="Título"
            name="title"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.title}
          />
              <Box sx={{ mt: 4 }}>
              <Autocomplete
                id="activity"
                options={activities}
                getOptionLabel= {(option) => option.name}
                fullWidth
                label="Actividades"
                name="activity"
                onBlur={formik.handleBlur}
                onChange={(e, value) =>{
                  formik.setFieldValue("activity", value)
                }}
                value={formik.values.activity}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="standard"
                    error={Boolean(formik.touched.activity && formik.errors.activity)}
                    label="Actividades"
                    placeholder="Añadir"
                  />
                  )}
              >
              </Autocomplete>
              </Box>
              <Box sx={{ mt: 4 }}>
              <Autocomplete
                id="teachers"
                options={trainers}
                getOptionLabel= {(option) => option.first_name}
                fullWidth
                label="Entrenadores"
                name="teachers"
                onBlur={formik.handleBlur}
                onChange={(e, value) =>{
                  formik.setFieldValue("teachers", value)
                }}
                value={formik.values.teachers}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="standard"
                    error={Boolean(formik.touched.teachers && formik.errors.teachers)}
                    label="Entrenadores"
                    placeholder="Añadir"
                  />
                  )}
              >
              </Autocomplete>
              </Box>
              <Box sx={{ mt: 4 }}>
              <Autocomplete
                id="room"
                options={rooms}
                getOptionLabel= {(option) => option.name}
                fullWidth
                label="Salas"
                name="room"
                onBlur={formik.handleBlur}
                onChange={(e, value) =>{
                  formik.setFieldValue("room", value)
                }}
                value={formik.values.room}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="standard"
                    error={Boolean(formik.touched.room && formik.errors.room)}
                    label="Salas"
                    placeholder="Añadir"
                  />
                  )}
              >
              </Autocomplete>
              </Box>
          <Box sx={{ mt: 2 }}>
            <TextField
              error={Boolean(formik.touched.description && formik.errors.description)}
              fullWidth
              helperText={formik.touched.description && formik.errors.description}
              label="Descripción"
              name="description"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.description}
            />
          </Box>
          <Box sx={{ mt: 2 }}>
            <FormControlLabel
              control={(
                <Switch
                  checked={formik.values.allDay}
                  name="allDay"
                  onChange={formik.handleChange}
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
                />
              )}
              label={event && formik.values.recurrent
                ? "Modifica todos los eventos"
                : "Periódico"}
                />
          {(event && !formik.values.recurrent && event.recurring_id) && (
            <Typography variant="body2" color="green" sx={{ mt: 1 }}>
              Solo modificarás este evento
            </Typography>
          )}
          {event && formik.values.recurrent && (
            <Typography variant="body2" color="error" sx={{ mt: 1 }}>
              Atención revisa la periodicidad! Modificarás todos los eventos
            </Typography>
          )}
          </Box>
          {formik.values.recurrent && (
            <Box sx={{ mt: 2 }}>
              <FormControlLabel
              control={(
            <Checkbox
              checked={formik.values.weeklyRecurrence?.includes('Lunes')}
              onChange={formik.handleChange}
              name="weeklyRecurrence"
              value={0}
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
              value={1}
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
              value={2}
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
              value={3}
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
              value={4}
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
              value={5}
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
              value={6}
              />
              )}
              label="Dom"
            />
          </Box>
          )}
          <Box sx={{ mt: 2 }}>
            <DateTimePicker
              label="Inicio"
              onChange={handleStartDateChange}
              renderInput={(inputProps) => (
                <TextField
                  fullWidth
                  {...inputProps} />
              )}
              value={formik.values.start}
            />
          </Box>
          <Box sx={{ mt: 2 }}>
            <DateTimePicker
              label="Fin"
              onChange={handleEndDateChange}
              renderInput={(inputProps) => (
                <TextField
                  fullWidth
                  {...inputProps} />
              )}
              value={formik.values.end}
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
          {event && (
            <IconButton onClick={() => handleDelete()}>
              <TrashIcon fontSize="small" />
            </IconButton>
          )}
          <Box sx={{ flexGrow: 1 }} />
          <Button onClick={onClose}>
            Cancelar
          </Button>
          {event && (
            <Link href={`${router.pathname}/${event.id}`}>
            <Button onClick={onClose}>
              Gestión clientes
            </Button>
          </Link>
          )}
          <Button
            disabled={formik.isSubmitting}
            sx={{ ml: 1 }}
            type="submit"
            variant="contained"
          >
            Confirmar
          </Button>
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


// import { useMemo } from 'react';
// import PropTypes from 'prop-types';
// import toast from 'react-hot-toast';
// import { addMinutes, setHours, setMinutes } from 'date-fns';
// import * as Yup from 'yup';
// import { useFormik } from 'formik';
// import Link from 'next/link';
// import { useRouter } from 'next/router';
// import {
//   Autocomplete,
//   Box,
//   Button,
//   Checkbox,
//   Dialog,
//   Divider,
//   FormControlLabel,
//   FormHelperText,
//   IconButton,
//   Switch,
//   TextField,
//   Typography
// } from '@mui/material';
// import { ColorPicker } from 'material-ui-color';
// import { DateTimePicker } from '@mui/x-date-pickers';
// import { Trash as TrashIcon } from '../../../icons/trash';
// import { useDispatch, useSelector } from '../../../store';
// import { getTrainers, getActivitys, getRooms } from '../../../slices/gym';
// import { useEffect } from "react";
// import { getEvents, createEvent, deleteEvent, updateEvent, createRecurrentEvent, updateRecurrentEvent, deleteRecurrentEvent } from '../../../thunks/calendar';
//
// export const CalendarEventDialog = (props) => {
//   const { event, onAddComplete, onClose, onDeleteComplete, onEditComplete, open, range } = props;
//   const dispatch = useDispatch();
//   const router = useRouter();
//
//   const {trainers, activities, rooms} = useSelector((state) => state.gym);
//
//   // const {activities} = useSelector((state) => state.gym);
//
//   useEffect(() => {
//     dispatch(getActivitys())
//   },[dispatch])
//
//   useEffect(() => {
//     dispatch(getTrainers())
//   },[dispatch])
//
//   useEffect(() => {
//     dispatch(getRooms())
//   },[dispatch])
//
//
//   const initialValues = useMemo(() => {
//     if (event) {
//       return {
//         allDay: event.allDay || false,
//         recurrent: Boolean(event.recurring_id) || false,
//         color: event.color || '',
//         description: event.description || '',
//         end: event.end ? new Date(event.end) : addMinutes(new Date(), 30),
//         start: event.start ? new Date(event.start) : new Date(),
//         title: event.title || '',
//         // room:  event.room.id || null,
//         room: event ? rooms.find((room) => room.id == event.room) : null,
//         teachers: trainers.find((trainer) => trainer.id == event.trainer || null),
//         activity: activities.find((activity) => activity.id == event.activity || null),
//         // room: rooms.find((room) => room.id == event.room || null),
//         submit: null
//       };
//     }
//
//     if (range) {
//       return {
//         allDay: false,
//         recurrent: false,
//         color: '#03a9f4',
//         description: '',
//         start: setMinutes(setHours(new Date(), 11), 0),
//         end: setMinutes(setHours(new Date(), 11), 30),
//         title: '',
//         teachers: null,
//         activity: null,
//         room: null,
//         submit: null
//       };
//     }
//
//     return {
//       allDay: false,
//       recurrent: false,
//       color: '#03a9f4',
//       description: '',
//       start: setMinutes(setHours(new Date(), 11), 0),
//       end: setMinutes(setHours(new Date(), 11), 30),
//       title: '',
//       teachers: null,
//       activity: null,
//       room: null,
//       submit: null,
//     };
//   }, [event, range]);
//   const formik = useFormik({
//     enableReinitialize: true,
//     initialValues,
//     validationSchema: Yup.object({
//       allDay: Yup.bool(),
//       recurrent: Yup.bool(),
//       description: Yup.string().max(5000),
//       end: Yup.date(),
//       start: Yup.date(),
//       title: Yup
//         .string()
//         .max(255)
//         .required('Se requiere un título'),
//       teachers: Yup.object().required('Se requiere un entrenador.'),
//       activity: Yup.object().required('Se requiere una actividad.'),
//       room: Yup.object().required('Se requiere una sala.')
//     }),
//     onSubmit: async (values, helpers) => {
//       try {
//
//         const isoStartDate = new Date(values.start).toISOString();
//         const isoEndDate = new Date(values.end).toISOString();
//
//         const data = {
//           color: values.color,
//           title: values.title,
//           description: values.description,
//           start_date: isoStartDate,
//           end_date: isoEndDate,
//           gym: 1,
//           weekdays: values.weeklyRecurrence ? values.weeklyRecurrence.map(num => Number(num)) : [],
//           trainer: values.teachers.id,
//           activity: values.activity.id,
//           room: values.room.id,
//           recurring_id: values.recurrent ? event?.recurring_id : false
//         };
//
//
//         if (event) {
//           if (event && event.recurring_id && formik.values.recurrent) {
//             console.log(data)
//             await dispatch(updateRecurrentEvent({
//               eventId: event.id,
//               update: data
//             }));
//             dispatch(getEvents())
//             toast.success('¡Todas las clase modificadas!');
//           } else {
//             await dispatch(updateEvent({
//               eventId: event.id,
//               update: data
//             }));
//             console.log(event.recurring_id)
//             dispatch(getEvents())
//             toast.success('¡Clase modificada!');
//           }
//         } else { if (values.recurrent) {
//           await dispatch(createRecurrentEvent(data))
//           dispatch(getEvents())
//           toast.success('Clase periodica creada en la agenda!');
//         } else {
//           await dispatch(createEvent(data));
//           dispatch(getEvents())
//           toast.success('Clase creada en la agenda!');
//           }
//         }
//
//         if (!event && onAddComplete) {
//           onAddComplete();
//         }
//
//         if (event && onEditComplete) {
//           onEditComplete();
//         }
//       } catch (err) {
//         console.error(err);
//         toast.error('El evento no ha podido crearse con éxito');
//         helpers.setStatus({ success: false });
//         helpers.setErrors({ submit: err.message });
//         helpers.setSubmitting(false);
//       }
//     }
//   });
//
//   const handleStartDateChange = (date) => {
//     formik.setFieldValue('start', date);
//
//     // Prevent end date to be before start date
//     if (formik.values.end && date && date > formik.values.end) {
//       formik.setFieldValue('end', date);
//     }
//   };
//
//   const handleEndDateChange = (date) => {
//     formik.setFieldValue('end', date);
//
//     // Prevent start date to be after end date
//     if (formik.values.start && date && date < formik.values.start) {
//       formik.setFieldValue('start', date);
//     }
//   };
//
//   const handleDelete = async () => {
//     try {
//       if (!event) {
//         return;
//       }
//       if (formik.values.recurrent) {
//         await dispatch(deleteRecurrentEvent({
//           recurring_id: event.recurring_id
//         }));
//         onDeleteComplete?.();
//         dispatch(getEvents())
//         toast.success('¡Clases eliminadas con éxito!');
//       } else {
//       await dispatch(deleteEvent({
//         eventId: event.id
//       }));
//       onDeleteComplete?.();
//       dispatch(getEvents())
//       toast.success('¡Clase eliminada con éxito!');
//     }
//     } catch (err) {
//       console.error(err);
//     }
//   };
//
//   return (
//     <Dialog
//       fullWidth
//       maxWidth="sm"
//       onClose={onClose}
//       open={!!open}
//     >
//       <form onSubmit={formik.handleSubmit}>
//         <Box sx={{ p: 3 }}>
//         <ColorPicker
//           id="color"
//           defaultValue="#03a9f4"
//           onChange={(value) => formik.setFieldValue("color", `#${value.hex}`)}
//           value={formik.values.color}
//           aria-describedby="color-error-text"
//           name="color"
//           hideTextfield/>
//           <Typography
//             align="center"
//             gutterBottom
//             variant="h5"
//           >
//             {event
//               ? 'Modífica clase'
//               : 'Añade clase'}
//           </Typography>
//         </Box>
//         <Box sx={{ p: 3 }}>
//           <TextField
//             error={Boolean(formik.touched.title && formik.errors.title)}
//             fullWidth
//             helperText={formik.touched.title && formik.errors.title}
//             label="Título"
//             name="title"
//             onBlur={formik.handleBlur}
//             onChange={formik.handleChange}
//             value={formik.values.title}
//           />
//               <Box sx={{ mt: 4 }}>
//               <Autocomplete
//                 id="activity"
//                 options={activities}
//                 getOptionLabel= {(option) => option.name}
//                 fullWidth
//                 label="Actividades"
//                 name="activity"
//                 onBlur={formik.handleBlur}
//                 onChange={(e, value) =>{
//                   formik.setFieldValue("activity", value)
//                 }}
//                 value={formik.values.activity}
//                 isOptionEqualToValue={(option, value) => option.id === value.id}
//                 renderInput={(params) => (
//                   <TextField
//                     {...params}
//                     variant="standard"
//                     error={Boolean(formik.touched.activity && formik.errors.activity)}
//                     label="Actividades"
//                     placeholder="Añadir"
//                   />
//                   )}
//               >
//               </Autocomplete>
//               </Box>
//               <Box sx={{ mt: 4 }}>
//               <Autocomplete
//                 id="teachers"
//                 options={trainers}
//                 getOptionLabel= {(option) => option.first_name}
//                 fullWidth
//                 label="Entrenadores"
//                 name="teachers"
//                 onBlur={formik.handleBlur}
//                 onChange={(e, value) =>{
//                   formik.setFieldValue("teachers", value)
//                 }}
//                 value={formik.values.teachers}
//                 isOptionEqualToValue={(option, value) => option.id === value.id}
//                 renderInput={(params) => (
//                   <TextField
//                     {...params}
//                     variant="standard"
//                     error={Boolean(formik.touched.teachers && formik.errors.teachers)}
//                     label="Entrenadores"
//                     placeholder="Añadir"
//                   />
//                   )}
//               >
//               </Autocomplete>
//               </Box>
//               <Box sx={{ mt: 4 }}>
//               <Autocomplete
//                 id="room"
//                 options={rooms}
//                 getOptionLabel= {(option) => option.name}
//                 fullWidth
//                 label="Salas"
//                 name="room"
//                 onBlur={formik.handleBlur}
//                 onChange={(e, value) =>{
//                   formik.setFieldValue("room", value)
//                 }}
//                 value={formik.values.room}
//                 isOptionEqualToValue={(option, value) => option.id === value.id}
//                 renderInput={(params) => (
//                   <TextField
//                     {...params}
//                     variant="standard"
//                     error={Boolean(formik.touched.room && formik.errors.room)}
//                     label="Salas"
//                     placeholder="Añadir"
//                   />
//                   )}
//               >
//               </Autocomplete>
//               </Box>
//           <Box sx={{ mt: 2 }}>
//             <TextField
//               error={Boolean(formik.touched.description && formik.errors.description)}
//               fullWidth
//               helperText={formik.touched.description && formik.errors.description}
//               label="Descripción"
//               name="description"
//               onBlur={formik.handleBlur}
//               onChange={formik.handleChange}
//               value={formik.values.description}
//             />
//           </Box>
//           <Box sx={{ mt: 2 }}>
//             <FormControlLabel
//               control={(
//                 <Switch
//                   checked={formik.values.allDay}
//                   name="allDay"
//                   onChange={formik.handleChange}
//                 />
//               )}
//               label="All day"
//             />
//           </Box>
//           <Box sx={{ mt: 2 }}>
//             <FormControlLabel
//               control={(
//                 <Switch
//                   checked={formik.values.recurrent}
//                   name="recurrent"
//                   onChange={formik.handleChange}
//                 />
//               )}
//               label={event && formik.values.recurrent
//                 ? "Modifica todos los eventos"
//                 : "Periódico"}
//                 />
//           {(event && !formik.values.recurrent && event.recurring_id) && (
//             <Typography variant="body2" color="green" sx={{ mt: 1 }}>
//               Solo modificarás este evento
//             </Typography>
//           )}
//           {event && formik.values.recurrent && (
//             <Typography variant="body2" color="error" sx={{ mt: 1 }}>
//               Atención revisa la periodicidad! Modificarás todos los eventos
//             </Typography>
//           )}
//           </Box>
//           {formik.values.recurrent && (
//             <Box sx={{ mt: 2 }}>
//               <FormControlLabel
//               control={(
//             <Checkbox
//               checked={formik.values.weeklyRecurrence?.includes('Lunes')}
//               onChange={formik.handleChange}
//               name="weeklyRecurrence"
//               value={0}
//               />
//               )}
//               label="Lun"
//             />
//               <FormControlLabel
//               control={(
//             <Checkbox
//               checked={formik.values.weeklyRecurrence?.includes('Martes')}
//               onChange={formik.handleChange}
//               name="weeklyRecurrence"
//               value={1}
//               />
//               )}
//               label="Mar"
//             />
//               <FormControlLabel
//               control={(
//             <Checkbox
//               checked={formik.values.weeklyRecurrence?.includes('Miercoles')}
//               onChange={formik.handleChange}
//               name="weeklyRecurrence"
//               value={2}
//               />
//               )}
//               label="Mie"
//             />
//               <FormControlLabel
//               control={(
//             <Checkbox
//               checked={formik.values.weeklyRecurrence?.includes('Jueves')}
//               onChange={formik.handleChange}
//               name="weeklyRecurrence"
//               value={3}
//               />
//               )}
//               label="Jue"
//             />
//               <FormControlLabel
//               control={(
//             <Checkbox
//               checked={formik.values.weeklyRecurrence?.includes('Viernes')}
//               onChange={formik.handleChange}
//               name="weeklyRecurrence"
//               value={4}
//               />
//               )}
//               label="Vie"
//             />
//               <FormControlLabel
//               control={(
//             <Checkbox
//               checked={formik.values.weeklyRecurrence?.includes('Sabado')}
//               onChange={formik.handleChange}
//               name="weeklyRecurrence"
//               value={5}
//               />
//               )}
//               label="Sab"
//             />
//               <FormControlLabel
//               control={(
//             <Checkbox
//               checked={formik.values.weeklyRecurrence?.includes('Domingo')}
//               onChange={formik.handleChange}
//               name="weeklyRecurrence"
//               value={6}
//               />
//               )}
//               label="Dom"
//             />
//           </Box>
//           )}
//           <Box sx={{ mt: 2 }}>
//             <DateTimePicker
//               label="Inicio"
//               onChange={handleStartDateChange}
//               renderInput={(inputProps) => (
//                 <TextField
//                   fullWidth
//                   {...inputProps} />
//               )}
//               value={formik.values.start}
//             />
//           </Box>
//           <Box sx={{ mt: 2 }}>
//             <DateTimePicker
//               label="Fin"
//               onChange={handleEndDateChange}
//               renderInput={(inputProps) => (
//                 <TextField
//                   fullWidth
//                   {...inputProps} />
//               )}
//               value={formik.values.end}
//             />
//           </Box>
//           {Boolean(formik.touched.end && formik.errors.end) && (
//             <Box sx={{ mt: 2 }}>
//               <FormHelperText error>
//                 {formik.errors.end}
//               </FormHelperText>
//             </Box>
//           )}
//         </Box>
//         <Divider />
//         <Box
//           sx={{
//             alignItems: 'center',
//             display: 'flex',
//             p: 2
//           }}
//         >
//           {event && (
//             <IconButton onClick={() => handleDelete()}>
//               <TrashIcon fontSize="small" />
//             </IconButton>
//           )}
//           <Box sx={{ flexGrow: 1 }} />
//           <Button onClick={onClose}>
//             Cancelar
//           </Button>
//           {event && (
//             <Link href={`${router.pathname}/${event.id}`}>
//             <Button onClick={onClose}>
//               Gestión clientes
//             </Button>
//           </Link>
//           )}
//           <Button
//             disabled={formik.isSubmitting}
//             sx={{ ml: 1 }}
//             type="submit"
//             variant="contained"
//           >
//             Confirmar
//           </Button>
//         </Box>
//       </form>
//     </Dialog>
//   );
// };
//
// CalendarEventDialog.propTypes = {
//   event: PropTypes.object,
//   onAddComplete: PropTypes.func,
//   onClose: PropTypes.func,
//   onDeleteComplete: PropTypes.func,
//   onEditComplete: PropTypes.func,
//   open: PropTypes.bool,
//   range: PropTypes.object
// };