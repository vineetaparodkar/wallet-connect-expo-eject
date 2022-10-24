import * as React from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";
import { useWalletConnect } from "@walletconnect/react-native-dapp";
const ethers = require("ethers");
import { apiGetGasPrices } from "./helpers/gasEstimators";
import {
  sanitizeHex,
  convertStringToHex,
  convertAmountToRawNumber,
} from "./helpers/utilities";

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
    const methodID = "0xa9059cbb"; //erc20 transfer functions method id (remains same across all the erc20 contracts)
    const receiver = "0xD04e8B57ef70202118F318524b2C54AF854D5101"; //replace receiever address
    const amount = ethers.utils.parseUnits("0.1", 18); //update amount of tokens to be transfered
    const contactAddress = "0x63B4554aABA9a40D102d2Ec24Cdf8c27F5C6d4D7"; //update contract address (current contract deloyed on sepolia)
    const address = connector.accounts[0];
    let encodedData = ethers.utils.hexConcat([
      methodID,
      ethers.utils.defaultAbiCoder.encode(
        ["address", "uint256"],
        [receiver, amount]
      ),
    ]);

    // gasPrice
    const gasPrices = await apiGetGasPrices();
    const _gasPrice = gasPrices.fast.price;
    const gasPrice = sanitizeHex(
      convertStringToHex(convertAmountToRawNumber(_gasPrice, 9))
    );

    // gasLimit
    const _gasLimit = 21000;
    const gasLimit = sanitizeHex(convertStringToHex(_gasLimit));

    // value
    const _value = 0;
    const value = sanitizeHex(convertStringToHex(_value));

    const param = {
      from: address,
      to: contactAddress,
      data: encodedData,
      gasPrice,
      gasLimit,
      value,
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
    marginBottom: 10,
  },
  text: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
