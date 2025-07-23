import { FeatureSection } from '~/components/featured-section'
import { HeroSection } from '~/components/hero'
import React from 'react'
import Icon1 from './Icon'
import AnimtatedTorus from './animated-torus'
import BlurImage from '~/components/miscellaneous/blur-image'
import UseCaseSection from '~/components/use-case'
import HowItWorksSection from '~/components/how-it-works'
import FaqSection from '~/components/faq-section'

const page = () => {
  return (
    <>
      <HeroSection />
      <FeatureSection
        title="DECENTRALISED SHARED HOSTING"
        description="Files stored on the Walrus blockchain are kept alive through community contributions — anyone can pitch in to cover hosting costs."
        className="bg-[#004369]"
        icon={<Icon1 />}
      />
      <FeatureSection
        title="EXTEND FILE LIFECYCLES"
        description="Add epochs to a blob's life by funding it with SUI tokens. The more support a blob gets, the longer it stays online."
        className="bg-[#004369]"
        icon={<AnimtatedTorus />}
        reverse={true}
      />
      <FeatureSection
        title="POWERED BY COMMUNITY"
        description="Anyone can tip a blob to keep it online. Support the files that matter most — a decentralised, community-driven storage ecosystem."
        className="bg-[#004369]"
        icon={
          <BlurImage
            src="/cube-helix3.png"
            alt="Cube Helix"
            width={330}
            height={329}
          />
        }
      />
      <HowItWorksSection />
      <UseCaseSection />
      <FaqSection />
    </>
  )
}

export default page
