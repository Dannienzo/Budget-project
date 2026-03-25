import React from 'react'
import '../testiminial/testimonial.css'


function Testimonial() {
  return (
    <div className='text-center justify-content-center text-align-center Test'>
        <p>
        Simplicity, intelligence, and security <br />empowering you to take control of your finances with confidence <br />clarity, and smarter budgeting decisions.
        </p>
      <div style={{ width: 80, margin: "0 auto", height: 80 }}>
         <div className="animate-bounce text-primary text-4xl">↓</div>
      </div>
    </div>
  )
}

export default Testimonial