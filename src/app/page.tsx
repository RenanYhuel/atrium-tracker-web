"use client";

import { useEffect, useState } from "react";
import "./page.css";

export default function Home() {
  // Chargement des données depuis le localStorage
  const loadFromLocalStorage = (key: string, defaultValue: unknown) => {
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : defaultValue;
  };

  const saveToLocalStorage = (key: string, value: unknown) => { // Changement de 'any' à 'unknown'
    localStorage.setItem(key, JSON.stringify(value));
  };

  // Obtenir la clé du jour actuel
  const getCurrentDateKey = () => {
    const today = new Date();
    return today.toISOString().split("T")[0]; // Format YYYY-MM-DD
  };

  // Charger les données d'un jour spécifique
  const loadDayData = (dateKey: string) => {
    const allDays = loadFromLocalStorage("targetDay", {}); // Charger tout le JSON
    return allDays[dateKey] || { hours: 0, minutes: 0 }; // Retourne les données du jour ou des valeurs par défaut
  };

  // Sauvegarder les données d'un jour spécifique
  const saveDayData = (dateKey: string, dayData: { hours: number; minutes: number }) => {
    const allDays = loadFromLocalStorage("targetDay", {}); // Charger tout le JSON
    allDays[dateKey] = dayData; // Met à jour ou ajoute les données du jour
    saveToLocalStorage("targetDay", allDays); // Sauvegarde tout le JSON
  };

  // État pour les compteurs
  const [minutesToday, setMinutesToday] = useState(0);
  const [hoursToday, setHoursToday] = useState(0);
  const [totalMinutes, setTotalMinutes] = useState(0);
  const [totalHours, setTotalHours] = useState(0);
  const [totalDays, setTotalDays] = useState(0);

  const [minutesTodayDisplayed, setMinutesTodayDisplayed] = useState(0);
  const [hoursTodayDisplayed, setHoursTodayDisplayed] = useState(0);

  // Charger les données au démarrage
  useEffect(() => {
    const dateKey = getCurrentDateKey();
    const todayData = loadDayData(dateKey); // Charger les données du jour actuel
    const allDays = loadFromLocalStorage("targetDay", {}); // Charger tout le JSON

    setMinutesToday(todayData.minutes);
    setHoursToday(todayData.hours);

    // Calcul du total
    let totalMinutes = 0;
    let totalHours = 0;
    for (const day in allDays) {
      const { hours, minutes } = allDays[day];
      totalMinutes += minutes;
      totalHours += hours;
    }

    const totalDays = Math.floor(totalHours / 24);
    totalHours %= 24;

    setTotalMinutes(totalMinutes % 60);
    setTotalHours(totalHours);
    setTotalDays(totalDays);
  }, []);

  // Mise à jour des compteurs affichés en temps réel
  useEffect(() => {
    const intervalToday = setInterval(() => {
      if (minutesTodayDisplayed < minutesToday || hoursTodayDisplayed < hoursToday) {
        let newMinutes = minutesTodayDisplayed + 1;
        let newHours = hoursTodayDisplayed;

        if (newMinutes >= 60) {
          newMinutes = 0;
          newHours += 1;
        }

        setMinutesTodayDisplayed(newMinutes);
        setHoursTodayDisplayed(newHours);
      } else if (minutesTodayDisplayed > minutesToday || hoursTodayDisplayed > hoursToday) {
        let newMinutes = minutesTodayDisplayed - 1;
        let newHours = hoursTodayDisplayed;

        if (newMinutes < 0) {
          newMinutes = 59;
          newHours -= 1;
        }

        setMinutesTodayDisplayed(newMinutes);
        setHoursTodayDisplayed(newHours);
      }
    }, 5);

    return () => clearInterval(intervalToday);
  }, [hoursToday, minutesToday, minutesTodayDisplayed, hoursTodayDisplayed]);

  // Fonction principale de mise à jour du temps (ajouter ou retirer)
  const updateTime = (timeChange: number) => {
    updateTodayTime(timeChange);
    updateTotalTime(timeChange);
  };

  // Mise à jour du temps aujourd'hui
  const updateTodayTime = (timeChange: number) => {
    const dateKey = getCurrentDateKey();
    let newMinutes = minutesToday + timeChange;
    let newHours = hoursToday;

    while (newMinutes >= 60) {
      newMinutes -= 60;
      newHours += 1;
    }

    while (newMinutes < 0) {
      newMinutes += 60;
      newHours -= 1;
    }

    setHoursToday(newHours);
    setMinutesToday(newMinutes);

    saveDayData(dateKey, { hours: newHours, minutes: newMinutes }); // Sauvegarde les données du jour
  };

  // Mise à jour du temps total
  const updateTotalTime = (timeChange: number) => {
    let newMinutes = totalMinutes + timeChange;
    let newHours = totalHours;
    let newDays = totalDays;

    while (newMinutes >= 60) {
      newMinutes -= 60;
      newHours += 1;
    }

    while (newMinutes < 0) {
      newMinutes += 60;
      newHours -= 1;
    }

    while (newHours >= 24) {
      newHours -= 24;
      newDays += 1;
    }

    while (newHours < 0) {
      newHours += 24;
      newDays -= 1;
    }

    setTotalMinutes(newMinutes);
    setTotalHours(newHours);
    setTotalDays(newDays);
  };

  return (
    <div className="home-container">
      <div className="stats">
        <h1>Temps aujourd&apos;hui</h1>
        <p className="hours">
          {hoursTodayDisplayed}h {minutesTodayDisplayed}min
        </p>
      </div>
      <div className="stats">
        <h1>Temps total</h1>
        <p className="total-hours">
          {totalDays} jours {totalHours}h {totalMinutes}min
        </p>
      </div>
      <div className="buttons">
        <button className="action-button" onClick={() => updateTime(-30)}>
          <span className="material-symbols-outlined">remove</span>
        </button>
        <button className="action-button" onClick={() => updateTime(30)}>
          <span className="material-symbols-outlined">add</span>
        </button>
      </div>
    </div>
  );
}
