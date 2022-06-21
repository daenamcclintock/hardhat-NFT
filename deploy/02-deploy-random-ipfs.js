const { network, ethers } = require("hardhat")
const { developmentChains, networkConfig } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    log("----------------------------------------------------")

    let vrfCoordinatorV2Address, subscriptionId

    if (developmentChains.includes(network.name)) {
        const vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock")
        vrfCoordinatorV2Address = vrfCoordinatorV2Mock.address
        const transaction = await vrfCoordinatorV2Mock.createSubscription()
        const transactionReceipt = await transaction.wait(1)
        subscriptionId = transactionReceipt.events[0].args.subId
    }
    else {
        vrfCoordinatorV2Address = networkConfig[chainId].vrfCoordinatorV2
        subscriptionId = networkConfig[chainId].subscriptionId
    }

    log("----------------------------------------------------")

    const args = [
        vrfCoordinatorV2Address, 
        subscriptionId, 
        networkConfig[chainId].gasLane, 
        networkConfig[chainId].mintFee, 
        // tokenUris
        networkConfig[chainId].callBackGasLimit, 
    ]
}