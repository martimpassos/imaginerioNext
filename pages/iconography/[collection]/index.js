import React, { useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { Container, Heading, Text } from '@chakra-ui/react';

import Head from '../../../components/Head';
import Header from '../../../components/Header';
import Breadcrumbs from '../../../components/Breadcrumbs';
import ImageFilter from '../../../components/ImageFilter';
import ImageList from '../../../components/ImageList';
import ImageGrid from '../../../components/ImageGrid';

import { ImageContext } from '../../../providers/ImageContext';
import config from '../../../utils/config';
import useWindowDimensions from '../../../utils/useWindowDimensions';

const Collection = ({ images, collection }) => {
  let height = 800;
  let width = 1000;
  // eslint-disable-next-line react-hooks/rules-of-hooks
  if (typeof window !== 'undefined') ({ height, width } = useWindowDimensions());
  const { activeImages, setAllImages, size } = useContext(ImageContext);
  useEffect(() => setAllImages(images), [images, setAllImages]);

  return (
    <>
      <Head title={collection} />
      <Header />
      <Container maxW="5xl">
        <Breadcrumbs collection={collection} />
        <Heading textTransform="capitalize">{collection}</Heading>
      </Container>
      <Container maxW="5xl" pb={5}>
        <ImageFilter />
        <Text>{`${activeImages.length} images found`}</Text>
      </Container>
      {size === 'grid' ? (
        <ImageGrid
          width={width}
          height={height}
          activeImages={activeImages}
          collection={collection}
        />
      ) : (
        <ImageList
          size={size}
          activeImages={activeImages}
          height={height}
          collection={collection}
        />
      )}
    </>
  );
};

export async function getStaticPaths() {
  return {
    paths: config.collections.map(collection => ({ params: { collection } })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const {
    data: [{ Documents }],
  } = await axios.get(
    `${process.env.NEXT_PUBLIC_SEARCH_API}/documents?visual=${params.collection}`
  );
  return { props: { images: Documents, ...params } };
}

Collection.propTypes = {
  images: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  collection: PropTypes.string.isRequired,
};

export default Collection;
