import React from "react";
import { render, screen } from '@testing-library/react';
import App from "./App";

it("<App />", async () => {
  render(
    <App name='React Test'/>
  )
  const text = screen.getByText('Learn React');
  expect(text).toBeTruthy();
});
