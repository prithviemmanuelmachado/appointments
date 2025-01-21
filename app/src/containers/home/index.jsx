import { Body, Container, Row, SubTitle, TextContainer, Title } from "./index.style";
import { Button } from '@mui/material';

export default function Home(prop){
    return<Container>
        <Row leftToRight>
            <TextContainer>
                <SubTitle>Manage your appointments</SubTitle>
                <Title>Quick and easy</Title>
                <Body>
                Welcome to the Doctor-Patient Appointment Management Platform, 
                a cutting-edge web application designed to streamline appointment 
                scheduling and management for healthcare professionals and administrators. 
                This platform showcases advanced frontend technologies, efficient state management, 
                robust authentication mechanisms, and intuitive user experiences.
                </Body>
                <Button variant={'contained'}>Get in touch</Button>
            </TextContainer>
            <img alt={"close"} src={"/about.png"} style={{width: '400px'}}/>
        </Row>
        <Row>
            <img alt={"close"} src={"/calendar.png"} style={{width: '400px'}}/>
            <TextContainer>
                <Title>Track your calendar</Title>
                <Body>
                Seamlessly track, organize, and manage appointments for all your colleagues. 
                Stay updated on schedules, avoid conflicts, and enhance team coordination with real-time updates 
                and intuitive reminders.
                </Body>
            </TextContainer>
        </Row>
        <Row leftToRight>
            <TextContainer>
                <Title>Schedule your appointments</Title>
                <Body>
                Create and manage appointments for yourself or your peers. 
                Effortlessly avoid conflicts with real-time availability checks, smart scheduling, and 
                seamless collaboration.
                </Body>
            </TextContainer>
            <img alt={"close"} src={"/schedule.png"} style={{width: '400px'}}/>
        </Row>
        <Row>
            <img alt={"close"} src={"/reminder.png"} style={{width: '400px'}}/>
            <TextContainer>
                <Title>Receive daily reminders</Title>
                <Body>
                A reliable reminder that keeps you informed about your daily appointments. 
                Get timely notifications to ensure you're always prepared and never miss an important meeting or commitment.
                </Body>
            </TextContainer>
        </Row>
    </Container>
}