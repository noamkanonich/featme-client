import { useContext } from 'react';
import DateContext from './DateContext';

const useDate = () => useContext(DateContext);
export default useDate;
