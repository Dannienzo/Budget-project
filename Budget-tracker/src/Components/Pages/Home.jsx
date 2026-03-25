import React from 'react'
import HeroSection from '../Landing/Herosection'
import FeaturesSection from '../Landing/FeatureSession'
import Testimonial from './testiminial/Testimonial'
import TestimonialsSection from '../Landing/Testimoniol'
import CTASection from '../Landing/CTASession'

function Home() {
  return (
    <div>
       <HeroSection/>
       <FeaturesSection/>
        <Testimonial/>
        <TestimonialsSection/>
        <CTASection/>
    </div>
  )
}

export default Home