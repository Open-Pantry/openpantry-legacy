import { handleActions, createAction } from 'redux-actions';

const base = 'org/';
const INITIAL_STATE = {
  searchValue: '',
  prevSearch:null,
  query: '',
  fancyResults: localStorage['openpantry-results-style']=='false'?false:true,
  data: {},
  orgs: null,
  events: null,
  products: null,
  waitingForData: true,
  userLat: null,
  searchTime:0,
  userLng: null,
  imageStartUrl:"http://localhost:8080/"
};

const setError = createAction(`${base}ERROR`);
const updateSearchData = createAction(`${base}UPDATESEARCHDATA`);
const updateFilteredResults = createAction(`${base}UPDATEFILTEREDRESULTS`);
const updateNothing = createAction(`${base}UPDATENOTHING`);
export const updateSearchValue = createAction(`${base}UPDATESEACHVALUE`);
export const updateQuery = createAction(`${base}UPDATEQUERY`);
export const updateQueryType = createAction(`${base}UPDATEQUERYSTRINGTYPE`);
 const toggleResult = createAction(`${base}TOGGLERESULT`);
export const updateUserLocation = createAction(`${base}UPDATEUSERLOCATION`);

export default handleActions(
  {
    [setError]: (state, { payload }) => ({
      ...state,
      error: payload
    }),
    [updateSearchValue]: (state, { payload }) => ({
      ...state,
      searchValue: payload
    }),
    [updateQuery]: (state, { payload }) => ({
      ...state,
      query: payload.query
    }),
    [updateQueryType]: (state, { payload }) => ({
      ...state,
      query: {
        ...state.query,
        results: payload.pathName
      }
    }),
    [updateUserLocation]: (state, { payload }) => ({
      ...state,
      userLat: payload.userLat,
      userLng: payload.userLng
    }),
    [toggleResult]: (state, { payload }) => ({
      ...state,
      fancyResults: state.fancyResults ? false : true
    }),
    [updateSearchData]: (state, { payload }) => ({
      ...state,
      data: payload.data,
      waitingForData: false
    }),
    [updateFilteredResults]: (state, { payload }) => ({
      ...state,
      orgs: payload.orgs,
      events: payload.events,
      products: payload.products,
      searchTime:payload.searchTime,
      prevSearch:payload.prevSearch
    }),
    [updateNothing]: (state,{payload}) => ({
      ...state
    })
  },
  INITIAL_STATE
);

export const toggleResults = (payload) => (dispatch,getState) => {
  dispatch(toggleResult());
  const {fancyResults} = getState().search;
  localStorage.setItem('openpantry-results-style',fancyResults);
};


export const loadSearchData =   (payload) =>   async (dispatch) =>  {
  await fetch(`/api/organizationsfull`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  }).then(response => response.json())
    .then((data) => {
      // Update the state with the data
      // This will force the re-render of the component
      if (data.status === 200) {
        dispatch(updateSearchData({
          data: data.orgs
        }))
      } else {
        dispatch(setError(data));
      }
    });
};

export const filterResults = (payload) => (dispatch, getState) => {
  var startTime = new Date();
  // All filtering logic goes here

  const { data,prevSearch } = getState().search;

  if(prevSearch !== payload || prevSearch === null){
    let productsArr = [];
  let eventsArr = [];
  let orgArr = [];

  data.forEach((organization) => {
    let orgRelevant = false;
    organization.products.forEach((product) => {
      if (product.name.includes(payload) || payload.includes(product.name)) {
        productsArr.push(product);
        orgRelevant = true;
        return;
      } else if (product.tags.some((productTag) => {
        return productTag.name.includes(payload) || payload.includes(productTag.name);
      })) {
        productsArr.push(product);
        orgRelevant = true;        
      } else {
      }
      // We have to keep checking if the tag is contained in the product
    });//For each product in the organization

    organization.events.forEach((event) => {
      if (event.name.includes(payload) || payload.includes(event.name)) {
        eventsArr.push(event);
        orgRelevant = true;        
        return;
      } else if (event.tags.some((eventTag) => {
        return eventTag.name.includes(payload) || payload.includes(eventTag.name);
      })) {
        eventsArr.push(event);
        orgRelevant = true;        
      } else {
      }
    });// For each event in the organization
    if (orgRelevant) {
      orgArr.push(organization);
    }else if (!orgRelevant && (organization.name.includes(payload) || payload.includes(organization.name) || organization.tags.some((orgTag) => {
      return orgTag.name.includes(payload) || payload.includes(orgTag.name);
    }))) {
      orgArr.push(organization);
    }

  });// For each organization

  dispatch(updateFilteredResults({
    orgs: orgArr,
    events: eventsArr,
    products: productsArr,
    searchTime:new Date() - startTime,
    prevSearch:payload
  }))
  }else{
    dispatch(updateNothing());
  }
};