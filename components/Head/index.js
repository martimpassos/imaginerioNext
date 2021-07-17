import React from 'react';
import PropTypes from 'prop-types';
import NextHead from 'next/head';

const Head = ({ title }) => (
  <NextHead>
    <meta charSet="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta httpEquiv="x-ua-compatible" content="ie=edge" />
    <link rel="preconnect" href="https://fonts.gstatic.com" />
    <link
      href="https://fonts.googleapis.com/css2?family=Barlow:wght@300;500&display=swap"
      rel="stylesheet"
    />
    <script
      async
      defer
      data-website-id="6cee94a9-7318-4916-b4e7-4b61d2771dec"
      src="https://umami.axismaps.com/umami.js"
    />
    <title>{title}</title>
  </NextHead>
);

Head.propTypes = {
  title: PropTypes.string.isRequired,
};

export default Head;
