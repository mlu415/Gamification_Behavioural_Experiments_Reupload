//This file handles the logic for edit and create game page.
//The logic is dependant on the URL used to access the page, ie "create".

import { ChangeEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import {
  Button,
  Card,
  Grid,
  IconButton,
  InputAdornment,
  Pagination,
  Slide,
  Slider,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { Box, Container } from '@mui/system';
import styles from './editgamepage.module.scss';
import Signinprompt from '../../components/signinprompt/signinprompt';
import LoadingOverlay from '../../components/loadingoverlay/loadingoverlay';
import Sidebar from '../../components/sidebar/sidebar';
import VerificationPrompt from '../../components/verificationprompt/verificationprompt';
import {
  deleteData,
  getData,
  patchData,
  postData,
  SERVER_URL,
} from '../../backend-functions/interface';
import { Auth } from 'firebase/auth';
import { auth } from 'libs/api-interfaces/src/firebase_config';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useLocation } from 'react-router-dom';
import { defaultGame, Game } from '../../components/game';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import AddIcon from '@mui/icons-material/Add';
import imageNotFound from '../../../assets/image_not_found.png';
import Backbutton from '../../components/backbutton/backbutton';
import { async } from '@firebase/util';
import defaultImg1 from '../../../assets/Items/apple.png';
import defaultImg2 from '../../../assets/Items/blueberry.png';

const EditGamePage = (props: { auth: Auth }) => {
  //Local Variables
  const { state }: any = useLocation();
  const navigate = useNavigate();
  const gameID = useLocation().pathname.split('/')[2];
  const [loggedInUser, stateLoading, stateError] = useAuthState(props.auth);
  const [game, setGame] = useState<Game>(defaultGame);
  const [loading, setLoading] = useState(true);
  const [showConfirmDeletePrompt, setShowConfirmDeletePrompt] = useState(false);
  const [showConfirmSavePrompt, setShowConfirmSavePrompt] = useState(false);
  //array of locally hosted image media. This is required because user has not clicked save.
  const [uploadedGifs, setUploadedGifs] = useState<string[]>(Array(5).fill(''));
  const [itemOneImages, setItemOneImages] = useState<string[]>([]);
  const [itemTwoImages, setItemTwoImages] = useState<string[]>([]);
  //indexes for the image media arrays
  const [itemOnePage, setItemOnePage] = useState(1);
  const [itemTwoPage, setItemTwoPage] = useState(1);
  const [page, setPage] = useState(1);

  //Rendered Variables
  const [gameName, setGameName] = useState('');
  const [surveyLink, setSurveyLink] = useState('');

  //Rendered Variables dependant on level or page selected
  const [fps, setFps] = useState<number>(5);
  const [levelMultiplier, setLevelMultiplier] = useState<number>(8);
  const [levelDuration, setDuration] = useState('0.7');
  const [horizMultiplier, setHorizMultiplier] = useState<number>(0);
  const [vertMultiplier, setVertMultiplier] = useState<number>(0);
  const [itemOneProbability, setItemOneProbability] = useState('75');
  const [itemTwoProbability, setItemTwoProbability] = useState('85');
  //rendered media
  const [uploadedGif, setUploadedGif] = useState('');
  const [renderedItemOne, setRenderedItemOne] = useState('');
  const [renderedItemTwo, setRenderedItemTwo] = useState('');

  const levelMultiplierMarks = [
    {
      value: 0,
      label: '0',
    },
    {
      value: 5,
      label: '5',
    },
    {
      value: 10,
      label: '10',
    },
  ];
  const vertMultiplierMarks = [
    {
      value: -5,
      label: '-5',
    },
    {
      value: 0,
      label: '0',
    },
    {
      value: 5,
      label: '5',
    },
  ];
  const horizMultiplierMarks = [
    {
      value: -5,
      label: '-5',
    },
    {
      value: 0,
      label: '0',
    },
    {
      value: 5,
      label: '5',
    },
  ];

  //on page load, grab data
  useEffect(() => {
    if (loggedInUser || !stateLoading) {
      getGameData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loggedInUser, stateLoading]);

  const getGameData = async () => {
    setLoading(true);
    if (gameID === 'create') {
      setGame(JSON.parse(JSON.stringify(defaultGame)));
      setLoading(false);
      return;
    }
    const response = await getData(`game/${gameID}`);
    if (response.status === 200) {
      console.log(response.status);
      setGame(response.data as Game);
      //preloading the images and their lengths
      setItemOneImages(Array(response.data.items_a.length).fill(''));
      setItemTwoImages(Array(response.data.items_b.length).fill(''));
      preloadImages(response.data.gifs);
      preloadImages(response.data.items_a);
      preloadImages(response.data.items_b);
      setLoading(false);
      return;
    }
  };

  const preloadImages = async (gifsFromServer: string[]) => {
    //preloads the image in browser cache
    gifsFromServer.forEach(async (gif) => {
      if (gif) {
        const img = new Image();
        img.src = SERVER_URL + '/files/' + gif;
      }
    });
  };

  const handleDeleteButton = async () => {
    setLoading(true);
    await deleteData(`game/${gameID}`);
    navigate('/games');
  };

  async function uploadMedia(arrayToChange: any, uploadedMedia: string[]) {
    //uploadedMedia: local blob array
    //arraytoChange: server imageURL array
    let response: any;
    for (const [index, gif] of uploadedMedia.entries()) {
      if (uploadedMedia[index]) {
        const data = new FormData();
        const media = await fetch(gif).then((r) => r.blob());
        data.append('image', media);
        response = await postData(`files`, data);
        if (response.status !== 201) {
          console.log('error: ' + response);
          return;
        }
        arrayToChange[index] = response.data.id;
      }
    }
  }

  const handleSaveButton = async () => {
    setLoading(true);
    let response: any;

    await uploadMedia(game.gifs, uploadedGifs);
    await uploadMedia(game.items_a, itemOneImages);
    await uploadMedia(game.items_b, itemTwoImages);
    if (game.id) {
      console.log('saving game:');
      console.log(game);
      response = await patchData(`game/${gameID}`, game);
      setLoading(false);
      if (response.status !== 200) {
        console.log('error: ' + response);
        console.log(game);
        return;
      }
      navigate('/games');
      return;
    }

    game.link = (Math.random() * 999999).toString() + '.com';
    response = await postData(`game`, game);
    setLoading(false);
    if (response.status !== 201) {
      console.log('error: ' + response);
      return;
    }
    navigate('/games');
  };

  //useEffect for Array Indexing
  useEffect(() => {
    setGameName(game.gameName);
    setFps(game.levels[page - 1]?.fps);
    setLevelMultiplier(game.levels[page - 1]?.itemAMultiplier);
    setDuration(game.levels[page - 1]?.duration.toString());
    setHorizMultiplier(game.levels[page - 1]?.regionMultiplierX);
    setVertMultiplier(game.levels[page - 1]?.regionMultiplierY);
    setItemOneProbability(
      (game.levels[page - 1]?.itemAChance * 100).toString()
    );
    setItemTwoProbability(
      (game.levels[page - 1]?.itemBChance * 100).toString()
    );
    setUploadedGif(uploadedGifs[page - 1]);
    setRenderedItemOne(itemOneImages[itemOnePage - 1]);
    setRenderedItemTwo(itemTwoImages[itemTwoPage - 1]);
    setSurveyLink(game.survey_end ? game.survey_end : '');
  }, [
    page,
    game,
    uploadedGifs,
    itemOneImages,
    itemOnePage,
    itemTwoImages,
    itemTwoPage,
  ]);

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
  };

  const handleFps = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFps(Number(event.target.value));
    game.levels[page - 1].fps = Number(event.target.value);
  };

  const handleSurveyLinkChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSurveyLink(String(event.target.value));
    game.survey_end = event.target.value;
  };

  const handleLevelMultiplierChange = (
    event: Event,
    newValue: number | number[]
  ) => {
    setLevelMultiplier(newValue as number);
    game.levels[page - 1].itemAMultiplier = newValue as number;
    game.levels[page - 1].itemBMultiplier = newValue as number;
  };

  const handleDurationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDuration(event.target.value);
    game.levels[page - 1].duration = Number(event.target.value);
  };

  const handleHorizMultiplierChange = (
    event: Event,
    newValue: number | number[]
  ) => {
    setHorizMultiplier(newValue as number);
    game.levels[page - 1].regionMultiplierX = newValue as number;
  };

  const handleVertMultiplierChange = (
    event: Event,
    newValue: number | number[]
  ) => {
    setVertMultiplier(newValue as number);
    game.levels[page - 1].regionMultiplierY = newValue as number;
  };

  const handleItemOneScoreProb = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (Number(event.target.value) > 100 || Number(event.target.value) < 0) {
      return;
    }
    setItemOneProbability(event.target.value);
    game.levels[page - 1].itemAChance = Number(event.target.value) / 100;
  };

  const handleItemTwoScoreProb = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (Number(event.target.value) > 100 || Number(event.target.value) < 0) {
      return;
    }
    setItemTwoProbability(event.target.value);
    game.levels[page - 1].itemBChance = Number(event.target.value) / 100;
  };

  const handleUploadGif = async (e: any) => {
    if (!e.target.files[0]) {
      return;
    }
    const gif = URL.createObjectURL(e.target.files[0]);
    setUploadedGif(gif);
    uploadedGifs[page - 1] = gif;
  };

  const handleItemOnePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setItemOnePage(value);
  };

  const onItemOneUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) {
      alert('Please select an image');
      return;
    }
    const image = URL.createObjectURL(e.target.files[0]);
    itemOneImages[itemOnePage - 1] = image;
    setRenderedItemOne(image);
  };

  const handleAddNewItemOne = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) {
      alert('Please select an image');
      return;
    }
    const pages = itemOneImages.length;
    const image = URL.createObjectURL(e.target.files[0]);
    setItemOneImages((itemOneImages) => [...itemOneImages, image]);
    itemOneImages[itemOnePage - 1] = image;
    setItemOnePage(pages + 1);
  };

  const handleDeleteItemOne = async () => {
    if (itemOnePage === 1) {
      alert('Please replace this image');
      return;
    }
    if (!itemOneImages[itemOnePage - 1]) {
      game.items_a = game.items_a.filter(
        (_, index) => index !== itemOnePage - 1
      );
    }
    itemOneImages.splice(itemOnePage - 1, 1);
    setItemOnePage(itemOnePage - 1);
  };

  const handleItemTwoPageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setItemTwoPage(value);
  };

  const onItemTwoUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) {
      alert('Please select an image');
      return;
    }
    const image = URL.createObjectURL(e.target.files[0]);
    itemTwoImages[itemTwoPage - 1] = image;
    setRenderedItemTwo(image);
  };

  const handleAddNewItemTwo = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) {
      alert('Please select an image');
      return;
    }
    const pages = itemTwoImages.length;
    const image = URL.createObjectURL(e.target.files[0]);
    setItemTwoImages((itemTwoImages) => [...itemTwoImages, image]);
    itemTwoImages[itemTwoPage - 1] = image;
    setItemTwoPage(pages + 1);
  };

  const handleDeleteItemTwo = async () => {
    if (itemTwoPage === 1) {
      alert('Please replace this image');
      return;
    }
    if (!itemTwoImages[itemTwoPage - 1]) {
      game.items_b = game.items_b.filter(
        (_, index) => index !== itemTwoPage - 1
      );
    }
    itemTwoImages.splice(itemTwoPage - 1, 1);
    setItemTwoPage(itemTwoPage - 1);
  };

  return (
    <div className={styles['background']}>
      <LoadingOverlay status={loading} />
      <Card className={styles['navCard']}>
        <Sidebar />
        <Signinprompt auth={auth} />
        <VerificationPrompt
          message="Are you sure you want to delete the game?"
          open={showConfirmDeletePrompt}
          close={() => setShowConfirmDeletePrompt(false)}
          functionality={() => handleDeleteButton()}
        />
        <VerificationPrompt
          message="Are you sure you want to publish the game?"
          open={showConfirmSavePrompt}
          close={() => setShowConfirmSavePrompt(false)}
          functionality={() => handleSaveButton()}
        />
        <Slide
          direction={state ? state.direction : 'right'}
          in={true}
          mountOnEnter
          unmountOnExit
          timeout={state == null ? 0 : 500}
        >
          <Container className={styles['mainContainer']}>
            <div className={styles['topDiv']}>
              <Backbutton
                location={
                  window.location.pathname === '/game/create'
                    ? '/games'
                    : `/game/${gameID}/details`
                }
              ></Backbutton>
              <Typography className={styles['title']}>
                {' '}
                Game Settings
              </Typography>
              <div className={styles['buttonsDiv']}>
                <div className={styles['iconButton']}>
                  <IconButton
                    className={styles['deleteButton']}
                    onClick={() => {
                      setShowConfirmDeletePrompt(true);
                    }}
                  >
                    <DeleteIcon className={styles['circular-icon']} />
                  </IconButton>
                  <Typography
                    variant="caption"
                    className={styles['deleteButtonText']}
                  >
                    Delete
                  </Typography>
                </div>

                <div className={styles['iconButton']}>
                  <IconButton
                    className={styles['publishButton']}
                    onClick={() => {
                      setShowConfirmSavePrompt(true);
                    }}
                  >
                    <SaveAltIcon className={styles['circular-icon']} />
                  </IconButton>
                  <Typography
                    variant="caption"
                    className={styles['publishButtonText']}
                  >
                    Save
                  </Typography>
                </div>
              </div>
            </div>
            <Card className={styles['gameCard']} raised={true}>
              <div className={styles['changeNameDiv']}>
                <TextField
                  className={styles['gameName']}
                  label="Game Name"
                  variant="outlined"
                  value={gameName || ''}
                  onChange={(e) => {
                    setGameName(e.target.value);
                    game['gameName'] = e.target.value;
                  }}
                />
              </div>
              <div className={styles['postSurveyDiv']}>
                <TextField
                  className={styles['gameName']}
                  label="Post survey link"
                  variant="outlined"
                  value={surveyLink}
                  onChange={handleSurveyLinkChange}
                  InputProps={{
                    startAdornment: (
                      <div className={styles['labelContainer']}>
                        <InputAdornment position="start">
                          <div className={styles['label']}>https://</div>
                        </InputAdornment>
                      </div>
                    ),
                  }}
                />
              </div>
              <Container className={styles['itemContainer']}>
                <div className={styles['itemCard']}>
                  <div className={styles['itemName']}>Item 1</div>
                  <img
                    className={styles['itemImage']}
                    src={
                      renderedItemOne
                        ? renderedItemOne
                        : game.items_a[itemOnePage - 1]
                        ? SERVER_URL + '/files/' + game.items_a[itemOnePage - 1]
                        : defaultImg1
                    }
                    alt={defaultImg1}
                  />
                  <Box className={styles['itemImageBox']}>
                    <Pagination
                      id="levelPagination"
                      count={itemOneImages.length}
                      variant="outlined"
                      page={itemOnePage}
                      siblingCount={0}
                      onChange={handleItemOnePageChange}
                    />
                  </Box>
                  <Box className={styles['itemImageBox']}>
                    <IconButton
                      size="small"
                      component="label"
                      onClick={handleDeleteItemOne}
                    >
                      <DeleteIcon />
                    </IconButton>
                    <IconButton size="small" component="label">
                      <EditIcon />
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={onItemOneUpload}
                      />
                    </IconButton>
                    <IconButton size="small" component="label">
                      <AddIcon />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAddNewItemOne}
                        hidden
                      />
                    </IconButton>
                  </Box>
                </div>
                <div className={styles['itemCard']}>
                  <div className={styles['itemName']}>Item 2</div>
                  <img
                    className={styles['itemImage']}
                    src={
                      renderedItemTwo
                        ? renderedItemTwo
                        : game.items_b[itemTwoPage - 1]
                        ? SERVER_URL + '/files/' + game.items_b[itemTwoPage - 1]
                        : defaultImg2
                    }
                    alt={defaultImg2}
                  />
                  <Box className={styles['itemImageBox']}>
                    <Pagination
                      id="levelPagination"
                      count={itemTwoImages.length}
                      variant="outlined"
                      page={itemTwoPage}
                      siblingCount={0}
                      onChange={handleItemTwoPageChange}
                    />
                  </Box>
                  <Box className={styles['itemImageBox']}>
                    <IconButton
                      size="small"
                      component="label"
                      onClick={handleDeleteItemTwo}
                    >
                      <DeleteIcon />
                    </IconButton>
                    <IconButton size="small" component="label">
                      <EditIcon />
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={onItemTwoUpload}
                      />
                    </IconButton>
                    <IconButton size="small" component="label">
                      <AddIcon />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAddNewItemTwo}
                        hidden
                      />
                    </IconButton>
                  </Box>
                </div>
              </Container>
            </Card>

            <Typography variant="h3" className={styles['subheading']}>
              Level Settings
            </Typography>

            <Card className={styles['gameSettingsCard']} raised={true}>
              <div className={styles['levelTabControl']}>
                <Typography variant="h4">Select Level</Typography>
                <Pagination
                  className={styles['levelPagination']}
                  count={5}
                  size="large"
                  page={page}
                  onChange={handlePageChange}
                />
              </div>

              <Grid container spacing={2}>
                <Grid item xs={7}>
                  <Tooltip
                    title="The speed of the snake. The screen will update roughly 1000/speed seconds."
                    arrow
                  >
                    <div className={styles['gameSettingHeaderTextField']}>
                      {' '}
                      Snake Speed
                    </div>
                  </Tooltip>
                </Grid>
                <Grid item xs={5}>
                  <Container>
                    <TextField
                      type="number"
                      fullWidth
                      size="small"
                      value={fps || 0}
                      InputProps={{ inputProps: { min: 1.0, max: 20 } }}
                      onChange={handleFps}
                    />
                  </Container>
                </Grid>
                <Grid item xs={7}>
                  <Tooltip title="How long the level lasts for." arrow>
                    <div className={styles['gameSettingHeaderTextField']}>
                      {' '}
                      Level Duration
                    </div>
                  </Tooltip>
                </Grid>
                <Grid item xs={5}>
                  <Container>
                    <TextField
                      id="number"
                      type="number"
                      fullWidth
                      size="small"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="start">
                            seconds
                          </InputAdornment>
                        ),
                        inputProps: { min: 0 },
                      }}
                      value={levelDuration}
                      onChange={handleDurationChange}
                    />
                  </Container>
                </Grid>
                <Grid item xs={7}>
                  <Tooltip
                    title="The probability that we gain points when eating item 1."
                    arrow
                  >
                    <div className={styles['gameSettingHeaderTextField']}>
                      {' '}
                      Item 1 Probability (%)
                    </div>
                  </Tooltip>
                </Grid>
                <Grid item xs={5}>
                  <Container>
                    <TextField
                      type="number"
                      fullWidth
                      size="small"
                      value={itemOneProbability}
                      InputProps={{ inputProps: { min: 0.0, max: 100 } }}
                      onChange={handleItemOneScoreProb}
                    />
                  </Container>
                </Grid>
                <Grid item xs={7}>
                  <Tooltip
                    title="The probability that we gain points when eating item 2."
                    arrow
                  >
                    <div className={styles['gameSettingHeaderTextField']}>
                      {' '}
                      Item 2 Probability (%)
                    </div>
                  </Tooltip>
                </Grid>
                <Grid item xs={5}>
                  <Container>
                    <TextField
                      type="number"
                      fullWidth
                      size="small"
                      value={itemTwoProbability}
                      InputProps={{ inputProps: { min: 0.0, max: 100 } }}
                      onChange={handleItemTwoScoreProb}
                    />
                  </Container>
                </Grid>
                <Grid item xs={7}>
                  <Tooltip
                    title="Multiplies the score gained by the multiplier. The base score is 100."
                    arrow
                  >
                    <div className={styles['gameSettingHeaderSliderText']}>
                      {' '}
                      Level Multiplier ({levelMultiplier})
                    </div>
                  </Tooltip>
                </Grid>
                <Grid item xs={5}>
                  <Container>
                    <Slider
                      defaultValue={1}
                      step={1}
                      min={0}
                      max={10}
                      valueLabelDisplay="auto"
                      value={levelMultiplier || 1}
                      marks={levelMultiplierMarks}
                      sx={{
                        color: '#5553FE',
                        '& .MuiSlider-thumb': {
                          height: 25,
                          width: 25,
                          color: 'white',
                        },
                        '& .MuiSlider-rail': {
                          opacity: 0.5,
                          backgroundColor: '#bfbfbf',
                          height: '5px',
                        },
                      }}
                      onChange={handleLevelMultiplierChange}
                    />
                  </Container>
                </Grid>

                <Grid item xs={7}>
                  <Tooltip
                    title="If the multiplier is negative, players will gain more points while in the left hand
                    side of the screen. If the multiplier is positive, players will gain more points on the right hand
                    side of the screen. The amount of points gained will be proportional to the multiplier."
                    arrow
                  >
                    <div className={styles['gameSettingHeaderSliderText']}>
                      {' '}
                      Horizontal Multiplier ({horizMultiplier})
                    </div>
                  </Tooltip>
                </Grid>
                <Grid item xs={5}>
                  <Container>
                    <Slider
                      step={1}
                      min={-5}
                      max={5}
                      valueLabelDisplay="auto"
                      value={horizMultiplier}
                      marks={horizMultiplierMarks}
                      sx={{
                        color: '#5553FE',
                        '& .MuiSlider-thumb': {
                          height: 25,
                          width: 25,
                          color: 'white',
                        },
                        '& .MuiSlider-rail': {
                          opacity: 0.5,
                          backgroundColor: '#bfbfbf',
                          height: '5px',
                        },
                      }}
                      onChange={handleHorizMultiplierChange}
                    />
                  </Container>
                </Grid>
                <Grid item xs={7}>
                  <Tooltip
                    title="If the multiplier is negative, players will gain more points while in the bottom
                      half of the screen. If the multiplier is positive, players will gain more points on the top half
                      of the screen. The amount of points gained will be proportional to the multiplier."
                    arrow
                  >
                    <div className={styles['gameSettingHeaderSliderText']}>
                      {' '}
                      Vertical Multiplier ({vertMultiplier})
                    </div>
                  </Tooltip>
                </Grid>
                <Grid item xs={5}>
                  <Container>
                    <Slider
                      step={1}
                      min={-5}
                      max={5}
                      valueLabelDisplay="auto"
                      value={vertMultiplier}
                      onChange={handleVertMultiplierChange}
                      marks={vertMultiplierMarks}
                      sx={{
                        color: '#5553FE',
                        '& .MuiSlider-thumb': {
                          height: 25,
                          width: 25,
                          color: 'white',
                        },
                        '& .MuiSlider-rail': {
                          opacity: 0.5,
                          backgroundColor: '#bfbfbf',
                          height: '5px',
                        },
                      }}
                    />
                  </Container>
                </Grid>
                <Grid item xs={7}>
                  <Tooltip
                    title="The GIF that is displayed when the level ends."
                    arrow
                  >
                    <div className={styles['gameSettingHeaderTextField']}>
                      Level Up Message
                    </div>
                  </Tooltip>
                </Grid>
                <Grid item xs={5}>
                  <img
                    className={styles['levelGif']}
                    src={
                      uploadedGif
                        ? uploadedGif
                        : game.gifs[page - 1]
                        ? SERVER_URL + '/files/' + game.gifs[page - 1]
                        : imageNotFound
                    }
                    alt={imageNotFound}
                  />
                  <Button
                    className={styles['uploadGif']}
                    variant="outlined"
                    component="label"
                  >
                    Upload Gif
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleUploadGif}
                      hidden
                    />
                  </Button>
                </Grid>
              </Grid>
            </Card>
          </Container>
        </Slide>
      </Card>
    </div>
  );
};

export default EditGamePage;
