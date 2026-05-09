import { useState } from "react";

function CustomSelect({ name, options, onChange, placeholder }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("");

  const handleSelect = (value) => {
    setSelected(value);
    setOpen(false);

    // fake event for handleChange
    onChange({
      target: {
        name,
        value,
      },
    });
  };

  return (
    <div className="relative">
      {/* Input Box */}
      <div
        onClick={() => setOpen(!open)}
        className="border p-3 rounded-xl cursor-pointer bg-white"
      >
        {selected || placeholder}
      </div>

      {/* Popup */}
      {open && (
        <div className="absolute z-50 mt-1 w-full bg-white border rounded-xl shadow-lg">
          {options.map((item, index) => (
            <div
              key={index}
              onClick={() => handleSelect(item)}
              className="p-3 hover:bg-pink-100 cursor-pointer"
            >
              {item}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
