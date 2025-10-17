import { useRef, useEffect } from "react";

interface NumericInputProps {
  id?: string;
  value: string; // Raw unformatted value
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  prefix?: string;
  suffix?: string;
}

export function NumericInput({
  id,
  value,
  onChange,
  placeholder = "0",
  className = "",
  prefix,
  suffix,
}: NumericInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const cursorPositionRef = useRef<number | null>(null);
  const previousValueRef = useRef<string>("");

  // Format the value for display
  const formatValue = (val: string): string => {
    if (!val) return "";
    const num = parseFloat(val);
    if (isNaN(num)) return "";
    return num.toLocaleString("en-ZA");
  };

  // Set cursor position based on character position in formatted string
  const setCursorPosition = (input: HTMLInputElement, position: number) => {
    requestAnimationFrame(() => {
      input.setSelectionRange(position, position);
    });
  };

  // Restore cursor position after formatting
  useEffect(() => {
    if (
      inputRef.current &&
      cursorPositionRef.current !== null &&
      document.activeElement === inputRef.current
    ) {
      setCursorPosition(inputRef.current, cursorPositionRef.current);
      cursorPositionRef.current = null;
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target;
    const cursorPos = input.selectionStart || 0;
    const oldFormattedValue = previousValueRef.current;
    const newFormattedValue = input.value;

    // Remove all non-numeric characters except the first decimal point
    let rawValue = newFormattedValue.replace(/[^0-9.]/g, "");

    // Handle multiple decimal points (keep only the first one)
    const parts = rawValue.split(".");
    if (parts.length > 2) {
      rawValue = parts[0] + "." + parts.slice(1).join("");
    }

    // Don't allow values that start with decimal point (add 0)
    if (rawValue.startsWith(".")) {
      rawValue = "0" + rawValue;
    }

    // Calculate new cursor position
    // Count how many characters (including separators) should be before the cursor
    const oldValue = value || "";
    const oldDigits = oldValue.replace(/[^0-9]/g, "");
    const newDigits = rawValue.replace(/[^0-9]/g, "");

    // Count digits before cursor in the current input
    const digitsBeforeCursor = newFormattedValue
      .substring(0, cursorPos)
      .replace(/[^0-9]/g, "").length;

    // Format the new value to see where separators will be
    const formatted = formatValue(rawValue);

    // Find the position in formatted string that has the same number of digits before it
    let targetPos = 0;
    let digitCount = 0;
    for (let i = 0; i < formatted.length; i++) {
      if (digitCount >= digitsBeforeCursor) {
        targetPos = i;
        break;
      }
      if (/[0-9]/.test(formatted[i])) {
        digitCount++;
      }
      targetPos = i + 1;
    }

    cursorPositionRef.current = targetPos;
    previousValueRef.current = formatted;

    onChange(rawValue);
  };

  const displayValue = formatValue(value);
  previousValueRef.current = displayValue;

  return (
    <div className="relative">
      {prefix && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
          {prefix}
        </span>
      )}
      <input
        ref={inputRef}
        type="text"
        inputMode="decimal"
        id={id}
        value={displayValue}
        onChange={handleChange}
        placeholder={placeholder}
        className={
          className ||
          `w-full ${prefix ? "pl-8" : "pl-4"} ${suffix ? "pr-8" : "pr-4"} py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none transition`
        }
      />
      {suffix && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
          {suffix}
        </span>
      )}
    </div>
  );
}
