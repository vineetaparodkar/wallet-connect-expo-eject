import * as React from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";
import { useWalletConnect } from "@walletconnect/react-native-dapp";
const ethers = require("ethers");

const shortenAddress = (address) => {
  return `${address.slice(0, 6)}...${address.slice(
    address.length - 4,
    address.length
  )}`;
};

function Button({ onPress, label }) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.button}>
      <Text style={styles.text}>{label}</Text>
    </TouchableOpacity>
  );
}

export default function WalletConnectExperience() {
  const connector = useWalletConnect();

  const connectWallet = React.useCallback(() => {
    return connector.connect();
  }, [connector]);

  const killSession = React.useCallback(() => {
    return connector.killSession();
  }, [connector]);

  const transferTokens = async () => {
    console.log("initiating a transfer");
    const methodID = "0xa9059cbb";
    const receiver = "0xD04e8B57ef70202118F318524b2C54AF854D5101";
    const amount = ethers.utils.parseUnits("1", "ether");
    const address = connector.accounts[0];
    let encodedData = ethers.utils.hexConcat([
      methodID,
      ethers.utils.defaultAbiCoder.encode(
        ["address", "uint256"],
        [receiver, amount]
      ),
    ]);
    const param = {
      from: address,
      to: contactAddress,
      data: encodedData,
    };
    const transactionHash = await connector.sendTransaction(param);
    console.log("transaction Hash: " + transactionHash);
  };

  return (
    <>
      {!connector.connected ? (
        <Button onPress={connectWallet} label="Connect a wallet" />
      ) : (
        <>
          <Text>{shortenAddress(connector.accounts[0])}</Text>
          <Button onPress={transferTokens} label="Transer tokens" />
          <Button onPress={killSession} label="Log out" />
        </>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#5A45FF",
    color: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom:10
  },
  text: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
