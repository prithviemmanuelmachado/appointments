import { useNavigate } from "react-router-dom";
import { Container, Footer, Left, Right, Title } from "./index.style";

export default function Notification(props){
    const {
        data
    } = props;

    const navigate = useNavigate();

    return <Container onClick={() => navigate(`${data.id}/`)}>
        <Title>
            #{data.id}
        </Title>
        {data.description}
        <Footer>
            <Left>
                Appointment time: {data.time}
            </Left>
            <Right>
                Appointment type: {data.visit_type}
            </Right>
        </Footer>
    </Container>
}