import Swal from "sweetalert2";

export const showToast = (type, title) => {
  return Swal.fire({
    toast: true,
    position: "top-end",
    icon: type, // success | error | warning | info
    title,
    showConfirmButton: false,
    timer: 2500,
    timerProgressBar: true,
  });
};