import { EasyPrivateVotingContract } from "../src/artifacts/EasyPrivateVoting.js";
import { VerifyJWTContract } from "../src/artifacts/VerifyJWT.js";

import {
  createLogger,
  PXE,
  Logger,
  SponsoredFeePaymentMethod,
} from "@aztec/aztec.js";
import { setupPXE } from "../src/utils/setup_pxe.js";
import { getSponsoredFPCInstance } from "../src/utils/sponsored_fpc.js";
import { SponsoredFPCContract } from "@aztec/noir-contracts.js/SponsoredFPC";
import { deploySchnorrAccount } from "../src/utils/deploy_account.js";

async function main() {
  const logger: Logger = createLogger("aztec:aztec-starter");
  const pxe: PXE = await setupPXE();

  const sponsoredFPC = await getSponsoredFPCInstance();
  await pxe.registerContract({
    instance: sponsoredFPC,
    artifact: SponsoredFPCContract.artifact,
  });

  const sponsoredPaymentMethod = new SponsoredFeePaymentMethod(sponsoredFPC.address);
  const accountManager = await deploySchnorrAccount(pxe);
  const wallet = await accountManager.getWallet();
  const address = await accountManager.getAddress();

  const votingContract = await EasyPrivateVotingContract.deploy(wallet, address)
    .send({ fee: { paymentMethod: sponsoredPaymentMethod } })
    .deployed();

  logger.info(`Voting Contract deployed at: ${votingContract.address}`);

  const verifyJWT = await VerifyJWTContract.deploy(wallet)
    .send({ fee: { paymentMethod: sponsoredPaymentMethod } })
    .deployed();

  logger.info(`VerifyJWT Contract deployed at: ${verifyJWT.address}`);

  // OPTIONAL: write to a local file or environment
  console.log(JSON.stringify({ verifyJWT: verifyJWT.address.toString() }, null, 2));
}

main();
