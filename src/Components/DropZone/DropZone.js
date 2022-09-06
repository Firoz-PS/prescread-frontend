import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { makeStyles } from "@mui/styles";
import {
  LinearProgress,
  Box,
  IconButton,
  Paper,
  Button,
  Grid,
  Typography,
} from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";

//import UploadService from "../../services/upload-files.service";
import uploadFileToBlob from "../../azure/storage";


const useStyles = makeStyles({
  dropareacontainer: {
    padding: "20px",
    margin: "60px 30px",
  },
  droparea: {
    border: "2px dashed #ccc",
    padding: "20px",
  },
  progressBar: {
    height: "10px",
    borderRadius: "5px",
    backgroundColor: "#ccc",
  },
  selectedFile: {
    border: "2px solid #ccc",
    padding: "3px 20px",
  },
  uploadButton: {
    marginTop: "20px",
  },
});

export default function DropZone(){
  const maxSize = 3145728;
  const classes = useStyles();
  const [file, setFile] = useState({
    currentFile: undefined,
    progress: 0,
  });
  const [message, setMessage] = useState({
    text: undefined,
    color: undefined,
  });

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length === 1) {
      const currentFile = acceptedFiles[0];
      if (currentFile.size > maxSize) {
        setMessage({
          text: "File size is too big. Max size is 3MB.",
          color: "red",
        });
        setFile({
          currentFile: undefined,
          progress: 0,
        });
      } else {
        setFile({
          ...file,
          currentFile,
        });
        setMessage({
          text: undefined,
          color: undefined,
        });
      }
    } else if (acceptedFiles.length > 1) {
      setFile({
        ...file,
        currentFile: undefined,
      });
      setMessage({
        text: "You can only upload one file at a time",
        color: "red",
      });
    }
  }, [file]);

  const uploadFile = async() => {
    if (file.currentFile) {
      setMessage({
        text: "Uploading...",
        color: "green",
      });
      try {
        const blobUrl = await uploadFileToBlob(file.currentFile);
        // blob url should print in italics
        setMessage({
          text: "File uploaded successfully in blob storage. Blob URL: " + blobUrl,
          color: "green",
        });
        console.log(blobUrl);
      } catch (error) {
        setMessage({
          text: "Could not upload the file",
          color: "red",
        });
        console.log(error);
      }
      // UploadService.upload(file.currentFile, (event) => {
      //   setFile({
      //     ...file,
      //     progress: Math.round((100 * event.loaded) / event.total),
      //   });
      // })
      //   .then((response) => {
      //     setMessage({
      //       text: response.data.message,
      //       color: response.status === 200 ? "green" : "red",
      //     });
      //   })
      //   .catch((error) => {
      //     setMessage({
      //       text: "Could not upload the file",
      //       color: "red",
      //     });
      //   });
    }
  };

  const handleRemoveFile = () => {
    setFile({
      ...file,
      currentFile: undefined,
      progress: 0,
    });
    setMessage({
      text: undefined,
      color: undefined,
    });
  };

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragReject,
    open,
  } = useDropzone({
    onDrop,
    accept: "image/jpeg, image/png, image/jpg",
    maxSize: { maxSize },
    noClick: true,
    noKeyboard: true,
  });

  return (
    <Paper className={classes.dropareacontainer}>
      {file.currentFile && (
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Box sx={{ width: "100%", mr: 1 }}>
            <LinearProgress
              variant="determinate"
              value={file.progress}
              className={classes.progressBar}
            />
          </Box>
          <Box sx={{ minWidth: 35 }}>
            <Typography variant="body2" color="text.secondary">{`${Math.round(
              file.progress
            )}%`}</Typography>
          </Box>
        </Box>
      )}
      <div {...getRootProps()} className={classes.droparea}>
        <input {...getInputProps()} />
        <Grid container direction="column" spacing={2}>
          <Grid
            item
            container
            direction="column"
            alignItems="center"
            spacing={1}
          >
            <Grid item>
              <Typography variant="subtitle1" align="center">
                jpeg, jpg, and png files are accepted. <br /> (max-size per
                file: 3MB)
              </Typography>
            </Grid>
            {file.currentFile ? (
              <Grid item>
                <Box
                  sx={{ display: "flex", alignItems: "center" }}
                  className={classes.selectedFile}
                >
                  <Box sx={{ mr: 1 }}>
                    <Typography variant="h6" align="center">
                      {file.currentFile.name}
                    </Typography>
                  </Box>
                  <Box sx={{ minWidth: 35 }}>
                    <IconButton color="error">
                      <CancelIcon onClick={handleRemoveFile} />
                    </IconButton>
                  </Box>
                </Box>
              </Grid>
            ) : (
              <Grid item>
                <Typography
                  variant="h6"
                  align="center"
                  sx={{
                    color: isDragActive ? (isDragReject ? "red" : "green") : "",
                  }}
                >
                  {isDragActive
                    ? isDragReject
                      ? "File type not accepted, sorry!"
                      : "Drop File here ..."
                    : "Drag 'n' drop File here, or:"}
                </Typography>
              </Grid>
            )}
            {!file.currentFile && (
              <Grid item>
                <Button onClick={open} variant="contained" color="primary">
                  Select File
                </Button>
              </Grid>
            )}
          </Grid>
        </Grid>
      </div>
      <Box sx={{ alignItems: "center" }}>
        <Grid container direction="column" spacing={2} alignItems="center">
          <Grid item>
            <Button
              disabled={!file.currentFile}
              onClick={uploadFile}
              color="success"
              variant="contained"
              className={classes.uploadButton}
            >
              Upload
            </Button>
          </Grid>
          <Grid item>
            {message.text && (
              <Typography
                variant="subtitle1"
                align="center"
                sx={{
                  color: message.color,
                }}
              >
                {message.text}
              </Typography>
            )}
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
}
