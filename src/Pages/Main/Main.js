import AppBar from "../../Components/TopBar/TopBar";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import DropZone from "../../Components/DropZone/DropZone";

export default function Main() {
  return (
    <div>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <AppBar />
          </Grid>
          <Grid item xs={0} md={3}></Grid>
          <Grid item xs={12} md={6}>
            <DropZone />
          </Grid>
          <Grid item xs={0} md={3}></Grid>
        </Grid>
      </Box>
    </div>
  );
}
