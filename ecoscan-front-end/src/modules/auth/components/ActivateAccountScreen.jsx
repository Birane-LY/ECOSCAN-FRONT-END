"use client";

import React, { useState } from "react";
import {
  AlertCircle,
  ArrowUpRight,
  CheckCircle2,
  Eye,
  EyeOff,
} from "lucide-react";
import { DotGlobe } from "@/components/instruments";
import { APP_CONFIG } from "@/lib/config";
import { activateAccount } from "@/lib/apiClient";

export function ActivateAccountScreen({ uid, token, onCompleted }) {
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] =
    useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [activated, setActivated] = useState(false);
  const [trialStarted, setTrialStarted] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage(null);

    if (password !== passwordConfirmation) {
      setErrorMessage("La confirmation ne correspond pas au mot de passe.");
      return;
    }

    setLoading(true);
    try {
      const result = await activateAccount({
        uid,
        token,
        motDePasse: password,
        confirmationMotDePasse: passwordConfirmation,
      });
      setTrialStarted(Boolean(result.essai_demarre));
      setActivated(true);
    } catch (error) {
      setErrorMessage(error.message || "Impossible d’activer votre compte.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="eco-shell lg" data-theme="night">
      <div className="eco-backdrop" aria-hidden="true" />

      <div className="lg-globe">
        <DotGlobe />
      </div>

      <section className="lg-panel">
        <header className="lg-brand">
          {APP_CONFIG?.logoUrl && <img src={APP_CONFIG.logoUrl} alt="Logo" />}
          <span>{APP_CONFIG?.name || "EcoScan"}</span>
        </header>

        <div className="lg-body">
          <div className="lg-copy">
            <h1>Votre espace commence ici.</h1>
            <p>
              Définissez votre mot de passe pour rejoindre votre espace de
              pilotage énergétique.
            </p>
          </div>

          <div className="lg-card glass">
            {activated ? (
              <>
                <div className="lg-success" role="status">
                  <CheckCircle2 size={18} />
                  <span>Votre compte est activé.</span>
                </div>
                <h2>Bienvenue dans EcoScan.</h2>
                <p className="lg-sub">
                  {trialStarted
                    ? "Votre essai gratuit de 14 jours démarre maintenant. Connectez-vous pour accéder à la formule choisie."
                    : "Vous pouvez maintenant vous connecter avec votre nouveau mot de passe."}
                </p>
                <button
                  type="button"
                  className="primary-button lg-full"
                  onClick={onCompleted}
                >
                  Se connecter <ArrowUpRight size={16} />
                </button>
              </>
            ) : (
              <>
                <h2>Activez votre compte.</h2>
                <p className="lg-sub">
                  Choisissez un mot de passe pour activer votre compte.
                </p>

                {errorMessage && (
                  <div className="lg-error" role="alert">
                    <AlertCircle size={17} />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="lg-form">
                  <label className="fld">
                    Mot de passe
                    <span className="fld-unit">
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        minLength={8}
                        autoComplete="new-password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                      />
                      <button
                        type="button"
                        className="lg-eye"
                        aria-label={
                          showPassword
                            ? "Masquer le mot de passe"
                            : "Afficher le mot de passe"
                        }
                        onClick={() => setShowPassword((visible) => !visible)}
                      >
                        {showPassword ? (
                          <EyeOff size={17} />
                        ) : (
                          <Eye size={17} />
                        )}
                      </button>
                    </span>
                  </label>

                  <label className="fld">
                    Confirmer le mot de passe
                    <span className="fld-unit">
                      <input
                        type={showPasswordConfirmation ? "text" : "password"}
                        required
                        minLength={8}
                        autoComplete="new-password"
                        value={passwordConfirmation}
                        onChange={(event) =>
                          setPasswordConfirmation(event.target.value)
                        }
                      />
                      <button
                        type="button"
                        className="lg-eye"
                        aria-label={
                          showPasswordConfirmation
                            ? "Masquer la confirmation"
                            : "Afficher la confirmation"
                        }
                        onClick={() =>
                          setShowPasswordConfirmation((visible) => !visible)
                        }
                      >
                        {showPasswordConfirmation ? (
                          <EyeOff size={17} />
                        ) : (
                          <Eye size={17} />
                        )}
                      </button>
                    </span>
                  </label>

                  <button
                    type="submit"
                    className="primary-button lg-full"
                    disabled={loading}
                  >
                    {loading ? "Activation en cours…" : "Activer mon compte"}{" "}
                    <ArrowUpRight size={16} />
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
