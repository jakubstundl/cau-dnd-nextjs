import React, { useState } from 'react';
import styles from '../styles/Classes.module.css';
import ClassDetail from './ClassDetail';
import PropTypes from 'prop-types';
import { Class } from '@prisma/client';


type ClassList = {
  name: string;
  id: number;
  description: string;
  on: boolean;
};

const ClassList = ({
  classes,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setClass = () => {},
}: {
  classes: Class[];
  setClass: (arg:string)=>void;
}) => {
  const classesWithBoolean:ClassList[]=classes.map((e:Class)=>{return {...e,on:false}})
  const [selectedClass, setSelectedClass] = useState(classesWithBoolean);
  
  const handleClick = (name: string) => {
    setClass(name);

    setSelectedClass((prevClass) => {
      return prevClass.map((oneClass) => {
        return oneClass.name === name
          ? { ...oneClass, on: !oneClass.on }
          : { ...oneClass, on: false };
      });
    });
  };

  const allClasses = selectedClass.map((oneClass: ClassList) => ( 
    <ClassDetail
      key={oneClass.id}
      click={handleClick}
      desc={oneClass.description}
      name={oneClass.name}
      on={oneClass.on}
    ></ClassDetail>
  ));
  return (
    <>
      <div className={styles.body}>
        <h1 className="gold font-LOTR text-center text-4xl pt-20 tracking-widest">CHOOSE YOUR CLASS</h1>
        <ul test-id="classesArr" className={styles.ul}>
          {allClasses}
        </ul>
      </div>
    </>
  );
};
ClassList.defaultProps = {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setClass: () => {},
  creation: false,
}

ClassList.propTypes = {
  setClass: PropTypes.func,
  creation: PropTypes.bool,
};

export default ClassList;
