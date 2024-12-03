"use client";

import { useState, useEffect } from "react";
import "./home.css";

type Period = {
  date: string;
  startTime: string;
  endTime: string;
  mood: string;
  category: string;
  focusLevel?: number;
  notes: string;
};

export default function Home() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [hoursTodayDisplayed, setHoursTodayDisplayed] = useState(0);
  const [minutesTodayDisplayed, setMinutesTodayDisplayed] = useState(0);

  // Période, humeur, catégorie, focusLevel, et notes
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [mood, setMood] = useState("");
  const [category, setCategory] = useState("");
  const [focusLevel, setFocusLevel] = useState(5);
  const [notes, setNotes] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Function to format numbers
  const format = (num: number) => (num < 10 ? `0${num}` : num);

  // Calculate initial time values from localStorage
  const calculateInitialTime = () => {
    const periods = JSON.parse(localStorage.getItem("periods") as string) || [];
    let totalMinutes = 0;
    const todayDate = new Date().toLocaleDateString("fr-FR");

    periods.forEach((period: Period) => {
      if (period.date === todayDate) {
        const timeStart = new Date(`1970-01-01T${period.startTime}:00`);
        const timeEnd = new Date(`1970-01-01T${period.endTime}:00`);
        totalMinutes += ((timeEnd as unknown as number) - (timeStart as unknown as number)) / 60000; // Convert ms to minutes
      }
    });

    const totalHours = Math.floor(totalMinutes / 60);
    const remainingMinutes = totalMinutes % 60;

    return { totalHours, remainingMinutes };
  };

  const [hoursToday, setHoursToday] = useState(0);
  const [minutesToday, setMinutesToday] = useState(0);

  useEffect(() => {
    const { totalHours, remainingMinutes } = calculateInitialTime();
    setHoursToday(totalHours);
    setMinutesToday(remainingMinutes);
  }, []);

  // Toggle popup
  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
    setErrorMessage("");
  };

  // Update time dynamically
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
      }
    }, 5); // Adjust the speed of the animation

    return () => clearInterval(intervalToday);
  }, [hoursToday, minutesToday, minutesTodayDisplayed, hoursTodayDisplayed]);

  // Save period to localStorage
  const savePeriod = () => {
    if (!startTime || !endTime || !mood || !category) {
      setErrorMessage("Veuillez remplir tous les champs.");
      return;
    }

    const timeStart = new Date(`1970-01-01T${startTime}:00`);
    const timeEnd = new Date(`1970-01-01T${endTime}:00`);

    if (timeStart >= timeEnd) {
      setErrorMessage("L'heure de début doit être inférieure à l'heure de fin.");
      return;
    }

    const newPeriod = {
      date: new Date().toLocaleDateString("fr-FR"),
      startTime,
      endTime,
      mood,
      category,
      focusLevel: category === "travail" ? focusLevel : undefined,
      notes,
    };

    const periodsString = localStorage.getItem("periods");
    const periods = periodsString ? JSON.parse(periodsString) : [];
    periods.push(newPeriod);

    localStorage.setItem("periods", JSON.stringify(periods));
    togglePopup();
    setCategory("")
    setFocusLevel(5)
    setMood("")
    setNotes("")
    setStartTime("")
    setEndTime("")
    const { totalHours, remainingMinutes } = calculateInitialTime();
    setHoursToday(totalHours);
    setMinutesToday(remainingMinutes);
    
  };

  // Get current date
  const today = new Date();
  const options = {
    weekday: "long" as const, // Utiliser "long" pour obtenir le nom complet du jour
    year: "numeric" as const,
    month: "long" as const, // "long" affichera "Novembre" avec une majuscule
    day: "numeric" as const
  };
  const currentDate = today.toLocaleDateString("fr-FR", options)
    .replace(/^(.)/, (c) => c.toUpperCase()) // Mettre la première lettre en majuscule pour le jour
    .replace(/(\s\w)/g, (c) => c.toUpperCase());

  // Generate calendar with aligned days of the week
  const generateCalendar = () => {
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    const firstDayOfWeek = new Date(today.getFullYear(), today.getMonth(), 1).getDay();

    const weekdays = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
    const calendar = [];

    // Add weekday headers
    weekdays.forEach((day) => {
      calendar.push(<div key={day} className="calendar-day weekday-header">{day}</div>);
    });

    // Add empty days before the first day of the month
    for (let i = 1; i < (firstDayOfWeek === 0 ? 7 : firstDayOfWeek); i++) {
      calendar.push(<div key={`empty-${i}`} className="calendar-day"></div>);
    }

    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      const isToday = i === today.getDate();
      calendar.push(
        <div key={i} className={`calendar-day ${isToday ? "current-day" : ""}`}>
          {i}
        </div>
      );
    }

    return calendar;
  };

  return (
    <>
      <div className={`home-container ${isPopupOpen ? "blur-background" : ""}`}>
        <div className="stats">
          <h1>Aujourd&apos;hui nous sommes le</h1>
          <p className="hours">{currentDate}</p>
          <p className="time-info">
            Temps de la journée : {format(hoursTodayDisplayed)}h {format(minutesTodayDisplayed)}min
          </p>
        </div>

        <div className="calendar">{generateCalendar()}</div>

        <div className="buttons">
          <button className="action-button" onClick={togglePopup}>
            Créer une période
          </button>
        </div>
      </div>
      {isPopupOpen && (
        <div className="popup">
          <div className="popup-content">
            <h2>Créer une période</h2>

            {errorMessage && <p className="error-message">{errorMessage}</p>}

            <div className="time-fields">
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                placeholder="De quelle heure à quelle heure"
              />
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                placeholder="De quelle heure à quelle heure"
              />
            </div>

            <div className="mood-category">
              <select value={mood} onChange={(e) => setMood(e.target.value)}>
                <option value="" disabled>Choisissez votre humeur</option>
                <option value="heureux">Heureux</option>
                <option value="triste">Triste</option>
                <option value="stressé">Stressé</option>
                <option value="calme">Calme</option>
                <option value="fatigué">Fatigué</option>
              </select>

              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="" disabled>Choisissez la catégorie</option>
                <option value="loisirs">Loisirs</option>
                <option value="travail">Travail</option>
                <option value="études">Études</option>
                <option value="pause">Pause</option>
              </select>
            </div>

            {category === "travail" && (
              <div className="focus-level">
                <label>Focus Level</label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={focusLevel}
                  onChange={(e) => setFocusLevel(Number(e.target.value))}
                />
                <span>{focusLevel}</span>
              </div>
            )}

            <div className="notes">
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Notes"
              ></textarea>
            </div>

            <div className="buttons btn-pop">
              <button onClick={togglePopup} className="close-button">Fermer</button>
              <button className="open-button" onClick={savePeriod}>
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
