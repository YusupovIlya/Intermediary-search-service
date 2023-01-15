import { createAction } from '@reduxjs/toolkit';
import { useNavigate } from 'react-router-dom';

export const RESET_STATE_ACTION_TYPE = 'resetState';
export const resetStateAction = createAction(
 RESET_STATE_ACTION_TYPE,
 () => {
    return { payload: null };
 }
);