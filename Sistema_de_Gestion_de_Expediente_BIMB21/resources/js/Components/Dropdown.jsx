import { useState, useEffect, useRef } from "react";

export default function Dropdown({
    align = "right",
    width = "48",
    contentClasses = "py-1 bg-white",
    children,
}) {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setOpen(false);
            }
        };

        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, []);

    const widthClass =
        {
            48: "w-48",
            96: "w-96",
        }[width.toString()] || "w-48";

    const alignmentClasses =
        align === "right"
            ? "dropdown-menu-end"
            : align === "left"
              ? "dropdown-menu-start"
              : "";

    return (
        <div className="dropdown" ref={dropdownRef}>
            {children[0]}

            {open && (
                <div
                    className={`dropdown-menu show ${alignmentClasses} ${contentClasses} shadow`}
                    style={{
                        position: "absolute",
                        inset: "0px auto auto 0px",
                        margin: 0,
                        transform: "translate(0px, 40px)",
                    }}
                >
                    {children[1]}
                </div>
            )}
        </div>
    );
}

Dropdown.Trigger = function DropdownTrigger({ children, ...props }) {
    return (
        <button
            {...props}
            className="dropdown-toggle"
            onClick={(e) => {
                e.stopPropagation();
                const dropdown = e.currentTarget.closest(".dropdown");
                const menu = dropdown.querySelector(".dropdown-menu");
                menu.classList.toggle("show");
            }}
        >
            {children}
        </button>
    );
};

Dropdown.Content = function DropdownContent({ children, ...props }) {
    return <div {...props}>{children}</div>;
};

Dropdown.Link = function DropdownLink({
    href,
    method = "get",
    as = "a",
    children,
    ...props
}) {
    const Tag = as === "button" ? "button" : "a";

    return (
        <Tag
            href={href}
            {...props}
            className="dropdown-item d-flex align-items-center"
            onClick={(e) => {
                if (as === "button" && method === "post") {
                    e.preventDefault();
                    // Aquí iría la lógica para enviar un formulario POST
                }
            }}
        >
            {children}
        </Tag>
    );
};
