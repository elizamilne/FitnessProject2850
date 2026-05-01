import { useEffect, useState } from "react";
import Modal from "../../../../common/ui/Modal";
import { raceService } from "../../../../services/race";

const DetailRaceModal = ({ isOpen, onClose, race, onUpdate }) => {
  const [form, setForm] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const [updateLoading, setUpdateLoading] = useState(false);
  const [completeLoading, setCompleteLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    if (race) {
      setForm({
        id: race.id,
        title: race.title || "",
        location: race.location || "",
        date: race.date?.split("T")[0] || "",
        bannerUrl: race.bannerUrl || "",
      });

      setIsEditing(false);
    } else {
      setForm(null);
    }
  }, [race]);

  if (!race || !form) return null;

  const isValid = form.title && form.location && form.date;

  const resetForm = () => {
    setForm({
      id: race.id,
      title: race.title || "",
      location: race.location || "",
      date: race.date?.split("T")[0] || "",
      bannerUrl: race.bannerUrl || "",
    });

    setIsEditing(false);
  };

  const handleUpdate = async () => {
    if (!isValid) return;

    try {
      setUpdateLoading(true);

      const response = await raceService.updateRace(race.id, {
        ...race,
        ...form,
      });

      onUpdate?.(response.data);
      setIsEditing(false);
    } catch (err) {
      console.error("Update failed:", err);
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleComplete = async () => {
    try {
      setCompleteLoading(true);

      const response = await raceService.toggleComplete(race.id);

      onUpdate?.(response.data);
    } catch (err) {
      console.error("Complete failed:", err);
    } finally {
      setCompleteLoading(false);
    }
  };

  const handleDeleteRace = async () => {
    if (!race?.id) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this race? This cannot be undone."
    );

    if (!confirmed) return;

    try {
      setDeleteLoading(true);

      await raceService.deleteRace(race.id);

      onUpdate?.({ ...race, deleted: true });
      onClose();
    } catch (err) {
      console.error("Race delete failed:", err);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      header={
        <h3 className="text-xl font-semibold text-gray-900">
          {isEditing ? "Edit Race" : "Race Details"}
        </h3>
      }
      body={
        <div className="space-y-6">
          <div className="relative">
            <img
              src={form.bannerUrl || "https://via.placeholder.com/300x200"}
              alt={form.title}
              className="w-full h-48 object-cover rounded-2xl"
            />

            <div className="absolute inset-0 rounded-2xl bg-black/20" />

            <span
              className={`
                absolute top-3 right-3 rounded-full px-3 py-1
                text-xs font-semibold backdrop-blur-md text-white shadow-md
                ${race.completed
                  ? "bg-gradient-to-r from-green-500 to-emerald-500"
                  : "bg-gradient-to-r from-indigo-500 to-purple-500"
                }
              `}
            >
              {race.completed ? "Completed" : "Upcoming"}
            </span>
          </div>

          <div className={isEditing ? "space-y-4" : "space-y-2"}>
            {isEditing ? (
              <div className="grid grid-cols-1 gap-4">
                <input
                  type="text"
                  value={form.title}
                  placeholder="Race title"
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="
                    w-full px-4 py-3 rounded-xl
                    bg-white/70 backdrop-blur border border-gray-200
                    text-gray-800 placeholder-gray-400
                    focus:outline-none focus:ring-2 focus:ring-indigo-400/40
                  "
                />

                <input
                  type="text"
                  placeholder="Banner image URL"
                  value={form.bannerUrl}
                  onChange={(e) =>
                    setForm({ ...form, bannerUrl: e.target.value })
                  }
                  className="
                    w-full px-4 py-3 rounded-xl
                    bg-white/70 backdrop-blur border border-gray-200
                    text-gray-700 placeholder-gray-400
                    focus:outline-none focus:ring-2 focus:ring-indigo-400/40
                  "
                />

                <input
                  type="text"
                  placeholder="Location"
                  value={form.location}
                  onChange={(e) =>
                    setForm({ ...form, location: e.target.value })
                  }
                  className="
                    w-full px-4 py-3 rounded-xl
                    bg-white/70 backdrop-blur border border-gray-200
                    text-gray-700 placeholder-gray-400
                    focus:outline-none focus:ring-2 focus:ring-indigo-400/40
                  "
                />

                <input
                  type="date"
                  value={form.date}
                  onChange={(e) =>
                    setForm({ ...form, date: e.target.value })
                  }
                  className="
                    w-full px-4 py-3 rounded-xl
                    bg-white/70 backdrop-blur border border-gray-200
                    text-gray-700
                    focus:outline-none focus:ring-2 focus:ring-indigo-400/40
                  "
                />
              </div>
            ) : (
              <>
                <h4 className="text-2xl font-semibold text-gray-900">
                  {form.title}
                </h4>

                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span>{new Date(form.date).toLocaleDateString()}</span>
                  <span className="text-gray-300">•</span>
                  <span>{form.location}</span>
                </div>
              </>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            {isEditing ? (
              <>
                <button
                  onClick={handleUpdate}
                  disabled={!isValid || updateLoading}
                  className="
                    flex-1 py-3 rounded-xl text-sm font-semibold
                    bg-gradient-to-r from-indigo-500 to-purple-500 text-white
                    hover:opacity-90 active:scale-[0.98] transition
                    disabled:opacity-40 disabled:cursor-not-allowed
                  "
                >
                  {updateLoading ? "Saving..." : "Save Changes"}
                </button>

                <button
                  onClick={resetForm}
                  className="
                    flex-1 py-3 rounded-xl text-sm font-medium
                    bg-gray-100 text-gray-700
                    hover:bg-gray-200 transition
                  "
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="
                    flex-1 py-3 rounded-xl text-sm font-medium
                    bg-gray-100 text-gray-700
                    hover:bg-gray-200 transition
                  "
                >
                  Edit
                </button>

                <button
                  onClick={handleComplete}
                  disabled={completeLoading}
                  className="
                    flex-1 py-3 rounded-xl text-sm font-semibold
                    bg-gradient-to-r from-indigo-500 to-purple-500 text-white
                    hover:opacity-90 active:scale-[0.98] transition
                    disabled:opacity-40 disabled:cursor-not-allowed
                  "
                >
                  {completeLoading
                    ? race.completed
                      ? "Updating..."
                      : "Updating..."
                    : race.completed
                      ? "Mark as Upcoming"
                      : "Mark as Completed"}
                </button>
              </>
            )}
          </div>

          {!isEditing && (
            <div className="flex justify-center border-t border-gray-100 pt-4">
              <button
                type="button"
                onClick={handleDeleteRace}
                disabled={deleteLoading}
                className="
                  text-xs font-medium text-gray-400
                  hover:text-red-500
                  transition
                  disabled:opacity-40 disabled:cursor-not-allowed
                "
              >
                {deleteLoading ? "Deleting..." : "Delete race"}
              </button>
            </div>
          )}
        </div>
      }
    />
  );
};

export default DetailRaceModal;