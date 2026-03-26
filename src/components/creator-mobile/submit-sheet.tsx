function UploadArea({ hasImage }: { hasImage?: boolean }) {
  return (
    <div
      className="flex flex-col items-center gap-6 rounded-3xl py-6"
      style={{
        background: "rgba(36, 35, 31, 0.025)",
        border: "2px dashed #E6E4E1",
      }}
    >
      {hasImage ? (
        <>
          <div
            className="h-[100px] w-[100px] rounded-[20px]"
            style={{
              background: "#667677",
              border: "3px solid white",
              transform: "rotate(-5deg)",
            }}
          />
          <span className="text-[15px] font-semibold leading-[120%] tracking-[0.03em]" style={{ color: "#9D9890" }}>
            image.png
          </span>
        </>
      ) : (
        <>
          <div className="relative h-[120px] w-[172px]">
            <div
              className="absolute left-[36px] top-0 h-[100px] w-[100px] rounded-[20px]"
              style={{ background: "#00CE2A", border: "3.5px solid white" }}
            >
              <svg className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" width="36" height="36" viewBox="0 0 36 36" fill="none">
                <path d="M18 8V28M8 18H28" stroke="white" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </div>
            <div
              className="absolute left-1/2 top-[30px] h-[80px] w-[80px] -translate-x-1/2 rounded-2xl"
              style={{ background: "#FFAC00", border: "2.8px solid white" }}
            />
            <div
              className="absolute bottom-0 left-1/2 h-[60px] w-[60px] -translate-x-1/2 rounded-xl"
              style={{ background: "#0084FF", border: "2.1px solid white" }}
            />
          </div>
          <span className="text-[15px] font-semibold leading-[120%] tracking-[0.03em]" style={{ color: "#9D9890" }}>
            click to upload
          </span>
        </>
      )}
    </div>
  );
}

export function SubmitSheet({ filled }: { filled?: boolean }) {
  return (
    <div className="flex flex-col rounded-[55px] p-[34px]" style={{ background: "white", height: 836 }}>
      <div className="flex flex-col gap-[52px]">
        <div className="flex flex-col gap-[34px]">
          {/* Warning banner */}
          <div
            className="flex items-center gap-2.5 rounded-3xl px-[17px] py-4"
            style={{ background: "#FFEBC8" }}
          >
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <path d="M11 2L11 5" stroke="#FFAC00" strokeWidth="2" strokeLinecap="round" />
              <path d="M3 11L11 7L19 11V19H3V11Z" fill="#FFAC00" />
            </svg>
            <span className="flex-1 text-[18px] font-semibold leading-[120%] tracking-[0.03em]" style={{ color: "#634000" }}>
              submit within 30min of posting
            </span>
          </div>

          {/* Video link */}
          <div className="flex flex-col gap-2.5">
            <span className="text-[18px] font-semibold leading-[120%] tracking-[0.03em]" style={{ color: filled ? "#9D9890" : "#24231F" }}>
              video link
            </span>
            <div className="flex items-center rounded-3xl px-5 py-4" style={{ background: "#F7F7F6" }}>
              <span className="text-[18px] font-semibold leading-[120%] tracking-[0.03em]" style={{ color: filled ? "#24231F" : "#9D9890" }}>
                {filled ? "https://platform.com/..." : "https://platform.com/..."}
              </span>
            </div>
          </div>

          {/* Title */}
          <div className="flex flex-col gap-2.5">
            <span className="text-[18px] font-semibold leading-[120%] tracking-[0.03em]" style={{ color: filled ? "#9D9890" : "#24231F" }}>
              title
            </span>
            <div className="flex items-center rounded-3xl px-5 py-4" style={{ background: "#F7F7F6" }}>
              <span className="text-[18px] font-semibold leading-[120%] tracking-[0.03em]" style={{ color: filled ? "#24231F" : "#9D9890" }}>
                {filled ? "cool clip title" : "my lemon squeeze video"}
              </span>
            </div>
          </div>

          {/* Demographics upload */}
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2.5">
              <span className="text-[18px] font-semibold leading-[120%] tracking-[0.03em]" style={{ color: "#24231F" }}>
                audience demographics screenshot
              </span>
              <p className="text-[15px] font-medium leading-[160%] tracking-[0.03em]" style={{ color: "#6E6A5E" }}>
                upload a screenshot from your platform&apos;s analytics showing audience demographics (age, gender, etc)
              </p>
            </div>
            <UploadArea hasImage={filled} />
          </div>

          {/* Agreement + Submit */}
          <div className="flex flex-col gap-[17px]">
            <div className="flex items-center gap-2.5">
              {filled ? (
                <div className="flex h-5 w-5 items-center justify-center rounded-[7px]" style={{ background: "#24231F" }}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M6 10L9 13L14 7" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              ) : (
                <div className="h-5 w-5 rounded-[7px]" style={{ border: "2.5px solid #CDC8C2" }} />
              )}
              <span className="text-[18px] font-semibold leading-[120%] tracking-[0.03em]" style={{ color: filled ? "#6E6A5E" : "#9D9890" }}>
                i agree to the campaign requirements
              </span>
            </div>

            <div
              className="flex h-14 items-center justify-center rounded-3xl"
              style={{ background: filled ? "#24231F" : "#D6D4D2" }}
            >
              <span className="text-[18px] font-semibold leading-[120%] tracking-[0.025em] text-white">
                submit video
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
