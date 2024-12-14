import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import { Body, Container, TextContainer, Title } from "./index.style";

export default function Home(prop){
    return<Container>
        <TextContainer>
            <Title>About</Title>
            <Body>
            Welcome to the Doctor-Patient Appointment Management Platform, 
            a cutting-edge web application designed to streamline appointment 
            scheduling and management for healthcare professionals and administrators. 
            This platform showcases advanced frontend technologies, efficient state management, 
            robust authentication mechanisms, and intuitive user experiences.
            </Body>
        </TextContainer>
        <LocalHospitalIcon
            color="primary"
            sx={{
                fontSize: '50vh'
            }}/>
    </Container>
}