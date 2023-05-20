import { CharacterProperties } from 'pages/character-creation';
import React, { useState, useRef } from 'react';

const Attribute = ({
  name,
  change,
  defaultAtr,
  setPoints,
  remaining,
}: {
  setPoints: (x: number) => void;
  remaining: number;
  name: CharacterProperties;
  change: (atrValue: number, atrName: CharacterProperties) => void;
  defaultAtr: number;
}) => {
  const [atr, setAtr] = useState(defaultAtr);
  const inputRef = useRef<HTMLInputElement>(null);

  const minus = () => {
    if (atr > 0) {
      setAtr(atr - 1);
      change(Number(inputRef.current?.value), name);
      setPoints(1);
    }
  };

  const plus = () => {
    if (remaining > 0) {
      setAtr(atr + 1);
      change(Number(inputRef.current?.value), name);
      setPoints(-1);
    }
  };

  return (
    <div className="grid grid-cols-2 text-3xl w-60 m-1">
      <p className="gold">{name} : </p>
      <div className='flex'>
        <input ref={inputRef} value={atr} readOnly className="w-10 border mr-1 rounded" />
        <button type="button" className="border w-8 rounded bg-white" onClick={minus}>
          -
        </button>
        <button type="button" className="border w-8 rounded bg-white" onClick={plus}>
          +
        </button>
      </div>
    </div>
  );
};

export default Attribute;
