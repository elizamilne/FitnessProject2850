import Modal from "../../../../common/ui/Modal";
import { formatDays } from "../utils/formatters"; 

const DetailProgramModal = ({ isOpen, onClose, program }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      header={<h3 className="text-lg font-semibold">View Program</h3>}
      body={
        program ? (
          <div className="space-y-3">
            <img
              src={
                program.bannerUrl ||
                "https://via.placeholder.com/300x200"
              }
              alt={program.title}
              className="w-full h-40 object-cover rounded-lg"
            />

            <h4 className="text-lg font-semibold">{program.title}</h4>

            <p className="text-sm text-gray-500">
              {formatDays(program.weeklyFrequency) ||
                "No schedule"}
            </p>
          </div>
        ) : (
          <p className="text-sm text-gray-500">No program selected</p>
        )
      }
    />
  );
};

export default DetailProgramModal;