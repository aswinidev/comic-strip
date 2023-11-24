import { MenuItem, Menu, Button } from "@mui/material";
import jsPDF from "jspdf";
import React, { useEffect, useRef, useState } from "react";
import { styled, alpha } from '@mui/material/styles';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import DownloadIcon from '@mui/icons-material/Download';
import ImageIcon from '@mui/icons-material/Image';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ShareIcon from '@mui/icons-material/Share';
import Stack from '@mui/material/Stack';
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from '@mui/material/Alert';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const darkTheme = createTheme({
  palette: {
    mode: 'dark'
  },
  
});

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const StyledMenu = styled((props) => (
    <Menu
      elevation={0}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      {...props}
    />
    ))(({ theme }) => ({
    '& .MuiPaper-root': {
        borderRadius: 6,
        marginTop: theme.spacing(1),
        minWidth: 180,
        color:
        theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
        boxShadow:
        'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
        '& .MuiMenu-list': {
        padding: '4px 0',
        },
        '& .MuiMenuItem-root': {
        '& .MuiSvgIcon-root': {
            fontSize: 18,
            color: theme.palette.text.secondary,
            marginRight: theme.spacing(1.5),
        },
        '&:active': {
            backgroundColor: alpha(
            theme.palette.primary.main,
            theme.palette.action.selectedOpacity,
            ),
        },
        },
    },
}));

export default function ComicStrip (props) {
    const { imageUrls } = props;
    const ref = useRef(null);
    const [openAlert, setOpenAlert] = useState(false);
    
    function loadImage(url) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = url;
        });
    }

    async function arrangeImages() {
        const canvas = ref.current;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0,0,950,1150);

        var img = await loadImage(imageUrls[0]);
        ctx.drawImage(img, 15, 15, 200, 300);
        
        img = await loadImage(imageUrls[1]);
        ctx.drawImage(img, 225, 15, 500, 300);

        img = await loadImage(imageUrls[2]);
        ctx.drawImage(img, 735, 15, 200, 300);

        img = await loadImage(imageUrls[3]);
        ctx.drawImage(img, 15, 325, 300, 400);

        img = await loadImage(imageUrls[4]);
        ctx.drawImage(img, 325, 325, 300, 195);

        img = await loadImage(imageUrls[5]);
        ctx.drawImage(img, 635, 325, 300, 195);

        img = await loadImage(imageUrls[6]);
        ctx.drawImage(img, 325, 530, 610, 195);

        img = await loadImage(imageUrls[7]);
        ctx.drawImage(img, 15, 735, 450, 195);

        img = await loadImage(imageUrls[8]);
        ctx.drawImage(img, 15, 940, 450, 195);

        img = await loadImage(imageUrls[9]);
        ctx.drawImage(img, 475, 735, 460, 400);
    }

    async function downloadAsImage () {
        const canvas = ref.current;
        var link = document.createElement('a');
        link.download = 'canvas-as-image.png';
        link.href = canvas.toDataURL()
        link.click();
    }

    async function downloadAsPDF() {
        const canvas = ref.current;
        const canvasDataUrl = canvas.toDataURL('image/jpeg');
        const pdf = new jsPDF();
        let width = pdf.internal.pageSize.getWidth();
        let height = pdf.internal.pageSize.getHeight();
        pdf.addImage(canvasDataUrl, 'JPEG', 0, 0, width, height);
        pdf.save('canvas-as-pdf.pdf');
    }

    const getShareLink = () => {
        const canvas = ref.current;
        var link = document.createElement('a');
        link.download = 'filename.png';
        link.href = canvas.toDataURL()
        console.log(link.href);
        return link.href;
    }

    const handleShare = () => {
        const url = getShareLink();
        navigator.clipboard.writeText(url);
        setOpenAlert(true);
    }

    const closeAlert = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
    
        setOpenAlert(false);
        console.log("close called")
    };

    useEffect(() => {
        arrangeImages();
    }, [])
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    return (
        // <div style={{backgroundColor: "#101418"}}>
            <ThemeProvider theme={darkTheme}>
                <Snackbar open={openAlert} autoHideDuration={6000} onClose={closeAlert} anchorOrigin={{ vertical: 'top', horizontal: 'right' }} >
                    <Alert onClose={closeAlert} severity="success" sx={{ width: '100%' }}>
                        Link copied to clipboard!
                    </Alert>
                </Snackbar>
                <Stack 
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={{ xs: 1, sm: 2, md: 4 }}
                    justifyContent="center"
                    alignItems="center"
                    mt={2}
                >
                    <Button
                        // style={{marginTop: "50px"}}
                        id="demo-customized-button"
                        aria-controls={open ? 'demo-customized-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                        variant="contained"
                        disableElevation
                        onClick={handleClick}
                        endIcon={<KeyboardArrowDownIcon />}
                        startIcon={<DownloadIcon />}
                        >
                        Download
                    </Button>
                    <StyledMenu
                        id="demo-customized-menu"
                        MenuListProps={{
                            'aria-labelledby': 'demo-customized-button',
                        }}
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                    >
                        <MenuItem onClick={downloadAsImage}>
                            <ImageIcon />
                            PNG
                        </MenuItem>
                        <MenuItem onClick={downloadAsPDF}>
                            <PictureAsPdfIcon />
                            PDF
                        </MenuItem>
                    </StyledMenu>

                    <Button 
                        // style={{marginTop: "50px"}} 
                        variant="contained" 
                        startIcon={<ShareIcon />}
                        onClick = {handleShare}
                    >
                        Share Link
                    </Button>
                </Stack>
                <Stack 
                    direction = {{ xs: 'column', sm: 'row' }}
                    spacing = {{ xs: 1, sm: 2, md: 4 }}
                    justifyContent = "center"
                    alignItems = "center"
                    mt = {2}
                    mb = {2}
                >
                    <canvas ref={ref} width="950" height="1150"></canvas>
                </Stack>
            </ThemeProvider>
        // </div>
    )
}