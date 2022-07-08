import React from "react";
import { render, screen } from '@testing-library/react';
import App from "./App";
import { expect } from 'src/expect';

it("<App />", async () => {
  render(
    <App name='React Test'/>
  )
  const text = screen.getByText('Learn React');
  expect(text).to.be.ok;
});
