import Image from 'next/image';
import ArrowIcon from '../../public/iconsNavBar/arrow.svg';
import Link from 'next/link';
import React, { useState, useEffect, useRef } from 'react';
import { CSSTransition } from 'react-transition-group';
import { trpc } from 'utils/trpc';
import { useSession } from 'next-auth/react';

export function NavigationBar() {
  return (
    <Navbar>
      <NavItem>
        <DropdownMenu></DropdownMenu>
      </NavItem>
    </Navbar>
  );
}

function Navbar(props: any) {
  return (
    <nav className="navbar font-LOTR">
      <ul className="navbar-nav">{props.children}</ul>
    </nav>
  );
}

function NavItem(props: any) {
  const { ref, isComponentVisible, setIsComponentVisible } =
    useComponentVisible(false);

  return (
    <li className="nav-item" ref={ref}>
      <a
        href="#"
        className="icon-butto gold goldeffect pl-20 text-2xl"
        onClick={() => setIsComponentVisible(!isComponentVisible)}
        ref={ref}
      >
        Menu
        {props.icon}
      </a>
      {isComponentVisible && props.children}
    </li>
  );
}

function DropdownMenu() {
  const [activeMenu, setActiveMenu] = useState('main');
  const [menuHeight, setMenuHeight] = useState<any>(null);
  const dropdownRef = useRef<any>(null);

  const dataRaces = trpc.dbRouter.getAllRaces.useQuery();
  const races = dataRaces.data;
  const dataClasses = trpc.dbRouter.getAllClasses.useQuery();
  const classes = dataClasses.data;

  useEffect(() => {
    setMenuHeight(dropdownRef.current?.firstChild.offsetHeigh);
  }, []);

  function calcHeight(el: any) {
    const height = el.offsetHeight;
    setMenuHeight(height + 30);
  }

  function DropdownItem(props: any) {
    return (
      <a
        href="#"
        className="menu-item"
        onClick={() => props.goToMenu && setActiveMenu(props.goToMenu)}
      >
        {props.children}
        <span className="icon-right">{props.rightIcon}</span>
      </a>
    );
  }

  const sessionData = useSession();
  return (
    <div className="dropdown" style={{ height: menuHeight }} ref={dropdownRef}>
      <CSSTransition
        in={activeMenu === 'main'}
        timeout={500}
        classNames="menu-primary"
        unmountOnExit
        onEnter={calcHeight}
      >
        <div className="menu">
          <Link href="/">
            <DropdownItem>Home Page</DropdownItem>
          </Link>

          <DropdownItem goToMenu="races">Races</DropdownItem>
          <DropdownItem goToMenu="classes">Classes</DropdownItem>
          
          <Link href="/shop">
            <DropdownItem>Shop</DropdownItem>
          </Link>

          {sessionData.data?.user?.id &&(<Link href="/character-list">
            <DropdownItem>Character List</DropdownItem>
          </Link>)}

          {sessionData.data?.user?.id &&(<Link href={`/user/${sessionData.data.user.id}`}>
            <DropdownItem>User Settings</DropdownItem>
          </Link>)}
        </div>
      </CSSTransition>

      <CSSTransition
        in={activeMenu === 'races'}
        timeout={500}
        classNames="menu-secondary"
        unmountOnExit
        onEnter={calcHeight}
      >
        <div className="menu">
          <DropdownItem goToMenu="main">
            <Image src={ArrowIcon} alt="" height={20} width={20}></Image>
          </DropdownItem>
          <Link href={`/races`}>
            <DropdownItem>All Races</DropdownItem>
          </Link>
          {races?.map((e: any) => (
            <Link key={e} href={`/races/${e.name}`}>
              <DropdownItem>{e.name}</DropdownItem>
            </Link>
          ))}
        </div>
      </CSSTransition>

      <CSSTransition
        in={activeMenu === 'classes'}
        timeout={500}
        classNames="menu-secondary"
        unmountOnExit
        onEnter={calcHeight}
      >
        <div className="menu">
          <DropdownItem goToMenu="main">
            <Image src={ArrowIcon} alt="" height={20} width={20}></Image>
          </DropdownItem>
          <Link href={`/classes`}>
            <DropdownItem>All Classes</DropdownItem>
          </Link>
          {classes?.map((e: any) => (
            <Link key={e} href={`/classes/${e.name}`}>
              <DropdownItem>{e.name}</DropdownItem>
            </Link>
          ))}
        </div>
      </CSSTransition>
    </div>
  );
}

export function useComponentVisible(initialIsVisible: any) {
  const [isComponentVisible, setIsComponentVisible] =
    useState(initialIsVisible);
  const ref = useRef<any>(null);

  const handleClickOutside = (event: any) => {
    if (ref.current && !ref.current.contains(event.target)) {
      setIsComponentVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, []);

  return { ref, isComponentVisible, setIsComponentVisible };
}

export default NavigationBar;
