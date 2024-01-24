// PatientsPage.js
import React, { useState, useEffect, useCallback } from 'react';
import AddPatientDialog from "../component/AddPatientDialog";
import PatientsList from "../component/PatientsList";
import { addPatient, getPatientsByDoctorUsername } from "../fetch/EkgControllerFetches";
import Dialog from '@mui/material/Dialog';
import Snackbar from '@mui/material/Snackbar';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

const PatientsPage = ({ setPatientId }) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
    const [patients, setPatients] = useState([]);
    const doctorUsername = localStorage.getItem("username");

    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.up('sm'));

    const fetchPatients = useCallback(() => {
        if (doctorUsername) {
            getPatientsByDoctorUsername(doctorUsername)
                .then(setPatients)
                .catch(error => console.error('Error fetching patients:', error));
        }
    }, [doctorUsername]);

    useEffect(() => {
        fetchPatients();
    }, [fetchPatients]);

    const handleSnackbarOpen = () => {
        setIsSnackbarOpen(true);
    };

    const handleSnackbarClose = () => {
        setIsSnackbarOpen(false);
    };

    const handleOpenDialog = () => {
        setIsDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
    };

    const handleAddPatientSuccess = (newPatient) => {
        setPatients(prevPatients => [...prevPatients, newPatient]);
        handleSnackbarOpen();
    };

    const handleAddPatient = async (data) => {
        if (!data.firstName || !data.lastName || !data.dateOfBirth || !data.gender) {
            alert('Wszystkie pola są wymagane!');
            return;
        }
        try {
            const newPatient = await addPatient(data);
            handleAddPatientSuccess(newPatient);
            handleCloseDialog();
        } catch (error) {
            console.error('Błąd podczas dodawania pacjenta:', error);
            alert('Wystąpił błąd podczas dodawania pacjenta.');
        }
    };

    return (
        <div style={{ paddingTop: '64px', position: 'relative', minHeight: '100vh' }}>
            <Dialog open={isDialogOpen} onClose={handleCloseDialog}>
                <AddPatientDialog onClose={handleCloseDialog} onAddPatient={handleAddPatient} />
            </Dialog>
            <Snackbar
                open={isSnackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                message="Pomyślnie dodano nowego pacjenta"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            />
            <PatientsList patients={patients} setPatientId={setPatientId} />

            <Tooltip title="Dodaj nowego pacjenta" placement="left" arrow>
                <IconButton 
                    color="primary" 
                    onClick={handleOpenDialog} 
                    style={{ 
                        position: 'fixed', 
                        bottom: matches ? 20 : 70, 
                        right: 20,
                        zIndex: 1000
                    }}
                >
                    <AddCircleIcon style={{ fontSize: '100px' }} /> {/* Zastosowanie stylu bezpośrednio do ikony */}
                </IconButton>
            </Tooltip>
        </div>
    );
};

export default PatientsPage;
