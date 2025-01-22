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
                <p
                    style={{margin: 0}}>
                Appointment time: 
                <span
                    style={{
                        marginInlineStart: '27px'
                    }}>
                {data.time}
                </span>
                </p>
            </Left>
            <Right>
                Appointment type: {data.visit_type}
            </Right>
        </Footer>
    </Container>
}