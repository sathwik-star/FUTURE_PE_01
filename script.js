const menuButton = document.querySelector(".menu-button");
const nav = document.querySelector(".nav");
const modal = document.querySelector("#bookingModal");
const openBookingButtons = document.querySelectorAll("[data-open-booking]");
const closeModalButton = document.querySelector(".close-modal");
const scrollBookingButton = document.querySelector("[data-scroll-booking]");
const bookingForm = document.querySelector("#bookingForm");
const formStatus = document.querySelector(".form-status");

const openModal = () => {
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
};

const closeModal = () => {
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
};

menuButton.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("is-open");
  menuButton.setAttribute("aria-expanded", String(isOpen));
});

document.querySelectorAll(".nav a").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("is-open");
    menuButton.setAttribute("aria-expanded", "false");
  });
});

openBookingButtons.forEach((button) => {
  button.addEventListener("click", openModal);
});

closeModalButton.addEventListener("click", closeModal);

modal.addEventListener("click", (event) => {
  if (event.target === modal) {
    closeModal();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeModal();
  }
});

scrollBookingButton.addEventListener("click", () => {
  closeModal();
  document.querySelector("#booking").scrollIntoView({ behavior: "smooth", block: "start" });
});

bookingForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!bookingForm.checkValidity()) {
    bookingForm.reportValidity();
    return;
  }

  const data = new FormData(bookingForm);
  const message = [
    "Hello Aura Glow Beauty Studio, I would like to book an appointment.",
    `Name: ${data.get("name")}`,
    `Mobile: ${data.get("phone")}`,
    `Service: ${data.get("service")}`,
    `Preferred date: ${data.get("date")}`,
    `Message: ${data.get("message") || "No extra message"}`
  ].join("\n");

  formStatus.textContent = "Your enquiry is ready. WhatsApp will open now.";
  window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank", "noopener");
});
