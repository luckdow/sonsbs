import React from 'react';
import { Helmet } from 'react-helmet-async';

const StructuredData = ({ schema, id }) => {
  if (!schema) return null;

  const schemaString = JSON.stringify(schema, null, 0);

  return (
    <Helmet>
      <script 
        type="application/ld+json"
        id={id}
      >
        {schemaString}
      </script>
    </Helmet>
  );
};

export default StructuredData;
