import { useState } from "react";
import Modal from "../../../../common/ui/Modal";
import { raceService } from "../../../../services/race";

const DetailRaceModal = ({ isOpen, onClose, race, onUpdate }) => {
  const [form, setForm] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // initialize form when race changes
  if (race && (!form || form.id !== race.id)) {
    setForm({
      id: race.id,
      title: race.title || "",
      location: race.location || "",
      date: race.date?.split("T")[0] || "",
      bannerUrl: race.bannerUrl || "",
    });
    setIsEditing(false);
  }

  if (!race || !form) return null;

  const isValid = form.title && form.location && form.date;

  const handleUpdate = async () => {
    if (!isValid) return;

    try {
      const response = await raceService.updateRace(race.id, {
        ...race,
        ...form,
      });

      onUpdate?.(response.data);
      setIsEditing(false);
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  const handleComplete = async () => {
    try {
      const response = await raceService.toggleComplete(race.id);

      onUpdate?.(response.data);
    } catch (err) {
      console.error("Complete failed:", err);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      header={
        <h3 classNamme="text-xl font-semibold text-gray-900">
          {isEditing ? "Edit Race" : "Race Details"}
        </h3>
      }
      body={
        <div className="space-y-6">
          {/* Image Header */}
          <div className="relative">
            <img
              src={form.bannerUrl || "https://via.placeholder.com/300x200"}
              alt={form.title}
              className="w-full h-48 object-cover rounded-2xl"
            />

            {/* subtle overlay */}
            <div className="absolute inset-0 rounded-2xl bg-black/20" />
          </div>

          {/* Content */}
          <div className="space-y-4">
            {/* Title */}
            {isEditing ? (
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-4 py-3 rounded-xl
              bg-white/70 backdrop-blur border border-gray-200
              text-gray-800 placeholder-gray-400
              focus:outline-none focus:ring-2 focus:ring-indigo-400/40"
              />
            ) : (
              <h4 className="text-2xl font-semibold text-gray-900">
                {form.title}
              </h4>
            )}

            {/* Meta */}
            {!isEditing && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>{new Date(form.date).toLocaleDateString()}</span>
                <span className="text-gray-300">•</span>
                <span>{form.location}</span>
              </div>
            )}

            {/* Edit Fields */}
            {isEditing && (
              <div className="grid grid-cols-1 gap-3">
                <input
                  type="text"
                  placeholder="Banner image URL"
                  value={form.bannerUrl}
                  onChange={(e) =>
                    setForm({ ...form, bannerUrl: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl
                bg-white/70 backdrop-blur border border-gray-200
                text-gray-700 placeholder-gray-400
                focus:outline-none focus:ring-2 focus:ring-indigo-400/40"
                />

                <input
                  type="text"
                  placeholder="Location"
                  value={form.location}
                  onChange={(e) =>
                    setForm({ ...form, location: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl
                bg-white/70 backdrop-blur border border-gray-200
                text-gray-700
                focus:outline-none focus:ring-2 focus:ring-indigo-400/40"
                />

                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl
                bg-white/70 backdrop-blur border border-gray-200
                text-gray-700
                focus:outline-none focus:ring-2 focus:ring-indigo-400/40"
                />
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            {isEditing ? (
              <>
                <button
                  onClick={handleUpdate}
                  disabled={!isValid}
                  className="flex-1 py-3 rounded-xl text-sm font-semibold
                bg-gradient-to-r from-indigo-500 to-purple-500 text-white
                hover:opacity-90 active:scale-[0.98] transition
                disabled:opacity-40"
                >
                  Save Changes
                </button>

                <button
                  onClick={() => setIsEditing(false)}
                  className="flex-1 py-3 rounded-xl text-sm font-medium
                bg-gray-100 text-gray-700
                hover:bg-gray-200 transition"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex-1 py-3 rounded-xl text-sm font-medium
                bg-gray-100 text-gray-700
                hover:bg-gray-200 transition"
                >
                  Edit
                </button>

                <button
                  onClick={handleComplete}
                  className="flex-1 py-3 rounded-xl text-sm font-semibold
                bg-gradient-to-r from-indigo-500 to-purple-500 text-white
                hover:opacity-90 active:scale-[0.98] transition"
                >
                  {race.completed ? "Mark as Upcoming" : "Mark as Completed"}
                </button>
              </>
            )}
          </div>
        </div>
      }
    />
  );
};

export default DetailRaceModal;
