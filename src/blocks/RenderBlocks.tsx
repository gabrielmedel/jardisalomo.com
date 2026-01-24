import React, { Fragment } from 'react'

import type { Page } from '@/payload-types'

import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import { CarouselSliderBlock } from '@/blocks/CarouselSlider/Component'
import { CenteredWithMediaBlock } from '@/blocks/CenteredWithMedia/Component'
import { ContentBlock } from '@/blocks/Content/Component'
import { FeaturesBlock } from '@/blocks/Features/Component'
import { FormBlock } from '@/blocks/Form/Component'
import { MediaBlock } from '@/blocks/MediaBlock/Component'
import { TwoColumnContentMediaBlock } from '@/blocks/TwoColumnContentMedia/Component'

const blockComponents = {
  carouselSlider: CarouselSliderBlock,
  centeredWithMedia: CenteredWithMediaBlock,
  content: ContentBlock,
  cta: CallToActionBlock,
  features: FeaturesBlock,
  formBlock: FormBlock,
  mediaBlock: MediaBlock,
  twoColumnContentMedia: TwoColumnContentMediaBlock,
}

export const RenderBlocks: React.FC<{
  blocks: Page['layout'][0][]
  locale?: string
}> = (props) => {
  const { blocks, locale } = props

  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0

  if (hasBlocks) {
    return (
      <Fragment>
        {blocks.map((block, index) => {
          const { blockType } = block

          if (blockType && blockType in blockComponents) {
            const Block = blockComponents[blockType]

            if (Block) {
              return (
                <div className="my-16" key={index}>
                  {/* @ts-expect-error there may be some mismatch between the expected types here */}
                  <Block {...block} locale={locale} disableInnerContainer />
                </div>
              )
            }
          }
          return null
        })}
      </Fragment>
    )
  }

  return null
}
