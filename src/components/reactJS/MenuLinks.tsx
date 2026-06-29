import React from "react";
import {
    RiHome5Line,
    RiToolsFill,
    RiCodeSSlashLine,
    RiBriefcase2Line,
    RiMailLine
} from "react-icons/ri";

interface MenuLinksProps {
    namepage?: string;
    pathname: string;
}

interface IconLink {
    icon: React.ReactNode;
    href: string;
    label: string;
}

const MenuLinks: React.FC<MenuLinksProps> = ({ namepage, pathname }) => {
    const isActiveLink = (href: string) => {
        if (href === "/#hero") {
            return pathname === "/";
        }

        return pathname === href;
    };

    const getIconLinks = (): IconLink[] => {
        const landingLinks: IconLink[] = [
            {
                icon: <RiHome5Line size={20} />,
                href: "/#hero",
                label: "Accueil"
            },
            {
                icon: <RiToolsFill size={20} />,
                href: "/#services",
                label: "Services"
            },
            {
                icon: <RiBriefcase2Line size={20} />,
                href: "/#projects",
                label: "Projets"
            },
            {
                icon: <RiMailLine size={20} />,
                href: "/#contact",
                label: "Contact"
            }
        ];

        if (namepage === "widgetCss") {
            return [
                {
                    icon: <RiCodeSSlashLine size={20} />,
                    href: "/docs/",
                    label: "Documentation"
                },
                ...landingLinks
            ];
        }

        return landingLinks;
    };

    return (
        <ul className="menu-links-container">
            {getIconLinks().map(({ href, icon, label }) => (
                <li key={href}>
                    <a
                        aria-current={isActiveLink(href)}
                        href={href}
                        className={`menu-link-item ${isActiveLink(href) ? 'active' : ''}`}
                        title={label}
                    >
                        {icon}
                    </a>
                </li>
            ))}
        </ul>
    );
};

export default MenuLinks;
