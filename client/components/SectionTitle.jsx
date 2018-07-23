import React from 'react';

const SectionTitle = ({ title, sectionName, toggleShow }) => (
  <h4 
    onClick={() => { toggleShow(sectionName) }} 
  >
    {title}
  </h4>
);

export default SectionTitle;