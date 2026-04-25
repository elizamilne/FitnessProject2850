import { useState } from "react";
import Modal from "../../../../common/ui/Modal";
import { raceService } from "../../../../services/race";

const CreateRaceModal = ({ isOpen, onClose, onCreate }) => {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);

  const isValid = title && location && date;

  const handleCreate = async () => {
    if (!isValid) return;

    const defaultBannerUrl =
      "https://images.pexels.com/photos/34688570/pexels-photo-34688570.jpeg";
    const profile = JSON.parse(sessionStorage.getItem("profile"));
    const profileId = profile["id"];
    const payload = {
      profileId,
      title,
      location,
      date,
      bannerUrl: defaultBannerUrl,
    };

    try {
      setLoading(true);

      const response = await raceService.createRace(payload);

      // optional: notify parent AFTER success
      onCreate?.(response?.data || payload);

      // reset
      setTitle("");
      setLocation("");
      setDate("");

      onClose();
    } catch (err) {
      console.error("Create race failed:", err);
      // you can show a toast here
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      header={<h3 className="text-lg font-semibold">Create Race</h3>}
      body={
        <div className="space-y-4">
          <p className="text-sm text-gray-500">Create The Race</p>

          <input
            type="text"
            placeholder="Race title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
          />

          <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
          />

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
          />

          <button
            onClick={handleCreate}
            disabled={!isValid || loading}
            className="w-full py-2 bg-blue-600 disabled:bg-gray-400 text-white rounded-lg"
          >
            {loading ? "Creating..." : "Create"}
          </button>
        </div>
      }
    />
  );
};

export default CreateRaceModal;