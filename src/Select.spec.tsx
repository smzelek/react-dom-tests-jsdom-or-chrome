import React, { useState } from "react";
import { fireEvent, render, screen } from '@testing-library/react';
import Select from "./Select";
import { expect } from './test/expect';

const SelectFixture = (): JSX.Element => {
  const [value, setValue] = useState<string | null>(null)
  return (<Select
    label="my select"
    width={400}
    value={value}
    onChange={(e) => setValue(e as any)}
    options={['Option1', 'Option2']} />);
};

describe("<Select />", () => {
  it("can select option", async () => {
    render(<SelectFixture />)
    await new Promise(r => setTimeout(r, 1000)); // only for demo purposes

    const select = document.querySelector('.select-box')!;
    fireEvent.click(select)
    await new Promise(r => setTimeout(r, 1000)); // only for demo purposes

    let option2 = screen.getByText('Option2');
    fireEvent.click(option2)
    await new Promise(r => setTimeout(r, 1000)); // only for demo purposes

    option2 = screen.getByText('Option2');
    expect(option2).to.be.ok;
  })
});
