import React, { useEffect, useRef } from 'react'
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

const Navbar = () => {
  // document.addEventListener('scroll', () => {
  //   const header = document.querySelector('header')

  //   if(window.scrollY > 0) {
  //     header.classList.add('scrolled')
  //   } else {
  //     header.classList.remove('scrolled')
  //   }
  // })
  const navLinks = [
    {
      text: 'About',
      color: '#c261fe',
    },
    {
      text: 'Toolset',
      color: '#5a82f9',
    },
    {
      text: 'Projects',
      color: '#00e0f4',
    },
    {
      text: 'Services',
      color: '#c261fe',
    },
    {
      text: 'Contact',
      color: '#5a82f9',
    },
  ]

  let navbarRef = useRef(null)
  let scrollCheck = useRef(null)

  useEffect(() => {
    const navObserver = new IntersectionObserver((entries) => {
      navbarRef.current.classList.toggle('sticking', !entries[0].isIntersecting)
    })

    navObserver.observe(scrollCheck.current)

    return () => {
      navObserver.disconnect()
    }
  }, [])
  return (
    <>
      <div
        ref={scrollCheck}
        className="absolute top-0 left-0 w-full bg-red-600"
      />
      <header
        ref={navbarRef}
        className="navbar sticky z-30 top-0 left-0 w-full  text-zinc-400  backdrop-blur-md "
      >
        <nav className="h-full px-12  flex justify-between items-center py-5">
          <div
            id="brand"
            className="flex items-center space-x-4 w-[700px]"
          >
            {/* <Trademark2D classes="text-green-500 opacity-20 scale-150 absolute top-0 left-0" /> */}
            {/* <Trademark2D classes="w-8 h-8 text-zinc-200 " /> */}
            <Trademark23 className="w-8 h-8 text-zinc-200 " />
            {/* <Trademark1 className="w-8 h-8 text-zinc-200 " />
          <Trademark2 className="w-8 h-8 text-zinc-200 " />
          <Trademark3 className="w-8 h-8 text-zinc-200 " />
          <Trademark4 className="w-8 h-8 text-zinc-200 " />
          <Trademark5 className="w-8 h-8 text-zinc-200 " />
          <Trademark6 className="w-8 h-8 text-zinc-200 " />
          <Trademark7 className="w-8 h-8 text-zinc-200 " />
          <Trademark8 className="w-8 h-8 text-zinc-200 " />
          <Trademark9 className="w-8 h-8 text-zinc-200 " />
          <Trademark10 className="w-8 h-8 text-zinc-200 " />
          <Trademark11 className="w-8 h-8 text-zinc-200 " />
          <Trademark12 className="w-8 h-8 text-zinc-200 " />
          <Trademark13 className="w-8 h-8 text-zinc-200 " />
          <Trademark14 className="w-8 h-8 text-zinc-200 " />
          <Trademark15 className="w-8 h-8 text-zinc-200 " />
          <Trademark16 className="w-8 h-8 text-zinc-200 " />
          <Trademark17 className="w-8 h-8 text-zinc-200 " />
          <Trademark18 className="w-8 h-8 text-zinc-200 " />
          <Trademark19 className="w-8 h-8 text-zinc-200 " />
          <Trademark20 className="w-8 h-8 text-zinc-200 " />
          <Trademark21 className="w-8 h-8 text-zinc-200 " />
          <Trademark22 className="w-8 h-8 text-zinc-200 " /> */}
          </div>
          <div className="flex items-center space-x-8">
            <ul
              id="links"
              className="navList font-semibold flex space-x-8 list-none tracking-wide text-sm"
            >
              {navLinks.map((linkItem) => (
                <li
                  key={linkItem.text}
                  className="rising-text"
                  data-text={linkItem.text}
                  style={{ '--text-color': linkItem.color }}
                >
                  {' '}
                  {linkItem.text}{' '}
                </li>
              ))}
            </ul>
            <NeonButton text="Resume" />
          </div>
        </nav>
      </header>
    </>
  )
}

export default Navbar
