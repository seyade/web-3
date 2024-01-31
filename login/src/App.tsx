import { useEffect, useState } from "react";
import { ethers, formatEther } from "ethers";
import useSetupAccount from "./hook/useSetupAccount";

import "./App.css";

function App() {
	const [connected, setConnected] = useState(false);
	const [walletAddress, setWalletAddress] = useState("");
	const [walletBalance, setWalletBalance] = useState("");
	const [networkName, setNetworkName] = useState("");

	useEffect(() => {
		getCurrentConnectedAddress();
		onWalletAccountChangeHandler();
		onWalletChainChangeHandler();
		onDisconnectChangeHandler();
	}, []);

	async function handleConnectWallet() {
		if (typeof window.ethereum !== "undefined") {
			try {
				if (!connected) {
					const provider = await new ethers.BrowserProvider(window.ethereum);
					const signer = await provider.getSigner();
					const _address = await signer.getAddress();
					const _balance = await provider.getBalance(_address);
					const { name } = await provider.getNetwork();

					setNetworkName(name);
					setWalletAddress(_address);
					setWalletBalance(formatEther(_balance));
					setConnected(true);
				}

				if (connected) {
					setConnected(false);
					setWalletAddress("");
					setNetworkName("");
					console.log("Not connected.");
				}
			} catch (error) {
				console.log(error);
			}
		} else {
			console.log("Install an Ethereum wallet like Metamask.");
		}
	}

	async function getCurrentConnectedAddress() {
		if (typeof window.ethereum !== "undefined") {
			const accounts = await window.ethereum.request({
				method: "eth_accounts",
			});

			if (accounts.length > 0) {
				const provider = await new ethers.BrowserProvider(window.ethereum);
				const _balance = await provider.getBalance(accounts[0]);
				const { name } = await provider.getNetwork();

				setNetworkName(name);
				setWalletAddress(accounts[0]);
				setWalletBalance(formatEther(_balance));
				setConnected(true);
			} else {
				console.log("Connect your wallet!");
			}
		}
	}

	async function onWalletAccountChangeHandler() {
		if (typeof window.ethereum !== "undefined") {
			window.ethereum.on("accountsChanged", async (accounts: any) => {
				const provider = await new ethers.BrowserProvider(window.ethereum);
				const _balance = await provider.getBalance(accounts[0]);
				const { name } = await provider.getNetwork();

				setNetworkName(name);
				setWalletAddress(accounts[0]);
				setWalletBalance(formatEther(_balance));
				setConnected(true);
			});
		} else {
			setWalletAddress("");
			console.log("Install an Ethereum wallet like Metamask.");
		}
	}

	async function onWalletChainChangeHandler() {
		if (typeof window.ethereum !== "undefined") {
			window.ethereum.on("chainChanged", async (accounts: any) => {
				window.location.reload();
				const provider = await new ethers.BrowserProvider(window.ethereum);
				const signer = await provider.getSigner();
				const _address = await signer.getAddress();
				const _balance = await provider.getBalance(_address);
				const { name } = await provider.getNetwork();

				setWalletAddress(_address);
				setWalletBalance(formatEther(_balance));
				setConnected(true);
				setNetworkName(name);
			});
		} else {
			setWalletAddress("");
			console.log("Install an Ethereum wallet like Metamask.");
		}
	}

	async function onDisconnectChangeHandler() {
		if (typeof window.ethereum !== "undefined") {
			window.ethereum.on("disconnect", (error: any) => {
				setConnected(false);
				setWalletAddress("");
				setNetworkName("");
				console.log("Disconnected.");
			});
		} else {
			console.log("Install an Ethereum wallet like Metamask.");
		}
	}

	function truncateAddress(address: string) {
		const truncatedAddress = `${address?.slice(0, 4)}...${address?.slice(-5)}`;
		return truncatedAddress.toLowerCase();
	}

	return (
		<main className="app h-screen p-4 bg-gradient-to-r bg-rad from-[#3e0041] via-[#340040] to-[#000]">
			<header className="flex justify-between items-center w-full mb-4">
				<h1 className="font-extrabold text-3xl text-white">Block. Z</h1>
				<div
					className={`flex items-center rounded-full px-2 py-2 ${
						connected && "bg-slate-100"
					}`}
				>
					<button
						onClick={handleConnectWallet}
						className="bg-purple-800 px-4 py-2 text-white rounded-full z-10"
					>
						{connected ? "Disconnect" : "Connect"}
					</button>
					{connected && (
						<p className="py-1 pl-7 pr-4 -ml-6 bg-slate-800 text-white text-center rounded-full flex items-center capitalize font-medium">
							{networkName}
						</p>
					)}
					{connected && (
						<span className="text-slate-800 font-medium ml-4 pr-2">
							{truncateAddress(walletAddress)}
						</span>
					)}
				</div>
			</header>

			<section className="flex flex-col items-center">
				{connected && (
					<>
						<h2 className="text-white font-semibold text-xl mb-7">
							{networkName !== "unknown" ? (
								<>
									Welcome, you are connected to the{" "}
									<span className="capitalize">{networkName}</span> network!
								</>
							) : (
								`Welcome to the Web 3 world!`
							)}
						</h2>

						<div className="grid grid-cols-3 gap-3">
							<div className="bg-white rounded-lg p-4 text-left">
								<h3 className="font-semibold text-2xl mb-3">Balance</h3>
								<p>
									ETH <br />
									{walletBalance}
								</p>
							</div>

							<div className="bg-white rounded-lg p-4 text-left">
								<h3 className="font-semibold text-2xl mb-3">NFT</h3>
								<div className="bg-gradient-to-b bg-amber-800 bg-green-700 h-36 mb-3 rounded-xl"></div>
								<p className="font-semibold text-center">An abstract art NFT</p>
							</div>

							<div className="bg-white rounded-lg p-4 text-left">
								<h3 className="font-semibold text-2xl mb-3">Market</h3>
								<p>BTC $120,000</p>
							</div>
						</div>
					</>
				)}
			</section>
		</main>
	);
}

export default App;
