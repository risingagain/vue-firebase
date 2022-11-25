/**
 * Helper utils methods.
 *
 * @author DocTiger
 */

import Swal from "sweetalert2"

export const showSuccess = (message) => {
    Swal.fire({
        title: 'Success',
        text: message,
        icon: 'success',
        confirmButtonText: 'Ok'
    }).then(() => {
    })
}

export const showError = (message) => {
    Swal.fire({
        title: 'Error',
        text: message,
        icon: 'error',
        confirmButtonText: 'Ok'
    }).then(() => {
    })
}