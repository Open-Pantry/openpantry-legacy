import { handleActions, createAction } from 'redux-actions';

const base = 'home/';
const INITIAL_STATE = {
  statusMessage:'',
  showMessage:false,
  autoHideDuration:3000,
  action:null,
  onRequestClose:null
};

const setError = createAction(`${base}ERROR`);

export const updateMessage = createAction(`${base}UPDATEMESSAGE`);
export const toggleMessage = createAction(`${base}TOGGLEMESSAGE`);
export const updateAutoHideDuration = createAction(`${base}UPDATEAUTOHIDEDURATION`);
export const showSnackbar = createAction(`${base}UPDATEALLSNACKBARATTRIBUTES`);
export default handleActions(
  {
    [setError]: (state, { payload }) => ({
      ...state,
      error: payload
    }),
    [updateMessage]: (state, {payload}) => ({
      ...state,
      statusMesasge:payload
    }),
    [toggleMessage]:(state,{payload}) => ({
      ...state,
      showMessage:false
    }),
    [updateAutoHideDuration]:(state,{payload}) => ({
      ...state,
      autoHideDuration:payload
    }),
    [showSnackbar]:(state,{payload}) => ({
      ...state,
      showMessage:true,
      statusMessage:payload.statusMessage,
      autoHideDuration:payload.autoHideDuration || null,
      action:payload.action || null,
      onRequestClose:payload.onRequestClose || null
    })
  },
  INITIAL_STATE
);