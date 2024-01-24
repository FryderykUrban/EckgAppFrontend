import React, { useCallback, useEffect, useState } from "react";
import { Box, CircularProgress, MenuItem, TextField, Button } from "@mui/material";
import { EkgChartData, getChart, getPatientAvailableEkgs, analyzeEcg, fetchEkgAnalysisResults } from "../fetch/EkgControllerFetches";
import { PatientAvailableEkg } from "../model/PatientAvailableEkg";
import Chart from "../component/Chart";
import {FileUpload} from "../component/FileUpload"; // Upewnij się, że komponent jest właściwie zaimportowany

interface ChartPageProps {
    patientId: number;
}

export const ChartPage = ({ patientId }: ChartPageProps) => {
    const [isChartLoading, setIsChartLoading] = useState(false);
    const [chartData, setChartData] = useState<EkgChartData[]>([]);
    const [from, setFrom] = useState("0.0");
    const [to, setTo] = useState("25.0");
    const [isNumberError, setIsNumberError] = useState(false);
    const [patientAvailableEkgs, setPatientAvailableEkgs] = useState<PatientAvailableEkg[]>([]);
    const [selectedEkgId, setSelectedEkgId] = useState<number | "">(0);
    const [isAnalysisLoading, setIsAnalysisLoading] = useState(false);
    const [ekgAnalysisResults, setEkgAnalysisResults] = useState<any>(null);

    const refreshEkgList = useCallback(async () => {
        const ekgsData = await getPatientAvailableEkgs(patientId);
        setPatientAvailableEkgs(ekgsData);
        if (ekgsData.length > 0) {
            setSelectedEkgId(ekgsData[0].ecgId);
        }
    }, [patientId]);

    useEffect(() => {
        refreshEkgList().catch(console.error);
    }, [refreshEkgList]);

    useEffect(() => {
        if (selectedEkgId) {
            getChartByPeriod();
            fetchEkgAnalysisResults(selectedEkgId)
                .then(data => {
                    if (data) {
                        setEkgAnalysisResults(data);
                    }
                })
                .catch(console.error);
        }
    }, [selectedEkgId]);

    const getChartByPeriod = async () => {
        if (selectedEkgId) {
            setIsChartLoading(true);
            try {
                const response = await getChart(selectedEkgId, from, to);
                setChartData(response);
                setIsNumberError(false);
            } catch (error) {
                console.error(error);
                setIsNumberError(true);
            } finally {
                setIsChartLoading(false);
            }
        }
    };

    const handleChooseEkg = (event: React.ChangeEvent<HTMLInputElement>) => {
        const chosenEkgId = Number(event.target.value);
        if (!isNaN(chosenEkgId)) {
            setSelectedEkgId(chosenEkgId);
            setEkgAnalysisResults(null);
            setFrom("0.0");
            setTo("25.0");
    
            fetchEkgAnalysisResults(chosenEkgId)
                .then(data => {
                    if (data) {
                        setEkgAnalysisResults(data);
                    }
                })
                .catch(console.error);
    
            getChart(chosenEkgId, "0.0", "25.0");
        }
    };
    
    const handleAnalyzeEcg = async () => {
        if (selectedEkgId && !ekgAnalysisResults) {
            setIsAnalysisLoading(true);
            const status = await analyzeEcg(selectedEkgId);
            if (status === 200) {
                try {
                    const fetchedResults = await fetchEkgAnalysisResults(selectedEkgId);
                    setEkgAnalysisResults(fetchedResults);
                } catch (error) {
                    alert('Error occurred during fetching ECG analysis results.');
                }
            } else {
                alert('Error occurred during ECG analysis.');
            }
            setIsAnalysisLoading(false);
        } else {
            alert('Analysis has already been performed or no ECG selected.');
        }
    };
    
    
    
    
    

    const handleIntervalSelection = (interval: [number, number]) => {
        setFrom(interval[0].toString());
        setTo(interval[1].toString());
        getChartByPeriod(); // Refresh chart with selected interval
    };

return (
    <Box sx={{ pt: 8 }}> {/* Dodano padding-top, aby dodać odstęp między AppBar a treścią strony */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
            <Box sx={{ flexGrow: 1, mr: 2 }}>
                {!isChartLoading && chartData && <Chart chartData={chartData} />}
                {isChartLoading && <CircularProgress />}
            </Box>
            <Box sx={{ minWidth: 250 }}>
                    {patientAvailableEkgs.length > 0 ? (
                        <TextField
                            id="ekg"
                            select
                            label="Chosen Ekg Data"
                            value={selectedEkgId}
                            onChange={handleChooseEkg}
                            helperText="Please select EKG data"
                            fullWidth
                            variant="outlined"
                        >
                            {patientAvailableEkgs.map((ekg) => (
                                <MenuItem key={ekg.ecgId} value={ekg.ecgId}>
                                    {new Date(ekg.recordDate).toLocaleDateString()}
                                </MenuItem>
                            ))}
                        </TextField>

                    ) : (
                        <TextField
                            id="ekg"
                            select
                            label="Empty list (add record)"
                            value=""
                            name="ekg"
                            autoComplete="ekg"
                            helperText="No EKG data available"
                            fullWidth
                            variant="outlined"
                            disabled
                        />
                    )}
                    <TextField
                        error={isNumberError}
                        id="from"
                        label="From"
                        value={from}
                        variant="outlined"
                        helperText="Value needs to be a positive number."
                        fullWidth
                        onChange={(event) => setFrom(event.target.value)}
                        sx={{ mt: 2 }}
                    />
                    <TextField
                        error={isNumberError}
                        id="to"
                        label="To"
                        value={to}
                        variant="outlined"
                        helperText="Value needs to be a positive number."
                        fullWidth
                        onChange={(event) => setTo(event.target.value)}
                        sx={{ mt: 2 }}
                    />
                    <Box sx={{ mb: 2, mt: 2 }}>
                        <Button variant="contained" onClick={getChartByPeriod}>
                            Get Chart
                        </Button>
                    </Box>
                    <Box sx={{ mb: 4 }}>
                        <Button variant="contained" onClick={handleAnalyzeEcg} disabled={isAnalysisLoading || !!ekgAnalysisResults}>
                            Analyze ECG
                        </Button>
                        {isAnalysisLoading && <CircularProgress />}
                    </Box>
                <FileUpload patientId={patientId} recordDateString="2020-12-17" onFileUpload={refreshEkgList} />
            </Box>
        </Box>
        {ekgAnalysisResults && (
            <Box sx={{ width: '100%', mt: 2 }}>
                <h3>Diagnosis: {ekgAnalysisResults.diagnosis}</h3>
                <h4>Intervals indicating abnormalities:</h4> {/* Dodany napis */}
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
                    {ekgAnalysisResults.arrhythmiaIntervals.map((interval, index) => (
                        <Button key={index} variant="outlined" onClick={() => handleIntervalSelection(interval)}>
                            Interval {index + 1}
                        </Button>
                    ))}
                </Box>
            </Box>
        )}
    </Box>
);
};


export default ChartPage;
