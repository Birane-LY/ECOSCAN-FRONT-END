"use client";

import {
  useEffect,
  useState,
  useCallback,
} from "react";

import {
  apiGet,
  apiPost,
} from "@/lib/apiClient";


const SOURCE_NOM =
  "Saisie manuelle Woyofal";


export const WOYOFAL_SLOT_KEYS = [
  "matin",
  "midi",
  "apresmidi",
  "soir",
];


async function resoudreSourceManuelle() {
  const sources = await apiGet(
    "/energies/sources-donnees/"
  );

  const liste = Array.isArray(sources)
    ? sources
    : sources?.results || [];


  const existante = liste.find(
    (s) => s.nom === SOURCE_NOM
  );


  if (existante) {
    return existante;
  }


  return apiPost(
    "/energies/sources-donnees/",
    {
      nom: SOURCE_NOM,
      type: "MANUELLE",
      origine: "Saisie utilisateur",
      frequence: "Variable",
      statut_synchronisation: "MANUEL",
    }
  );
}


/**
 * Retourne directement le créneau enregistré
 * dans le champ creneau de la base.
 *
 * Le fallback sur source/note permet de rester
 * compatible avec d'anciens relevés.
 */
function detecterCreneau(releve) {

  /**
   * PRIORITÉ :
   * vrai champ creneau de la base.
   */
  if (
    releve?.creneau &&
    WOYOFAL_SLOT_KEYS.includes(
      releve.creneau
    )
  ) {
    return releve.creneau;
  }


  /**
   * Compatibilité avec les anciens relevés.
   */
  const texte = String(
    releve?.source ||
      releve?.note ||
      releve?.description ||
      ""
  ).toLowerCase();


  if (texte.includes("matin")) {
    return "matin";
  }


  if (texte.includes("midi")) {
    return "midi";
  }


  if (
    texte.includes("après-midi") ||
    texte.includes("apres-midi") ||
    texte.includes("apresmidi")
  ) {
    return "apresmidi";
  }


  if (texte.includes("soir")) {
    return "soir";
  }


  return null;
}


/**
 * Vérifie si une date appartient
 * au jour courant du navigateur.
 */
function estAujourdhui(dateValue) {

  if (!dateValue) {
    return false;
  }


  const date = new Date(dateValue);


  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return false;
  }


  const maintenant = new Date();


  return (
    date.getFullYear() ===
      maintenant.getFullYear() &&
    date.getMonth() ===
      maintenant.getMonth() &&
    date.getDate() ===
      maintenant.getDate()
  );
}


export function useWoyofalReadings(
  compteurId
) {

  const [state, setState] = useState({
    loading: true,
    error: null,
    dernierReleve: null,
    releves: [],
    creneauxEnregistres: new Set(),
  });


  const reload = useCallback(
    async () => {

      if (!compteurId) {

        setState({
          loading: false,
          error: null,
          dernierReleve: null,
          releves: [],
          creneauxEnregistres:
            new Set(),
        });

        return;
      }


      setState((s) => ({
        ...s,
        loading: true,
        error: null,
      }));


      try {

        const response =
          await apiGet(
            `/energies/donnees-energetiques/?compteur=${compteurId}`
          );


        const releves =
          Array.isArray(response)
            ? response
            : response?.results || [];


        /**
         * Tri du plus récent au plus ancien.
         */
        const trie = [...releves].sort(
          (a, b) =>
            new Date(
              b.periode_fin ||
                b.date_releve ||
                b.periode_debut
            ) -
            new Date(
              a.periode_fin ||
                a.date_releve ||
                a.periode_debut
            )
        );


        /**
         * Relevés du jour.
         */
        const relevesDuJour =
          trie.filter(
            (releve) =>
              estAujourdhui(
                releve.date_releve ||
                  releve.periode_fin ||
                  releve.periode_debut
              )
          );


        /**
         * Créneaux déjà enregistrés
         * aujourd'hui.
         */
        const creneaux = new Set();


        relevesDuJour.forEach(
          (releve) => {

            const creneau =
              detecterCreneau(
                releve
              );


            if (creneau) {
              creneaux.add(
                creneau
              );
            }

          }
        );


        setState({
          loading: false,
          error: null,
          dernierReleve:
            trie[0] || null,
          releves: trie,
          creneauxEnregistres:
            creneaux,
        });


      } catch (err) {

        setState({
          loading: false,
          error: err.message,
          dernierReleve: null,
          releves: [],
          creneauxEnregistres:
            new Set(),
        });

      }

    },
    [compteurId]
  );


  const enregistrerReleve =
    useCallback(
      async (
        valeur,
        noteCreneau,
        creneau
      ) => {

        if (!compteurId) {
          throw new Error(
            "Aucun compteur disponible pour votre organisation."
          );
        }


        /**
         * Protection immédiate côté front.
         */
        if (
          state.creneauxEnregistres.has(
            creneau
          )
        ) {
          throw new Error(
            "Relevé déjà enregistré pour aujourd’hui"
          );
        }


        const source =
          await resoudreSourceManuelle();


        const maintenant =
          new Date();


        /**
         * date_releve doit être
         * YYYY-MM-DD.
         */
        const dateReleve =
          maintenant
            .toISOString()
            .slice(0, 10);


        const releve =
          await apiPost(
            "/energies/donnees-energetiques/",
            {
              compteur: compteurId,

              source_donnee:
                source.id,

              valeur,

              unite: "kWh",

              /**
               * On conserve l'heure exacte
               * pour les périodes.
               */
              periode_debut:
                maintenant.toISOString(),

              periode_fin:
                maintenant.toISOString(),

              /**
               * La date métier est uniquement
               * la date du jour.
               */
              date_releve:
                dateReleve,

              statut_validation:
                "EN_ATTENTE",

              source:
                noteCreneau ||
                `Relevé Woyofal - ${creneau}`,

              /**
               * C'est ce champ qui permet
               * d'identifier précisément
               * le créneau.
               */
              creneau,
            }
          );


        /**
         * Recharge depuis le backend.
         *
         * Le créneau devient donc officiellement
         * enregistré dans creneauxEnregistres.
         */
        await reload();


        return releve;
      },
      [
        compteurId,
        reload,
        state.creneauxEnregistres,
      ]
    );


  useEffect(() => {
    reload();
  }, [reload]);


  return {
    ...state,
    reload,
    enregistrerReleve,
  };
}

