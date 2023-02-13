import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '../store/authSlice'
import history from '../hooks/history';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

export const useAuth = () => {
  const user = useSelector(selectCurrentUser)

  return useMemo(() => ({ user }), [user])
}

export function useAuthWithRedir(){
  const auth = useAuth();
  const { t } = useTranslation('toast_messages');
  if(auth.user.id == null){
    toast.error(t("unAuthMessage"));
    history.push(`/auth/login/?returnUrl=${history.location.pathname}`);
  }
}