const AddAssetButton = (props) => {
  const { isAddAssetModalOpen, setIsAddAssetModalOpen } = props;
  return (
    <>
      <section className="section is-small pt-0">
        <button
          className="button is-medium is-fullwidth is-light mt-5 mb-5"
          onClick={() => setIsAddAssetModalOpen(!isAddAssetModalOpen)}
        >
          + Add Asset
        </button>
      </section>
    </>
  );
};

export default AddAssetButton;
