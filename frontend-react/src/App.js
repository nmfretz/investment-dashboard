import { useState, useEffect, createContext, useRef } from "react";
import useHeroku from "react-use-heroku";
import { v4 as uuidv4 } from "uuid";

import "bulma/css/bulma.css";
import "./App.css";
import DoughnutGraph from "./components/doughnut/DoughnutGraph";
import Navbar from "./components/navbar/Navbar";
import TableOfAssets from "./components/assets/TableOfAssets";
import CurrencySelector from "./components/CurrencySelector";
import Instructions from "./components/Instructions";
import AddAssetModal from "./components/addAsset/AddAssetModal";
import AddAssetButton from "./components/addAsset/AddAssetButton";
import updatePricesValuesPercents, { convertCurrency } from "./lib/updatePricesValuesPercents";
import RefreshLoadSpinner from "./components/RefreshLoadSpinner";
import {
  loadUserCurrencyFromLocalStorage,
  saveUserCurrencyToLocalStorage,
  loadAssetsFromLocalStorage,
  saveAssetsToLocalStorage,
} from "./lib/localStorage";
import RefreshPricesBtn from "./components/RefreshPricesBtn";
import { HEROKU_WAKE_END_POINT } from "./lib/end-points";
import WelcomeModal from "./components/WelcomeModal";

export const AssetContext = createContext();

function App() {
  const isHerokuLoading = useHeroku({ HEROKU_WAKE_END_POINT });

  const [isWelcomeModalOpen, setIsWelcomeModalOpen] = useState(false);

  const [assets, setAssets] = useState(loadAssetsFromLocalStorage() || []);
  const [userCurrency, setUserCurrency] = useState(loadUserCurrencyFromLocalStorage() || "CAD");

  const [type, setType] = useState("Stock");
  const [symbol, setSymbol] = useState("Search for a Symbol");
  const [amount, setAmount] = useState("");

  const [isEdit, setIsEdit] = useState(false);
  const [assetToEditId, setAssetToEditId] = useState(false);

  const [isGraphAndTableLoading, setIsGraphAndTableLoading] = useState(true);
  const [isAddAssetModalOpen, setIsAddAssetModalOpen] = useState(false);
  const [isLoadingForCurrency, setIsLoadingForCurrency] = useState(false);
  const isMountedCurrency = useRef(false); // object
  const isMountedHTMLClipped = useRef(false); // object

  async function handleAddAsset(symbol, type, amount) {
    // console.log('inside handleAddAsset()')
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
    // console.log("inside handleEditAsset()");
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

  function handleCurrencyChange(e) {
    setUserCurrency(e.target.value);
  }

  async function handleRefreshPrices() {
    // console.log("inside handleRefreshPrices()");
    setIsGraphAndTableLoading(true);
    const tempAssetArray = await updatePricesValuesPercents([...assets], userCurrency);
    setAssets([...tempAssetArray]);
    setIsGraphAndTableLoading(false);
  }

  // load page
  useEffect(async () => {
    // show welcome modal if user has never visited
    const userHasViewedWelcomeMessage = localStorage.getItem("welcome-message-viewed");
    if (userHasViewedWelcomeMessage === null) {
      setTimeout(() => {
        setIsWelcomeModalOpen(true);
      }, 1000);
      localStorage.setItem("welcome-message-viewed", true);
    }

    if (assets.length === 0) {
      return setIsGraphAndTableLoading(false);
    }
    const tempAssetArray = await updatePricesValuesPercents([...assets], userCurrency);
    setAssets([...tempAssetArray]);
    setIsGraphAndTableLoading(false);
  }, []);

  useEffect(() => {
    if (assets.length === 0) return;
    saveAssetsToLocalStorage(assets);
  }, [assets]);

  useEffect(async () => {
    // console.log("inside userCurrency useEffect");
    if (isMountedCurrency.current) {
      saveUserCurrencyToLocalStorage(userCurrency);
      setIsLoadingForCurrency(true);
      setIsGraphAndTableLoading(true);

      let tempAssetArray = [...assets];
      for (const asset of tempAssetArray) {
        asset.userCurrencyPrice = await convertCurrency(asset, userCurrency);
        asset.userCurrencyValue = asset.amount * asset.userCurrencyPrice;
      }

      setAssets([...tempAssetArray]);
      setIsLoadingForCurrency(false);
      setIsGraphAndTableLoading(false);
    } else {
      isMountedCurrency.current = true;
    }
  }, [userCurrency]);

  useEffect(() => {
    if (isMountedHTMLClipped.current) {
      document.querySelector("html").classList.toggle("is-clipped");
    } else {
      isMountedHTMLClipped.current = true;
    }
  }, [isAddAssetModalOpen]);

  // TODO - refactor to component with a load spinner
  if (isHerokuLoading) return <div>Heroku backend server is sleeping, hang tight...</div>;

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
      {isGraphAndTableLoading && (
        <RefreshLoadSpinner className={"button is-loading custom-refresh-loadspinner"} text={""} />
      )}
      <DoughnutGraph assets={assets} userCurrency={userCurrency} />
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
