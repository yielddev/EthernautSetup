import { ethers } from "hardhat";
import { BigNumber, Contract, Signer } from "ethers";
import { GatekeeperOne, GateKeeperSolver } from "../typechain-types/contracts/GateKeeper"
import { expect } from "chai";

let accounts: Signer[]
let gateKeeper: GatekeeperOne;
let solver: GateKeeperSolver;
var player: Signer;
var owner: Signer;


describe("solutions: gate_keeper", () => {
    beforeEach(async () => {
        accounts = await ethers.getSigners();
        gateKeeper = await (await ethers.getContractFactory("GatekeeperOne")).deploy();
        solver = await (await ethers.getContractFactory("GateKeeperSolver")).deploy(gateKeeper.getAddress());

        player = accounts[1];
        owner = accounts[0];

    })
    it("solves challenge", async () => {
        await solver.connect(player).solve();
        expect((await gateKeeper.entrant())).to.be.equal((await player.getAddress()));
    })
})