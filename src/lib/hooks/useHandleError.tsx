import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useToast } from 'react-native-toast-notifications';
import { Red } from '../../theme/colors';

const getErrorCode = (err: unknown): string => {
  if (err && typeof err === 'object') {
    const e = err as { code?: string; message?: string };
    if (e.code) return e.code;
    if (e.message) return e.message;
  }
  return 'unknown';
};

export const useHandleAuthError = () => {
  const toast = useToast();
  const { t } = useTranslation();

  const handleErrorMessage = useCallback(
    (err: Error) => {
      const code = getErrorCode(err);

      switch (code) {
        case 'auth/network-request-failed':
          toast.show(t('toast.login_screen.error_network'), {
            type: 'danger',
            textStyle: { color: Red },
          });
          break;

        case 'auth/invalid-email':
          toast.show(t('toast.login_screen.error_invalid_email'), {
            type: 'danger',
            textStyle: { color: Red },
          });
          break;

        case 'auth/user-not-found':
          toast.show(t('toast.login_screen.error_user_not_found'), {
            type: 'danger',
            textStyle: { color: Red },
          });
          break;

        case 'auth/invalid-credential':
          toast.show(t('toast.login_screen.invalid_credential'), {
            type: 'danger',
            textStyle: { color: Red },
          });
          break;

        default:
          toast.show(err.message || t('toast.common.unknown_error'), {
            type: 'danger',
            textStyle: { color: Red },
          });
          break;
      }
    },
    [toast, t],
  );

  return handleErrorMessage;
};
