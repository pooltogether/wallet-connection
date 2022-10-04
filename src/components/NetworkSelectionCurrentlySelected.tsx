import React from 'react'
import { i18nTranslate } from '@pooltogether/react-components/dist/types'
import { useNetwork } from 'wagmi'
import classNames from 'classnames'
import { getChainNameByChainId } from '../utilities/getChainNameByChainId'

export const NetworkSelectionCurrentlySelected: React.FC<{ t?: i18nTranslate }> = (props) => {
  const { t } = props
  const { chain } = useNetwork()

  return (
    <div className='mt-2 flex flex-col space-y-2 text-center'>
      <p className='text-xxxs'>
        {t?.('currentlyConnectedTo') || 'Currently connected to'}
        <b className={classNames('ml-1', { 'text-pt-red-light': chain.unsupported })}>
          {chain.name || getChainNameByChainId(chain.id)}
        </b>
      </p>
    </div>
  )
}
