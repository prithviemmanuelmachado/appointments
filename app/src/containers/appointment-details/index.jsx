import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updateToast } from "../../store/toastSlice";
import { Data, DataContainer, Label, LabelContainer, Row, Title } from "./index.style";
import { Button, CircularProgress, IconButton, TextField } from "@mui/material";
import ApiService from "../../services/apiservice";
import { chipVariant, inputTypes } from "../../constants";
import moment from 'moment';
import EditableCard from "../../components/editable-card";
import { useDrawer } from "../../providers/details-drawer";
import CloseIcon from '@mui/icons-material/Close';
import Chip from "../../components/chip";
import Input from "../../components/input";
import { useQueryClient } from "@tanstack/react-query";

export default function AppointmentDetails(props){
    const { id } = props;
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const {closeDrawer} = useDrawer();
    const [data, setData] = useState({});
    const profile = useSelector(state => state.profile);
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const queryClient = useQueryClient();

    const [input, setInput] = useState({
        date: null,
        time: null,
        visitType: null,
        createdFor: null,
        isClosed: null,
        desc: null
    });

    const [error, setError] = useState({
        date: null,
        time: null,
        visitType: null,
        createdFor: null,
        desc: null
    });

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
        resetErrors();
    }, [data]);

    const resetField = () => {
        setInput({
            date: moment(data.date),
            time: moment(data.time, "HH:mm:ss"),
            visitType: data.visit_type,
            createdFor: doctors.filter(doctor => doctor.value === data.created_for)[0]?.value ?? null,
            isClosed: data.is_closed,
            desc: data.description
        });
    }

    const resetErrors = () => {
        setError({
            date: null,
            time: null,
            visitType: null,
            createdFor: null,
            desc: null
        });
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

    let editForm = {
        date: {
            error: error.date,
            type: inputTypes.date,
            value: input.date,
            setValue: (value) =>  {
                const parsedDate = moment(value);
                setInput({
                    ...input,
                    date: parsedDate
                });
            }
        },
        time: {
            error: error.time,
            type: inputTypes.time,
            value: input.time,
            setValue: (value) =>  {
                const parsedTime = moment(value);
                setInput({
                    ...input,
                    time: parsedTime
                });
            }
        },
        visitType: {
            error: error.visitType,
            type: inputTypes.select,
            value: input.visitType,
            setValue: (event) =>  setInput({
                ...input,
                visitType: event.target.value
            }),
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
    };

    if(profile.isStaff){
        editForm['createdFor'] = {
            error: error.createdFor,
            type: inputTypes.select,
            value: input.createdFor,
            setValue: (event) =>  setInput({
                ...input,
                createdFor: event.target.value
            }),
            options: doctors
        };
    }

    editForm['status'] = {
        type: inputTypes.select,
        value: input.isClosed,
        error: false,
        setValue: (event) =>  setInput({
            ...input,
            isClosed: event.target.value
        }),
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
    };
    editForm['desc'] = {
        error: error.desc ,
        type: inputTypes.textArea,
        value: input.desc,
        setValue: (event) =>  setInput({
            ...input,
            desc: event.target.value
        })
    };

    const editAppointment = () => {
        return new Promise((resolve, reject) => {
            setIsLoading(true);
            let noError = true;
            let dtError = null;
            let tError = null;
            let vError = null;
            let cError = null;
            let dError = null;

            if(input.date === null){
                dtError = 'Please select a date';
                noError = false;
            } else if (moment(input.date).isSameOrBefore(moment().startOf('day'))){
                dtError = 'Please select a date after today';
                noError = false;
            }

            if(input.time === null){
                tError = 'Please selecct a time';
                noError = false;
            }

            if(input.createdFor === null && profile.isStaff){
                cError = 'Please select a doctor';
                noError = false;
            }

            if(input.visitType === null){
                vError = 'Please select a vist type';
                noError = false;
            }

            if(!input.desc){
                dError = 'Please enter a description';
                noError = false;
            }

            setError({
                date: dtError,
                time: tError,
                visitType: vError,
                createdFor: cError,
                desc: dError
            })

            if(noError){
                ApiService.put(
                    `appointments/${id}/`,
                    {
                        "date": moment(input.date).format('YYYY-MM-DD'),
                        "time": moment(input.time).format('HH:mm:ss'),
                        "visit_type": input.visitType,
                        "created_for": input.createdFor,
                        "is_closed": input.isClosed,
                        "description": input.desc
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
                    const error = err.response.data
                    dispatch(updateToast({
                        bodyMessage : `The user is already booked for ${error.conflicting_slots.join(', ')}`,
                        isVisible : true,
                        type: 'error'
                    }));
                    reject(err);
                })
            }
            else{
                reject({
                    error: 'Validation error'
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
            queryClient.invalidateQueries(['appointments']);
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
        <Row
            sticky>
            <Title>#{id}</Title>
            {
                isEditing ? 
                <>
                    {
                        isLoading ?
                        <CircularProgress/> :
                        <Button
                            onClick={() => {
                                editAppointment()
                                .then(() => {
                                    setIsLoading(false);
                                    setIsEditing(false);
                                    queryClient.invalidateQueries(['appointments']);
                                })
                                .catch(() => {
                                    setIsLoading(false);
                                })
                            }}
                            variant="contained">
                            Update
                        </Button>
                    }
                    <Button
                        onClick={() => {
                            setIsEditing(false);
                            resetField();
                        }}
                        variant="outlined">
                        Back
                    </Button>
                </>:
                <>
                    <Button
                        onClick={() => {setIsEditing(true)}}
                        variant="contained">
                        Edit
                    </Button>
                    <Button
                        onClick={deleteAppointment}
                        variant="outlined"
                        color="error">
                        Delete
                    </Button>
                </>
            }
            <IconButton 
                aria-label="close"
                color="error"
                onClick={closeDrawer}
            >
                <CloseIcon/>
            </IconButton>
        </Row>
        <Row>
            <LabelContainer top>
                <Label>
                    Description
                </Label>
            </LabelContainer>
            <DataContainer top>
                {
                    isEditing ?
                    <Input inputDetails={editForm.desc}/> :
                    <Data>
                    {
                        data.description ?? '---'
                    }
                    </Data>
                }
            </DataContainer>
        </Row>
        <Row>
            <LabelContainer>
                <Label>
                    Date
                </Label>
            </LabelContainer>
            <DataContainer>
                {
                    isEditing ?
                    <Input inputDetails={editForm.date}/> :
                    <Data>
                    {data.date ? moment(data.date).format('DD MMM, YYYY') : '---'}
                    </Data>
                }
            </DataContainer>
        </Row>
        <Row>
            <LabelContainer>
                <Label>
                    Time
                </Label>
            </LabelContainer>
            <DataContainer>
                {
                    isEditing ?
                    <Input inputDetails={editForm.time}/> :
                    <Data>
                    {data.time ? moment(data.time, 'HH:mm:ss').format('hh:mm A') : '---'}
                    </Data>
                }
            </DataContainer>
        </Row>
        <Row>
            <LabelContainer>
                <Label>
                    Visit type
                </Label>
            </LabelContainer>
            <DataContainer>
                {
                    isEditing ?
                    <Input inputDetails={editForm.visitType}/> :
                    <Data>
                    {
                        data.visit_type_full ? 
                        <Chip
                            label={data.visit_type_full}
                            variant={
                                data.visit_type === "I" ? 
                                chipVariant.inPerson :
                                chipVariant.virtual
                            }/> : '---'
                    }
                    </Data>
                }
            </DataContainer>
        </Row>
        <Row>
            <LabelContainer>
                <Label>
                    Created for
                </Label>
            </LabelContainer>
            <DataContainer>
                {
                    isEditing && profile.isStaff ?
                    <Input inputDetails={editForm.createdFor}/> :
                    <Data>
                        {data.created_for_full_name ?? '---'}
                    </Data>
                }
            </DataContainer>
        </Row>
        <Row>
            <LabelContainer>
                <Label>
                    Status
                </Label>
            </LabelContainer>
            <DataContainer>
                {
                    isEditing ?
                    <Input inputDetails={editForm.status}/> :
                    <Data>
                    {
                        data.is_closed !== null ? 
                        <Chip
                            label={data.is_closed ? 'Closed' : 'Open'}
                            variant={
                                data.is_closed ? 
                                chipVariant.closed :
                                chipVariant.open
                            }/> : '---'
                    }
                    </Data>
                }
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
                        avatar={note.avatar}
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