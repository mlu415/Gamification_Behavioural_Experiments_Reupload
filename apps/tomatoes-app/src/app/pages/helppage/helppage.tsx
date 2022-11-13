import styles from './helppage.module.scss';
import Sidebar from '../../components/sidebar/sidebar';
import {
  Card,
  Container,
  Typography,
  Box,
  Button,
  Grid,
  LinearProgress,
  Paper,
  Slide,
  List,
  ListItem,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@mui/material';
import Signinprompt from '../../components/signinprompt/signinprompt';
import { Auth } from 'firebase/auth';
import { auth } from 'libs/api-interfaces/src/firebase_config';
import helpImage from '../../../assets/UI/helppage.jpg';
import helpgamelist from '../../../assets/UI/helpgamelist.png';
import helpPostGameSurvey from '../../../assets/UI/helpsurvey.png';
import helpEditGame from '../../../assets/UI/helpeditgame.jpg';
import helpEditGameConfigurations from '../../../assets/UI/helplevelsettings.jpg';
import helpGame from '../../../assets/UI/helpgame.png';
import helpPlayerRecord from '../../../assets/UI/helpplayerrecord.png';
// import helpLandingPage from '../../../assets/UI/helplandingpage.png';
import helpGameDetails from '../../../assets/UI/helpgamedetails.png';
import helpConsent from '../../../assets/UI/helpconsent.png';
import helpLeaderboard from '../../../assets/UI/helpleaderboard.png';
import helpSurveyToGame from '../../../assets/UI/helpsurveytogame.jpg';
import helpSurveyToGameForm from '../../../assets/UI/helpsurveytogameform.jpg';
import helpSaveGame from '../../../assets/UI/helpsavegame.jpg';
import helpPlayerList from '../../../assets/UI/gameplayerlist.png';
import helpEmail from '../../../assets/UI/helpemailaddress.png';
import helpCongrats from '../../../assets/UI/helpcongrats.png';
import helpUsername from '../../../assets/UI/helpusername.png';
import helpExperimenteeSurvey from '../../../assets/UI/helpexperimenteesurvey.png';

/* eslint-disable-next-line */
export interface HelppageProps {}

export function Helppage(props: HelppageProps) {
  return (
    <div className={styles['background']}>
      <Signinprompt auth={auth} />
      <Card className={styles['navCard']}>
        <Sidebar />

        <Container className={styles['contentParent']}>
          <div className={styles['topDiv']}>
            <Typography className={styles['Title']} variant="h3">
              Welcome to the Help Page
            </Typography>
          </div>

          <Container className={styles['content']}>
            {/* <Card className={styles['gameSettingsCard']}> */}
            <Container className={styles['section']}>
              <Typography className={styles['header']} variant="h2">
                About the Game
              </Typography>
              <Container className={styles['profileParentContainer']}>
                <Container className={styles['helpImageCard']}>
                  <img
                    className={styles['img']}
                    src={helpImage}
                    alt="helpPageImage"
                  />
                </Container>
                <Container className={styles['helpTextCard']}>
                  <Typography
                    className={styles['intro']}
                    align="center"
                    variant="body1"
                  >
                    This Web App was created for Dr Sarah Cowie and her
                    researchers to collect data from participants on human
                    learning mechanisms. Human learning is important to society
                    as it allows people to share knowledge, agree on mutual
                    values, and understand one another better.
                  </Typography>
                </Container>
              </Container>
            </Container>

            <div>
              <Container className={styles['section']}>
                <Typography className={styles['header']} variant="h2">
                  Game List Page
                </Typography>
                <Container className={styles['imageContainer']}>
                  <img
                    className={styles['img']}
                    src={helpgamelist}
                    alt="example game list"
                  />
                  <Typography className={styles['body']}>
                    After a successful log in, the user is directed to a game
                    list page. This page displays all created games linked to
                    the account If this is the first time the experimenter has
                    logged in there will be no games displayed.
                  </Typography>
                </Container>
                <Container></Container>
              </Container>

              <Container className={styles['section']}>
                <Typography className={styles['header']} variant="h2">
                  Creating and Editing Games
                </Typography>
                <Container className={styles['imageContainer']}>
                  <img
                    className={styles['img']}
                    src={helpEditGame}
                    alt="example game list"
                  />

                  <Typography className={styles['body']}>
                    To create a new game, click "Create new game" in the top
                    right hand corner
                  </Typography>
                  <Typography className={styles['body']}>&nbsp;</Typography>
                  <Typography className={styles['body']}>
                    To change the name of the game, select the game title field
                    at the top middle of the page and rename as desired. Food
                    item images can be uploaded for each item, these will be
                    randomly generated for each appearance.
                  </Typography>
                </Container>

                <Container className={styles['imageContainer']}>
                  <img
                    className={styles['img']}
                    src={helpEditGameConfigurations}
                    alt="example game configurations"
                  />
                  <Typography className={styles['body']}>
                    There are by default five levels available. Each level has
                    unique game configurations:
                  </Typography>
                </Container>
                <Container className={styles['imageContainer']}>
                  <Paper>
                    <Table>
                      <TableHead className={styles['tableHead']}>
                        <TableRow>
                          <TableCell>Game Configurations</TableCell>
                          <TableCell align="left">Description</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          <TableCell align="left">Snake Speed</TableCell>
                          <TableCell align="left">
                            Controls the speed of the snake
                          </TableCell>
                        </TableRow>

                        <TableRow>
                          <TableCell align="left">Level Duration</TableCell>
                          <TableCell align="left">
                            Sets how long the level will run for
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell align="left">
                            Item Score Probability
                          </TableCell>
                          <TableCell align="left">
                            Controls the probability for Item 1 to reward
                            points. The chance of Item 2 rewarding points is the
                            reciprocal. As an example if the probability of Item
                            1 is set to 35% then Item 2 has a 65% chance of
                            rewarding points
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell align="left">Level Multiplier</TableCell>
                          <TableCell align="left">
                            Adds points level modifier to the selected level
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell align="left">Level Up Message</TableCell>
                          <TableCell align="left">
                            Allows the experimenter to add a gif or an image
                            between levels
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </Paper>
                  <Typography className={styles['body']}>&nbsp;</Typography>
                  <Typography className={styles['body']}>
                    After updating the configurations, click save to apply
                    changes
                  </Typography>
                </Container>
              </Container>

              <Container className={styles['section']}>
                <Typography className={styles['header']} variant="h2">
                  Linking in the Survey
                </Typography>
                <Container className={styles['imageContainer']}>
                  <img
                    className={styles['img']}
                    src={helpPostGameSurvey}
                    alt="ExamplePostGameSurvey"
                  />
                  <Typography className={styles['body']}>
                    When creating the game, It is important to link in a post
                    game survey with the behavioural questions to record the
                    post game information, an example of such a form is found
                    above.
                  </Typography>
                  <Typography className={styles['body']}>&nbsp;</Typography>{' '}
                  <Typography className={styles['body']}>
                    Fill in the google form with your desired questions,
                  </Typography>
                  <img
                    className={styles['img']}
                    src={helpSurveyToGame}
                    alt="ExamplePostGameSurvey"
                  />
                  <Typography className={styles['body']}>
                    Navigate to the settings tab, and click edit the
                    "Confirmation Message"
                  </Typography>
                  <Typography className={styles['body']}>&nbsp;</Typography>{' '}
                  <Typography className={styles['body']}>
                    {' '}
                    Copy and paste the following into the text field
                  </Typography>
                  <Typography className={styles['body']}>
                    &nbsp;
                  </Typography>{' '}
                  <Typography className={styles['link']}>
                    {' '}
                    Thank you for submitting, please click the following link to
                    submit your email address for your reward
                    http://d390os3xijobxf.cloudfront.net/emailSubmit
                  </Typography>
                  <Typography className={styles['body']}>
                    &nbsp;
                  </Typography>{' '}
                  <img
                    className={styles['img']}
                    src={helpSurveyToGameForm}
                    alt="ExamplePostGameSurvey"
                  />
                  <Typography className={styles['body']}>
                    Click 'Send Form' in the top right hand corner of the form,
                    and copy the link url highlighted, paste this link into the
                    post game survey field in the url
                  </Typography>
                </Container>
              </Container>

              <Container className={styles['section']}>
                <Typography className={styles['header']} variant="h2">
                  Deploying the Game
                </Typography>
                <Container className={styles['imageContainer']}>
                  <img
                    className={styles['img']}
                    src={helpConsent}
                    alt="Exampleconsent "
                  />
                  <Typography className={styles['body']}>
                    Awesome! you are ready to deploy your experiment, copy the
                    survey link in the game details page and send out to your
                    desired recipents.
                  </Typography>
                  <Typography className={styles['body']}>&nbsp;</Typography>{' '}
                  <Typography className={styles['body']}>
                    {' '}
                    This link will direct the participants to the consent form
                    After clicking "I agree" the participants will be redirected
                    to the game
                  </Typography>
                  <img
                    className={styles['img']}
                    src={helpGame}
                    alt="ExamplePostGameSurvey"
                  />
                  <Typography className={styles['body']}>&nbsp;</Typography>
                  <Typography className={styles['body']}>
                    After completing the game, the experimentee is invited to
                    enter their username, and linked to a survey. They will
                    enter their username and complete the survey
                  </Typography>
                  <Typography className={styles['body']}>&nbsp;</Typography>
                  <img
                    className={styles['img']}
                    src={helpUsername}
                    alt="Exampleusername"
                  />
                  <Typography className={styles['body']}>&nbsp;</Typography>
                  <Typography className={styles['body']}>
                    After completing the survey, The experimentee clicks back to
                    the website to enter their email
                  </Typography>
                  <Typography className={styles['body']}>&nbsp;</Typography>
                  <img
                    className={styles['img']}
                    src={helpExperimenteeSurvey}
                    alt="Examplesurvey"
                  />
                  <Typography className={styles['body']}>&nbsp;</Typography>
                  <Typography className={styles['body']}>
                    The experimenter enters their email address for a reward
                  </Typography>
                  <Typography className={styles['body']}>&nbsp;</Typography>
                  <img
                    className={styles['img']}
                    src={helpEmail}
                    alt="Examplesurvey"
                  />
                </Container>
              </Container>

              <Container className={styles['section']}>
                <Typography className={styles['header']} variant="h2">
                  Rewards system
                </Typography>
                <Container className={styles['imageContainer']}>
                  <img
                    className={styles['img']}
                    src={helpGameDetails}
                    alt="ExampleGameDetails"
                  />
                  <Typography className={styles['body']}>&nbsp;</Typography>
                  <Typography className={styles['body']}>
                    The top five player's email addresses are listed randomised
                    for the experimentor to send out rewards
                  </Typography>
                </Container>
              </Container>

              <Container className={styles['section']}>
                <Typography className={styles['header']} variant="h2">
                  Game Data
                </Typography>
                <Container className={styles['imageContainer']}>
                  <img
                    className={styles['img']}
                    src={helpPlayerList}
                    alt="ExamplePlayerList"
                  />
                  <Typography className={styles['body']}>&nbsp;</Typography>
                  <Typography className={styles['body']}>
                    To examine player data, navigate to game details page and
                    click "View Players" On this page displays all the usernames
                    and associated movement data recorded during the game.
                  </Typography>
                  <Typography className={styles['body']}>&nbsp;</Typography>

                  <img
                    className={styles['img']}
                    src={helpPlayerRecord}
                    alt="ExamplePlayerRecord"
                  />
                  <Typography className={styles['body']}>&nbsp;</Typography>
                  <Typography className={styles['body']}>
                    From the player list page, the experimenter can download a
                    .csv file of all player data
                  </Typography>
                  <Typography className={styles['body']}>&nbsp;</Typography>
                  <Typography className={styles['body']} display="block">
                    To view a particular player log on the web app, select the
                    "details" button for the player they are interested in. This
                    page has a detailed log including timestamp since the game
                    began, action, and what level this occured on. An individual
                    player record can also be downloaded from this page.
                  </Typography>
                </Container>
              </Container>
            </div>
            {/* </Card> */}
          </Container>
        </Container>
      </Card>
    </div>
  );
}

export default Helppage;
