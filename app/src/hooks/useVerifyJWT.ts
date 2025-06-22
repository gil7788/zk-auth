"use client";

import { createPXEClient, AztecAddress, Fr, Fq } from '@aztec/aztec.js';
import { VerifyJWTContract } from '@/artifacts/VerifyJWT';
import { getEcdsaRAccount } from '@aztec/accounts/ecdsa/lazy';

export async function readHelloWorld(contractAddress: string): Promise<number> {
  const pxe = createPXEClient('http://localhost:8080');
  const address = AztecAddress.fromString(contractAddress);

  // // `at` creates a bound contract instance using PXE and address
  const contract = await VerifyJWTContract.at(address, await (await getEcdsaRAccount(pxe, Fr.random(), Buffer.from("0x12"), 0x34)).getWallet());

  // // Simulate the call without needing a Wallet
  const result = await contract.methods.hello_world().simulate();

  return result.returnValues[0].toNumber();
  // return await 3;
}
