import {EkgChartData} from "../model/EkgChartData.ts";
import {PatientAvailableEkg} from "../model/PatientAvailableEkg.ts";
const userToken = localStorage.getItem('jwt');

export const getChart = async (ekgChartId: number, from: string, to: string): Promise<EkgChartData[]> => {
    const url = `${import.meta.env.VITE_API_URL}/ecg-records/${ekgChartId}/chart-data?from=${from}&to=${to}`;
    const requestOptions = {
        method: 'GET',
        headers: {'Content-Type': 'application/json', Authorization: 'Bearer ' + userToken}
    };
    return await fetch(url, requestOptions)
        .then(response => {
                if (!response.ok) {
                    throw new Error(`${response.statusText}`);
                }
                return response.json()
            }
        )
        .then((data: EkgChartData[]) => data)
}

export interface PatientData {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    gender: 'MALE' | 'FEMALE' | 'OTHER';
    address: string;
}

export const addPatient = async (patientData: PatientData) => {
    const url = `${import.meta.env.VITE_API_URL}/patients`;
    const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json', Authorization: 'Bearer ' + userToken},
        body: JSON.stringify(patientData)
    };

    try {
        const response = await fetch(url, requestOptions);
        const responseData = await response.json();

        if (!response.ok) {
            console.error('Błąd odpowiedzi:', responseData);
            throw new Error(responseData.message || `Error: ${response.statusText}`);
        }

        return responseData;
    } catch (error) {
        console.error('Błąd sieci:', error);
        throw new Error('Błąd sieci lub serwera');
    }
};

export const getPatientsByDoctorUsername = async (username: string) => {
    const url = `${import.meta.env.VITE_API_URL}/patients/by-doctor-username/${username}`;
    const requestOptions = {
        method: 'GET',
        headers: {'Content-Type': 'application/json', Authorization: 'Bearer ' + userToken}
    };

    return fetch(url, requestOptions)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }
            return response.json();
        })
        .catch(error => {
            console.error('Error fetching patients:', error);
            throw error;
        });
};

export const getPatientAvailableEkgs = async (patientId: number): Promise<PatientAvailableEkg[]> => {
    const url = `${import.meta.env.VITE_API_URL}/ecg-records/patient?patientId=${patientId}`;
    const requestOptions = {
        method: 'GET',
        headers: {'Content-Type': 'application/json', Authorization: 'Bearer ' + userToken}
    };
    return await fetch(url, requestOptions)
        .then(response => {
                if (!response.ok) {
                    throw new Error(`${response.statusText}`);
                }
                return response.json()
            }
        )
        .then((data: PatientAvailableEkg[]) => data)
}

export const uploadEcgFile = async (patientId: number, recordDateString: string, file: File): Promise<void> => {
    const fileToUpload = new FormData();
    fileToUpload.append('file', file);
    const url = `${import.meta.env.VITE_API_URL}/ecg-records/upload?patientId=${patientId}&recordDateString=${recordDateString}`;
    const requestOptions = {
        method: 'POST',
        body: fileToUpload,
        headers: {Authorization: 'Bearer ' + userToken}
    };

    await fetch(url, requestOptions)
        .then(response => {
                if (!response.ok) {
                    throw new Error(`${response.statusText}`);
                }
            }
        );
}

export const analyzeEcg = async (ecgId: number): Promise<number> => {
    const url = `${import.meta.env.VITE_API_URL}/ecg-records/${ecgId}/analyze`;
    const requestOptions = {
        method: 'POST',
        headers: { 'Authorization': 'Bearer ' + userToken }
    };

    try {
        const response = await fetch(url, requestOptions);
        return response.status;
    } catch (error) {
        console.error('Error during ECG analysis:', error);
        return 500;
    }
};


export const fetchEkgAnalysisResults = async (ecgId: number): Promise<any> => {
    const url = `${import.meta.env.VITE_API_URL}/ecg-records/${ecgId}/analysis-results`;
    const requestOptions = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json', // Dodano
            'Authorization': 'Bearer ' + userToken
        }
    };

    return fetch(url, requestOptions)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }
            return response.json();
        })
        .catch(error => {
            console.error('Error fetching EKG analysis results:', error);
            throw error;
        });
};

