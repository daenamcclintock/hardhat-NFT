const { assert } = require("chai")
const { network, deployments, ethers } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("Basic NFT Unit Tests", function () {
        let basicNft, deployer

        beforeEach(async () => {
            accounts = await ethers.getSigners()
              deployer = accounts[0]
              await deployments.fixture(["mocks", "basicnft"])
              basicNft = await ethers.getContract("BasicNft")
        })

        describe("constructor", () => {
            it("initializes the token counter", async () => {
                const tokenCounter = (await basicNft.getTokenCounter()).toString()
                assert.equal(tokenCounter, "0")
            })
        })

        describe("mintNFT", () => {
            it("Allows users to mint an NFT, and updates appropriately", async function () {
                const txResponse = await basicNft.mintNFT()
                await txResponse.wait(1)
                const tokenURI = await basicNft.tokenURI(0)
                const tokenCounter = await basicNft.getTokenCounter()
  
                assert.equal(tokenCounter.toString(), "1")
                assert.equal(tokenURI, await basicNft.TOKEN_URI())
            })
        })
    })