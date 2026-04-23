import Modal from "../../../../common/ui/Modal";

const CreateProgramModal = ({ isOpen, onClose, onCreate }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      header={<h3 className="text-lg font-semibold">Create Program</h3>}
      body={
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            Create the program
          </p>

          <button
            onClick={() => {
              // temporary example
              const newProgram = { title: "New Program" };
              onCreate?.(newProgram);
              onClose();
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Create
          </button>
        </div>
      }
    />
  );
};

export default CreateProgramModal;