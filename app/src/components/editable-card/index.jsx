import { Button, Card, CardActions, CardContent, CardHeader, IconButton, TextField, Typography } from "@mui/material";
import moment from 'moment';
import { ButtonContainer } from "./index.style";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useState } from "react";

/**
 * EditableCard Component
 * A reusable card component that supports displaying, editing, and deleting content.
 *
 * @component
 *
 * @param {Object} props - The properties for the EditableCard component.
 * @param {string} props.id - Unique identifier for the card.
 * @param {string} props.description - The main content or description of the card.
 * @param {string} props.title - The title displayed on the card.
 * @param {Date} props.timeStamp - Timestamp displayed as a subheader in the card.
 * @param {boolean} props.isEditable - Determines if the card supports editing and deleting.
 * @param {function} [props.onEdit] - Callback function triggered when the user submits an edit.
 * @param {function} [props.onDelete] - Callback function triggered when the user clicks the delete button.
 *
 * @example
 * const handleEdit = (newDesc, id) => {
 *   console.log("Edited Description:", newDesc);
 * };
 *
 * const handleDelete = (id) => {
 *   console.log("Deleted Card ID:", id);
 * };
 *
 * <EditableCard
 *   id="1"
 *   title="Sample Title"
 *   description="This is a sample description."
 *   timeStamp={new Date()}
 *   isEditable={true}
 *   onEdit={handleEdit}
 *   onDelete={handleDelete}
 * />
 * 
 * @returns {JSX.Element} A `Card` commponent.
 */

export default function EditableCard(props){
    const {
        id,
        description,
        title,
        timeStamp,
        isEditable,
        onEdit,
        onDelete
    } = props;

    const [edit, setEdit] = useState(false);
    const [desc, setDesc] = useState(description);

    const onSubmit = () => {
        if(onEdit){
            onEdit(desc, id);
        }
        setEdit(false)
    }

    return <Card
        sx={{
            marginBlock: '10px',
            width: edit ? '100%' : 'auto'
        }}>
        <CardHeader
            titleTypographyProps={{
                sx: {
                    fontSize: 18
                }
            }}
            title={title ?? '---'}
            subheader={moment(timeStamp).format('DD MMM, YYYY - hh:mm A')}
            action={
                isEditable &&
                <ButtonContainer>
                    <IconButton
                        aria-label={`button-deleted`}
                        onClick={() => onDelete(id)}
                    >
                        <DeleteIcon 
                            color={'error'}/>
                    </IconButton>
                    <IconButton
                        aria-label={`button-edit`}
                        onClick={() => {setEdit(!edit)}}
                    >
                        <EditIcon 
                            color={edit ? 'primary' : 'disabled'}/>
                    </IconButton>
                </ButtonContainer>
            }/>
        <CardContent>
            {
                edit ? 
                <TextField
                    sx={{width: '96%'}}
                    multiline
                    rows={5}
                    variant='outlined'
                    value={desc}
                    onChange={(event) => {
                        setDesc(event.target.value)
                    }}/>:
                <Typography>
                    {desc}
                </Typography>
            }
        </CardContent>
        {
            edit &&
            <CardActions>
                <Button
                    sx={{
                        margin: '4px'
                    }}
                    onClick={onSubmit}
                    variant="contained">
                    Submit
                </Button>
            </CardActions>
        }
    </Card>
}