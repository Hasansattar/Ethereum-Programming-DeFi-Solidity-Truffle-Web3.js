const Token = artifacts.require("Token");
const dBank = artifacts.require("dBank");

module.exports = async function (deployer) {
  //deploy Token

  await deployer.deploy(Token); //1 deploy token into blockchain

  //assign token into variable to get it's address

  const token = await Token.deployed(); //get abi through this   2-

  //pass token address for dBank contract(for future minting)
  await deployer.deploy(dBank, token.address); //bBank ka constucter me jo token ka reference ha uska adress get kia ha    3-
  //assign dBank contract into variable to get it's address  4-
  const dbank = await dBank.deployed();
  //change token's owner/minter from deployer to dBank   5-
  await token.passMinterRole(dbank.address);
};
