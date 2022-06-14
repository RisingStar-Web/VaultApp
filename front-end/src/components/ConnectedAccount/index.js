import React from 'react'
import { useSelector } from 'react-redux'
import { useWeb3React } from '@web3-react/core'
import { formatEther, parseEther } from '@ethersproject/units'
import useSWR from 'swr'
import Card from '../Card'
import { fetcher } from '../../functions'
import { TestTokenAddress } from '../../utils'
import ERC20ABI from '../../abi/ERC20.abi.json'

export default function ConnectedAccount(props) {
  const walletAddress = useSelector((state) => state.account.address)
  const { library } = useWeb3React()
  const { data: balance, mutate } = useSWR(
    [TestTokenAddress, 'balanceOf', walletAddress],
    {
      fetcher: fetcher(library, ERC20ABI),
    }
  )
  const formatFloat = (balance) => {
    return parseFloat(formatEther(balance || '0'))
  }
  return (
    <Card
      title="Connected Account"
      className="w-full text-center mb-8 lg:mx-8 lg:w-full"
    >
      <p className="w-full overflow-hidden text-2xl text-white-100 overflow-ellipsis">
        {walletAddress}
        <br></br>
        {formatFloat(balance).toFixed(4)} Test
      </p>
    </Card>
  )
}
