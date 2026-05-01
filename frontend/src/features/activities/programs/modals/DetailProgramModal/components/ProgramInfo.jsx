import { formatDays } from "../../../utils/formatters";

const ProgramInfo = ({ form, setForm, program, isEditing }) => {
  if (isEditing) {
    return (
      <div className="space-y-4">
        <input
          type="text"
          value={form.title}
          placeholder="Program title"
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
          value={form.bannerUrl}
          placeholder="Banner image URL"
          onChange={(e) => setForm({ ...form, bannerUrl: e.target.value })}
          className="
            w-full px-4 py-3 rounded-xl
            bg-white/70 backdrop-blur border border-gray-200
            text-gray-700 placeholder-gray-400
            focus:outline-none focus:ring-2 focus:ring-indigo-400/40
          "
        />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h4 className="text-2xl font-semibold text-gray-900">{form.title}</h4>

      <p className="text-sm text-gray-500">
        {formatDays(program.weeklyFrequency) || "No schedule"}
      </p>
    </div>
  );
};

export default ProgramInfo;