import { useContext } from 'react';
import UserDataContext from './UserDataContext';

const useUserData = () => useContext(UserDataContext);
export default useUserData;
