import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import {Link} from "@mui/material";
import HomeIcon from '@mui/icons-material/Home';
import LogoutIcon from '@mui/icons-material/Logout';


export default function MyAppBar() {

    return (
        <Box sx={{flexGrow: 1, width: "100%"}}>
            <AppBar position="absolute" sx={{width:"100%", marginBottom: "2%"}}>

                <Toolbar>
                    <Link href={"/"} underline="none" color="inherit">
                        <HomeIcon style={{color: 'white'}}/>
                    </Link>
                    <LogoutIcon onClick={() => {window.localStorage.clear();
                    window.open("/login", "_self")}} style={{position: "absolute", left: "95%"}}/>
                </Toolbar>
 
            </AppBar>
        </Box>
    );
}