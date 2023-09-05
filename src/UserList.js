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
import ConfirmationModal from './ConfirmationModal';

const UserList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showClickedUsers, setShowClickedUsers] = useState(false);
  const [users, setUsers] = useState([]);
  const isListView = useMediaQuery('(max-width:600px)');
  const [clickedUserCount, setClickedUserCount] = useState(0);
  const [notClickedUserCount, setNotClickedUserCount] = useState(0);
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [userNameToConfirm, setUserNameToConfirm] = useState('');
  const confirmationMessage = showClickedUsers
    ? `Ar tikrai nori gražint į neatėjusių sąrašą ?`
    : `Ar tikrai šis žmogus atėjo ?`;

  // Fetch users from Firebase Realtime Database
  useEffect(() => {
    const db = getDatabase(app);
    const usersRef = ref(db, '/users'); // Replace 'users' with your database reference path
    onValue(usersRef, (snapshot) => {
      if (snapshot.exists()) {
        const userData = snapshot.val().filter(u => u !== undefined)
        const sortedUsers = [...userData].sort((a, b) =>
          a.name.localeCompare(b.name)
        );
        setUsers(sortedUsers);
        const clickedCount = sortedUsers.filter((user) => user.clicked).length;
        setClickedUserCount(clickedCount);
        setNotClickedUserCount(sortedUsers.length - clickedCount);
      }
    });
  }, []);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleUserClick = (name) => {
    setUserNameToConfirm(name);
    setConfirmationModalOpen(true);
  };

  const showClicked = () => {
    setShowClickedUsers(true);
  };

  const showNotClicked = () => {
    setShowClickedUsers(false);
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

  const closeConfirmationModal = () => {
    setUserNameToConfirm('');
    setConfirmationModalOpen(false);
  };

  return (
    <>
      <div
        style={{
          marginTop: '20px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <Container style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          minHeight: '100vh',
          position: 'sticky',
          top: 0,
          marginTop: '20px',
        }}>
          <Paper elevation={3} style={{ padding: '16px', width: '80%' }}>
            <Typography variant="h6" align="center">
              Dalyvių sąrašas
            </Typography>
            <TextField
              fullWidth
              label="Search"
              variant="outlined"
              value={searchQuery}
              onChange={handleSearchChange}
              style={{ marginBottom: '10px' }}
            />
            <Typography
              variant="subtitle1"
              align="center"
              style={{ marginTop: '0px' }}
            >
              Atėjo tiek : {clickedUserCount} Dar neatėjo tiek : {notClickedUserCount}
            </Typography>
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
                  Atėję žmonės
                </Button>
                <Button
                  variant={!showClickedUsers ? 'contained' : 'outlined'}
                  color="primary"
                  onClick={showNotClicked}
                >
                  Neatėję žmonės
                </Button>
              </Box>
            </Box>
            {isListView ? (
              <List>
                {users
                  .filter((user) =>
                    showClickedUsers ? user.clicked : !user.clicked
                  )
                  .filter((user) =>
                    user.name.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((user) => (
                    <ListItem
                      key={user.name}
                      button
                      onClick={() => handleUserClick(user.name)}
                      style={{
                        textAlign: 'center',
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
                  .filter((user) =>
                    showClickedUsers ? user.clicked : !user.clicked
                  )
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
      </div>
      <ConfirmationModal
        open={confirmationModalOpen}
        onClose={closeConfirmationModal}
        onConfirm={() => {
          // Perform the action here, e.g., update the user's status
          const updatedUsers = users.map((user) => {
            if (user.name === userNameToConfirm) {
              return { ...user, clicked: !user.clicked };
            }
            return user;
          });
          updateUser(updatedUsers);
          setSelectedUsers(updatedUsers.filter((user) => user.clicked));
          setUsers(updatedUsers);
          const clickedCount = updatedUsers.filter((user) => user.clicked).length;
          setClickedUserCount(clickedCount);
          setNotClickedUserCount(updatedUsers.length - clickedCount);

          closeConfirmationModal(); // Close the modal after confirming
        }}
        userName={userNameToConfirm}
        message={confirmationMessage}
      />
    </>
  );
};

export default UserList;
