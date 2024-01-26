import { useEffect, useState } from "react";
import { ethers, formatEther } from "ethers";

import "./App.css";

function App() {
	const [connected, setConnected] = useState(false);
	const [walletAddress, setWalletAddress] = useState("");
	const [walletBalance, setWalletBalance] = useState<bigint | string | null>(
		null
	);

	async function handleConnectWallet() {
		if (!connected) {
			const provider = await new ethers.BrowserProvider(window.ethereum);
			const signer = await provider.getSigner();
			const _address = await signer.getAddress();
			const _balance = await provider.getBalance(_address);

			setWalletAddress(_address);
			setWalletBalance(formatEther(_balance));
			setConnected(true);
		}

		if (connected) {
			window.ethereum.selectedAddress = null;
			setConnected(false);
			setWalletAddress("");
			console.log("Not connected.");
		}
	}

	function truncateAddress(address: string) {
		const addressLen = address.length;
		const truncatedAddress = `${address?.substring(
			0,
			6
		)}...${address?.substring(addressLen, addressLen - 6)}`;

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
						className="bg-purple-800 px-4 py-2 text-white rounded-full"
					>
						{connected ? "Disconnect" : "Connect"}
					</button>
					{connected && (
						<span className="text-slate-800 ml-4 pr-2">
							{truncateAddress(walletAddress)}
						</span>
					)}
				</div>
			</header>

			<section className="flex flex-col items-center">
				{connected && (
					<div className="bg-white rounded-lg p-4 w-2/4">
						<h3 className="text-bold">Balance</h3>
						<p className="text-left">
							ETH <br />
							{walletBalance}
						</p>
					</div>
				)}
			</section>
		</main>
	);
}

export default App;
