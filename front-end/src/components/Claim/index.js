import React, { useState, useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'
import { formatEther, parseEther } from '@ethersproject/units'
import { Contract } from '@ethersproject/contracts'
import { VaultContractAddress } from '../../utils'
import VaultContractABI from '../../abi/VaultContractABI'
import Card from '../Card'
import Button from '../Button'
import Input from '../Input'

export default function Claim() {
  const { account, library } = useWeb3React()
  const [claimableAmount, setClaimableAmount] = useState('')
  const [amount, setAmount] = useState('0')
  const [isClaiming, setIsClaiming] = useState(false)
  const [disable, setDisable] = useState(false)
  const [error, setError] = useState('')
  const vaultContract = new Contract(
    VaultContractAddress,
    VaultContractABI,
    library.getSigner()
  )
  const getClaimableAmount = async () => {
    const amount = await vaultContract.getToken(account)
    setClaimableAmount(formatEther(amount))
  }

  const claim = async () => {
    try {
      let tx = await vaultContract.claim(parseEther(amount))
      setIsClaiming(true)
      await tx.wait()
      setIsClaiming(false)
      setClaimableAmount((prev) => prev - amount)
    } catch (error) {
      setError(error?.error.message)
    }
  }

  useEffect(() => {
    if (account) getClaimableAmount()
  }, [])

  useEffect(() => {
    if (amount > claimableAmount) setDisable(true)
    else setDisable(false)
  }, [amount])

  return (
    <Card title="Claim" className="w-full text-center mb-8 lg:mx-8 lg:w-1/3">
      <p className="w-full overflow-hidden text-2xl text-white-100 overflow-ellipsis">
        Available Amount: {claimableAmount} Test
      </p>
      {error && <p className="text-red-primary">{error}</p>}
      <Input value={amount} onChange={(e) => setAmount(e.target.value)} />
      <Button
        title={isClaiming ? 'Claiming...' : 'Claim'}
        disabled={isClaiming || disable}
        onClick={() => claim()}
      />
    </Card>
  )
}
