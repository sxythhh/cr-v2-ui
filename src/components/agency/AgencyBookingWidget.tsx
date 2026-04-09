"use client";

import { useState, useMemo } from "react";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  isSameDay,
  isToday,
  isWeekend,
  isBefore,
  startOfDay,
  addMonths,
  subMonths,
} from "date-fns";

type Step = "info" | "calendar" | "time" | "confirmed";

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const MORNING_SLOTS = [
  "9:00 AM",
  "9:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
];
const AFTERNOON_SLOTS = [
  "12:00 PM",
  "12:30 PM",
  "1:00 PM",
  "1:30 PM",
  "2:00 PM",
  "2:30 PM",
  "3:00 PM",
  "3:30 PM",
  "4:00 PM",
  "4:30 PM",
  "5:00 PM",
];

const EASE = "cubic-bezier(0.32, 0.72, 0, 1)";

export function AgencyBookingWidget() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [agreed, setAgreed] = useState(true);
  const [step, setStep] = useState<Step>("info");
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const today = useMemo(() => startOfDay(new Date()), []);

  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const calStart = startOfWeek(monthStart);
    const calEnd = endOfWeek(monthEnd);
    return eachDayOfInterval({ start: calStart, end: calEnd });
  }, [currentMonth]);

  const handleDateSelect = (day: Date) => {
    if (isBefore(day, today) || isWeekend(day) || !isSameMonth(day, currentMonth)) return;
    setSelectedDate(day);
    setSelectedTime(null);
  };

  const handleReset = () => {
    setName("");
    setEmail("");
    setPhone("");
    setSelectedDate(null);
    setSelectedTime(null);
    setStep("info");
  };

  const canContinueInfo = name.trim().length > 0 && email.trim().length > 0 && phone.trim().length > 0 && agreed;

  const showInfo = step === "info";
  const showCalendar = step === "calendar";
  const showTime = step === "time";
  const showConfirmed = step === "confirmed";

  // Button config per step
  const buttonLabel = showInfo
    ? "Continue"
    : showCalendar
      ? "Continue"
      : showTime
        ? "Confirm"
        : null;

  const buttonDisabled = showInfo
    ? !canContinueInfo
    : showCalendar
      ? !selectedDate
      : showTime
        ? !selectedTime
        : false;

  const handleButtonClick = () => {
    if (showInfo) setStep("calendar");
    else if (showCalendar) setStep("time");
    else if (showTime) setStep("confirmed");
  };

  const handleBack = () => {
    if (showCalendar) setStep("info");
    else if (showTime) setStep("calendar");
  };

  return (
    <div className="relative flex flex-col w-full lg:max-w-[435px] overflow-hidden">
      {/* Scrollable content area */}
      <div className="relative flex-1 min-h-0">
        {/* Info step — always in flow to define base height */}
        <div
          className=""
          style={{
            opacity: showInfo ? 1 : 0,
            transform: showInfo ? "translateX(0)" : "translateX(-12px)",
            transition: `opacity 250ms ${EASE}, transform 250ms ${EASE}`,
            pointerEvents: showInfo ? "auto" : "none",
            height: showInfo ? "auto" : 0,
            overflow: showInfo ? "visible" : "hidden",
          }}
          aria-hidden={!showInfo}
        >
          <h3 className="text-[17px] font-semibold tracking-[-0.36px] text-black mb-5">
            Enter your details
          </h3>

          <div className="flex flex-col gap-3">
            <div>
              <label className="block text-[12px] font-medium text-[#69527A]/50 mb-1.5">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane"
                className="w-full h-10 px-3.5 rounded-lg text-[14px] text-[#483953] placeholder:text-[#483953]/40 bg-white border border-[rgba(87,62,105,0.13)] outline-none transition-colors [&:-webkit-autofill]:[-webkit-box-shadow:0_0_0_30px_white_inset] [&:-webkit-autofill]:[-webkit-text-fill-color:#483953]"
              />
            </div>
            <div>
              <label className="block text-[12px] font-medium text-[#69527A]/50 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jane@company.com"
                className="w-full h-10 px-3.5 rounded-lg text-[14px] text-[#483953] placeholder:text-[#483953]/40 bg-white border border-[rgba(87,62,105,0.13)] outline-none transition-colors [&:-webkit-autofill]:[-webkit-box-shadow:0_0_0_30px_white_inset] [&:-webkit-autofill]:[-webkit-text-fill-color:#483953]"
              />
            </div>
            <div>
              <label className="block text-[12px] font-medium text-[#69527A]/50 mb-1.5">Phone</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="w-full h-10 px-3.5 rounded-lg text-[14px] text-[#483953] placeholder:text-[#483953]/40 bg-white border border-[rgba(87,62,105,0.13)] outline-none transition-colors [&:-webkit-autofill]:[-webkit-box-shadow:0_0_0_30px_white_inset] [&:-webkit-autofill]:[-webkit-text-fill-color:#483953]"
              />
            </div>
          </div>

          <label className="flex items-start gap-2.5 mt-4 cursor-pointer">
            <button
              type="button"
              onClick={() => setAgreed(!agreed)}
              className={[
                "shrink-0 size-[18px] mt-[1px] rounded-[5px] flex items-center justify-center transition-colors",
                agreed
                  ? "bg-black"
                  : "bg-white border border-[rgba(87,62,105,0.13)]",
              ].join(" ")}
            >
              {agreed && <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M5 12l5 5l10-10"/></svg>}
            </button>
            <span className="text-[12px] leading-[17px] text-[#545454]/70">
              By proceeding, you agree to Content Reward&apos;s{" "}
              <span className="text-[#483953] font-medium">Terms</span> and{" "}
              <span className="text-[#483953] font-medium">Brand Policy</span>
            </span>
          </label>
        </div>

        {/* Calendar step */}
        <div
          className=""
          style={{
            opacity: showCalendar ? 1 : 0,
            transform: showCalendar ? "translateX(0)" : showInfo ? "translateX(12px)" : "translateX(-12px)",
            transition: `opacity 250ms ${EASE}, transform 250ms ${EASE}`,
            pointerEvents: showCalendar ? "auto" : "none",
            position: showCalendar ? "relative" : "absolute",
            top: showCalendar ? undefined : 0,
            left: showCalendar ? undefined : 0,
            right: showCalendar ? undefined : 0,
          }}
          aria-hidden={!showCalendar}
        >
          {/* Back + month nav */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleBack}
                className="size-8 flex items-center justify-center rounded-lg hover:bg-black/5 transition-colors active:scale-[0.98]"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-black"><path d="M15 6l-6 6l6 6"/></svg>
              </button>
              <h3 className="text-[17px] font-semibold tracking-[-0.36px] text-black">
                {format(currentMonth, "MMMM yyyy")}
              </h3>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                className="size-8 flex items-center justify-center rounded-lg hover:bg-black/5 transition-colors active:scale-[0.98]"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-black/40"><path d="M15 6l-6 6l6 6"/></svg>
              </button>
              <button
                type="button"
                onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                className="size-8 flex items-center justify-center rounded-lg hover:bg-black/5 transition-colors active:scale-[0.98]"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-black/40"><path d="M9 6l6 6l-6 6"/></svg>
              </button>
            </div>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 mb-1">
            {WEEKDAYS.map((d) => (
              <div
                key={d}
                className="text-center text-[12px] font-medium text-[#69527A]/50 py-1"
              >
                {d}
              </div>
            ))}
          </div>

          {/* Day grid */}
          <div className="grid grid-cols-7 gap-y-0.5">
            {calendarDays.map((day) => {
              const inMonth = isSameMonth(day, currentMonth);
              const past = isBefore(day, today);
              const weekend = isWeekend(day);
              const disabled = !inMonth || past || weekend;
              const selected = selectedDate && isSameDay(day, selectedDate);
              const todayMark = isToday(day);

              return (
                <button
                  key={day.toISOString()}
                  type="button"
                  disabled={disabled}
                  onClick={() => handleDateSelect(day)}
                  className={[
                    "size-10 mx-auto rounded-lg text-[14px] font-medium transition-all",
                    selected
                      ? "bg-[#69527A] text-white"
                      : todayMark && inMonth && !past && !weekend
                        ? "ring-1 ring-[#69527A]/30 text-[#69527A] hover:bg-[#69527A]/8"
                        : disabled
                          ? "text-[#69527A]/20 cursor-default"
                          : "text-[#483953] hover:bg-[#69527A]/8",
                    !disabled && !selected && "active:scale-[0.96]",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  {format(day, "d")}
                </button>
              );
            })}
          </div>
        </div>

        {/* Time step */}
        <div
          className="overflow-y-auto"
          style={{
            opacity: showTime ? 1 : 0,
            transform: showTime ? "translateX(0)" : "translateX(12px)",
            transition: `opacity 250ms ${EASE}, transform 250ms ${EASE}`,
            pointerEvents: showTime ? "auto" : "none",
            position: showTime ? "relative" : "absolute",
            top: showTime ? undefined : 0,
            left: showTime ? undefined : 0,
            right: showTime ? undefined : 0,
            maxHeight: showTime ? undefined : 0,
          }}
          aria-hidden={!showTime}
        >
          {/* Back + date header */}
          <div className="flex items-center gap-2 mb-5">
            <button
              type="button"
              onClick={handleBack}
              className="size-8 flex items-center justify-center rounded-lg hover:bg-black/5 transition-colors active:scale-[0.98]"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-black"><path d="M15 6l-6 6l6 6"/></svg>
            </button>
            <h3 className="text-[17px] font-semibold tracking-[-0.36px] text-black">
              {selectedDate ? format(selectedDate, "EEEE, MMM d") : ""}
            </h3>
          </div>

          {/* Morning slots */}
          <div className="mb-4">
            <span className="text-[12px] font-medium text-[#69527A]/50 mb-2 block">
              Morning
            </span>
            <div className="grid grid-cols-3 gap-2">
              {MORNING_SLOTS.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setSelectedTime(slot)}
                  className={[
                    "h-9 rounded-lg text-[13px] font-medium transition-all active:scale-[0.97]",
                    selectedTime === slot
                      ? "bg-[#69527A]/10 text-[#69527A] ring-1.5 ring-[#69527A]"
                      : "bg-white text-[#483953] hover:bg-[#69527A]/[0.06]",
                  ].join(" ")}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>

          {/* Afternoon slots */}
          <div>
            <span className="text-[12px] font-medium text-[#69527A]/50 mb-2 block">
              Afternoon
            </span>
            <div className="grid grid-cols-3 gap-2">
              {AFTERNOON_SLOTS.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setSelectedTime(slot)}
                  className={[
                    "h-9 rounded-lg text-[13px] font-medium transition-all active:scale-[0.97]",
                    selectedTime === slot
                      ? "bg-[#69527A]/10 text-[#69527A] ring-1.5 ring-[#69527A]"
                      : "bg-white text-[#483953] hover:bg-[#69527A]/[0.06]",
                  ].join(" ")}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Confirmed step — overlaid */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            opacity: showConfirmed ? 1 : 0,
            transform: showConfirmed ? "scale(1)" : "scale(0.98)",
            transition: `opacity 300ms ${EASE}, transform 300ms ${EASE}`,
            pointerEvents: showConfirmed ? "auto" : "none",
          }}
          aria-hidden={!showConfirmed}
        >
          <div className="flex flex-col items-center text-center gap-4 p-8">
            <div className="size-14 rounded-full bg-[#69527A]/10 flex items-center justify-center">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#69527A]"><path d="M5 12l5 5l10-10"/></svg>
            </div>
            <div>
              <h3 className="text-[20px] font-semibold tracking-[-0.4px] text-[#483953] mb-1">
                You&apos;re booked
              </h3>
              <p className="text-[14px] text-[#69527A]/70 leading-[20px]">
                {selectedDate && selectedTime
                  ? `${format(selectedDate, "EEEE, MMMM d")} at ${selectedTime}`
                  : ""}
              </p>
            </div>
            <button
              type="button"
              onClick={handleReset}
              className="text-[14px] font-medium text-[#69527A] hover:underline mt-1"
            >
              Book another time
            </button>
          </div>
        </div>
      </div>

      {/* Sticky bottom button — always visible, outside scroll */}
      {!showConfirmed && buttonLabel && (
        <div className="pt-4">
          <button
            type="button"
            disabled={buttonDisabled}
            onClick={handleButtonClick}
            className="group relative flex items-center justify-center w-full h-12 rounded-[11px] overflow-hidden bg-black active:scale-[0.98] transition-all disabled:opacity-40 disabled:pointer-events-none"
          >
            <div className="absolute inset-y-[2px] right-[2px] w-[44px] group-hover:w-[calc(100%-4px)] bg-white/[0.12] rounded-[9px] transition-[width] duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)]" />
            <span className="relative text-[15px] font-medium leading-[20px] tracking-[-0.3px] text-white">
              {buttonLabel}
            </span>
            <div className="absolute right-[2px] top-[2px] bottom-[2px] w-[44px] flex items-center justify-center rounded-[9px]">
              {showTime ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M5 12l5 5l10-10"/></svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M5 12h14"/><path d="M13 18l6-6"/><path d="M13 6l6 6"/></svg>
              )}
            </div>
          </button>
        </div>
      )}
    </div>
  );
}
