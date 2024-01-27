import { ethers, formatEther } from "ethers";

const useSetupAccount = async () => {
	// TODO: Not working at the moment for when events are trigger in wallet. I will fix later.

	if (typeof window.ethereum !== "undefined") {
		const provider = await new ethers.BrowserProvider(window.ethereum);
		const signer = await provider.getSigner();
		const address = await signer.getAddress();
		const balance = await provider.getBalance(address);
		const { name: network } = await provider.getNetwork();

		return {
			provider,
			signer,
			address,
			balance: formatEther(balance),
			network,
		};
	} else {
		console.log("Install an Ethereum wallet like Metamask.");
	}
};

export default useSetupAccount;
