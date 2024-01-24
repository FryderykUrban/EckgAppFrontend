// PatientsList.js
import React from 'react';
import { Button, Card, CardActions, CardContent, Collapse, Grid, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { useNavigate } from 'react-router-dom';

const PatientsList = ({ patients, setPatientId }) => {
    const [openDetails, setOpenDetails] = React.useState({});
    const navigate = useNavigate();

    const toggleDetails = (patientId) => {
        setOpenDetails(prevState => ({ ...prevState, [patientId]: !prevState[patientId] }));
    };

    const handleEKGButtonClick = (patientId) => {
        navigate(`/chart/`);
        setPatientId(patientId);
    };

    return (
        <Grid container spacing={2} style={{ marginTop: '20px', justifyContent: 'center' }}>
            {patients.map(patient => (
                <Grid item xs={12} sm={6} md={4} lg={4} key={patient.id} style={{ display: 'flex' }}>
                    <Card variant="outlined" style={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '180px' }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                {`${patient.firstName} ${patient.lastName}`}
                            </Typography>
                            {/* Usunięto wyświetlanie ID */}
                            <CardActions style={{ justifyContent: 'center', margin: 0, padding: 0 }}>
                                <Button onClick={() => toggleDetails(patient.id)}>
                                    {openDetails[patient.id] ? <ExpandLessIcon /> : <ExpandMoreIcon />} Szczegóły
                                </Button>
                            </CardActions>
                        </CardContent>
                        <Collapse in={openDetails[patient.id]} timeout="auto" unmountOnExit>
                            <CardContent>
                                <Typography variant="body2" gutterBottom>Data urodzenia: {patient.dateOfBirth}</Typography>
                                <Typography variant="body2" gutterBottom>Płeć: {patient.gender}</Typography>
                                <Typography variant="body2" gutterBottom>Adres: {patient.address}</Typography>
                            </CardContent>
                            <CardActions style={{ justifyContent: 'center' }}>
                                <Button variant="outlined" onClick={() => handleEKGButtonClick(patient.id)}>
                                    EKG
                                </Button>
                            </CardActions>
                        </Collapse>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
};

export default PatientsList;
