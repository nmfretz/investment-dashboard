import { useState, useEffect, createContext, useRef } from "react";
import { v4 as uuidv4 } from "uuid";

import "bulma/css/bulma.css";
import "./assets/App.css";
import DoughnutGraph from "./components/doughnut/DoughnutGraph";
import Navbar from "./components/navbar/Navbar";
import TableOfAssets from "./components/assets/TableOfAssets";
import CurrencySelector from "./components/CurrencySelector";
import Instructions from "./components/Instructions";
import AddAssetModal from "./components/addAsset/AddAssetModal";
import AddAssetButton from "./components/addAsset/AddAssetButton";
import updatePricesValuesPercents, { convertCurrency } from "./lib/updatePricesValuesPercents";
import {
  loadUserCurrencyFromLocalStorage,
  saveUserCurrencyToLocalStorage,
  loadAssetsFromLocalStorage,
  saveAssetsToLocalStorage,
} from "./lib/localStorage";
import RefreshPricesBtn from "./components/RefreshPricesBtn";
import WelcomeModal from "./components/WelcomeModal";

export const AssetContext = createContext();

function App() {
  const [isWelcomeModalOpen, setIsWelcomeModalOpen] = useState(false);

  const [userCurrency, setUserCurrency] = useState(loadUserCurrencyFromLocalStorage() || "CAD");
  const [assets, setAssets] = useState(loadAssetsFromLocalStorage() || []);

  const [type, setType] = useState("Stock");
  const [symbol, setSymbol] = useState("Search for a Symbol");
  const [amount, setAmount] = useState("");

  const [isEdit, setIsEdit] = useState(false);
  const [assetToEditId, setAssetToEditId] = useState(false);

  const [isGraphAndTableLoading, setIsGraphAndTableLoading] = useState(true);
  const [isAddAssetModalOpen, setIsAddAssetModalOpen] = useState(false);
  const [isLoadingForCurrency, setIsLoadingForCurrency] = useState(false);
  const isMountedHTMLClipped = useRef(false); // object

  async function handleAddAsset(symbol, type, amount) {
    let tempAssetArray = [...assets];

    if (isEdit) {
      tempAssetArray = tempAssetArray.filter((asset) => asset.id !== assetToEditId); // remove edit asset from array in order to push edited version
    }

    const newAsset = {
      id: isEdit ? assetToEditId : uuidv4(),
      symbol: symbol,
      type: type,
      amount: parseFloat(amount), // TODO - go through code and determine best place to cast amount as a float.
    };

    tempAssetArray.push(newAsset);
    tempAssetArray = await updatePricesValuesPercents(tempAssetArray, userCurrency);
    tempAssetArray.sort((a, b) => b.userCurrencyValue - a.userCurrencyValue);
    setAssets([...tempAssetArray]);
    setIsAddAssetModalOpen(!isAddAssetModalOpen);
  }

  function handleEditAsset(asset) {
    setIsEdit(true);
    setAssetToEditId(asset.id);
    setType(asset.type);
    setSymbol(asset.symbol);
    setAmount(asset.amount.toString()); // needs to be string for amount.trim() in validateForm()
    setIsAddAssetModalOpen(true);
  }

  function deleteAsset(id) {
    setAssets(assets.filter((asset) => asset.id !== id));
  }

  async function handleCurrencyChange(e) {
    const currency = e.target.value;
    setUserCurrency(currency);

    setIsLoadingForCurrency(true);
    setIsGraphAndTableLoading(true);

    let tempAssetArray = [...assets];
    for await (const asset of tempAssetArray) {
      asset.userCurrencyPrice = await convertCurrency(asset, currency);
      asset.userCurrencyValue = asset.amount * asset.userCurrencyPrice;
    }

    setAssets([...tempAssetArray]);
    setIsLoadingForCurrency(false);
    setIsGraphAndTableLoading(false);
  }

  async function handleRefreshPrices() {
    setIsGraphAndTableLoading(true);
    const tempAssetArray = await updatePricesValuesPercents([...assets], userCurrency);
    setAssets([...tempAssetArray]);
    setIsGraphAndTableLoading(false);
  }

  // load page
  useEffect(() => {
    async function loadPage() {
      // show welcome modal if user has never visited
      // TODO - consider changing to show modal if user has no assets
      const userHasViewedWelcomeMessage = localStorage.getItem("welcome-message-viewed");
      if (userHasViewedWelcomeMessage === null) {
        setTimeout(() => {
          setIsWelcomeModalOpen(true);
        }, 1000);
        localStorage.setItem("welcome-message-viewed", true);
      }

      // update user's assets with current prices
      const userAssets = loadAssetsFromLocalStorage();
      const currency = loadUserCurrencyFromLocalStorage();
      if (!userAssets) return setIsGraphAndTableLoading(false); // guard clause
      const updatedAssets = await updatePricesValuesPercents(userAssets, currency);
      setAssets([...updatedAssets]);
      setIsGraphAndTableLoading(false);
    }
    loadPage();
  }, []);

  useEffect(() => {
    // if (assets.length === 0) return;
    saveAssetsToLocalStorage(assets);
  }, [assets]);

  useEffect(() => {
    saveUserCurrencyToLocalStorage(userCurrency);
  }, [userCurrency]);

  useEffect(() => {
    if (isMountedHTMLClipped.current) {
      document.querySelector("html").classList.toggle("is-clipped");
    } else {
      isMountedHTMLClipped.current = true;
    }
  }, [isAddAssetModalOpen]);

  return (
    <AssetContext.Provider
      value={{
        type: type,
        setType: setType,
        symbol: symbol,
        setSymbol: setSymbol,
        amount: amount,
        setAmount: setAmount,
      }}
    >
      <Navbar />
      <CurrencySelector
        setIsWelcomeModalOpen={setIsWelcomeModalOpen}
        userCurrency={userCurrency}
        isLoadingForCurrency={isLoadingForCurrency}
        handleCurrencyChange={handleCurrencyChange}
      />
      <DoughnutGraph assets={assets} userCurrency={userCurrency} isGraphAndTableLoading={isGraphAndTableLoading} />
      <RefreshPricesBtn handleRefreshPrices={handleRefreshPrices} isGraphAndTableLoading={isGraphAndTableLoading} />
      <Instructions />
      <TableOfAssets
        assets={assets}
        userCurrency={userCurrency}
        isGraphAndTableLoading={isGraphAndTableLoading}
        handleEditAsset={handleEditAsset}
        deleteAsset={deleteAsset}
      />
      <AddAssetButton isAddAssetModalOpen={isAddAssetModalOpen} setIsAddAssetModalOpen={setIsAddAssetModalOpen} />
      <AddAssetModal
        isAddAssetModalOpen={isAddAssetModalOpen}
        setIsAddAssetModalOpen={setIsAddAssetModalOpen}
        setIsEdit={setIsEdit}
        setAssetToEditId={setAssetToEditId}
        handleAddAsset={handleAddAsset}
      />
      <WelcomeModal isOpen={isWelcomeModalOpen} handleClose={() => setIsWelcomeModalOpen(false)} />
    </AssetContext.Provider>
  );
}

export default App;
