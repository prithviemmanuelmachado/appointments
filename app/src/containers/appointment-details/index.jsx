import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { updateToast } from "../../store/toastSlice";
import { Data, DataContainer, Label, LabelContainer, Row } from "./index.style";
import { Button, TextField } from "@mui/material";
import ModalForm from "../../components/modal-form";
import ApiService from "../../services/apiservice";
import { inputTypes } from "../../constants";
import moment from 'moment';
import EditableCard from "../../components/editable-card";

export default function AppointmentDetails(props){
    const {
        navigate
    } = props;
    const { id } = useParams();
    const dispatch = useDispatch();
    const [data, setData] = useState({});
    const profile = useSelector(state => state.profile);

    const [createdate, setcreateDate] = useState(null);
    const [createtime, setcreateTime] = useState(null);
    const [createvisitType, setcreateVisitType] = useState(null);
    const [createcreatedFor, setcreateCreatedFor] = useState(null);
    const [isClosed, setIsClosed] = useState(null);

    const [dateError, setDateError] = useState(null);
    const [timeError, setTimeError] = useState(null);
    const [visitTypeError, setVisitTypeError] = useState(null);
    const [createdForError, setCreatedForError] = useState(null);

    const [doctors, setDoctors] = useState([]);
    const [notes, setNotes] = useState([]);

    const [newNote, setNewNote] = useState('');

    useEffect(() => {
        getDetails();

        if(profile.isStaff){
            ApiService.get(
                'users/doctors/'
            )
            .then((res) => {
                setDoctors(res.data.map((doctor) => {
                    return {
                        label: `${doctor.first_name} ${doctor.last_name}`,
                        value: doctor.id
                    }
                }))
            })
            .catch((err) => {
                dispatch(updateToast({
                    bodyMessage : err.response.data,
                    isVisible : true,
                    type: 'error'
                }));
            })
        }
    }, []);

    useEffect(() => {
        resetField();
    }, [data]);

    const resetField = () => {
        setcreateDate(moment(data.date));
        setcreateTime(moment(data.time, "HH:mm:ss"));
        setcreateVisitType(data.visit_type);
        setcreateCreatedFor(data.created_for);
        setIsClosed(data.is_closed);
    }

    const resetErrors = () => {
        setDateError(null);
        setTimeError(null);
        setVisitTypeError(null);
        setCreatedForError(null);
    }

    const getNotes = () => {
        ApiService.get(
            `appointments/${id}/notes/`
        )
        .then(res => {
            setNotes(res.data)
        })
        .catch((err) => {
            if(err.status === 404){
                dispatch(updateToast({
                    bodyMessage : 'No such appointment exists',
                    isVisible : true,
                    type: 'error'
                }))
            }
            dispatch(updateToast({
                bodyMessage : err.response.data,
                isVisible : true,
                type: 'error'
            }))
        })
    }

    const getDetails = () => {
        ApiService.get(
            `appointments/${id}/`
        )
        .then((res) => {
            setData(res.data);
            getNotes();
        })
        .catch((err) => {
            if(err.status === 404){
                dispatch(updateToast({
                    bodyMessage : 'No such appointment exists',
                    isVisible : true,
                    type: 'error'
                }))
            }
            dispatch(updateToast({
                bodyMessage : err.response.data,
                isVisible : true,
                type: 'error'
            }))
        })
    }

    let editForm = [
        {
            label: 'Select appointement date',
            error: dateError,
            type: inputTypes.date,
            value: createdate,
            setValue: (value) =>  {
                const parsedDate = moment(value);
                setcreateDate(parsedDate);
            }
        },
        {
            label: 'Select appointement time',
            error: timeError,
            type: inputTypes.time,
            value: createtime,
            setValue: (value) =>  {
                const parsedTime = moment(value);
                setcreateTime(parsedTime);
            }
        },
        {
            label: 'Select visit type',
            error: visitTypeError,
            type: inputTypes.select,
            value: createvisitType,
            setValue: (event) =>  setcreateVisitType(event.target.value),
            options: [
                {
                  label: 'In person',
                  value: 'I'
                },
                {
                  label: 'Virtual',
                  value: 'V'
                }
            ]  
        }
    ]

    if(profile.isStaff){
        editForm.push({
            label: 'Select who the appointment is for',
            error: createdForError,
            type: inputTypes.select,
            value: createcreatedFor,
            setValue: (event) =>  setcreateCreatedFor(event.target.value),
            options: doctors
        })
    }

    editForm.push({
        label: 'Select appointment status',
        type: inputTypes.select,
        value: isClosed,
        error: false,
        setValue: (event) =>  setIsClosed(event.target.value),
        options: [
            {
              label: 'Close',
              value: true
            },
            {
              label: 'Open',
              value: false
            }
        ]  
    })

    const editAppointment = () => {
        return new Promise((resolve, reject) => {
            let noError = true;

            if(createdate === null){
                setDateError('Please select a date');
                noError = false;
            } else if (moment(createdate).isSameOrBefore(moment().startOf('day'))){
                setDateError('Please select a date after today');
                noError = false;
            } else {
                setDateError(null);
            }

            if(createtime === null){
                setTimeError('Please selecct a time');
                noError = false;
            } else {
                setTimeError(null);
            }

            if(createcreatedFor === null && profile.isStaff){
                setCreatedForError('Please select a doctor');
                noError = false;
            } else {
                setCreatedForError(null);
            }

            if(createvisitType === null){
                setVisitTypeError('Please select a vist type');
                noError = false;
            }

            if(noError){
                ApiService.put(
                    `appointments/${id}/`,
                    {
                        "date": moment(createdate).format('YYYY-MM-DD'),
                        "time": moment(createtime).format('HH:mm:ss'),
                        "visit_type": createvisitType,
                        "created_for": createcreatedFor,
                        "is_closed": isClosed
                    }
                    
                )
                .then((res) => {
                    dispatch(updateToast({
                        bodyMessage : 'Appointment updated successfully',
                        isVisible : true,
                        type: 'success'
                    }));
                    getDetails();
                    resolve(res.data);
                })
                .catch((err) => {
                    dispatch(updateToast({
                        bodyMessage : err.response.data,
                        isVisible : true,
                        type: 'error'
                    }));
                    reject(err);
                })
            }
        })
    }

    const deleteAppointment = () => {
        ApiService.delete(
            `appointments/${id}/`
        )
        .then((res) => {
            dispatch(updateToast({
                bodyMessage : 'Appointment deleted successfully',
                isVisible : true,
                type: 'success'
            }))
            navigate('/appointment-list');
        })
        .catch((err) => {
            if(err.status === 404){
                dispatch(updateToast({
                    bodyMessage : 'No such appointment exists',
                    isVisible : true,
                    type: 'error'
                }))
            }
            dispatch(updateToast({
                bodyMessage : err.response.data,
                isVisible : true,
                type: 'error'
            }))
        })
    }

    const addNote = () => {
        if(newNote !== ''){
            ApiService.post(
                `appointments/${id}/notes/`,
                {
                    description: newNote
                }
            )
            .then((res) => {
                dispatch(updateToast({
                    bodyMessage : 'Note added successfully',
                    isVisible : true,
                    type: 'success'
                }));
                setNewNote('');
                getNotes();
            })
            .catch((err) => {
                if(err.status === 404){
                    dispatch(updateToast({
                        bodyMessage : 'No such appointment exists',
                        isVisible : true,
                        type: 'error'
                    }))
                }
                dispatch(updateToast({
                    bodyMessage : err.response.data,
                    isVisible : true,
                    type: 'error'
                }))
            })
        }
    }

    const editNote = (desc, noteID) => {
        ApiService.put(
            `appointments/${id}/notes/${noteID}/`,
            {
                description: desc
            }
        )
        .then((res) => {
            dispatch(updateToast({
                bodyMessage : 'Note updated successfully',
                isVisible : true,
                type: 'success'
            }));
            getDetails();
            getNotes();
        })
        .catch((err) => {
            if(err.status === 404){
                dispatch(updateToast({
                    bodyMessage : 'No such appointment exists',
                    isVisible : true,
                    type: 'error'
                }))
            }
            dispatch(updateToast({
                bodyMessage : err.response.data,
                isVisible : true,
                type: 'error'
            }))
        })
    }

    const deleteNote = (noteID) => {
        ApiService.delete(
            `appointments/${id}/notes/${noteID}/`
        )
        .then((res) => {
            dispatch(updateToast({
                bodyMessage : 'Note deleted successfully',
                isVisible : true,
                type: 'success'
            }));
            getDetails();
            getNotes();
        })
        .catch((err) => {
            if(err.status === 404){
                dispatch(updateToast({
                    bodyMessage : 'No such appointment exists',
                    isVisible : true,
                    type: 'error'
                }))
            }
            dispatch(updateToast({
                bodyMessage : err.response.data,
                isVisible : true,
                type: 'error'
            }))
        })
    }

    return <>
        <Row>
            <Button
                onClick={deleteAppointment}
                variant="contained"
                color="error">
                Delete
            </Button>
            <ModalForm
                buttonLabel={'Edit appointment'}
                formTitle={'Edit appointment'}
                buttonVariant="contained"
                formFields={editForm}
                onFormClose={() => {
                    resetField();
                    resetErrors();
                }}
                onSubmit={editAppointment}/>
        </Row>
        <Row>
            <LabelContainer>
                <Label>
                    Date
                </Label>
            </LabelContainer>
            <DataContainer>
                <Data>
                    {data.date ? moment(data.date).format('DD MMM, YYYY') : '---'}
                </Data>
            </DataContainer>
        </Row>
        <Row>
            <LabelContainer>
                <Label>
                    Time
                </Label>
            </LabelContainer>
            <DataContainer>
                <Data>
                    {data.time ? moment(data.time, 'HH:mm:ss').format('hh:mm A') : '---'}
                </Data>
            </DataContainer>
        </Row>
        <Row>
            <LabelContainer>
                <Label>
                    Visit type
                </Label>
            </LabelContainer>
            <DataContainer>
                <Data>
                    {data.visit_type_full ?? '---'}
                </Data>
            </DataContainer>
        </Row>
        <Row>
            <LabelContainer>
                <Label>
                    Created for
                </Label>
            </LabelContainer>
            <DataContainer>
                <Data>
                    {data.created_for_full_name ?? '---'}
                </Data>
            </DataContainer>
        </Row>
        <Row>
            <LabelContainer>
                <Label>
                    Status
                </Label>
            </LabelContainer>
            <DataContainer>
                <Data>
                    {data.is_closed ? 'Closed' : 'Open'}
                </Data>
            </DataContainer>
        </Row>
        <Row>
            <TextField
                sx={{
                    width: '100%'
                }}
                multiline
                rows={5}
                variant='outlined'
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}/>
        </Row>
        <Row>
            <Button
                onClick={addNote}
                variant="outlined"
                color="primary">
                Create note
            </Button>
        </Row>
        {
            notes.map((note, index) => {
                return <Row
                    key={`note-${id}-${index}`}>
                    <EditableCard
                        id={note.id}
                        description={note.description}
                        title={note.created_by}
                        timeStamp={note.created_on}
                        isEditable={note.is_editable}
                        onDelete={deleteNote}
                        onEdit={editNote}/>
                </Row>
            })
        }
    </>
}