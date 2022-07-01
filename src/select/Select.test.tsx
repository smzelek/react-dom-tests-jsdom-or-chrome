import React, { useState } from "react";
import { fireEvent, render, screen } from '@testing-library/react';
import Select from "./Select";
import 'jasmine-jquery';

const SelectFixture = (): JSX.Element => {
  const [value, setValue] = useState<string | null>(null)
  return (<Select
    label="my select"
    value={value}
    onChange={(e) => setValue(e)}
    options={['Option1', 'Option2']} />);
};

describe("<Select />", () => {
  it("can select option", async () => {
    render(<SelectFixture />)
    const select = document.querySelector('.select-box')!;
    fireEvent.click(select)
    let option2 = screen.getByText('Option2');
    fireEvent.click(option2)
    option2 = screen.getByText('Option2');
    expect(option2).toBeTruthy();
  })
});
