import { useDispatch } from 'react-redux';
import { useCallback } from 'react';
import { clearCredentials } from '../store/authSlice'

export const useClearCredentials = () => {
  const dispatch = useDispatch();

  const clear = useCallback(() => {
    dispatch(clearCredentials());
  }, [dispatch]);

  return clear;
};