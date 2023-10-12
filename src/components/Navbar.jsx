import React, { useEffect, useRef, useState } from 'react'
import Trademark2D from './Trademark2D'
import NeonButton from './NeonButton'
import { ReactComponent as Trademark1 } from '../assets/trademark/A_made_by_Subtract.svg'
import { ReactComponent as Trademark2 } from '../assets/trademark/A_rocket_lookalike.svg'
import { ReactComponent as Trademark3 } from '../assets/trademark/A_trapeziods_smooth_corners_with_tilt.svg'
import { ReactComponent as Trademark4 } from '../assets/trademark/A_trapeziods_smooth_corners.svg'
import { ReactComponent as Trademark5 } from '../assets/trademark/A_trapeziods.svg'
import { ReactComponent as Trademark6 } from '../assets/trademark/A_upside_down_V_with_tilt.svg'
import { ReactComponent as Trademark7 } from '../assets/trademark/A_upside_down_V.svg'
import { ReactComponent as Trademark8 } from '../assets/trademark/A_with_circles_at_ends.svg'
import { ReactComponent as Trademark9 } from '../assets/trademark/A_with_dot_with_tilt.svg'
import { ReactComponent as Trademark10 } from '../assets/trademark/A_with_dot.svg'
import { ReactComponent as Trademark11 } from '../assets/trademark/A_with_leg_missing_tall.svg'
import { ReactComponent as Trademark12 } from '../assets/trademark/A_with_leg_missing.svg'
import { ReactComponent as Trademark13 } from '../assets/trademark/A_with_parallelogram_dot_rounded.svg'
import { ReactComponent as Trademark14 } from '../assets/trademark/A_with_parallelogram_dot_tilted_1_rounded.svg'
import { ReactComponent as Trademark15 } from '../assets/trademark/A_with_parallelogram_dot_tilted_1.svg'
import { ReactComponent as Trademark16 } from '../assets/trademark/A_with_parallelogram_dot_tilted_2.svg'
import { ReactComponent as Trademark17 } from '../assets/trademark/A_with_parallelogram_dot.svg'
import { ReactComponent as Trademark18 } from '../assets/trademark/A_with_simple_arrow_rounded_with_circle.svg'
import { ReactComponent as Trademark19 } from '../assets/trademark/A_with_simple_arrow_rounded_with_middle_bar_normal.svg'
import { ReactComponent as Trademark20 } from '../assets/trademark/A_with_simple_arrow_rounded_with_middle_bar_wide.svg'
import { ReactComponent as Trademark21 } from '../assets/trademark/A_with_simple_arrow_rounded_with_mini.svg'
import { ReactComponent as Trademark22 } from '../assets/trademark/A_with_simple_arrow_rounded.svg'
import { ReactComponent as Trademark23 } from '../assets/trademark/A_with_leg_missing_tall_with_stroke.svg'
import { ReactComponent as Cross } from '../assets/icons/cross.svg'
// import { ReactComponent as Hamburger } from '../assets/icons/hamburger.svg'

import gsap from 'gsap'
import ContactEmailBanner from './ContactEmailBanner'

const Navbar = ({ contactRef }) => {
  const navLinks = [
    {
      text: 'About',
      color: '#a78bfa',
      link: '#about',
    },
    {
      text: 'Toolset',
      color: '#5a82f9',
      link: '#toolset',
    },
    {
      text: 'Projects',
      color: '#00a0c4',
      link: '#projects',
    },
    {
      text: 'Services',
      color: '#a78bfa',
      link: '#services',
    },
    {
      text: 'Contact',
      color: '#5a82f9',
      link: '#contact',
    },
  ]

  const [hoverIndex, setHoverIndex] = useState(0)
  const [isNavHovered, setIsNavHovered] = useState(false)
  const [isLogoHovered, setIsLogoHovered] = useState(false)
  const [isNavOpen, setIsNavOpen] = useState(false)

  let navbarRef = useRef(null)
  let underlineRef = useRef(null)
  let scrollCheck = useRef(null)

  useEffect(() => {
    let scrolling = false
    let oldOffset = 0

    window.onscroll = () => {
      scrolling = true
    }

    if (window.scrollY <= 15) {
      navbarRef.current.classList.remove('sticking')
      navbarRef.current.classList.remove('py-5')
      navbarRef.current.classList.add('py-10')
    } else {
      navbarRef.current.classList.add('sticking')
      navbarRef.current.classList.remove('py-10')
      navbarRef.current.classList.add('py-5')
    }

    const scrollingInterval = setInterval(() => {
      if (!isNavOpen) {
        if (scrolling) {
          scrolling = false
          if (window.scrollY > oldOffset) {
            console.log('scrolling down')
            navbarRef.current.classList.remove('sticking')
            if (window.scrollY <= 15) {
              navbarRef.current.classList.remove('scrolling-down')
            } else {
              navbarRef.current.classList.add('scrolling-down')
            }
          } else {
            console.log('scrolling up')
            navbarRef.current.classList.remove('scrolling-down')
            if (window.scrollY <= 15) {
              navbarRef.current.classList.remove('sticking')
              navbarRef.current.classList.remove('py-5')
              navbarRef.current.classList.add('py-10')
            } else {
              navbarRef.current.classList.add('sticking')
              navbarRef.current.classList.remove('py-10')
              navbarRef.current.classList.add('py-5')
            }
          }
          oldOffset = window.scrollY
        }
      }
    }, 300)

    return () => {
      clearInterval(scrollingInterval)
    }
  }, [isNavOpen])

  useEffect(() => {
    gsap.to(underlineRef.current, {
      opacity: isNavHovered ? 1 : 0,
      duration: 0.4,
    })
  }, [isNavHovered])

  useEffect(() => {
    gsap.to(underlineRef.current, {
      '--text-color': navLinks[hoverIndex].color,
      left: 96 * hoverIndex,
      duration: 0.6,
      ease: 'sine.out',
    })
  }, [hoverIndex])

  return (
    <>
      <header
        ref={navbarRef}
        className="navbar fixed z-[4000000] top-0 left-0 w-full text-zinc-300"
      >
        <nav className="h-full px-5 sm:px-20 transition-all duration-300 flex justify-between items-center relative ">
          <div
            id="brand"
            className="brand flex items-center justify-center relative rounded-full w-14 h-14 bg-black"
            onMouseEnter={() => {
              setIsLogoHovered(true)
            }}
            onMouseLeave={() => {
              setIsLogoHovered(false)
            }}
            onClick={() => {
              window.scrollTo(0, 0)
            }}
          >
            <Trademark23
              className={`w-8 h-8  ${
                isLogoHovered ? 'text-[#3667c4]' : 'text-zinc-200'
              }`}
            />
            <Trademark23 className="absolute w-8 h-8 text-zinc-200 hover:text-[#5a82f9] hover:animate-ping rising-icon" />
          </div>
          <div className="nav-links-container h-12 px-[14px] backdrop-blur bg-black hidden md:flex items-center space-x-8">
            <ul
              id="links"
              onMouseEnter={() => {
                setIsNavHovered(true)
              }}
              onMouseLeave={() => {
                setIsNavHovered(false)
              }}
              className="nav-list h-full font-semibold flex list-none tracking-tighter text-sm"
            >
              {navLinks.map((linkItem, index) => (
                <li
                  key={index}
                  className={`nav-links text-zinc-200 w-24 h-full flex items-center justify-center cursor-pointer `}
                  data-text={linkItem.text}
                  onClick={() => {
                    // contactRef.current.scrollIntoView({ behavior: 'smooth' })
                  }}
                  style={{
                    '--text-color': linkItem.color,
                    // color: linkItem.color,
                    // backgroundColor: linkItem.color,
                  }}
                  onMouseEnter={() => {
                    setHoverIndex(index)
                  }}
                >
                  <a href={linkItem.link}>{linkItem.text}</a>
                </li>
              ))}
            </ul>
            <div
              ref={underlineRef}
              className="nav-links-underline absolute bottom-0 h-[1px] w-16 z-[100]"
            />
            {/* <NeonButton text="Resume" /> */}
          </div>
          <div className="block md:hidden text-4xl">
            <Hamburger
              isOpen={isNavOpen}
              handleClick={() => {
                setIsNavOpen((v) => !v)
              }}
            />
          </div>
        </nav>
      </header>
      <nav
        className={`z-[3000000] md:hidden fixed w-full h-screen bg-black/40 backdrop-blur-md left-0 transition-all duration-700 ease-out ${
          isNavOpen ? 'top-0' : '-top-full'
        }`}
      >
        <ul
          id="links"
          onMouseEnter={() => {
            setIsNavHovered(true)
          }}
          onMouseLeave={() => {
            setIsNavHovered(false)
          }}
          className="w-full h-[90%] font-semibold flex flex-col items-center justify-center space-y-14 list-none tracking-tighter text-3xl"
        >
          {navLinks.map((linkItem, index) => (
            <li
              key={index}
              className={`flex items-center justify-center cursor-pointer transition-[opacity,_transform] duration-300 translate-y-0  ${
                isNavOpen
                  ? 'opacity-100 delay-[var(--delay)] translate-y-8'
                  : 'opacity-0 '
              }`}
              data-text={linkItem.text}
              onClick={() => {
                setIsNavOpen(false)
              }}
              style={{
                '--text-color': linkItem.color,
                '--delay': `${index * 120 + 700}ms`,
              }}
              onMouseEnter={() => {
                setHoverIndex(index)
              }}
            >
              <p className="text-zinc-200 hover:text-[var(--text-color)] transition-colors duration-300">
                <a href={linkItem.link}>{linkItem.text}</a>
              </p>
            </li>
          ))}
        </ul>
        <div
          className={`flex items-center justify-center cursor-pointer transition-opacity duration-300  ${
            isNavOpen ? 'opacity-100 delay-[1500ms]' : 'opacity-0 '
          }`}
        >
          <ContactEmailBanner />
        </div>
      </nav>
    </>
  )
}

export default Navbar

const Hamburger = ({ isOpen, handleClick }) => {
  return (
    <svg
      fill="currentColor"
      className="w-10 h-10 cursor-pointer rounded p-2 hover:bg-slate-200/20 transition-colors duration-300"
      viewBox="0 0 100 100"
      onClick={handleClick}
    >
      <rect
        className={`origin-center transition-[transform,_y] duration-300 ease-out ${
          !isOpen ? 'rotate-0 [y:30]' : 'rotate-45 [y:45]'
        }`}
        width={90}
        height={5}
        x={5}
        y={35}
        rx={3}
      ></rect>

      <rect
        className={`origin-center transition-[transform,_y] duration-300 ease-out ${
          !isOpen ? 'rotate-0 [y:60]' : '-rotate-45 [y:45]'
        }`}
        width={90}
        height={5}
        x={5}
        y={55}
        rx={3}
      ></rect>
    </svg>
  )
}
