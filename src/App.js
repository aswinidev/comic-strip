import { useState, useMemo, useEffect } from 'react';
import './App.css';
import 'font-awesome/css/font-awesome.min.css'
import SearchBar from './components/SearchBar';
import SearchResults from './components/SearchResults';
import ComicStrip from './components/ComicStrip';
import { 
  Dialog, 
  Transition, 
  DialogActions, 
  DialogContent, 
  DialogContentText,
  DialogTitle, Button
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import HomeIcon from '@mui/icons-material/Home';
import Fab from '@mui/material/Fab';


// const ACCESS_KEY = "cRZjxQYkBp7pxM5dQL4B87XDrYxoZP_tpCEce1w0fHw"
// const photo_id = "TspYRqQrErc"
const REGULAR = "https://images.unsplash.com/photo-1593959734793-6e92d102da1e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1MzE4NDR8MHwxfGFsbHx8fHx8fHx8fDE3MDA3MTQ3NDJ8&ixlib=rb-4.0.3&q=80&w=1080"
const SMALL = "https://images.unsplash.com/photo-1593959734793-6e92d102da1e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1MzE4NDR8MHwxfGFsbHx8fHx8fHx8fDE3MDA3MTQ3NDJ8&ixlib=rb-4.0.3&q=80&w=400"

function App() {
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState([]);
  const [visible, setVisible] = useState(true);
  const [dialogVisible, setDialogVisible] = useState(false);
  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  });

  const getBackgroundStyles = () => {
    // axios.get(`https://api.unsplash.com/photos/${photo_id}?client_id=${ACCESS_KEY}`)
    //   .then((response) => {
      return {
        backgroundColor: "#0c2659",
        backgroundImage: `url(${REGULAR}), url(${SMALL})`
      }
      // })
  }

  const handleDisagree = () => {
    setResults([])
    setVisible(true)
    setDialogVisible(false)
    setSearching(false)
  }

  const handleAgree = () => {
    setVisible(false)
    setDialogVisible(false)
    setSearching(false)
  }

  const searchResults = useMemo(
    () => <SearchResults results={results} />, 
    [results]
  );

  const getPrint = () => {
    return (
      <>
        <ComicStrip imageUrls={results}/>
      </>
    )
  }

  useEffect(() => {
    if(results.length === 10){
      setDialogVisible(true);
    }
  }, [results])

  return (
    <div>
      <Fab onClick={(e) => window.location.reload()} color="primary" aria-label="add" style = {{marginLeft: "4px", marginTop: "4px"}}>
        <HomeIcon />
      </Fab>
      { visible ? 
          <div id="app">
            <div id="app-background" className={searching ? 'searching' : ''}>
              <div id="app-background-image" style={getBackgroundStyles()} />
              <div id="app-background-image-filter" />
            </div>
            <SearchBar 
                  handleSearchingCallback = {(value) => setSearching(value)}
                  addToResultsCallback = {(value) => setResults([...results, value])}
                  searching = {searching}
                  results = {results}
            /> 
            <ThemeProvider theme={darkTheme}>
              <Dialog
                  open={dialogVisible}
                  keepMounted
                  aria-describedby="alert-dialog-slide-description"
                >
                  <DialogTitle>{"Create a comic strip?"}</DialogTitle>
                  <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                      A comic strip will be generated with the using the generated images.
                      Would you like to proceed?
                    </DialogContentText>
                    <br></br>
                    <DialogContentText id="alert-dialog-slide-footer">
                      Clicking disagree will redirect you to home page
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleAgree}>Agree</Button>
                    <Button onClick={handleDisagree}>Disagree</Button>
                  </DialogActions>
              </Dialog>
            </ThemeProvider>
            {searchResults}
          </div>
        : getPrint()
      }
    </div>
  );
}

export default App;
