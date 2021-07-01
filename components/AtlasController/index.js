import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import useSWR from 'swr';
import { Atlas } from '@imaginerio/diachronic-atlas';
import { Box } from '@chakra-ui/react';

import Legend from '../Legend';
import Probe from '../Probe';

import mapStyle from '../../assets/style/style.json';

import { useImages } from '../../providers/ImageContext';

const fetcher = ssid => {
  if (ssid) {
    return axios
      .get(`${process.env.NEXT_PUBLIC_SEARCH_API}/document/${ssid}`)
      .then(({ data }) => data);
  }
  return { data: null };
};

const AtlasController = ({ width, height }) => {
  const [{ activeImages, year, selectedImage, allImages, showViewPoints }, dispatch] = useImages();
  const viewpoints = activeImages.filter(i => i.collection === 'views');

  const [highlightedLayer, setHighlightedLayer] = useState(null);
  const [geojson, setGeojson] = useState(null);
  const [hoverSSID, setHoverSSID] = useState(null);
  const [probeImage, setProbeImage] = useState(null);
  const [probePosition, setProbePosition] = useState(null);

  const { data: hover } = useSWR(hoverSSID, fetcher);

  useEffect(() => {
    if (selectedImage) {
      axios
        .get(`${process.env.NEXT_PUBLIC_SEARCH_API}/document/${selectedImage.ssid}`)
        .then(({ data }) => setGeojson(data));
    } else {
      setGeojson(null);
    }
  }, [selectedImage]);

  useEffect(() => {
    if (hoverSSID) {
      setProbeImage(activeImages.find(i => i.ssid === hoverSSID));
    } else {
      setProbeImage(null);
    }
  }, [hoverSSID]);

  return (
    <Box>
      <Legend highlightHandler={setHighlightedLayer} highlightedLayer={highlightedLayer} />
      <Atlas
        year={year}
        mapStyle={mapStyle}
        viewport={{ longitude: -43.18, latitude: -22.9, zoom: 14.5 }}
        width={width}
        height={height}
        viewpoints={showViewPoints ? viewpoints : null}
        activeBasemap={selectedImage && selectedImage.collection !== 'views' && selectedImage.ssid}
        geojson={geojson}
        rasterUrl={process.env.NEXT_PUBLIC_RASTER_URL}
        basemapHandler={ssid =>
          dispatch(['SET_SELECTED_IMAGE', allImages.find(i => i.ssid === ssid)])
        }
        circleMarkers
        hover={hover}
        highlightedLayer={highlightedLayer}
        hoverHandler={e => {
          if (e.features.length) {
            setProbePosition(e.center);
            setHoverSSID(e.features[0].properties.ssid);
          } else {
            setHoverSSID(null);
          }
        }}
      />
      {probeImage && <Probe image={probeImage} pos={probePosition} />}
    </Box>
  );
};

AtlasController.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
};

export default AtlasController;
