import React, { createContext, useContext, useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';
import { orderBy, countBy } from 'lodash';
import unaccent from '../utils/unaccent';

const textSearch = ({ item, query }) => {
  const terms = query.split(' ').filter(t => t);
  return terms.every(term => {
    const regex = new RegExp(unaccent(term).replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&'), 'gi');
    if (item.title && unaccent(item.title).match(regex)) return true;
    if (item.creator && unaccent(item.creator).match(regex)) return true;
    if (item.ssid && item.ssid.match(regex)) return true;
    if (item.date && item.date.toString().match(regex)) return true;
    if (item.source) {
      if (Array.isArray(item.source.value)) {
        if (item.source.value.some(d => unaccent(d).match(regex))) return true;
      } else if (unaccent(item.source.value).match(regex)) return true;
    }
    if (item.depicts) {
      if (Array.isArray(item.depicts.value)) {
        if (item.depicts.value.some(d => unaccent(d).match(regex))) return true;
      } else if (item.depicts.value) {
        if (unaccent(item.depicts.value).match(regex)) return true;
      } else if (unaccent(item.depicts).match(regex)) return true;
    }
    return false;
  });
};

const search = ({ query, dates, sort, direction, allImages, collection, mapBounds }) => {
  if (!allImages) return [];
  let items = allImages;
  if (query) items = items.filter(item => textSearch({ item, query }));
  if (collection && collection !== 'all')
    items = items.filter(item => item.collection === collection);
  if (mapBounds)
    items = items.filter(({ longitude, latitude }) => {
      const [[minLongitude, minLatitude], [maxLongitude, maxLatitude]] = mapBounds;
      return (
        longitude > minLongitude &&
        longitude < maxLongitude &&
        latitude > minLatitude &&
        latitude < maxLatitude
      );
    });
  items = items.filter(i => i.firstyear <= dates[1] && i.lastyear >= dates[0]);
  if (sort) {
    items = orderBy(
      items,
      i => {
        if (sort === 'date') return parseInt(i.firstyear, `0`);
        return unaccent(i[sort])?.replace(/\W/gi, '');
      },
      direction ? 'asc' : 'desc'
    );
  }
  return items;
};

const StateContext = createContext();
const DispatchContext = createContext();

const initialState = {
  allImages: [],
  activeImages: [],
  selectedImage: null,
  query: '',
  dates: [1500, new Date().getFullYear()],
  year: 1900,
  sort: null,
  direction: true,
  size: 'full',
  useLinks: true,
  showViewPoints: true,
  categories: {},
  collection: null,
  highlightedLayer: null,
  highlightedFeature: null,
  yearDragging: false,
  drawSearch: null,
  drawSearchCoords: null,
  mapBounds: null,
  showIntro: false,
  lastImagePos: 0,
};

function reducer(state, [type, payload]) {
  switch (type) {
    case 'QUERY':
      return {
        ...state,
        query: payload,
      };
    case 'DATES':
      return {
        ...state,
        dates: payload,
      };
    case 'YEAR':
      return {
        ...state,
        year: payload,
      };
    case 'SORT':
      return {
        ...state,
        sort: payload,
      };
    case 'DIRECTION':
      return {
        ...state,
        direction: !state.direction,
      };
    case 'FILTER':
      return {
        ...state,
        activeImages: payload,
      };
    case 'SET_ALL_IMAGES':
      return {
        ...state,
        allImages: payload,
      };
    case 'SET_ACTIVE_IMAGES':
      return {
        ...state,
        activeImages: payload,
      };
    case 'SET_SELECTED_IMAGE':
      return {
        ...state,
        selectedImage: payload,
      };
    case 'SET_SIZE':
      return {
        ...state,
        size: payload,
      };
    case 'SET_USE_LINKS':
      return {
        ...state,
        useLinks: payload,
      };
    case 'TOGGLE_VIEWPOINTS':
      return {
        ...state,
        showViewPoints: !state.showViewPoints,
      };
    case 'SET_CATEGORIES':
      return {
        ...state,
        categories: payload,
      };
    case 'SET_COLLECTION':
      return {
        ...state,
        collection: payload,
      };
    case 'SET_HIGHLIGHTED_LAYER':
      return {
        ...state,
        highlightedLayer: payload,
      };
    case 'SET_HIGHLIGHTED_FEATURE':
      return {
        ...state,
        highlightedFeature: payload,
      };
    case 'SET_YEAR_DRAGGING':
      return {
        ...state,
        yearDragging: payload,
      };
    case 'SET_DRAW_SEARCH':
      return {
        ...state,
        drawSearch: payload,
      };
    case 'SET_DRAW_SEARCH_COORDS':
      return {
        ...state,
        drawSearchCoords: payload,
      };
    case 'SET_MAP_BOUNDS':
      return {
        ...state,
        mapBounds: payload,
      };
    case 'SET_SHOW_INTRO':
      return {
        ...state,
        showIntro: payload,
      };
    case 'SET_LAST_IMAGE_POS':
      return {
        ...state,
        lastImagePos: payload,
      };
    default:
      return state;
  }
}

function ImageContextProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const {
    query,
    sort,
    dates,
    direction,
    allImages,
    activeImages,
    collection,
    selectedImage,
    mapBounds,
  } = state;

  useEffect(
    () =>
      dispatch([
        'SET_ACTIVE_IMAGES',
        search({ query, sort, dates, direction, allImages, collection, mapBounds }),
      ]),
    [query, sort, dates, direction, allImages, collection, mapBounds]
  );

  useEffect(
    () =>
      dispatch([
        'SET_CATEGORIES',
        {
          ...countBy(search({ query, sort, dates, direction, allImages }), 'collection'),
          all: search({ query, sort, dates, direction, allImages }).length,
        },
      ]),
    [activeImages]
  );

  useEffect(() => {
    if (selectedImage) {
      dispatch(['SET_LAST_IMAGE_POS', activeImages.indexOf(selectedImage)]);
      if (selectedImage.firstyear) {
        dispatch(['YEAR', selectedImage.firstyear]);
      }
    }
  }, [selectedImage]);

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>{children}</DispatchContext.Provider>
    </StateContext.Provider>
  );
}

function useImages() {
  const dispatchContext = useContext(DispatchContext);
  const stateContext = useContext(StateContext);

  if (dispatchContext === undefined) {
    throw new Error('useImages must be used within a ImageContextProvider');
  }
  return [stateContext, dispatchContext];
}

export { ImageContextProvider, useImages };

ImageContextProvider.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
};
