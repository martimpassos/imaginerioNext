import React from 'react';
import PropTypes from 'prop-types';
import { omit } from 'lodash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCompass } from '@fortawesome/pro-regular-svg-icons';
import { Box, IconButton, Tooltip } from '@chakra-ui/react';

const styleProps = {
  boxShadow: 'md',
  border: '1px solid #ccc',
  backgroundColor: 'white',
  borderRadius: '0.375rem',
};

const HeadingControl = props => {
  const buttonStyleProps = omit(props, 'targetHeading', 'heading', 'handler');
  const { heading, targetHeading, handler } = props;

  return (
    <Box {...buttonStyleProps}>
      <Tooltip label="Orient map to view" placement="left" hasArrow>
        <IconButton
          size="sm"
          {...styleProps}
          icon={<FontAwesomeIcon icon={faCompass} color="black" />}
          onClick={() => handler(heading ? 0 : targetHeading)}
        />
      </Tooltip>
    </Box>
  );
};

HeadingControl.propTypes = {
  heading: PropTypes.number.isRequired,
  targetHeading: PropTypes.number.isRequired,
  handler: PropTypes.func.isRequired,
};

export default HeadingControl;
