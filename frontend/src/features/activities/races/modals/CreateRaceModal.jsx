import Modal from "../../../../common/ui/Modal";

const CreateRaceModal = ({
  isOpen,
  onClose,
  onCreate, 
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      header={<h3 className="text-lg font-semibold">Create Race</h3>}
      body={
        <div className="space-y-4">
          <p className="text-sm text-gray-500">Create The Race</p>

          <button
            onClick={() => {
              onCreate?.();
              onClose();
            }}
            className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Create
          </button>
        </div>
      }
    />
  );
};

export default CreateRaceModal;