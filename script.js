const bookedAppointments = [];

const doctorSlotOptions = {
    doctor1: [
        '09:00', '09:15', '09:30', '10:00', '10:15', '10:30',
    ],
    doctor2: [
        '11:00', '11:15', '11:30', '12:00', '12:15', '12:30',
    ],
    doctor3: [
        '14:00', '14:15', '14:30', '15:00', '15:15', '15:30',
    ]
};

function populateSlots() {
    const doctor = document.getElementById('doctor').value;
    const slotSelect = document.getElementById('slot');
    slotSelect.innerHTML = '';

    const slots = doctorSlotOptions[doctor] || [];
    slots.forEach(slot => {
        const option = document.createElement('option');
        option.value = slot;
        option.textContent = slot;
        slotSelect.appendChild(option);
    });
}

function bookAppointment() {
    const patientName = document.getElementById('patientName').value;
    const patientAge = document.getElementById('patientAge').value;
    const patientAddress = document.getElementById('patientAddress').value;
    const doctor = document.getElementById('doctor').value;
    const appointmentDate = document.getElementById('appointmentDate').value;
    const slot = document.getElementById('slot').value;

    const newAppointment = {
        patientName,
        patientAge,
        patientAddress,
        doctor,
        appointmentDate,
        slot
    };

    const isConflict = bookedAppointments.some(appointment =>
        appointment.doctor === doctor &&
        appointment.appointmentDate === appointmentDate &&
        appointment.slot === slot
    );

    if (isConflict) {
        showPopup('This slot is already booked. Please choose another slot.', 'error');
    } else {
        bookedAppointments.push(newAppointment);
        showPopup('Appointment booked successfully!', 'success');
        updateBookedAppointments();
        updateSlotStatus();
    }
}

function updateBookedAppointments() {
    const bookedAppointmentsList = document.getElementById('bookedAppointments');
    bookedAppointmentsList.innerHTML = '';

    bookedAppointments.forEach((appointment, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            ${appointment.appointmentDate} - ${appointment.slot} - ${appointment.doctor} with ${appointment.patientName}
            <button class="cancel-button" onclick="cancelAppointment(${index})">Cancel</button>
        `;
        bookedAppointmentsList.appendChild(li);
    });
}

function cancelAppointment(index) {
    bookedAppointments.splice(index, 1); // Remove the appointment from the array
    updateBookedAppointments(); // Refresh the displayed list
    updateSlotStatus(); // Refresh slot status
}


function updateSlotStatus() {
    const slotsStatusDiv = document.getElementById('slotsStatus');
    slotsStatusDiv.innerHTML = '';

    for (const doctor in doctorSlotOptions) {
        const doctorSlots = doctorSlotOptions[doctor];
        const doctorStatusDiv = document.createElement('div');
        doctorStatusDiv.className = 'doctor-status';
        doctorStatusDiv.innerHTML = `<h3>${doctor}</h3>`;

        doctorSlots.forEach(slot => {
            const isBooked = bookedAppointments.some(appointment =>
                appointment.doctor === doctor && appointment.slot === slot
            );

            const slotDiv = document.createElement('div');
            slotDiv.className = `slot ${isBooked ? 'booked' : 'available'}`;
            slotDiv.textContent = slot;
            slotDiv.title = isBooked ? `Booked by ${bookedAppointments.find(appointment => appointment.doctor === doctor && appointment.slot === slot).patientName}` : 'Available';
            doctorStatusDiv.appendChild(slotDiv);
        });

        slotsStatusDiv.appendChild(doctorStatusDiv);
    }
}

function showPopup(message, type) {
    const popup = document.getElementById('popup');
    const popupMessage = document.getElementById('popupMessage');
    popupMessage.textContent = message;
    popup.style.display = 'block';

    if (type === 'success') {
        popupMessage.style.color = 'green';
    } else {
        popupMessage.style.color = 'red';
    }
}

function closePopup() {
    document.getElementById('popup').style.display = 'none';
}

document.getElementById('doctor').addEventListener('change', populateSlots);
document.getElementById('doctorSearch').addEventListener('input', filterDoctors);
document.getElementById('appointmentSearch').addEventListener('input', filterAppointments);

function filterDoctors() {
    const searchInput = document.getElementById('doctorSearch').value.toLowerCase();
    const doctorCards = document.querySelectorAll('.doctor-card');

    doctorCards.forEach(card => {
        const doctorName = card.querySelector('h3').textContent.toLowerCase();
        card.style.display = doctorName.includes(searchInput) ? 'block' : 'none';
    });
}

function filterAppointments() {
    const searchInput = document.getElementById('appointmentSearch').value.toLowerCase();
    const appointmentCards = document.querySelectorAll('.appointment-card');

    appointmentCards.forEach(card => {
        const appointmentText = card.textContent.toLowerCase();
        card.style.display = appointmentText.includes(searchInput) ? 'block' : 'none';
    });
}

// Initial population of slots for the first doctor and updating appointments and slots
populateSlots();
updateBookedAppointments();
updateSlotStatus();







