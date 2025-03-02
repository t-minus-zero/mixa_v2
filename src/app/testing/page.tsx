"use client"

import React from 'react';
import InputTest from '../mix/[id]/_components/cssPropertySchemas/inputTest';
import InputTestProperty from '../mix/[id]/_components/cssPropertySchemas/inputTestProperty';
import { InputTreeTester } from '../mix/[id]/_components/_fragments/inputTree';

export default function TestingPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Testing Page</h1>
      
      <div className="max-w-2xl mx-auto">
        <InputTreeTester />
      </div>
    </div>
  );
}