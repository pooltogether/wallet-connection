import React from 'react'
import { Meta, Story } from '@storybook/react'
import {
  FullWalletConnectionProps,
  FullWalletConnectionButton
} from '../src/components/FullWalletConnectionButton'
import { getChain } from '../src/utilities/getChain'
import { CHAIN_ID } from '../src/constants'

const meta: Meta = {
  title: 'Wallet Connection',
  component: FullWalletConnectionButton,
  argTypes: {
    children: {
      control: {
        type: 'text'
      }
    }
  },
  parameters: {
    controls: { expanded: true }
  }
}

export default meta

const Template: Story<FullWalletConnectionProps> = (args) => (
  <FullWalletConnectionButton {...args} />
)

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const Default = Template.bind({})

Default.args = {
  chains: [getChain(CHAIN_ID.mainnet), getChain(CHAIN_ID.polygon), getChain(CHAIN_ID.avalanche)],
  TosDisclaimer: 'By connecting a wallet you agree to the PoolTogether terms of service.'
}
