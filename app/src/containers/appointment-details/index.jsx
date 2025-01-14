import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { raiseError, updateToast } from "../../store/toastSlice";
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
import { useQuery, useQueryClient } from "@tanstack/react-query";

export default function AppointmentDetails(props){
    const { id } = props;
    const dispatch = useDispatch();
    const {closeDrawer} = useDrawer();
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

    const [newNote, setNewNote] = useState('');

    const fetchDoctorData = () => {
        return ApiService.get(
            'users/doctors/'
        );
    };

    const { data: doctors, isError: isDoctorError, error: doctorError } = useQuery({
        queryKey: ['doctors'],
        queryFn: fetchDoctorData,
        enabled: profile.isStaff,
        staleTime: 24 * 60 * 60 * 1000, // 1 day in milliseconds
        cacheTime: 24 * 60 * 60 * 1000, // 1 day in milliseconds
        select: (res) => {
            return res.data.map((data) => ({
                label: `${data.first_name} ${data.last_name}`,
                value: data.id
            }));
        },
    });

    useEffect(() => {
        if(isDoctorError){
            dispatch(raiseError({
                error: doctorError.response?.data ?? null,
                status: doctorError.status
            }))
        }
    }, [isDoctorError])

    const resetErrors = () => {
        setError({
            date: null,
            time: null,
            visitType: null,
            createdFor: null,
            desc: null
        });
    }

    const fetchNotes = () => {
        return ApiService.get(
            `appointments/${id}/notes/`
        )
    }

    const { data: notes, isLoading: notesIsLoading, isError: isNoteError, error: noteError } = useQuery({
        queryKey: ['notes', id],
        queryFn: fetchNotes,
        enabled: !!id,
        staleTime: 24 * 60 * 60 * 1000, // 1 day in milliseconds
        cacheTime: 24 * 60 * 60 * 1000, // 1 day in milliseconds
        select: (res) => {
            return res.data
        }
    });

    useEffect(() => {
        if(isNoteError){
            dispatch(raiseError({
                error: noteError.response?.data ?? null,
                status: noteError.status
            }))
        }
    }, [isNoteError])


    const fetchDetails = () => {
        return ApiService.get(
            `appointments/${id}/`
        )
    }

    const { data: appointmentDetails, isLoading: detailsIsLoading, isError: appointmentIsError, error: appointmentError } = useQuery({
        queryKey: ['appointment-details', id],
        queryFn: fetchDetails,
        enabled: !!id,
        staleTime: 24 * 60 * 60 * 1000, // 1 day in milliseconds
        cacheTime: 24 * 60 * 60 * 1000, // 1 day in milliseconds
        select: (res) => {
            return res.data
        }
    });

    useEffect(() => {
        if(appointmentIsError){
            dispatch(raiseError({
                error: appointmentError.response?.data ?? null,
                status: appointmentError.status
            }))
        }
    }, [appointmentIsError])

    useEffect(() => {
        if(!detailsIsLoading && !!id){
            resetField();
            resetErrors();
        }
    }, [appointmentDetails]);

    const resetField = () => {
        setInput({
            date: moment(appointmentDetails.date),
            time: moment(appointmentDetails.time, "HH:mm:ss"),
            visitType: appointmentDetails.visit_type,
            createdFor: doctors?.filter(doctor => doctor.value === appointmentDetails.created_for)[0]?.value ?? null,
            isClosed: appointmentDetails.is_closed,
            desc: appointmentDetails.description
        });
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
            } else if (
                moment(input.date).isSameOrBefore(moment().startOf('day')) &&
                input.time !== null && 
                moment(input.time, 'HH:mm').isSameOrBefore(moment())
            ){
                dtError = 'Please select a date after today';
                noError = false;
            }   
            if(input.time === null){
                tError = 'Please selecct a time';
                noError = false;
            } else if (
                moment(input.date).isSame(moment().startOf('day')) &&
                moment(input.time, 'HH:mm').isSameOrBefore(moment())
            ){
                tError = 'Please select a time after now';
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
                    queryClient.invalidateQueries(['appointment-details', id]);
                    queryClient.invalidateQueries(['appointments-today']);
                    queryClient.invalidateQueries(['calendar']);

                    resolve(res.data);
                })
                .catch((err) => {
                    const error = err.response.data
                    dispatch(raiseError({
                        error: error ?? null,
                        status: err.status
                    }))
                    reject();
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
            queryClient.invalidateQueries(['calendar']);
            queryClient.invalidateQueries(['appointments-today']);
            queryClient.invalidateQueries(['appointment-details', id]);
            
            closeDrawer();
        })
        .catch((err) => {
            const error = err.response.data
            dispatch(raiseError({
                error: error ?? null,
                status: err.status
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
                queryClient.invalidateQueries(['notes', id]);
            })
            .catch((err) => {
                const error = err.response.data
                dispatch(raiseError({
                    error: error ?? null,
                    status: err.status
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
            queryClient.invalidateQueries(['notes', id]);
        })
        .catch((err) => {
            const error = err.response.data
            dispatch(raiseError({
                error: error ?? null,
                status: err.status
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
            queryClient.invalidateQueries(['notes', id]);
        })
        .catch((err) => {
            const error = err.response.data
            dispatch(raiseError({
                error: error ?? null,
                status: err.status
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
        {
            detailsIsLoading ?
            <CircularProgress/> :
            appointmentDetails &&
            <>
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
                                appointmentDetails.description ?? '---'
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
                            {appointmentDetails.date ? moment(appointmentDetails.date).format('DD MMM, YYYY') : '---'}
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
                            {appointmentDetails.time ? moment(appointmentDetails.time, 'HH:mm:ss').format('hh:mm A') : '---'}
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
                                appointmentDetails.visit_type_full ? 
                                <Chip
                                    label={appointmentDetails.visit_type_full}
                                    variant={
                                        appointmentDetails.visit_type === "I" ? 
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
                                {appointmentDetails.created_for_full_name ?? '---'}
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
                                appointmentDetails.is_closed !== null ? 
                                <Chip
                                    label={appointmentDetails.is_closed ? 'Closed' : 'Open'}
                                    variant={
                                        appointmentDetails.is_closed ? 
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
                    notesIsLoading ? 
                    <CircularProgress/> :
                    notes &&
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
    </>
}