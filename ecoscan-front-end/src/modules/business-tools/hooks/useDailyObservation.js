import { useState, useCallback } from "react";
import { apiPost } from "@/lib/apiClient";

export function useDailyObservation(organisationId, compteurId = null, observationDate = null) {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(null);

  const enregistrerBilan = useCallback(
    async (texteObservation) => {
      if (!organisationId) {
        const msg = "L'identifiant de l'organisation est introuvable.";
        setError(msg);
        throw new Error(msg);
      }

      setSaving(true);
      setError(null);
      setSaved(false);

      try {
        // Envoi au format exact attendu par ObservationOperationnelleSerializer
        const payload = {
          organisation: organisationId,
          texte: texteObservation.trim(),
          date_observation: observationDate
            ? new Date(`${observationDate}T20:00:00`).toISOString()
            : new Date().toISOString(),
        };

        const data = await apiPost("/analyses/observations/", payload);
        setSaved(true);
        return data;
      } catch (err) {
        const errorMsg = err.message || "Impossible d'enregistrer le bilan.";
        setError(errorMsg);
        throw new Error(errorMsg);
      } finally {
        setSaving(false);
      }
    },
    [organisationId, observationDate],
  );

  return {
    saving,
    saved,
    error,
    enregistrerBilan,
  };
}