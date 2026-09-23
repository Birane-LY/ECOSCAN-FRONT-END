"use client";

import React, { useState, useEffect, useRef } from "react";

import {
  ArrowUpRight,
  Check,
  Clock,
  FileText,
  Lock,
  Mic,
  Save,
  AlertCircle,
} from "lucide-react";

import { DotNumeral, GlassCard } from "@/components/instruments";

import { useCompteur } from "@/modules/business-tools/hooks/useCompteur";

import {
  useWoyofalReadings,
} from "@/modules/business-tools/hooks/useWoyofalReadings";

import { useOrganisation } from "@/modules/business-tools/hooks/useOrganisation";

import { useDailyObservation } from "@/modules/business-tools/hooks/useDailyObservation";

import {
  WOYOFAL_SLOTS,
  calculateSlotDelta,
  calculateDayCumulative,
} from "@/modules/business-tools/services/woyofalCalculations";


const SLOT_KEYS = [
  "matin",
  "midi",
  "apresmidi",
  "soir",
];


const parseTimeToMinutes = (timeStr) => {
  const [h, m] = timeStr.split(":").map(Number);
  return h * 60 + m;
};


const getSlotStatus = (
  slotTimeIndex,
  currentTimeMinutes
) => {
  const [, time] = WOYOFAL_SLOTS[slotTimeIndex];

  const startTime = parseTimeToMinutes(time);

  const nextSlot =
    WOYOFAL_SLOTS[slotTimeIndex + 1];

  const endTime = nextSlot
    ? parseTimeToMinutes(nextSlot[1])
    : 23 * 60 + 59;

  if (currentTimeMinutes < startTime) {
    return "UPCOMING";
  }

  if (
    currentTimeMinutes >= startTime &&
    currentTimeMinutes < endTime
  ) {
    return "OPEN";
  }

  return "EXPIRED";
};


const formatTimeRemaining = (minutesDiff) => {
  if (minutesDiff <= 0) {
    return "dans quelques instants";
  }

  const hrs = Math.floor(minutesDiff / 60);
  const mins = minutesDiff % 60;

  if (hrs > 0) {
    return `dans ${hrs} h ${
      mins > 0 ? `${mins} min` : ""
    }`.trim();
  }

  return `dans ${mins} min`;
};


export function WoyofalTool({
  setDrawer,
  pendingCapture,
  onCaptureConsumed,
}) {
  const {
    organisation,
    loading: organisationLoading,
    error: organisationError,
  } = useOrganisation();


  const {
    compteur,
    loading: compteurLoading,
    error: compteurError,
  } = useCompteur(organisation?.id);


  const {
    dernierReleve,
    enregistrerReleve,
    creneauxEnregistres,
    loading: readingsLoading,
  } = useWoyofalReadings(compteur?.id);


  const {
    saving: savingBilan,
    error: bilanError,
    saved: bilanSaved,
    enregistrerBilan,
  } = useDailyObservation(
    organisation?.id,
    compteur?.id
  );


  const [slotValues, setSlotValues] = useState({
    matin: "",
    midi: "",
    apresmidi: "",
    soir: "",
  });


  const [slotNotes, setSlotNotes] = useState({
    matin: "",
    midi: "",
    apresmidi: "",
    soir: "",
  });


  const [savedSlotIds, setSavedSlotIds] = useState(
    () => new Set()
  );


  const [dayReview, setDayReview] = useState("");
  const [reviewMode, setReviewMode] = useState("text");
  const [isRecording, setIsRecording] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState(null);


  const [now, setNow] = useState(new Date());


  /**
   * Actualisation de l'heure chaque seconde.
   *
   * Cela permet au changement de créneau
   * de se faire immédiatement sans recharger
   * la page.
   */
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);


  const currentMinutes =
    now.getHours() * 60 + now.getMinutes();


  /**
   * Synchronise l'état local avec les créneaux
   * déjà enregistrés aujourd'hui.
   */
  useEffect(() => {
    if (!creneauxEnregistres) {
      return;
    }

    setSavedSlotIds(
      new Set(creneauxEnregistres)
    );
  }, [creneauxEnregistres]);


  /**
   * Capture automatique.
   *
   * On ne remplit jamais un créneau déjà enregistré.
   */
  useEffect(() => {
    if (!pendingCapture) {
      return;
    }

    const valeur =
      pendingCapture.nouveau_index ??
      pendingCapture.consommation_kwh;

    if (valeur == null) {
      onCaptureConsumed?.();
      return;
    }

    setSlotValues((current) => {
      const premierVide = SLOT_KEYS.find(
        (id, idx) => {
          const status = getSlotStatus(
            idx,
            currentMinutes
          );

          const dejaEnregistre =
            creneauxEnregistres?.has(id);

          return (
            !current[id] &&
            status === "OPEN" &&
            !dejaEnregistre
          );
        }
      );

      if (!premierVide) {
        return current;
      }

      return {
        ...current,
        [premierVide]: String(valeur),
      };
    });

    onCaptureConsumed?.();
  }, [
    pendingCapture,
    onCaptureConsumed,
    currentMinutes,
    creneauxEnregistres,
  ]);


  const savedTimeoutRef = useRef(null);


  useEffect(() => {
    return () => {
      if (savedTimeoutRef.current) {
        clearTimeout(savedTimeoutRef.current);
      }
    };
  }, []);


  const baseline = dernierReleve
    ? Number(dernierReleve.valeur)
    : 0;


  const completedCount = Object.values(
    slotValues
  ).filter(Boolean).length;


  const dailyTotal = calculateDayCumulative(
    slotValues,
    baseline
  );


  const getPreviousValue = (slotIndex) => {
    for (
      let i = slotIndex - 1;
      i >= 0;
      i -= 1
    ) {
      const key = SLOT_KEYS[i];

      if (slotValues[key]) {
        return Number(slotValues[key]);
      }
    }

    return baseline;
  };


  const handleSlotChange = (
    id,
    rawValue
  ) => {
    /**
     * Protection supplémentaire :
     * un créneau déjà enregistré ne peut
     * jamais être modifié.
     */
    if (creneauxEnregistres?.has(id)) {
      return;
    }

    if (savedSlotIds.has(id)) {
      return;
    }

    setSlotValues((current) => ({
      ...current,
      [id]: rawValue.replace(/\D/g, ""),
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!compteur) {
      setSaveError(
        "Aucun compteur trouvé pour votre organisation."
      );
      return;
    }

    const remplis =
      WOYOFAL_SLOTS.filter(
        ([id]) =>
          slotValues[id] &&
          !savedSlotIds.has(id) &&
          !creneauxEnregistres?.has(id)
      );


    if (remplis.length === 0) {
      setSaveError(
        "Tous les créneaux renseignés ont déjà été enregistrés."
      );
      return;
    }


    setSaving(true);
    setSaveError(null);


    try {
      for (const [id, , label] of remplis) {
        /**
         * Double protection juste avant l'envoi.
         */
        if (
          creneauxEnregistres?.has(id) ||
          savedSlotIds.has(id)
        ) {
          continue;
        }


        await enregistrerReleve(
          Number(slotValues[id]),
          `${label} (${slotNotes[id] || "sans note"})`,
          id
        );


        /**
         * Le créneau est immédiatement verrouillé
         * côté interface.
         */
        setSavedSlotIds((current) => {
          const next = new Set(current);
          next.add(id);
          return next;
        });
      }


      setSaved(true);


      if (savedTimeoutRef.current) {
        clearTimeout(savedTimeoutRef.current);
      }


      savedTimeoutRef.current =
        window.setTimeout(
          () => setSaved(false),
          2200
        );


    } catch (err) {
      setSaveError(
        err.message ||
          "Erreur lors de l'enregistrement."
      );
    } finally {
      setSaving(false);
    }
  };


  const handleFinishReview = async () => {
    if (!dayReview.trim()) {
      setSaveError(
        "Veuillez saisir votre bilan avant de finaliser."
      );
      return;
    }

    setSaveError(null);

    try {
      await enregistrerBilan(dayReview);

      setDrawer("daily-summary");

    } catch (err) {
      setSaveError(
        err.message ||
          "Erreur lors de l'enregistrement du bilan."
      );
    }
  };


  if (
    organisationLoading ||
    compteurLoading ||
    readingsLoading
  ) {
    return (
      <p className="drawer-lead">
        Chargement de votre compteur…
      </p>
    );
  }


  if (
    organisationError ||
    compteurError ||
    !compteur
  ) {
    return (
      <p className="drawer-lead">
        Erreur :{" "}
        {organisationError ||
          compteurError ||
          "Aucun compteur associé à votre organisation."}
      </p>
    );
  }


  return (
    <div className="wy">

      <aside className="wy-intro">

        <p className="wy-ref">
          Compteur {compteur.reference}
        </p>

        <h2>
          Votre journée énergétique, par séquences.
        </h2>

        <p>
          Relevez l’index toutes les quatre heures
          pour comprendre les rythmes de votre activité,
          puis terminez par un bilan personnel.
        </p>

        <p className="wy-reminders">
          <Clock size={16} />
          Rappels à 08:00, 12:00, 16:00 et 20:00
        </p>

        <div className="wy-total">

          <span>
            Cumul de la journée
          </span>

          <div className="wy-total-num">

            <DotNumeral size={64}>
              {dailyTotal.toLocaleString("fr-FR")}
            </DotNumeral>

            <small>kWh</small>

          </div>

          <span className="wy-progress">
            {completedCount} créneau
            {completedCount > 1 ? "x" : ""} sur 4 saisi
            {completedCount > 1 ? "s" : ""}
          </span>

        </div>

      </aside>


      <form
        className="wy-form"
        onSubmit={handleSubmit}
      >

        <div className="wy-slots">

          {WOYOFAL_SLOTS.map(
            ([id, time, label], slotIndex) => {

              const value = slotValues[id];

              const delta =
                calculateSlotDelta(
                  value,
                  getPreviousValue(slotIndex)
                );


              const slotTimeMinutes =
                parseTimeToMinutes(time);


              const status =
                getSlotStatus(
                  slotIndex,
                  currentMinutes
                );


              /**
               * Le créneau est considéré comme
               * enregistré si le backend OU l'état
               * local le connaît.
               */
              const isAlreadySaved =
                creneauxEnregistres?.has(id) ||
                savedSlotIds.has(id);


              const isFilled =
                Boolean(value);


              const isExpired =
                status === "EXPIRED" &&
                !isFilled &&
                !isAlreadySaved;


              const isUpcoming =
                status === "UPCOMING" &&
                !isAlreadySaved;


              /**
               * Le créneau est réellement ouvert
               * seulement s'il n'est pas déjà enregistré.
               */
              const isOpen =
                status === "OPEN" &&
                !isAlreadySaved;


              /**
               * IMPORTANT :
               *
               * Dès qu'un créneau est enregistré,
               * il reste disabled pour le reste
               * de la journée.
               *
               * Il redeviendra disponible demain
               * lorsque creneauxEnregistres sera recalculé.
               */
              const isDisabled =
                isAlreadySaved ||
                (!isOpen && !isFilled);


              let cardState = "todo";


              if (isAlreadySaved) {
                cardState = "done";
              } else if (isFilled) {
                cardState = "done";
              } else if (isExpired) {
                cardState = "expired";
              } else if (isUpcoming) {
                cardState = "locked";
              } else if (isOpen) {
                cardState = "next";
              }


              return (
                <GlassCard
                  as="section"
                  className={`wy-slot ${cardState}`}
                  key={id}
                >

                  <div className="wy-slot-head">

                    <span
                      className="wy-orb"
                      aria-hidden="true"
                    >
                      {isAlreadySaved ||
                      isFilled ? (
                        <Check size={20} />
                      ) : isExpired ? (
                        <AlertCircle size={18} />
                      ) : isUpcoming ? (
                        <Lock size={18} />
                      ) : (
                        time.slice(0, 2)
                      )}
                    </span>


                    <div>

                      <strong>
                        {label}
                      </strong>

                      <small>

                        {time}

                        {isAlreadySaved &&
                          " (Déjà enregistré aujourd’hui)"}

                        {!isAlreadySaved &&
                          isOpen &&
                          " (Créneau ouvert)"}

                        {!isAlreadySaved &&
                          isUpcoming &&
                          ` (Ouvre ${formatTimeRemaining(
                            slotTimeMinutes -
                              currentMinutes
                          )})`}

                        {!isAlreadySaved &&
                          isExpired &&
                          " (Créneau expiré)"}

                      </small>

                    </div>

                  </div>


                  <label className="fld">

                    Index du compteur

                    <input
                      inputMode="numeric"
                      value={value}
                      disabled={isDisabled}
                      placeholder={
                        isAlreadySaved
                          ? "Relevé déjà enregistré pour aujourd’hui"
                          : isExpired
                          ? "Créneau non renseigné"
                          : isUpcoming
                          ? `Prochain créneau (${formatTimeRemaining(
                              slotTimeMinutes -
                                currentMinutes
                            )})`
                          : slotIndex === 0 &&
                            dernierReleve
                          ? String(baseline)
                          : "Saisir l’index"
                      }
                      onChange={(e) =>
                        handleSlotChange(
                          id,
                          e.target.value
                        )
                      }
                    />

                  </label>


                  {isAlreadySaved ? (

                    <p className="wy-delta">

                      <Check size={14} />

                      Relevé déjà enregistré pour
                      aujourd’hui

                    </p>

                  ) : isFilled ? (

                    <p className="wy-delta">

                      +{delta.toLocaleString("fr-FR")}{" "}

                      <small>
                        kWh depuis le relevé précédent
                      </small>

                    </p>

                  ) : isUpcoming ? (

                    <p className="wy-delta muted">

                      Ouvre dans{" "}

                      {formatTimeRemaining(
                        slotTimeMinutes -
                          currentMinutes
                      )}

                    </p>

                  ) : isExpired ? (

                    <p className="wy-delta error">

                      Plage horaire dépassée sans saisie

                    </p>

                  ) : (

                    <p className="wy-delta muted">

                      En attente de relevé

                    </p>

                  )}


                  <input
                    className="wy-note"
                    value={slotNotes[id]}
                    disabled={isDisabled}
                    placeholder={
                      isAlreadySaved
                        ? "Créneau déjà enregistré"
                        : "Note rapide (facultatif)"
                    }
                    aria-label={`Note pour ${label}`}
                    onChange={(e) =>
                      setSlotNotes(
                        (current) => ({
                          ...current,
                          [id]: e.target.value,
                        })
                      )
                    }
                  />

                </GlassCard>
              );
            }
          )}

        </div>


        {saveError && (
          <p className="form-error">
            {saveError}
          </p>
        )}


        <div className="wy-save">

          <button
            className="primary-button"
            type="submit"
            disabled={saving}
          >

            {saving ? (
              "Enregistrement…"
            ) : saved ? (
              <>
                <Check size={16} />
                Relevés enregistrés
              </>
            ) : (
              <>
                <Save size={16} />
                Enregistrer les relevés
              </>
            )}

          </button>

          <span>
            Chaque créneau ne peut être enregistré
            qu’une seule fois par jour.
          </span>

        </div>


        <GlassCard
          as="section"
          tone="inverse"
          className="wy-review"
        >

          <div className="wy-review-head">

            <div>

              <strong>
                Comment s’est passée votre journée ?
              </strong>

              <small>
                Le bilan de fin de journée nourrit la
                mémoire d’EcoScan.
              </small>

            </div>


            <div
              className="wy-modes"
              role="group"
              aria-label="Mode de saisie"
            >

              <button
                type="button"
                className={
                  reviewMode === "text"
                    ? "on"
                    : ""
                }
                onClick={() =>
                  setReviewMode("text")
                }
              >
                <FileText size={15} />
                Écrit
              </button>


              <button
                type="button"
                className={
                  reviewMode === "voice"
                    ? "on"
                    : ""
                }
                onClick={() =>
                  setReviewMode("voice")
                }
              >
                <Mic size={15} />
                Vocal
              </button>

            </div>

          </div>


          {reviewMode === "text" ? (

            <textarea
              value={dayReview}
              onChange={(e) =>
                setDayReview(e.target.value)
              }
              rows={4}
              placeholder="Ex. activité intense le matin, coupure à 16 h, journée stable ensuite…"
            />

          ) : (

            <>
              <button
                type="button"
                className={`wy-voice ${
                  isRecording ? "rec" : ""
                }`}
                onClick={() =>
                  setIsRecording(
                    (v) => !v
                  )
                }
              >

                {isRecording ? (
                  <>
                    <span className="wy-rec-dot" />
                    Enregistrement en cours,
                    touchez pour terminer
                  </>
                ) : (
                  <>
                    <Mic size={18} />
                    Décrire ma journée à voix haute
                  </>
                )}

              </button>

              <p className="wy-demo">
                Passez en mode Écrit pour saisir vos
                remarques directement si vous préférez.
              </p>

            </>

          )}


          {bilanError && (
            <p className="form-error">
              {bilanError}
            </p>
          )}


          <div className="wy-review-foot">

            <button
              type="button"
              className="secondary-button"
              onClick={handleFinishReview}
              disabled={savingBilan}
            >

              {savingBilan
                ? "Enregistrement…"
                : bilanSaved
                ? "Bilan enregistré"
                : "Finaliser mon bilan"}

              {" "}

              <ArrowUpRight size={15} />

            </button>


            <button
              type="button"
              className="quiet-button wy-history"
              onClick={() =>
                setDrawer("daily-summary")
              }
            >
              Voir l’historique complet{" "}
              <ArrowUpRight size={14} />
            </button>

          </div>

        </GlassCard>

      </form>

    </div>
  );
}

