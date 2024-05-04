import React, { ReactElement, useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components/macro';

export type SelectProps<T> = {
  value: T | null;
  options: T[] | undefined;
  render?: (t: T) => JSX.Element | string;
  mapToKey?: (t: T, i: number) => string;
  mapToText?: (t: T, i: number) => string;
  isError?: boolean;
  isDisabled?: boolean;
  width?: number | string;
  height?: 'small' | 'medium' | 'large';
  onBlur?: () => void;
  onChange?: (t: T | null) => void;
  id?: string;
  label?: JSX.Element | string;
  placeholder?: string;
  clearable?: boolean;
};

const identityString = <T,>(a: T, i: number) => {
  if (typeof a !== 'object') {
    return String(a);
  }
  return String(i);
};

const Select = <T,>({
  id,
  value,
  isError,
  isDisabled,
  options,
  width,
  label,
  placeholder,
  height = 'small',
  onChange = () => null,
  onBlur = () => null,
  render = (a) => a as unknown as string,
  mapToKey = identityString,
  mapToText = identityString,
  clearable = false,
}: SelectProps<T>): ReactElement<SelectProps<T>> => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [toMatch, setToMatch] = useState<string>('');
  const ref = useRef<HTMLDivElement>(null);
  const optionRefs = useRef<{ el: HTMLDivElement; key: string }[]>([]);

  const shouldDisable = isDisabled || !options || options.length === 0;

  const setSelectOpen = useCallback(
    ({ open, focus }: { open: boolean; focus: boolean }) => {
      if (shouldDisable) {
        return;
      }

      setDropdownOpen(open);
      if (!open) {
        onBlur();
        setToMatch('');
      }

      if (focus) {
        ref.current?.focus();
      }
    },
    [onBlur, setDropdownOpen, shouldDisable]
  );

  const findMatch = useCallback(() => {
    const matchIndex = (options || []).findIndex((o, i) => mapToText(o, i).toLowerCase().startsWith(toMatch));
    return optionRefs.current?.[matchIndex]?.el;
  }, [options, toMatch, mapToText]);

  useEffect(() => {
    if (!dropdownOpen) {
      return;
    }

    if (shouldDisable) {
      setSelectOpen({ open: false, focus: false });
      return;
    }

    if (options && toMatch.length) {
      const matchEl = findMatch();
      matchEl?.focus();
      matchEl?.scrollIntoView();
      return;
    }
  }, [dropdownOpen, shouldDisable, toMatch, value, options, findMatch, setSelectOpen, mapToKey, mapToText]);

  useEffect(() => {
    // Only want to focus the defaults (first option / value) when the select initially opens, with no search.
    if (!dropdownOpen) {
      return;
    }

    const matchEl = findMatch();
    if (toMatch.length && matchEl) {
      return;
    }

    if (value) {
      const valueEl = optionRefs.current?.find((ref, i) => ref.key === mapToKey(value, i))?.el;
      valueEl?.focus();
      valueEl?.scrollIntoView();
      return;
    }

    optionRefs.current?.[0]?.el?.focus();
  }, [dropdownOpen, findMatch, mapToKey, toMatch.length, value]);

  const chooseOption = (option: T) => {
    if (shouldDisable) {
      return;
    }

    setSelectOpen({ open: false, focus: true });
    onChange(option);
  };

  const clickOut = useCallback(
    (evt: MouseEvent) => {
      if (ref.current?.contains(evt.target as Node)) {
        return;
      }

      if (dropdownOpen) {
        setSelectOpen({ open: false, focus: false });
      }
    },
    [setSelectOpen, dropdownOpen]
  );

  useEffect(() => {
    document.body.addEventListener('mousedown', clickOut);
    return () => {
      document.body.removeEventListener('mousedown', clickOut);
    };
  }, [clickOut]);

  const renderCurrent = () => {
    if (!options || !value) {
      return placeholder ? <span className="select-box--selected-text--placeholder">{placeholder}</span> : null;
    }

    return render(value);
  };

  const selectKeydown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (['Enter', ' ', 'Spacebar'].includes(event.key)) {
      event.preventDefault();
      setSelectOpen({ open: !dropdownOpen, focus: true });
      return;
    }

    if (['Esc', 'Escape'].includes(event.key)) {
      event.preventDefault();
      setSelectOpen({ open: false, focus: true });
      return;
    }

    if (['ArrowDown'].includes(event.key)) {
      event.preventDefault();
      setToMatch('');

      if (!dropdownOpen) {
        setSelectOpen({ open: true, focus: true });
        return;
      }

      const nextEl = document.activeElement === ref.current ? optionRefs.current?.[0].el : document.activeElement?.nextElementSibling;
      (nextEl as HTMLElement | undefined)?.focus();
      nextEl?.scrollIntoView();
      return;
    }

    if (['Tab'].includes(event.key) && dropdownOpen) {
      setSelectOpen({ open: false, focus: true });
      return;
    }

    if (['ArrowUp'].includes(event.key)) {
      event.preventDefault();
      setToMatch('');

      if (!dropdownOpen) {
        return;
      }

      if (document.activeElement === optionRefs.current?.[0].el) {
        setSelectOpen({ open: false, focus: true });
        return;
      }

      const prevEl = document.activeElement?.previousElementSibling as HTMLElement | null | undefined;
      prevEl?.focus();
      prevEl?.scrollIntoView();
      return;
    }

    if (/^[A-Za-z0-9]$/.test(event.key)) {
      event.preventDefault();
      event.stopPropagation();

      setToMatch(toMatch + event.key.toLowerCase());
      setSelectOpen({ open: true, focus: false });
    }
  };

  const optionKeydown = (o: T) => (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (['Enter', ' ', 'Spacebar'].includes(event.key)) {
      chooseOption(o);
    }
  };

  const clearCurrentValue = (
    mouseEvent?: React.MouseEvent<HTMLAnchorElement> | React.KeyboardEvent<HTMLAnchorElement>,
    keyboardEvent?: React.KeyboardEvent<HTMLAnchorElement>
  ) => {
    if (shouldDisable) {
      return;
    }

    if (keyboardEvent) {
      if (!['Enter', ' ', 'Spacebar'].includes(keyboardEvent.key)) {
        return;
      }

      keyboardEvent.preventDefault();
      keyboardEvent.stopPropagation();
    }

    if (mouseEvent) {
      mouseEvent.preventDefault();
      mouseEvent.stopPropagation();
    }

    setSelectOpen({ open: false, focus: true });
    onChange(null);
  };

  return (
    <>
      {label && <label htmlFor={id}>{label}</label>}
      <SelectWrapper
        ref={ref}
        isError={isError}
        width={width || '100%'}
        height={height || 'small'}
        isOpen={dropdownOpen}
        isDisabled={shouldDisable}
        tabIndex={0}
        onClick={() => setSelectOpen({ open: !dropdownOpen, focus: true })}
        onKeyDown={selectKeydown}
      >
        <div className="select-box">
          <span className="select-box--selected-text">{renderCurrent()}</span>
          {clearable && value && (
            <a className="select-box--clear" tabIndex={0} onClick={clearCurrentValue} onKeyDown={(e) => clearCurrentValue(undefined, e)}>
              X
            </a>
          )}
          <span className="select-box--caret">
            ▼
          </span>
        </div>
        {dropdownOpen && (
          <div className="select-dropdown">
            <div className="scroll-wrapper">
              {options?.map((o, i) => (
                <div
                  className={'select-option' + (value != null && mapToKey(value, i) === mapToKey(o, i) ? ' select-option--chosen' : '')}
                  tabIndex={-1}
                  ref={(ref) => (optionRefs.current[i] = { el: ref as HTMLDivElement, key: mapToKey(o, i) })}
                  key={mapToKey(o, i)}
                  onKeyDown={optionKeydown(o)}
                  onClick={() => chooseOption(o)}
                >
                  <span>{render(o)}</span>
                  {value != null && mapToKey(value, i) === mapToKey(o, i) && (
                    <span className="select-option--chosen-icon">
                      ✓
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </SelectWrapper>
    </>
  );
};

const SelectWrapper = styled.div<{
  isError: boolean | undefined;
  width: number | string;
  height: 'small' | 'medium' | 'large';
  isOpen: boolean;
  isDisabled: boolean;
}>`
  min-width: 100px;
  border-radius: 6px;
  font-size: 15px;
  border: 1px solid #c3c3c3;
  position: relative;
  background-color: white;
  color: black;

  ${(props) =>
    props.height === 'small' &&
    `
      height: 32px;
  `}

  ${(props) =>
    props.height === 'medium' &&
    `
      height: 40px;
  `}

  ${(props) =>
    props.height === 'large' &&
    `
     height: 48px;
  `}

  ${(props) => (typeof props.width === 'string' ? `width: ${props.width}; ` : null)}
  ${(props) => (typeof props.width === 'number' ? `width: ${props.width}px; ` : null)}

  ${(props) =>
    props.isError &&
    `
      border: 1px solid red;

      .select-dropdown {
          border-left: 1px solid red;
          border-right: 1px solid red;
          border-bottom: 1px solid red;
      }
  `}
  ${(props) =>
    props.isDisabled &&
    `
        background-color: #e1e1e1;
        .select-box {
            cursor: not-allowed;
        }
        .select-option {
            background-color: #e1e1e1;
            cursor: not-allowed;
        }
    `}

  &:focus-within {
    border: 1px solid #1b6dff;
    outline: 1px solid #1b6dff;

    .select-box {
      outline: none;
    }
  }

  .select-box {
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    position: relative;
    cursor: pointer;
    padding: 0 10px;
    box-sizing: border-box;

    &--selected-text {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      flex-grow: 1;

      &--placeholder {
        color: #98a2ad;
      }
    }

    span {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    &--clear,
    &--caret {
      font-family: monospace;
      flex-grow: 0;
      flex-shrink: 0;
      font-size: 12px;
      min-width: 16px;
    }

    &--clear {
      padding: 4px;
      margin-right: 3px;

      &:focus,
      &:hover {
        background-color: #f6f8fc;
        border-radius: 50%;
        outline: none;
      }
    }
  }

  .select-preview {
    z-index: 2;
    display: none;
    position: absolute;
    top: 100%;
    left: -1px;
    width: calc(100% + 2px);
    background-color: white;
    border: 1px solid #c3c3c3;
    box-sizing: border-box;
    border-radius: 6px;
    border-top: 1px solid lightgray;
    overflow: hidden;
  }

  .select-dropdown {
    z-index: 1;
    position: absolute;
    top: calc(100% + 8px);
    left: -1px;
    min-width: calc(100% + 2px);
    max-width: calc(200% + 2px);
    background-color: white;
    border: 1px solid #c3c3c3;
    box-sizing: border-box;
    border-radius: 6px;
    border-top: 1px solid lightgray;
    overflow: hidden;

    .scroll-wrapper {
      max-height: 200px;
      overflow: hidden;
      overflow-y: auto;
    }
  }

  ${(props) =>
    props.width === '100%' &&
    `
      .select-dropdown {
        max-width: calc(100% + 2px);
      }
  `}

  .select-option {
    height: 35px;
    padding: 0 10px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    cursor: pointer;

    input[type='checkbox'] {
      margin-right: 10px;
      width: 10px;
      pointer-events: none;
    }

    span {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    &:hover {
      background: #f6f8fc;
    }

    &--chosen {
      display: flex;

      span:first-of-type {
        flex-grow: 1;
      }

      span:last-of-type {
        min-width: 16px;
      }
    }

    &--chosen,
    &:focus {
      background-color: #e3edff;
      color: #1b6dff;

      &:hover {
        background-color: #cddfff;
      }
    }
  }
`;

export default Select;