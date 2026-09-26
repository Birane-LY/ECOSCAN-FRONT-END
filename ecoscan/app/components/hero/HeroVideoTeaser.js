"use client"

import { useEffect, useRef, useState } from "react"
import { useReducedMotion } from "framer-motion"

const SCENES = [
  {
    src: "/videos/intro/01-scanner-facture.mp4",
    label: "Scanner une facture",
  },
  {
    src: "/videos/intro/02-extraction-donnees.mp4",
    label: "Extraire les données",
  },
  {
    src: "/videos/intro/03-compteur.mp4",
    label: "Observer le compteur",
  },
  {
    src: "/videos/intro/04-anomalie.mp4",
    label: "Repérer une anomalie",
  },
]

const EXIT_DURATION = 800

export default function HeroVideoTeaser() {
  const videoRef = useRef(null)
  const exitTimerRef = useRef(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [videoProgress, setVideoProgress] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [isExiting, setIsExiting] = useState(false)
  const [playbackBlocked, setPlaybackBlocked] = useState(false)
  const [mediaError, setMediaError] = useState(false)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    if (isComplete) return

    if (reduceMotion) {
      setIsComplete(true)
      return
    }

    const previousDocumentOverflow = document.documentElement.style.overflow
    const previousBodyOverflow = document.body.style.overflow
    document.documentElement.style.overflow = "hidden"
    document.body.style.overflow = "hidden"

    return () => {
      document.documentElement.style.overflow = previousDocumentOverflow
      document.body.style.overflow = previousBodyOverflow
      window.clearTimeout(exitTimerRef.current)
    }
  }, [isComplete, reduceMotion])

  useEffect(() => {
    if (isComplete || reduceMotion) return

    const video = videoRef.current
    if (!video) return

    let isMounted = true
    video.play().then(
      () => {
        if (isMounted) setPlaybackBlocked(false)
      },
      () => {
        if (isMounted) setPlaybackBlocked(true)
      },
    )

    return () => {
      isMounted = false
    }
  }, [activeIndex, isComplete, reduceMotion])

  const finishIntro = () => {
    if (isComplete || isExiting) return
    setIsExiting(true)

    if (reduceMotion) {
      setIsComplete(true)
      return
    }

    exitTimerRef.current = window.setTimeout(() => {
      setIsComplete(true)
    }, EXIT_DURATION)
  }

  const advanceScene = () => {
    if (activeIndex === SCENES.length - 1) {
      finishIntro()
      return
    }

    setVideoProgress(0)
    setActiveIndex((index) => index + 1)
  }

  const updateVideoProgress = () => {
    const video = videoRef.current
    if (!video || !Number.isFinite(video.duration) || video.duration <= 0) return
    setVideoProgress(video.currentTime / video.duration)
  }

  if (isComplete || reduceMotion) return null

  return (
    <section
      className={`intro-film${isExiting ? " intro-film--exiting" : ""}`}
      aria-label="Introduction vidéo EcoScan"
    >
      <video
        key={SCENES[activeIndex].src}
        ref={videoRef}
        className="intro-film__video"
        src={SCENES[activeIndex].src}
        autoPlay
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
        onEnded={advanceScene}
        onError={() => {
          setMediaError(true)
          advanceScene()
        }}
        onTimeUpdate={updateVideoProgress}
      />
      <div className="intro-film__shade" aria-hidden="true" />

      <div className="intro-film__identity" aria-hidden="true">
        <span className="intro-film__wordmark">EcoScan</span>
        <span className="intro-film__identity-divider" />
        <span>Le parcours de l&apos;énergie</span>
      </div>

      <div className="intro-film__footer">
        <div className="intro-film__scene" aria-live="polite">
          <span className="intro-film__scene-number">
            {String(activeIndex + 1).padStart(2, "0")} / {String(SCENES.length).padStart(2, "0")}
          </span>
          <p key={SCENES[activeIndex].label}>{SCENES[activeIndex].label}</p>
        </div>

        <div className="intro-film__controls">
          <div className="intro-film__timeline" aria-hidden="true">
            {SCENES.map((scene, index) => (
              <span className="intro-film__segment" key={scene.src}>
                <span
                  className="intro-film__segment-progress"
                  style={{
                    transform: `scaleX(${
                      index < activeIndex ? 1 : index === activeIndex ? videoProgress : 0
                    })`,
                  }}
                />
              </span>
            ))}
          </div>
          {playbackBlocked && (
            <button
              type="button"
              className="intro-film__play"
              onClick={() => {
                const video = videoRef.current
                if (!video) return
                video.play().then(
                  () => setPlaybackBlocked(false),
                  () => setPlaybackBlocked(true),
                )
              }}
            >
              Lancer la vidéo
            </button>
          )}
          <button
            type="button"
            className="intro-film__skip"
            onClick={finishIntro}
            disabled={isExiting}
          >
            Passer l&apos;introduction
            <span aria-hidden="true">↗</span>
          </button>
        </div>
      </div>

      {mediaError && (
        <p className="intro-film__notice" role="status">
          Une séquence n&apos;a pas pu être lue. La vidéo continue.
        </p>
      )}
    </section>
  )
}
