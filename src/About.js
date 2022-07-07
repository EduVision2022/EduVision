import { 
    Text,
    ThemeIcon,
    Title,
    Container,
    SimpleGrid,
    useMantineTheme,
    createStyles,
} from '@mantine/core'; 
import {Icon as TablerIcon} from 'tabler-icons-react';

const About = () => {
    
    return (
    <>
        <div style={{height:"73vh",transform:"translateY(10%)"}}>
                <Text order={1} color ="dimmed" style={{display:'inline-block', fontSize:"48px"}} >Misiunea noastră este de a 	&nbsp;</Text><br/>

                <Text order={1} color ="blue" style={{display:'inline-block', fontSize:"48px", fontSize:"48px"}}> ajuta 	&nbsp;</Text>
                
                <Text order={1} color ="dimmed" style={{display:'inline-block', fontSize:"48px"}}>elevii ce	&nbsp; </Text>
                
                <Text order={1} color="red" style={{display:'inline-block', fontSize:"48px"}}>au în față 	&nbsp;</Text><br/>
                
                <Text order={1} color ="dimmed" style={{display:'inline-block', fontSize:"48px"}}>examenul de 	&nbsp;</Text>
                
                <Text order={1} color="green" weight={"bold"} style={{display:'inline-block', fontSize:"48px"}}>Bacalaureat</Text> 
                
                <Text order={1} color ="dimmed" style={{display:'inline-block', fontSize:"48px"}}>,</Text><br/>

                <Text order={1} color ="dimmed" style={{display:'inline-block', fontSize:"48px"}}> 	&nbsp;creând un 	&nbsp;</Text>
                
                <Text order={1} color="yellow" style={{display:'inline-block', fontSize:"48px"}}>orar de studiu.	&nbsp;</Text>
    
        </div>
    </>
    );
};
export default About;