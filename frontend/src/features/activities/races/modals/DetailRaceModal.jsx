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
        <h3 className="text-lg font-semibold">
          {isEditing ? "Edit Race" : "View Race"}
        </h3>
      }
      body={
        <div className="space-y-4">
          <img
            src={form.bannerUrl || "https://via.placeholder.com/300x200"}
            alt={form.title}
            className="w-full h-40 object-cover rounded-lg"
          />

          {/* TITLE */}
          {isEditing ? (
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
            />
          ) : (
            <h4 className="text-lg font-semibold">{form.title}</h4>
          )}

          {isEditing && (
            <input
              type="text"
              placeholder="Banner image URL"
              value={form.bannerUrl}
              onChange={(e) => setForm({ ...form, bannerUrl: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
            />
          )}

          {/* LOCATION + DATE */}
          {isEditing ? (
            <>
              <input
                type="text"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />

              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </>
          ) : (
            <p className="text-sm text-gray-500">
              {new Date(form.date).toLocaleDateString()} • {form.location}
            </p>
          )}

          {/* ACTION BUTTONS */}
          {isEditing ? (
            <div className="flex gap-2">
              <button
                onClick={handleUpdate}
                disabled={!isValid}
                className="flex-1 py-2 bg-green-600 disabled:bg-gray-400 text-white rounded-lg"
              >
                Save
              </button>

              <button
                onClick={() => setIsEditing(false)}
                className="flex-1 py-2 bg-gray-300 rounded-lg"
              >
                Cancel
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => setIsEditing(true)}
                className="flex-1 py-2 bg-blue-600 text-white rounded-lg"
              >
                Edit
              </button>

              <button
                onClick={handleComplete}
                className="flex-1 py-2 bg-purple-600 text-white rounded-lg"
              >
                {race.completed ? "Upcoming" : "Completed"}
              </button>
            </div>
          )}
        </div>
      }
    />
  );
};

export default DetailRaceModal;
