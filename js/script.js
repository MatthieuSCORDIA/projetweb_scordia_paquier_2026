"use strict";

document.addEventListener("DOMContentLoaded", () => {
  menuBurger();
  carouselAccueil();
  animationScrollSimple();
  chargerDonneesJson();
  validerFormulaireContact();
});

function menuBurger() {
  const burgerBtn = document.getElementById("burgerBtn");
  const mainNav = document.getElementById("mainNav");

  if (burgerBtn && mainNav) {
    burgerBtn.addEventListener("click", function () {
      if (mainNav.classList.contains("open")) {
        mainNav.classList.remove("open");
        burgerBtn.setAttribute("aria-expanded", "false");
      } else {
        mainNav.classList.add("open");
        burgerBtn.setAttribute("aria-expanded", "true");
      }
    });
  }
}

function carouselAccueil() {
  const carousel = document.querySelector("[data-carousel]");
  if (!carousel) {
    return;
  }

  const slides = carousel.querySelectorAll(".slide");
  const prevBtn = carousel.querySelector('[data-action="prev"]');
  const nextBtn = carousel.querySelector('[data-action="next"]');
  let currentIndex = 0;
  let autoSlide = null;

  function showSlide(index) {
    let i = 0;
    while (i < slides.length) {
      if (i === index) {
        slides[i].classList.add("active");
      } else {
        slides[i].classList.remove("active");
      }
      i++;
    }
  }

  function slideSuivante() {
    currentIndex = (currentIndex + 1) % slides.length;
    showSlide(currentIndex);
  }

  function slidePrecedente() {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    showSlide(currentIndex);
  }

  function relancerAutoSlide() {
    clearInterval(autoSlide);
    autoSlide = setInterval(slideSuivante, 5000);
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", function () {
      slidePrecedente();
      relancerAutoSlide();
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener("click", function () {
      slideSuivante();
      relancerAutoSlide();
    });
  }

  showSlide(currentIndex);
  relancerAutoSlide();
}

function animationScrollSimple() {
  const revealEls = document.querySelectorAll(".reveal");
  if (!revealEls.length) {
    return;
  }

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      function (entries) {
        let i = 0;
        while (i < entries.length) {
          if (entries[i].isIntersecting) {
            entries[i].target.classList.add("visible");
            observer.unobserve(entries[i].target);
          }
          i++;
        }
      },
      { threshold: 0.2 }
    );

    let j = 0;
    while (j < revealEls.length) {
      observer.observe(revealEls[j]);
      j++;
    }
  } else {
    let k = 0;
    while (k < revealEls.length) {
      revealEls[k].classList.add("visible");
      k++;
    }
  }
}

function chargerDonneesJson() {
  const formationsBody = document.getElementById("formationsTableBody");
  const agendaContainer = document.getElementById("agendaContainer");

  if (!formationsBody && !agendaContainer) {
    return;
  }

  const donneesParDefaut = {
    formations: [
      { cycle: "Bachelor", module: "Algorithmique et Structures de Donnees", periode: "Semestre 1", volumeHoraire: "42h" },
      { cycle: "Bachelor", module: "Developpement Web Front-end", periode: "Semestre 2", volumeHoraire: "48h" },
      { cycle: "Bachelor", module: "Bases de Donnees SQL", periode: "Semestre 2", volumeHoraire: "36h" },
      { cycle: "Cycle Ingenieur", module: "Architecture Logicielle Avancee", periode: "Semestre 5", volumeHoraire: "40h" },
      { cycle: "Cycle Ingenieur", module: "Cybersecurite et Pentest", periode: "Semestre 6", volumeHoraire: "38h" },
      { cycle: "Cycle Ingenieur", module: "Intelligence Artificielle appliquee", periode: "Semestre 7", volumeHoraire: "44h" }
    ],
    permanences: [
      { jour: "Lundi", horaire: "10:00 - 12:00", enseignant: "Pr. Legrand", salle: "B-204" },
      { jour: "Mardi", horaire: "14:00 - 16:00", enseignant: "Pr. Morel", salle: "C-117" },
      { jour: "Mercredi", horaire: "09:00 - 11:00", enseignant: "Pr. Bernard", salle: "A-310" },
      { jour: "Jeudi", horaire: "13:30 - 15:30", enseignant: "Pr. Dubois", salle: "D-122" },
      { jour: "Vendredi", horaire: "11:00 - 13:00", enseignant: "Pr. Garcia", salle: "E-210" }
    ]
  };

  function afficherDonnees(data) {
    if (formationsBody) {
      remplirTableauFormations(formationsBody, data.formations);
    }
    if (agendaContainer) {
      remplirAgenda(agendaContainer, data.permanences);
    }
  }

  fetch("media/json/data.json")
    .then(function (response) {
      if (!response.ok) {
        throw new Error("Erreur de lecture du fichier JSON");
      }
      return response.json();
    })
    .then(afficherDonnees)
    .catch(function () {
      afficherDonnees(donneesParDefaut);
    });
}

function remplirTableauFormations(tbody, formations) {
  if (!formations || formations.length === 0) {
    tbody.innerHTML = "<tr><td colspan=\"4\">Aucune formation disponible.</td></tr>";
    return;
  }

  let html = "";
  let i = 0;
  while (i < formations.length) {
    html += "<tr>";
    html += "<td>" + securiserTexte(formations[i].cycle) + "</td>";
    html += "<td>" + securiserTexte(formations[i].module) + "</td>";
    html += "<td>" + securiserTexte(formations[i].periode) + "</td>";
    html += "<td>" + securiserTexte(formations[i].volumeHoraire) + "</td>";
    html += "</tr>";
    i++;
  }
  tbody.innerHTML = html;
}

function remplirAgenda(container, permanences) {
  if (!permanences || permanences.length === 0) {
    container.innerHTML = "<p>Aucune permanence disponible.</p>";
    return;
  }

  let html = "";
  let i = 0;
  while (i < permanences.length) {
    html += "<article class=\"agenda-item\">";
    html += "<h3>" + securiserTexte(permanences[i].jour) + "</h3>";
    html += "<p><strong>Horaire :</strong> " + securiserTexte(permanences[i].horaire) + "</p>";
    html += "<p><strong>Enseignant :</strong> " + securiserTexte(permanences[i].enseignant) + "</p>";
    html += "<p><strong>Salle :</strong> " + securiserTexte(permanences[i].salle) + "</p>";
    html += "</article>";
    i++;
  }
  container.innerHTML = html;
}

function validerFormulaireContact() {
  const form = document.getElementById("contactForm");
  if (!form) {
    return;
  }

  const nom = document.getElementById("nom");
  const email = document.getElementById("email");
  const message = document.getElementById("message");
  const feedback = document.getElementById("formFeedback");

  const nomError = document.getElementById("nomError");
  const emailError = document.getElementById("emailError");
  const messageError = document.getElementById("messageError");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    let isValid = true;

    nomError.textContent = "";
    emailError.textContent = "";
    messageError.textContent = "";
    feedback.textContent = "";

    if (!nom.value.trim()) {
      nomError.textContent = "Le nom est obligatoire.";
      isValid = false;
    } else if (nom.value.trim().length < 2) {
      nomError.textContent = "Le nom doit contenir au moins 2 caracteres.";
      isValid = false;
    }

    if (!email.value.trim()) {
      emailError.textContent = "L'email est obligatoire.";
      isValid = false;
    } else if (!emailRegex.test(email.value.trim())) {
      emailError.textContent = "Veuillez saisir une adresse email valide.";
      isValid = false;
    }

    if (!message.value.trim()) {
      messageError.textContent = "Le message est obligatoire.";
      isValid = false;
    } else if (message.value.trim().length < 10) {
      messageError.textContent = "Le message doit contenir au moins 10 caracteres.";
      isValid = false;
    }

    if (!isValid) {
      feedback.textContent = "Le formulaire contient des erreurs.";
      feedback.style.color = "#ffb3b3";
      return;
    }

    feedback.textContent = "Message envoye avec succes.";
    feedback.style.color = "#81ecec";
    form.reset();
  });
}

function securiserTexte(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
