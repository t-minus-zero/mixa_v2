"use client"

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useMixContext } from '../../context/MixContext';

const MixPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { project, setProject } = useMixContext();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      // Fetch the mix project by id and update state
      fetch(`/api/projects/${id}`)
        .then(response => response.json())
        .then(data => {
          setProject(data);
          setLoading(false);
        });
    }
  }, [id, setProject]);

  if (loading || !project) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Editing Project: {project.name}</h1>
      {/* Add your UI editor components here */}
      <div>
        <p>Project ID: {project.id}</p>
        <p>Project Name: {project.name}</p>
        {/* Render the editor for the project here */}
      </div>
    </div>
  );
};

export default MixPage;
