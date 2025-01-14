import { avatarSize } from "../../constants";
import { Container, Profile } from "./index.style";
import Avatar from "../avatar";
import { Tooltip } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function CalendarItem(props){
    const {
        data,
        isLast,
        isFirst
    } = props;

    const navigate = useNavigate();

    return <Tooltip title={data.created_for}>
        <Container isLast={isLast} isFirst={isFirst} onClick={() => navigate(`${data.id}/`)}>
            <Avatar
                avatar={data.created_for_avatar}
                alt={data.created_for[0]}
                size={avatarSize.s}/>
            <Profile>{data.created_for}</Profile>
        </Container>
    </Tooltip>
}