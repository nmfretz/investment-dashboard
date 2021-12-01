// TODO - is-clipped to html. cancel, delete.

const DeleteAssetModal = ({ asset, handleDeleteConfirm, handleDeleteCancel }) => {
  return (
    <>
      <div className="modal is-active">
        <div className="modal-background"></div>
        <div className="modal-content">
          <section className="modal-card-body">
            <div className="has-text-centered">
              <span>Are you sure you want to delete </span>
              <span className="has-text-weight-bold">{asset.symbol}</span>
              <span> ?</span>
            </div>
            <div className="has-text-centered mt-2">
              <button className="button is-danger ml-2" onClick={() => handleDeleteConfirm()}>
                Delete
              </button>
              <button className="button ml-2" onClick={() => handleDeleteCancel()}>
                Cancel
              </button>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default DeleteAssetModal;
