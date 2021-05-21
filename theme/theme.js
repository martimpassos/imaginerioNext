import React from 'react';
import { extendTheme } from '@chakra-ui/react';

const oneline = {
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
  overflow: 'hidden',
};

export default extendTheme({
  styles: {
    global: {
      '*': {
        fontWeight: 300,
      },
      a: {
        color: '#1580D1',
      },
      p: {
        mb: 5,
      },
      b: {
        fontWeight: 500,
      },
      h1: {
        fontSize: '32px',
        my: '20px',
      },
      h2: {
        fontSize: '22px',
        my: '20px',
      },
      'li > ul': {
        pl: 5,
      },
    },
  },
  fonts: {
    body: 'Barlow, sans-serif',
    heading: 'Barlow, sans-serif',
  },
  components: {
    Heading: {
      baseStyle: {
        fontWeight: 500,
        my: '20px',
      },
      sizes: {
        lg: {
          fontSize: '32px',
        },
        md: {
          fontSize: '22px',
        },
        sm: {
          textTransform: 'uppercase',
          opacity: 0.75,
          fontSize: '14px',
          mt: 0,
        },
      },
      variants: {
        oneline,
      },
      defaultProps: {
        size: 'lg',
      },
    },
    Button: {
      baseStyle: {
        bg: '#3C558E',
        color: 'white',
        px: 10,
        fontWeight: 300,
      },
    },
    Text: {
      baseStyle: {
        mb: 0,
      },
      variants: {
        oneline,
      },
    },
    Link: {
      baseStyle: {
        color: '#1580D1',
      },
    },
    Container: {
      baseStyle: {
        maxW: '5xl',
      },
    },
  },
  icons: {
    carat: {
      path: (
        <path
          fill="currentColor"
          d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z"
        />
      ),
      viewBox: '0 0 320 512',
    },
  },
});
