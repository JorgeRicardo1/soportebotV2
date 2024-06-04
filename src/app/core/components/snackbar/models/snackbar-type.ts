export enum SnackbarType {
  error = 'error',
  success = 'success',
  saving = 'saving',
  updating = 'updating',
  deleting = 'deleting',
  warning = 'warning',
  waiting = 'waiting',
}

export const SnackbarPrimaryColor: Record<SnackbarType, string> = {
  success: '#4caf50',
  error: '#f44336',
  warning: '#ff9800',
  saving: '#2196f3',
  updating: '#3f51b5',
  deleting: '#9c27b0',
  waiting: '#607d8b',
};

export const SnackbarAuxColor: Record<SnackbarType, string> = {
  success: '#2e7d32',
  error: '#c62828',
  warning: '#ef6c00',
  saving: '#1565c0',
  updating: '#283593',
  deleting: '#6a1b9a',
  waiting: '#37474f',
};

export const SnackbarIcon: Record<SnackbarType, string> = {
  success: 'check_circle_outline',
  error: 'error_outline',
  warning: 'warning_amber',
  saving: 'save',
  updating: 'update',
  deleting: 'delete_outline',
  waiting: 'hourglass_empty',
};
