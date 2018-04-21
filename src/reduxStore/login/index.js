import { handleActions, createAction } from 'redux-actions';

const base = 'login/';
const INITIAL_STATE = {
  organizationName: '',
  lastOrgNameChecked: '',
  validatedFields:true,
  query:{},
  orgExists: false,
  orgID:'',
  loggedIn: false,
  logo: '',
  logoURL: '',
  userName: "",
  password: "",
  token:"",
  role:'',
  name:'',
  failedAuth:false,
  newEmployee:false
};

const setError = createAction(`${base}ERROR`);
const updateOrgStatus = createAction(`${base}UPDATEORGSTATUS`);
const updateFailedLogin = createAction(`${base}UPDATEFAILEDLOGIN`);
const updateFirstLoginSuccess = createAction(`${base}UPDATEFIRSTLOGINSUCCESS`);
const updateFirstLoginFailed =createAction(`${base}UPDATEFIRSTLOGINFAILED`);

export const updateOrgName = createAction(`${base}UPDATE_ORG_NAME`);
export const updateUsername = createAction(`${base}UPDATEUSERNAME`);
export const updatePassword = createAction(`${base}UPDATEPASSWORD`);
export const updateValidatedFields = createAction(`${base}UPDATEVALIDATEDFIELDS`);
export const logOut = createAction(`${base}LOGOUT`);
export const updateQuery = createAction(`${base}UPDATEQUERY`);
export const resetLoginPage = createAction(`${base}RESETLOGINPAGE`);
export const updateLogoURL = createAction(`${base}UPDATELOGOURL`);
const updateLoggedIn = createAction(`${base}UPDATELOGGEDIN`);

export default handleActions(
  {
    [setError]: (state, { payload }) => ({
      ...state,
      error: payload
    }),
    [updateOrgName]: (state, { payload }) => ({
      ...state,
      organizationName: payload,
      validatedFields:true,
      failedAuth:false
    }),
    [updateUsername]: (state, { payload }) => ({
      ...state,
      userName: payload,
      failedAuth:false,
      validatedFields:true
    }),
    [updatePassword]: (state, { payload }) => ({
      ...state,
      password: payload,
      failedAuth:false,
      validatedFields:true
    }),
    [logOut]: (state, { payload }) => ({
      ...state,
      loggedIn: false,
      token:''
    }),
    [updateValidatedFields]: (state, {payload}) => ({
      ...state,
      validatedFields:payload
    }),
    [updateLoggedIn]: (state, { payload }) => ({
      ...state,
      loggedIn: true,
      token:payload.token,
      role: payload.user.role,
      userName:payload.user.email,
      name:payload.user.name,
      organizationName:payload.user.organizationName,
      orgID:payload.user.organization_id
    }),
    [updateOrgStatus]: (state, { payload }) => ({
      ...state,
      orgExists: payload.status,
      logoURL: payload.logoName,
      orgID:payload.orgID,
      lastOrgNameChecked: payload.lastOrgNameChecked,
      organizationName:payload.organizationName,
      validatedFields:payload.validatedFields
    }),
    [updateQuery]: (state, {payload}) => ({
      ...state,
      query:payload.query,
      newEmployee:true
    }),
    [resetLoginPage]:(state,{payload}) => ({
      ...state,
      newEmployee:false,
      organizationName:'',
      validatedFields:true,
      failedAuth:false,
      lastOrgNameChecked:'',
      orgExists:false,
      orgID:'',
      userName:'',
      password:''

    }),
    [updateFailedLogin]:(state,{payload}) => ({
      ...state,
      failedAuth:true,
      validatedFields:false
    }),
    [updateFirstLoginSuccess]:(state,{payload}) => ({
      ...state,
      failedAuth:false
    }),
    [updateFirstLoginFailed]:(state,{payload}) => ({
      ...state,
      failedAuth:true
    }),
    [updateLogoURL]:(state,{payload}) => ({
      ...state,
      logoURL:payload
    })
  },
  INITIAL_STATE
);

export const logIn = (payload) => (dispatch,getState) => {
  fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
    .then(response => response.json())
    .then((data) => {
      // Update the state with the data 
      // This will force the re-render of the component
      if (data.token != null) {
        const {login} = getState();
        localStorage.setItem('cached-email', payload.email);
        localStorage.setItem('cached-password', payload.password);
        localStorage.setItem('cached-org', payload.orgID);
        localStorage.setItem('cached-org-name',payload.organizationName);
        localStorage.setItem('cached-logo-url', login.logoURL);   
        data.user.organizationName = payload.organizationName;
        dispatch(updateLoggedIn(data));
      } else {
        dispatch(updateFailedLogin());
      }
    });
}; // getApi

export const firstLogIn = (payload) => (dispatch) => {
  fetch("/api/firstLogin",{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify(payload)
  })
    .then(response => response.json())
    .then((data) => {
      if(data){
        if(data.length > 0){
          dispatch(updateFirstLoginSuccess());
        }else{
          dispatch(updateFirstLoginFailed());
        }
      }
    });
};

export const checkForCompany = (payload) => (dispatch) => {
  fetch(`/api/organizationsimple?organizationName=${payload}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', organizationName: payload },
  })
    .then(response => response.json())
    .then((data) => {
      // Update the state with the data
      // This will force the re-render of the component
      if (data.status === 200) {
        dispatch(updateOrgStatus({
          status: true,
          validatedFields:true,
          orgID:data.org.id,
          logoName: data.org.logoName,
          lastOrgNameChecked: payload,
          organizationName: payload
        }));
      } else {
        dispatch(updateOrgStatus({ validatedFields:false,status: false, lastOrgNameChecked: payload }));
      }
    });
};
