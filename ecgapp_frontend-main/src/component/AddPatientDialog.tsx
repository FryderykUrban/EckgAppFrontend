// AddPatientDialog.tsx
import React, { useState } from 'react';
import { PatientData } from "../fetch/EkgControllerFetches";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    FormHelperText
} from '@mui/material';

interface AddPatientDialogProps {
    onClose: () => void;
    onAddPatient: (patientData: PatientData) => void;
}

const AddPatientDialog: React.FC<AddPatientDialogProps> = ({ onClose, onAddPatient }) => {
    const [patientData, setPatientData] = useState<PatientData>({
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        gender: 'MALE',
        address: ''
    });
    const [errors, setErrors] = useState<any>({});

    const validateForm = () => {
        let tempErrors: any = {};
        if (!patientData.firstName) tempErrors["firstName"] = "Imię jest wymagane.";
        if (!patientData.lastName) tempErrors["lastName"] = "Nazwisko jest wymagane.";
        if (!patientData.dateOfBirth) tempErrors["dateOfBirth"] = "Data urodzenia jest wymagana.";
        if (!patientData.gender) tempErrors["gender"] = "Płeć jest wymagana.";
        if (!patientData.address) tempErrors["address"] = "Adres jest wymagany.";
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setPatientData({ ...patientData, [e.target.name]: e.target.value });
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: null });
        }
    };

    const handleSubmit = () => {
        if (validateForm()) {
            onAddPatient(patientData);
        }
    };

    return (
        <Dialog open={true} onClose={onClose}>
            <DialogContent>
                <Grid container direction="column" spacing={2}>
                    <Grid item>
                        <TextField
                            error={!!errors.firstName}
                            fullWidth
                            label="Imię"
                            name="firstName"
                            value={patientData.firstName}
                            onChange={handleChange}
                            variant="outlined"
                            helperText={errors.firstName}
                        />
                    </Grid>
                    <Grid item>
                        <TextField
                            error={!!errors.lastName}
                            fullWidth
                            label="Nazwisko"
                            name="lastName"
                            value={patientData.lastName}
                            onChange={handleChange}
                            variant="outlined"
                            helperText={errors.lastName}
                        />
                    </Grid>
                    <Grid item>
                        <TextField
                            error={!!errors.dateOfBirth}
                            fullWidth
                            label="Data urodzenia"
                            name="dateOfBirth"
                            type="date"
                            value={patientData.dateOfBirth}
                            onChange={handleChange}
                            variant="outlined"
                            helperText={errors.dateOfBirth}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </Grid>
                    <Grid item>
                        <FormControl fullWidth error={!!errors.gender} variant="outlined">
                            <InputLabel shrink>Płeć</InputLabel>
                            <Select
                                label="Płeć"
                                name="gender"
                                value={patientData.gender}
                                onChange={handleChange}
                            >
                                <MenuItem value="MALE">Mężczyzna</MenuItem>
                                <MenuItem value="FEMALE">Kobieta</MenuItem>
                                <MenuItem value="OTHER">Inna</MenuItem>
                            </Select>
                            <FormHelperText>{errors.gender}</FormHelperText>
                        </FormControl>
                    </Grid>
                    <Grid item>
                        <TextField
                            error={!!errors.address}
                            fullWidth
                            label="Adres"
                            name="address"
                            value={patientData.address}
                            onChange={handleChange}
                            variant="outlined"
                            helperText={errors.address}
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleSubmit} color="primary">
                    Dodaj
                </Button>
                <Button onClick={onClose} color="secondary">
                    Anuluj
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddPatientDialog;
