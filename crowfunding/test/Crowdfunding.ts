import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Crowdfunding", () => {
  let crowdfunding: any;
  let deployer;

  beforeEach(async () => {
    const Crowdfunding = await ethers.getContractFactory("Crowdfunding");
    crowdfunding = await Crowdfunding.deploy();
  });

  describe("Deployement", () => {
    it("is deployed", async () => {
      expect(await crowdfunding.deployed).to.be.true;
    });
  });
});
