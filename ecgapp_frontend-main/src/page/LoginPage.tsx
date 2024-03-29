import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import {login} from "../fetch/AuthenticationControllerFetches.ts";


export default function LoginPage() {
    const [isError, setIsError] = React.useState<boolean>(false);
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const loginData = {
            userName: data.get('userName') as string,
            password: data.get('password') as string,
        };
        if (loginData.userName === null || loginData.password === null) {
            return;
        }
        login(loginData.userName, loginData.password).then((response) => {
            localStorage.setItem("jwt", response.access_token);
            localStorage.setItem("username", loginData.userName);
            setIsError(false);
            window.open("/", "_self")
        }).catch((error) => {
            setIsError(true);
            console.log(error)
        });
    };

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline/>
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Avatar sx={{m: 1, bgcolor: 'primary.main'}}>
                    <LockOutlinedIcon/>
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign in
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{mt: 1}}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="userName"
                        label="userName"
                        name="userName"
                        autoComplete="userName"
                        autoFocus
                        error={isError}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        error={isError}
                        helperText={isError ? "Incorrect userName or password" : ""}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{mt: 3, mb: 2}}
                    >
                        Sign In
                    </Button>
                    <Grid container>
                        {/*<Grid item xs>*/}
                        {/*    <Link href="#" variant="body2">*/}
                        {/*        Forgot password?*/}
                        {/*    </Link>*/}
                        {/*</Grid>*/}
                    </Grid>
                </Box>
            </Box>
        </Container>
    );
}