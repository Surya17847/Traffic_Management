import React from 'react';
import { signOut } from 'aws-amplify/auth';

const Signout = () => {
  const handleSignout = async () => {
    await signOut();
    console.log('signed out');
  };

  return (
    <button onClick={handleSignout}>Sign Out</button>
  );
};

export default Signout;
