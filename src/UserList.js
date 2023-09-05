import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  TextField,
  Grid,
  List,
  ListItem,
  ListItemText,
  Typography,
  Button,
  Box,
  useMediaQuery,
} from '@mui/material';
import { getDatabase, ref, onValue, set } from 'firebase/database';
import app from './firebase';

const UserList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showClickedUsers, setShowClickedUsers] = useState(false);
  const [users, setUsers] = useState([]);
  const isListView = useMediaQuery('(max-width:600px)');

  // Fetch users from Firebase Realtime Database
  useEffect(() => {
    const db = getDatabase(app);
    const usersRef = ref(db, '/users'); // Replace 'users' with your database reference path
    onValue(usersRef, (snapshot) => {
      if (snapshot.exists()) {
        const userData = snapshot.val();
        setUsers(userData);
      }
    });
  }, []);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleUserClick = (name) => {
    const updatedUsers = users.map((user) => {
      if (user.name === name) {
        return { ...user, clicked: !user.clicked };
      }
      return user;
    });
    updateUser(updatedUsers);
    setSelectedUsers(updatedUsers.filter((user) => user.clicked));
    setUsers(updatedUsers);
  };

  const showClicked = () => {
    setShowClickedUsers(true);
  };

  const showNotClicked = () => {
    setShowClickedUsers(false);
  };

  const initializeUsersInDatabase = () => {
    const db = getDatabase(app);
    const usersRef = ref(db, '/users'); // Replace 'users' with your database reference path
    const lithuanianPeople = [
      { name: 'Giedre Siauciunaite', clicked: false },
      { name: 'Vytautas Jankauskas', clicked: false },
      { name: 'Milda Petrauskaite', clicked: false },
      { name: 'Mantas Kazlauskas', clicked: false },
      { name: 'Lina Butkiene', clicked: false },
    ];
    set(usersRef, lithuanianPeople)
      .then(() => {
        console.log('Users have been initialized in the database.');
      })
      .catch((error) => {
        console.error('Error initializing users in the database:', error);
      });
  };

  const updateUser = (updatedUsers) => {
    const db = getDatabase(app);
    const usersRef = ref(db, '/users');
    set(usersRef, updatedUsers)
      .then(() => {
        console.log('Users have been updated in the database.');
      })
      .catch((error) => {
        console.error('Error updating users in the database:', error);
      });
  };

  return (
    <Container
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start', // Change this to 'flex-start' to stick to the top
        minHeight: '100vh',
        position: 'sticky', // Add this
        top: 0, // Add this
        marginTop: '20px'
      }}
    >
      <Paper elevation={3} style={{ padding: '16px', width: '80%' }}>
        <Typography variant="h6" align="center">
          User List
        </Typography>
        <TextField
          fullWidth
          label="Search"
          variant="outlined"
          value={searchQuery}
          onChange={handleSearchChange}
          style={{ marginBottom: '16px' }}
        />
        <Box marginBottom="16px">
          <Box
            display="flex"
            justifyContent="center"
            marginBottom="8px"
            sx={{ gap: '8px' }}
          >
            <Button
              variant={showClickedUsers ? 'contained' : 'outlined'}
              color="primary"
              onClick={showClicked}
            >
              Show Clicked Users
            </Button>
            <Button
              variant={!showClickedUsers ? 'contained' : 'outlined'}
              color="primary"
              onClick={showNotClicked}
            >
              Show Not Clicked Users
            </Button>
          </Box>
          <Button
            variant="contained"
            color="primary"
            onClick={initializeUsersInDatabase}
          >
            Initialize Database
          </Button>
        </Box>
        {isListView ? (
          <List>
            {users
              .filter((user) => (showClickedUsers ? user.clicked : !user.clicked))
              .filter((user) =>
                user.name.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((user) => (
                <ListItem
                  key={user.name}
                  button
                  onClick={() => handleUserClick(user.name)}
                  style={{
                    backgroundColor: user.clicked ? 'lightblue' : 'white',
                  }}
                >
                  <ListItemText primary={user.name} />
                </ListItem>
              ))}
          </List>
        ) : (
          <Grid container spacing={2}>
            {users
              .filter((user) => (showClickedUsers ? user.clicked : !user.clicked))
              .filter((user) =>
                user.name.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((user) => (
                <Grid item xs={4} key={user.name}>
                  <Paper
                    elevation={3}
                    onClick={() => handleUserClick(user.name)}
                    style={{
                      padding: '8px',
                      textAlign: 'center',
                      cursor: 'pointer',
                      backgroundColor: user.clicked ? 'lightblue' : 'white',
                    }}
                  >
                    {user.name}
                  </Paper>
                </Grid>
              ))}
          </Grid>
        )}
      </Paper>
    </Container>
  );
};

export default UserList;
