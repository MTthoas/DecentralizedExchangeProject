import { CardTitle, CardDescription, CardHeader, CardContent, CardFooter, Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useQuery } from "@tanstack/react-query";
import { getStaking } from "@/hook/staking.hook";
import { useState, useEffect } from "react";
import { useAccount, useBalance, usePrepareTransactionRequest, useSendTransaction, useWriteContract, useReadContract } from 'wagmi';
import { parseEther } from 'viem'
import { stakingAbi } from '../../abi/Staking';
import { tokenAbi } from '../../abi/ERC20Upgradeable';
import { useEthersProvider, useEthersSigner } from '../../config/ethers';
import { ethers } from 'ethers';
import { polygonAmoy } from "viem/chains";

export default function StakingCard() {

  const tokenAddress = process.env.NEXT_PUBLIC_GENX_ADDRESS as `0x${string}`;
  const stakingAddress = process.env.NEXT_PUBLIC_STAKING_ADDRESS as `0x${string}`;
  const { address: addressUser, isConnected } = useAccount();

  const provider = useEthersProvider();
  const signer = useEthersSigner()
  const [amount, setAmount] = useState("");
  const { writeContract } = useWriteContract()

  const { data: balance } = useReadContract({
    abi: tokenAbi,
    address: tokenAddress,
    functionName: 'balanceOf',
    args: [addressUser],
  });

  const { data: stakedData } = useReadContract({
    abi: stakingAbi,
    address: stakingAddress,
    functionName: 'stakedAmount',
    args: [addressUser as `0x${string}`],
  });

  const { data: pendingRewards } = useReadContract({
    abi: stakingAbi,
    address: stakingAddress,
    functionName: 'pendingRewards',
    args: [addressUser as `0x${string}`],
  });

  const handleStake = async () => {
    writeContract({
      abi: stakingAbi,
      address: stakingAddress,
      functionName: 'stake',
      args: [
        parseEther(amount),
      ],
    });
  };

  const handleUnstake = () => {
    writeContract({
      abi: stakingAbi,
      address: stakingAddress,
      functionName: 'unstake',
      args: [
        parseEther(amount),
      ],
    });
  };

  useEffect(() => {
    console.log("Balance:", balance);
    console.log("Adresse:", addressUser);
    console.log("Adresse du token:", tokenAddress);
    console.log("Adresse du staking:", stakingAddress);
    console.log("Staked:", stakedData);
    console.log("Pending rewards:", pendingRewards);
  }, [balance, addressUser, tokenAddress, stakingAddress, stakedData, pendingRewards]);

  return (
    <Card className="bg-secondary text-white rounded-lg shadow-lg">
      <CardHeader>
        <CardTitle>Stake GEN Tokens</CardTitle>
        <CardDescription>Enter the amount and duration to stake your GEN tokens.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="amount">Amount of Tokens</Label>
          <Input id="amount" placeholder="0.00" type="number" max={balance} value={amount} onChange={(e) => setAmount(e.target.value)} />
          <div className="flex flex-row-reverse space-x-reverse space-x-6 justify-between">
            <span className="text-xs">Balance: {balance ? balance.toString() : "0"} GEN</span>
            <span className="text-xs">Staked: {stakedData ? stakedData.toString() : "0"}</span>
            <span className="text-xs">Earn: {pendingRewards ? pendingRewards.toString() : "0"}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex space-x-2">
      {isConnected ? (
          <>
            <Button className="w-full" onClick={handleStake}>
              Stake Tokens
            </Button>
            <Button className="w-full" onClick={handleUnstake}>
              Unstake Tokens
            </Button>
          </>
        ) : (
          <span className="text-xs text-red-500">Please connect your wallet to stake/unstake tokens.</span>
        )}
      </CardFooter>
    </Card>
  )
}