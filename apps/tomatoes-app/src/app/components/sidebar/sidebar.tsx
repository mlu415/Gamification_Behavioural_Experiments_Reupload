//This page handles the logic of rendering and displaying the sidebar, which is modularily exportable to other pages.
//The items displayed are the profile picture, routes to game list, help, and logout.

import styles from './sidebar.module.scss';
import Drawer from '@mui/material/Drawer';
import { Card } from '@mui/material';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import VideogameAssetIcon from '@mui/icons-material/VideogameAsset';
import HelpIcon from '@mui/icons-material/Help';
import LogoutIcon from '@mui/icons-material/Logout';
import { Link } from 'react-router-dom';
import { Avatar, Container, Typography } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { getData } from '../../backend-functions/interface';
import { useEffect, useState, useContext } from 'react';
import { SERVER_URL } from '../../backend-functions/interface';
import default_profile from '../../../assets/default_profile.jpeg';
import UOA_LOGO from '../../../assets/uoa_logo3.png';
import { ProfileContext, ProfileContextType } from '../../app';

/* eslint-disable-next-line */
export interface SidebarProps {}

export function Sidebar(props: SidebarProps) {
  const { profilePic } = useContext(ProfileContext) as ProfileContextType;
  const menuItems = [
    {
      name: 'Games',
      icon: <VideogameAssetIcon fontSize="large" />,
      path: '/games',
    },
    {
      name: 'Help',
      icon: <HelpIcon fontSize="large" />,
      path: '/help',
    },
    {
      name: 'Logout',
      icon: <LogoutIcon fontSize="large" />,
      path: '/Home',
    },
  ];

  const location = useLocation();

  return (
    <div className={styles['paperbar']}>
      <List>
        <ListItem
          sx={{
            pb: 5,
            pt: 2,
            color: '#E3F0FF',
            '&:hover *': {
              color: '#E3F0FF',
            },
          }}
          key="Profile"
          disablePadding
          component={Link}
          to="/account/edit"
        >
          <Avatar
            className={styles['accountIcon']}
            src={profilePic}
            alt="Profile Pic"
          />
        </ListItem>

        {menuItems.map((item) =>
          location.pathname === item.path ? (
            <ListItem
              sx={{
                pb: 2,
                pt: 2,
                color: 'white',
                '&:hover *': {
                  color: 'white',
                },
              }}
              key={item.name}
              component={Link}
              to={item.path}
            >
              <ListItemIcon sx={{ color: 'white' }}>{item.icon}</ListItemIcon>
              <Typography sx={{ fontWeight: 'bold' }}>{item.name}</Typography>
            </ListItem>
          ) : (
            <ListItem
              sx={{
                pb: 2,
                pt: 2,
                color: '#E3F0FF',
                '&:hover *': {
                  color: '#E3F0FF',
                },
              }}
              key={item.name}
              component={Link}
              to={item.path}
            >
              <ListItemIcon sx={{ color: '#E3F0FF' }}>{item.icon}</ListItemIcon>
              <Typography sx={{ fontWeight: 'bold' }}>{item.name}</Typography>
            </ListItem>
          )
        )}
      </List>
      <img className={styles['bottomAllign']} src={UOA_LOGO} alt={UOA_LOGO} />
    </div>
  );
}

export default Sidebar;
