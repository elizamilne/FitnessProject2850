import { useState } from "react";
import Modal from "../../../../common/ui/Modal";
import { raceService } from "../../../../services/race";

const defaultRaceBanners = [
  "/defaults/race-banner1.jpg",
  "/defaults/race-banner2.jpg",
  "/defaults/race-banner3.jpg",
  "/defaults/race-banner4.jpg",
];

const CreateRaceModal = ({ isOpen, onClose, onCreate }) => {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);

  const isValid = title.trim() && location.trim() && date;

  const getRandomDefaultRaceBanner = () => {
    const randomIndex = Math.floor(Math.random() * defaultRaceBanners.length);
    return defaultRaceBanners[randomIndex];
  };

  const resetForm = () => {
    setTitle("");
    setLocation("");
    setDate("");
    setLoading(false);
  };

  const handleClose = () => {
    resetForm();
    onClose?.();
  };

  const handleCreate = async () => {
    if (!isValid) return;

    const defaultBannerUrl = getRandomDefaultRaceBanner();
    const profile = JSON.parse(sessionStorage.getItem("profile"));
    const profileId = profile?.id;

    const payload = {
      profileId,
      title: title.trim(),
      location: location.trim(),
      date,
      bannerUrl: defaultBannerUrl,
    };

    try {
      setLoading(true);

      const response = await raceService.createRace(payload);

      onCreate?.(response.data);

      resetForm();
      onClose?.();
    } catch (err) {
      console.error("Create race failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      header={
        <h3 className="text-xl font-semibold text-gray-900">Create Race</h3>
      }
      body={
        <div className="space-y-5">
          <p className="text-sm text-gray-500">
            Add a new race to your schedule
          </p>

          <input
            type="text"
            placeholder="Race title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="
              w-full px-4 py-3 rounded-xl
              bg-white/70 backdrop-blur border border-gray-200
              text-gray-800 placeholder-gray-400
              focus:outline-none focus:ring-2 focus:ring-indigo-400/40
            "
          />

          <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="
              w-full px-4 py-3 rounded-xl
              bg-white/70 backdrop-blur border border-gray-200
              text-gray-800 placeholder-gray-400
              focus:outline-none focus:ring-2 focus:ring-indigo-400/40
            "
          />

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="
              w-full px-4 py-3 rounded-xl
              bg-white/70 backdrop-blur border border-gray-200
              text-gray-700
              focus:outline-none focus:ring-2 focus:ring-indigo-400/40
            "
          />

          <button
            onClick={handleCreate}
            disabled={!isValid || loading}
            className="
              w-full py-3 rounded-xl text-sm font-semibold
              bg-gradient-to-r from-indigo-500 to-purple-500 text-white
              hover:opacity-90 active:scale-[0.98] transition
              disabled:opacity-40 disabled:cursor-not-allowed
            "
          >
            {loading ? "Creating..." : "Create Race"}
          </button>
        </div>
      }
    />
  );
};

export default CreateRaceModal;