import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { uploadEcgFile } from "../fetch/EkgControllerFetches.ts";
import { Paper, Typography, IconButton } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

interface FileUploadProps {
    patientId: number;
    recordDateString: string;
    onFileUpload: () => void;
}

export const FileUpload = ({ patientId, recordDateString, onFileUpload }: FileUploadProps) => {
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
    const [isError, setIsError] = useState<boolean>(false);

    const { getRootProps, getInputProps } = useDropzone({
        onDrop: (acceptedFiles: File[]) => {
            setUploadedFiles(acceptedFiles);
            uploadEcgFile(patientId, recordDateString, acceptedFiles[0])
                .then(() => {
                    setIsError(false);
                    onFileUpload(); // Wywołanie funkcji odświeżającej listę EKG
                })
                .catch((error) => {
                    setIsError(true);
                    console.log(error);
                });
        },
        accept: 'application/pdf, application/vnd.ms-excel' // określ typy plików, które chcesz akceptować
    });

    return (
        <Paper
            {...getRootProps()}
            sx={{
                border: '2px dashed grey',
                bgcolor: 'background.paper',
                p: 2,
                mb: 1,
                textAlign: 'center',
                cursor: 'pointer',
                width: 'auto',
                maxWidth: 300,
                height: 'auto',
                minHeight: 50,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                '&:hover': {
                    border: '2px solid primary.main',
                },
            }}
        >
            <input {...getInputProps()} />
            <IconButton color="primary" size="large">
                <CloudUploadIcon sx={{ fontSize: 40 }} />
            </IconButton>
            <Typography variant="h6" gutterBottom>
                Przeciągnij pliki EKG tutaj lub kliknij, aby przeglądać.
            </Typography>
            {uploadedFiles.map((file, index) => (
                <Typography key={index} variant="body1">
                    {file.name}
                </Typography>
            ))}
            {isError && (
                <Typography color="error" variant="body1">
                    Wystąpił błąd podczas przesyłania pliku.
                </Typography>
            )}
        </Paper>
    );
};
