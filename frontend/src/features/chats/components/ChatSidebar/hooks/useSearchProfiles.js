import { useEffect, useState } from "react";
import { profileService } from "../../../../../services/profile";

export const useSearchProfiles = (search, profileId) => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!search.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    let isCurrent = true;
    setLoading(true);

    const timeout = setTimeout(async () => {
      try {
        const { data } = await profileService.searchProfiles(search, profileId);

        if (isCurrent) {
          setResults(data);
        }
      } catch (err) {
        console.error("Search failed:", err);
      } finally {
        if (isCurrent) setLoading(false);
      }
    }, 200);

    return () => {
      isCurrent = false;
      clearTimeout(timeout);
    };
  }, [profileId, search]);

  return { results, loading, setResults, setLoading };
};