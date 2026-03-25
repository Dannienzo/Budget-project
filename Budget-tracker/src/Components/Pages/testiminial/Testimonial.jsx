import React from 'react'
import Lottie from "lottie-react"
import scrollIcon from "../../../assets/scroll-Down.json"
import '../testiminial/testimonial.css'


function Testimonial() {
  return (
    <div className='text-center justify-content-center text-align-center Test'>
        <p>
        Simplicity, intelligence, and security <br />empowering you to take control of your finances with confidence <br />clarity, and smarter budgeting decisions.
        </p>
      <div style={{ width: 80, margin: "0 auto", height: 80 }}>
        <Lottie animationData={scrollIcon} loop={true} autoplay={true} style={{ cursor: "pointer" }}  />
      </div>
    </div>
  )
}

export default Testimonial