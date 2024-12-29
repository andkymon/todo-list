export const NavToggle = (function() {
    const body = document.querySelector("body");
    const nav = document.querySelector("nav");

    //Toggle doesn't work as intended without initializing this, as it starts off undefined
    body.style.gridTemplateColumns = "360px 1fr";
    nav.style.transform = "none";

    function toggle() {
        if (body.style.gridTemplateColumns === "360px 1fr") {
            body.style.gridTemplateColumns = "0px 1fr";
            nav.style.transform = "translateX(-360px)";
        } else {
            body.style.gridTemplateColumns = "360px 1fr";
            nav.style.transform = "none";
        }
    }

    function init() {
        const navToggle = document.querySelector("#nav-toggle");
        navToggle.addEventListener("click", toggle);
    }

    return {
        init
    };
})();
