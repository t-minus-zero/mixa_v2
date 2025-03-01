"use client"

import React from 'react';
import InputTest from '../mix/[id]/_components/_stylesEditor/cssPropertySchemas/inputTest';
import InputTestProperty from '../mix/[id]/_components/_stylesEditor/cssPropertySchemas/inputTestProperty';

export default function TestingPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6 text-center">Input Types Testing Page</h1>
      <div className="max-w-xs mx-auto bg-white shadow-md rounded-lg ">
        <InputTestProperty />
        <InputTest />
      </div>
    </div>
  );
}