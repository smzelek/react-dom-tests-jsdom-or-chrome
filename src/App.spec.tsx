import React from "react";
import { render, screen } from '@testing-library/react';
import App from "./App";
import { expect } from 'src/expect';

it("<App />", async () => {
  render(
    <App name='React Test'/>
  )
  await new Promise(r => setTimeout(r, 3000)); // only for demo purposes
  const text = screen.getByText('Learn React');
  expect(text).to.be.ok;
});
