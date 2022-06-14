var Vault = artifacts.require("Vault");
module.exports = function (deployer) {
  deployer.deploy(Vault);
  // Additional contracts can be deployed here
};
