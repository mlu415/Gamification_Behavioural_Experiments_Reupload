import { Avatar, Card, Grid, Typography } from "@mui/material";
import apple  from '../../../assets/Items/apple.png';
import avocado from '../../../assets/Items/avocado.png';
import banana  from '../../../assets/Items/banana.png';
import blueberry  from '../../../assets/Items/blueberry.png';
import cherry  from '../../../assets/Items/cherry.png';
import { ProfileContext, ProfileContextType } from '../../app';
import { ScoreModel } from '../../../../../api/src/app/schema/schema.score';
import styles from './leaderboard.module.scss';

const Leaderboard = (props: {leaderboardData: ScoreModel[]}) => {
  // Leaderboard images for the top five players.
  const leaderboardImages = [
    apple, avocado, banana, blueberry, cherry
  ];

  return <div className={styles['leaderboard']}>
    <div className={styles['leaderboard-card']}>
      <Card className={styles['leaderboard-title-card']}>
        <Typography variant="h4" className={styles['leaderboard-title']}>
          Leaderboard
        </Typography>
      </Card>

      {props.leaderboardData.map((data, index) => {
        if (index <= 4 || data.username.substring(0, 8) === "YOU") {
          return (
            <Grid
              key={index}
              sx={{
                '&:hover': {
                  backgroundColor: '#ccddff',
                },
              }}
              container
              className={styles['score-row']}
            >
              <Card className={styles['leaderboard-item']}>
                <div className={styles['leaderboard-subdiv']}>
                  <Typography
                    sx={{
                      fontWeight: 'bold',
                      color: 'gray',
                      fontSize: '40px',
                      paddingRight: '16px',
                      paddingLeft: '8px',
                    }}
                  >
                    {index + 1}
                  </Typography>
                  <div>
                    <Typography sx={{ fontWeight: 'bold', color: 'gray' }}>
                      {data.username.substring(0, 8)}
                    </Typography>
                    <Typography sx={{ fontWeight: 'bold' }}>
                      {data.value}
                    </Typography>
                  </div>
                </div>
                {(data.username.substring(0, 8) === "YOU") ?
                  <Avatar alt="avatar" className={styles['leaderboardImage']} /> :
                  <Avatar alt="avatar" src={leaderboardImages[index]} className={styles['leaderboardImage']} />}

              </Card>
            </Grid>
          );
        }
        else {
          return null;
        }
      })}
    </div>
  </div>
}

export default Leaderboard;
