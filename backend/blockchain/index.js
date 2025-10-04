const { ethers } = require('ethers');
require('dotenv').config();

// Update with your own values
const RPC_URL = process.env.BLOCKCHAIN_RPC_URL || 'http://127.0.0.1:8545';
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

// Paste the ABI generated after compiling your Solidity contract here
const CONTRACT_ABI = [ /* Paste your contract's full ABI array here */ ];

const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, wallet);

async function createCaseOnChain(caseNumber) {
  const tx = await contract.createCase(caseNumber);
  await tx.wait();
}

async function updateCaseStatusOnChain(caseNumber, status) {
  const tx = await contract.updateCaseStatus(caseNumber, status);
  await tx.wait();
}

async function scheduleHearingOnChain(caseNumber, date, purpose, notes) {
  const tx = await contract.scheduleHearing(caseNumber, date, purpose, notes);
  await tx.wait();
}

async function recordJudgmentOnChain(caseNumber, verdict, sentence, fine, judgmentText) {
  const tx = await contract.recordJudgment(caseNumber, verdict, sentence, fine, judgmentText);
  await tx.wait();
}

async function getCaseFromChain(caseNumber) {
  // This returns individual components; adjust if needed
  return await contract.getCase(caseNumber);
}

module.exports = {
  createCaseOnChain,
  updateCaseStatusOnChain,
  scheduleHearingOnChain,
  recordJudgmentOnChain,
  getCaseFromChain
};
