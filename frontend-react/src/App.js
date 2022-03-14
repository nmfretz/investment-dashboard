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
import { LOCAL_STORAGE_ASSETS, LOCAL_STORAGE_CURRENCY } from "./lib/localStorage";
import RefreshPricesBtn from "./components/RefreshPricesBtn";
import { HEROKU_WAKE_END_POINT } from "./lib/end-points";
import WelcomeModal from "./components/WelcomeModal";

export const AssetContext = createContext();

function App() {
  const isHerokuLoading = useHeroku({ HEROKU_WAKE_END_POINT });

  const [isWelcomeModalOpen, setIsWelcomeModalOpen] = useState(false);

  const [assets, setAssets] = useState([]);
  const [userCurrency, setUserCurrency] = useState("CAD");

  const [type, setType] = useState("Stock");
  const [symbol, setSymbol] = useState("Search for a Symbol");
  const [amount, setAmount] = useState("");

  const [isEdit, setIsEdit] = useState(false);
  const [assetToEditId, setAssetToEditId] = useState(false);

  const [isGraphAndTableLoading, setIsGraphAndTableLoading] = useState(true);
  const [isAddAssetModalOpen, setIsAddAssetModalOpen] = useState(false);
  const [isLoadingForCurrency, setIsLoadingForCurrency] = useState(false);
  const isMountedCurrency = useRef(false); // object
  const isMountedSetStorage = useRef(false); // object
  const isMountedHTMLClipped = useRef(false);
  const [refreshPricesClicked] = useState(false);

  async function handleAddAsset(symbol, type, amount) {
    let tempAssetArray = [...assets];

    if (isEdit) {
      tempAssetArray = tempAssetArray.filter((asset) => asset.id !== assetToEditId); // remove edit asset from array in order to push edited version
    }

    const newAsset = {
      id: isEdit ? assetToEditId : uuidv4(),
      symbol: symbol,
      type: type,
      amount: parseFloat(amount), // not sure where the best place to cast amount as a float is.
      // exchangeCurrency: USD,
      // exchangeCurrencyPrice: 100,
      // userCurrencyPrice: 125,
      // userCurrencyValue: 12500,
      // percent: 100,
    };

    tempAssetArray.push(newAsset);
    tempAssetArray = await updatePricesValuesPercents(tempAssetArray, userCurrency);
    tempAssetArray.sort((a, b) => b.userCurrencyValue - a.userCurrencyValue);
    setAssets([...tempAssetArray]);

    setIsAddAssetModalOpen(!isAddAssetModalOpen);
  }

  function handleEditAsset(asset) {
    // rearrange state so that I can set isInfoOpen to false to avoid
    setIsEdit(true);
    setAssetToEditId(asset.id);
    setType(asset.type);
    setSymbol(asset.symbol);
    setAmount(asset.amount.toString()); //needs to be string for amount.trim() in validateForm()
    setIsAddAssetModalOpen(true);
  }

  function deleteAsset(id) {
    setAssets(assets.filter((asset) => asset.id !== id));
  }

  function handleCurrencyChange(e) {
    setUserCurrency(e.target.value);
  }

  // try this for button
  useEffect(async () => {
    // show welcome modal if user has never visited
    const userHasViewedWelcomeMessage = localStorage.getItem("welcome-message-viewed");
    if (userHasViewedWelcomeMessage === null) {
      setTimeout(() => {
        setIsWelcomeModalOpen(true);
      }, 1000);
      localStorage.setItem("welcome-message-viewed", true);
    }

    // load assets and userCurrency from local storage if they exist
    let tempAssetArray = [];
    const jsonAssets = localStorage.getItem(LOCAL_STORAGE_ASSETS);
    // if (jsonAssets != null) setAssets(JSON.parse(jsonAssets));
    if (jsonAssets != null) {
      tempAssetArray = JSON.parse(jsonAssets);
    }

    const jsonUserCurrency = localStorage.getItem(LOCAL_STORAGE_CURRENCY);
    if (jsonUserCurrency != null) setUserCurrency(JSON.parse(jsonUserCurrency));

    // let tempAssetArray = [...assets];
    tempAssetArray = await updatePricesValuesPercents(tempAssetArray, userCurrency);
    setAssets([...tempAssetArray]);
    setIsGraphAndTableLoading(false);
  }, []);

  useEffect(() => {
    if (isMountedSetStorage.current) {
      localStorage.setItem(LOCAL_STORAGE_ASSETS, JSON.stringify(assets));
    } else {
      isMountedSetStorage.current = true;
    }
  }, [assets]);

  useEffect(async () => {
    // all I should do here is make do Intl currency conversion
    if (isMountedCurrency.current) {
      localStorage.setItem(LOCAL_STORAGE_CURRENCY, JSON.stringify(userCurrency));
      let tempAssetArray = [...assets];
      setIsLoadingForCurrency(true);
      setIsGraphAndTableLoading(true);

      for (const asset of tempAssetArray) {
        asset.userCurrencyPrice = await convertCurrency(asset, userCurrency);
        asset.userCurrencyValue = asset.amount * asset.userCurrencyPrice;
      }

      // tempAssetArray = await updatePricesValuesPercents(tempAssetArray, userCurrency);
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

  async function handleRefreshPrices() {
    setIsGraphAndTableLoading(true);
    let tempAssetArray = [...assets];
    tempAssetArray = await updatePricesValuesPercents(tempAssetArray, userCurrency);
    setAssets([...tempAssetArray]);
    setIsGraphAndTableLoading(false);
  }

  // Create a component for this with a load spinner
  if (isHerokuLoading) return <div>Heroku is sleeping, hang tight...</div>;

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
