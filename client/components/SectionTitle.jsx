import React from 'react';

const SectionTitle = ({ title, sectionName, toggleShow }) => (
  <strong 
    onClick={() => { toggleShow(sectionName) }} 
    style={{
      display: 'inline-block',
      cursor: 'pointer',
      'text-decoration': 'underline',
      color: '#0000EE'
    }}
  >
    {title}
  </strong>
);

export default SectionTitle;